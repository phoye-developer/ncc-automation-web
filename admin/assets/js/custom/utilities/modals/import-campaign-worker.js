importScripts("inc/config-dispositions.js");
importScripts("inc/config-queues.js");
importScripts("inc/datadog.js");
importScripts("inc/ncc-business-events.js");
importScripts("inc/ncc-campaign-agent-scripts.js");
importScripts("inc/ncc-campaign-dial-plans.js");
importScripts("inc/ncc-campaign-dispositions.js");
importScripts("inc/ncc-campaign-goals.js");
importScripts("inc/ncc-campaign-partitions.js");
importScripts("inc/ncc-campaign-scorecards.js");
importScripts("inc/ncc-campaign-scripts.js");
importScripts("inc/ncc-campaign-speech-contexts.js");
importScripts("inc/ncc-campaign-templates.js");
importScripts("inc/ncc-campaign-whatsapp-templates.js");
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
    var tenantId = config.tenantId;
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
    var updatedIds = config.updatedIds;

    // Initial messages
    var updateMessage = "";
    var warningMessage = "";
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
            let action = config.businessEvents;
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
                        postMessage(`[INFO] Business event "${businessEventFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tBusiness event "${businessEventFound.name}" found, ID: "${businessEvent._id}".\n`;
                        }
                    } else {

                        // Check if business event with same name already exists
                        let businessEventFound = getBusinessEventByName(
                            nccLocation,
                            nccToken,
                            businessEvent.name
                        );

                        if (Object.keys(businessEventFound).length > 0) {
                            updatedIds[businessEvent._id] = businessEventFound._id;
                            postMessage(`[INFO] Business event "${businessEventFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tBusiness event "${businessEventFound.name}", ID: "${businessEventFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No business events found in import file.`);
            }
        } else {
            errorMessage += `\tNo "businessEvents" property found in import file.\n`;
            fileIsValid = false;
        }

        // Campaign goals
        if ("campaignGoals" in importData) {
            let action = config.campaignGoals;
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
                        postMessage(`[INFO] Campaign goal "${campaignGoalFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tCampaign goal "${campaignGoalFound.name}" found, ID: "${campaignGoal._id}".\n`;
                        }
                    } else {

                        // Check if campaign goal with same name already exists
                        let campaignGoalFound = getCampaignGoalByName(
                            nccLocation,
                            nccToken,
                            campaignGoal.name
                        );

                        if (Object.keys(campaignGoalFound).length > 0) {
                            updatedIds[campaignGoal._id] = campaignGoalFound._id;
                            postMessage(`[INFO] Campaign goal "${campaignGoalFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tCampaign goal "${campaignGoalFound.name}", ID: "${campaignGoalFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No campaign goals found in import file.`);
            }
        } else {
            errorMessage += `\tNo "campaignGoals" property found in import file.\n`;
            fileIsValid = false;
        }

        // Campaign scripts
        if ("campaignScripts" in importData) {
            let action = config.campaignScripts;
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
                        postMessage(`[INFO] Campaign script "${campaignScriptFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tCampaign script "${campaignScriptFound.name}" found, ID: "${campaignScript._id}".\n`;
                        }
                    } else {

                        // Check if campaign script with same name already exists
                        let campaignScriptFound = getCampaignScriptByName(
                            nccLocation,
                            nccToken,
                            campaignScript.name
                        );

                        if (Object.keys(campaignScriptFound).length > 0) {
                            updatedIds[campaignScript._id] = campaignScriptFound._id;
                            postMessage(`[INFO] Campaign script "${campaignScriptFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tCampaign script "${campaignScriptFound.name}", ID: "${campaignScriptFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No campaign scripts found in import file.`);
            }
        } else {
            errorMessage += `\tNo "campaignScripts" property found in import file.\n`;
            fileIsValid = false;
        }

        // Campaigns
        if ("campaigns" in importData) {
            let action = config.campaigns;
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
                        postMessage(`[INFO] Campaign "${campaignFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tCampaign "${campaignFound.name}" found, ID: "${campaign._id}".\n`;
                        }
                    } else {

                        // Check if campaign with same name already exists
                        let campaignFound = getCampaignByName(
                            nccLocation,
                            nccToken,
                            campaign.name
                        );

                        if (Object.keys(campaignFound).length > 0) {
                            updatedIds[campaign._id] = campaignFound._id;
                            postMessage(`[INFO] Campaign "${campaignFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tCampaign "${campaignFound.name}", ID: "${campaignFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No campaigns found in import file.`);
            }
        } else {
            errorMessage += `\tNo "campaigns" property found in import file.\n`;
            fileIsValid = false;
        }

        // Categories
        if ("categories" in importData) {
            let action = config.categories;
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
                        postMessage(`[INFO] Category "${categoryFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tCategory "${categoryFound.name}" found, ID: "${category._id}".\n`;
                        }
                    } else {

                        // Check if category with same name already exists
                        let categoryFound = getCategoryByName(
                            nccLocation,
                            nccToken,
                            category.name
                        );

                        if (Object.keys(categoryFound).length > 0) {
                            updatedIds[category._id] = categoryFound._id;
                            postMessage(`[INFO] Category "${categoryFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tCategory "${categoryFound.name}", ID: "${categoryFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No categories found in import file.`);
            }
        } else {
            errorMessage += `\tNo "categories" property found in import file.\n`;
            fileIsValid = false;
        }

        // Category summaries
        if ("categorySummaries" in importData) {
            let action = config.categorySummaries;
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
                        postMessage(`[INFO] Category summary "${categorySummaryFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tCategory summary "${categorySummaryFound.name}" found, ID: "${categorySummary._id}".\n`;
                        }
                    } else {

                        // Check if category summary with same name already exists
                        let categorySummaryFound = getCategorySummaryByName(
                            nccLocation,
                            nccToken,
                            categorySummary.name
                        );

                        if (Object.keys(categorySummaryFound).length > 0) {
                            updatedIds[categorySummary._id] = categorySummaryFound._id;
                            postMessage(`[INFO] Category summary "${categorySummaryFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tCategory summary "${categorySummaryFound.name}", ID: "${categorySummaryFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No category summaries found in import file.`);
            }
        } else {
            errorMessage += `\tNo "categorySummaries" property found in import file.\n`;
            fileIsValid = false;
        }

        // Classifications
        if ("classifications" in importData) {
            let action = config.classifications;
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
                        postMessage(`[INFO] Classification "${classificationFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tClassification "${classificationFound.name}" found, ID: "${classification._id}".\n`;
                        }
                    } else {

                        // Check if classification with same name already exists
                        let classificationFound = getClassificationByName(
                            nccLocation,
                            nccToken,
                            classification.name
                        );

                        if (Object.keys(classificationFound).length > 0) {
                            updatedIds[classification._id] = classificationFound._id;
                            postMessage(`[INFO] Classification "${classificationFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tClassification "${classificationFound.name}", ID: "${classificationFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No classifications found in import file.`);
            }
        } else {
            errorMessage += `\tNo "classifications" property found in import file.\n`;
            fileIsValid = false;
        }

        // Dashboards
        if ("dashboards" in importData) {
            let action = config.dashboards;
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
                        postMessage(`[INFO] Dashboard "${dashboardFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tDashboard "${dashboardFound.name}" found, ID: "${dashboard._id}".\n`;
                        }
                    } else {

                        // Check if dashboard with same name already exists
                        let dashboardFound = getDashboardByName(
                            nccLocation,
                            nccToken,
                            dashboard.name
                        );

                        if (Object.keys(dashboardFound).length > 0) {
                            updatedIds[dashboard._id] = dashboardFound._id;
                            postMessage(`[INFO] Dashboard "${dashboardFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tDashboard "${dashboardFound.name}", ID: "${dashboardFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No dashboards found in import file.`);
            }
        } else {
            errorMessage += `\tNo "dashboards" property found in import file.\n`;
            fileIsValid = false;
        }

        // Dial plans
        if ("dialPlans" in importData) {
            let action = config.dialPlans;
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
                        postMessage(`[INFO] Dial plan "${dialPlanFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tDial plan "${dialPlanFound.name}" found, ID: "${dialPlan._id}".\n`;
                        }
                    } else {

                        // Check if dial plan with same name already exists
                        let dialPlanFound = getDialPlanByName(
                            nccLocation,
                            nccToken,
                            dialPlan.name
                        );

                        if (Object.keys(dialPlanFound).length > 0) {
                            updatedIds[dialPlan._id] = dialPlanFound._id;
                            postMessage(`[INFO] Dial plan "${dialPlanFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tDial plan "${dialPlanFound.name}", ID: "${dialPlanFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No dial plans found in import file.`);
            }
        } else {
            errorMessage += `\tNo "dialPlans" property found in import file.\n`;
            fileIsValid = false;
        }

        // Dispositions
        if ("dispositions" in importData) {
            let action = config.dispositions;
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
                        postMessage(`[INFO] Disposition "${dispositionFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tDisposition "${dispositionFound.name}" found, ID: "${disposition._id}".\n`;
                        }
                    } else {

                        // Check if disposition with same name already exists
                        let dispositionFound = getDispositionByName(
                            nccLocation,
                            nccToken,
                            disposition.name
                        );

                        if (Object.keys(dispositionFound).length > 0) {
                            updatedIds[disposition._id] = dispositionFound._id;
                            postMessage(`[INFO] Disposition "${dispositionFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tDisposition "${dispositionFound.name}", ID: "${dispositionFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No dispositions found in import file.`);
            }
        } else {
            errorMessage += `\tNo "dispositions" property found in import file.\n`;
            fileIsValid = false;
        }

        // Entities
        if ("entities" in importData) {
            let action = config.entities;
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
                        postMessage(`[INFO] Entity "${entityFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tEntity "${entityFound.name}" found, ID: "${entity._id}".\n`;
                        }
                    } else {

                        // Check if entity with same name already exists
                        let entityFound = getEntityByName(
                            nccLocation,
                            nccToken,
                            entity.name
                        );

                        if (Object.keys(entityFound).length > 0) {
                            updatedIds[entity._id] = entityFound._id;
                            postMessage(`[INFO] Entity "${entityFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tEntity "${entityFound.name}", ID: "${entityFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No entities found in import file.`);
            }
        } else {
            errorMessage += `\tNo "entities" property found in import file.\n`;
            fileIsValid = false;
        }

        // Field mappings
        if ("fieldMappings" in importData) {
            let action = config.fieldMappings;
            let fieldMappings = importData.fieldMappings;

            if (fieldMappings.length > 0) {
                fieldMappings.forEach(fieldMapping => {

                    // Get field mapping
                    let fieldMappingFound = getFieldMappingsById(
                        nccLocation,
                        nccToken,
                        fieldMapping._id
                    );

                    // Check if field mappings found
                    if (Object.keys(fieldMappingFound).length > 0) {
                        postMessage(`[INFO] Field mappings "${fieldMappingFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tField mappings "${fieldMappingFound.name}" found, ID: "${fieldMapping._id}".\n`;
                        }
                    } else {

                        // Check if field mappings with same name already exists
                        let fieldMappingFound = getFieldMappingsByName(
                            nccLocation,
                            nccToken,
                            fieldMapping.name
                        );

                        if (Object.keys(fieldMappingFound).length > 0) {
                            updatedIds[fieldMapping._id] = fieldMappingFound._id;
                            postMessage(`[INFO] Field mappings "${fieldMappingFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tField mappings "${fieldMappingFound.name}", ID: "${fieldMappingFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No field mappings found in import file.`);
            }
        } else {
            errorMessage += `\tNo "fieldMappings" property found in import file.\n`;
            fileIsValid = false;
        }

        // File servers
        if ("fileServers" in importData) {
            let action = config.fileServers;
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
                        postMessage(`[INFO] File server "${fileServerFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tFile server "${fileServerFound.name}" found, ID: "${fileServer._id}".\n`;
                        }
                    } else {

                        // Check if file server with same name already exists
                        let fileServerFound = getFileServerByName(
                            nccLocation,
                            nccToken,
                            fileServer.name
                        );

                        if (Object.keys(fileServerFound).length > 0) {
                            updatedIds[fileServer._id] = fileServerFound._id;
                            postMessage(`[INFO] File server "${fileServerFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tFile server "${fileServerFound.name}", ID: "${fileServerFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No file servers found in import file.`);
            }
        } else {
            errorMessage += `\tNo "fileServers" property found in import file.\n`;
            fileIsValid = false;
        }

        // Filters
        if ("filters" in importData) {
            let action = config.filters;
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
                        postMessage(`[INFO] Filter "${filterFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tFilter "${filterFound.name}" found, ID: "${filter._id}".\n`;
                        }
                    } else {

                        // Check if filter with same name already exists
                        let filterFound = getFilterByName(
                            nccLocation,
                            nccToken,
                            filter.name
                        );

                        if (Object.keys(filterFound).length > 0) {
                            updatedIds[filter._id] = filterFound._id;
                            postMessage(`[INFO] Filter "${filterFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tFilter "${filterFound.name}", ID: "${filterFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No filters found in import file.`);
            }
        } else {
            errorMessage += `\tNo "filters" property found in import file.\n`;
            fileIsValid = false;
        }

        // Functions
        if ("functions" in importData) {
            let action = config.functions;
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
                        postMessage(`[INFO] Function "${functionFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tFunction "${functionFound.name}" found, ID: "${nccFunction._id}".\n`;
                        }
                    } else {

                        // Check if function with same name already exists
                        let functionFound = getFunctionByName(
                            nccLocation,
                            nccToken,
                            nccFunction.name
                        );

                        if (Object.keys(functionFound).length > 0) {
                            updatedIds[nccFunction._id] = functionFound._id;
                            postMessage(`[INFO] Function "${functionFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tFunction "${functionFound.name}", ID: "${functionFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No functions found in import file.`);
            }
        } else {
            errorMessage += `\tNo "functions" property found in import file.\n`;
            fileIsValid = false;
        }

        // Home tabs
        if ("homeTabs" in importData) {
            let action = config.homeTabs;
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
                        postMessage(`[INFO] Home tab "${homeTabFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tHome tab "${homeTabFound.name}" found, ID: "${homeTab._id}".\n`;
                        }
                    } else {

                        // Check if home tab with same name already exists
                        let homeTabFound = getHomeTabByName(
                            nccLocation,
                            nccToken,
                            homeTab.name
                        );

                        if (Object.keys(homeTabFound).length > 0) {
                            updatedIds[homeTab._id] = homeTabFound._id;
                            postMessage(`[INFO] Home tab "${homeTabFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tHome tab "${homeTabFound.name}", ID: "${homeTabFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No home tabs found in import file.`);
            }
        } else {
            errorMessage += `\tNo "homeTabs" property found in import file.\n`;
            fileIsValid = false;
        }

        // Music
        if ("music" in importData) {
            let action = config.music;
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
                        postMessage(`[INFO] Music "${musicFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tMusic "${musicFound.name}" found, ID: "${music._id}".\n`;
                        }
                    } else {

                        // Check if music with same name already exists
                        let musicFound = getMusicByName(
                            nccLocation,
                            nccToken,
                            music.name
                        );

                        if (Object.keys(musicFound).length > 0) {
                            updatedIds[music._id] = musicFound._id;
                            postMessage(`[INFO] Music "${musicFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tMusic "${musicFound.name}", ID: "${musicFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No music found in import file.`);
            }
        } else {
            errorMessage += `\tNo "music" property found in import file.\n`;
            fileIsValid = false;
        }

        // Partitions
        if ("partitions" in importData) {
            let action = config.partitions;
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
                        postMessage(`[INFO] Partition "${partitionFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tPartition "${partitionFound.name}" found, ID: "${partition._id}".\n`;
                        }
                    } else {

                        // Check if partition with same name already exists
                        let partitionFound = getPartitionByName(
                            nccLocation,
                            nccToken,
                            partition.name
                        );

                        if (Object.keys(partitionFound).length > 0) {
                            updatedIds[partition._id] = partitionFound._id;
                            postMessage(`[INFO] Partition "${partitionFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tPartition "${partitionFound.name}", ID: "${partitionFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No partitions found in import file.`);
            }
        } else {
            errorMessage += `\tNo "partitions" property found in import file.\n`;
            fileIsValid = false;
        }

        // Prompts
        if ("prompts" in importData) {
            let action = config.prompts;
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
                        postMessage(`[INFO] Prompt "${promptFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tPrompt "${promptFound.name}" found, ID: "${prompt._id}".\n`;
                        }
                    } else {

                        // Check if prompt with same name already exists
                        let promptFound = getPromptByName(
                            nccLocation,
                            nccToken,
                            prompt.name
                        );

                        if (Object.keys(promptFound).length > 0) {
                            updatedIds[prompt._id] = promptFound._id;
                            postMessage(`[INFO] Prompt "${promptFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tPrompt "${promptFound.name}", ID: "${promptFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No prompts found in import file.`);
            }
        } else {
            errorMessage += `\tNo "prompts" property found in import file.\n`;
            fileIsValid = false;
        }

        // Queues
        if ("queues" in importData) {
            let action = config.queues;
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
                        postMessage(`[INFO] Queue "${queueFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tQueue "${queueFound.name}" found, ID: "${queue._id}".\n`;
                        }
                    } else {

                        // Check if queue with same name already exists
                        let queueFound = getQueueByName(
                            nccLocation,
                            nccToken,
                            queue.name
                        );

                        if (Object.keys(queueFound).length > 0) {
                            updatedIds[queue._id] = queueFound._id;
                            postMessage(`[INFO] Queue "${queueFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tQueue "${queueFound.name}", ID: "${queueFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No queues found in import file.`);
            }
        } else {
            errorMessage += `\tNo "queues" property found in import file.\n`;
            fileIsValid = false;
        }

        // Reports
        if ("reports" in importData) {
            let action = config.reports;
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
                        postMessage(`[INFO] Report "${reportFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tReport "${reportFound.name}" found, ID: "${report._id}".\n`;
                        }
                    } else {

                        // Check if report with same name already exists
                        let reportFound = getReportByName(
                            nccLocation,
                            nccToken,
                            report.name
                        );

                        if (Object.keys(reportFound).length > 0) {
                            updatedIds[report._id] = reportFound._id;
                            postMessage(`[INFO] Report "${reportFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tReport "${reportFound.name}", ID: "${reportFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No reports found in import file.`);
            }
        } else {
            errorMessage += `\tNo "reports" property found in import file.\n`;
            fileIsValid = false;
        }

        // REST calls
        if ("restCalls" in importData) {
            let action = config.restCalls;
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
                        postMessage(`[INFO] REST call "${restCallFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tREST call "${restCallFound.name}" found, ID: "${restCall._id}".\n`;
                        }
                    } else {

                        // Check if REST call with same name already exists
                        let restCallFound = getRestCallByName(
                            nccLocation,
                            nccToken,
                            restCall.name
                        );

                        if (Object.keys(restCallFound).length > 0) {
                            updatedIds[restCall._id] = restCallFound._id;
                            postMessage(`[INFO] REST call "${restCallFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tREST call "${restCallFound.name}", ID: "${restCallFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No REST calls found in import file.`);
            }
        } else {
            errorMessage += `\tNo "restCalls" property found in import file.\n`;
            fileIsValid = false;
        }

        // Scorecards
        if ("scorecards" in importData) {
            let action = config.scorecards;
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
                        postMessage(`[INFO] Scorecard "${scorecardFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tScorecard "${scorecardFound.name}" found, ID: "${scorecard._id}".\n`;
                        }
                    } else {

                        // Check if scorecard with same name already exists
                        let scorecardFound = getScorecardByName(
                            nccLocation,
                            nccToken,
                            scorecard.name
                        );

                        if (Object.keys(scorecardFound).length > 0) {
                            updatedIds[scorecard._id] = scorecardFound._id;
                            postMessage(`[INFO] Scorecard "${scorecardFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tScorecard "${scorecardFound.name}", ID: "${scorecardFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No scorecards found in import file.`);
            }
        } else {
            errorMessage += `\tNo "scorecards" property found in import file.\n`;
            fileIsValid = false;
        }

        // Scripts
        if ("scripts" in importData) {
            let action = config.scripts;
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
                        postMessage(`[INFO] Script "${scriptFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tScript "${scriptFound.name}" found, ID: "${script._id}".\n`;
                        }
                    } else {

                        // Check if script with same name already exists
                        let scriptFound = getScriptByName(
                            nccLocation,
                            nccToken,
                            script.name
                        );

                        if (Object.keys(scriptFound).length > 0) {
                            updatedIds[script._id] = scriptFound._id;
                            postMessage(`[INFO] Script "${scriptFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tScript "${scriptFound.name}", ID: "${scriptFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No scripts found in import file.`);
            }
        } else {
            errorMessage += `\tNo "scripts" property found in import file.\n`;
            fileIsValid = false;
        }

        // Skills
        if ("skills" in importData) {
            let action = config.skills;
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
                        postMessage(`[INFO] Skill "${skillFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tSkill "${skillFound.name}" found, ID: "${skill._id}".\n`;
                        }
                    } else {

                        // Check if skill with same name already exists
                        let skillFound = getSkillByName(
                            nccLocation,
                            nccToken,
                            skill.name
                        );

                        if (Object.keys(skillFound).length > 0) {
                            updatedIds[skill._id] = skillFound._id;
                            postMessage(`[INFO] Skill "${skillFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tSkill "${skillFound.name}", ID: "${skillFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No skills found in import file.`);
            }
        } else {
            errorMessage += `\tNo "skills" property found in import file.\n`;
            fileIsValid = false;
        }

        // State DIDs
        if ("stateDids" in importData) {
            let action = config.stateDids;
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
                        postMessage(`[INFO] State DID "${stateDidFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tState DID "${stateDidFound.name}" found, ID: "${stateDid._id}".\n`;
                        }
                    } else {

                        // Check if state DID with same name already exists
                        let stateDidFound = getStateDidByName(
                            nccLocation,
                            nccToken,
                            stateDid.name
                        );

                        if (Object.keys(stateDidFound).length > 0) {
                            updatedIds[stateDid._id] = stateDidFound._id;
                            postMessage(`[INFO] State DID "${stateDidFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tState DID "${stateDidFound.name}", ID: "${stateDidFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No state DIDs found in import file.`);
            }
        } else {
            errorMessage += `\tNo "stateDids" property found in import file.\n`;
            fileIsValid = false;
        }

        // Survey themes
        if ("surveyThemes" in importData) {
            let action = config.surveyThemes;
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
                        postMessage(`[INFO] Survey theme "${surveyThemeFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tSurvey theme "${surveyThemeFound.name}" found, ID: "${surveyTheme._id}".\n`;
                        }
                    } else {

                        // Check if survey theme with same name already exists
                        let surveyThemeFound = getSurveyThemeByName(
                            nccLocation,
                            nccToken,
                            surveyTheme.name
                        );

                        if (Object.keys(surveyThemeFound).length > 0) {
                            updatedIds[surveyTheme._id] = surveyThemeFound._id;
                            postMessage(`[INFO] Survey theme "${surveyThemeFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tSurvey theme "${surveyThemeFound.name}", ID: "${surveyThemeFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No survey themes found in import file.`);
            }
        } else {
            errorMessage += `\tNo "surveyThemes" property found in import file.\n`;
            fileIsValid = false;
        }

        // Surveys
        if ("surveys" in importData) {
            let action = config.surveys;
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
                        postMessage(`[INFO] Survey "${surveyFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tSurvey "${surveyFound.name}" found, ID: "${survey._id}".\n`;
                        }
                    } else {

                        // Check if survey with same name already exists
                        let surveyFound = getSurveyByName(
                            nccLocation,
                            nccToken,
                            survey.name
                        );

                        if (Object.keys(surveyFound).length > 0) {
                            updatedIds[survey._id] = surveyFound._id;
                            postMessage(`[INFO] Survey "${surveyFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tSurvey "${surveyFound.name}", ID: "${surveyFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No surveys found in import file.`);
            }
        } else {
            errorMessage += `\tNo "surveys" property found in import file.\n`;
            fileIsValid = false;
        }

        // Templates
        if ("templates" in importData) {
            let action = config.templates;
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
                        postMessage(`[INFO] Template "${templateFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tTemplate "${templateFound.name}" found, ID: "${template._id}".\n`;
                        }
                    } else {

                        // Check if template with same name already exists
                        let templateFound = getTemplateByName(
                            nccLocation,
                            nccToken,
                            template.name
                        );

                        if (Object.keys(templateFound).length > 0) {
                            updatedIds[template._id] = templateFound._id;
                            postMessage(`[INFO] Template "${templateFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tTemplate "${templateFound.name}", ID: "${templateFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No templates found in import file.`);
            }
        } else {
            errorMessage += `\tNo "templates" property found in import file.\n`;
            fileIsValid = false;
        }

        // Time events
        if ("timeEvents" in importData) {
            let action = config.timeEvents;
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
                        postMessage(`[INFO] Time event "${timeEventFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tTime event "${timeEventFound.name}" found, ID: "${timeEvent._id}".\n`;
                        }
                    } else {

                        // Check if time event with same name already exists
                        let timeEventFound = getTimeEventByName(
                            nccLocation,
                            nccToken,
                            timeEvent.name
                        );

                        if (Object.keys(timeEventFound).length > 0) {
                            updatedIds[timeEvent._id] = timeEventFound._id;
                            postMessage(`[INFO] Time event "${timeEventFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tTime event "${timeEventFound.name}", ID: "${timeEventFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No time events found in import file.`);
            }
        } else {
            errorMessage += `\tNo "timeEvents" property found in import file.\n`;
            fileIsValid = false;
        }

        // User profiles
        if ("userProfiles" in importData) {
            let action = config.userProfiles;
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
                        postMessage(`[INFO] User profile "${userProfileFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tUser profile "${userProfileFound.name}" found, ID: "${userProfile._id}".\n`;
                        }
                    } else {

                        // Check if user profile with same name already exists
                        let userProfileFound = getUserProfileByName(
                            nccLocation,
                            nccToken,
                            userProfile.name
                        );

                        if (Object.keys(userProfileFound).length > 0) {
                            updatedIds[userProfile._id] = userProfileFound._id;
                            postMessage(`[INFO] User profile "${userProfileFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tUser profile "${userProfileFound.name}", ID: "${userProfileFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No user profiles found in import file.`);
            }
        } else {
            errorMessage += `\tNo "userProfiles" property found in import file.\n`;
            fileIsValid = false;
        }

        // WhatsApp templates
        if ("whatsAppTemplates" in importData) {
            let action = config.whatsAppTemplates;
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
                        postMessage(`[INFO] WhatsApp template "${whatsAppTemplateFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tWhatsApp template "${whatsAppTemplateFound.name}" found, ID: "${whatsAppTemplate._id}".\n`;
                        }
                    } else {

                        // Check if WhatsApp template with same name already exists
                        let whatsAppTemplateFound = getWhatsAppTemplateByName(
                            nccLocation,
                            nccToken,
                            whatsAppTemplate.name
                        );

                        if (Object.keys(whatsAppTemplateFound).length > 0) {
                            updatedIds[whatsAppTemplate._id] = whatsAppTemplateFound._id;
                            postMessage(`[INFO] WhatsApp template "${whatsAppTemplateFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tWhatsApp template "${whatsAppTemplateFound.name}", ID: "${whatsAppTemplateFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No WhatsApp templates found in import file.`);
            }
        } else {
            errorMessage += `\tNo "whatsAppTemplates" property found in import file.\n`;
            fileIsValid = false;
        }

        // Widgets
        if ("widgets" in importData) {
            let action = config.widgets;
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
                        postMessage(`[INFO] Widget "${widgetFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tWidget "${widgetFound.name}" found, ID: "${widget._id}".\n`;
                        }
                    } else {

                        // Check if widget with same name already exists
                        let widgetFound = getWidgetByName(
                            nccLocation,
                            nccToken,
                            widget.name
                        );

                        if (Object.keys(widgetFound).length > 0) {
                            updatedIds[widget._id] = widgetFound._id;
                            postMessage(`[INFO] Widget "${widgetFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tWidget "${widgetFound.name}", ID: "${widgetFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No widgets found in import file.`);
            }
        } else {
            errorMessage += `\tNo "widgets" property found in import file.\n`;
            fileIsValid = false;
        }

        // Workflows
        if ("workflows" in importData) {
            let action = config.workflows;
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
                        postMessage(`[INFO] Workflow "${workflowFound.name}" found.`);
                        if (action == "update") {
                            updateMessage += `\tWorkflow "${workflowFound.name}" found, ID: "${workflow._id}".\n`;
                        }
                    } else {

                        // Check if workflow with same name already exists
                        let workflowFound = getWorkflowByName(
                            nccLocation,
                            nccToken,
                            workflow.name
                        );

                        if (Object.keys(workflowFound).length > 0) {
                            updatedIds[workflow._id] = workflowFound._id;
                            postMessage(`[INFO] Workflow "${workflowFound.name}" found, but with different ID.`);
                            if (action == "update") {
                                updateMessage += `\tWorkflow "${workflowFound.name}", ID: "${workflowFound._id}".\n`;
                            }
                        }
                    }
                });
            } else {
                postMessage(`[INFO] No workflows found in import file.`);
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
            "updatedIds": JSON.stringify(updatedIds),
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

        // Update IDs
        updateNestedValues(importData, JSON.parse(updatedIds));

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
                            postMessage(`[INFO] Business event "${existingBusinessEvent._id}" already exists "${businessEvent.name}".`);
                        } else {

                            // Check if business event with same name already exists
                            let businessEvent = getBusinessEventByName(
                                nccLocation,
                                nccToken,
                                existingBusinessEvent.name
                            );

                            if (Object.keys(businessEvent).length > 0) {
                                warningMessage += `\tBusiness event "${existingBusinessEvent.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Business event "${existingBusinessEvent.name}" exists, but with different ID.`);
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

                        // Get business event
                        let businessEvent = getBusinessEventById(
                            nccLocation,
                            nccToken,
                            existingBusinessEvent._id
                        );

                        if (Object.keys(businessEvent).length > 0) {

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
                        } else {

                            // Check if business event with same name already exists
                            let businessEvent = getBusinessEventByName(
                                nccLocation,
                                nccToken,
                                existingBusinessEvent.name
                            );

                            if (Object.keys(businessEvent).length > 0) {
                                warningMessage += `\tBusiness event "${existingBusinessEvent.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Business event "${existingBusinessEvent.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Campaign goal "${existingCampaignGoal._id}" already exists "${campaignGoal.name}".`);
                        } else {

                            // Check if campaign goal with same name already exists
                            let campaignGoal = getCampaignGoalByName(
                                nccLocation,
                                nccToken,
                                existingCampaignGoal.name
                            );

                            if (Object.keys(campaignGoal).length > 0) {
                                warningMessage += `\tCampaign goal "${existingCampaignGoal.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Campaign goal "${existingCampaignGoal.name}" exists, but with different ID.`);
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

                        // Get campaign goal
                        let campaignGoal = getCampaignGoalsById(
                            nccLocation,
                            nccToken,
                            existingCampaignGoal._id
                        );

                        if (Object.keys(campaignGoal).length > 0) {

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
                        } else {

                            // Check if campaign goal with same name already exists
                            let campaignGoal = getCampaignGoalByName(
                                nccLocation,
                                nccToken,
                                existingCampaignGoal.name
                            );

                            if (Object.keys(campaignGoal).length > 0) {
                                warningMessage += `\tCampaign goal "${existingCampaignGoal.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Campaign goal "${existingCampaignGoal.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Campaign script "${existingCampaignScript._id}" already exists "${campaignScript.name}".`);
                        } else {

                            // Check if campaign script with same name already exists
                            let campaignScript = getCampaignScriptByName(
                                nccLocation,
                                nccToken,
                                existingCampaignScript.name
                            );

                            if (Object.keys(campaignScript).length > 0) {
                                warningMessage += `\tCampaign script "${existingCampaignScript.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Campaign script "${existingCampaignScript.name}" exists, but with different ID.`);
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

                        // Get campaign script
                        let campaignScript = getCampaignScriptById(
                            nccLocation,
                            nccToken,
                            existingCampaignScript._id
                        );

                        if (Object.keys(campaignScript).length > 0) {

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
                        } else {

                            // Check if campaign script with same name already exists
                            let campaignScript = getCampaignScriptByName(
                                nccLocation,
                                nccToken,
                                existingCampaignScript.name
                            );

                            if (Object.keys(campaignScript).length > 0) {
                                warningMessage += `\tCampaign script "${existingCampaignScript.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Campaign script "${existingCampaignScript.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Campaign "${existingCampaign._id}" already exists "${campaign.name}".`);
                        } else {

                            // Check if campaign with same name already exists
                            let campaign = getCampaignByName(
                                nccLocation,
                                nccToken,
                                existingCampaign.name
                            );

                            if (Object.keys(campaign).length > 0) {
                                warningMessage += `\tCampaign "${existingCampaign.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Campaign "${existingCampaign.name}" exists, but with different ID.`);
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

                        // Get campaign
                        let campaign = getCampaignById(
                            nccLocation,
                            nccToken,
                            existingCampaign._id
                        );

                        if (Object.keys(campaign).length > 0) {

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
                        } else {

                            // Check if campaign with same name already exists
                            let campaign = getCampaignByName(
                                nccLocation,
                                nccToken,
                                existingCampaign.name
                            );

                            if (Object.keys(campaign).length > 0) {
                                warningMessage += `\tCampaign "${existingCampaign.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Campaign "${existingCampaign.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Category "${existingCategory._id}" already exists "${category.name}".`);
                        } else {

                            // Check if category with same name already exists
                            let category = getCategoryByName(
                                nccLocation,
                                nccToken,
                                existingCategory.name
                            );

                            if (Object.keys(category).length > 0) {
                                warningMessage += `\tCategory "${existingCategory.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Category "${existingCategory.name}" exists, but with different ID.`);
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

                        // Get category
                        let category = getCategoryById(
                            nccLocation,
                            nccToken,
                            existingCategory._id
                        );

                        if (Object.keys(category).length > 0) {

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
                        } else {

                            // Check if category with same name already exists
                            let category = getCategoryByName(
                                nccLocation,
                                nccToken,
                                existingCategory.name
                            );

                            if (Object.keys(category).length > 0) {
                                warningMessage += `\tCategory "${existingCategory.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Category "${existingCategory.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Category summary "${existingCategorySummary._id}" already exists "${categorySummary.name}".`);
                        } else {

                            // Check if category summary with same name already exists
                            let categorySummary = getCategorySummaryByName(
                                nccLocation,
                                nccToken,
                                existingCategorySummary.name
                            );

                            if (Object.keys(categorySummary).length > 0) {
                                warningMessage += `\tCategory summary "${existingCategorySummary.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Category summary "${existingCategorySummary.name}" exists, but with different ID.`);
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

                        // Get category summary
                        let categorySummary = getCategorySummaryById(
                            nccLocation,
                            nccToken,
                            existingCategorySummary._id
                        );

                        if (Object.keys(categorySummary).length > 0) {

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
                        } else {

                            // Check if category summary with same name already exists
                            let categorySummary = getCategorySummaryByName(
                                nccLocation,
                                nccToken,
                                existingCategorySummary.name
                            );

                            if (Object.keys(categorySummary).length > 0) {
                                warningMessage += `\tCategory summary "${existingCategorySummary.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Category summary "${existingCategorySummary.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Classification "${existingClassification._id}" already exists "${classification.name}".`);
                        } else {

                            // Check if classification with same name already exists
                            let classification = getClassificationByName(
                                nccLocation,
                                nccToken,
                                existingClassification.name
                            );

                            if (Object.keys(classification).length > 0) {
                                warningMessage += `\tClassification "${existingClassification.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Classification "${existingClassification.name}" exists, but with different ID.`);
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

                        // Get classification
                        let classification = getClassificationById(
                            nccLocation,
                            nccToken,
                            existingClassification._id
                        );

                        if (Object.keys(classification).length > 0) {

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
                        } else {

                            // Check if classification with same name already exists
                            let classification = getClassificationByName(
                                nccLocation,
                                nccToken,
                                existingClassification.name
                            );

                            if (Object.keys(classification).length > 0) {
                                warningMessage += `\tClassification "${existingClassification.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Classification "${existingClassification.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Dashboard "${existingDashboard._id}" already exists "${dashboard.name}".`);
                        } else {

                            // Check if dashboard with same name already exists
                            let dashboard = getDashboardByName(
                                nccLocation,
                                nccToken,
                                existingDashboard.name
                            );

                            if (Object.keys(dashboard).length > 0) {
                                warningMessage += `\tDashboard "${existingDashboard.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Dashboard "${existingDashboard.name}" exists, but with different ID.`);
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

                        // Get dashboard
                        let dashboard = getDashboardById(
                            nccLocation,
                            nccToken,
                            existingDashboard._id
                        );

                        if (Object.keys(dashboard).length > 0) {

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
                        } else {

                            // Check if dashboard with same name already exists
                            let dashboard = getDashboardByName(
                                nccLocation,
                                nccToken,
                                existingDashboard.name
                            );

                            if (Object.keys(dashboard).length > 0) {
                                warningMessage += `\tDashboard "${existingDashboard.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Dashboard "${existingDashboard.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Dial plan "${existingDialPlan._id}" already exists "${dialPlan.name}".`);
                        } else {

                            // Check if dial plan with same name already exists
                            let dialPlan = getDialPlanByName(
                                nccLocation,
                                nccToken,
                                existingDialPlan.name
                            );

                            if (Object.keys(dialPlan).length > 0) {
                                warningMessage += `\tDial plan "${existingDialPlan.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Dial plan "${existingDialPlan.name}" exists, but with different ID.`);
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

                        // Get dial plan
                        let dialPlan = getDialPlanById(
                            nccLocation,
                            nccToken,
                            existingDialPlan._id
                        );

                        if (Object.keys(dialPlan).length > 0) {

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
                        } else {

                            // Check if dial plan with same name already exists
                            let dialPlan = getDialPlanByName(
                                nccLocation,
                                nccToken,
                                existingDialPlan.name
                            );

                            if (Object.keys(dialPlan).length > 0) {
                                warningMessage += `\tDial plan "${existingDialPlan.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Dial plan "${existingDialPlan.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Disposition "${existingDisposition._id}" already exists "${disposition.name}".`);
                        } else {

                            // Check if disposition with same name already exists
                            let disposition = getDispositionByName(
                                nccLocation,
                                nccToken,
                                existingDisposition.name
                            );

                            if (Object.keys(disposition).length > 0) {
                                warningMessage += `\tDisposition "${existingDisposition.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Disposition "${existingDisposition.name}" exists, but with different ID.`);
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

                        // Get disposition
                        let disposition = getDispositionById(
                            nccLocation,
                            nccToken,
                            existingDisposition._id
                        );

                        if (Object.keys(disposition).length > 0) {

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
                        } else {

                            // Check if disposition with same name already exists
                            let disposition = getDispositionByName(
                                nccLocation,
                                nccToken,
                                existingDisposition.name
                            );

                            if (Object.keys(disposition).length > 0) {
                                warningMessage += `\tDisposition "${existingDisposition.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Disposition "${existingDisposition.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Entity "${existingEntity._id}" already exists "${entity.name}".`);
                        } else {

                            // Check if entity with same name already exists
                            let entity = getEntityByName(
                                nccLocation,
                                nccToken,
                                existingEntity.name
                            );

                            if (Object.keys(entity).length > 0) {
                                warningMessage += `\tEntity "${existingEntity.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Entity "${existingEntity.name}" exists, but with different ID.`);
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

                        // Get entity
                        let entity = getEntityById(
                            nccLocation,
                            nccToken,
                            existingEntity._id
                        );

                        if (Object.keys(entity).length > 0) {

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
                        } else {

                            // Check if entity with same name already exists
                            let entity = getEntityByName(
                                nccLocation,
                                nccToken,
                                existingEntity.name
                            );

                            if (Object.keys(entity).length > 0) {
                                warningMessage += `\tEntity "${existingEntity.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Entity "${existingEntity.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Field mapping "${existingFieldMapping._id}" already exists "${fieldMapping.name}".`);
                        } else {

                            // Check if field mapping with same name already exists
                            let fieldMapping = getFieldMappingsByName(
                                nccLocation,
                                nccToken,
                                existingFieldMapping.name
                            );

                            if (Object.keys(fieldMapping).length > 0) {
                                warningMessage += `\tField mapping "${existingFieldMapping.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Field mapping "${existingFieldMapping.name}" exists, but with different ID.`);
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

                        // Get field mapping
                        let fieldMapping = getFieldMappingsById(
                            nccLocation,
                            nccToken,
                            existingFieldMapping._id
                        );

                        if (Object.keys(fieldMapping).length) {

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
                        } else {

                            // Check if field mapping with same name already exists
                            let fieldMapping = getFieldMappingsByName(
                                nccLocation,
                                nccToken,
                                existingFieldMapping.name
                            );

                            if (Object.keys(fieldMapping).length > 0) {
                                warningMessage += `\tField mapping "${existingFieldMapping.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Field mapping "${existingFieldMapping.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] File server "${existingFileServer._id}" already exists "${fileServer.name}".`);
                        } else {

                            // Check if file server with same name already exists
                            let fileServer = getFileServerByName(
                                nccLocation,
                                nccToken,
                                existingFileServer.name
                            );

                            if (Object.keys(fileServer).length > 0) {
                                warningMessage += `\tFile server "${existingFileServer.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] File server "${existingFileServer.name}" exists, but with different ID.`);
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

                        // Get file server
                        let fileServer = getFileServerById(
                            nccLocation,
                            nccToken,
                            existingFileServer._id
                        );

                        if (Object.keys(fileServer).length > 0) {

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
                        } else {

                            // Check if file server with same name already exists
                            let fileServer = getFileServerByName(
                                nccLocation,
                                nccToken,
                                existingFileServer.name
                            );

                            if (Object.keys(fileServer).length > 0) {
                                warningMessage += `\tFile server "${existingFileServer.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] File server "${existingFileServer.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Filter "${existingFilter._id}" already exists "${filter.name}".`);
                        } else {

                            // Check if filter with same name already exists
                            let filter = getFilterByName(
                                nccLocation,
                                nccToken,
                                existingFilter.name
                            );

                            if (Object.keys(filter).length > 0) {
                                warningMessage += `\tFilter "${existingFilter.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Filter "${existingFilter.name}" exists, but with different ID.`);
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

                        // Get filter
                        let filter = getFilterById(
                            nccLocation,
                            nccToken,
                            existingFilter._id
                        );

                        if (Object.keys(filter).length > 0) {

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
                        } else {

                            // Check if filter with same name already exists
                            let filter = getFilterByName(
                                nccLocation,
                                nccToken,
                                existingFilter.name
                            );

                            if (Object.keys(filter).length > 0) {
                                warningMessage += `\tFilter "${existingFilter.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Filter "${existingFilter.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Function "${existingFunction._id}" already exists "${nccFunction.name}".`);
                        } else {

                            // Check if function with same name already exists
                            let nccFunction = getFunctionByName(
                                nccLocation,
                                nccToken,
                                existingFunction.name
                            );

                            if (Object.keys(nccFunction).length > 0) {
                                warningMessage += `\tFunction "${existingFunction.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Function "${existingFunction.name}" exists, but with different ID.`);
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

                        // Get function
                        let nccFunction = getFunctionById(
                            nccLocation,
                            nccToken,
                            existingFunction._id
                        );

                        if (Object.keys(nccFunction).length > 0) {

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
                        } else {

                            // Check if function with same name already exists
                            let nccFunction = getFunctionByName(
                                nccLocation,
                                nccToken,
                                existingFunction.name
                            );

                            if (Object.keys(nccFunction).length > 0) {
                                warningMessage += `\tFunction "${existingFunction.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Function "${existingFunction.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Home tab "${existingHomeTab._id}" already exists "${homeTab.name}".`);
                        } else {

                            // Check if home tab with same name already exists
                            let homeTab = getHomeTabByName(
                                nccLocation,
                                nccToken,
                                existingHomeTab.name
                            );

                            if (Object.keys(homeTab).length > 0) {
                                warningMessage += `\tHome tab "${existingHomeTab.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Home tab "${existingHomeTab.name}" exists, but with different ID.`);
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

                        // Get home tab
                        let homeTab = getHomeTabById(
                            nccLocation,
                            nccToken,
                            existingHomeTab._id
                        );

                        if (Object.keys(homeTab).length > 0) {

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
                        } else {

                            // Check if home tab with same name already exists
                            let homeTab = getHomeTabByName(
                                nccLocation,
                                nccToken,
                                existingHomeTab.name
                            );

                            if (Object.keys(homeTab).length > 0) {
                                warningMessage += `\tHome tab "${existingHomeTab.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Home tab "${existingHomeTab.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Music "${existingMusic._id}" already exists "${music.name}".`);
                        } else {

                            // Check if music with same name already exists
                            let music = getMusicByName(
                                nccLocation,
                                nccToken,
                                existingMusic.name
                            );

                            if (Object.keys(music).length > 0) {
                                warningMessage += `\tMusic "${existingMusic.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Music "${existingMusic.name}" exists, but with different ID.`);
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

                        // Get music
                        let music = getMusicById(
                            nccLocation,
                            nccToken,
                            existingMusic._id
                        );

                        if (Object.keys(music).length > 0) {

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
                        } else {

                            // Check if music with same name already exists
                            let music = getMusicByName(
                                nccLocation,
                                nccToken,
                                existingMusic.name
                            );

                            if (Object.keys(music).length > 0) {
                                warningMessage += `\tMusic "${existingMusic.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Music "${existingMusic.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Partition "${existingPartition._id}" already exists "${partition.name}".`);
                        } else {

                            // Check if partition with same name already exists
                            let partition = getPartitionByName(
                                nccLocation,
                                nccToken,
                                existingPartition.name
                            );

                            if (Object.keys(partition).length > 0) {
                                warningMessage += `\tPartition "${existingPartition.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Partition "${existingPartition.name}" exists, but with different ID.`);
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

                        // Get partition
                        let partition = getPartitionById(
                            nccLocation,
                            nccToken,
                            existingPartition._id
                        );

                        if (Object.keys(partition).length > 0) {

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
                        } else {

                            // Check if partition with same name already exists
                            let partition = getPartitionByName(
                                nccLocation,
                                nccToken,
                                existingPartition.name
                            );

                            if (Object.keys(partition).length > 0) {
                                warningMessage += `\tPartition "${existingPartition.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Partition "${existingPartition.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Prompt "${existingPrompt._id}" already exists "${prompt.name}".`);
                        } else {

                            // Check if prompt with same name already exists
                            let prompt = getPromptByName(
                                nccLocation,
                                nccToken,
                                existingPrompt.name
                            );

                            if (Object.keys(prompt).length > 0) {
                                warningMessage += `\tPrompt "${existingPrompt.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Prompt "${existingPrompt.name}" exists, but with different ID.`);
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

                        // Get prompt
                        let prompt = getPromptById(
                            nccLocation,
                            nccToken,
                            existingPrompt._id
                        );

                        if (Object.keys(prompt).length > 0) {

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
                        } else {

                            // Check if prompt with same name already exists
                            let prompt = getPromptByName(
                                nccLocation,
                                nccToken,
                                existingPrompt.name
                            );

                            if (Object.keys(prompt).length > 0) {
                                warningMessage += `\tPrompt "${existingPrompt.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Prompt "${existingPrompt.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Queue "${existingQueue._id}" already exists "${queue.name}".`);
                        } else {

                            // Check if queue with same name already exists
                            let queue = getQueueByName(
                                nccLocation,
                                nccToken,
                                existingQueue.name
                            );

                            if (Object.keys(queue).length > 0) {
                                warningMessage += `\tQueue "${existingQueue.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Queue "${existingQueue.name}" exists, but with different ID.`);
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

                        // Get queue
                        let queue = getQueueById(
                            nccLocation,
                            nccToken,
                            existingQueue._id
                        );

                        if (Object.keys(queue).length > 0) {

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
                        } else {

                            // Check if queue with same name already exists
                            let queue = getQueueByName(
                                nccLocation,
                                nccToken,
                                existingQueue.name
                            );

                            if (Object.keys(queue).length > 0) {
                                warningMessage += `\tQueue with name ${existingQueue.name} exists, but with different ID.\n`;
                                postMessage(`[WARNING] Queue with name ${existingQueue.name} exists, but with different ID.`);
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
                            postMessage(`[INFO] Report "${existingReport._id}" already exists "${report.name}".`);
                        } else {

                            // Check if report with same name already exists
                            let report = getReportByName(
                                nccLocation,
                                nccToken,
                                existingReport.name
                            );

                            if (Object.keys(report).length > 0) {
                                warningMessage += `\tReport "${existingReport.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Report "${existingReport.name}" exists, but with different ID.`);
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

                        // Get report
                        let report = getReportById(
                            nccLocation,
                            nccToken,
                            existingReport._id
                        );

                        if (Object.keys(report).length > 0) {

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
                        } else {

                            // Check if report with same name already exists
                            let report = getReportByName(
                                nccLocation,
                                nccToken,
                                existingReport.name
                            );

                            if (Object.keys(report).length > 0) {
                                warningMessage += `\tReport "${existingReport.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Report "${existingReport.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] REST call "${existingRestCall._id}" already exists "${restCall.name}".`);
                        } else {

                            // Check if REST call with same name already exists
                            let restCall = getRestCallByName(
                                nccLocation,
                                nccToken,
                                existingRestCall.name
                            );

                            if (Object.keys(restCall).length > 0) {
                                warningMessage += `\tREST call "${existingRestCall.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] REST call "${existingRestCall.name}" exists, but with different ID.`);
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

                        // Get REST call
                        let restCall = getRestCallById(
                            nccLocation,
                            nccToken,
                            existingRestCall._id
                        );

                        if (Object.keys(restCall).length > 0) {

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
                        } else {

                            // Check if REST call with same name already exists
                            let restCall = getRestCallByName(
                                nccLocation,
                                nccToken,
                                existingRestCall.name
                            );

                            if (Object.keys(restCall).length > 0) {
                                warningMessage += `\tREST call "${existingRestCall.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] REST call "${existingRestCall.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Scorecard "${existingScorecard._id}" already exists "${scorecard.name}".`);
                        } else {

                            // Check if scorecard with same name already exists
                            let scorecard = getScorecardByName(
                                nccLocation,
                                nccToken,
                                existingScorecard.name
                            );

                            if (Object.keys(scorecard).length > 0) {
                                warningMessage += `\tScorecard "${existingScorecard.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Scorecard "${existingScorecard.name}" exists, but with different ID.`);
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

                        // Get scorecard
                        let scorecard = getScorecardById(
                            nccLocation,
                            nccToken,
                            existingScorecard._id
                        );

                        if (Object.keys(scorecard).length > 0) {

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
                        } else {

                            // Check if scorecard with same name already exists
                            let scorecard = getScorecardByName(
                                nccLocation,
                                nccToken,
                                existingScorecard.name
                            );

                            if (Object.keys(scorecard).length > 0) {
                                warningMessage += `\tScorecard "${existingScorecard.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Scorecard "${existingScorecard.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Script "${existingScript._id}" already exists "${script.name}".`);
                        } else {

                            // Check if script with same name already exists
                            let script = getScriptByName(
                                nccLocation,
                                nccToken,
                                existingScript.name
                            );

                            if (Object.keys(script).length > 0) {
                                warningMessage += `\tScript "${existingScript.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Script "${existingScript.name}" exists, but with different ID.`);
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

                        // Get script
                        let script = getScriptById(
                            nccLocation,
                            nccToken,
                            existingScript._id
                        );

                        if (Object.keys(script).length > 0) {

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
                        } else {

                            // Check if script with same name already exists
                            let script = getScriptByName(
                                nccLocation,
                                nccToken,
                                existingScript.name
                            );

                            if (Object.keys(script).length > 0) {
                                warningMessage += `\tScript "${existingScript.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Script "${existingScript.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Skill "${existingSkill._id}" already exists "${skill.name}".`);
                        } else {

                            // Check if skill with same name already exists
                            let skill = getSkillByName(
                                nccLocation,
                                nccToken,
                                existingSkill.name
                            );

                            if (Object.keys(skill).length > 0) {
                                warningMessage += `\tSkill "${existingSkill.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Skill "${existingSkill.name}" exists, but with different ID.`);
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

                        // Get skill
                        let skill = getSkillById(
                            nccLocation,
                            nccToken,
                            existingSkill._id
                        );

                        if (Object.keys(skill).length > 0) {

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
                        } else {

                            // Check if skill with same name already exists
                            let skill = getSkillByName(
                                nccLocation,
                                nccToken,
                                existingSkill.name
                            );

                            if (Object.keys(skill).length > 0) {
                                warningMessage += `\tSkill "${existingSkill.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Skill "${existingSkill.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] State DID "${existingStateDid._id}" already exists "${stateDid.name}".`);
                        } else {

                            // Check if state DID with same name already exists
                            let stateDid = getStateDidByName(
                                nccLocation,
                                nccToken,
                                existingStateDid.name
                            );

                            if (Object.keys(stateDid).length > 0) {
                                warningMessage += `\tState DID "${existingStateDid.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] State DID "${existingStateDid.name}" exists, but with different ID.`);
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

                        // Get state DID
                        let stateDid = getStateDidById(
                            nccLocation,
                            nccToken,
                            existingStateDid._id
                        );

                        if (Object.keys(stateDid).length > 0) {

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
                        } else {

                            // Check if state DID with same name already exists
                            let stateDid = getStateDidByName(
                                nccLocation,
                                nccToken,
                                existingStateDid.name
                            );

                            if (Object.keys(stateDid).length > 0) {
                                warningMessage += `\tState DID "${existingStateDid.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] State DID "${existingStateDid.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Survey theme "${existingSurveyTheme._id}" already exists "${surveyTheme.name}".`);
                        } else {

                            // Check if survey theme with same name already exists
                            let surveyTheme = getSurveyThemeByName(
                                nccLocation,
                                nccToken,
                                existingSurveyTheme.name
                            );

                            if (Object.keys(surveyTheme).length > 0) {
                                warningMessage += `\tSurvey theme "${existingSurveyTheme.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Survey theme "${existingSurveyTheme.name}" exists, but with different ID.`);
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

                        // Get survey theme
                        let surveyTheme = getSurveyThemeById(
                            nccLocation,
                            nccToken,
                            existingSurveyTheme._id
                        );

                        if (Object.keys(surveyTheme).length > 0) {

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
                        } else {

                            // Check if survey theme with same name already exists
                            let surveyTheme = getSurveyThemeByName(
                                nccLocation,
                                nccToken,
                                existingSurveyTheme.name
                            );

                            if (Object.keys(surveyTheme).length > 0) {
                                warningMessage += `\tSurvey theme "${existingSurveyTheme.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Survey theme "${existingSurveyTheme.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Survey "${existingSurvey._id}" already exists "${survey.name}".`);
                        } else {

                            // Check if survey with same name already exists
                            let survey = getSurveyByName(
                                nccLocation,
                                nccToken,
                                existingSurvey.name
                            );

                            if (Object.keys(survey).length > 0) {
                                warningMessage += `\tSurvey "${existingSurvey.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Survey "${existingSurvey.name}" exists, but with different ID.`);
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

                        // Get survey
                        let survey = getSurveyById(
                            nccLocation,
                            nccToken,
                            existingSurvey._id
                        );

                        if (Object.keys(survey).length > 0) {

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
                        } else {

                            // Check if survey with same name already exists
                            let survey = getSurveyByName(
                                nccLocation,
                                nccToken,
                                existingSurvey.name
                            );

                            if (Object.keys(survey).length > 0) {
                                warningMessage += `\tSurvey "${existingSurvey.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Survey "${existingSurvey.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Template "${existingTemplate._id}" already exists "${template.name}".`);
                        } else {

                            // Check if template with same name already exists
                            let template = getTemplateByName(
                                nccLocation,
                                nccToken,
                                existingTemplate.name
                            );

                            if (Object.keys(template).length > 0) {
                                warningMessage += `\tTemplate "${existingTemplate.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Template "${existingTemplate.name}" exists, but with different ID.`);
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

                        // Get template
                        let template = getTemplateById(
                            nccLocation,
                            nccToken,
                            existingTemplate._id
                        );

                        if (Object.keys(template).length > 0) {

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
                        } else {

                            // Check if template with same name already exists
                            let template = getTemplateByName(
                                nccLocation,
                                nccToken,
                                existingTemplate.name
                            );

                            if (Object.keys(template).length > 0) {
                                warningMessage += `\tTemplate "${existingTemplate.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Template "${existingTemplate.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Time event "${existingTimeEvent._id}" already exists "${timeEvent.name}".`);
                        } else {

                            // Check if time event with same name already exists
                            let timeEvent = getTimeEventByName(
                                nccLocation,
                                nccToken,
                                existingTimeEvent.name
                            );

                            if (Object.keys(timeEvent).length > 0) {
                                warningMessage += `\tTime event "${existingTimeEvent.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Time event "${existingTimeEvent.name}" exists, but with different ID.`);
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

                        // Get time event
                        let timeEvent = getTimeEventById(
                            nccLocation,
                            nccToken,
                            existingTimeEvent._id
                        );

                        if (Object.keys(timeEvent).length > 0) {

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
                        } else {

                            // Check if time event with same name already exists
                            let timeEvent = getTimeEventByName(
                                nccLocation,
                                nccToken,
                                existingTimeEvent.name
                            );

                            if (Object.keys(timeEvent).length > 0) {
                                warningMessage += `\tTime event "${existingTimeEvent.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Time event "${existingTimeEvent.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] User profile "${existingUserProfile._id}" already exists "${userProfile.name}".`);
                        } else {

                            // Check if user profile with same name already exists
                            let userProfile = getUserProfileByName(
                                nccLocation,
                                nccToken,
                                existingUserProfile.name
                            );

                            if (Object.keys(userProfile).length > 0) {
                                warningMessage += `\tUser profile "${existingUserProfile.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] User profile "${existingUserProfile.name}" exists, but with different ID.`);
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

                        // Get user profile
                        let userProfile = getUserProfileById(
                            nccLocation,
                            nccToken,
                            existingUserProfile._id
                        );

                        if (Object.keys(userProfile).length > 0) {

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
                        } else {

                            // Check if user profile with same name already exists
                            let userProfile = getUserProfileByName(
                                nccLocation,
                                nccToken,
                                existingUserProfile.name
                            );

                            if (Object.keys(userProfile).length > 0) {
                                warningMessage += `\tUser profile "${existingUserProfile.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] User profile "${existingUserProfile.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] WhatsApp template "${existingWhatsAppTemplate._id}" already exists "${whatsAppTemplate.name}".`);
                        } else {

                            // Check if WhatsApp template with same name already exists
                            let whatsAppTemplate = getWhatsAppTemplateByName(
                                nccLocation,
                                nccToken,
                                existingWhatsAppTemplate.name
                            );

                            if (Object.keys(whatsAppTemplate).length > 0) {
                                warningMessage += `\tWhatsApp template "${existingWhatsAppTemplate.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] WhatsApp template "${existingWhatsAppTemplate.name}" exists, but with different ID.`);
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

                        // Get WhatsApp template
                        let whatsAppTemplate = getWhatsAppTemplateById(
                            nccLocation,
                            nccToken,
                            existingWhatsAppTemplate._id
                        );

                        if (Object.keys(whatsAppTemplate).length > 0) {

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
                        } else {

                            // Check if WhatsApp template with same name already exists
                            let whatsAppTemplate = getWhatsAppTemplateByName(
                                nccLocation,
                                nccToken,
                                existingWhatsAppTemplate.name
                            );

                            if (Object.keys(whatsAppTemplate).length > 0) {
                                warningMessage += `\tWhatsApp template "${existingWhatsAppTemplate.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] WhatsApp template "${existingWhatsAppTemplate.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Widget "${existingWidget._id}" already exists "${widget.name}".`);
                        } else {

                            // Check if widget with same name already exists
                            let widget = getWidgetByName(
                                nccLocation,
                                nccToken,
                                existingWidget.name
                            );

                            if (Object.keys(widget).length > 0) {
                                warningMessage += `\tWidget "${existingWidget.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Widget "${existingWidget.name}" exists, but with different ID.`);
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

                        // Get widget
                        let widget = getWidgetById(
                            nccLocation,
                            nccToken,
                            existingWidget._id
                        );

                        if (Object.keys(widget).length > 0) {

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
                        } else {

                            // Check if widget with same name already exists
                            let widget = getWidgetByName(
                                nccLocation,
                                nccToken,
                                existingWidget.name
                            );

                            if (Object.keys(widget).length > 0) {
                                warningMessage += `\tWidget "${existingWidget.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Widget "${existingWidget.name}" exists, but with different ID.`);
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
                            postMessage(`[INFO] Workflow "${existingWorkflow._id}" already exists "${workflow.name}".`);
                        } else {

                            // Check if workflow with same name already exists
                            let workflow = getWorkflowByName(
                                nccLocation,
                                nccToken,
                                existingWorkflow.name
                            );

                            if (Object.keys(workflow).length > 0) {
                                warningMessage += `\tWorkflow "${existingWorkflow.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Workflow "${existingWorkflow.name}" exists, but with different ID.`);
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

                        // Get workflow
                        let workflow = getWorkflowById(
                            nccLocation,
                            nccToken,
                            existingWorkflow._id
                        );

                        if (Object.keys(workflow).length > 0) {

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
                        } else {

                            // Check if workflow with same name already exists
                            let workflow = getWorkflowByName(
                                nccLocation,
                                nccToken,
                                existingWorkflow.name
                            );

                            if (Object.keys(workflow).length > 0) {
                                warningMessage += `\tWorkflow "${existingWorkflow.name}" exists, but with different ID.\n`;
                                postMessage(`[WARNING] Workflow "${existingWorkflow.name}" exists, but with different ID.`);
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
                });
            } else {
                postMessage(`[INFO] No workflows found in import file.`);
            }
        } else {
            postMessage(`[INFO] Workflows ignored.`);
        }

        // ==============================
        // Object assignments
        // ==============================

        // Assign campaign agent scripts to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find campaignagentscripts
                if (
                    "scripts" in campaign
                    && "count" in campaign.scripts
                    && campaign.scripts.count > 0
                ) {
                    let campaignAgentScripts = campaign.scripts.objects;
                    campaignAgentScripts.forEach(campaignAgentScript => {
                        if (
                            "campaignId" in campaignAgentScript
                            && "campaignscriptId" in campaignAgentScript
                        ) {
                            let campaignId = campaignAgentScript.campaignId;
                            let campaignScriptId = campaignAgentScript.campaignscriptId;

                            // Check if already assigned
                            let campaignAgentScriptFound = searchCampaignAgentScripts(
                                nccLocation,
                                nccToken,
                                campaignId,
                                campaignScriptId
                            );

                            // Check if found
                            if (Object.keys(campaignAgentScriptFound).length > 0) {
                                if (
                                    "expansions" in campaignAgentScript
                                    && "campaignscriptId" in campaignAgentScript.expansions
                                    && "name" in campaignAgentScript.expansions.campaignscriptId
                                    && campaignAgentScript.expansions.campaignscriptId.name != ""
                                ) {
                                    postMessage(`[INFO] Campaign script "${campaignAgentScript.expansions.campaignscriptId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] Campaign script ID "${campaignScriptId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if campaign script exists
                                    let campaignScript = getCampaignScriptById(
                                        nccLocation,
                                        nccToken,
                                        campaignScriptId
                                    );

                                    // Check if campaign script found
                                    if (Object.keys(campaignScript).length > 0) {

                                        // Assign campaign script to campaign
                                        let campaignAgentScriptCreated = createCampaignAgentScript(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            campaignScriptId
                                        );

                                        // Check if created
                                        if (Object.keys(campaignAgentScriptCreated).length > 0) {
                                            if (
                                                "expansions" in campaignAgentScriptCreated
                                                && "campaignscriptId" in campaignAgentScriptCreated.expansions
                                                && "name" in campaignAgentScriptCreated.expansions.campaignscriptId
                                                && campaignAgentScriptCreated.expansions.campaignscriptId.name != ""
                                            ) {
                                                postMessage(`[INFO] Campaign script "${campaignAgentScriptCreated.expansions.campaignscriptId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] Campaign script ID "${campaignscriptId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in campaignAgentScript
                                                && "campaignscriptId" in campaignAgentScript.expansions
                                                && "name" in campaignAgentScript.expansions.campaignscriptId
                                                && campaignAgentScript.expansions.campaignscriptId.name != ""
                                            ) {
                                                errorMessage += `\tCampaign script "${campaignAgentScript.expansions.campaignscriptId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Campaign script "${campaignAgentScript.expansions.campaignscriptId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tCampaign script ID "${campaignscriptId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Campaign script ID "${campaignscriptId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        // Assign dial plans to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find campaigndialplans
                if (
                    "dialplans" in campaign
                    && "count" in campaign.dialplans
                    && campaign.dialplans.count > 0
                ) {
                    let campaignDialPlans = campaign.dialplans.objects;
                    campaignDialPlans.forEach(campaignDialPlan => {
                        if (
                            "campaignId" in campaignDialPlan
                            && "dialplanId" in campaignDialPlan
                        ) {
                            let campaignId = campaignDialPlan.campaignId;
                            let dialPlanId = campaignDialPlan.dialplanId;

                            // Check if already assigned
                            let campaignDialPlanFound = searchCampaignDialPlans(
                                nccLocation,
                                nccToken,
                                campaignId,
                                dialPlanId
                            );

                            // Check if found
                            if (Object.keys(campaignDialPlanFound).length > 0) {
                                if (
                                    "expansions" in campaignDialPlan
                                    && "dialplanId" in campaignDialPlan.expansions
                                    && "name" in campaignDialPlan.expansions.dialplanId
                                    && campaignDialPlan.expansions.dialplanId.name != ""
                                ) {
                                    postMessage(`[INFO] Dial plan "${campaignDialPlan.expansions.dialplanId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] Dial plan ID "${dialPlanId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if dial plan exists
                                    let dialplan = getDialPlanById(
                                        nccLocation,
                                        nccToken,
                                        dialPlanId
                                    );

                                    // Check if dial plan found
                                    if (Object.keys(dialplan).length > 0) {

                                        // Assign dial plan to campaign
                                        let campaignDialPlanCreated = createCampaignDialPlan(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            dialPlanId
                                        );

                                        // Check if created
                                        if (Object.keys(campaignDialPlanCreated).length > 0) {
                                            if (
                                                "expansions" in campaignDialPlanCreated
                                                && "dialplanId" in campaignDialPlanCreated.expansions
                                                && "name" in campaignDialPlanCreated.expansions.dialplanId
                                                && campaignDialPlanCreated.expansions.dialplanId.name != ""
                                            ) {
                                                postMessage(`[INFO] Dial plan "${campaignDialPlanCreated.expansions.dialplanId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] Dial plan ID "${dialPlanId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in campaignDialPlan
                                                && "dialplanId" in campaignDialPlan.expansions
                                                && "name" in campaignDialPlan.expansions.dialplanId
                                                && campaignDialPlan.expansions.dialplanId.name != ""
                                            ) {
                                                errorMessage += `\tDial plan "${campaignDialPlan.expansions.dialplanId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Dial plan "${campaignDialPlan.expansions.dialplanId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tDial plan ID "${dialPlanId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Dial plan ID "${dialPlanId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        // Assign dispositions to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find campaigndispositions
                if (
                    "dispositions" in campaign
                    && "count" in campaign.dispositions
                    && campaign.dispositions.count > 0
                ) {
                    let campaigndispositions = campaign.dispositions.objects;
                    campaigndispositions.forEach(campaigndisposition => {
                        if (
                            "campaignId" in campaigndisposition
                            && "dispositionId" in campaigndisposition
                        ) {
                            let campaignId = campaigndisposition.campaignId;
                            let dispositionId = campaigndisposition.dispositionId;

                            // Check if already assigned
                            let campaignDispositionFound = searchCampaignDispositions(
                                nccLocation,
                                nccToken,
                                campaignId,
                                dispositionId
                            );

                            // Check if found
                            if (Object.keys(campaignDispositionFound).length > 0) {
                                if (
                                    "expansions" in campaigndisposition
                                    && "dispositionId" in campaigndisposition.expansions
                                    && "name" in campaigndisposition.expansions.dispositionId
                                    && campaigndisposition.expansions.dispositionId.name != ""
                                ) {
                                    postMessage(`[INFO] Disposition "${campaigndisposition.expansions.dispositionId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] Disposition ID "${dispositionId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if disposition exists
                                    let disposition = getDispositionById(
                                        nccLocation,
                                        nccToken,
                                        dispositionId
                                    );

                                    // Check if disposition found
                                    if (Object.keys(disposition).length > 0) {

                                        // Assign disposition to campaign
                                        let campaignDispositionCreated = createCampaignDisposition(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            dispositionId
                                        );

                                        // Check if created
                                        if (Object.keys(campaignDispositionCreated).length > 0) {
                                            if (
                                                "expansions" in campaignDispositionCreated
                                                && "dispositionId" in campaignDispositionCreated.expansions
                                                && "name" in campaignDispositionCreated.expansions.dispositionId
                                                && campaignDispositionCreated.expansions.dispositionId.name != ""
                                            ) {
                                                postMessage(`[INFO] Disposition "${campaignDispositionCreated.expansions.dispositionId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] Disposition ID "${dispositionId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in campaigndisposition
                                                && "dispositionId" in campaigndisposition.expansions
                                                && "name" in campaigndisposition.expansions.dispositionId
                                                && campaigndisposition.expansions.dispositionId.name != ""
                                            ) {
                                                errorMessage += `\tDisposition "${campaigndisposition.expansions.dispositionId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Disposition "${campaigndisposition.expansions.dispositionId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tDisposition ID "${dispositionId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Disposition ID "${dispositionId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        // Assign partitions to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find campaignpartitions
                if (
                    "partitions" in campaign
                    && "count" in campaign.partitions
                    && campaign.partitions.count > 0
                ) {
                    let campaignPartitions = campaign.partitions.objects;
                    campaignPartitions.forEach(campaignPartition => {
                        if (
                            "campaignId" in campaignPartition
                            && "partitionsId" in campaignPartition
                        ) {
                            let campaignId = campaignPartition.campaignId;
                            let partitionId = campaignPartition.partitionsId;

                            // Check if already assigned
                            let campaignPartitionFound = searchCampaignPartitions(
                                nccLocation,
                                nccToken,
                                campaignId,
                                partitionId
                            );

                            // Check if found
                            if (Object.keys(campaignPartitionFound).length > 0) {
                                if (
                                    "expansions" in campaignPartition
                                    && "partitionsId" in campaignPartition.expansions
                                    && "name" in campaignPartition.expansions.partitionsId
                                    && campaignPartition.expansions.partitionsId.name != ""
                                ) {
                                    postMessage(`[INFO] Partition "${campaignPartition.expansions.partitionsId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] Partition ID "${partitionId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if partition exists
                                    let partition = getPartitionById(
                                        nccLocation,
                                        nccToken,
                                        partitionId
                                    );

                                    // Check if partition found
                                    if (Object.keys(partition).length > 0) {

                                        // Assign partition to campaign
                                        let campaignPartitionCreated = createCampaignPartition(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            partitionId
                                        );

                                        // Check if created
                                        if (Object.keys(campaignPartitionCreated).length > 0) {
                                            if (
                                                "expansions" in campaignPartitionCreated
                                                && "partitionsId" in campaignPartitionCreated.expansions
                                                && "name" in campaignPartitionCreated.expansions.partitionsId
                                                && campaignPartitionCreated.expansions.partitionsId.name != ""
                                            ) {
                                                postMessage(`[INFO] Partition "${campaignPartitionCreated.expansions.partitionsId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] Partition ID "${partitionId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in campaignPartition
                                                && "partitionsId" in campaignPartition.expansions
                                                && "name" in campaignPartition.expansions.partitionsId
                                                && campaignPartition.expansions.partitionsId.name != ""
                                            ) {
                                                errorMessage += `\tPartition "${campaignPartition.expansions.partitionsId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Partition "${campaignPartition.expansions.partitionsId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tPartition ID "${partitionId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Partition ID "${partitionId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        // Assign scorecards to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find campaignscorecards
                if (
                    "scorecards" in campaign
                    && "count" in campaign.scorecards
                    && campaign.scorecards.count > 0
                ) {
                    let campaignScorecards = campaign.scorecards.objects;
                    campaignScorecards.forEach(campaignScorecard => {
                        if (
                            "campaignId" in campaignScorecard
                            && "scorecardId" in campaignScorecard
                        ) {
                            let campaignId = campaignScorecard.campaignId;
                            let scorecardId = campaignScorecard.scorecardId;

                            // Check if already assigned
                            let campaignScorecardFound = searchCampaignScorecards(
                                nccLocation,
                                nccToken,
                                campaignId,
                                scorecardId
                            );

                            // Check if found
                            if (Object.keys(campaignScorecardFound).length > 0) {
                                if (
                                    "expansions" in campaignScorecard
                                    && "scorecardId" in campaignScorecard.expansions
                                    && "name" in campaignScorecard.expansions.scorecardId
                                    && campaignScorecard.expansions.scorecardId.name != ""
                                ) {
                                    postMessage(`[INFO] Scorecard "${campaignScorecard.expansions.scorecardId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] Scorecard ID "${scorecardId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if scorecard exists
                                    let scorecard = getScorecardById(
                                        nccLocation,
                                        nccToken,
                                        scorecardId
                                    );

                                    // Check if scorecard found
                                    if (Object.keys(scorecard).length > 0) {

                                        // Assign scorecard to campaign
                                        let campaignScorecardCreated = createCampaignScorecard(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            scorecardId
                                        );

                                        // Check if created
                                        if (Object.keys(campaignScorecardCreated).length > 0) {
                                            if (
                                                "expansions" in campaignScorecardCreated
                                                && "scorecardId" in campaignScorecardCreated.expansions
                                                && "name" in campaignScorecardCreated.expansions.scorecardId
                                                && campaignScorecardCreated.expansions.scorecardId.name != ""
                                            ) {
                                                postMessage(`[INFO] Scorecard "${campaignScorecardCreated.expansions.scorecardId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] Scorecard ID "${scorecardId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in campaignScorecard
                                                && "scorecardId" in campaignScorecard.expansions
                                                && "name" in campaignScorecard.expansions.scorecardId
                                                && campaignScorecard.expansions.scorecardId.name != ""
                                            ) {
                                                errorMessage += `\tScorecard "${campaignScorecard.expansions.scorecardId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Scorecard "${campaignScorecard.expansions.scorecardId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tScorecard ID "${scorecardId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Scorecard ID "${scorecardId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        // Assign speech contexts to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find speechContexts
                if (
                    "speechContexts" in campaign
                    && "count" in campaign.speechContexts
                    && campaign.speechContexts.count > 0
                ) {
                    let campaignSpeechContexts = campaign.speechContexts.objects;
                    campaignSpeechContexts.forEach(campaignSpeechContext => {
                        if (
                            "campaignId" in campaignSpeechContext
                            && "classificationId" in campaignSpeechContext
                        ) {
                            let campaignId = campaignSpeechContext.campaignId;
                            let speechContextId = campaignSpeechContext.classificationId;

                            // Check if already assigned
                            let campaignSpeechContextFound = searchCampaignSpeechContexts(
                                nccLocation,
                                nccToken,
                                campaignId,
                                speechContextId
                            );

                            // Check if found
                            if (Object.keys(campaignSpeechContextFound).length > 0) {
                                if (
                                    "expansions" in campaignSpeechContext
                                    && "classificationId" in campaignSpeechContext.expansions
                                    && "name" in campaignSpeechContext.expansions.classificationId
                                    && campaignSpeechContext.expansions.classificationId.name != ""
                                ) {
                                    postMessage(`[INFO] Speech context (classification) "${campaignSpeechContext.expansions.classificationId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] Speech context (classification) ID "${speechContextId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if speech context (classification) exists
                                    let speechContextFound = getClassificationById(
                                        nccLocation,
                                        nccToken,
                                        speechContextId
                                    );

                                    // Check if speech context (classification) found
                                    if (Object.keys(speechContextFound).length > 0) {

                                        // Assign speech context (classification) to campaign
                                        let campaignSpeechContextCreated = createCampaignSpeechContext(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            speechContextId
                                        );

                                        // Check if created
                                        if (Object.keys(campaignSpeechContextCreated).length > 0) {
                                            if (
                                                "expansions" in campaignSpeechContextCreated
                                                && "classificationId" in campaignSpeechContextCreated.expansions
                                                && "name" in campaignSpeechContextCreated.expansions.classificationId
                                                && campaignSpeechContextCreated.expansions.classificationId.name != ""
                                            ) {
                                                postMessage(`[INFO] Speech context (classification) "${campaignSpeechContextCreated.expansions.classificationId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] Speech context (classification) ID "${speechContextId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in campaignSpeechContext
                                                && "classificationId" in campaignSpeechContext.expansions
                                                && "name" in campaignSpeechContext.expansions.classificationId
                                                && campaignSpeechContext.expansions.classificationId.name != ""
                                            ) {
                                                errorMessage += `\tSpeech context (classification) "${campaignSpeechContext.expansions.classificationId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Speech context (classification) "${campaignSpeechContext.expansions.classificationId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tSpeech context (classification) ID "${speechContextId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Speech context (classification) ID "${speechContextId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        // Assign templates to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find campaigntemplates
                if (
                    "templates" in campaign
                    && "count" in campaign.templates
                    && campaign.templates.count > 0
                ) {
                    let campaignTemplates = campaign.templates.objects;
                    campaignTemplates.forEach(campaignTemplate => {
                        if (
                            "campaignId" in campaignTemplate
                            && "templateId" in campaignTemplate
                        ) {
                            let campaignId = campaignTemplate.campaignId;
                            let templateId = campaignTemplate.templateId;

                            // Check if already assigned
                            let campaignTemplateFound = searchCampaignTemplates(
                                nccLocation,
                                nccToken,
                                campaignId,
                                templateId
                            );

                            // Check if found
                            if (Object.keys(campaignTemplateFound).length > 0) {
                                if (
                                    "expansions" in campaignTemplate
                                    && "templateId" in campaignTemplate.expansions
                                    && "name" in campaignTemplate.expansions.templateId
                                    && campaignTemplate.expansions.templateId.name != ""
                                ) {
                                    postMessage(`[INFO] Template "${campaignTemplate.expansions.templateId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] Template ID "${templateId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if template exists
                                    let template = getTemplateById(
                                        nccLocation,
                                        nccToken,
                                        templateId
                                    );

                                    // Check if template found
                                    if (Object.keys(template).length > 0) {

                                        // Assign template to campaign
                                        let campaignTemplateCreated = createCampaignTemplate(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            templateId
                                        );

                                        // Check if created
                                        if (Object.keys(campaignTemplateCreated).length > 0) {
                                            if (
                                                "expansions" in campaignTemplateCreated
                                                && "templateId" in campaignTemplateCreated.expansions
                                                && "name" in campaignTemplateCreated.expansions.templateId
                                                && campaignTemplateCreated.expansions.templateId.name != ""
                                            ) {
                                                postMessage(`[INFO] Template "${campaignTemplateCreated.expansions.templateId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] Template ID "${templateId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in campaignTemplate
                                                && "templateId" in campaignTemplate.expansions
                                                && "name" in campaignTemplate.expansions.templateId
                                                && campaignTemplate.expansions.templateId.name != ""
                                            ) {
                                                errorMessage += `\tTemplate "${campaignTemplate.expansions.templateId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Template "${campaignTemplate.expansions.templateId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tTemplate ID "${templateId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] Template ID "${templateId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }

        // Assign WhatsApp templates to campaigns
        if (importData.campaigns.length > 0) {

            let campaigns = importData.campaigns;
            campaigns.forEach(campaign => {

                // Find campaignwhatsapptemplate
                if (
                    "whatsapptemplates" in campaign
                    && "count" in campaign.whatsapptemplates
                    && campaign.whatsapptemplates.count > 0
                ) {
                    let whatsAppTemplates = campaign.whatsapptemplates.objects;
                    whatsAppTemplates.forEach(whatsAppTemplate => {
                        if (
                            "campaignId" in whatsAppTemplate
                            && "whatsAppTemplateId" in whatsAppTemplate
                        ) {
                            let campaignId = whatsAppTemplate.campaignId;
                            let whatsAppTemplateId = whatsAppTemplate.whatsAppTemplateId;

                            // Check if already assigned
                            let whatsAppTemplateFound = searchCampaignWhatsAppTemplates(
                                nccLocation,
                                nccToken,
                                campaignId,
                                whatsAppTemplateId
                            );

                            // Check if found
                            if (Object.keys(whatsAppTemplateFound).length > 0) {
                                if (
                                    "expansions" in whatsAppTemplate
                                    && "whatsAppTemplateId" in whatsAppTemplate.expansions
                                    && "name" in whatsAppTemplate.expansions.whatsAppTemplateId
                                    && whatsAppTemplate.expansions.whatsAppTemplateId.name != ""
                                ) {
                                    postMessage(`[INFO] WhatsApp template "${whatsAppTemplate.expansions.whatsAppTemplateId.name}" already assigned to campaign "${campaign.name}".`);
                                } else {
                                    postMessage(`[INFO] WhatsApp template ID "${whatsAppTemplateId}" already assigned to campaign "${campaign.name}".`);
                                }
                            } else {

                                // Check if campaign exists
                                let campaign = getCampaignById(
                                    nccLocation,
                                    nccToken,
                                    campaignId
                                );

                                // Check if campaign found
                                if (Object.keys(campaign).length > 0) {

                                    // Check if WhatsApp template exists
                                    let whatsAppTemplateFound = getWhatsAppTemplateById(
                                        nccLocation,
                                        nccToken,
                                        whatsAppTemplateId
                                    );

                                    // Check if WhatsApp template found
                                    if (Object.keys(whatsAppTemplateFound).length > 0) {

                                        // Assign WhatsApp template to campaign
                                        let whatsAppTemplateCreated = createCampaignWhatsAppTemplate(
                                            nccLocation,
                                            nccToken,
                                            campaignId,
                                            whatsAppTemplateId
                                        );

                                        // Check if created
                                        if (Object.keys(whatsAppTemplateCreated).length > 0) {
                                            if (
                                                "expansions" in whatsAppTemplateCreated
                                                && "whatsAppTemplateId" in whatsAppTemplateCreated.expansions
                                                && "name" in whatsAppTemplateCreated.expansions.whatsAppTemplateId
                                                && whatsAppTemplateCreated.expansions.whatsAppTemplateId.name != ""
                                            ) {
                                                postMessage(`[INFO] WhatsApp template "${whatsAppTemplateCreated.expansions.whatsAppTemplateId.name}" assigned to campaign "${campaign.name}".`);
                                            } else {
                                                postMessage(`[INFO] WhatsApp template ID "${whatsAppTemplateId}" assigned to campaign "${campaign.name}".`);
                                            }
                                        } else {
                                            if (
                                                "expansions" in whatsAppTemplate
                                                && "whatsAppTemplateId" in whatsAppTemplate.expansions
                                                && "name" in whatsAppTemplate.expansions.whatsAppTemplateId
                                                && whatsAppTemplate.expansions.whatsAppTemplateId.name != ""
                                            ) {
                                                errorMessage += `\tWhatsApp template "${whatsAppTemplate.expansions.whatsAppTemplateId.name}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] WhatsApp template "${whatsAppTemplate.expansions.whatsAppTemplateId.name}" not assigned to campaign "${campaign.name}".`);
                                            } else {
                                                errorMessage += `\tWhatsApp template ID "${whatsAppTemplateId}" not assigned to campaign "${campaign.name}".\n`;
                                                postMessage(`[ERROR] WhatsApp template ID "${whatsAppTemplateId}" not assigned to campaign "${campaign.name}".`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
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
    } else {
        postMessage(``);
        postMessage(`[INFO] No errors occurred.`);
    }

    if (warningMessage != "") {
        postMessage(``);
        postMessage(`[WARNING] The following warnings were raised:`);
        postMessage(``);
        postMessage(warningMessage);
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

    function updateNestedValues(data, lookupObj) {
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] === 'object' && data[i] !== null) {
                    updateNestedValues(data[i], lookupObj);
                } else {
                    // If value exists as a key in lookupObj, update
                    if (data[i] in lookupObj) {
                        data[i] = lookupObj[data[i]];
                    }
                }
            }
        } else if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (typeof data[key] === 'object' && data[key] !== null) {
                    updateNestedValues(data[key], lookupObj);
                } else {

                    if (
                        key == "content"
                        || key == "genericQuery"
                    ) {
                        for (const [from, to] of Object.entries(lookupObj)) {
                            data[key] = data[key].replaceAll(from, to);
                        }
                    } else if (key == "tenantId") {
                        data[key] = tenantId;
                    } else if (data[key] in lookupObj) {      // If value exists as a key in lookupObj, update
                        data[key] = lookupObj[data[key]];
                    }
                }
            }
        }
    }
}