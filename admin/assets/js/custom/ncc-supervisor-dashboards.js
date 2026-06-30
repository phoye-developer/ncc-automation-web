"use strict";

var KTNCSSupervisorDashboards = function () {
    var chartStore = {};
    var state = {
        session: null,
        data: null,
        eventCount: 0,
        hasReceivedStats: false,
        hasRaisedInitialAlert: false,
        disconnectAlertTimer: null,
        firstStatsWarningTimer: null,
        firstStatsTimer: null,
        connectionAttempt: 0,
        reconnectAttempts: 0,
        stompClient: null,
        reconnectTimer: null,
        liveTable: null,
        ignoreNextClose: false,
        initialFilters: {
            media: "",
            state: ""
        }
    };

    var reconnectDelays = [3000, 5000, 10000, 15000];
    var longDisconnectThresholdMs = 15000;
    var firstStatsWarningTimeoutMs = 20000;
    var firstStatsTimeoutMs = 60000;
    var sessionStorageKeyPrefix = "nccSupervisorDashboardCache:";
    var consolePrefix = "[NCC Live]";

    function logInfo(message, details) {
        if (typeof console === "undefined" || typeof console.info !== "function") {
            return;
        }

        if (typeof details === "undefined") {
            console.info(consolePrefix, message);
            return;
        }

        console.info(consolePrefix, message, details);
    }

    function logWarn(message, details) {
        if (typeof console === "undefined" || typeof console.warn !== "function") {
            return;
        }

        if (typeof details === "undefined") {
            console.warn(consolePrefix, message);
            return;
        }

        console.warn(consolePrefix, message, details);
    }

    function logError(message, details) {
        if (typeof console === "undefined" || typeof console.error !== "function") {
            return;
        }

        if (typeof details === "undefined") {
            console.error(consolePrefix, message);
            return;
        }

        console.error(consolePrefix, message, details);
    }

    function getSessionLogDetails(session) {
        if (!session) {
            return null;
        }

        return {
            endpoint: session.endpoint,
            destination: session.destination,
            tenantId: session.cookies ? session.cookies.tenantId : "",
            username: session.cookies ? session.cookies.username : "",
            nccUserId: session.cookies ? session.cookies.nccUserId : ""
        };
    }

    function getErrorLogDetails(error) {
        if (!error) {
            return null;
        }

        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack
            };
        }

        return error;
    }

    function parseCookies() {
        var cookieMap = {};
        decodeURIComponent(document.cookie || "").split(";").map(function (cookie) {
            return cookie.trim();
        }).filter(function (cookie) {
            return cookie !== "";
        }).forEach(function (cookie) {
            var separatorIndex = cookie.indexOf("=");
            if (separatorIndex === -1) {
                return;
            }

            var key = cookie.substring(0, separatorIndex);
            var value = cookie.substring(separatorIndex + 1);
            cookieMap[key] = value;
        });

        return cookieMap;
    }

    function deriveEventRelayUrl(nccLocation) {
        var locationUrl = new URL(nccLocation);
        var protocol = locationUrl.protocol === "http:" ? "ws:" : "wss:";
        var eventRelayHost = "ws-" + locationUrl.hostname;
        if (locationUrl.port) {
            eventRelayHost += ":" + locationUrl.port;
        }

        return protocol + "//" + eventRelayHost + "/event-relay/websocket";
    }

    function getSession() {
        var cookies = parseCookies();
        var requiredKeys = ["nccLocation", "nccToken", "tenantId", "nccUserId"];
        var missingKeys = requiredKeys.filter(function (key) {
            return !cookies[key];
        });

        if (missingKeys.length > 0) {
            return {
                valid: false,
                missingKeys: missingKeys,
                cookies: cookies
            };
        }

        return {
            valid: true,
            cookies: cookies,
            endpoint: deriveEventRelayUrl(cookies.nccLocation),
            destination: "/topic/" + cookies.tenantId + "/stats/" + cookies.nccUserId,
            cacheKey: sessionStorageKeyPrefix + [
                cookies.nccLocation,
                cookies.tenantId,
                cookies.nccUserId,
                cookies.username || ""
            ].join("|")
        };
    }

    function safeSessionStorageGet(key) {
        try {
            return window.sessionStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSessionStorageSet(key, value) {
        try {
            window.sessionStorage.setItem(key, value);
        } catch (error) {
            return;
        }
    }

    function safeSessionStorageRemove(key) {
        try {
            window.sessionStorage.removeItem(key);
        } catch (error) {
            return;
        }
    }

    function cacheDashboardState() {
        if (!state.session || !state.session.cacheKey || !state.data) {
            return;
        }

        safeSessionStorageSet(state.session.cacheKey, JSON.stringify({
            cachedAt: Date.now(),
            data: state.data
        }));
    }

    function restoreCachedDashboardState() {
        if (!state.session || !state.session.cacheKey) {
            return false;
        }

        var cachedValue = safeSessionStorageGet(state.session.cacheKey);
        if (!cachedValue) {
            return false;
        }

        try {
            var payload = JSON.parse(cachedValue);
            if (!payload || !payload.data) {
                return false;
            }

            state.data = payload.data;
            updateTelemetry();
            renderDashboards();
            updateConnectionUi("connecting", "Showing cached dashboard data while the live feed reconnects.");
            return true;
        } catch (error) {
            safeSessionStorageRemove(state.session.cacheKey);
            return false;
        }
    }

    function requestStatsFilterActivation(reason, onComplete) {
        var callback = typeof onComplete === "function" ? onComplete : function () {};

        if (!state.session || !state.session.cookies) {
            logWarn("Skipping stats-filter activation because session context is missing.", {
                reason: reason
            });
            callback(false);
            return;
        }

        var xhr = new XMLHttpRequest();
        var payload = JSON.stringify({
            campaigns: 1,
            outboundlists: 1,
            queues: 1,
            users: 1,
            workitems: 1
        });

        xhr.withCredentials = true;
        xhr.open("POST", state.session.cookies.nccLocation + "/users/api/stats/filter", true);
        xhr.setRequestHeader("Authorization", state.session.cookies.nccToken);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            var succeeded = xhr.status >= 200 && xhr.status < 300;

            if (succeeded) {
                logInfo("Stats-filter activation succeeded.", {
                    reason: reason,
                    status: xhr.status
                });
            } else {
                logWarn("Stats-filter activation returned a non-success status.", {
                    reason: reason,
                    status: xhr.status,
                    responseText: xhr.responseText || ""
                });
            }

            callback(succeeded);
        };

        xhr.onerror = function () {
            logError("Stats-filter activation request failed.", {
                reason: reason,
                status: xhr.status
            });
            callback(false);
        };

        logInfo("Posting stats-filter activation.", {
            reason: reason,
            location: state.session.cookies.nccLocation
        });
        xhr.send(payload);
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function objectValues(source) {
        if (!source || typeof source !== "object") {
            return [];
        }

        return Object.keys(source).map(function (key) {
            return source[key];
        });
    }

    function isActiveWorkitem(workitem) {
        return !!(workitem && workitem.state && String(workitem.state).toLowerCase() === "active");
    }

    function getWorkitemMedia(workitem) {
        return workitem.originalType || workitem.type || "Unknown";
    }

    function getWorkitemState(workitem) {
        return workitem.state || workitem.originalState || "Unknown";
    }

    function getWorkitemQueue(workitem) {
        if (workitem.queues && workitem.queues.length > 0) {
            return workitem.queues[0];
        }

        return workitem.latestQueueId || "--";
    }

    function getCustomerIntentMarkup(workitem) {
        var schemaFields = workitem.schemaFields || {};
        var customer = schemaFields.actualName || schemaFields.name || "--";
        var intent = schemaFields.intent || "--";

        return "<div class=\"d-flex flex-column\">"
            + "<span class=\"text-gray-900\">" + escapeHtml(customer) + "</span>"
            + "<span class=\"text-muted fs-8\">" + escapeHtml(intent) + "</span>"
            + "</div>";
    }

    function formatDuration(milliseconds) {
        var duration = Number(milliseconds || 0);
        if (duration <= 0) {
            return "0s";
        }

        var totalSeconds = Math.floor(duration / 1000);
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;
        var parts = [];

        if (hours > 0) {
            parts.push(hours + "h");
        }

        if (minutes > 0 || hours > 0) {
            parts.push(minutes + "m");
        }

        parts.push(seconds + "s");
        return parts.join(" ");
    }

    function formatCount(value) {
        return Number(value || 0).toLocaleString();
    }

    function formatPercent(ratio) {
        return (Number(ratio || 0) * 100).toFixed(1) + "%";
    }

    function formatDecimal(value) {
        return Number(value || 0).toFixed(1);
    }

    function formatTimestamp(timestamp) {
        if (!timestamp) {
            return "Waiting for live data";
        }

        return new Date(timestamp).toLocaleTimeString();
    }

    function countBy(items, keyGetter) {
        return items.reduce(function (counts, item) {
            var key = keyGetter(item) || "Unknown";
            counts[key] = (counts[key] || 0) + 1;
            return counts;
        }, {});
    }

    function countsToData(counts, orderedCategories) {
        var seen = {};
        var keys = [];

        (orderedCategories || []).forEach(function (key) {
            if (seen[key]) {
                return;
            }

            seen[key] = true;
            keys.push(key);
        });

        Object.keys(counts).sort().forEach(function (key) {
            if (seen[key]) {
                return;
            }

            seen[key] = true;
            keys.push(key);
        });

        return keys.map(function (key) {
            return {
                category: key,
                value: Number(counts[key] || 0)
            };
        });
    }

    function mergeCountsWithCategories(counts, orderedCategories) {
        return (orderedCategories || []).reduce(function (merged, key) {
            merged[key] = Number(counts[key] || 0);
            return merged;
        }, {});
    }

    function getQueueStaffingCategories() {
        return ["LoggedIn", "Available", "Working", "Busy", "Wrapup", "No Answer"];
    }

    function getAgentStatusCategories() {
        return ["Available", "Working", "Busy", "Wrapup", "No Answer", "Logged In", "Logged Out"];
    }

    function sum(items, valueGetter) {
        return items.reduce(function (total, item) {
            return total + Number(valueGetter(item) || 0);
        }, 0);
    }

    function campaignHasActivity(campaign) {
        var numericKeys = [
            "completed",
            "callbacks",
            "callbacksNow",
            "currentLeadsDialed",
            "availableAgents",
            "loggedAgents",
            "maxWaitTime",
            "dialRatio"
        ];

        return numericKeys.some(function (key) {
            return Number(campaign[key] || 0) > 0;
        });
    }

    function normalizeRatio(value) {
        var ratio = Number(value || 0);
        if (ratio > 1) {
            ratio = ratio / 100;
        }

        return ratio;
    }

    function getCampaignCompletionRatio(campaign) {
        return normalizeRatio(campaign.percentageDone);
    }

    function getAgentDerivedStatus(user) {
        var orderedStatuses = ["available", "working", "busy", "wrapup", "noAnswer", "loggedIn"];
        var statuses = user && user.statuses ? user.statuses : {};
        var currentDuration = Number(user && user.statusDuration || 0);
        var closestStatus = "";
        var closestDelta = Number.POSITIVE_INFINITY;

        if (currentDuration > 0) {
            for (var index = 0; index < orderedStatuses.length; index += 1) {
                var key = orderedStatuses[index];
                var duration = Number((statuses[key] || {}).duration || 0);
                if (duration <= 0) {
                    continue;
                }

                var delta = Math.abs(duration - currentDuration);
                if (delta < closestDelta) {
                    closestDelta = delta;
                    closestStatus = key;
                }
            }

            if (closestStatus) {
                return closestStatus;
            }
        }

        if (Number((statuses.loggedOut || {}).duration || 0) > 0 && currentDuration <= 0) {
            return "loggedOut";
        }

        return Number((statuses.loggedIn || {}).duration || 0) > 0 ? "loggedIn" : "loggedOut";
    }

    function formatStatusLabel(statusKey) {
        var mapping = {
            loggedIn: "Logged In",
            loggedOut: "Logged Out",
            available: "Available",
            busy: "Busy",
            working: "Working",
            wrapup: "Wrapup",
            noAnswer: "No Answer"
        };

        return mapping[statusKey] || statusKey;
    }

    function hasFailingQualityValue(value) {
        if (value === false || value === 0) {
            return true;
        }

        if (typeof value === "string") {
            return value.trim().toLowerCase() === "false" || value.trim() === "0";
        }

        return false;
    }

    function getUserQualityFlags(user) {
        var flags = [];
        if (hasFailingQualityValue(user.highRtt)) {
            flags.push("High RTT");
        }
        if (hasFailingQualityValue(user.lowMos)) {
            flags.push("Low MOS");
        }
        if (hasFailingQualityValue(user.highJitter)) {
            flags.push("High Jitter");
        }
        if (hasFailingQualityValue(user.highPacketLoss)) {
            flags.push("Packet Loss");
        }

        return flags;
    }

    function getQueueActiveCount(queue) {
        return Object.keys(queue.media || {}).reduce(function (total, mediaKey) {
            return total + Number((queue.media[mediaKey] || {}).totalActive || 0);
        }, 0);
    }

    function getQueueCurrentMaxQueueTime(queue) {
        return Object.keys(queue.media || {}).reduce(function (maxValue, mediaKey) {
            return Math.max(maxValue, Number((queue.media[mediaKey] || {}).currentMaxQueueTime || 0));
        }, 0);
    }

    function getQueueWorkitemCount(queue, queueActivity) {
        var queueName = queue && queue.name ? queue.name : "";
        var streamCount = Number((queueActivity || {})[queueName] || 0);
        var queueMediaCount = getQueueActiveCount(queue);

        return Math.max(streamCount, queueMediaCount);
    }

    function getQueueMediaWorkitemCount(queue, queueMediaActivity, mediaType) {
        var queueName = queue && queue.name ? queue.name : "";
        var streamCount = Number((((queueMediaActivity || {})[queueName] || {})[mediaType] || 0));
        var queueMediaCount = Number((((queue.media || {})[mediaType] || {}).totalActive || 0));

        return Math.max(streamCount, queueMediaCount);
    }

    function getAgentChannelLabel(user, activeWorkitemMediaByAgent) {
        var agentName = user && user.name ? String(user.name).trim() : "";
        var activeChannel = agentName ? (activeWorkitemMediaByAgent[agentName] || "") : "";

        return activeChannel || "--";
    }

    function buildDashboardData(message) {
        var stats = message.stats || {};
        var workitems = objectValues(stats.workitems);
        var activeWorkitems = workitems.filter(isActiveWorkitem);
        var queues = objectValues(stats.queues);
        var campaigns = objectValues(stats.campaigns);
        var outboundLists = objectValues(stats.outboundlists);
        var queueActivity = {};
        var queueMediaActivity = {};
        var queueAlarmFlags = {};
        var queueMediaTypes = {};
        var mediaCategoryMap = {};
        var mediaCounts = countBy(activeWorkitems, getWorkitemMedia);
        var stateCounts = countBy(activeWorkitems, getWorkitemState);
        var campaignCounts = {};

        workitems.forEach(function (workitem) {
            mediaCategoryMap[getWorkitemMedia(workitem)] = true;
        });

        queues.forEach(function (queue) {
            Object.keys(queue.media || {}).forEach(function (mediaKey) {
                mediaCategoryMap[mediaKey] = true;
            });
        });

        var mediaCategoryOrder = Object.keys(mediaCategoryMap).sort();

        activeWorkitems.forEach(function (workitem) {
            var queueName = getWorkitemQueue(workitem);
            var mediaType = getWorkitemMedia(workitem);
            queueActivity[queueName] = (queueActivity[queueName] || 0) + 1;

            if (!queueMediaActivity[queueName]) {
                queueMediaActivity[queueName] = {};
            }

            queueMediaActivity[queueName][mediaType] = (queueMediaActivity[queueName][mediaType] || 0) + 1;

            if (!queueMediaTypes[queueName]) {
                queueMediaTypes[queueName] = {};
            }

            queueMediaTypes[queueName][mediaType] = true;

            if (Array.isArray(workitem.alarms) && workitem.alarms.length > 0) {
                queueAlarmFlags[queueName] = true;
            }

            var campaignName = workitem.campaign || "Unassigned";
            campaignCounts[campaignName] = (campaignCounts[campaignName] || 0) + 1;
        });

        var queuesRequiringAttention = queues.filter(function (queue) {
            var activeQueueCount = getQueueWorkitemCount(queue, queueActivity);
            var queueHasAlarm = (Array.isArray(queue.alarms) && queue.alarms.length > 0) || queueAlarmFlags[queue.name];

            return (activeQueueCount > 0 && Number(queue.availableAgents || 0) <= 0) || queueHasAlarm;
        });

        var topCampaigns = Object.keys(campaignCounts).map(function (campaignName) {
            return {
                label: campaignName,
                value: campaignCounts[campaignName]
            };
        }).sort(function (left, right) {
            return right.value - left.value;
        }).slice(0, 5);

        var activeCampaigns = Object.keys(campaignCounts).length;
        if (activeCampaigns === 0) {
            activeCampaigns = campaigns.filter(campaignHasActivity).length;
        }

        var users = objectValues(stats.users);
        var activeWorkitemMediaByAgent = {};

        activeWorkitems.forEach(function (workitem) {
            var agentName = workitem && workitem.agentName ? String(workitem.agentName).trim() : "";
            if (!agentName || activeWorkitemMediaByAgent[agentName]) {
                return;
            }

            activeWorkitemMediaByAgent[agentName] = getWorkitemMedia(workitem);
        });

        var queueSummaries = queues.map(function (queue) {
            var queueName = queue.name || "Unnamed Queue";
            var activeWorkitemsCount = getQueueWorkitemCount(queue, queueActivity);
            var availableAgents = Number(queue.availableAgents || 0);
            var alarmCount = Array.isArray(queue.alarms) ? queue.alarms.length : (queueAlarmFlags[queue.name] ? 1 : 0);
            var mediaWorkitemCounts = {
                InboundCall: getQueueMediaWorkitemCount(queue, queueMediaActivity, "InboundCall"),
                InboundSMS: getQueueMediaWorkitemCount(queue, queueMediaActivity, "InboundSMS"),
                Chat: getQueueMediaWorkitemCount(queue, queueMediaActivity, "Chat")
            };
            var fallbackMediaTypes = Object.keys(queue.media || {}).filter(function (mediaKey) {
                return getQueueMediaWorkitemCount(queue, queueMediaActivity, mediaKey) > 0;
            });
            var activeMediaTypes = Object.keys(queueMediaTypes[queue.name] || {});
            var needsAttention = (activeWorkitemsCount > 0 && availableAgents <= 0) || alarmCount > 0;

            return {
                name: queueName,
                activeWorkitems: activeWorkitemsCount,
                availableAgents: availableAgents,
                workingAgents: Number(queue.workingAgents || 0),
                busyAgents: Number(queue.busyAgents || 0),
                wrapupAgents: Number(queue.wrapupAgents || 0),
                noAnswerAgents: Number(queue.noAnswerAgents || 0),
                loggedInAgents: Number(queue.loggedInAgents || 0),
                currentMaxQueueTime: getQueueCurrentMaxQueueTime(queue),
                voiceSla: Number(queue.voiceSLA || 0),
                mediaWorkitemCounts: mediaWorkitemCounts,
                alarmCount: alarmCount,
                activeMediaTypes: (activeMediaTypes.length > 0 ? activeMediaTypes : fallbackMediaTypes).sort(),
                needsAttention: needsAttention,
                attentionReason: alarmCount > 0 ? alarmCount + " alarms" : (needsAttention ? "Active queue with no available agents" : "Healthy")
            };
        }).sort(function (left, right) {
            if (right.activeWorkitems !== left.activeWorkitems) {
                return right.activeWorkitems - left.activeWorkitems;
            }

            return right.currentMaxQueueTime - left.currentMaxQueueTime;
        });

        var agentRows = users.map(function (user) {
            var qualityFlags = getUserQualityFlags(user);
            var derivedStatus = getAgentDerivedStatus(user);
            return {
                name: user.name || "Unnamed Agent",
                groupName: user.groupName || "--",
                derivedStatus: derivedStatus,
                statusLabel: formatStatusLabel(derivedStatus),
                statusDuration: Number(user.statusDuration || 0),
                loginTime: Number(user.loginTime || 0),
                channelLabel: getAgentChannelLabel(user, activeWorkitemMediaByAgent),
                qualityFlags: qualityFlags,
                qualityAlertCount: qualityFlags.length
            };
        }).sort(function (left, right) {
            if (right.qualityAlertCount !== left.qualityAlertCount) {
                return right.qualityAlertCount - left.qualityAlertCount;
            }

            return right.statusDuration - left.statusDuration;
        });

        var agentStatusCounts = countBy(agentRows, function (user) {
            return user.statusLabel;
        });

        var queueStaffingDistribution = {
            LoggedIn: agentRows.filter(function (user) { return user.derivedStatus !== "loggedOut"; }).length,
            Available: agentRows.filter(function (user) { return user.derivedStatus === "available"; }).length,
            Working: agentRows.filter(function (user) { return user.derivedStatus === "working"; }).length,
            Busy: agentRows.filter(function (user) { return user.derivedStatus === "busy"; }).length,
            Wrapup: agentRows.filter(function (user) { return user.derivedStatus === "wrapup"; }).length,
            "No Answer": agentRows.filter(function (user) { return user.derivedStatus === "noAnswer"; }).length
        };

        var campaignRows = campaigns.map(function (campaign) {
            return {
                name: campaign.name || "Unnamed Campaign",
                dialRatio: Number(campaign.dialRatio || 0),
                availableAgents: Number(campaign.availableAgents || 0),
                maxWaitTime: Number(campaign.maxWaitTime || 0),
                percentageDone: getCampaignCompletionRatio(campaign),
                completed: Number(campaign.completed || 0),
                callbacksNow: Number(campaign.callbacksNow || 0),
                dialerErrors: Number(campaign.dialerErrors || 0)
            };
        }).filter(function (campaign) {
            return campaign.availableAgents > 0
                || campaign.completed > 0
                || campaign.callbacksNow > 0
                || campaign.dialerErrors > 0
                || campaign.dialRatio > 0
                || campaign.percentageDone > 0;
        }).sort(function (left, right) {
            if (right.completed !== left.completed) {
                return right.completed - left.completed;
            }

            return right.percentageDone - left.percentageDone;
        });

        var campaignCompletionMix = {
            Completed: campaignRows.filter(function (campaign) { return campaign.percentageDone >= 1; }).length,
            InProgress: campaignRows.filter(function (campaign) { return campaign.percentageDone > 0 && campaign.percentageDone < 1; }).length,
            Idle: campaignRows.filter(function (campaign) { return campaign.percentageDone === 0; }).length
        };

        var outboundRows = outboundLists.map(function (list) {
            return {
                name: list.name || "Unnamed List",
                active: !!list.active,
                totalInList: Number(list.totalInList || 0),
                completed: Number(list.completed || 0),
                    percentageDone: normalizeRatio(list.percentageDone),
                callbacks: Number(list.callbacks || 0),
                callbacksNow: Number(list.callbacksNow || 0),
                notDialed: Number(list.notDialed || 0),
                dialerErrors: Number(list.dialerErrors || 0)
            };
        }).sort(function (left, right) {
            if (right.completed !== left.completed) {
                return right.completed - left.completed;
            }

            return right.totalInList - left.totalInList;
        });

        var outboundCompletionMix = {
            Completed: outboundRows.filter(function (list) { return list.percentageDone >= 1; }).length,
            InProgress: outboundRows.filter(function (list) { return list.percentageDone > 0 && list.percentageDone < 1; }).length,
            Pending: outboundRows.filter(function (list) { return list.percentageDone === 0; }).length
        };

        return {
            receivedAt: Date.now(),
            workitems: workitems,
            activeWorkitems: activeWorkitems,
            mediaCounts: mediaCounts,
            mediaCategoryOrder: mediaCategoryOrder,
            stateCounts: stateCounts,
            topCampaigns: topCampaigns,
            queuesRequiringAttention: queuesRequiringAttention,
            availableAgents: queueStaffingDistribution.Available,
            busyWorkingAgents: queueStaffingDistribution.Busy + queueStaffingDistribution.Working,
            activeCampaigns: activeCampaigns,
            outboundListsNearCompletion: outboundLists.filter(function (list) {
                var completion = normalizeRatio(list.percentageDone);
                return completion >= 0.8 && completion < 1;
            }).length,
            queueSummaries: queueSummaries,
            queueStaffingDistribution: queueStaffingDistribution,
            queueTotals: {
                loggedInAgents: queueStaffingDistribution.LoggedIn,
                availableAgents: queueStaffingDistribution.Available,
                workingAgents: queueStaffingDistribution.Working,
                busyAgents: queueStaffingDistribution.Busy,
                wrapupAgents: queueStaffingDistribution.Wrapup,
                noAnswerAgents: queueStaffingDistribution["No Answer"]
            },
            agentRows: agentRows,
            agentStatusCounts: agentStatusCounts,
            agentTotals: {
                loggedIn: agentRows.filter(function (user) { return user.derivedStatus !== "loggedOut"; }).length,
                working: agentRows.filter(function (user) { return user.derivedStatus === "working"; }).length,
                available: agentRows.filter(function (user) { return user.derivedStatus === "available"; }).length,
                qualityAlerts: agentRows.filter(function (user) { return user.qualityAlertCount > 0; }).length
            },
            campaignRows: campaignRows,
            campaignCompletionMix: campaignCompletionMix,
            campaignTotals: {
                activeCampaigns: campaignRows.length,
                completedLeads: sum(campaignRows, function (campaign) { return campaign.completed; }),
                callbacksNow: sum(campaignRows, function (campaign) { return campaign.callbacksNow; }),
                dialerErrors: sum(campaignRows, function (campaign) { return campaign.dialerErrors; })
            },
            outboundRows: outboundRows,
            outboundCompletionMix: outboundCompletionMix,
            outboundTotals: {
                lists: outboundRows.length,
                totalInList: sum(outboundRows, function (list) { return list.totalInList; }),
                completed: sum(outboundRows, function (list) { return list.completed; }),
                callbacks: sum(outboundRows, function (list) { return list.callbacks; }),
                notDialed: sum(outboundRows, function (list) { return list.notDialed; }),
                dialerErrors: sum(outboundRows, function (list) { return list.dialerErrors; })
            }
        };
    }

    function getStateBadgeClass(stateLabel) {
        switch (String(stateLabel || "").toLowerCase()) {
            case "active":
            case "available":
            case "loggedin":
                return "badge-light-success";
            case "queued":
            case "busy":
            case "noanswer":
                return "badge-light-warning";
            case "wrapup":
                return "badge-light-info";
            case "working":
                return "badge-light-primary";
            case "loggedout":
                return "badge-light-secondary";
            default:
                return "badge-light-primary";
        }
    }

    function getAlarmMarkup(alarms) {
        if (!Array.isArray(alarms) || alarms.length === 0) {
            return "<span class=\"badge badge-light-success\">0</span>";
        }

        var references = alarms.slice(0, 2).map(function (alarm) {
            return escapeHtml((alarm.dashboardId || "dashboard") + ":" + (alarm.alarmId || "alarm"));
        }).join("<br>");

        var remainder = alarms.length > 2 ? "<div class=\"text-muted fs-8 mt-1\">+" + (alarms.length - 2) + " more</div>" : "";

        return "<div><span class=\"badge badge-light-danger\">" + alarms.length + "</span>"
            + "<div class=\"text-muted fs-8 mt-1\">" + references + "</div>"
            + remainder
            + "</div>";
    }

    function getOverviewAlarmMarkup(alarms) {
        if (!Array.isArray(alarms) || alarms.length === 0) {
            return "<span class=\"badge badge-light-success\">0</span>";
        }

        return "<span class=\"badge badge-light-danger\">" + alarms.length + "</span>";
    }

    function updateConnectionUi(status, message) {
        var statusMap = {
            connecting: {
                badgeClass: "badge-light-warning",
                text: "Connecting..."
            },
            reconnecting: {
                badgeClass: "badge-light-warning",
                text: "Reconnecting..."
            },
            connected: {
                badgeClass: "badge-light-success",
                text: "Live"
            },
            error: {
                badgeClass: "badge-light-danger",
                text: "Connection issue"
            }
        };
        var config = statusMap[status] || statusMap.error;

        document.querySelectorAll("[data-ncc-connection-status]").forEach(function (element) {
            element.className = "badge fs-7 fw-bold mb-2 " + config.badgeClass;
            element.textContent = config.text;
        });

        document.querySelectorAll("[data-ncc-inline-state]").forEach(function (element) {
            if (status === "connected") {
                element.classList.add("d-none");
                return;
            }

            element.classList.remove("d-none", "alert-warning", "alert-danger", "alert-info");
            element.classList.add(status === "error" ? "alert-danger" : "alert-warning");

            var title = status === "reconnecting" ? "Reconnecting..." : config.text;
            if (status === "error") {
                title = "Connection issue";
            }

            element.innerHTML = "<i class=\"ki-outline ki-arrows-circle fs-2hx "
                + (status === "error" ? "text-danger" : "text-warning")
                + " me-4\"></i><div class=\"d-flex flex-column\"><span class=\"fw-semibold\">"
                + escapeHtml(title)
                + "</span><span class=\"fs-7 text-muted\">"
                + escapeHtml(message || "Waiting for live supervisor stats.")
                + "</span></div>";
        });
    }

    function updateTelemetry() {
        document.querySelectorAll("[data-ncc-last-update]").forEach(function (element) {
            element.textContent = formatTimestamp(state.data ? state.data.receivedAt : null);
        });

        document.querySelectorAll("[data-ncc-event-count]").forEach(function (element) {
            element.textContent = String(state.eventCount);
        });
    }

    function showConnectionAlert(text) {
        if (typeof Swal === "undefined") {
            return;
        }

        Swal.fire({
            text: text,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    }

    function clearDisconnectAlertTimer() {
        if (state.disconnectAlertTimer) {
            clearTimeout(state.disconnectAlertTimer);
            state.disconnectAlertTimer = null;
        }
    }

    function clearFirstStatsTimer() {
        if (state.firstStatsTimer) {
            clearTimeout(state.firstStatsTimer);
            state.firstStatsTimer = null;
        }
    }

    function clearFirstStatsWarningTimer() {
        if (state.firstStatsWarningTimer) {
            clearTimeout(state.firstStatsWarningTimer);
            state.firstStatsWarningTimer = null;
        }
    }

    function scheduleFirstStatsTimeout() {
        clearFirstStatsWarningTimer();
        clearFirstStatsTimer();

        if (state.hasReceivedStats) {
            return;
        }

        logInfo("Starting first-stats watchdog.", {
            attempt: state.connectionAttempt,
            warningTimeoutMs: firstStatsWarningTimeoutMs,
            timeoutMs: firstStatsTimeoutMs
        });

        state.firstStatsWarningTimer = setTimeout(function () {
            if (state.hasReceivedStats) {
                return;
            }

            logWarn("First-stats soft watchdog fired before any SupervisorStatsNotification arrived.", {
                attempt: state.connectionAttempt,
                timeoutMs: firstStatsWarningTimeoutMs,
                destination: state.session ? state.session.destination : ""
            });

            requestStatsFilterActivation("first-stats-soft-timeout", function () {
                return;
            });

            updateConnectionUi("connecting", "Connected, but the live supervisor feed is still waiting for its first stats snapshot.");
        }, firstStatsWarningTimeoutMs);

        state.firstStatsTimer = setTimeout(function () {
            if (state.hasReceivedStats) {
                return;
            }

            logWarn("First-stats hard watchdog fired before any SupervisorStatsNotification arrived.", {
                attempt: state.connectionAttempt,
                timeoutMs: firstStatsTimeoutMs,
                destination: state.session ? state.session.destination : ""
            });

            requestStatsFilterActivation("first-stats-hard-timeout", function () {
                return;
            });

            updateConnectionUi("reconnecting", "The live supervisor feed connected but did not send stats. Retrying.");

            if (!state.hasRaisedInitialAlert) {
                showConnectionAlert("Sorry, the live supervisor feed connected but did not send stats. Please wait while it retries.");
                state.hasRaisedInitialAlert = true;
            }

            scheduleReconnect();
        }, firstStatsTimeoutMs);
    }

    function scheduleLongDisconnectAlert() {
        clearDisconnectAlertTimer();
        state.disconnectAlertTimer = setTimeout(function () {
            if (!state.hasReceivedStats) {
                return;
            }

            updateConnectionUi("error", "The live dashboard has been disconnected for longer than expected.");
            showConnectionAlert("Sorry, the live dashboard connection has been disconnected for too long. Please wait while it retries.");
        }, longDisconnectThresholdMs);
    }

    function navigateToLiveWorkitems(filters) {
        var params = new URLSearchParams();
        params.set("menu", "dashboards");
        params.set("page", "live_workitems");

        if (filters.media) {
            params.set("media", filters.media);
        }

        if (filters.state) {
            params.set("state", filters.state);
        }

        window.location.href = "?" + params.toString();
    }

    function ensurePieChart(containerId, chartKey, onSliceClick) {
        if (chartStore[chartKey]) {
            return chartStore[chartKey];
        }

        var root = am5.Root.new(containerId);
        root.setThemes([am5themes_Animated.new(root)]);
        root.numberFormatter.set("numberFormat", "#,###.0");

        var chart = root.container.children.push(am5percent.PieChart.new(root, {
            layout: root.horizontalLayout,
            innerRadius: am5.percent(55),
            paddingLeft: 20,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10
        }));

        var series = chart.series.push(am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category",
            legendLabelText: "{category}",
            legendValueText: "{valuePercentTotal.formatNumber('0.0')}%"
        }));

        series.set("alignLabels", false);

        series.slices.template.setAll({
            cursorOverStyle: "pointer"
        });
        series.labels.template.setAll({
            text: "{valuePercentTotal.formatNumber('0.0')}%",
            oversizedBehavior: "truncate",
            maxWidth: 70,
            fontSize: 11
        });
        series.labels.template.adapters.add("text", function (text, target) {
            var dataItem = target.dataItem;
            if (!dataItem || !dataItem.dataContext) {
                return text;
            }

            if (dataItem.dataContext.isEmpty || Number(dataItem.dataContext.value || 0) <= 0) {
                return "";
            }

            return text;
        });
        series.ticks.template.set("visible", false);

        if (onSliceClick) {
            series.slices.template.events.on("click", function (event) {
                if (!event.target.dataItem || !event.target.dataItem.dataContext) {
                    return;
                }

                onSliceClick(event.target.dataItem.dataContext);
            });
        }

        var legend = chart.children.push(am5.Legend.new(root, {
            centerY: am5.percent(50),
            y: am5.percent(50),
            layout: root.verticalLayout,
            width: am5.percent(35),
            marginLeft: 20
        }));

        legend.itemContainers.template.setAll({
            width: am5.percent(100)
        });

        legend.labels.template.setAll({
            fontSize: 12,
            maxWidth: 140,
            oversizedBehavior: "truncate",
            width: am5.percent(100),
            textAlign: "left"
        });
        legend.valueLabels.template.setAll({
            fontSize: 12,
            width: 48,
            textAlign: "right"
        });

        legend.data.setAll(series.dataItems);
        series.events.on("datavalidated", function () {
            legend.data.setAll(series.dataItems);
        });

        chartStore[chartKey] = {
            root: root,
            series: series,
            legend: legend
        };

        return chartStore[chartKey];
    }

    function renderPieChart(containerId, chartKey, counts, clickHandler, emptyLabel, orderedCategories, valueDisplayMode) {
        var chart = ensurePieChart(containerId, chartKey, clickHandler);
        var data = countsToData(counts, orderedCategories);
        var isCountMode = valueDisplayMode !== "percent";

        chart.series.set("legendValueText", isCountMode ? "{value.formatNumber('#,###')}" : "{valuePercentTotal.formatNumber('0.0')}%");
        chart.series.labels.template.set("text", isCountMode ? "{value.formatNumber('#,###')}" : "{valuePercentTotal.formatNumber('0.0')}%");

        if (data.length === 0) {
            data = [{
                category: emptyLabel || "No active workitems",
                value: 1,
                isEmpty: true
            }];
        }

        chart.series.data.setAll(data);
    }

    function renderOverview() {
        var page = document.querySelector("[data-ncc-dashboard-page='supervisor-overview']");
        if (!page || !state.data) {
            return;
        }

        var data = state.data;
        var summaryMap = {
            activeWorkitems: data.activeWorkitems.length,
            queuesRequiringAttention: data.queuesRequiringAttention.length,
            availableAgents: data.availableAgents,
            busyWorkingAgents: data.busyWorkingAgents,
            activeCampaigns: data.activeCampaigns,
            outboundListsNearCompletion: data.outboundListsNearCompletion
        };

        Object.keys(summaryMap).forEach(function (key) {
            var element = page.querySelector("[data-ncc-summary-key='" + key + "']");
            if (element) {
                element.textContent = String(summaryMap[key]);
            }
        });

        renderPieChart(
            "ncc_overview_media_chart",
            "overview-media",
            mergeCountsWithCategories(data.mediaCounts, data.mediaCategoryOrder),
            function (sliceData) {
                if (sliceData.isEmpty) {
                    return;
                }

                navigateToLiveWorkitems({ media: sliceData.category });
            },
            "No active workitems",
            data.mediaCategoryOrder,
            "count"
        );

        var campaignsContainer = page.querySelector("#ncc_overview_campaigns");
        if (campaignsContainer) {
            if (data.topCampaigns.length === 0) {
                campaignsContainer.innerHTML = "<div class=\"text-muted fs-7\">No active campaign activity yet.</div>";
            } else {
                campaignsContainer.innerHTML = data.topCampaigns.map(function (campaign) {
                    return "<div class=\"d-flex align-items-center justify-content-between border border-gray-200 rounded px-4 py-3\">"
                        + "<div class=\"fw-semibold text-gray-800\">" + escapeHtml(campaign.label) + "</div>"
                        + "<span class=\"badge badge-light-primary\">" + campaign.value + "</span>"
                        + "</div>";
                }).join("");
            }
        }

        var tableBody = page.querySelector("#ncc_overview_workitems_body");
        if (tableBody) {
            var rows = data.activeWorkitems.slice().sort(function (left, right) {
                return Number(right.duration || 0) - Number(left.duration || 0);
            }).slice(0, 10);

            if (rows.length === 0) {
                tableBody.innerHTML = "<tr><td colspan=\"6\" class=\"text-center text-muted py-10\">No active workitems yet.</td></tr>";
            } else {
                tableBody.innerHTML = rows.map(function (workitem) {
                    return "<tr>"
                        + "<td>" + escapeHtml(workitem.type || "--") + "</td>"
                        + "<td>" + escapeHtml(workitem.campaign || "--") + "</td>"
                        + "<td>" + escapeHtml(workitem.agentName || "--") + "</td>"
                        + "<td><span class=\"badge " + getStateBadgeClass(getWorkitemState(workitem)) + "\">" + escapeHtml(getWorkitemState(workitem)) + "</span></td>"
                        + "<td>" + escapeHtml(formatDuration(workitem.duration)) + "</td>"
                        + "<td>" + getOverviewAlarmMarkup(workitem.alarms) + "</td>"
                        + "</tr>";
                }).join("");
            }
        }
    }

    function getLiveTableFilterValues() {
        var mediaFilter = document.getElementById("ncc_workitems_filter_media");
        var stateFilter = document.getElementById("ncc_workitems_filter_state");

        return {
            media: mediaFilter ? mediaFilter.value : "",
            state: stateFilter ? stateFilter.value : ""
        };
    }

    function populateFilterOptions(selectElement, values, activeValue, defaultLabel, orderedValues) {
        if (!selectElement) {
            return;
        }

        var seen = {};
        var uniqueValues = [];

        (orderedValues || []).forEach(function (value) {
            if (!value || seen[value]) {
                return;
            }

            seen[value] = true;
            uniqueValues.push(value);
        });

        Array.from(new Set(values)).sort().forEach(function (value) {
            if (!value || seen[value]) {
                return;
            }

            seen[value] = true;
            uniqueValues.push(value);
        });

        var options = ["<option value=\"\">" + escapeHtml(defaultLabel) + "</option>"];
        uniqueValues.forEach(function (value) {
            options.push("<option value=\"" + escapeHtml(value) + "\">" + escapeHtml(value) + "</option>");
        });
        selectElement.innerHTML = options.join("");
        selectElement.value = activeValue && uniqueValues.indexOf(activeValue) !== -1 ? activeValue : "";
    }

    function getQueueStaffingPropertyMap() {
        return {
            LoggedIn: "loggedInAgents",
            Available: "availableAgents",
            Working: "workingAgents",
            Busy: "busyAgents",
            Wrapup: "wrapupAgents",
            "No Answer": "noAnswerAgents"
        };
    }

    function getQueueFilterValues() {
        var mediaFilter = document.getElementById("ncc_queue_filter_media");
        var focusFilter = document.getElementById("ncc_queue_filter_focus");
        var staffingFilter = document.getElementById("ncc_queue_filter_staffing");

        return {
            media: mediaFilter ? mediaFilter.value : "",
            focus: focusFilter ? focusFilter.value : "",
            staffing: staffingFilter ? staffingFilter.value : ""
        };
    }

    function getAgentFilterValues() {
        var statusFilter = document.getElementById("ncc_agent_filter_status");
        var qualityFilter = document.getElementById("ncc_agent_filter_quality");
        var channelFilter = document.getElementById("ncc_agent_filter_channel");

        return {
            status: statusFilter ? statusFilter.value : "",
            quality: qualityFilter ? qualityFilter.value : "",
            channel: channelFilter ? channelFilter.value : ""
        };
    }

    function getFilteredQueueRows(rows, filters) {
        return rows.filter(function (queue) {
            var matchesMedia = !filters.media || queue.activeMediaTypes.indexOf(filters.media) !== -1;
            var matchesFocus = !filters.focus
                || (filters.focus === "attention" && queue.needsAttention)
                || (filters.focus === "healthy" && !queue.needsAttention);
            var matchesStaffing = !filters.staffing || Number(queue[filters.staffing] || 0) > 0;

            return matchesMedia && matchesFocus && matchesStaffing;
        });
    }

    function buildQueueStaffingCounts(rows) {
        var propertyMap = getQueueStaffingPropertyMap();

        return Object.keys(propertyMap).reduce(function (counts, label) {
            var value = sum(rows, function (queue) {
                return queue[propertyMap[label]];
            });

            if (value > 0) {
                counts[label] = value;
            }

            return counts;
        }, {});
    }

    function buildQueueTotals(rows) {
        return {
            loggedInAgents: sum(rows, function (queue) { return queue.loggedInAgents; }),
            availableAgents: sum(rows, function (queue) { return queue.availableAgents; }),
            workingAgents: sum(rows, function (queue) { return queue.workingAgents; }),
            busyAgents: sum(rows, function (queue) { return queue.busyAgents; }),
            wrapupAgents: sum(rows, function (queue) { return queue.wrapupAgents; }),
            noAnswerAgents: sum(rows, function (queue) { return queue.noAnswerAgents; })
        };
    }

    function getFilteredAgentRows(rows, filters) {
        return rows.filter(function (user) {
            var matchesStatus = !filters.status || user.statusLabel === filters.status;
            var matchesQuality = !filters.quality
                || (filters.quality === "flagged" && user.qualityAlertCount > 0)
                || (filters.quality === "clean" && user.qualityAlertCount === 0);
            var matchesChannel = !filters.channel || user.channelLabel === filters.channel;

            return matchesStatus && matchesQuality && matchesChannel;
        });
    }

    function buildAgentTotals(rows) {
        return {
            loggedIn: rows.filter(function (user) { return user.derivedStatus !== "loggedOut"; }).length,
            working: rows.filter(function (user) { return user.derivedStatus === "working"; }).length,
            available: rows.filter(function (user) { return user.derivedStatus === "available"; }).length,
            qualityAlerts: rows.filter(function (user) { return user.qualityAlertCount > 0; }).length
        };
    }

    function getWorkitemsTableRows(activeWorkitems, filters) {
        return activeWorkitems.filter(function (workitem) {
            var matchesMedia = !filters.media || getWorkitemMedia(workitem) === filters.media;
            var matchesState = !filters.state || getWorkitemState(workitem) === filters.state;

            return matchesMedia && matchesState;
        }).map(function (workitem) {
            return {
                type: workitem.type || "--",
                campaign: workitem.campaign || "--",
                queue: getWorkitemQueue(workitem),
                agent: workitem.agentName || "--",
                from: workitem.from || "--",
                to: workitem.to || "--",
                queueTime: Number(workitem.queueTime || 0),
                talkTime: Number(workitem.talkTime || 0),
                duration: Number(workitem.duration || 0),
                customerIntentMarkup: getCustomerIntentMarkup(workitem)
            };
        });
    }

    function initialiseLiveTable(rows) {
        if (!window.jQuery || !jQuery.fn || !jQuery.fn.DataTable) {
            return null;
        }

        return jQuery("#ncc_live_workitems_table").DataTable({
            data: rows,
            pageLength: 25,
            order: [[9, "desc"]],
            destroy: true,
            columns: [
                { data: "type" },
                { data: "campaign" },
                { data: "queue" },
                { data: "agent" },
                { data: "from" },
                { data: "to" },
                {
                    data: "queueTime",
                    render: function (data, type) {
                        return type === "sort" || type === "type" ? data : formatDuration(data);
                    }
                },
                {
                    data: "talkTime",
                    render: function (data, type) {
                        return type === "sort" || type === "type" ? data : formatDuration(data);
                    }
                },
                {
                    data: "duration",
                    render: function (data, type) {
                        return type === "sort" || type === "type" ? data : formatDuration(data);
                    }
                },
                {
                    data: "customerIntentMarkup",
                    orderable: false,
                    searchable: true
                }
            ],
            language: {
                emptyTable: "No active workitems match the current filters."
            }
        });
    }

    function renderLiveWorkitemsTableFallback(rows) {
        var tableBody = document.querySelector("#ncc_live_workitems_table tbody");
        if (!tableBody) {
            return;
        }

        if (rows.length === 0) {
            tableBody.innerHTML = "<tr><td colspan=\"10\" class=\"text-center text-muted py-10\">No active workitems match the current filters.</td></tr>";
            return;
        }

        tableBody.innerHTML = rows.map(function (row) {
            return "<tr>"
                + "<td>" + escapeHtml(row.type) + "</td>"
                + "<td>" + escapeHtml(row.campaign) + "</td>"
                + "<td>" + escapeHtml(row.queue) + "</td>"
                + "<td>" + escapeHtml(row.agent) + "</td>"
                + "<td>" + escapeHtml(row.from) + "</td>"
                + "<td>" + escapeHtml(row.to) + "</td>"
                + "<td>" + escapeHtml(formatDuration(row.queueTime)) + "</td>"
                + "<td>" + escapeHtml(formatDuration(row.talkTime)) + "</td>"
                + "<td>" + escapeHtml(formatDuration(row.duration)) + "</td>"
                + "<td>" + row.customerIntentMarkup + "</td>"
                + "</tr>";
        }).join("");
    }

    function renderLiveWorkitems() {
        var page = document.querySelector("[data-ncc-dashboard-page='live-workitems']");
        if (!page || !state.data) {
            return;
        }

        var mediaFilter = document.getElementById("ncc_workitems_filter_media");
        var stateFilter = document.getElementById("ncc_workitems_filter_state");
        var filterValues = {
            media: mediaFilter && mediaFilter.value ? mediaFilter.value : state.initialFilters.media,
            state: stateFilter && stateFilter.value ? stateFilter.value : state.initialFilters.state
        };
        var activeWorkitems = state.data.activeWorkitems.slice().sort(function (left, right) {
            return Number(right.duration || 0) - Number(left.duration || 0);
        });

        populateFilterOptions(mediaFilter, activeWorkitems.map(getWorkitemMedia), filterValues.media, "All media types", state.data.mediaCategoryOrder);
        populateFilterOptions(stateFilter, activeWorkitems.map(getWorkitemState), filterValues.state, "All states");
        filterValues = getLiveTableFilterValues();
        state.initialFilters = {
            media: "",
            state: ""
        };

        var filteredRows = getWorkitemsTableRows(activeWorkitems, filterValues);
        var filteredCounts = {
            media: countBy(activeWorkitems.filter(function (workitem) {
                var matchesState = !filterValues.state || getWorkitemState(workitem) === filterValues.state;
                return matchesState;
            }), getWorkitemMedia),
            state: countBy(activeWorkitems.filter(function (workitem) {
                var matchesMedia = !filterValues.media || getWorkitemMedia(workitem) === filterValues.media;
                return matchesMedia;
            }), getWorkitemState)
        };

        renderPieChart(
            "ncc_live_media_chart",
            "live-media",
            mergeCountsWithCategories(filteredCounts.media, state.data.mediaCategoryOrder),
            function (sliceData) {
                if (sliceData.isEmpty || !mediaFilter) {
                    return;
                }

                mediaFilter.value = sliceData.category;
                renderLiveWorkitems();
            },
            "No matching workitems",
            state.data.mediaCategoryOrder,
            "count"
        );

        if (!state.liveTable) {
            state.liveTable = initialiseLiveTable(filteredRows);
        }

        if (state.liveTable) {
            state.liveTable.clear();
            state.liveTable.rows.add(filteredRows);
            state.liveTable.draw(false);
        } else {
            renderLiveWorkitemsTableFallback(filteredRows);
        }
    }

    function renderQueueMonitor() {
        var page = document.querySelector("[data-ncc-dashboard-page='queue-monitor']");
        if (!page || !state.data) {
            return;
        }

        var mediaFilter = document.getElementById("ncc_queue_filter_media");
        var staffingFilter = document.getElementById("ncc_queue_filter_staffing");
        var filters = getQueueFilterValues();
        var allRows = state.data.queueSummaries.slice();
        var staffingMap = getQueueStaffingPropertyMap();

        populateFilterOptions(mediaFilter, allRows.reduce(function (values, queue) {
            return values.concat(queue.activeMediaTypes);
        }, []), filters.media, "All media types", state.data.mediaCategoryOrder);
        filters = getQueueFilterValues();

        var baseRows = getFilteredQueueRows(allRows, {
            media: filters.media,
            focus: filters.focus,
            staffing: ""
        });
        var filteredRows = getFilteredQueueRows(allRows, filters);
        var totals = state.data.queueTotals;

        Object.keys(totals).forEach(function (key) {
            var element = page.querySelector("[data-ncc-queue-key='" + key + "']");
            if (element) {
                element.textContent = String(totals[key]);
            }
        });

        renderPieChart("ncc_queue_staffing_chart", "queue-staffing", state.data.queueStaffingDistribution, function (sliceData) {
            var nextValue;

            if (sliceData.isEmpty || !staffingFilter) {
                return;
            }

            nextValue = staffingMap[sliceData.category] || "";
            staffingFilter.value = staffingFilter.value === nextValue ? "" : nextValue;
            renderQueueMonitor();
        }, "No queue staffing data", getQueueStaffingCategories(), "count");

        var tableBody = page.querySelector("#ncc_queue_table_body");
        if (tableBody) {
            if (filteredRows.length === 0) {
                tableBody.innerHTML = "<tr><td colspan=\"10\" class=\"text-center text-muted py-10\">No queues match the current filters.</td></tr>";
            } else {
                tableBody.innerHTML = filteredRows.map(function (queue) {
                    var mediaCounts = queue.mediaWorkitemCounts || {};
                    return "<tr>"
                        + "<td><span class=\"text-gray-900 fw-semibold\">" + escapeHtml(queue.name) + "</span></td>"
                        + "<td><span class=\"fw-bold text-gray-800\">" + escapeHtml(formatCount(queue.activeWorkitems)) + "</span></td>"
                        + "<td>" + escapeHtml(formatCount(mediaCounts.InboundCall)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(mediaCounts.InboundSMS)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(mediaCounts.Chat)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(queue.availableAgents)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(queue.workingAgents)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(queue.busyAgents)) + "</td>"
                        + "<td>" + escapeHtml(formatDuration(queue.currentMaxQueueTime)) + "</td>"
                        + "<td><span class=\"badge " + (queue.alarmCount > 0 ? "badge-light-danger" : "badge-light-success") + "\">" + escapeHtml(queue.alarmCount) + "</span></td>"
                        + "</tr>";
                }).join("");
            }
        }
    }

    function renderAgentStatus() {
        var page = document.querySelector("[data-ncc-dashboard-page='agent-status']");
        if (!page || !state.data) {
            return;
        }

        var statusFilter = document.getElementById("ncc_agent_filter_status");
        var channelFilter = document.getElementById("ncc_agent_filter_channel");
        var filters = getAgentFilterValues();
        var allRows = state.data.agentRows.slice();

        populateFilterOptions(statusFilter, allRows.map(function (user) {
            return user.statusLabel;
        }), filters.status, "All statuses", getAgentStatusCategories());
        populateFilterOptions(channelFilter, allRows.map(function (user) {
            return user.channelLabel;
        }), filters.channel, "All channels");
        filters = getAgentFilterValues();

        var baseRows = getFilteredAgentRows(allRows, {
            status: "",
            quality: filters.quality,
            channel: filters.channel
        });
        var filteredRows = getFilteredAgentRows(allRows, filters);
        var totals = buildAgentTotals(filteredRows);

        Object.keys(totals).forEach(function (key) {
            var element = page.querySelector("[data-ncc-agent-key='" + key + "']");
            if (element) {
                element.textContent = String(totals[key]);
            }
        });

        renderPieChart("ncc_agent_status_chart", "agent-status", mergeCountsWithCategories(countBy(baseRows, function (user) {
            return user.statusLabel;
        }), getAgentStatusCategories()), function (sliceData) {
            if (sliceData.isEmpty || !statusFilter) {
                return;
            }

            statusFilter.value = statusFilter.value === sliceData.category ? "" : sliceData.category;
            renderAgentStatus();
        }, "No agent data", getAgentStatusCategories(), "count");

        var attentionList = page.querySelector("#ncc_agent_attention_list");
        if (attentionList) {
            var flaggedAgents = filteredRows.filter(function (user) {
                return user.qualityAlertCount > 0;
            }).slice(0, 6);

            if (flaggedAgents.length === 0) {
                attentionList.innerHTML = "<div class=\"text-muted fs-7\">No agents with quality alerts match the current filters.</div>";
            } else {
                attentionList.innerHTML = flaggedAgents.map(function (user) {
                    return "<div class=\"d-flex align-items-center justify-content-between border border-gray-200 rounded px-4 py-3\">"
                        + "<div><div class=\"fw-semibold text-gray-800\">" + escapeHtml(user.name) + "</div><div class=\"text-muted fs-8\">" + escapeHtml(user.statusLabel) + " | " + escapeHtml(user.channelLabel) + "</div><div class=\"text-muted fs-8\">" + escapeHtml(user.qualityFlags.join(", ")) + "</div></div>"
                        + "<span class=\"badge badge-light-danger\">" + escapeHtml(user.qualityAlertCount) + " flags</span>"
                        + "</div>";
                }).join("");
            }
        }

        var tableBody = page.querySelector("#ncc_agent_table_body");
        if (tableBody) {
            if (filteredRows.length === 0) {
                tableBody.innerHTML = "<tr><td colspan=\"7\" class=\"text-center text-muted py-10\">No agents match the current filters.</td></tr>";
            } else {
                tableBody.innerHTML = filteredRows.map(function (user) {
                    var flags = user.qualityFlags.length > 0 ? user.qualityFlags.join(", ") : "--";
                    return "<tr>"
                        + "<td><span class=\"text-gray-900 fw-semibold\">" + escapeHtml(user.name) + "</span></td>"
                        + "<td>" + escapeHtml(user.groupName) + "</td>"
                        + "<td><span class=\"badge " + getStateBadgeClass(user.derivedStatus) + "\">" + escapeHtml(user.statusLabel) + "</span></td>"
                        + "<td>" + escapeHtml(formatDuration(user.statusDuration)) + "</td>"
                        + "<td>" + escapeHtml(user.channelLabel) + "</td>"
                        + "<td>" + (user.qualityFlags.length > 0 ? "<span class=\"text-gray-800\">" + escapeHtml(flags) + "</span>" : "<span class=\"text-muted\">--</span>") + "</td>"
                        + "<td>" + escapeHtml(formatTimestamp(user.loginTime)) + "</td>"
                        + "</tr>";
                }).join("");
            }
        }
    }

    function renderCampaignPerformance() {
        var page = document.querySelector("[data-ncc-dashboard-page='campaign-performance']");
        if (!page || !state.data) {
            return;
        }

        Object.keys(state.data.campaignTotals).forEach(function (key) {
            var element = page.querySelector("[data-ncc-campaign-key='" + key + "']");
            if (element) {
                element.textContent = String(state.data.campaignTotals[key]);
            }
        });

        renderPieChart("ncc_campaign_completion_chart", "campaign-completion", state.data.campaignCompletionMix, null, "No campaign data", null, "percent");

        var topList = page.querySelector("#ncc_campaign_top_list");
        if (topList) {
            if (state.data.campaignRows.length === 0) {
                topList.innerHTML = "<div class=\"text-muted fs-7\">No campaign activity available yet.</div>";
            } else {
                topList.innerHTML = state.data.campaignRows.slice(0, 6).map(function (campaign) {
                    return "<div class=\"d-flex align-items-center justify-content-between border border-gray-200 rounded px-4 py-3\">"
                        + "<div><div class=\"fw-semibold text-gray-800\">" + escapeHtml(campaign.name) + "</div><div class=\"text-muted fs-8\">Dial ratio: " + escapeHtml(formatDecimal(campaign.dialRatio)) + " | Done: " + escapeHtml(formatPercent(campaign.percentageDone)) + "</div></div>"
                        + "<span class=\"badge badge-light-primary\">" + escapeHtml(formatCount(campaign.completed)) + " completed</span>"
                        + "</div>";
                }).join("");
            }
        }

        var tableBody = page.querySelector("#ncc_campaign_table_body");
        if (tableBody) {
            if (state.data.campaignRows.length === 0) {
                tableBody.innerHTML = "<tr><td colspan=\"8\" class=\"text-center text-muted py-10\">No campaign data available.</td></tr>";
            } else {
                tableBody.innerHTML = state.data.campaignRows.map(function (campaign) {
                    return "<tr>"
                        + "<td><div class=\"d-flex flex-column\"><span class=\"text-gray-900 fw-semibold\">" + escapeHtml(campaign.name) + "</span><span class=\"text-muted fs-8\">Callbacks now: " + escapeHtml(formatCount(campaign.callbacksNow)) + "</span></div></td>"
                        + "<td>" + escapeHtml(formatDecimal(campaign.dialRatio)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(campaign.availableAgents)) + "</td>"
                        + "<td>" + escapeHtml(formatDuration(campaign.maxWaitTime)) + "</td>"
                        + "<td><span class=\"badge badge-light-success\">" + escapeHtml(formatPercent(campaign.percentageDone)) + "</span></td>"
                        + "<td>" + escapeHtml(formatCount(campaign.completed)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(campaign.callbacksNow)) + "</td>"
                        + "<td><span class=\"badge " + (campaign.dialerErrors > 0 ? "badge-light-danger" : "badge-light-success") + "\">" + escapeHtml(formatCount(campaign.dialerErrors)) + "</span></td>"
                        + "</tr>";
                }).join("");
            }
        }
    }

    function renderOutboundLists() {
        var page = document.querySelector("[data-ncc-dashboard-page='outbound-lists']");
        if (!page || !state.data) {
            return;
        }

        Object.keys(state.data.outboundTotals).forEach(function (key) {
            var element = page.querySelector("[data-ncc-outbound-key='" + key + "']");
            if (element) {
                element.textContent = String(state.data.outboundTotals[key]);
            }
        });

        renderPieChart("ncc_outbound_completion_chart", "outbound-completion", state.data.outboundCompletionMix, null, "No outbound data", null, "percent");

        var topList = page.querySelector("#ncc_outbound_top_list");
        if (topList) {
            if (state.data.outboundRows.length === 0) {
                topList.innerHTML = "<div class=\"text-muted fs-7\">No outbound list activity available yet.</div>";
            } else {
                topList.innerHTML = state.data.outboundRows.slice(0, 6).map(function (list) {
                    return "<div class=\"d-flex align-items-center justify-content-between border border-gray-200 rounded px-4 py-3\">"
                        + "<div><div class=\"fw-semibold text-gray-800\">" + escapeHtml(list.name) + "</div><div class=\"text-muted fs-8\">Done: " + escapeHtml(formatPercent(list.percentageDone)) + " | Total: " + escapeHtml(formatCount(list.totalInList)) + "</div></div>"
                        + "<span class=\"badge badge-light-primary\">" + escapeHtml(formatCount(list.completed)) + " completed</span>"
                        + "</div>";
                }).join("");
            }
        }

        var tableBody = page.querySelector("#ncc_outbound_table_body");
        if (tableBody) {
            if (state.data.outboundRows.length === 0) {
                tableBody.innerHTML = "<tr><td colspan=\"9\" class=\"text-center text-muted py-10\">No outbound list data available.</td></tr>";
            } else {
                tableBody.innerHTML = state.data.outboundRows.map(function (list) {
                    return "<tr>"
                        + "<td><div class=\"d-flex flex-column\"><span class=\"text-gray-900 fw-semibold\">" + escapeHtml(list.name) + "</span><span class=\"text-muted fs-8\">Callbacks now: " + escapeHtml(formatCount(list.callbacksNow)) + "</span></div></td>"
                        + "<td><span class=\"badge " + (list.active ? "badge-light-success" : "badge-light-secondary") + "\">" + escapeHtml(list.active ? "Active" : "Inactive") + "</span></td>"
                        + "<td>" + escapeHtml(formatCount(list.totalInList)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(list.completed)) + "</td>"
                        + "<td><span class=\"badge badge-light-success\">" + escapeHtml(formatPercent(list.percentageDone)) + "</span></td>"
                        + "<td>" + escapeHtml(formatCount(list.callbacks)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(list.callbacksNow)) + "</td>"
                        + "<td>" + escapeHtml(formatCount(list.notDialed)) + "</td>"
                        + "<td><span class=\"badge " + (list.dialerErrors > 0 ? "badge-light-danger" : "badge-light-success") + "\">" + escapeHtml(formatCount(list.dialerErrors)) + "</span></td>"
                        + "</tr>";
                }).join("");
            }
        }
    }

    function renderDashboards() {
        updateTelemetry();
        renderOverview();
        renderLiveWorkitems();
        renderQueueMonitor();
        renderAgentStatus();
        renderCampaignPerformance();
        renderOutboundLists();
    }

    function parseFrame(frame) {
        var lines = frame.split("\n");
        var command = (lines.shift() || "").trim();
        var headers = {};
        var line = null;

        while (lines.length > 0) {
            line = lines.shift();
            if (line === "") {
                break;
            }

            var separatorIndex = line.indexOf(":");
            if (separatorIndex === -1) {
                continue;
            }

            var headerKey = line.substring(0, separatorIndex);
            var headerValue = line.substring(separatorIndex + 1);
            headers[headerKey] = headerValue;
        }

        return {
            command: command,
            headers: headers,
            body: lines.join("\n")
        };
    }

    function SimpleStompClient(options) {
        this.url = options.url;
        this.token = options.token;
        this.destination = options.destination;
        this.attempt = options.attempt;
        this.socket = null;
        this.buffer = "";
        this.connected = false;
        this.heartbeatTimer = null;
        this.onStats = options.onStats;
        this.onConnected = options.onConnected;
        this.onClose = options.onClose;
        this.onError = options.onError;
    }

    SimpleStompClient.prototype.connect = function () {
        logInfo("Opening websocket.", {
            attempt: this.attempt,
            url: this.url,
            destination: this.destination
        });

        this.socket = new WebSocket(this.url, ["v12.stomp", "v11.stomp", "v10.stomp"]);
        this.buffer = "";

        this.socket.onopen = this.handleOpen.bind(this);
        this.socket.onmessage = this.handleMessage.bind(this);
        this.socket.onerror = this.handleError.bind(this);
        this.socket.onclose = this.handleSocketClose.bind(this);
    };

    SimpleStompClient.prototype.handleOpen = function () {
        logInfo("Websocket opened; sending STOMP CONNECT.", {
            attempt: this.attempt
        });

        this.sendFrame("CONNECT", {
            "accept-version": "1.2,1.1,1.0",
            "heart-beat": "0,10000"
        });
    };

    SimpleStompClient.prototype.handleMessage = function (event) {
        var rawMessage = event.data || "";
        if (rawMessage === "\n") {
            return;
        }

        this.buffer += rawMessage;
        var frameBoundary = this.buffer.indexOf("\u0000");

        while (frameBoundary !== -1) {
            var frame = this.buffer.substring(0, frameBoundary);
            this.buffer = this.buffer.substring(frameBoundary + 1);
            if (frame.trim() !== "") {
                this.handleFrame(parseFrame(frame));
            }
            frameBoundary = this.buffer.indexOf("\u0000");
        }
    };

    SimpleStompClient.prototype.handleFrame = function (frame) {
        logInfo("Received STOMP frame.", {
            attempt: this.attempt,
            command: frame.command,
            destination: frame.headers.destination || "",
            messageType: frame.command === "MESSAGE" ? (function () {
                try {
                    var parsedBody = JSON.parse(frame.body || "{}");
                    return parsedBody.name || "unknown";
                } catch (error) {
                    return "unparseable";
                }
            }()) : ""
        });

        if (frame.command === "CONNECTED") {
            this.connected = true;
            this.startHeartbeat();
            logInfo("STOMP connected; sending SUBSCRIBE and token frame.", {
                attempt: this.attempt,
                destination: this.destination
            });
            this.sendFrame("SUBSCRIBE", {
                id: "statisticSocket",
                destination: this.destination
            });
            this.sendFrame("SEND", {
                destination: "/public/token",
                Authorization: this.token,
                timestamp: String(Date.now())
            }, "empty");
            this.onConnected();
            return;
        }

        if (frame.command === "MESSAGE") {
            try {
                this.onStats(JSON.parse(frame.body));
            } catch (error) {
                this.onError(error);
            }
            return;
        }

        if (frame.command === "ERROR") {
            this.onError(new Error(frame.body || frame.headers.message || "Unknown websocket error"));
        }
    };

    SimpleStompClient.prototype.handleError = function (error) {
        logError("Websocket error event.", {
            attempt: this.attempt,
            error: getErrorLogDetails(error)
        });
        this.onError(error);
    };

    SimpleStompClient.prototype.handleSocketClose = function (event) {
        logWarn("Websocket closed.", {
            attempt: this.attempt,
            code: event && typeof event.code !== "undefined" ? event.code : null,
            reason: event && typeof event.reason !== "undefined" ? event.reason : "",
            wasClean: !!(event && event.wasClean)
        });
        this.connected = false;
        this.stopHeartbeat();
        this.onClose(event);
    };

    SimpleStompClient.prototype.sendFrame = function (command, headers, body) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return;
        }

        var frame = command + "\n";
        Object.keys(headers || {}).forEach(function (headerKey) {
            frame += headerKey + ":" + headers[headerKey] + "\n";
        });
        frame += "\n" + (body || "") + "\u0000";
        this.socket.send(frame);
    };

    SimpleStompClient.prototype.startHeartbeat = function () {
        var self = this;
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(function () {
            if (self.socket && self.socket.readyState === WebSocket.OPEN) {
                self.socket.send("\n");
            }
        }, 10000);
    };

    SimpleStompClient.prototype.stopHeartbeat = function () {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    };

    SimpleStompClient.prototype.disconnect = function () {
        this.stopHeartbeat();
        if (this.socket) {
            this.socket.close();
        }
    };

    function scheduleReconnect() {
        if (state.reconnectTimer) {
            clearTimeout(state.reconnectTimer);
        }

        state.reconnectAttempts += 1;
        var delay = reconnectDelays[Math.min(state.reconnectAttempts - 1, reconnectDelays.length - 1)];
        logWarn("Scheduling websocket reconnect.", {
            attempt: state.connectionAttempt,
            reconnectAttempt: state.reconnectAttempts,
            delayMs: delay
        });
        state.reconnectTimer = setTimeout(function () {
            connectToStatsStream();
        }, delay);
    }

    function handleStatsMessage(message) {
        if (!message || !message.name) {
            logWarn("Received websocket message without a recognized name.", {
                attempt: state.connectionAttempt,
                message: message
            });
            return;
        }

        if (message.name === "WebSocketSubscriptionStatusNotification") {
            logInfo("Received subscription status notification.", {
                attempt: state.connectionAttempt,
                status: message.status || "",
                result: message.result || "",
                reason: message.reason || ""
            });

            if (String(message.status || message.result || "").toUpperCase() !== "SUCCESS") {
                var failureReason = message.reason || "The supervisor stats subscription was rejected.";
                clearFirstStatsTimer();
                updateConnectionUi("error", failureReason);

                if (!state.hasRaisedInitialAlert) {
                    showConnectionAlert("Sorry, the live supervisor stats subscription failed. " + failureReason);
                    state.hasRaisedInitialAlert = true;
                }
            }

            return;
        }

        if (message.name !== "SupervisorStatsNotification") {
            logInfo("Ignoring unsupported websocket message.", {
                attempt: state.connectionAttempt,
                messageType: message.name
            });
            return;
        }

        state.eventCount += 1;
        logInfo("Received SupervisorStatsNotification.", {
            attempt: state.connectionAttempt,
            eventCount: state.eventCount,
            userId: message.userId || "",
            receivedAt: new Date().toISOString()
        });
        state.data = buildDashboardData(message);
        state.hasReceivedStats = true;
        state.hasRaisedInitialAlert = false;
        state.reconnectAttempts = 0;
        clearFirstStatsWarningTimer();
        clearFirstStatsTimer();
        clearDisconnectAlertTimer();
        cacheDashboardState();
        updateConnectionUi("connected", "Live supervisor stats are updating.");
        renderDashboards();
    }

    function handleSocketClose(event) {
        clearFirstStatsWarningTimer();
        clearFirstStatsTimer();

        if (state.ignoreNextClose) {
            logInfo("Ignoring websocket close triggered by intentional reconnect teardown.", {
                attempt: state.connectionAttempt
            });
            state.ignoreNextClose = false;
            return;
        }

        logWarn("Handling websocket close in dashboard state machine.", {
            attempt: state.connectionAttempt,
            event: event ? {
                code: event.code,
                reason: event.reason,
                wasClean: event.wasClean
            } : null,
            hasReceivedStats: state.hasReceivedStats
        });

        if (state.hasReceivedStats) {
            updateConnectionUi("reconnecting", "Attempting to restore the live supervisor feed.");
            scheduleLongDisconnectAlert();
        } else {
            updateConnectionUi("connecting", "Retrying the first live supervisor connection.");
            if (!state.hasRaisedInitialAlert) {
                showConnectionAlert("Sorry, the live dashboard could not connect yet. Please wait while it retries.");
                state.hasRaisedInitialAlert = true;
            }
        }

        scheduleReconnect();
    }

    function connectToStatsStream() {
        clearFirstStatsWarningTimer();
        clearFirstStatsTimer();
        clearDisconnectAlertTimer();
        state.connectionAttempt += 1;
        var connectionAttempt = state.connectionAttempt;
        logInfo("Starting live supervisor websocket attempt.", {
            attempt: connectionAttempt,
            session: getSessionLogDetails(state.session),
            hasReceivedStats: state.hasReceivedStats,
            previousEventCount: state.eventCount
        });
        updateConnectionUi(state.hasReceivedStats ? "reconnecting" : "connecting", state.hasReceivedStats ? "Attempting to restore the live supervisor feed." : "Waiting for the first live supervisor stats message.");

        if (state.stompClient) {
            state.ignoreNextClose = true;
            logInfo("Closing previous websocket client before reconnecting.", {
                attempt: connectionAttempt - 1
            });
            state.stompClient.disconnect();
        }

        requestStatsFilterActivation("connect-attempt-" + connectionAttempt, function () {
            if (connectionAttempt !== state.connectionAttempt) {
                logWarn("Skipping stale websocket connect after a newer attempt was started.", {
                    staleAttempt: connectionAttempt,
                    currentAttempt: state.connectionAttempt
                });
                return;
            }

            state.stompClient = new SimpleStompClient({
                url: state.session.endpoint,
                token: state.session.cookies.nccToken,
                destination: state.session.destination,
                attempt: connectionAttempt,
                onStats: handleStatsMessage,
                onConnected: function () {
                    scheduleFirstStatsTimeout();
                    logInfo("Dashboard marked websocket connection as connected.", {
                        attempt: state.connectionAttempt,
                        waitingForFirstStats: !state.hasReceivedStats
                    });
                    updateConnectionUi(state.hasReceivedStats ? "connected" : "connecting", state.hasReceivedStats ? "Live supervisor stats are updating." : "Connected. Waiting for the first stats message.");
                },
                onClose: handleSocketClose,
                onError: function (error) {
                    clearFirstStatsTimer();
                    clearFirstStatsWarningTimer();
                    logError("Dashboard received websocket error callback.", {
                        attempt: state.connectionAttempt,
                        error: getErrorLogDetails(error)
                    });
                    updateConnectionUi("error", "The live dashboard connection reported an error.");
                }
            });
            state.stompClient.connect();
        });
    }

    function bindDashboardFilterEvents() {
        [
            { id: "ncc_workitems_filter_media", handler: renderLiveWorkitems },
            { id: "ncc_workitems_filter_state", handler: renderLiveWorkitems },
            { id: "ncc_queue_filter_media", handler: renderQueueMonitor },
            { id: "ncc_queue_filter_focus", handler: renderQueueMonitor },
            { id: "ncc_queue_filter_staffing", handler: renderQueueMonitor },
            { id: "ncc_agent_filter_status", handler: renderAgentStatus },
            { id: "ncc_agent_filter_quality", handler: renderAgentStatus },
            { id: "ncc_agent_filter_channel", handler: renderAgentStatus }
        ].forEach(function (binding) {
            var element = document.getElementById(binding.id);
            if (!element || element.dataset.nccBound === "true") {
                return;
            }

            element.addEventListener("change", binding.handler);
            element.dataset.nccBound = "true";
        });
    }

    function applyInitialLiveFilters() {
        var page = document.querySelector("[data-ncc-dashboard-page='live-workitems']");
        if (!page) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var mediaFilter = document.getElementById("ncc_workitems_filter_media");
        var stateFilter = document.getElementById("ncc_workitems_filter_state");

        if (params.get("media")) {
            state.initialFilters.media = params.get("media");
        }

        if (params.get("state")) {
            state.initialFilters.state = params.get("state");
        }
    }

    function init() {
        if (!document.querySelector("[data-ncc-dashboard-page]")) {
            return;
        }

        state.session = getSession();
        logInfo("Initializing live supervisor dashboards.", {
            session: getSessionLogDetails(state.session),
            valid: state.session.valid,
            missingKeys: state.session.missingKeys || []
        });
        if (!state.session.valid) {
            updateConnectionUi("error", "Your session is missing required NCC websocket context.");
            showConnectionAlert("Sorry, your NCC session is missing websocket information. Please sign out and sign back in.");
            return;
        }

        bindDashboardFilterEvents();
        applyInitialLiveFilters();
        restoreCachedDashboardState();
        connectToStatsStream();
    }

    return {
        init: init
    };
}();

KTUtil.onDOMContentLoaded(function () {
    KTNCSSupervisorDashboards.init();
});