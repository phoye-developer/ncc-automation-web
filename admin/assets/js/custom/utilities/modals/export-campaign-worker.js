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

    var campaignExport = JSON.parse(event.data);
    var nccLocation = campaignExport.nccLocation;
    var nccToken = campaignExport.nccToken;
    var username = campaignExport.username;
    var campaignId = campaignExport.campaignId;
    var reportIds = campaignExport.reportIds;
    var homeTabIds = campaignExport.homeTabIds;
    var preserveAuthentication = campaignExport.preserveAuthentication;

    // ==============================
    // Set ID arrays
    // ==============================

    var campaignIds = [];
    var dialPlanIds = [];
    var dispositionIds = [];
    var entityIds = [];
    var scorecardIds = [];
    var classificationIds = [];
    var surveyIds = [];
    var surveyThemeIds = [];
    var serviceIds = [];
    var templateIds = [];
    var workflowIds = [];
    var partitionIds = [];
    var whatsAppTemplateIds = [];
    var campaignScriptIds = [];
    var fieldMappingsIds = [];
    var functionIds = [];
    var restCallIds = [];
    var scriptIds = [];
    var userProfileIds = [];
    var queueIds = [];
    var promptIds = [];
    var categorySummaryIds = [];
    var categoryIds = [];
    var skillIds = [];
    var musicIds = [];
    var campaignGoalsIds = [];
    var stateDidIds = [];
    var businessEventIds = [];
    var timeEventIds = [];
    var fileServerIds = [];
    var filterIds = [];
    var widgetIds = [];
    var dashboardIds = [];

    // ==============================
    // Create config template
    // ==============================

    var config = {
        "campaigns": [],
        "dialPlans": [],
        "templates": [],
        "dispositions": [],
        "entities": [],
        "scorecards": [],
        "classifications": [],
        "surveys": [],
        "surveyThemes": [],
        "services": [],
        "workflows": [],
        "partitions": [],
        "whatsAppTemplates": [],
        "campaignScripts": [],
        "fieldMappings": [],
        "functions": [],
        "restCalls": [],
        "scripts": [],
        "userProfiles": [],
        "queues": [],
        "prompts": [],
        "categorySummaries": [],
        "categories": [],
        "skills": [],
        "music": [],
        "campaignGoals": [],
        "stateDids": [],
        "businessEvents": [],
        "timeEvents": [],
        "fileServers": [],
        "filters": [],
        "reports": [],
        "homeTabs": [],
        "widgets": [],
        "dashboards": []
    };

    // ==============================
    // Campaign
    // ==============================

    processCampaign(campaignId);

    function processCampaign(campaignId) {

        if (
            campaignId != ""
            && campaignId != undefined
        ) {

            // Remove any special characters
            campaignId = campaignId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(campaignId.toLowerCase().includes("workitem"))) {

                // Check if campaignId already seen
                if (!(campaignIds.includes(campaignId))) {

                    // Mark campaignId as seen
                    campaignIds.push(campaignId);

                    // Get campaign
                    let campaign = getCampaignById(
                        nccLocation,
                        nccToken,
                        campaignId
                    );

                    // Check if campaign found
                    if (Object.keys(campaign).length > 0) {

                        postEvent(
                            "info",
                            nccLocation,
                            nccToken,
                            "normal",
                            "exportcampaign",
                            `Export of campaign ${campaign.name} started.`,
                            "Export Campaign Started",
                            username
                        );

                        // Add campaign to config
                        config.campaigns.push(campaign);
                        postMessage(`[INFO] Campaign "${campaign.name}" found.`);

                        // Process user survey ID
                        if ("surveyId" in campaign) {
                            processSurvey(campaign.surveyId);
                        } else {
                            postMessage(`[INFO] No user survey assigned to campaign "${campaign.name}".`);
                        }

                        // Process chat survey ID
                        if ("preSurveyId" in campaign) {
                            processSurvey(campaign.preSurveyId);
                        } else {
                            postMessage(`[INFO] No chat survey assigned to campaign "${campaign.name}".`);
                        }

                        // Process QM survey ID
                        if ("qualityMonitoringSurveyId" in campaign) {
                            processSurvey(campaign.qualityMonitoringSurveyId);
                        } else {
                            postMessage(`[INFO] No QM survey assigned to campaign "${campaign.name}".`);
                        }

                        // Process dispositions
                        if (
                            "dispositions" in campaign
                            && "count" in campaign.dispositions
                            && campaign.dispositions.count > 0
                        ) {
                            let campaignDispositions = campaign.dispositions.objects;
                            campaignDispositions.forEach(campaignDisposition => {
                                processDisposition(campaignDisposition.dispositionId);
                            });
                        } else {
                            postMessage(`[INFO] No dispositions assigned to campaign "${campaign.name}".`);
                        }

                        // Process scorecards
                        if (
                            "scorecards" in campaign
                            && "count" in campaign.scorecards
                            && campaign.scorecards.count > 0
                        ) {
                            let campaignScorecards = campaign.scorecards.objects;
                            campaignScorecards.forEach(campaignScorecard => {
                                processScorecard(campaignScorecard.scorecardId);
                            });
                        } else {
                            postMessage(`[INFO] No scorecards assigned to campaign "${campaign.name}".`);
                        }

                        // Process campaign scripts
                        if (
                            "scripts" in campaign
                            && "count" in campaign.scripts
                            && campaign.scripts.count > 0
                        ) {
                            let campaignScripts = campaign.scripts.objects;
                            campaignScripts.forEach(campaignScript => {
                                processCampaignScript(campaignScript.campaignscriptId);
                            });
                        } else {
                            postMessage(`[INFO] No campaign scripts assigned to campaign "${campaign.name}".`);
                        }

                        // Process field mappings ID
                        if ("fieldMappingsId" in campaign) {
                            processFieldMappings(campaign.fieldMappingsId);
                        } else {
                            postMessage(`[INFO] No field mappings assigned to campaign "${campaign.name}".`);
                        }

                        // Process workflow
                        if ("workflowId" in campaign) {

                            if (
                                "expansions" in campaign
                                && "workflowId" in campaign.expansions
                            ) {

                                let workflow = campaign.expansions.workflowId;

                                // Process states
                                if ("states" in workflow) {
                                    let states = workflow.states;
                                    for (const [id, state] of Object.entries(states)) {
                                        let actions = state.actions;
                                        actions.forEach(action => {
                                            processAction(action);
                                        });
                                    }
                                }
                            }

                            processWorkflow(campaign.workflowId);
                        } else {
                            postMessage(`[INFO] No workflow assigned to campaign "${campaign.name}".`);
                        }

                        // Process services
                        if ("realtimeAnalysisServiceId" in campaign) {
                            let realTimeAnalysisServices = campaign.realtimeAnalysisServiceId;
                            realTimeAnalysisServices.forEach(realTimeAnalysisService => {
                                processService(realTimeAnalysisService);
                            });
                        } else {
                            postMessage(`[INFO] No real-time analysis service assigned to campaign "${campaign.name}".`);
                        }

                        if ("recordingAnalysisServiceId" in campaign) {
                            processService(campaign.recordingAnalysisServiceId);
                        } else {
                            postMessage(`[INFO] No recording analysis service assigned to campaign "${campaign.name}".`);
                        }

                        if ("generativeAIServiceId" in campaign) {
                            processService(campaign.generativeAIServiceId);
                        } else {
                            postMessage(`[INFO] No GenAI service assigned to campaign "${campaign.name}".`);
                        }

                        if ("knowledgeBaseServiceId" in campaign) {

                            // Remove authentication
                            if (preserveAuthentication === "false") {
                                if (
                                    "expansions" in campaign
                                    && "knowledgeBaseServiceId" in campaign.expansions
                                    && "parameters" in campaign.expansions.knowledgeBaseServiceId
                                ) {
                                    let parameters = campaign.expansions.knowledgeBaseServiceId.parameters;
                                    parameters.forEach(parameter => {
                                        if (
                                            parameter.key.toLowerCase().includes("authorization")
                                            || parameter.key.toLowerCase().includes("api")
                                            || parameter.key.toLowerCase().includes("key")
                                            || parameter.key.toLowerCase().includes("secret")
                                        ) {
                                            parameter.value = "";
                                        }
                                    });
                                }
                            }

                            processService(campaign.knowledgeBaseServiceId);
                        } else {
                            postMessage(`[INFO] No KB service assigned to campaign "${campaign.name}".`);
                        }

                        // Process templates
                        if (
                            "templates" in campaign
                            && "count" in campaign.templates
                            && campaign.templates.count > 0
                        ) {
                            let templates = campaign.templates.objects;
                            templates.forEach(template => {
                                processTemplate(template.templateId);
                            });
                        } else {
                            postMessage(`[INFO] No templates assigned to campaign "${campaign.name}".`);
                        }

                        // Process partitions
                        if (
                            "partitions" in campaign
                            && "count" in campaign.partitions
                            && campaign.partitions.count > 0
                        ) {
                            let partitions = campaign.partitions.objects;
                            partitions.forEach(partition => {
                                processPartition(partition.partitionsId);
                            });
                        } else {
                            postMessage(`[INFO] No partitions assigned to campaign "${campaign.name}".`);
                        }

                        // Process dial plans
                        if (
                            "dialplans" in campaign
                            && "count" in campaign.dialplans
                            && campaign.dialplans.count > 0
                        ) {
                            let dialPlans = campaign.dialplans.objects;
                            dialPlans.forEach(dialPlan => {

                                // Remove authentication
                                if (preserveAuthentication === "false") {
                                    if (
                                        "expansions" in dialPlan
                                        && "dialplanId" in dialPlan.expansions
                                        && "sipAuthPassword" in dialPlan.expansions.dialplanId
                                    ) {
                                        dialPlan.expansions.dialplanId.sipAuthPassword = "";
                                    }
                                }

                                processDialPlan(dialPlan.dialplanId);
                            });
                        } else {
                            postMessage(`[INFO] No dial plans assigned to campaign "${campaign.name}".`);
                        }

                        // Process entities
                        if (
                            "entities" in campaign
                            && "count" in campaign.entities
                            && campaign.entities.count > 0
                        ) {
                            let entities = campaign.entities.objects;
                            entities.forEach(entity => {
                                processEntity(entity.entityId);
                            });
                        } else {
                            postMessage(`[INFO] No entities assigned to campaign "${campaign.name}".`);
                        }

                        // Process speech contexts
                        if (
                            "speechContexts" in campaign
                            && "count" in campaign.speechContexts
                            && campaign.speechContexts.count > 0
                        ) {
                            let speechContexts = campaign.speechContexts.objects;
                            speechContexts.forEach(speechContext => {
                                processClassification(speechContext.classificationId);
                            });
                        } else {
                            postMessage(`[INFO] No speech contexts assigned to campaign "${campaign.name}".`);
                        }

                        // Process campaign goals
                        if ("campaignGoalsId" in campaign) {
                            processCampaignGoals(campaign.campaignGoalsId);
                        } else {
                            postMessage(`[INFO] No campaign goals assigned to campaign "${campaign.name}".`);
                        }

                        // Process music
                        if ("musicId" in campaign) {
                            processMusic(campaign.musicId);
                        } else {
                            postMessage(`[INFO] No music library assigned to campaign "${campaign.name}".`);
                        }

                        // Process state DID
                        if ("stateDIDId" in campaign) {
                            processStateDid(campaign.stateDIDId);
                        } else {
                            postMessage(`[INFO] No state DID assigned to campaign "${campaign.name}".`);
                        }

                        // Process auto disposition
                        if ("autoDispositionId" in campaign) {
                            processDisposition(campaign.autoDispositionId);
                        } else {
                            postMessage(`[INFO] No auto disposition assigned to campaign "${campaign.name}".`);
                        }

                        // Process recording notification prompt
                        if ("recordingPromptId" in campaign) {
                            processPrompt(campaign.recordingPromptId);
                        } else {
                            postMessage(`[INFO] No recording notification prompt in campaign "${campaign.name}".`);
                        }

                        // Process WhatsApp templates
                        if (
                            "whatsapptemplates" in campaign
                            && "count" in campaign.whatsapptemplates
                            && campaign.whatsapptemplates.count > 0
                        ) {
                            let whatsAppTemplates = campaign.whatsapptemplates.objects;
                            whatsAppTemplates.forEach(whatsAppTemplate => {
                                processWhatsAppTemplate(whatsAppTemplate.whatsAppTemplateId);
                            });
                        } else {
                            postMessage(`[INFO] No WhatsApp templates assigned to campaign "${campaign.name}".`);
                        }

                        // Process job trigger
                        if ("jobBusinessEventId" in campaign) {
                            processBusinessEvent(campaign.jobBusinessEventId);
                        } else {
                            postMessage(`[INFO] No job trigger assigned to campaign "${campaign.name}".`);
                        }

                        // Process job workflow function
                        if ("jobFunctionId" in campaign) {
                            processFunction(campaign.jobFunctionId);
                        } else {
                            postMessage(`[INFO] No job workflow function assigned to campaign "${campaign.name}".`);
                        }

                        // Process outbound function
                        if ("outboundCallFunctionId" in campaign) {
                            processFunction(campaign.outboundCallFunctionId);
                        } else {
                            postMessage(`[INFO] No outbound function assigned to campaign "${campaign.name}".`);
                        }

                        // Process conversation insights
                        if ("nlpServiceId" in campaign) {
                            processService(campaign.nlpServiceId);
                        } else {
                            postMessage(`[INFO] No conversation insights assigned to campaign "${campaign.name}".`);
                        }

                        // Process file server
                        if ("fileServerId" in campaign) {
                            processFileServer(campaign.fileServerId);
                        } else {
                            postMessage(`[INFO] No file server assigned to campaign "${campaign.name}".`);
                        }

                        // Process filter
                        if ("filterId" in campaign) {
                            processFilter(campaign.filterId);
                        }

                        // Process Human
                        if ("humanFunction" in campaign) {
                            processFunction(campaign.humanFunction);
                        }
                        if ("humanDispositionId" in campaign) {
                            processDisposition(campaign.humanDispositionId);
                        }

                        // Process Busy
                        if ("busyFunction" in campaign) {
                            processFunction(campaign.busyFunction);
                        }
                        if ("busyDispositionId" in campaign) {
                            processDisposition(campaign.busyDispositionId);
                        }

                        // Process No Answer
                        if ("noAnswerFunction" in campaign) {
                            processFunction(campaign.noAnswerFunction);
                        }
                        if ("noAnswerDispositionId" in campaign) {
                            processDisposition(campaign.noAnswerDispositionId);
                        }

                        // Process Dialer Abandon
                        if ("abandonFunction" in campaign) {
                            processFunction(campaign.abandonFunction);
                        }
                        if ("abandonDispositionId" in campaign) {
                            processDisposition(campaign.abandonDispositionId);
                        }

                        // Process Answering Machine
                        if ("answeringMachinePromptId" in campaign) {
                            processFunction(campaign.answeringMachinePromptId); // Confirmed this is a function and not a prompt
                        }
                        if ("answeringMachineDispositionId" in campaign) {
                            processDisposition(campaign.answeringMachineDispositionId);
                        }

                        // Process Dialer Fail
                        if ("invalidFunction" in campaign) {
                            processFunction(campaign.invalidFunction);
                        }
                        if ("invalidDispositionId" in campaign) {
                            processDisposition(campaign.invalidDispositionId);
                        }

                        // Process Fax
                        if ("faxDispositionId" in campaign) {
                            processDisposition(campaign.faxDispositionId);
                        }

                        // Process SMS Actions
                        if ("smsSuccessFucntionId" in campaign) {
                            processFunction(campaign.smsSuccessFucntionId);
                        }
                        if ("smsFailedFucntionId" in campaign) {
                            processFunction(campaign.smsFailedFucntionId);
                        }
                        if ("smsTemplateId" in campaign) {
                            processTemplate(campaign.smsTemplateId);
                        }
                        if ("whatsAppTemplateId" in campaign) {
                            processWhatsAppTemplate(campaign.whatsAppTemplateId);
                        }

                        postEvent(
                            "success",
                            nccLocation,
                            nccToken,
                            "normal",
                            "exportcampaign",
                            `Export of campaign ${campaign.name} completed.`,
                            "Export Campaign Completed",
                            username
                        );
                    } else {
                        postMessage(`[ERROR] Campaign with ID "${campaignId}" not found.`);
                    }
                }
            }
        }
    }

    // ==============================
    // Reports
    // ==============================

    reportIds.forEach(reportId => {
        let report = getReportById(
            nccLocation,
            nccToken,
            reportId
        );
        // Check if report found
        if (Object.keys(report).length > 0) {
            config.reports.push(report);
            postMessage(`[INFO] Report "${report.name}" found.`);
        } else {
            postEvent(
                "error",
                nccLocation,
                nccToken,
                "normal",
                "exportcampaign",
                `Report with ID ${reportId} not found.`,
                "Export Campaign Error",
                username
            );
            postMessage(`[ERROR] Report with ID "${reportId}" not found.`);
        }
    });

    // ==============================
    // Home tabs
    // ==============================

    homeTabIds.forEach(homeTabId => {
        let homeTab = getHomeTabById(
            nccLocation,
            nccToken,
            homeTabId
        );
        // Check if home tab found
        if (Object.keys(homeTab).length > 0) {
            config.homeTabs.push(homeTab);
            postMessage(`[INFO] Home tab "${homeTab.name}" found.`);

            // Process widgets
            if (
                "widgets" in homeTab
                && "count" in homeTab.widgets
                && homeTab.widgets.count > 0
            ) {
                let widgets = homeTab.widgets.objects;
                widgets.forEach(widget => {
                    processWidget(widget.widgetId);
                });
            }
        } else {
            postEvent(
                "error",
                nccLocation,
                nccToken,
                "normal",
                "exportcampaign",
                `Home tab with ID ${homeTabId} not found.`,
                "Export Campaign Error",
                username
            );
            postMessage(`[ERROR] Home tab with ID "${homeTabId}" not found.`);
        }
    });

    // ==============================
    // End
    // ==============================

    const endTime = performance.now();
    const durationMs = endTime - startTime;

    postMessage(`[INFO] Script complete.`);
    postMessage(`[INFO] Duration: ${formatDuration(durationMs)}`);
    postMessage({
        "action": "submit",
        "status": "complete",
        "config": config
    });

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

    function processWorkflow(workflowId) {

        if (
            workflowId != ""
            && workflowId != undefined
        ) {

            // Check if workflowId already seen
            if (!(workflowIds.includes(workflowId))) {

                // Mark workflowId as seen
                workflowIds.push(workflowId);

                // Get workflow
                let workflow = getWorkflowById(
                    nccLocation,
                    nccToken,
                    workflowId
                );

                // Check if workflow found
                if (Object.keys(workflow).length > 0) {

                    // Process states
                    if ("states" in workflow) {
                        let states = workflow.states;
                        for (const [id, state] of Object.entries(states)) {
                            let actions = state.actions;
                            actions.forEach(action => {
                                processAction(action);
                            });
                        }
                    }

                    // Add workflow to config
                    config.workflows.push(workflow);
                    postMessage(`[INFO] Workflow "${workflow.name}" found.`);
                } else {
                    postMessage(`[ERROR] Workflow with ID "${workflowId}" not found.`);
                }
            }
        }
    }

    function processSurvey(surveyId) {

        if (
            surveyId != ""
            && surveyId != undefined
        ) {

            // Remove any special characters
            surveyId = surveyId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(surveyId.toLowerCase().includes("workitem"))) {

                // Check if surveyId already seen
                if (!(surveyIds.includes(surveyId))) {

                    // Mark surveyId as seen
                    surveyIds.push(surveyId);

                    // Get survey
                    let survey = getSurveyById(
                        nccLocation,
                        nccToken,
                        surveyId
                    );

                    // Check if survey found
                    if (Object.keys(survey).length > 0) {

                        // Add survey to config
                        config.surveys.push(survey);
                        postMessage(`[INFO] Survey "${survey.name}" found.`);

                        // Get survey theme
                        if ("surveythemeId" in survey) {
                            processSurveyTheme(survey.surveythemeId);
                        }

                        // Find relevant actions/components
                        processElements(survey.layout.elements);
                    } else {
                        postMessage(`[ERROR] Survey with ID "${surveyId}" not found.`);
                    }
                }
            }
        }

        function processElements(elements) {

            elements.forEach(element => {

                switch (element.type) {

                    // Panel
                    case "panel":
                        processElements(element.elements);
                        break;

                    // Image
                    case "image":
                        if (
                            "properties" in element
                            && "image" in element.properties
                        ) {
                            // processFile(element.properties.image)
                        }
                        break;

                    // Action
                    case "action":
                        if (
                            "properties" in element
                            && "url" in element.properties
                        ) {
                            items = element.properties.url.split("/");
                            if (
                                items.includes("restcallwithresponse")
                                || items.includes("restcall")
                            ) {
                                let restCallId = items[items.length - 1];

                                processRestCall(restCallId);
                            } else if (
                                items.includes("function")
                            ) {
                                let functionId = items[items.length - 1];

                                processFunction(functionId);
                            }
                        }
                        break;

                    // Availability
                    case "availability":
                        if (
                            "properties" in element
                            && "queues" in element.properties
                        ) {
                            let queueIds = element.properties.queues;
                            queueIds.forEach(queueId => {
                                processQueue(queueId);
                            });
                        }
                        break;

                    // Chat
                    case "chat":
                        if ("properties" in element) {
                            if ("campaignId" in element.properties) {
                                processCampaign(element.properties.campaignId);
                            }
                            if ("campaignVar" in element.properties) {
                                processCampaign(element.properties.campaignVar);
                            }
                        }
                        break;

                    // Dial
                    case "dial":
                        if ("properties" in element) {
                            if ("campaignId" in element.properties) {
                                processCampaign(element.properties.campaignId);
                            }
                            if ("campaignVar" in element.properties) {
                                processCampaign(element.properties.campaignVar);
                            }
                        }
                        break;

                    // Digital Outbound
                    case "sms":
                        if ("properties" in element) {
                            if ("campaignId" in element.properties) {
                                processCampaign(element.properties.campaignId);
                            }
                            if ("campaignVar" in element.properties) {
                                processCampaign(element.properties.campaignVar);
                            }
                        }
                        break;

                    // Inbound Email
                    case "email":
                        if ("properties" in element) {
                            if ("campaignId" in element.properties) {
                                processCampaign(element.properties.campaignId);
                            }
                            if ("campaignVar" in element.properties) {
                                processCampaign(element.properties.campaignVar);
                            }
                        }
                        break;

                    // Move To Survey
                    case "survey":
                        if (
                            "properties" in element
                            && "surveyId" in element.properties
                        ) {
                            processSurvey(element.properties.surveyId);
                        }
                        break;

                    // Take Back
                    case "takeback":
                        if (
                            "properties" in element
                            && "dispositionId" in element.properties
                        ) {
                            processDisposition(element.properties.dispositionId);
                        }
                        break;

                    // Transfer
                    case "transfer":
                        if ("properties" in element) {
                            if ("campaignId" in element.properties) {
                                processCampaign(element.properties.campaignId);
                            }
                            if ("dispositionId" in element.properties) {
                                processDisposition(element.properties.dispositionId);
                            }
                        }
                        break;

                    // Web Callback
                    case "webcallback":
                        if ("properties" in element) {
                            if ("campaignId" in element.properties) {
                                processCampaign(element.properties.campaignId);
                            }
                            if ("campaignVar" in element.properties) {
                                processCampaign(element.properties.campaignVar);
                            }
                        }
                        break;

                    default:
                        break;
                }
            });
        }
    }

    function findCampaignInTemplate(text) {

        if (
            text != ""
            && text != undefined
        ) {

            // Unescape the string
            let unescaped = htmlUnescape(text);
            let href = extractHref(unescaped);
            let campaignId = null;
            if (href) {
                campaignId = extractCampaignId(href);
            }

            if (campaignId) {
                processCampaign(campaignId);
            }

            function htmlUnescape(str) {
                return str
                    .replace(/\\"/g, '"')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>');
            }

            function extractHref(str) {
                // Regex to extract href="..."
                const hrefMatch = str.match(/href="([^"]+)"/) || str.match(/href=\\?"([^"]+)\\?"/);
                return hrefMatch ? hrefMatch[1] : null;
            }

            function extractCampaignId(url) {
                // parse as URL, fallback to regex if Web Worker (some browsers may not support URL in worker)
                try {
                    const u = new URL(url);
                    return u.searchParams.get('campaignId');
                } catch {
                    // fallback regex
                    const match = url.match(/campaignId=([a-zA-Z0-9]+)/);
                    return match ? match[1] : null;
                }
            }
        }
    }

    function processMessage(text) {

        if (
            text != ""
            && text != undefined
        ) {

            // Set initial value
            let campaignId = "";

            // Search for a URL in the text
            const urlMatch = text.match(/https?:\/\/[^\s]+/);

            // Check if URL found
            if (urlMatch) {
                let url = new URL(urlMatch[0]);

                // Check if URL contains campaignId parameter
                if (url.searchParams.has('campaignId')) {
                    campaignId = url.searchParams.get('campaignId');

                    // Check for and remove period
                    if (campaignId.endsWith(".")) {
                        campaignId = campaignId.substring(0, campaignId.length - 1);
                    }
                }
            }

            if (campaignId != "") {
                processCampaign(campaignId);
            }
        }
    }

    function processRestCall(restCallId) {

        if (
            restCallId != ""
            && restCallId != undefined
        ) {

            // Remove any special characters
            restCallId = restCallId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(restCallId.toLowerCase().includes("workitem"))) {

                // Check if restCallId already seen
                if (!(restCallIds.includes(restCallId))) {

                    // Mark restCallId as seen
                    restCallIds.push(restCallId);

                    // Get REST call
                    let restCall = getRestCallById(
                        nccLocation,
                        nccToken,
                        restCallId
                    );

                    // Check if REST call found
                    if (Object.keys(restCall).length > 0) {

                        // Remove authentication info
                        if (preserveAuthentication === "false") {

                            // Check headers
                            if ("headerParameters" in restCall) {

                                let headerParameters = restCall.headerParameters;

                                headerParameters.forEach(headerParameter => {
                                    if (
                                        headerParameter.key.toLowerCase().includes("authorization")
                                        || headerParameter.key.toLowerCase().includes("api")
                                        || headerParameter.key.toLowerCase().includes("key")
                                        || headerParameter.key.toLowerCase().includes("secret")
                                    ) {
                                        headerParameter.value = "";
                                    }
                                });
                            }
                        }

                        // Add REST call to config
                        config.restCalls.push(restCall);
                        postMessage(`[INFO] REST call "${restCall.name}" found.`);
                    } else {
                        postMessage(`[ERROR] REST call with ID "${restCallId}" not found.`);
                    }
                }
            }
        }
    }

    function processFunction(functionId) {

        if (
            functionId != ""
            && functionId != undefined
        ) {

            // Remove any special characters
            functionId = functionId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(functionId.toLowerCase().includes("workitem"))) {

                // Check if functionId already seen
                if (!(functionIds.includes(functionId))) {

                    // Mark functionId as seen
                    functionIds.push(functionId);

                    // Get function
                    let nccFunction = getFunctionById(
                        nccLocation,
                        nccToken,
                        functionId
                    );

                    // Check if function found
                    if (Object.keys(nccFunction).length > 0) {

                        // Process states
                        if ("states" in nccFunction) {
                            let states = nccFunction.states;
                            for (const [id, state] of Object.entries(states)) {
                                let actions = state.actions;
                                actions.forEach(action => {
                                    processAction(action);
                                });
                            }
                        }

                        // Add function to config
                        config.functions.push(nccFunction);
                        postMessage(`[INFO] Function "${nccFunction.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Function with ID "${functionId}" not found.`);
                    }
                }
            }
        }
    }

    function processAction(action) {

        switch (action.type) {

            // Agent Scripts
            case "agentscripts":
                if (
                    "properties" in action
                    && "agentscripts" in action.properties
                ) {
                    let campaignScriptIds = action.properties.agentscripts;
                    campaignScriptIds.forEach(campaignScriptId => {
                        processCampaignScript(campaignScriptId);
                    });
                }
                break;

            // Execute Function
            case "function":
                if (
                    "properties" in action
                    && "functionId" in action.properties
                ) {
                    processFunction(action.properties.functionId);
                }
                break;

            // Execute REST Call
            case "restapi":
                if (
                    "properties" in action
                    && "restCallId" in action.properties
                ) {
                    processRestCall(action.properties.restCallId);
                }
                break;

            // Execute Script
            case "script":
                if (
                    "properties" in action
                    && "scriptId" in action.properties
                ) {
                    processScript(action.properties.scriptId);
                }
                break;

            // Save Variable
            case "savevariable":
                if (
                    "properties" in action
                    && "rightExpression" in action.properties
                    && "variableName" in action.properties
                ) {
                    if (action.properties.variableName.toLowerCase() == "queueid") {
                        processQueue(action.properties.rightExpression);
                    } else if (action.properties.variableName.toLowerCase() == "scriptid") {
                        processScript(action.properties.rightExpression);
                    }
                }
                break;

            // Simple Menu
            case "simplemenu":
                if ("properties" in action) {
                    if ("errorPromptId" in action.properties) {
                        processPrompt(action.properties.errorPromptId);
                    }
                    if ("functionId" in action.properties) {
                        processFunction(action.properties.functionId);
                    }
                    if ("mainPromptId" in action.properties) {
                        processPrompt(action.properties.mainPromptId);
                    }
                }
                break;

            // Survey
            case "assignsurvey":
                if (
                    "properties" in action
                    && "surveyId" in action.properties
                ) {
                    processSurvey(action.properties.surveyId);
                }
                break;

            // Survey From Expression
            case "assignsurveyfromexpression":
                if (
                    "properties" in action
                    && "surveyIdExpression" in action.properties
                ) {
                    processSurvey(action.properties.surveyIdExpression);
                }
                break;

            // Generative AI
            case "generativeai":
                if (
                    "properties" in action
                    && "serviceId" in action.properties
                ) {
                    processService(action.properties.serviceId);
                }
                break;

            // Predict Category
            case "predictcategory":
                if (
                    "properties" in action
                    && "categorysummaryId" in action.properties
                ) {
                    processCategorySummary(action.properties.categorysummaryId);
                }
                break;

            // Chat Message Consumer
            case "chatmessageconsumer":
                if (
                    "properties" in action
                    && "message" in action.properties
                ) {
                    processMessage(action.properties.message);
                }
                break;

            // Notification To Survey
            case "surveynotifciation": // API response shows "notification" is misspelled
                if ("properties" in action) {
                    if ("surveyId" in action.properties) {
                        processSurvey(action.properties.surveyId);
                    }
                    if ("surveyIdExpression" in action.properties) {
                        processSurvey(action.properties.surveyIdExpression);
                    }
                }
                break;

            // Lead Update
            case "updatelead":
                if (
                    "properties" in action
                    && "dispositionId" in action.properties
                ) {
                    processDisposition(action.properties.dispositionId);
                }
                break;

            // Message Bot
            case "chatmessagebot":
                if (
                    "properties" in action
                    && "serviceId" in action.properties
                ) {
                    processService(action.properties.serviceId);
                }
                break;

            // Email
            case "acdinboundemail":
                if ("properties" in action) {
                    if ("queues" in action.properties) {
                        let queueIds = action.properties.queues;
                        queueIds.forEach(queueId => {
                            processQueue(queueId);
                        });
                    }
                    if ("body" in action.properties) {
                        processMessage(action.properties.body);
                    }
                }
                break;

            // Forward as email
            case "forwardbotresponseasemail":
                if (
                    "properties" in action
                    && "dispositionId" in action.properties
                ) {
                    processDisposition(action.properties.dispositionId);
                }
                break;

            // Forward Email
            case "forwardemail":
                if (
                    "properties" in action
                    && "dispositionId" in action.properties
                ) {
                    processDisposition(action.properties.dispositionId);
                }
                break;

            // Reply To Email
            case "replyemailtemplate":
                if (
                    "properties" in action
                    && "templateId" in action.properties
                ) {
                    processTemplate(action.properties.templateId);
                }
                break;

            // Reply To Email From Expression
            case "replyemailtemplatefromexpression":
                if (
                    "properties" in action
                    && "emailTemplateIdExpression" in action.properties
                ) {
                    processTemplate(action.properties.emailTemplateIdExpression);
                }
                break;

            // Send Email
            case "sendemail":
                if ("properties" in action) {
                    if ("dispositionId" in action.properties) {
                        processDisposition(action.properties.dispositionId);
                    }
                    if ("templateId" in action.properties) {
                        processTemplate(action.properties.templateId);
                    }
                }
                break;

            // Send Email From Expression
            case "sendemailfromexpression":
                if ("properties" in action) {
                    if ("dispositionId" in action.properties) {
                        processDisposition(action.properties.dispositionId);
                    }
                    if ("emailTemplateIdExpression" in action.properties) {
                        processTemplate(action.properties.emailTemplateIdExpression);
                    }
                }
                break;

            // Set Disposition
            case "setdisposition":
                if (
                    "properties" in action
                    && "dispositionId" in action.properties
                ) {
                    processDisposition(action.properties.dispositionId);
                }
                break;

            // Get Temporary Credit Card Token
            case "getcctemporarytoken":
                if (
                    "properties" in action
                    && "serviceId" in action.properties
                ) {
                    processService(action.properties.serviceId);
                }
                break;

            // Enter Queue
            case "enterqueue":
                if (
                    "properties" in action
                    && "queues" in action.properties
                ) {
                    let queueIds = action.properties.queues;
                    queueIds.forEach(queueId => {
                        processQueue(queueId);
                    });
                }
                break;

            // Enter Queue from Expression
            case "enterqueuefromexpression":
                if (
                    "properties" in action
                    && "queueIdsExpression" in action.properties
                ) {
                    try {
                        let queueIds = action.properties.queueIdsExpression.split(",");
                        queueIds.forEach(queueId => {
                            processQueue(queueId);
                        });
                    } catch (error) {
                        postMessage(`[ERROR] Unable to split queue IDs for "enterqueuefromexpression" action.`);
                    }
                }
                break;

            // Overflow Queue
            case "overflowqueue":
                if (
                    "properties" in action
                    && "queues" in action.properties
                ) {
                    let queueIds = action.properties.queues;
                    queueIds.forEach(queueId => {
                        processQueue(queueId);
                    });
                }
                break;

            // Overflow Queue From Expression
            case "overflowqueuefromexpression":
                if (
                    "properties" in action
                    && "queueIdsExpression" in action.properties
                ) {
                    try {
                        let queueIds = action.properties.queueIdsExpression.split(",");
                        queueIds.forEach(queueId => {
                            processQueue(queueId);
                        });
                    } catch (error) {
                        postMessage(`[ERROR] Unable to split queue IDs for "overflowqueuefromexpression" action.`);
                    }
                }
                break;

            // Queue Announcement
            case "queueannouncement":
                if (
                    "properties" in action
                    && "promptId" in action.properties
                ) {
                    processPrompt(action.properties.promptId);
                }
                break;

            // Queue Data
            case "agentavailability":
                if (
                    "properties" in action
                    && "queues" in action.properties
                ) {
                    let queueIds = action.properties.queues;
                    queueIds.forEach(queueId => {
                        processQueue(queueId);
                    });
                }
                break;

            // Queue Data From Expression
            case "agentavailabilityfromexpression":
                if (
                    "properties" in action
                    && "queueIdsExpression" in action.properties
                ) {
                    try {
                        let queueIds = action.properties.queueIdsExpression.split(",");
                        queueIds.forEach(queueId => {
                            processQueue(queueId);
                        });
                    } catch (error) {
                        postMessage(`[ERROR] Unable to split queue IDs for "agentavailabilityfromexpression" action.`);
                    }
                }
                break;

            // Remove Skills
            case "removeskills":
                if ("properties" in action) {
                    if ("goodToHaveSkills" in action.properties) {
                        let skillIds = action.properties.goodToHaveSkills;
                        skillIds.forEach(skillId => {
                            processSkill(skillId);
                        });
                    }
                    if ("mustHaveSkills" in action.properties) {
                        let skillIds = action.properties.mustHaveSkills;
                        skillIds.forEach(skillId => {
                            processSkill(skillId);
                        });
                    }
                }
                break;

            // Skill Name
            case "skillbyname":
                if (
                    "properties" in action
                    && "skillIds" in action.properties
                ) {
                    try {
                        let skillIds = action.properties.skillIds.split(",");
                        skillIds.forEach(skillId => {
                            processSkill(skillId);
                        });
                    } catch (error) {
                        postMessage(`[ERROR] Unable to split skill IDs for "skillbyname" action.`);
                    }
                }
                break;

            // Skills
            case "skills":
                if ("properties" in action) {
                    if ("goodToHaveSkills" in action.properties) {
                        let skillIds = action.properties.goodToHaveSkills;
                        skillIds.forEach(skillId => {
                            processSkill(skillId);
                        });
                    }
                    if ("mustHaveSkills" in action.properties) {
                        let skillIds = action.properties.mustHaveSkills;
                        skillIds.forEach(skillId => {
                            processSkill(skillId);
                        });
                    }
                }
                break;

            // Send SMS Template From Expression
            case "smsmessagetemplatefromexpression":
                if (
                    "properties" in action
                    && "smsTemplateIdExpression" in action.properties
                ) {
                    processTemplate(action.properties.smsTemplateIdExpression);
                }
                break;

            // Send WhatsApp Template From Expression
            case "whatsapptemplatefromexpression":
                if (
                    "properties" in action
                    && "whatsappTemplateIdExpression" in action.properties
                ) {
                    processWhatsAppTemplate(action.properties.whatsappTemplateIdExpression);
                }
                break;

            // SMS Message Consumer
            case "smsmessageconsumer":
                if (
                    "properties" in action
                    && "message" in action.properties
                ) {
                    processMessage(action.properties.message);
                }
                break;

            // SMS Template
            case "smsmessagetemplate":
                if (
                    "properties" in action
                    && "templateId" in action.properties
                ) {
                    processTemplate(action.properties.templateId);
                }
                break;

            // WhatsApp Template
            case "whatsapptemplate":
                if (
                    "properties" in action
                    && "whatsAppTemplateId" in action.properties
                ) {
                    processWhatsAppTemplate(action.properties.whatsAppTemplateId);
                }
                break;

            // Create Support Ticket
            case "createsupportticket":
                if (
                    "properties" in action
                    && "serviceId" in action.properties
                ) {
                    processService(action.properties.serviceId);
                }
                break;

            // Debug Workitem Via Slack
            case "debugviaslack":
                if (preserveAuthentication === "false") {
                    if (
                        "properties" in action
                        && "token" in action.properties
                    ) {
                        action.properties.token = "";
                    }
                }
                break;

            // Send Microsoft Teams Message
            case "sendmicrosoftteamsmessage":
                if (preserveAuthentication === "false") {
                    if ("properties" in action) {
                        if ("clientSecret" in action.properties) {
                            action.properties.clientSecret = "";
                        }
                        if ("password" in action.properties) {
                            action.properties.password = "";
                        }
                    }
                }
                break;

            // Send Slack Message
            case "sendslackmessage":
                if (preserveAuthentication === "false") {
                    if (
                        "properties" in action
                        && "token" in action.properties
                    ) {
                        action.properties.token = "";
                    }
                }
                break;

            // ACD Voicemail
            case "acdvm":
                if (
                    "properties" in action
                    && "queues" in action.properties
                ) {
                    let queueIds = action.properties.queues;
                    queueIds.forEach(queueId => {
                        processQueue(queueId);
                    });
                }
                break;

            // ACD Voicemail From Expression
            case "acdvmfromexpression":
                if (
                    "properties" in action
                    && "queueIdsExpression" in action.properties
                ) {
                    try {
                        let queueIds = action.properties.queueIdsExpression.split(",");
                        queueIds.forEach(queueId => {
                            processQueue(queueId);
                        });
                    } catch (error) {
                        postMessage(`[ERROR] Unable to split queue IDs for "acdvmfromexpression" action.`);
                    }
                }
                break;

            // Callback
            case "acdcallback":
                if (
                    "properties" in action
                    && "queues" in action.properties
                ) {
                    let queueIds = action.properties.queues;
                    queueIds.forEach(queueId => {
                        processQueue(queueId);
                    });
                }
                break;

            // Callback From Expression
            case "acdcallbackfromexpression":
                if (
                    "properties" in action
                    && "queueIdsExpression" in action.properties
                ) {
                    try {
                        let queueIds = action.properties.queueIdsExpression.split(",");
                        queueIds.forEach(queueId => {
                            processQueue(queueId);
                        });
                    } catch (error) {
                        postMessage(`[ERROR] Unable to split queue IDs for "acdcallbackfromexpression" action.`);
                    }
                }
                break;

            // Direct Connect No Answer
            case "functiondirectconnectnoanswer":
                if (
                    "properties" in action
                    && "functionId" in action.properties
                ) {
                    processFunction(action.properties.functionId);
                }
                break;

            // Extend Call
            case "aftercallivr":
                if (
                    "properties" in action
                    && "functionId" in action.properties
                ) {
                    processFunction(action.properties.functionId);
                }
                break;

            // Play & Collect Digits
            case "playdigits":
                if (
                    "properties" in action
                    && "promptId" in action.properties
                ) {
                    processPrompt(action.properties.promptId);
                }
                break;

            // Play & Collect Digits From Expression
            case "playdigitsfromexpression":
                if (
                    "properties" in action
                    && "promptIdExpression" in action.properties
                ) {
                    processPrompt(action.properties.promptIdExpression);
                }
                break;

            // Play Music
            case "playmusic":
                if (
                    "properties" in action
                    && "musicId" in action.properties
                ) {
                    processMusic(action.properties.musicId);
                }
                break;

            // Play Prompt
            case "playprompt":
                if (
                    "properties" in action
                    && "promptId" in action.properties
                ) {
                    processPrompt(action.properties.promptId);
                }
                break;

            // Play Prompt Async
            case "playpromptmusic":
                if (
                    "properties" in action
                    && "promptId" in action.properties
                ) {
                    processPrompt(action.properties.promptId);
                }
                break;

            // Play Prompt from Expression
            case "playpromptfromexpression":
                if (
                    "properties" in action
                    && "promptIdExpression" in action.properties
                ) {
                    processPrompt(action.properties.promptIdExpression);
                }
                break;

            default:
                break;
        }

    }

    function processDisposition(dispositionId) {

        if (
            dispositionId != ""
            && dispositionId != undefined
        ) {

            // Remove any special characters
            dispositionId = dispositionId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(dispositionId.toLowerCase().includes("workitem"))) {

                // Check if dispositionId already seen
                if (!(dispositionIds.includes(dispositionId))) {

                    // Mark dispositionId as seen
                    dispositionIds.push(dispositionId);

                    // Get disposition
                    let disposition = getDispositionById(
                        nccLocation,
                        nccToken,
                        dispositionId
                    );

                    // Check if disposition found
                    if (Object.keys(disposition).length > 0) {

                        // Add disposition to config
                        config.dispositions.push(disposition);
                        postMessage(`[INFO] Disposition "${disposition.name}" found.`);

                        // Check if function assigned
                        if ("functionId" in disposition) {

                            // Process function
                            processFunction(disposition.functionId);
                        }

                        // Check if REST call assigned
                        if ("restcallId" in disposition) {

                            // Process REST call
                            processRestCall(disposition.restcallId);
                        }

                        // Check if user profiles assigned
                        if (
                            "userprofiles" in disposition
                            && "count" in disposition.userprofiles
                            && disposition.userprofiles.count > 0
                        ) {
                            let userProfiles = disposition.userprofiles.objects;

                            // Process user profiles
                            userProfiles.forEach(userProfile => {
                                if ("userprofileId" in userProfile) {
                                    processUserProfile(userProfile.userprofileId);
                                }
                            });
                        }
                    } else {
                        postMessage(`[ERROR] Disposition with ID "${dispositionId}" not found.`);
                    }
                }
            }
        }
    }

    function processUserProfile(userProfileId) {

        if (
            userProfileId != ""
            && userProfileId != undefined
        ) {

            // Remove any special characters
            userProfileId = userProfileId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(userProfileId.toLowerCase().includes("workitem"))) {

                // Check if userProfileId already seen
                if (!(userProfileIds.includes(userProfileId))) {

                    // Mark userProfileId as seen
                    userProfileIds.push(userProfileId);

                    // Get user profile
                    let userProfile = getUserProfileById(
                        nccLocation,
                        nccToken,
                        userProfileId
                    );

                    // Check if user profile found
                    if (Object.keys(userProfile).length > 0) {

                        // Add user profile to config
                        config.userProfiles.push(userProfile);
                        postMessage(`[INFO] User profile "${userProfile.name}" found.`);
                    } else {
                        postMessage(`[ERROR] User profile with ID "${userProfileId}" not found.`);
                    }
                }
            }
        }
    }

    function processService(serviceId) {

        if (
            serviceId != ""
            && serviceId != undefined
        ) {

            // Remove any special characters
            serviceId = serviceId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(serviceId.toLowerCase().includes("workitem"))) {

                // Check if serviceId already seen
                if (!(serviceIds.includes(serviceId))) {

                    // Mark serviceId as seen
                    serviceIds.push(serviceId);

                    // Get service
                    let service = getServiceById(
                        nccLocation,
                        nccToken,
                        serviceId
                    );

                    // Check if service found
                    if (Object.keys(service).length > 0) {

                        // Remove authentication info
                        if (preserveAuthentication === "false") {

                            // Check parameters
                            if ("parameters" in service) {
                                let parameters = service.parameters;
                                parameters.forEach(parameter => {
                                    if (
                                        parameter.key.toLowerCase().includes("authorization")
                                        || parameter.key.toLowerCase().includes("api")
                                        || parameter.key.toLowerCase().includes("key")
                                        || parameter.key.toLowerCase().includes("secret")
                                    ) {
                                        parameter.value = "";
                                    }
                                });
                            }
                        }

                        // Add service to config
                        config.services.push(service);
                        postMessage(`[INFO] Service "${service.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Service with ID "${serviceId}" not found.`);
                    }
                }
            }
        }
    }

    function processTemplate(templateId) {

        if (
            templateId != ""
            && templateId != undefined
        ) {

            // Remove any special characters
            templateId = templateId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(templateId.toLowerCase().includes("workitem"))) {

                // Check if templateId already seen
                if (!(templateIds.includes(templateId))) {

                    // Mark templateId as seen
                    templateIds.push(templateId);

                    // Get template
                    let template = getTemplateById(
                        nccLocation,
                        nccToken,
                        templateId
                    );

                    // Check if template found
                    if (Object.keys(template).length > 0) {

                        // Add template to config
                        config.templates.push(template);
                        postMessage(`[INFO] Template "${template.name}" found.`);

                        // Find other campaigns
                        if ("html" in template) {
                            findCampaignInTemplate(template.html);
                        }
                    } else {
                        postMessage(`[ERROR] Template with ID "${templateId}" not found.`);
                    }
                }
            }
        }
    }

    function processScorecard(scorecardId) {

        if (
            scorecardId != ""
            && scorecardId != undefined
        ) {

            // Check if scorecardId already seen
            if (!(scorecardIds.includes(scorecardId))) {

                // Mark scorecardId as seen
                scorecardIds.push(scorecardId);

                // Get scorecard
                let scorecard = getScorecardById(
                    nccLocation,
                    nccToken,
                    scorecardId
                );

                // Check if scorecard found
                if (Object.keys(scorecard).length > 0) {

                    // Add scorecard to config
                    config.scorecards.push(scorecard);
                    postMessage(`[INFO] Scorecard "${scorecard.name}" found.`);

                    // Get classification IDs
                    if (
                        "classifications" in scorecard
                        && "count" in scorecard.classifications
                        && scorecard.classifications.count > 0
                    ) {

                        // Process classifications
                        let classifications = scorecard.classifications.objects;
                        classifications.forEach(classification => {
                            processClassification(classification.classificationId);
                        });
                    } else {
                        postMessage(`[INFO] No classifications found for scorecard "${scorecard.name}".`);
                    }
                } else {
                    postMessage(`[ERROR] Scorecard with ID "${scorecardId}" not found.`);
                }
            }
        }
    }

    function processClassification(classificationId) {

        if (
            classificationId != ""
            && classificationId != undefined
        ) {

            // Check if classificationId already seen
            if (!(classificationIds.includes(classificationId))) {

                // Mark classificationId as seen
                classificationIds.push(classificationId);

                // Get classification
                let classification = getClassificationById(
                    nccLocation,
                    nccToken,
                    classificationId
                );

                // Check if classification found
                if (Object.keys(classification).length > 0) {

                    // Add classification to config
                    config.classifications.push(classification);
                    postMessage(`[INFO] Classification "${classification.name}" found.`);
                } else {
                    postMessage(`[ERROR] Classification with ID "${classificationId}" not found.`);
                }
            }
        }
    }

    function processFieldMappings(fieldMappingsId) {

        if (
            fieldMappingsId != ""
            && fieldMappingsId != undefined
        ) {

            // Check if fieldMappingsId already seen
            if (!(fieldMappingsIds.includes(fieldMappingsId))) {

                // Mark fieldMappingsId as seen
                fieldMappingsIds.push(fieldMappingsId);

                // Get fieldMappings
                let fieldMappings = getFieldMappingsById(
                    nccLocation,
                    nccToken,
                    fieldMappingsId
                );

                // Check if fieldMappings found
                if (Object.keys(fieldMappings).length > 0) {

                    // Add field mappings to config
                    config.fieldMappings.push(fieldMappings);
                    postMessage(`[INFO] Field Mappings "${fieldMappings.name}" found.`);
                } else {
                    postMessage(`[ERROR] Field Mappings with ID "${fieldMappingsId}" not found.`);
                }
            }
        }
    }

    function processQueue(queueId) {

        if (
            queueId != ""
            && queueId != undefined
        ) {

            // Remove any special characters
            queueId = queueId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(queueId.toLowerCase().includes("workitem"))) {

                // Check if queueId already seen
                if (!(queueIds.includes(queueId))) {

                    // Mark queueId as seen
                    queueIds.push(queueId);

                    // Get queue
                    let queue = getQueueById(
                        nccLocation,
                        nccToken,
                        queueId
                    );

                    // Check if queue found
                    if (Object.keys(queue).length > 0) {

                        // Add queue to config
                        config.queues.push(queue);
                        postMessage(`[INFO] Queue "${queue.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Queue with ID "${queueId}" not found.`);
                    }
                }
            }
        }
    }

    function processPartition(partitionId) {

        if (
            partitionId != ""
            && partitionId != undefined
        ) {

            // Check if partitionId already seen
            if (!(partitionIds.includes(partitionId))) {

                // Mark partitionId as seen
                partitionIds.push(partitionId);

                // Get partition
                let partition = getPartitionById(
                    nccLocation,
                    nccToken,
                    partitionId
                );

                // Check if partition found
                if (Object.keys(partition).length > 0) {

                    // Add partition to config
                    config.partitions.push(partition);
                    postMessage(`[INFO] Partition "${partition.name}" found.`);
                } else {
                    postMessage(`[ERROR] Partition with ID "${partitionId}" not found.`);
                }
            }
        }
    }

    function processCampaignScript(campaignScriptId) {

        if (
            campaignScriptId != ""
            && campaignScriptId != undefined
        ) {

            // Remove any special characters
            campaignScriptId = campaignScriptId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(campaignScriptId.toLowerCase().includes("workitem"))) {

                // Check if campaignScriptId already seen
                if (!(campaignScriptIds.includes(campaignScriptId))) {

                    // Mark campaignScriptId as seen
                    campaignScriptIds.push(campaignScriptId);

                    // Get campaign script
                    let campaignScript = getCampaignScriptById(
                        nccLocation,
                        nccToken,
                        campaignScriptId
                    );

                    // Check if campaign script found
                    if (Object.keys(campaignScript).length > 0) {

                        // Add campaign script to config
                        config.campaignScripts.push(campaignScript);
                        postMessage(`[INFO] Campaign script "${campaignScript.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Campaign script with ID "${campaignScriptId}" not found.`);
                    }
                }
            }
        }
    }

    function processScript(scriptId) {

        if (
            scriptId != ""
            && scriptId != undefined
        ) {

            // Remove any special characters
            scriptId = scriptId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(scriptId.toLowerCase().includes("workitem"))) {

                // Check if scriptId already seen
                if (!(scriptIds.includes(scriptId))) {

                    // Mark scriptId as seen
                    scriptIds.push(scriptId);

                    // Get script
                    let script = getScriptById(
                        nccLocation,
                        nccToken,
                        scriptId
                    );

                    // Check if script found
                    if (Object.keys(script).length > 0) {

                        // Add script to config
                        config.scripts.push(script);
                        postMessage(`[INFO] Script "${script.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Script with ID "${scriptId}" not found.`);
                    }
                }
            }
        }
    }

    function processPrompt(promptId) {

        if (
            promptId != ""
            && promptId != undefined
        ) {

            // Remove any special characters
            promptId = promptId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(promptId.toLowerCase().includes("workitem"))) {

                // Check if promptId already seen
                if (!(promptIds.includes(promptId))) {

                    // Mark promptId as seen
                    promptIds.push(promptId);

                    // Get prompt
                    let prompt = getPromptById(
                        nccLocation,
                        nccToken,
                        promptId
                    );

                    // Check if prompt found
                    if (Object.keys(prompt).length > 0) {

                        // Add prompt to config
                        config.prompts.push(prompt);
                        postMessage(`[INFO] Prompt "${prompt.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Prompt with ID "${promptId}" not found.`);
                    }
                }
            }
        }
    }

    function processCategorySummary(categorySummaryId) {

        if (
            categorySummaryId != ""
            && categorySummaryId != undefined
        ) {

            // Check if categorySummaryId already seen
            if (!(categorySummaryIds.includes(categorySummaryId))) {

                // Mark categorySummaryId as seen
                categorySummaryIds.push(categorySummaryId);

                // Get category summary
                let categorySummary = getCategorySummaryById(
                    nccLocation,
                    nccToken,
                    categorySummaryId
                );

                // Check if category summary found
                if (Object.keys(categorySummary).length > 0) {

                    // Add category summary to config
                    config.categorySummaries.push(categorySummary);
                    postMessage(`[INFO] Category summary "${categorySummary.name}" found.`);

                    // Find categories
                    if (
                        "categories" in categorySummary
                        && "count" in categorySummary.categories
                        && categorySummary.categories.count > 0
                    ) {
                        let categories = categorySummary.categories.objects
                        categories.forEach(category => {
                            processCategory(category.categoryId);
                        });
                    }
                } else {
                    postMessage(`[ERROR] Category summary with ID "${categorySummaryId}" not found.`);
                }
            }
        }

        function processCategory(categoryId) {

            // Check if categoryId already seen
            if (!(categoryIds.includes(categoryId))) {

                // Mark categoryId as seen
                categoryIds.push(categoryId);

                // Get category
                let category = getCategoryById(
                    nccLocation,
                    nccToken,
                    categoryId
                );

                // Check if category found
                if (Object.keys(category).length > 0) {

                    // Add category to config
                    config.categories.push(category);
                    postMessage(`[INFO] Category "${category.name}" found.`);
                } else {
                    postMessage(`[ERROR] Category with ID "${categoryId}" not found.`);
                }
            }
        }
    }

    function processSkill(skillId) {

        // Check if skillId has a value
        if (
            skillId != ""
            && skillId != undefined
        ) {

            // Remove any special characters
            skillId = skillId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(skillId.toLowerCase().includes("workitem"))) {

                // Check if skillId already seen
                if (!(skillIds.includes(skillId))) {

                    // Mark skillId as seen
                    skillIds.push(skillId);

                    // Get skill
                    let skill = getSkillById(
                        nccLocation,
                        nccToken,
                        skillId
                    );

                    // Check if skill found
                    if (Object.keys(skill).length > 0) {

                        // Add skill to config
                        config.skills.push(skill);
                        postMessage(`[INFO] Skill "${skill.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Skill with ID "${skillId}" not found.`);
                    }
                }
            }
        }
    }

    function processWhatsAppTemplate(whatsAppTemplateId) {

        // Check if whatsAppTemplateId has a value
        if (
            whatsAppTemplateId != ""
            && whatsAppTemplateId != undefined
        ) {

            // Remove any special characters
            whatsAppTemplateId = whatsAppTemplateId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(whatsAppTemplateId.toLowerCase().includes("workitem"))) {

                // Check if whatsAppTemplateId already seen
                if (!(whatsAppTemplateIds.includes(whatsAppTemplateId))) {

                    // Mark whatsAppTemplateId as seen
                    whatsAppTemplateIds.push(whatsAppTemplateId);

                    // Get WhatsApp template
                    let whatsAppTemplate = getWhatsAppTemplateById(
                        nccLocation,
                        nccToken,
                        whatsAppTemplateId
                    );

                    // Check if WhatsApp template found
                    if (Object.keys(whatsAppTemplate).length > 0) {

                        // Add WhatsApp template to config
                        config.whatsAppTemplates.push(whatsAppTemplate);
                        postMessage(`[INFO] WhatsApp template "${whatsAppTemplate.name}" found.`);

                        // Process WhatsApp template body
                        if ("body" in whatsAppTemplate) {
                            processMessage(whatsAppTemplate.body);
                        }
                    } else {
                        postMessage(`[ERROR] WhatsApp template with ID "${whatsAppTemplateId}" not found.`);
                    }
                }
            }
        }
    }

    function processMusic(musicId) {

        // Check if musicId has a value
        if (
            musicId != ""
            && musicId != undefined
        ) {

            // Remove any special characters
            musicId = musicId.replace(/[^a-zA-Z0-9\s]/g, '');

            // Check if variable used
            if (!(musicId.toLowerCase().includes("workitem"))) {

                // Check if musicId already seen
                if (!(musicIds.includes(musicId))) {

                    // Mark musicId as seen
                    musicIds.push(musicId);

                    // Get music
                    let music = getMusicById(
                        nccLocation,
                        nccToken,
                        musicId
                    );

                    // Check if music found
                    if (Object.keys(music).length > 0) {

                        // Add music to config
                        config.music.push(music);
                        postMessage(`[INFO] Music "${music.name}" found.`);

                        // Process music prompts
                        if (
                            "prompts" in music
                            && "count" in music.prompts
                            && music.prompts.count > 0
                        ) {
                            let prompts = music.prompts.objects;
                            prompts.forEach(prompt => {
                                processPrompt(prompt.promptId);
                            });
                        }
                    } else {
                        postMessage(`[ERROR] Music with ID "${musicId}" not found.`);
                    }
                }
            }
        }
    }

    function processDialPlan(dialPlanId) {

        if (
            dialPlanId != ""
            && dialPlanId != undefined
        ) {

            // Check if dialPlanId already seen
            if (!(dialPlanIds.includes(dialPlanId))) {

                // Mark dialPlanId as seen
                dialPlanIds.push(dialPlanId);

                // Get dial plan
                let dialPlan = getDialPlanById(
                    nccLocation,
                    nccToken,
                    dialPlanId
                );

                // Check if dial plan found
                if (Object.keys(dialPlan).length > 0) {

                    // Add dial plan to config
                    config.dialPlans.push(dialPlan);
                    postMessage(`[INFO] Dial plan "${dialPlan.name}" found.`);
                } else {
                    postMessage(`[ERROR] Dial plan with ID "${dialPlanId}" not found.`);
                }
            }
        }
    }

    function processEntity(entityId) {

        if (
            entityId != ""
            && entityId != undefined
        ) {

            // Check if entityId already seen
            if (!(entityIds.includes(entityId))) {

                // Mark entityId as seen
                entityIds.push(entityId);

                // Get entity
                let entity = getEntityById(
                    nccLocation,
                    nccToken,
                    entityId
                );

                // Check if entity found
                if (Object.keys(entity).length > 0) {

                    // Add entity to config
                    config.entities.push(entity);
                    postMessage(`[INFO] Entity "${entity.name}" found.`);
                } else {
                    postMessage(`[ERROR] Entity with ID "${entityId}" not found.`);
                }
            }
        }
    }

    function processCampaignGoals(campaignGoalsId) {

        if (
            campaignGoalsId != ""
            && campaignGoalsId != undefined
        ) {

            // Check if campaignGoalsId already seen
            if (!(campaignGoalsIds.includes(campaignGoalsId))) {

                // Mark campaignGoalsId as seen
                campaignGoalsIds.push(campaignGoalsId);

                // Get campaign goals
                let campaignGoals = getCampaignGoalsById(
                    nccLocation,
                    nccToken,
                    campaignGoalsId
                );

                // Check if campaign goals found
                if (Object.keys(campaignGoals).length > 0) {

                    // Add campaign goals to config
                    config.campaignGoals.push(campaignGoals);
                    postMessage(`[INFO] Campaign goals "${campaignGoals.name}" found.`);
                } else {
                    postMessage(`[ERROR] Campaign goals with ID "${campaignGoalsId}" not found.`);
                }
            }
        }
    }

    function processStateDid(stateDidId) {

        if (
            stateDidId != ""
            && stateDidId != undefined
        ) {

            // Check if stateDidId already seen
            if (!(stateDidIds.includes(stateDidId))) {

                // Mark stateDidId as seen
                stateDidIds.push(stateDidId);

                // Get state DID
                let stateDid = getStateDidById(
                    nccLocation,
                    nccToken,
                    stateDidId
                );

                // Check if state DID found
                if (Object.keys(stateDid).length > 0) {

                    // Add state DID to config
                    config.stateDids.push(stateDid);
                    postMessage(`[INFO] State DID "${stateDid.name}" found.`);
                } else {
                    postMessage(`[ERROR] State DID with ID "${stateDidId}" not found.`);
                }
            }
        }
    }

    function processBusinessEvent(businessEventId) {

        if (
            businessEventId != ""
            && businessEventId != undefined
        ) {

            // Check if businessEventId already seen
            if (!(businessEventIds.includes(businessEventId))) {

                // Mark businessEventId as seen
                businessEventIds.push(businessEventId);

                // Get business event
                let businessEvent = getBusinessEventById(
                    nccLocation,
                    nccToken,
                    businessEventId
                );

                // Check if business event found
                if (Object.keys(businessEvent).length > 0) {

                    // Add business event to config
                    config.businessEvents.push(businessEvent);
                    postMessage(`[INFO] Business event "${businessEvent.name}" found.`);

                    // Process time events
                    if (
                        "timeevents" in businessEvent
                        && "count" in businessEvent.timeevents
                        && businessEvent.timeevents.count > 0
                    ) {
                        let timeEvents = businessEvent.timeevents.objects;
                        timeEvents.forEach(timeEvent => {
                            processTimeEvent(timeEvent.timeeventId);
                        });
                    }
                } else {
                    postMessage(`[ERROR] Business event with ID "${businessEventId}" not found.`);
                }
            }
        }

        function processTimeEvent(timeEventId) {

            if (
                timeEventId != ""
                && timeEventId != undefined
            ) {

                // Check if timeEventId already seen
                if (!(timeEventIds.includes(timeEventId))) {

                    // Mark timeEventId as seen
                    timeEventIds.push(timeEventId);

                    // Get time event
                    let timeEvent = getTimeEventById(
                        nccLocation,
                        nccToken,
                        timeEventId
                    );

                    // Check if time event found
                    if (Object.keys(timeEvent).length > 0) {

                        // Add time event to config
                        config.timeEvents.push(timeEvent);
                        postMessage(`[INFO] Time event "${timeEvent.name}" found.`);
                    } else {
                        postMessage(`[ERROR] Time event with ID "${timeEventId}" not found.`);
                    }
                }

            }

        }
    }

    function processFileServer(fileServerId) {

        if (
            fileServerId != ""
            && fileServerId != undefined
        ) {

            // Check if fileServerId already seen
            if (!(fileServerIds.includes(fileServerId))) {

                // Mark fileServerId as seen
                fileServerIds.push(fileServerId);

                // Get file server
                let fileServer = getFileServerById(
                    nccLocation,
                    nccToken,
                    fileServerId
                );

                // Check if file server found
                if (Object.keys(fileServer).length > 0) {

                    // Add file server to config
                    config.fileServers.push(fileServer);
                    postMessage(`[INFO] File server "${fileServer.name}" found.`);
                } else {
                    postMessage(`[ERROR] File server with ID "${fileServerId}" not found.`);
                }
            }
        }
    }

    function processSurveyTheme(surveyThemeId) {

        if (
            surveyThemeId != ""
            && surveyThemeId != undefined
        ) {

            // Check if surveyThemeId already seen
            if (!(surveyThemeIds.includes(surveyThemeId))) {

                // Mark surveyThemeId as seen
                surveyThemeIds.push(surveyThemeId);

                // Get survey theme
                let surveyTheme = getSurveyThemeById(
                    nccLocation,
                    nccToken,
                    surveyThemeId
                );

                // Check if survey theme found
                if (Object.keys(surveyTheme).length > 0) {

                    // Add survey theme to config
                    config.surveyThemes.push(surveyTheme);
                    postMessage(`[INFO] Survey theme "${surveyTheme.name}" found.`);
                } else {
                    postMessage(`[ERROR] Survey theme with ID "${surveyThemeId}" not found.`);
                }
            }
        }
    }

    function processFilter(filterId) {

        if (
            filterId != ""
            && filterId != undefined
        ) {

            // Check if filterId already seen
            if (!(filterIds.includes(filterId))) {

                // Mark filterId as seen
                filterIds.push(filterId);

                // Get filter
                let filter = getFilterById(
                    nccLocation,
                    nccToken,
                    filterId
                );

                // Check if filter found
                if (Object.keys(filter).length > 0) {

                    // Add filter to config
                    config.filters.push(filter);
                    postMessage(`[INFO] Filter "${filter.name}" found.`);
                } else {
                    postMessage(`[ERROR] Filter with ID "${filterId}" not found.`);
                }
            }
        }
    }

    function processWidget(widgetId) {

        if (
            widgetId != ""
            && widgetId != undefined
        ) {

            // Check if widgetId already seen
            if (!(widgetIds.includes(widgetId))) {

                // Mark widgetId as seen
                widgetIds.push(widgetId);

                // Get widget
                let widget = getWidgetById(
                    nccLocation,
                    nccToken,
                    widgetId
                );

                // Check if widget found
                if (Object.keys(widget).length > 0) {

                    // Add widget to config
                    config.widgets.push(widget);
                    postMessage(`[INFO] Widget "${widget.name}" found.`);

                    // Process dashboards
                    if (
                        "type" in widget
                        && widget.type == "dashboard"
                        && "dashboardId" in widget
                    ) {
                        processDashboard(widget.dashboardId);
                    }
                } else {
                    postMessage(`[ERROR] Widget with ID "${widgetId}" not found.`);
                }
            }
        }

        function processDashboard(dashboardId) {

            if (
                dashboardId != ""
                && dashboardId != undefined
            ) {

                // Check if dashboardId already seen
                if (!(dashboardIds.includes(dashboardId))) {

                    // Mark dashboardId as seen
                    dashboardIds.push(dashboardId);

                    // Get dashboard
                    let dashboard = getDashboardById(
                        nccLocation,
                        nccToken,
                        dashboardId
                    );

                    // Check if dashboard found
                    if (Object.keys(dashboard).length > 0) {

                        // Add dashboard to config
                        config.dashboards.push(dashboard);
                        postMessage(`[INFO] Dashboard "${dashboard.name}" found.`);

                        // Process user profiles
                        if (
                            "userprofiles" in dashboard
                            && "count" in dashboard.userprofiles
                            && dashboard.userprofiles.count > 0
                        ) {
                            let userProfiles = dashboard.userprofiles.objects;
                            userProfiles.forEach(userProfile => {
                                processUserProfile(userProfile.userprofileId);
                            });
                        }
                    } else {
                        postMessage(`[ERROR] Dashboard with ID "${dashboardId}" not found.`);
                    }
                }

            }

        }
    }
}