importScripts("inc/config-dispositions.js");
importScripts("inc/config-queues.js");
importScripts("inc/datadog.js");
importScripts("inc/ncc-business-events.js");
importScripts("inc/ncc-campaign-goals.js");
importScripts("inc/ncc-campaign-scripts.js");
importScripts("inc/ncc-campaigns.js");
importScripts("inc/ncc-categories.js");
importScripts("inc/ncc-category-summaries.js");
importScripts("inc/ncc-classifications.js");
importScripts("inc/ncc-dashboards.js");
importScripts("inc/ncc-dial-plans.js");
importScripts("inc/ncc-dispositions.js");
importScripts("inc/ncc-entities.js");
importScripts("inc/ncc-field-mappings.js");
importScripts("inc/ncc-file-servers.js");
importScripts("inc/ncc-filters.js");
importScripts("inc/ncc-functions.js");
importScripts("inc/ncc-home-tabs.js");
importScripts("inc/ncc-lists.js");
importScripts("inc/ncc-music.js");
importScripts("inc/ncc-partitions.js");
importScripts("inc/ncc-prompts.js");
importScripts("inc/ncc-queues.js");
importScripts("inc/ncc-reports.js");
importScripts("inc/ncc-rest-calls.js");
importScripts("inc/ncc-scripts.js");
importScripts("inc/ncc-scorecards.js");
importScripts("inc/ncc-services.js");
importScripts("inc/ncc-skills.js");
importScripts("inc/ncc-state-dids.js");
importScripts("inc/ncc-supervisor-queues.js");
importScripts("inc/ncc-survey-themes.js");
importScripts("inc/ncc-surveys.js");
importScripts("inc/ncc-templates.js");
importScripts("inc/ncc-time-events.js");
importScripts("inc/ncc-users.js");
importScripts("inc/ncc-user-profile-dispositions.js");
importScripts("inc/ncc-user-profiles.js");
importScripts("inc/ncc-user-queues.js");
importScripts("inc/ncc-whatsapp-templates.js");
importScripts("inc/ncc-widgets.js");
importScripts("inc/ncc-workflows.js");

onmessage = (event) => {

    // ==============================
    // Start
    // ==============================

    const startTime = performance.now();

    // ==============================
    // Set variables for user input
    // ==============================

    var config = JSON.parse(event.data);
    var action = config.action;
    var nccLocation = config.nccLocation;
    var nccToken = config.nccToken;
    var username = config.username;
    var campaigns = config.campaigns;
    var dialPlans = config.dialPlans;
    var templates = config.templates;
    var dispositions = config.dispositions;
    var entities = config.entities;
    var scorecards = config.scorecards;
    var classifications = config.classifications;
    var surveys = config.surveys;
    var surveyThemes = config.surveyThemes;
    var workflows = config.workflows;
    var partitions = config.partitions;
    var whatsAppTemplates = config.whatsAppTemplates;
    var campaignScripts = config.campaignScripts;
    var fieldMappings = config.fieldMappings;
    var functions = config.functions;
    var restCalls = config.restCalls;
    var scripts = config.scripts;
    var userProfiles = config.userProfiles;
    var queues = config.queues;
    var prompts = config.prompts;
    var categorySummaries = config.categorySummaries;
    var categories = config.categories;
    var skills = config.skills;
    var music = config.music;
    var campaignGoals = config.campaignGoals;
    var stateDids = config.stateDids;
    var businessEvents = config.businessEvents;
    var timeEvents = config.timeEvents;
    var fileServers = config.fileServers;
    var filters = config.filters;
    var reports = config.reports;
    var homeTabs = config.homeTabs;
    var widgets = config.widgets;
    var dashboards = config.dashboards;
    var importData = JSON.parse(config.importData);

    // Initial messages
    var updateMessage = "";
    var errorMessage = "";
    var fileIsValid = true;

    // ==============================
    // Review import
    // ==============================

    if (action == "review") {

        postEvent(
            "info",
            nccLocation,
            nccToken,
            "normal",
            "importcampaign",
            `Review of one or more campaigns started.`,
            "Review Started",
            username
        );

        // Business events
        if ("businessEvents" in importData) {

            // Check if user selected update
            if (businessEvents == "update") {
                postMessage(`[INFO] Checking business events...`);

                let businessEvents = importData.businessEvents;

                if (businessEvents.length > 0) {
                    businessEvents.forEach(businessEvent => {

                        // Get business event
                        let businessEventFound = getBusinessEventById(
                            nccLocation,
                            nccToken,
                            businessEvent._id
                        );

                        // Check if business event found
                        if (Object.keys(businessEventFound).length > 0) {
                            updateMessage += `\tBusiness event "${businessEventFound.name}"\n`;
                            postMessage(`[INFO] Business event with ID "${businessEvent._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No business events found in import file.`);
                }
            } else {
                postMessage(`[INFO] Business events not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "businessEvents" property found in import file.\n`;
            fileIsValid = false;
        }

        // Campaign goals
        if ("campaignGoals" in importData) {

            // Check if user selected update
            if (campaignGoals == "update") {
                postMessage(`[INFO] Checking campaign goals...`);

                let campaignGoals = importData.campaignGoals;

                if (campaignGoals.length > 0) {
                    campaignGoals.forEach(campaignGoal => {

                        // Get campaign goal
                        let campaignGoalFound = getCampaignGoalsById(
                            nccLocation,
                            nccToken,
                            campaignGoal._id
                        );

                        // Check if campaign goal found
                        if (Object.keys(campaignGoalFound).length > 0) {
                            updateMessage += `\tCampaign goal "${campaignGoalFound.name}"\n`;
                            postMessage(`[INFO] Campaign goal with ID "${campaignGoal._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No campaign goals found in import file.`);
                }
            } else {
                postMessage(`[INFO] Campaign goals not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "campaignGoals" property found in import file.\n`;
            fileIsValid = false;
        }

        // Campaign scripts
        if ("campaignScripts" in importData) {

            // Check if user selected update
            if (campaignScripts == "update") {
                postMessage(`[INFO] Checking campaign scripts...`);

                let campaignScripts = importData.campaignScripts;

                if (campaignScripts.length > 0) {
                    campaignScripts.forEach(campaignScript => {

                        // Get campaign script
                        let campaignScriptFound = getCampaignScriptById(
                            nccLocation,
                            nccToken,
                            campaignScript._id
                        );

                        // Check if campaign script found
                        if (Object.keys(campaignScriptFound).length > 0) {
                            updateMessage += `\tCampaign script "${campaignScriptFound.name}"\n`;
                            postMessage(`[INFO] Campaign script with ID "${campaignScript._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No campaign scripts found in import file.`);
                }
            } else {
                postMessage(`[INFO] Campaign scripts not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "campaignScripts" property found in import file.\n`;
            fileIsValid = false;
        }

        // Campaigns
        if ("campaigns" in importData) {

            // Check if user selected update
            if (campaigns == "update") {
                postMessage(`[INFO] Checking campaigns...`);

                let campaigns = importData.campaigns;

                if (campaigns.length > 0) {
                    campaigns.forEach(campaign => {

                        // Get campaign
                        let campaignFound = getCampaignById(
                            nccLocation,
                            nccToken,
                            campaign._id
                        );

                        // Check if campaign found
                        if (Object.keys(campaignFound).length > 0) {
                            updateMessage += `\tCampaign "${campaignFound.name}"\n`;
                            postMessage(`[INFO] Campaign with ID "${campaign._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No campaigns found in import file.`);
                }
            } else {
                postMessage(`[INFO] Campaigns not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "campaigns" property found in import file.\n`;
            fileIsValid = false;
        }

        // Categories
        if ("categories" in importData) {

            // Check if user selected update
            if (categories == "update") {
                postMessage(`[INFO] Checking categories...`);

                let categories = importData.categories;

                if (categories.length > 0) {
                    categories.forEach(category => {

                        // Get category
                        let categoryFound = getCategoryById(
                            nccLocation,
                            nccToken,
                            category._id
                        );

                        // Check if category found
                        if (Object.keys(categoryFound).length > 0) {
                            updateMessage += `\tCategory "${categoryFound.name}"\n`;
                            postMessage(`[INFO] Category with ID "${category._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No categories found in import file.`);
                }
            } else {
                postMessage(`[INFO] Categories not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "categories" property found in import file.\n`;
            fileIsValid = false;
        }

        // Category summaries
        if ("categorySummaries" in importData) {

            // Check if user selected update
            if (categorySummaries == "update") {
                postMessage(`[INFO] Checking category summaries...`);

                let categorySummaries = importData.categorySummaries;

                if (categorySummaries.length > 0) {
                    categorySummaries.forEach(categorySummary => {

                        // Get category summary
                        let categorySummaryFound = getCategorySummaryById(
                            nccLocation,
                            nccToken,
                            categorySummary._id
                        );

                        // Check if category summary found
                        if (Object.keys(categorySummaryFound).length > 0) {
                            updateMessage += `\tCategory summary "${categorySummaryFound.name}"\n`;
                            postMessage(`[INFO] Category summary with ID "${categorySummary._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No category summaries found in import file.`);
                }
            } else {
                postMessage(`[INFO] Category summaries not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "categorySummaries" property found in import file.\n`;
            fileIsValid = false;
        }

        // Classifications
        if ("classifications" in importData) {

            // Check if user selected update
            if (classifications == "update") {
                postMessage(`[INFO] Checking classifications...`);

                let classifications = importData.classifications;

                if (classifications.length > 0) {
                    classifications.forEach(classification => {

                        // Get classification
                        let classificationFound = getClassificationById(
                            nccLocation,
                            nccToken,
                            classification._id
                        );

                        // Check if classification found
                        if (Object.keys(classificationFound).length > 0) {
                            updateMessage += `\tClassification "${classificationFound.name}"\n`;
                            postMessage(`[INFO] Classification with ID "${classification._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No classifications found in import file.`);
                }
            } else {
                postMessage(`[INFO] Classifications not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "classifications" property found in import file.\n`;
            fileIsValid = false;
        }

        // Dashboards
        if ("dashboards" in importData) {

            // Check if user selected update
            if (dashboards == "update") {
                postMessage(`[INFO] Checking dashboards...`);

                let dashboards = importData.dashboards;

                if (dashboards.length > 0) {
                    dashboards.forEach(dashboard => {

                        // Get dashboard
                        let dashboardFound = getDashboardById(
                            nccLocation,
                            nccToken,
                            dashboard._id
                        );

                        // Check if dashboard found
                        if (Object.keys(dashboardFound).length > 0) {
                            updateMessage += `\tDashboard "${dashboardFound.name}"\n`;
                            postMessage(`[INFO] Dashboard with ID "${dashboard._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No dashboards found in import file.`);
                }
            } else {
                postMessage(`[INFO] Dashboards not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "dashboards" property found in import file.\n`;
            fileIsValid = false;
        }

        // Dial plans
        if ("dialPlans" in importData) {

            // Check if user selected update
            if (dialPlans == "update") {
                postMessage(`[INFO] Checking dial plans...`);

                let dialPlans = importData.dialPlans;

                if (dialPlans.length > 0) {
                    dialPlans.forEach(dialPlan => {

                        // Get dial plan
                        let dialPlanFound = getDialPlanById(
                            nccLocation,
                            nccToken,
                            dialPlan._id
                        );

                        // Check if dial plan found
                        if (Object.keys(dialPlanFound).length > 0) {
                            updateMessage += `\tDial plan "${dialPlanFound.name}"\n`;
                            postMessage(`[INFO] Dial plan with ID "${dialPlan._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No dial plans found in import file.`);
                }
            } else {
                postMessage(`[INFO] Dial plans not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "dialPlans" property found in import file.\n`;
            fileIsValid = false;
        }

        // Dispositions
        if ("dispositions" in importData) {

            // Check if user selected update
            if (dispositions == "update") {
                postMessage(`[INFO] Checking dispositions...`);

                let dispositions = importData.dispositions;

                if (dispositions.length > 0) {
                    dispositions.forEach(disposition => {

                        // Get disposition
                        let dispositionFound = getDispositionById(
                            nccLocation,
                            nccToken,
                            disposition._id
                        );

                        // Check if disposition found
                        if (Object.keys(dispositionFound).length > 0) {
                            updateMessage += `\tDisposition "${dispositionFound.name}"\n`;
                            postMessage(`[INFO] Disposition with ID "${disposition._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No dispositions found in import file.`);
                }
            } else {
                postMessage(`[INFO] Dispositions not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "dispositions" property found in import file.\n`;
            fileIsValid = false;
        }

        // Entities
        if ("entities" in importData) {

            // Check if user selected update
            if (entities == "update") {
                postMessage(`[INFO] Checking entities...`);

                let entities = importData.entities;

                if (entities.length > 0) {
                    entities.forEach(entity => {

                        // Get entity
                        let entityFound = getEntityById(
                            nccLocation,
                            nccToken,
                            entity._id
                        );

                        // Check if entity found
                        if (Object.keys(entityFound).length > 0) {
                            updateMessage += `\tEntity "${entityFound.name}"\n`;
                            postMessage(`[INFO] Entity with ID "${entity._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No entities found in import file.`);
                }
            } else {
                postMessage(`[INFO] Entities not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "entities" property found in import file.\n`;
            fileIsValid = false;
        }

        // Field mappingss
        if ("fieldMappings" in importData) {

            // Check if user selected update
            if (fieldMappings == "update") {
                postMessage(`[INFO] Checking field mappings...`);

                let fieldMappings = importData.fieldMappings;

                if (fieldMappings.length > 0) {
                    fieldMappings.forEach(fieldMapping => {

                        // Get field mappings
                        let fieldMappingFound = getFieldMappingsById(
                            nccLocation,
                            nccToken,
                            fieldMapping._id
                        );

                        // Check if field mappings found
                        if (Object.keys(fieldMappingFound).length > 0) {
                            updateMessage += `\tField mappings "${fieldMappingFound.name}"\n`;
                            postMessage(`[INFO] Field mappings with ID "${fieldMapping._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No field mappings found in import file.`);
                }
            } else {
                postMessage(`[INFO] Field mappings not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "fieldMappings" property found in import file.\n`;
            fileIsValid = false;
        }

        // File servers
        if ("fileServers" in importData) {

            // Check if user selected update
            if (fileServers == "update") {
                postMessage(`[INFO] Checking file servers...`);

                let fileServers = importData.fileServers;

                if (fileServers.length > 0) {
                    fileServers.forEach(fileServer => {

                        // Get file server
                        let fileServerFound = getFileServerById(
                            nccLocation,
                            nccToken,
                            fileServer._id
                        );

                        // Check if file server found
                        if (Object.keys(fileServerFound).length > 0) {
                            updateMessage += `\tFile server "${fileServerFound.name}"\n`;
                            postMessage(`[INFO] File server with ID "${fileServer._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No file servers found in import file.`);
                }
            } else {
                postMessage(`[INFO] File servers not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "fileServers" property found in import file.\n`;
            fileIsValid = false;
        }

        // Filters
        if ("filters" in importData) {

            // Check if user selected update
            if (filters == "update") {
                postMessage(`[INFO] Checking filters...`);

                let filters = importData.filters;

                if (filters.length > 0) {
                    filters.forEach(filter => {

                        // Get filter
                        let filterFound = getFilterById(
                            nccLocation,
                            nccToken,
                            filter._id
                        );

                        // Check if filter found
                        if (Object.keys(filterFound).length > 0) {
                            updateMessage += `\tFilter "${filterFound.name}"\n`;
                            postMessage(`[INFO] Filter with ID "${filter._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No filters found in import file.`);
                }
            } else {
                postMessage(`[INFO] Filters not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "filters" property found in import file.\n`;
            fileIsValid = false;
        }

        // Functions
        if ("functions" in importData) {

            // Check if user selected update
            if (functions == "update") {
                postMessage(`[INFO] Checking functions...`);

                let functions = importData.functions;

                if (functions.length > 0) {
                    functions.forEach(nccFunction => {

                        // Get function
                        let functionFound = getFunctionById(
                            nccLocation,
                            nccToken,
                            nccFunction._id
                        );

                        // Check if function found
                        if (Object.keys(functionFound).length > 0) {
                            updateMessage += `\tFunction "${functionFound.name}"\n`;
                            postMessage(`[INFO] Function with ID "${nccFunction._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No functions found in import file.`);
                }
            } else {
                postMessage(`[INFO] Functions not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "functions" property found in import file.\n`;
            fileIsValid = false;
        }

        // Home tabs
        if ("homeTabs" in importData) {

            // Check if user selected update
            if (homeTabs == "update") {
                postMessage(`[INFO] Checking home tabs...`);

                let homeTabs = importData.homeTabs;

                if (homeTabs.length > 0) {
                    homeTabs.forEach(homeTab => {

                        // Get home tab
                        let homeTabFound = getHomeTabById(
                            nccLocation,
                            nccToken,
                            homeTab._id
                        );

                        // Check if home tab found
                        if (Object.keys(homeTabFound).length > 0) {
                            updateMessage += `\tHome tab "${homeTabFound.name}"\n`;
                            postMessage(`[INFO] Home tab with ID "${homeTab._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No home tabs found in import file.`);
                }
            } else {
                postMessage(`[INFO] Home tabs not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "home tabs" property found in import file.\n`;
            fileIsValid = false;
        }

        // Music
        if ("music" in importData) {

            // Check if user selected update
            if (music == "update") {
                postMessage(`[INFO] Checking music...`);

                let music = importData.music;

                if (music.length > 0) {
                    music.forEach(music => {

                        // Get music
                        let musicFound = getMusicById(
                            nccLocation,
                            nccToken,
                            music._id
                        );

                        // Check if music found
                        if (Object.keys(musicFound).length > 0) {
                            updateMessage += `\tMusic "${musicFound.name}"\n`;
                            postMessage(`[INFO] Music with ID "${music._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No music found in import file.`);
                }
            } else {
                postMessage(`[INFO] Music not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "music" property found in import file.\n`;
            fileIsValid = false;
        }

        // Partitions
        if ("partitions" in importData) {

            // Check if user selected update
            if (partitions == "update") {
                postMessage(`[INFO] Checking partitions...`);

                let partitions = importData.partitions;

                if (partitions.length > 0) {
                    partitions.forEach(partition => {

                        // Get partition
                        let partitionFound = getPartitionById(
                            nccLocation,
                            nccToken,
                            partition._id
                        );

                        // Check if partition found
                        if (Object.keys(partitionFound).length > 0) {
                            updateMessage += `\tPartition "${partitionFound.name}"\n`;
                            postMessage(`[INFO] Partition with ID "${partition._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No partitions found in import file.`);
                }
            } else {
                postMessage(`[INFO] Partitions not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "partitions" property found in import file.\n`;
            fileIsValid = false;
        }

        // Prompts
        if ("prompts" in importData) {

            // Check if user selected update
            if (prompts == "update") {
                postMessage(`[INFO] Checking prompts...`);

                let prompts = importData.prompts;

                if (prompts.length > 0) {
                    prompts.forEach(prompt => {

                        // Get prompt
                        let promptFound = getPromptById(
                            nccLocation,
                            nccToken,
                            prompt._id
                        );

                        // Check if prompt found
                        if (Object.keys(promptFound).length > 0) {
                            updateMessage += `\tPrompt "${promptFound.name}"\n`;
                            postMessage(`[INFO] Prompt with ID "${prompt._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No prompts found in import file.`);
                }
            } else {
                postMessage(`[INFO] Prompts not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "prompts" property found in import file.\n`;
            fileIsValid = false;
        }

        // Queues
        if ("queues" in importData) {

            // Check if user selected update
            if (queues == "update") {
                postMessage(`[INFO] Checking queues...`);

                let queues = importData.queues;

                if (queues.length > 0) {
                    queues.forEach(queue => {

                        // Get queue
                        let queueFound = getQueueById(
                            nccLocation,
                            nccToken,
                            queue._id
                        );

                        // Check if queue found
                        if (Object.keys(queueFound).length > 0) {
                            updateMessage += `\tQueue "${queueFound.name}"\n`;
                            postMessage(`[INFO] Queue with ID "${queue._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No queues found in import file.`);
                }
            } else {
                postMessage(`[INFO] Queues not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "queues" property found in import file.\n`;
            fileIsValid = false;
        }

        // Reports
        if ("reports" in importData) {

            // Check if user selected update
            if (reports == "update") {
                postMessage(`[INFO] Checking reports...`);

                let reports = importData.reports;

                if (reports.length > 0) {
                    reports.forEach(report => {

                        // Get report
                        let reportFound = getReportById(
                            nccLocation,
                            nccToken,
                            report._id
                        );

                        // Check if report found
                        if (Object.keys(reportFound).length > 0) {
                            updateMessage += `\tReport "${reportFound.name}"\n`;
                            postMessage(`[INFO] Report with ID "${report._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No reports found in import file.`);
                }
            } else {
                postMessage(`[INFO] Reports not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "reports" property found in import file.\n`;
            fileIsValid = false;
        }

        // REST calls
        if ("restCalls" in importData) {

            // Check if user selected update
            if (restCalls == "update") {
                postMessage(`[INFO] Checking REST calls...`);

                let restCalls = importData.restCalls;

                if (restCalls.length > 0) {
                    restCalls.forEach(restCall => {

                        // Get REST call
                        let restCallFound = getRestCallById(
                            nccLocation,
                            nccToken,
                            restCall._id
                        );

                        // Check if REST call found
                        if (Object.keys(restCallFound).length > 0) {
                            updateMessage += `\tREST call "${restCallFound.name}"\n`;
                            postMessage(`[INFO] REST call with ID "${restCall._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No REST calls found in import file.`);
                }
            } else {
                postMessage(`[INFO] REST calls not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "restCalls" property found in import file.\n`;
            fileIsValid = false;
        }

        // Scorecards
        if ("scorecards" in importData) {

            // Check if user selected update
            if (scorecards == "update") {
                postMessage(`[INFO] Checking scorecards...`);

                let scorecards = importData.scorecards;

                if (scorecards.length > 0) {
                    scorecards.forEach(scorecard => {

                        // Get scorecard
                        let scorecardFound = getScorecardById(
                            nccLocation,
                            nccToken,
                            scorecard._id
                        );

                        // Check if scorecard found
                        if (Object.keys(scorecardFound).length > 0) {
                            updateMessage += `\tScorecard "${scorecardFound.name}"\n`;
                            postMessage(`[INFO] Scorecard with ID "${scorecard._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No scorecards found in import file.`);
                }
            } else {
                postMessage(`[INFO] Scorecards not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "scorecards" property found in import file.\n`;
            fileIsValid = false;
        }

        // Scripts
        if ("scripts" in importData) {

            // Check if user selected update
            if (scripts == "update") {
                postMessage(`[INFO] Checking scripts...`);

                let scripts = importData.scripts;

                if (scripts.length > 0) {
                    scripts.forEach(script => {

                        // Get script
                        let scriptFound = getScriptById(
                            nccLocation,
                            nccToken,
                            script._id
                        );

                        // Check if script found
                        if (Object.keys(scriptFound).length > 0) {
                            updateMessage += `\tScript "${scriptFound.name}"\n`;
                            postMessage(`[INFO] Script with ID "${script._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No scripts found in import file.`);
                }
            } else {
                postMessage(`[INFO] Scripts not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "scripts" property found in import file.\n`;
            fileIsValid = false;
        }

        // Skills
        if ("skills" in importData) {

            // Check if user selected update
            if (skills == "update") {
                postMessage(`[INFO] Checking skills...`);

                let skills = importData.skills;

                if (skills.length > 0) {
                    skills.forEach(skill => {

                        // Get skill
                        let skillFound = getSkillById(
                            nccLocation,
                            nccToken,
                            skill._id
                        );

                        // Check if skill found
                        if (Object.keys(skillFound).length > 0) {
                            updateMessage += `\tSkill "${skillFound.name}"\n`;
                            postMessage(`[INFO] Skill with ID "${skill._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No skills found in import file.`);
                }
            } else {
                postMessage(`[INFO] Skills not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "skills" property found in import file.\n`;
            fileIsValid = false;
        }

        // State DIDs
        if ("stateDids" in importData) {

            // Check if user selected update
            if (stateDids == "update") {
                postMessage(`[INFO] Checking state DIDs...`);

                let stateDids = importData.stateDids;

                if (stateDids.length > 0) {
                    stateDids.forEach(stateDid => {

                        // Get state DID
                        let stateDidFound = getStateDidById(
                            nccLocation,
                            nccToken,
                            stateDid._id
                        );

                        // Check if state DID found
                        if (Object.keys(stateDidFound).length > 0) {
                            updateMessage += `\tState DID "${stateDidFound.name}"\n`;
                            postMessage(`[INFO] State DID with ID "${stateDid._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No state DIDs found in import file.`);
                }
            } else {
                postMessage(`[INFO] State DIDs not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "stateDids" property found in import file.\n`;
            fileIsValid = false;
        }

        // Survey themes
        if ("surveyThemes" in importData) {

            // Check if user selected update
            if (surveyThemes == "update") {
                postMessage(`[INFO] Checking survey themes...`);

                let surveyThemes = importData.surveyThemes;

                if (surveyThemes.length > 0) {
                    surveyThemes.forEach(surveyTheme => {

                        // Get survey theme
                        let surveyThemeFound = getSurveyThemeById(
                            nccLocation,
                            nccToken,
                            surveyTheme._id
                        );

                        // Check if survey theme found
                        if (Object.keys(surveyThemeFound).length > 0) {
                            updateMessage += `\tSurvey theme "${surveyThemeFound.name}"\n`;
                            postMessage(`[INFO] Survey theme with ID "${surveyTheme._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No survey themes found in import file.`);
                }
            } else {
                postMessage(`[INFO] Survey themes not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "surveyThemes" property found in import file.\n`;
            fileIsValid = false;
        }

        // Surveys
        if ("surveys" in importData) {

            // Check if user selected update
            if (surveys == "update") {
                postMessage(`[INFO] Checking surveys...`);

                let surveys = importData.surveys;

                if (surveys.length > 0) {
                    surveys.forEach(survey => {

                        // Get survey
                        let surveyFound = getSurveyById(
                            nccLocation,
                            nccToken,
                            survey._id
                        );

                        // Check if survey found
                        if (Object.keys(surveyFound).length > 0) {
                            updateMessage += `\tSurvey "${surveyFound.name}"\n`;
                            postMessage(`[INFO] Survey with ID "${survey._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No surveys found in import file.`);
                }
            } else {
                postMessage(`[INFO] Surveys not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "surveys" property found in import file.\n`;
            fileIsValid = false;
        }

        // Templates
        if ("templates" in importData) {

            // Check if user selected update
            if (templates == "update") {
                postMessage(`[INFO] Checking templates...`);

                let templates = importData.templates;

                if (templates.length > 0) {
                    templates.forEach(template => {

                        // Get template
                        let templateFound = getTemplateById(
                            nccLocation,
                            nccToken,
                            template._id
                        );

                        // Check if template found
                        if (Object.keys(templateFound).length > 0) {
                            updateMessage += `\tTemplate "${templateFound.name}"\n`;
                            postMessage(`[INFO] Template with ID "${template._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No templates found in import file.`);
                }
            } else {
                postMessage(`[INFO] Templates not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "templates" property found in import file.\n`;
            fileIsValid = false;
        }

        // Time events
        if ("timeEvents" in importData) {

            // Check if user selected update
            if (timeEvents == "update") {
                postMessage(`[INFO] Checking time events...`);

                let timeEvents = importData.timeEvents;

                if (timeEvents.length > 0) {
                    timeEvents.forEach(timeEvent => {

                        // Get time event
                        let timeEventFound = getTimeEventById(
                            nccLocation,
                            nccToken,
                            timeEvent._id
                        );

                        // Check if time event found
                        if (Object.keys(timeEventFound).length > 0) {
                            updateMessage += `\tTime event "${timeEventFound.name}"\n`;
                            postMessage(`[INFO] Time event with ID "${timeEvent._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No time events found in import file.`);
                }
            } else {
                postMessage(`[INFO] Time events not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "timeEvents" property found in import file.\n`;
            fileIsValid = false;
        }

        // User profiles
        if ("userProfiles" in importData) {

            // Check if user selected update
            if (userProfiles == "update") {
                postMessage(`[INFO] Checking User profiles...`);

                let userProfiles = importData.userProfiles;

                if (userProfiles.length > 0) {
                    userProfiles.forEach(userProfile => {

                        // Get user profile
                        let userProfileFound = getUserProfileById(
                            nccLocation,
                            nccToken,
                            userProfile._id
                        );

                        // Check if user profile found
                        if (Object.keys(userProfileFound).length > 0) {
                            updateMessage += `\tUser profile "${userProfileFound.name}"\n`;
                            postMessage(`[INFO] User profile with ID "${userProfile._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No user profiles found in import file.`);
                }
            } else {
                postMessage(`[INFO] User profiles not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "userProfiles" property found in import file.\n`;
            fileIsValid = false;
        }

        // WhatsApp templates
        if ("whatsAppTemplates" in importData) {

            // Check if user selected update
            if (whatsAppTemplates == "update") {
                postMessage(`[INFO] Checking WhatsApp templates...`);

                let whatsAppTemplates = importData.whatsAppTemplates;

                if (whatsAppTemplates.length > 0) {
                    whatsAppTemplates.forEach(whatsAppTemplate => {

                        // Get WhatsApp template
                        let whatsAppTemplateFound = getWhatsAppTemplateById(
                            nccLocation,
                            nccToken,
                            whatsAppTemplate._id
                        );

                        // Check if WhatsApp template found
                        if (Object.keys(whatsAppTemplateFound).length > 0) {
                            updateMessage += `\tWhatsApp template "${whatsAppTemplateFound.name}"\n`;
                            postMessage(`[INFO] WhatsApp template with ID "${whatsAppTemplate._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No WhatsApp templates found in import file.`);
                }
            } else {
                postMessage(`[INFO] WhatsApp templates not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "whatsAppTemplates" property found in import file.\n`;
            fileIsValid = false;
        }

        // Widgets
        if ("widgets" in importData) {

            // Check if user selected update
            if (widgets == "update") {
                postMessage(`[INFO] Checking widgets...`);

                let widgets = importData.widgets;

                if (widgets.length > 0) {
                    widgets.forEach(widget => {

                        // Get widget
                        let widgetFound = getWidgetById(
                            nccLocation,
                            nccToken,
                            widget._id
                        );

                        // Check if widget found
                        if (Object.keys(widgetFound).length > 0) {
                            updateMessage += `\tWidget "${widgetFound.name}"\n`;
                            postMessage(`[INFO] Widget with ID "${widget._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No widgets found in import file.`);
                }
            } else {
                postMessage(`[INFO] Widgets not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "widgets" property found in import file.\n`;
            fileIsValid = false;
        }

        // Workflows
        if ("workflows" in importData) {

            // Check if user selected update
            if (workflows == "update") {
                postMessage(`[INFO] Checking workflows...`);

                let workflows = importData.workflows;

                if (workflows.length > 0) {
                    workflows.forEach(workflow => {

                        // Get workflow
                        let workflowFound = getWorkflowById(
                            nccLocation,
                            nccToken,
                            workflow._id
                        );

                        // Check if workflow found
                        if (Object.keys(workflowFound).length > 0) {
                            updateMessage += `\tWorkflow "${workflowFound.name}"\n`;
                            postMessage(`[INFO] Workflow with ID "${workflow._id}" found.`);
                        }
                    });
                } else {
                    postMessage(`[INFO] No workflows found in import file.`);
                }
            } else {
                postMessage(`[INFO] Workflows not selected for update.`);
            }
        } else {
            errorMessage += `\tNo "workflows" property found in import file.\n`;
            fileIsValid = false;
        }

        // Review output
        if (updateMessage != "") {
            postMessage(``);
            postMessage(`[INFO] The following object(s) already exist and will be updated:`);
            postMessage(``);
            postMessage(updateMessage);
        } else if (errorMessage == "") {
            postMessage(``);
            postMessage(`[INFO] No existing objects will be updated as a result of this import.`);
        }

        if (fileIsValid) {
            postEvent(
                "success",
                nccLocation,
                nccToken,
                "normal",
                "importcampaign",
                `Review of one or more campaigns completed.`,
                "Review Completed",
                username
            );
        } else {
            postEvent(
                "error",
                nccLocation,
                nccToken,
                "normal",
                "importcampaign",
                `Review of one or more campaigns failed.`,
                "Review Failed",
                username
            );
        }

        // End Review
        postMessage({
            "action": "review",
            "status": "complete",
            "fileIsValid": fileIsValid
        });
    }

    // ==============================
    // Process submit
    // ==============================

    if (action == "submit") {

        postEvent(
            "info",
            nccLocation,
            nccToken,
            "normal",
            "importcampaign",
            `Import of one or more campaigns started.`,
            "Import Started",
            username
        );

        // Business events
        if (businessEvents != "ignore") {

            // Check if business events in import file
            if (importData.businessEvents.length > 0) {
                let existingBusinessEvents = importData.businessEvents;

                // Process business event
                existingBusinessEvents.forEach(existingBusinessEvent => {

                    // Create flow
                    if (businessEvents == "create") {

                        // Get business event
                        let businessEvent = getBusinessEventById(
                            nccLocation,
                            nccToken,
                            existingBusinessEvent._id
                        );

                        // Check if business event found
                        if (Object.keys(businessEvent).length > 0) {
                            postMessage(`[INFO] Business event with ID "${existingBusinessEvent._id}" already exists with name "${businessEvent.name}".`);
                        } else {

                            // Check if business event with same name already exists
                            let businessEvent = getBusinessEventByName(
                                nccLocation,
                                nccToken,
                                existingBusinessEvent.name
                            );

                            if (Object.keys(businessEvent).length > 0) {
                                postMessage(`[WARNING] Business event with name "${existingBusinessEvent.name}" already exists.`);
                            } else {

                                // Create business event
                                let success = upsertBusinessEvent(
                                    nccLocation,
                                    nccToken,
                                    existingBusinessEvent
                                );

                                // Check if business event created
                                if (success) {
                                    postMessage(`[INFO] Business event "${existingBusinessEvent.name}" created.`);
                                } else {
                                    errorMessage += `\tBusiness event "${existingBusinessEvent.name}" not created.\n`;
                                    postMessage(`[ERROR] Business event "${existingBusinessEvent.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (businessEvents == "update") {

                        // Update business event
                        let success = upsertBusinessEvent(
                            nccLocation,
                            nccToken,
                            existingBusinessEvent
                        );

                        // Check if business event updated
                        if (success) {
                            postMessage(`[INFO] Business event "${existingBusinessEvent.name}" updated.`);
                        } else {
                            errorMessage += `\tBusiness event "${existingBusinessEvent.name}" not updated.\n`;
                            postMessage(`[ERROR] Business event "${existingBusinessEvent.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No business events found in import file.`);
            }
        } else {
            postMessage(`[INFO] Business events ignored.`);
        }

        // Campaign goals
        if (campaignGoals != "ignore") {

            // Check if campaign goals in import file
            if (importData.campaignGoals.length > 0) {
                let existingCampaignGoals = importData.campaignGoals;

                // Process campaign goal
                existingCampaignGoals.forEach(existingCampaignGoal => {

                    // Create flow
                    if (campaignGoals == "create") {

                        // Get campaign goal
                        let campaignGoal = getCampaignGoalsById(
                            nccLocation,
                            nccToken,
                            existingCampaignGoal._id
                        );

                        // Check if campaign goal found
                        if (Object.keys(campaignGoal).length > 0) {
                            postMessage(`[INFO] Campaign goal with ID "${existingCampaignGoal._id}" already exists with name "${campaignGoal.name}".`);
                        } else {

                            // Check if campaign goal with same name already exists
                            let campaignGoal = getCampaignGoalByName(
                                nccLocation,
                                nccToken,
                                existingCampaignGoal.name
                            );

                            if (Object.keys(campaignGoal).length > 0) {
                                postMessage(`[WARNING] Campaign goal with name "${existingCampaignGoal.name}" already exists.`);
                            } else {

                                // Create campaign goal
                                let success = upsertCampaignGoal(
                                    nccLocation,
                                    nccToken,
                                    existingCampaignGoal
                                );

                                // Check if campaign goal created
                                if (success) {
                                    postMessage(`[INFO] Campaign goal "${existingCampaignGoal.name}" created.`);
                                } else {
                                    errorMessage += `\tCampaign goal "${existingCampaignGoal.name}" not created.\n`;
                                    postMessage(`[ERROR] Campaign goal "${existingCampaignGoal.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (campaignGoals == "update") {

                        // Update campaign goal
                        let success = upsertCampaignGoal(
                            nccLocation,
                            nccToken,
                            existingCampaignGoal
                        );

                        // Check if campaign goal updated
                        if (success) {
                            postMessage(`[INFO] Campaign goal "${existingCampaignGoal.name}" updated.`);
                        } else {
                            errorMessage += `\tCampaign goal "${existingCampaignGoal.name}" not updated.\n`;
                            postMessage(`[ERROR] Campaign goal "${existingCampaignGoal.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No campaign goals found in import file.`);
            }
        } else {
            postMessage(`[INFO] Campaign goals ignored.`);
        }

        // Campaign scripts
        if (campaignScripts != "ignore") {

            // Check if campaign scripts in import file
            if (importData.campaignScripts.length > 0) {
                let existingCampaignScripts = importData.campaignScripts;

                // Process campaign scripts
                existingCampaignScripts.forEach(existingCampaignScript => {

                    // Create flow
                    if (campaignScripts == "create") {

                        // Get campaign script
                        let campaignScript = getCampaignScriptById(
                            nccLocation,
                            nccToken,
                            existingCampaignScript._id
                        );

                        // Check if campaign script found
                        if (Object.keys(campaignScript).length > 0) {
                            postMessage(`[INFO] Campaign script with ID "${existingCampaignScript._id}" already exists with name "${campaignScript.name}".`);
                        } else {

                            // Check if campaign script with same name already exists
                            let campaignScript = getCampaignScriptByName(
                                nccLocation,
                                nccToken,
                                existingCampaignScript.name
                            );

                            if (Object.keys(campaignScript).length > 0) {
                                postMessage(`[WARNING] Campaign script with name "${existingCampaignScript.name}" already exists.`);
                            } else {

                                // Create campaign script
                                let success = upsertCampaignScript(
                                    nccLocation,
                                    nccToken,
                                    existingCampaignScript
                                );

                                // Check if campaign script created
                                if (success) {
                                    postMessage(`[INFO] Campaign script "${existingCampaignScript.name}" created.`);
                                } else {
                                    errorMessage += `\tCampaign script "${existingCampaignScript.name}" not created.\n`;
                                    postMessage(`[ERROR] Campaign script "${existingCampaignScript.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (campaignScripts == "update") {

                        // Update campaign script
                        let success = upsertCampaignScript(
                            nccLocation,
                            nccToken,
                            existingCampaignScript
                        );

                        // Check if campaign script updated
                        if (success) {
                            postMessage(`[INFO] Campaign script "${existingCampaignScript.name}" updated.`);
                        } else {
                            errorMessage += `\tCampaign script "${existingCampaignScript.name}" not updated.\n`;
                            postMessage(`[ERROR] Campaign script "${existingCampaignScript.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No campaign scripts found in import file.`);
            }
        } else {
            postMessage(`[INFO] Campaign scripts ignored.`);
        }

        // Campaigns
        if (campaigns != "ignore") {

            // Check if campaigns in import file
            if (importData.campaigns.length > 0) {
                let existingCampaigns = importData.campaigns;

                // Process campaigns
                existingCampaigns.forEach(existingCampaign => {

                    // Create flow
                    if (campaigns == "create") {

                        // Get campaign
                        let campaign = getCampaignById(
                            nccLocation,
                            nccToken,
                            existingCampaign._id
                        );

                        // Check if campaign found
                        if (Object.keys(campaign).length > 0) {
                            postMessage(`[INFO] Campaign with ID "${existingCampaign._id}" already exists with name "${campaign.name}".`);
                        } else {

                            // Check if campaign with same name already exists
                            let campaign = getCampaignByName(
                                nccLocation,
                                nccToken,
                                existingCampaign.name
                            );

                            if (Object.keys(campaign).length > 0) {
                                postMessage(`[WARNING] Campaign with name "${existingCampaign.name}" already exists.`);
                            } else {

                                // Create campaign
                                let success = upsertCampaign(
                                    nccLocation,
                                    nccToken,
                                    existingCampaign
                                );

                                // Check if campaign created
                                if (success) {
                                    postMessage(`[INFO] Campaign "${existingCampaign.name}" created.`);
                                } else {
                                    errorMessage += `\tCampaign "${existingCampaign.name}" not created.\n`;
                                    postMessage(`[ERROR] Campaign "${existingCampaign.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (campaigns == "update") {

                        // Update campaign
                        let success = upsertCampaign(
                            nccLocation,
                            nccToken,
                            existingCampaign
                        );

                        // Check if campaign updated
                        if (success) {
                            postMessage(`[INFO] Campaign "${existingCampaign.name}" updated.`);
                        } else {
                            errorMessage += `\tCampaign "${existingCampaign.name}" not updated.\n`;
                            postMessage(`[ERROR] Campaign "${existingCampaign.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No campaigns found in import file.`);
            }
        } else {
            postMessage(`[INFO] Campaigns ignored.`);
        }

        // Categories
        if (categories != "ignore") {

            // Check if categories in import file
            if (importData.categories.length > 0) {
                let existingCategories = importData.categories;

                // Process categories
                existingCategories.forEach(existingCategory => {

                    // Create flow
                    if (categories == "create") {

                        // Get category
                        let category = getCategoryById(
                            nccLocation,
                            nccToken,
                            existingCategory._id
                        );

                        // Check if category found
                        if (Object.keys(category).length > 0) {
                            postMessage(`[INFO] Category with ID "${existingCategory._id}" already exists with name "${category.name}".`);
                        } else {

                            // Check if category with same name already exists
                            let category = getCategoryByName(
                                nccLocation,
                                nccToken,
                                existingCategory.name
                            );

                            if (Object.keys(category).length > 0) {
                                postMessage(`[WARNING] Category with name "${existingCategory.name}" already exists.`);
                            } else {

                                // Create category
                                let success = upsertCategory(
                                    nccLocation,
                                    nccToken,
                                    existingCategory
                                );

                                // Check if category created
                                if (success) {
                                    postMessage(`[INFO] Category "${existingCategory.name}" created.`);
                                } else {
                                    errorMessage += `\tCategory "${existingCategory.name}" not created.\n`;
                                    postMessage(`[ERROR] Category "${existingCategory.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (categories == "update") {

                        // Update category
                        let success = upsertCategory(
                            nccLocation,
                            nccToken,
                            existingCategory
                        );

                        // Check if category updated
                        if (success) {
                            postMessage(`[INFO] Category "${existingCategory.name}" updated.`);
                        } else {
                            errorMessage += `\tCategory "${existingCategory.name}" not updated.\n`;
                            postMessage(`[ERROR] Category "${existingCategory.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No categories found in import file.`);
            }
        } else {
            postMessage(`[INFO] Categories ignored.`);
        }

        // Category summaries
        if (categorySummaries != "ignore") {

            // Check if category summaries in import file
            if (importData.categorySummaries.length > 0) {
                let existingCategorySummaries = importData.categorySummaries;

                // Process category summaries
                existingCategorySummaries.forEach(existingCategorySummary => {

                    // Create flow
                    if (categorySummaries == "create") {

                        // Get category summary
                        let categorySummary = getCategorySummaryById(
                            nccLocation,
                            nccToken,
                            existingCategorySummary._id
                        );

                        // Check if category summary found
                        if (Object.keys(categorySummary).length > 0) {
                            postMessage(`[INFO] Category summary with ID "${existingCategorySummary._id}" already exists with name "${categorySummary.name}".`);
                        } else {

                            // Check if category summary with same name already exists
                            let categorySummary = getCategorySummaryByName(
                                nccLocation,
                                nccToken,
                                existingCategorySummary.name
                            );

                            if (Object.keys(categorySummary).length > 0) {
                                postMessage(`[WARNING] Category summary with name "${existingCategorySummary.name}" already exists.`);
                            } else {

                                // Create category summary
                                let success = upsertCategorySummary(
                                    nccLocation,
                                    nccToken,
                                    existingCategorySummary
                                );

                                // Check if category summary created
                                if (success) {
                                    postMessage(`[INFO] Category summary "${existingCategorySummary.name}" created.`);
                                } else {
                                    errorMessage += `\tCategory summary "${existingCategorySummary.name}" not created.\n`;
                                    postMessage(`[ERROR] Category summary "${existingCategorySummary.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (categorySummaries == "update") {

                        // Update category summary
                        let success = upsertCategorySummary(
                            nccLocation,
                            nccToken,
                            existingCategorySummary
                        );

                        // Check if category summary updated
                        if (success) {
                            postMessage(`[INFO] Category summary "${existingCategorySummary.name}" updated.`);
                        } else {
                            errorMessage += `\tCategory summary "${existingCategorySummary.name}" not updated.\n`;
                            postMessage(`[ERROR] Category summary "${existingCategorySummary.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No category summaries found in import file.`);
            }
        } else {
            postMessage(`[INFO] Category summaries ignored.`);
        }

        // Classifications
        if (classifications != "ignore") {

            // Check if classifications in import file
            if (importData.classifications.length > 0) {
                let existingClassifications = importData.classifications;

                // Process classifications
                existingClassifications.forEach(existingClassification => {

                    // Create flow
                    if (classifications == "create") {

                        // Get classification
                        let classification = getClassificationById(
                            nccLocation,
                            nccToken,
                            existingClassification._id
                        );

                        // Check if classification found
                        if (Object.keys(classification).length > 0) {
                            postMessage(`[INFO] Classification with ID "${existingClassification._id}" already exists with name "${classification.name}".`);
                        } else {

                            // Check if classification with same name already exists
                            let classification = getClassificationByName(
                                nccLocation,
                                nccToken,
                                existingClassification.name
                            );

                            if (Object.keys(classification).length > 0) {
                                postMessage(`[WARNING] Classification with name "${existingClassification.name}" already exists.`);
                            } else {

                                // Create classification
                                let success = upsertClassification(
                                    nccLocation,
                                    nccToken,
                                    existingClassification
                                );

                                // Check if classification created
                                if (success) {
                                    postMessage(`[INFO] Classification "${existingClassification.name}" created.`);
                                } else {
                                    errorMessage += `\tClassification "${existingClassification.name}" not created.\n`;
                                    postMessage(`[ERROR] Classification "${existingClassification.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (classifications == "update") {

                        // Update classification
                        let success = upsertClassification(
                            nccLocation,
                            nccToken,
                            existingClassification
                        );

                        // Check if classification updated
                        if (success) {
                            postMessage(`[INFO] Classification "${existingClassification.name}" updated.`);
                        } else {
                            errorMessage += `\tClassification "${existingClassification.name}" not updated.\n`;
                            postMessage(`[ERROR] Classification "${existingClassification.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No classifications found in import file.`);
            }
        } else {
            postMessage(`[INFO] Classifications ignored.`);
        }

        // Dashboards
        if (dashboards != "ignore") {

            // Check if dashboards in import file
            if (importData.dashboards.length > 0) {
                let existingDashboards = importData.dashboards;

                // Process dashboards
                existingDashboards.forEach(existingDashboard => {

                    // Create flow
                    if (dashboards == "create") {

                        // Get dashboard
                        let dashboard = getDashboardById(
                            nccLocation,
                            nccToken,
                            existingDashboard._id
                        );

                        // Check if dashboard found
                        if (Object.keys(dashboard).length > 0) {
                            postMessage(`[INFO] Dashboard with ID "${existingDashboard._id}" already exists with name "${dashboard.name}".`);
                        } else {

                            // Check if dashboard with same name already exists
                            let dashboard = getDashboardByName(
                                nccLocation,
                                nccToken,
                                existingDashboard.name
                            );

                            if (Object.keys(dashboard).length > 0) {
                                postMessage(`[WARNING] Dashboard with name "${existingDashboard.name}" already exists.`);
                            } else {

                                // Create dashboard
                                let success = upsertDashboard(
                                    nccLocation,
                                    nccToken,
                                    existingDashboard
                                );

                                // Check if dashboard created
                                if (success) {
                                    postMessage(`[INFO] Dashboard "${existingDashboard.name}" created.`);
                                } else {
                                    errorMessage += `\tDashboard "${existingDashboard.name}" not created.\n`;
                                    postMessage(`[ERROR] Dashboard "${existingDashboard.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (dashboards == "update") {

                        // Update dashboard
                        let success = upsertDashboard(
                            nccLocation,
                            nccToken,
                            existingDashboard
                        );

                        // Check if dashboard updated
                        if (success) {
                            postMessage(`[INFO] Dashboard "${existingDashboard.name}" updated.`);
                        } else {
                            errorMessage += `\tDashboard "${existingDashboard.name}" not updated.\n`;
                            postMessage(`[ERROR] Dashboard "${existingDashboard.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No dashboards found in import file.`);
            }
        } else {
            postMessage(`[INFO] Dashboards ignored.`);
        }

        // Dial plans
        if (dialPlans != "ignore") {

            // Check if dial plans in import file
            if (importData.dialPlans.length > 0) {
                let existingDialPlans = importData.dialPlans;

                // Process dial plans
                existingDialPlans.forEach(existingDialPlan => {

                    // Create flow
                    if (dialPlans == "create") {

                        // Get dial plan
                        let dialPlan = getDialPlanById(
                            nccLocation,
                            nccToken,
                            existingDialPlan._id
                        );

                        // Check if dial plan found
                        if (Object.keys(dialPlan).length > 0) {
                            postMessage(`[INFO] Dial plan with ID "${existingDialPlan._id}" already exists with name "${dialPlan.name}".`);
                        } else {

                            // Check if dial plan with same name already exists
                            let dialPlan = getDialPlanByName(
                                nccLocation,
                                nccToken,
                                existingDialPlan.name
                            );

                            if (Object.keys(dialPlan).length > 0) {
                                postMessage(`[WARNING] Dial plan with name "${existingDialPlan.name}" already exists.`);
                            } else {

                                // Create dial plan
                                let success = upsertDialPlan(
                                    nccLocation,
                                    nccToken,
                                    existingDialPlan
                                );

                                // Check if dial plan created
                                if (success) {
                                    postMessage(`[INFO] Dial plan "${existingDialPlan.name}" created.`);
                                } else {
                                    errorMessage += `\tDial plan "${existingDialPlan.name}" not created.\n`;
                                    postMessage(`[ERROR] Dial plan "${existingDialPlan.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (dialPlans == "update") {

                        // Update dial plan
                        let success = upsertDialPlan(
                            nccLocation,
                            nccToken,
                            existingDialPlan
                        );

                        // Check if dial plan updated
                        if (success) {
                            postMessage(`[INFO] Dial plan "${existingDialPlan.name}" updated.`);
                        } else {
                            errorMessage += `\tDial plan "${existingDialPlan.name}" not updated.\n`;
                            postMessage(`[ERROR] Dial plan "${existingDialPlan.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No dial plans found in import file.`);
            }
        } else {
            postMessage(`[INFO] Dial plans ignored.`);
        }

        // Dispositions
        if (dispositions != "ignore") {

            // Check if dispositions in import file
            if (importData.dispositions.length > 0) {
                let existingDispositions = importData.dispositions;

                // Process dispositions
                existingDispositions.forEach(existingDisposition => {

                    // Create flow
                    if (dispositions == "create") {

                        // Get disposition
                        let disposition = getDispositionById(
                            nccLocation,
                            nccToken,
                            existingDisposition._id
                        );

                        // Check if disposition found
                        if (Object.keys(disposition).length > 0) {
                            postMessage(`[INFO] Disposition with ID "${existingDisposition._id}" already exists with name "${disposition.name}".`);
                        } else {

                            // Check if disposition with same name already exists
                            let disposition = getDispositionByName(
                                nccLocation,
                                nccToken,
                                existingDisposition.name
                            );

                            if (Object.keys(disposition).length > 0) {
                                postMessage(`[WARNING] Disposition with name "${existingDisposition.name}" already exists.`);
                            } else {

                                // Create disposition
                                let success = upsertDisposition(
                                    nccLocation,
                                    nccToken,
                                    existingDisposition
                                );

                                // Check if disposition created
                                if (success) {
                                    postMessage(`[INFO] Disposition "${existingDisposition.name}" created.`);
                                } else {
                                    errorMessage += `\tDisposition "${existingDisposition.name}" not created.\n`;
                                    postMessage(`[ERROR] Disposition "${existingDisposition.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (dispositions == "update") {

                        // Update disposition
                        let success = upsertDisposition(
                            nccLocation,
                            nccToken,
                            existingDisposition
                        );

                        // Check if disposition updated
                        if (success) {
                            postMessage(`[INFO] Disposition "${existingDisposition.name}" updated.`);
                        } else {
                            errorMessage += `\tDisposition "${existingDisposition.name}" not updated.\n`;
                            postMessage(`[ERROR] Disposition "${existingDisposition.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No dispositions found in import file.`);
            }
        } else {
            postMessage(`[INFO] Dispositions ignored.`);
        }

        // Entities
        if (entities != "ignore") {

            // Check if entities in import file
            if (importData.entities.length > 0) {
                let existingEntities = importData.entities;

                // Process entities
                existingEntities.forEach(existingEntity => {

                    // Create flow
                    if (entities == "create") {

                        // Get entity
                        let entity = getEntityById(
                            nccLocation,
                            nccToken,
                            existingEntity._id
                        );

                        // Check if entity found
                        if (Object.keys(entity).length > 0) {
                            postMessage(`[INFO] Entity with ID "${existingEntity._id}" already exists with name "${entity.name}".`);
                        } else {

                            // Check if entity with same name already exists
                            let entity = getEntityByName(
                                nccLocation,
                                nccToken,
                                existingEntity.name
                            );

                            if (Object.keys(entity).length > 0) {
                                postMessage(`[WARNING] Entity with name "${existingEntity.name}" already exists.`);
                            } else {

                                // Create entity
                                let success = upsertEntity(
                                    nccLocation,
                                    nccToken,
                                    existingEntity
                                );

                                // Check if entity created
                                if (success) {
                                    postMessage(`[INFO] Entity "${existingEntity.name}" created.`);
                                } else {
                                    errorMessage += `\tEntity "${existingEntity.name}" not created.\n`;
                                    postMessage(`[ERROR] Entity "${existingEntity.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (entities == "update") {

                        // Update entity
                        let success = upsertEntity(
                            nccLocation,
                            nccToken,
                            existingEntity
                        );

                        // Check if entity updated
                        if (success) {
                            postMessage(`[INFO] Entity "${existingEntity.name}" updated.`);
                        } else {
                            errorMessage += `\tEntity "${existingEntity.name}" not updated.\n`;
                            postMessage(`[ERROR] Entity "${existingEntity.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No entities found in import file.`);
            }
        } else {
            postMessage(`[INFO] Entities ignored.`);
        }

        // Field mappings
        if (fieldMappings != "ignore") {

            // Check if field mappings in import file
            if (importData.fieldMappings.length > 0) {
                let existingFieldMappings = importData.fieldMappings;

                // Process field mappings
                existingFieldMappings.forEach(existingFieldMapping => {

                    // Create flow
                    if (fieldMappings == "create") {

                        // Get field mapping
                        let fieldMapping = getFieldMappingsById(
                            nccLocation,
                            nccToken,
                            existingFieldMapping._id
                        );

                        // Check if field mapping found
                        if (Object.keys(fieldMapping).length > 0) {
                            postMessage(`[INFO] Field mapping with ID "${existingFieldMapping._id}" already exists with name "${fieldMapping.name}".`);
                        } else {

                            // Check if field mapping with same name already exists
                            let fieldMapping = getFieldMappingsByName(
                                nccLocation,
                                nccToken,
                                existingFieldMapping.name
                            );

                            if (Object.keys(fieldMapping).length > 0) {
                                postMessage(`[WARNING] Field mapping with name "${existingFieldMapping.name}" already exists.`);
                            } else {

                                // Create field mapping
                                let success = upsertFieldMappings(
                                    nccLocation,
                                    nccToken,
                                    existingFieldMapping
                                );

                                // Check if field mapping created
                                if (success) {
                                    postMessage(`[INFO] Field mapping "${existingFieldMapping.name}" created.`);
                                } else {
                                    errorMessage += `\tField mapping "${existingFieldMapping.name}" not created.\n`;
                                    postMessage(`[ERROR] Field mapping "${existingFieldMapping.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (fieldMappings == "update") {

                        // Update field mapping
                        let success = upsertFieldMappings(
                            nccLocation,
                            nccToken,
                            existingFieldMapping
                        );

                        // Check if field mapping updated
                        if (success) {
                            postMessage(`[INFO] Field mapping "${existingFieldMapping.name}" updated.`);
                        } else {
                            errorMessage += `\tField mapping "${existingFieldMapping.name}" not updated.\n`;
                            postMessage(`[ERROR] Field mapping "${existingFieldMapping.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No field mappings found in import file.`);
            }
        } else {
            postMessage(`[INFO] Field mappings ignored.`);
        }

        // File servers
        if (fileServers != "ignore") {

            // Check if file servers in import file
            if (importData.fileServers.length > 0) {
                let existingFileServers = importData.fileServers;

                // Process file server
                existingFileServers.forEach(existingFileServer => {

                    // Create flow
                    if (fileServers == "create") {

                        // Get file server
                        let fileServer = getFileServerById(
                            nccLocation,
                            nccToken,
                            existingFileServer._id
                        );

                        // Check if file server found
                        if (Object.keys(fileServer).length > 0) {
                            postMessage(`[INFO] File server with ID "${existingFileServer._id}" already exists with name "${fileServer.name}".`);
                        } else {

                            // Check if file server with same name already exists
                            let fileServer = getFileServerByName(
                                nccLocation,
                                nccToken,
                                existingFileServer.name
                            );

                            if (Object.keys(fileServer).length > 0) {
                                postMessage(`[WARNING] File server with name "${existingFileServer.name}" already exists.`);
                            } else {

                                // Create file server
                                let success = upsertFileServer(
                                    nccLocation,
                                    nccToken,
                                    existingFileServer
                                );

                                // Check if file server created
                                if (success) {
                                    postMessage(`[INFO] File server "${existingFileServer.name}" created.`);
                                } else {
                                    errorMessage += `\tFile server "${existingFileServer.name}" not created.\n`;
                                    postMessage(`[ERROR] File server "${existingFileServer.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (fileServers == "update") {

                        // Update file server
                        let success = upsertFileServer(
                            nccLocation,
                            nccToken,
                            existingFileServer
                        );

                        // Check if file server updated
                        if (success) {
                            postMessage(`[INFO] File server "${existingFileServer.name}" updated.`);
                        } else {
                            errorMessage += `\tFile server "${existingFileServer.name}" not updated.\n`;
                            postMessage(`[ERROR] File server "${existingFileServer.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No file servers found in import file.`);
            }
        } else {
            postMessage(`[INFO] File servers ignored.`);
        }

        // Filters
        if (filters != "ignore") {

            // Check if filters in import file
            if (importData.filters.length > 0) {
                let existingFilters = importData.filters;

                // Process filters
                existingFilters.forEach(existingFilter => {

                    // Create flow
                    if (filters == "create") {

                        // Get filter
                        let filter = getFilterById(
                            nccLocation,
                            nccToken,
                            existingFilter._id
                        );

                        // Check if filter found
                        if (Object.keys(filter).length > 0) {
                            postMessage(`[INFO] Filter with ID "${existingFilter._id}" already exists with name "${filter.name}".`);
                        } else {

                            // Check if filter with same name already exists
                            let filter = getFilterByName(
                                nccLocation,
                                nccToken,
                                existingFilter.name
                            );

                            if (Object.keys(filter).length > 0) {
                                postMessage(`[WARNING] Filter with name "${existingFilter.name}" already exists.`);
                            } else {

                                // Create filter
                                let success = upsertFilter(
                                    nccLocation,
                                    nccToken,
                                    existingFilter
                                );

                                // Check if filter created
                                if (success) {
                                    postMessage(`[INFO] Filter "${existingFilter.name}" created.`);
                                } else {
                                    errorMessage += `\tFilter "${existingFilter.name}" not created.\n`;
                                    postMessage(`[ERROR] Filter "${existingFilter.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (filters == "update") {

                        // Update filter
                        let success = upsertFilter(
                            nccLocation,
                            nccToken,
                            existingFilter
                        );

                        // Check if filter updated
                        if (success) {
                            postMessage(`[INFO] Filter "${existingFilter.name}" updated.`);
                        } else {
                            errorMessage += `\tFilter "${existingFilter.name}" not updated.\n`;
                            postMessage(`[ERROR] Filter "${existingFilter.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No filters found in import file.`);
            }
        } else {
            postMessage(`[INFO] Filters ignored.`);
        }

        // Functions
        if (functions != "ignore") {

            // Check if functions in import file
            if (importData.functions.length > 0) {
                let existingFunctions = importData.functions;

                // Process functions
                existingFunctions.forEach(existingFunction => {

                    // Create flow
                    if (functions == "create") {

                        // Get function
                        let nccFunction = getFunctionById(
                            nccLocation,
                            nccToken,
                            existingFunction._id
                        );

                        // Check if function found
                        if (Object.keys(nccFunction).length > 0) {
                            postMessage(`[INFO] Function with ID "${existingFunction._id}" already exists with name "${nccFunction.name}".`);
                        } else {

                            // Check if function with same name already exists
                            let nccFunction = getFunctionByName(
                                nccLocation,
                                nccToken,
                                existingFunction.name
                            );

                            if (Object.keys(nccFunction).length > 0) {
                                postMessage(`[WARNING] Function with name "${existingFunction.name}" already exists.`);
                            } else {

                                // Create function
                                let success = upsertFunction(
                                    nccLocation,
                                    nccToken,
                                    existingFunction
                                );

                                // Check if function created
                                if (success) {
                                    postMessage(`[INFO] Function "${existingFunction.name}" created.`);
                                } else {
                                    errorMessage += `\tFunction "${existingFunction.name}" not created.\n`;
                                    postMessage(`[ERROR] Function "${existingFunction.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (functions == "update") {

                        // Update function
                        let success = upsertFunction(
                            nccLocation,
                            nccToken,
                            existingFunction
                        );

                        // Check if function updated
                        if (success) {
                            postMessage(`[INFO] Function "${existingFunction.name}" updated.`);
                        } else {
                            errorMessage += `\tFunction "${existingFunction.name}" not updated.\n`;
                            postMessage(`[ERROR] Function "${existingFunction.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No functions found in import file.`);
            }
        } else {
            postMessage(`[INFO] Functions ignored.`);
        }

        // Home tabs
        if (homeTabs != "ignore") {

            // Check if home tabs in import file
            if (importData.homeTabs.length > 0) {
                let existingHomeTabs = importData.homeTabs;

                // Process home tabs
                existingHomeTabs.forEach(existingHomeTab => {

                    // Create flow
                    if (homeTabs == "create") {

                        // Get home tab
                        let homeTab = getHomeTabById(
                            nccLocation,
                            nccToken,
                            existingHomeTab._id
                        );

                        // Check if home tab found
                        if (Object.keys(homeTab).length > 0) {
                            postMessage(`[INFO] Home tab with ID "${existingHomeTab._id}" already exists with name "${homeTab.name}".`);
                        } else {

                            // Check if home tab with same name already exists
                            let homeTab = getHomeTabByName(
                                nccLocation,
                                nccToken,
                                existingHomeTab.name
                            );

                            if (Object.keys(homeTab).length > 0) {
                                postMessage(`[WARNING] Home tab with name "${existingHomeTab.name}" already exists.`);
                            } else {

                                // Create home tab
                                let success = upsertHomeTab(
                                    nccLocation,
                                    nccToken,
                                    existingHomeTab
                                );

                                // Check if home tab created
                                if (success) {
                                    postMessage(`[INFO] Home tab "${existingHomeTab.name}" created.`);
                                } else {
                                    errorMessage += `\tHome tab "${existingHomeTab.name}" not created.\n`;
                                    postMessage(`[ERROR] Home tab "${existingHomeTab.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (homeTabs == "update") {

                        // Update home tab
                        let success = upsertHomeTab(
                            nccLocation,
                            nccToken,
                            existingHomeTab
                        );

                        // Check if home tab updated
                        if (success) {
                            postMessage(`[INFO] Home tab "${existingHomeTab.name}" updated.`);
                        } else {
                            errorMessage += `\tHome tab "${existingHomeTab.name}" not updated.\n`;
                            postMessage(`[ERROR] Home tab "${existingHomeTab.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No home tabs found in import file.`);
            }
        } else {
            postMessage(`[INFO] Home tabs ignored.`);
        }

        // Music
        if (music != "ignore") {

            // Check if music in import file
            if (importData.music.length > 0) {
                let existingMusic = importData.music;

                // Process music
                existingMusic.forEach(existingMusic => {

                    // Create flow
                    if (music == "create") {

                        // Get music
                        let music = getMusicById(
                            nccLocation,
                            nccToken,
                            existingMusic._id
                        );

                        // Check if music found
                        if (Object.keys(music).length > 0) {
                            postMessage(`[INFO] Music with ID "${existingMusic._id}" already exists with name "${music.name}".`);
                        } else {

                            // Check if music with same name already exists
                            let music = getMusicByName(
                                nccLocation,
                                nccToken,
                                existingMusic.name
                            );

                            if (Object.keys(music).length > 0) {
                                postMessage(`[WARNING] Music with name "${existingMusic.name}" already exists.`);
                            } else {

                                // Create music
                                let success = upsertMusic(
                                    nccLocation,
                                    nccToken,
                                    existingMusic
                                );

                                // Check if music created
                                if (success) {
                                    postMessage(`[INFO] Music "${existingMusic.name}" created.`);
                                } else {
                                    errorMessage += `\tMusic "${existingMusic.name}" not created.\n`;
                                    postMessage(`[ERROR] Music "${existingMusic.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (music == "update") {

                        // Update music
                        let success = upsertMusic(
                            nccLocation,
                            nccToken,
                            existingMusic
                        );

                        // Check if music updated
                        if (success) {
                            postMessage(`[INFO] Music "${existingMusic.name}" updated.`);
                        } else {
                            errorMessage += `\tMusic "${existingMusic.name}" not updated.\n`;
                            postMessage(`[ERROR] Music "${existingMusic.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No music found in import file.`);
            }
        } else {
            postMessage(`[INFO] Music ignored.`);
        }

        // Partitions
        if (partitions != "ignore") {

            // Check if partitions in import file
            if (importData.partitions.length > 0) {
                let existingPartitions = importData.partitions;

                // Process partitions
                existingPartitions.forEach(existingPartition => {

                    // Create flow
                    if (partitions == "create") {

                        // Get partition
                        let partition = getPartitionById(
                            nccLocation,
                            nccToken,
                            existingPartition._id
                        );

                        // Check if partition found
                        if (Object.keys(partition).length > 0) {
                            postMessage(`[INFO] Partition with ID "${existingPartition._id}" already exists with name "${partition.name}".`);
                        } else {

                            // Check if partition with same name already exists
                            let partition = getPartitionByName(
                                nccLocation,
                                nccToken,
                                existingPartition.name
                            );

                            if (Object.keys(partition).length > 0) {
                                postMessage(`[WARNING] Partition with name "${existingPartition.name}" already exists.`);
                            } else {

                                // Create partition
                                let success = upsertPartition(
                                    nccLocation,
                                    nccToken,
                                    existingPartition
                                );

                                // Check if partition created
                                if (success) {
                                    postMessage(`[INFO] Partition "${existingPartition.name}" created.`);
                                } else {
                                    errorMessage += `\tPartition "${existingPartition.name}" not created.\n`;
                                    postMessage(`[ERROR] Partition "${existingPartition.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (partitions == "update") {

                        // Update partition
                        let success = upsertPartition(
                            nccLocation,
                            nccToken,
                            existingPartition
                        );

                        // Check if partition updated
                        if (success) {
                            postMessage(`[INFO] Partition "${existingPartition.name}" updated.`);
                        } else {
                            errorMessage += `\tPartition "${existingPartition.name}" not updated.\n`;
                            postMessage(`[ERROR] Partition "${existingPartition.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No partitions found in import file.`);
            }
        } else {
            postMessage(`[INFO] Partitions ignored.`);
        }

        // Prompts
        if (prompts != "ignore") {

            // Check if prompts in import file
            if (importData.prompts.length > 0) {
                let existingPrompts = importData.prompts;

                // Process prompts
                existingPrompts.forEach(existingPrompt => {

                    // Create flow
                    if (prompts == "create") {

                        // Get prompt
                        let prompt = getPromptById(
                            nccLocation,
                            nccToken,
                            existingPrompt._id
                        );

                        // Check if prompt found
                        if (Object.keys(prompt).length > 0) {
                            postMessage(`[INFO] Prompt with ID "${existingPrompt._id}" already exists with name "${prompt.name}".`);
                        } else {

                            // Check if prompt with same name already exists
                            let prompt = getPromptByName(
                                nccLocation,
                                nccToken,
                                existingPrompt.name
                            );

                            if (Object.keys(prompt).length > 0) {
                                postMessage(`[WARNING] Prompt with name "${existingPrompt.name}" already exists.`);
                            } else {

                                // Create prompt
                                let success = upsertPrompt(
                                    nccLocation,
                                    nccToken,
                                    existingPrompt
                                );

                                // Check if prompt created
                                if (success) {
                                    postMessage(`[INFO] Prompt "${existingPrompt.name}" created.`);
                                } else {
                                    errorMessage += `\tPrompt "${existingPrompt.name}" not created.\n`;
                                    postMessage(`[ERROR] Prompt "${existingPrompt.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (prompts == "update") {

                        // Update prompt
                        let success = upsertPrompt(
                            nccLocation,
                            nccToken,
                            existingPrompt
                        );

                        // Check if prompt updated
                        if (success) {
                            postMessage(`[INFO] Prompt "${existingPrompt.name}" updated.`);
                        } else {
                            errorMessage += `\tPrompt "${existingPrompt.name}" not updated.\n`;
                            postMessage(`[ERROR] Prompt "${existingPrompt.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No prompts found in import file.`);
            }
        } else {
            postMessage(`[INFO] Prompts ignored.`);
        }

        // Queues
        if (queues != "ignore") {

            // Check if queues in import file
            if (importData.queues.length > 0) {
                let existingQueues = importData.queues;

                // Process queues
                existingQueues.forEach(existingQueue => {

                    // Create flow
                    if (queues == "create") {

                        // Get queue
                        let queue = getQueueById(
                            nccLocation,
                            nccToken,
                            existingQueue._id
                        );

                        // Check if queue found
                        if (Object.keys(queue).length > 0) {
                            postMessage(`[INFO] Queue with ID "${existingQueue._id}" already exists with name "${queue.name}".`);
                        } else {

                            // Check if queue with same name already exists
                            let queue = getQueueByName(
                                nccLocation,
                                nccToken,
                                existingQueue.name
                            );

                            if (Object.keys(queue).length > 0) {
                                postMessage(`[WARNING] Queue with name "${existingQueue.name}" already exists.`);
                            } else {

                                // Create queue
                                let success = upsertQueue(
                                    nccLocation,
                                    nccToken,
                                    existingQueue
                                );

                                // Check if queue created
                                if (success) {
                                    postMessage(`[INFO] Queue "${existingQueue.name}" created.`);
                                } else {
                                    errorMessage += `\tQueue "${existingQueue.name}" not created.\n`;
                                    postMessage(`[ERROR] Queue "${existingQueue.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (queues == "update") {

                        // Update queue
                        let success = upsertQueue(
                            nccLocation,
                            nccToken,
                            existingQueue
                        );

                        // Check if queue updated
                        if (success) {
                            postMessage(`[INFO] Queue "${existingQueue.name}" updated.`);
                        } else {
                            errorMessage += `\tQueue "${existingQueue.name}" not updated.\n`;
                            postMessage(`[ERROR] Queue "${existingQueue.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No queues found in import file.`);
            }
        } else {
            postMessage(`[INFO] Queues ignored.`);
        }

        // Reports
        if (reports != "ignore") {

            // Check if reports in import file
            if (importData.reports.length > 0) {
                let existingReports = importData.reports;

                // Process report
                existingReports.forEach(existingReport => {

                    // Create flow
                    if (reports == "create") {

                        // Get report
                        let report = getReportById(
                            nccLocation,
                            nccToken,
                            existingReport._id
                        );

                        // Check if report found
                        if (Object.keys(report).length > 0) {
                            postMessage(`[INFO] Report with ID "${existingReport._id}" already exists with name "${report.name}".`);
                        } else {

                            // Check if report with same name already exists
                            let report = getReportByName(
                                nccLocation,
                                nccToken,
                                existingReport.name
                            );

                            if (Object.keys(report).length > 0) {
                                postMessage(`[WARNING] Report with name "${existingReport.name}" already exists.`);
                            } else {

                                // Create report
                                let success = upsertReport(
                                    nccLocation,
                                    nccToken,
                                    existingReport
                                );

                                // Check if report created
                                if (success) {
                                    postMessage(`[INFO] Report "${existingReport.name}" created.`);
                                } else {
                                    errorMessage += `\tReport "${existingReport.name}" not created.\n`;
                                    postMessage(`[ERROR] Report "${existingReport.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (reports == "update") {

                        // Update report
                        let success = upsertReport(
                            nccLocation,
                            nccToken,
                            existingReport
                        );

                        // Check if report updated
                        if (success) {
                            postMessage(`[INFO] Report "${existingReport.name}" updated.`);
                        } else {
                            errorMessage += `\tReport "${existingReport.name}" not updated.\n`;
                            postMessage(`[ERROR] Report "${existingReport.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No reports found in import file.`);
            }
        } else {
            postMessage(`[INFO] Reports ignored.`);
        }

        // REST calls
        if (restCalls != "ignore") {

            // Check if REST calls in import file
            if (importData.restCalls.length > 0) {
                let existingRestCalls = importData.restCalls;

                // Process REST calls
                existingRestCalls.forEach(existingRestCall => {

                    // Create flow
                    if (restCalls == "create") {

                        // Get REST call
                        let restCall = getRestCallById(
                            nccLocation,
                            nccToken,
                            existingRestCall._id
                        );

                        // Check if REST call found
                        if (Object.keys(restCall).length > 0) {
                            postMessage(`[INFO] REST call with ID "${existingRestCall._id}" already exists with name "${restCall.name}".`);
                        } else {

                            // Check if REST call with same name already exists
                            let restCall = getRestCallByName(
                                nccLocation,
                                nccToken,
                                existingRestCall.name
                            );

                            if (Object.keys(restCall).length > 0) {
                                postMessage(`[WARNING] REST call with name "${existingRestCall.name}" already exists.`);
                            } else {

                                // Create REST call
                                let success = upsertRestCall(
                                    nccLocation,
                                    nccToken,
                                    existingRestCall
                                );

                                // Check if REST call created
                                if (success) {
                                    postMessage(`[INFO] REST call "${existingRestCall.name}" created.`);
                                } else {
                                    errorMessage += `\tREST call "${existingRestCall.name}" not created.\n`;
                                    postMessage(`[ERROR] REST call "${existingRestCall.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (restCalls == "update") {

                        // Update REST call
                        let success = upsertRestCall(
                            nccLocation,
                            nccToken,
                            existingRestCall
                        );

                        // Check if REST call updated
                        if (success) {
                            postMessage(`[INFO] REST call "${existingRestCall.name}" updated.`);
                        } else {
                            errorMessage += `\tREST call "${existingRestCall.name}" not updated.\n`;
                            postMessage(`[ERROR] REST call "${existingRestCall.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No REST calls found in import file.`);
            }
        } else {
            postMessage(`[INFO] REST calls ignored.`);
        }

        // Scorecards
        if (scorecards != "ignore") {

            // Check if scorecards in import file
            if (importData.scorecards.length > 0) {
                let existingScorecards = importData.scorecards;

                // Process scorecards
                existingScorecards.forEach(existingScorecard => {

                    // Create flow
                    if (scorecards == "create") {

                        // Get scorecard
                        let scorecard = getScorecardById(
                            nccLocation,
                            nccToken,
                            existingScorecard._id
                        );

                        // Check if scorecard found
                        if (Object.keys(scorecard).length > 0) {
                            postMessage(`[INFO] Scorecard with ID "${existingScorecard._id}" already exists with name "${scorecard.name}".`);
                        } else {

                            // Check if scorecard with same name already exists
                            let scorecard = getScorecardByName(
                                nccLocation,
                                nccToken,
                                existingScorecard.name
                            );

                            if (Object.keys(scorecard).length > 0) {
                                postMessage(`[WARNING] Scorecard with name "${existingScorecard.name}" already exists.`);
                            } else {

                                // Create scorecard
                                let success = upsertScorecard(
                                    nccLocation,
                                    nccToken,
                                    existingScorecard
                                );

                                // Check if scorecard created
                                if (success) {
                                    postMessage(`[INFO] Scorecard "${existingScorecard.name}" created.`);
                                } else {
                                    errorMessage += `\tScorecard "${existingScorecard.name}" not created.\n`;
                                    postMessage(`[ERROR] Scorecard "${existingScorecard.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (scorecards == "update") {

                        // Update scorecard
                        let success = upsertScorecard(
                            nccLocation,
                            nccToken,
                            existingScorecard
                        );

                        // Check if scorecard updated
                        if (success) {
                            postMessage(`[INFO] Scorecard "${existingScorecard.name}" updated.`);
                        } else {
                            errorMessage += `\tScorecard "${existingScorecard.name}" not updated.\n`;
                            postMessage(`[ERROR] Scorecard "${existingScorecard.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No scorecards found in import file.`);
            }
        } else {
            postMessage(`[INFO] Scorecards ignored.`);
        }

        // Scripts
        if (scripts != "ignore") {

            // Check if scripts in import file
            if (importData.scripts.length > 0) {
                let existingScripts = importData.scripts;

                // Process scripts
                existingScripts.forEach(existingScript => {

                    // Create flow
                    if (scripts == "create") {

                        // Get script
                        let script = getScriptById(
                            nccLocation,
                            nccToken,
                            existingScript._id
                        );

                        // Check if script found
                        if (Object.keys(script).length > 0) {
                            postMessage(`[INFO] Script with ID "${existingScript._id}" already exists with name "${script.name}".`);
                        } else {

                            // Check if script with same name already exists
                            let script = getScriptByName(
                                nccLocation,
                                nccToken,
                                existingScript.name
                            );

                            if (Object.keys(script).length > 0) {
                                postMessage(`[WARNING] Script with name "${existingScript.name}" already exists.`);
                            } else {

                                // Create script
                                let success = upsertScript(
                                    nccLocation,
                                    nccToken,
                                    existingScript
                                );

                                // Check if script created
                                if (success) {
                                    postMessage(`[INFO] Script "${existingScript.name}" created.`);
                                } else {
                                    errorMessage += `\tScript "${existingScript.name}" not created.\n`;
                                    postMessage(`[ERROR] Script "${existingScript.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (scripts == "update") {

                        // Update script
                        let success = upsertScript(
                            nccLocation,
                            nccToken,
                            existingScript
                        );

                        // Check if script updated
                        if (success) {
                            postMessage(`[INFO] Script "${existingScript.name}" updated.`);
                        } else {
                            errorMessage += `\tScript "${existingScript.name}" not updated.\n`;
                            postMessage(`[ERROR] Script "${existingScript.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No scripts found in import file.`);
            }
        } else {
            postMessage(`[INFO] Scripts ignored.`);
        }

        // Skills
        if (skills != "ignore") {

            // Check if skills in import file
            if (importData.skills.length > 0) {
                let existingSkills = importData.skills;

                // Process skills
                existingSkills.forEach(existingSkill => {

                    // Create flow
                    if (skills == "create") {

                        // Get skill
                        let skill = getSkillById(
                            nccLocation,
                            nccToken,
                            existingSkill._id
                        );

                        // Check if skill found
                        if (Object.keys(skill).length > 0) {
                            postMessage(`[INFO] Skill with ID "${existingSkill._id}" already exists with name "${skill.name}".`);
                        } else {

                            // Check if skill with same name already exists
                            let skill = getSkillByName(
                                nccLocation,
                                nccToken,
                                existingSkill.name
                            );

                            if (Object.keys(skill).length > 0) {
                                postMessage(`[WARNING] Skill with name "${existingSkill.name}" already exists.`);
                            } else {

                                // Create skill
                                let success = upsertSkill(
                                    nccLocation,
                                    nccToken,
                                    existingSkill
                                );

                                // Check if skill created
                                if (success) {
                                    postMessage(`[INFO] Skill "${existingSkill.name}" created.`);
                                } else {
                                    errorMessage += `\tSkill "${existingSkill.name}" not created.\n`;
                                    postMessage(`[ERROR] Skill "${existingSkill.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (skills == "update") {

                        // Update skill
                        let success = upsertSkill(
                            nccLocation,
                            nccToken,
                            existingSkill
                        );

                        // Check if skill updated
                        if (success) {
                            postMessage(`[INFO] Skill "${existingSkill.name}" updated.`);
                        } else {
                            errorMessage += `\tSkill "${existingSkill.name}" not updated.\n`;
                            postMessage(`[ERROR] Skill "${existingSkill.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No skills found in import file.`);
            }
        } else {
            postMessage(`[INFO] Skills ignored.`);
        }

        // State DIDs
        if (stateDids != "ignore") {

            // Check if state DIDs in import file
            if (importData.stateDids.length > 0) {
                let existingStateDids = importData.stateDids;

                // Process state DID
                existingStateDids.forEach(existingStateDid => {

                    // Create flow
                    if (stateDids == "create") {

                        // Get state DID
                        let stateDid = getStateDidById(
                            nccLocation,
                            nccToken,
                            existingStateDid._id
                        );

                        // Check if state DID found
                        if (Object.keys(stateDid).length > 0) {
                            postMessage(`[INFO] State DID with ID "${existingStateDid._id}" already exists with name "${stateDid.name}".`);
                        } else {

                            // Check if state DID with same name already exists
                            let stateDid = getStateDidByName(
                                nccLocation,
                                nccToken,
                                existingStateDid.name
                            );

                            if (Object.keys(stateDid).length > 0) {
                                postMessage(`[WARNING] State DID with name "${existingStateDid.name}" already exists.`);
                            } else {

                                // Create state DID
                                let success = upsertStateDid(
                                    nccLocation,
                                    nccToken,
                                    existingStateDid
                                );

                                // Check if state DID created
                                if (success) {
                                    postMessage(`[INFO] State DID "${existingStateDid.name}" created.`);
                                } else {
                                    errorMessage += `\tState DID "${existingStateDid.name}" not created.\n`;
                                    postMessage(`[ERROR] State DID "${existingStateDid.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (stateDids == "update") {

                        // Update state DID
                        let success = upsertStateDid(
                            nccLocation,
                            nccToken,
                            existingStateDid
                        );

                        // Check if state DID updated
                        if (success) {
                            postMessage(`[INFO] State DID "${existingStateDid.name}" updated.`);
                        } else {
                            errorMessage += `\tState DID "${existingStateDid.name}" not updated.\n`;
                            postMessage(`[ERROR] State DID "${existingStateDid.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No state DIDs found in import file.`);
            }
        } else {
            postMessage(`[INFO] State DIDs ignored.`);
        }

        // Survey themes
        if (surveyThemes != "ignore") {

            // Check if survey themes in import file
            if (importData.surveyThemes.length > 0) {
                let existingSurveyThemes = importData.surveyThemes;

                // Process survey themes
                existingSurveyThemes.forEach(existingSurveyTheme => {

                    // Create flow
                    if (surveyThemes == "create") {

                        // Get survey theme
                        let surveyTheme = getSurveyThemeById(
                            nccLocation,
                            nccToken,
                            existingSurveyTheme._id
                        );

                        // Check if survey theme found
                        if (Object.keys(surveyTheme).length > 0) {
                            postMessage(`[INFO] Survey theme with ID "${existingSurveyTheme._id}" already exists with name "${surveyTheme.name}".`);
                        } else {

                            // Check if survey theme with same name already exists
                            let surveyTheme = getSurveyThemeByName(
                                nccLocation,
                                nccToken,
                                existingSurveyTheme.name
                            );

                            if (Object.keys(surveyTheme).length > 0) {
                                postMessage(`[WARNING] Survey theme with name "${existingSurveyTheme.name}" already exists.`);
                            } else {

                                // Create survey theme
                                let success = upsertSurveyTheme(
                                    nccLocation,
                                    nccToken,
                                    existingSurveyTheme
                                );

                                // Check if survey theme created
                                if (success) {
                                    postMessage(`[INFO] Survey theme "${existingSurveyTheme.name}" created.`);
                                } else {
                                    errorMessage += `\tSurvey theme "${existingSurveyTheme.name}" not created.\n`;
                                    postMessage(`[ERROR] Survey theme "${existingSurveyTheme.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (surveyThemes == "update") {

                        // Update survey theme
                        let success = upsertSurveyTheme(
                            nccLocation,
                            nccToken,
                            existingSurveyTheme
                        );

                        // Check if survey theme updated
                        if (success) {
                            postMessage(`[INFO] Survey theme "${existingSurveyTheme.name}" updated.`);
                        } else {
                            errorMessage += `\tSurvey theme "${existingSurveyTheme.name}" not updated.\n`;
                            postMessage(`[ERROR] Survey theme "${existingSurveyTheme.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No survey themes found in import file.`);
            }
        } else {
            postMessage(`[INFO] Survey themes ignored.`);
        }

        // Surveys
        if (surveys != "ignore") {

            // Check if surveys in import file
            if (importData.surveys.length > 0) {
                let existingSurveys = importData.surveys;

                // Process surveys
                existingSurveys.forEach(existingSurvey => {

                    // Create flow
                    if (surveys == "create") {

                        // Get survey
                        let survey = getSurveyById(
                            nccLocation,
                            nccToken,
                            existingSurvey._id
                        );

                        // Check if survey found
                        if (Object.keys(survey).length > 0) {
                            postMessage(`[INFO] Survey with ID "${existingSurvey._id}" already exists with name "${survey.name}".`);
                        } else {

                            // Check if survey with same name already exists
                            let survey = getSurveyByName(
                                nccLocation,
                                nccToken,
                                existingSurvey.name
                            );

                            if (Object.keys(survey).length > 0) {
                                postMessage(`[WARNING] Survey with name "${existingSurvey.name}" already exists.`);
                            } else {

                                // Create survey
                                let success = upsertSurvey(
                                    nccLocation,
                                    nccToken,
                                    existingSurvey
                                );

                                // Check if survey created
                                if (success) {
                                    postMessage(`[INFO] Survey "${existingSurvey.name}" created.`);
                                } else {
                                    errorMessage += `\tSurvey "${existingSurvey.name}" not created.\n`;
                                    postMessage(`[ERROR] Survey "${existingSurvey.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (surveys == "update") {

                        // Update survey
                        let success = upsertSurvey(
                            nccLocation,
                            nccToken,
                            existingSurvey
                        );

                        // Check if survey updated
                        if (success) {
                            postMessage(`[INFO] Survey "${existingSurvey.name}" updated.`);
                        } else {
                            errorMessage += `\tSurvey "${existingSurvey.name}" not updated.\n`;
                            postMessage(`[ERROR] Survey "${existingSurvey.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No surveys found in import file.`);
            }
        } else {
            postMessage(`[INFO] Surveys ignored.`);
        }

        // Templates
        if (templates != "ignore") {

            // Check if templates in import file
            if (importData.templates.length > 0) {
                let existingTemplates = importData.templates;

                // Process templates
                existingTemplates.forEach(existingTemplate => {

                    // Create flow
                    if (templates == "create") {

                        // Get template
                        let template = getTemplateById(
                            nccLocation,
                            nccToken,
                            existingTemplate._id
                        );

                        // Check if template found
                        if (Object.keys(template).length > 0) {
                            postMessage(`[INFO] Template with ID "${existingTemplate._id}" already exists with name "${template.name}".`);
                        } else {

                            // Check if template with same name already exists
                            let template = getTemplateByName(
                                nccLocation,
                                nccToken,
                                existingTemplate.name
                            );

                            if (Object.keys(template).length > 0) {
                                postMessage(`[WARNING] Template with name "${existingTemplate.name}" already exists.`);
                            } else {

                                // Create template
                                let success = upsertTemplate(
                                    nccLocation,
                                    nccToken,
                                    existingTemplate
                                );

                                // Check if template created
                                if (success) {
                                    postMessage(`[INFO] Template "${existingTemplate.name}" created.`);
                                } else {
                                    errorMessage += `\tTemplate "${existingTemplate.name}" not created.\n`;
                                    postMessage(`[ERROR] Template "${existingTemplate.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (templates == "update") {

                        // Update template
                        let success = upsertTemplate(
                            nccLocation,
                            nccToken,
                            existingTemplate
                        );

                        // Check if template updated
                        if (success) {
                            postMessage(`[INFO] Template "${existingTemplate.name}" updated.`);
                        } else {
                            errorMessage += `\tTemplate "${existingTemplate.name}" not updated.\n`;
                            postMessage(`[ERROR] Template "${existingTemplate.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No templates found in import file.`);
            }
        } else {
            postMessage(`[INFO] Templates ignored.`);
        }

        // Time events
        if (timeEvents != "ignore") {

            // Check if time events in import file
            if (importData.timeEvents.length > 0) {
                let existingTimeEvents = importData.timeEvents;

                // Process time event
                existingTimeEvents.forEach(existingTimeEvent => {

                    // Create flow
                    if (timeEvents == "create") {

                        // Get time event
                        let timeEvent = getTimeEventById(
                            nccLocation,
                            nccToken,
                            existingTimeEvent._id
                        );

                        // Check if time event found
                        if (Object.keys(timeEvent).length > 0) {
                            postMessage(`[INFO] Time event with ID "${existingTimeEvent._id}" already exists with name "${timeEvent.name}".`);
                        } else {

                            // Check if time event with same name already exists
                            let timeEvent = getTimeEventByName(
                                nccLocation,
                                nccToken,
                                existingTimeEvent.name
                            );

                            if (Object.keys(timeEvent).length > 0) {
                                postMessage(`[WARNING] Time event with name "${existingTimeEvent.name}" already exists.`);
                            } else {

                                // Create time event
                                let success = upsertTimeEvent(
                                    nccLocation,
                                    nccToken,
                                    existingTimeEvent
                                );

                                // Check if time event created
                                if (success) {
                                    postMessage(`[INFO] Time event "${existingTimeEvent.name}" created.`);
                                } else {
                                    errorMessage += `\tTime event "${existingTimeEvent.name}" not created.\n`;
                                    postMessage(`[ERROR] Time event "${existingTimeEvent.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (timeEvents == "update") {

                        // Update time event
                        let success = upsertTimeEvent(
                            nccLocation,
                            nccToken,
                            existingTimeEvent
                        );

                        // Check if time event updated
                        if (success) {
                            postMessage(`[INFO] Time event "${existingTimeEvent.name}" updated.`);
                        } else {
                            errorMessage += `\tTime event "${existingTimeEvent.name}" not updated.\n`;
                            postMessage(`[ERROR] Time event "${existingTimeEvent.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No time events found in import file.`);
            }
        } else {
            postMessage(`[INFO] Time events ignored.`);
        }

        // User profiles
        if (userProfiles != "ignore") {

            // Check if user profiles in import file
            if (importData.userProfiles.length > 0) {
                let existingUserProfiles = importData.userProfiles;

                // Process user profiles
                existingUserProfiles.forEach(existingUserProfile => {

                    // Create flow
                    if (userProfiles == "create") {

                        // Get user profile
                        let userProfile = getUserProfileById(
                            nccLocation,
                            nccToken,
                            existingUserProfile._id
                        );

                        // Check if user profile found
                        if (Object.keys(userProfile).length > 0) {
                            postMessage(`[INFO] User profile with ID "${existingUserProfile._id}" already exists with name "${userProfile.name}".`);
                        } else {

                            // Check if user profile with same name already exists
                            let userProfile = getUserProfileByName(
                                nccLocation,
                                nccToken,
                                existingUserProfile.name
                            );

                            if (Object.keys(userProfile).length > 0) {
                                postMessage(`[WARNING] User profile with name "${existingUserProfile.name}" already exists.`);
                            } else {

                                // Create user profile
                                let success = upsertUserProfile(
                                    nccLocation,
                                    nccToken,
                                    existingUserProfile
                                );

                                // Check if user profile created
                                if (success) {
                                    postMessage(`[INFO] User profile "${existingUserProfile.name}" created.`);
                                } else {
                                    errorMessage += `\tUser profile "${existingUserProfile.name}" not created.\n`;
                                    postMessage(`[ERROR] User profile "${existingUserProfile.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (userProfiles == "update") {

                        // Update user profile
                        let success = upsertUserProfile(
                            nccLocation,
                            nccToken,
                            existingUserProfile
                        );

                        // Check if user profile updated
                        if (success) {
                            postMessage(`[INFO] User profile "${existingUserProfile.name}" updated.`);
                        } else {
                            errorMessage += `\tUser profile "${existingUserProfile.name}" not updated.\n`;
                            postMessage(`[ERROR] User profile "${existingUserProfile.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No user profiles found in import file.`);
            }
        } else {
            postMessage(`[INFO] User profiles ignored.`);
        }

        // WhatsApp templates
        if (whatsAppTemplates != "ignore") {

            // Check if WhatsApp templates in import file
            if (importData.whatsAppTemplates.length > 0) {
                let existingWhatsAppTemplates = importData.whatsAppTemplates;

                // Process WhatsApp templates
                existingWhatsAppTemplates.forEach(existingWhatsAppTemplate => {

                    // Create flow
                    if (whatsAppTemplates == "create") {

                        // Get WhatsApp template
                        let whatsAppTemplate = getWhatsAppTemplateById(
                            nccLocation,
                            nccToken,
                            existingWhatsAppTemplate._id
                        );

                        // Check if WhatsApp template found
                        if (Object.keys(whatsAppTemplate).length > 0) {
                            postMessage(`[INFO] WhatsApp template with ID "${existingWhatsAppTemplate._id}" already exists with name "${whatsAppTemplate.name}".`);
                        } else {

                            // Check if WhatsApp template with same name already exists
                            let whatsAppTemplate = getWhatsAppTemplateByName(
                                nccLocation,
                                nccToken,
                                existingWhatsAppTemplate.name
                            );

                            if (Object.keys(whatsAppTemplate).length > 0) {
                                postMessage(`[WARNING] WhatsApp template with name "${existingWhatsAppTemplate.name}" already exists.`);
                            } else {

                                // Create WhatsApp template
                                let success = upsertWhatsAppTemplate(
                                    nccLocation,
                                    nccToken,
                                    existingWhatsAppTemplate
                                );

                                // Check if WhatsApp template created
                                if (success) {
                                    postMessage(`[INFO] WhatsApp template "${existingWhatsAppTemplate.name}" created.`);
                                } else {
                                    errorMessage += `\tWhatsApp template "${existingWhatsAppTemplate.name}" not created.\n`;
                                    postMessage(`[ERROR] WhatsApp template "${existingWhatsAppTemplate.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (whatsAppTemplates == "update") {

                        // Update WhatsApp template
                        let success = upsertWhatsAppTemplate(
                            nccLocation,
                            nccToken,
                            existingWhatsAppTemplate
                        );

                        // Check if WhatsApp template updated
                        if (success) {
                            postMessage(`[INFO] WhatsApp template "${existingWhatsAppTemplate.name}" updated.`);
                        } else {
                            errorMessage += `\tWhatsApp template "${existingWhatsAppTemplate.name}" not updated.\n`;
                            postMessage(`[ERROR] WhatsApp template "${existingWhatsAppTemplate.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No WhatsApp templates found in import file.`);
            }
        } else {
            postMessage(`[INFO] WhatsApp templates ignored.`);
        }

        // Widgets
        if (widgets != "ignore") {

            // Check if widgets in import file
            if (importData.widgets.length > 0) {
                let existingWidgets = importData.widgets;

                // Process widgets
                existingWidgets.forEach(existingWidget => {

                    // Create flow
                    if (widgets == "create") {

                        // Get widget
                        let widget = getWidgetById(
                            nccLocation,
                            nccToken,
                            existingWidget._id
                        );

                        // Check if widget found
                        if (Object.keys(widget).length > 0) {
                            postMessage(`[INFO] Widget with ID "${existingWidget._id}" already exists with name "${widget.name}".`);
                        } else {

                            // Check if widget with same name already exists
                            let widget = getWidgetByName(
                                nccLocation,
                                nccToken,
                                existingWidget.name
                            );

                            if (Object.keys(widget).length > 0) {
                                postMessage(`[WARNING] Widget with name "${existingWidget.name}" already exists.`);
                            } else {

                                // Create widget
                                let success = upsertWidget(
                                    nccLocation,
                                    nccToken,
                                    existingWidget
                                );

                                // Check if widget created
                                if (success) {
                                    postMessage(`[INFO] Widget "${existingWidget.name}" created.`);
                                } else {
                                    errorMessage += `\tWidget "${existingWidget.name}" not created.\n`;
                                    postMessage(`[ERROR] Widget "${existingWidget.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (widgets == "update") {

                        // Update widget
                        let success = upsertWidget(
                            nccLocation,
                            nccToken,
                            existingWidget
                        );

                        // Check if widget updated
                        if (success) {
                            postMessage(`[INFO] Widget "${existingWidget.name}" updated.`);
                        } else {
                            errorMessage += `\tWidget "${existingWidget.name}" not updated.\n`;
                            postMessage(`[ERROR] Widget "${existingWidget.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No widgets found in import file.`);
            }
        } else {
            postMessage(`[INFO] Widgets ignored.`);
        }

        // Workflows
        if (workflows != "ignore") {

            // Check if workflows in import file
            if (importData.workflows.length > 0) {
                let existingWorkflows = importData.workflows;

                // Process workflows
                existingWorkflows.forEach(existingWorkflow => {

                    // Create flow
                    if (workflows == "create") {

                        // Get workflow
                        let workflow = getWorkflowById(
                            nccLocation,
                            nccToken,
                            existingWorkflow._id
                        );

                        // Check if workflow found
                        if (Object.keys(workflow).length > 0) {
                            postMessage(`[INFO] Workflow with ID "${existingWorkflow._id}" already exists with name "${workflow.name}".`);
                        } else {

                            // Check if workflow with same name already exists
                            let workflow = getWorkflowByName(
                                nccLocation,
                                nccToken,
                                existingWorkflow.name
                            );

                            if (Object.keys(workflow).length > 0) {
                                postMessage(`[WARNING] Workflow with name "${existingWorkflow.name}" already exists.`);
                            } else {

                                // Create workflow
                                let success = upsertWorkflow(
                                    nccLocation,
                                    nccToken,
                                    existingWorkflow
                                );

                                // Check if workflow created
                                if (success) {
                                    postMessage(`[INFO] Workflow "${existingWorkflow.name}" created.`);
                                } else {
                                    errorMessage += `\tWorkflow "${existingWorkflow.name}" not created.\n`;
                                    postMessage(`[ERROR] Workflow "${existingWorkflow.name}" not created.`);
                                }
                            }
                        }
                    }

                    // Update flow
                    else if (workflows == "update") {

                        // Update workflow
                        let success = upsertWorkflow(
                            nccLocation,
                            nccToken,
                            existingWorkflow
                        );

                        // Check if workflow updated
                        if (success) {
                            postMessage(`[INFO] Workflow "${existingWorkflow.name}" updated.`);
                        } else {
                            errorMessage += `\tWorkflow "${existingWorkflow.name}" not updated.\n`;
                            postMessage(`[ERROR] Workflow "${existingWorkflow.name}" not updated.`);
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No workflows found in import file.`);
            }
        } else {
            postMessage(`[INFO] Workflows ignored.`);
        }

        if (errorMessage === "") {
            postEvent(
                "success",
                nccLocation,
                nccToken,
                "normal",
                "importcampaign",
                `Import of one or more campaigns completed.`,
                "Import Completed",
                username
            );
        } else {
            postEvent(
                "warning",
                nccLocation,
                nccToken,
                "normal",
                "importcampaign",
                `Import of one or more campaigns completed, but with errors.`,
                "Import Completed",
                username
            );
        }

        // End import
        postMessage({
            "action": "submit",
            "status": "complete"
        });
    }

    // ==============================
    // End
    // ==============================

    const endTime = performance.now();
    const durationMs = endTime - startTime;

    // Check if errors found
    if (errorMessage != "") {
        postMessage(``);
        postMessage(`[WARNING] The following errors occurred:`);
        postMessage(``);
        postMessage(errorMessage);
    }

    postMessage(``);
    postMessage(`[INFO] Script complete.`);
    postMessage(`[INFO] Duration: ${formatDuration(durationMs)}`);

    postMessage(``);

    // ==============================
    // Utility functions
    // ==============================

    function formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }
}