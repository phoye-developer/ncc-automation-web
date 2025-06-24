importScripts("inc/config-dispositions.js");
importScripts("inc/config-queues.js");
importScripts("inc/ncc-dispositions.js");
importScripts("inc/ncc-queues.js");
importScripts("inc/ncc-supervisor-queues.js");
importScripts("inc/ncc-users.js");
importScripts("inc/ncc-user-profile-dispositions.js");
importScripts("inc/ncc-user-profiles.js");
importScripts("inc/ncc-user-queues.js");

onmessage = (event) => {

    // Start
    postMessage(`[INFO] Starting...`);

    var campaign = JSON.parse(event.data);
    var nccLocation = campaign.nccLocation;
    var nccToken = campaign.nccToken;
    var campaignName = campaign.campaignName;
    var businessName = campaign.businessName;
    var vertical = campaign.vertical;
    var workflowType = campaign.workflowType;
    var pstnAddress = campaign.pstnAddress;
    var campaignCallerId = campaign.campaignCallerId;
    var dispositions = campaign.dispositions;
    var assignAgentsQueues = campaign.assignAgentsQueues;
    var assignSupervisorsQueues = campaign.assignSupervisorsQueues;
    var assignSupervisorsCampaigns = campaign.assignSupervisorsCampaigns;
    var assignAgentsTopics = campaign.assignAgentsTopics;
    var assignSupervisorsTopics = campaign.assignSupervisorsTopics;

    var result;
    var exists;
    var success;

    // Dispositions
    var dispositionsToAssign = [];

    dispositions.forEach(element => {
        // Search for existing disposition
        result = getDispositionByName(
            nccLocation,
            nccToken,
            element
        );
        // Check if disposition found
        if (Object.keys(result).length > 0) {
            if ("_id" in result) {
                dispositionsToAssign.push(result);
                postMessage(`[INFO] Disposition "${element}" already exists.`);
            }
        } else {
            // Create new disposition
            result = createDisposition(
                nccLocation,
                nccToken,
                dispositionTemplates[element]
            );
            // Check if disposition created.
            if (Object.keys(result).length > 0) {
                if ("_id" in result) {
                    dispositionsToAssign.push(result);
                    postMessage(`[INFO] Disposition "${element} created.`);
                }
            } else {
                postMessage(`[ERROR] Disposition ${element} not created.`);
            }
        }
    });

    // User profiles
    var userProfilesToAssign = [];

    userProfiles.forEach(element => {
        // Search for user profile
        result = getUserProfileByName(
            nccLocation,
            nccToken,
            element
        );
        // Check if user profile found
        if (Object.keys(result).length > 0) {
            if ("_id" in result) {
                userProfilesToAssign.push(result);
                postMessage(`[INFO] User Profile "${element}" found.`);
            }
        } else {
            postMessage(`[WARNING] User Profile "${element}" not found.`);
        }
    });

    // User profile dispositions
    userProfilesToAssign.forEach(userProfileToAssign => {
        dispositionsToAssign.forEach(dispositionToAssign => {
            // Search for user profile disposition
            exists = searchUserProfileDispositions(
                nccLocation,
                nccToken,
                userProfileToAssign._id,
                dispositionToAssign._id
            );
            // Check if user profile dispositions exists
            if (exists) {
                postMessage(`[INFO] Disposition "${dispositionToAssign.name}" already assigned to "${userProfileToAssign.name}" user profile.`);
            } else {
                // Create user profile disposition
                success = createUserProfileDisposition(
                    nccLocation,
                    nccToken,
                    userProfileToAssign._id,
                    dispositionToAssign._id
                );
                // Check if user profile disposition created
                if (success) {
                    postMessage(`[INFO] Disposition "${dispositionToAssign.name}" assigned to "${userProfileToAssign.name}" user profile.`);
                } else {
                    postMessage(`[ERROR] Disposition "${dispositionToAssign.name}" not assigned to "${userProfileToAssign.name}" user profile.`);
                }
            }
        });
    });

    // Queues
    var queues = { ...queueTemplates["base"], ...queueTemplates[vertical] };

    var queuesToAssign = [];
    var queue;
    for (queue in queues) {
        // Search for queue
        result = getQueueByName(
            nccLocation,
            nccToken,
            queue
        );
        // Check if queue already exists
        if (Object.keys(result).length > 0) {
            queuesToAssign.push(result);
            postMessage(`[INFO] Queue "${queue}" already exists.`);
        } else {
            // Create queue
            result = createQueue(
                nccLocation,
                nccToken,
                queues[queue]
            );
            // Check if queue created
            if (Object.keys(result).length > 0) {
                queuesToAssign.push(result);
                postMessage(`[INFO] Queue "${queue}" created.`);
            } else {
                postMessage(`[ERROR] Queue "${queue}" not created.`);
            }
        }
    }

    // Assign agents to queues
    if (assignAgentsQueues == "true") {
        var agentUserProfileId;
        var agents = [];
        var userQueue;

        // Find agent user profile ID
        userProfilesToAssign.forEach(element => {
            if (element.name == "Agent") {
                agentUserProfileId = element._id;
            }
        });

        // Get all users
        users = getUsers(
            nccLocation,
            nccToken
        );
        users.forEach(element => {
            // Identify users with "Agent" user profile
            if (element.userProfileId == agentUserProfileId) {
                agents.push(element);
            }
        });

        if (assignAgentsQueues == "true") {
            if (agents.length > 0) {
                agents.forEach(agent => {
                    queuesToAssign.forEach(queueToAssign => {
                        // Search for userQueue object
                        userQueue = searchUserQueues(
                            nccLocation,
                            nccToken,
                            agent._id,
                            queueToAssign._id
                        );
                        // Check if agent already assigned to queue
                        if (Object.keys(userQueue).length > 0) {
                            postMessage(`[INFO] Agent "${agent.firstName} ${agent.lastName}" already assigned to "${queueToAssign.name}" queue.`);
                        } else {
                            // Assign agent to queue
                            success = createUserQueue(
                                nccLocation,
                                nccToken,
                                agent._id,
                                queueToAssign._id
                            );
                            if (success) {
                                postMessage(`[INFO] Agent "${agent.firstName} ${agent.lastName}" assigned to "${queueToAssign.name}" queue.`);
                            } else {
                                postMessage(`[ERROR] Agent "${agent.firstName} ${agent.lastName}" not assigned to "${queueToAssign.name}" queue.`);
                            }
                        }
                    });
                });
            } else {
                postMessage(`[WARNING] No agents found for queue assignment.`);
            }
        }
    }

    // Assign supervisors to queues
    if (assignSupervisorsQueues == "true") {
        var supervisorUserProfileId;
        var supervisors = [];
        var supervisorQueue;

        // Find supervisor user profile ID
        userProfilesToAssign.forEach(element => {
            if (element.name == "Supervisor") {
                supervisorUserProfileId = element._id;
            }
        });

        // Get all users
        users = getUsers(
            nccLocation,
            nccToken
        );
        users.forEach(element => {
            // Identify users with "Supervisor" user profile
            if (element.userProfileId == supervisorUserProfileId) {
                supervisors.push(element);
            }
        });

        if (assignSupervisorsQueues == "true") {
            if (supervisors.length > 0) {
                supervisors.forEach(supervisor => {
                    queuesToAssign.forEach(queueToAssign => {
                        // Search for userQueue object
                        supervisorQueue = searchSupervisorQueues(
                            nccLocation,
                            nccToken,
                            supervisor._id,
                            queueToAssign._id
                        );
                        // Check if supervisor already assigned to queue
                        if (Object.keys(supervisorQueue).length > 0) {
                            postMessage(`[INFO] Supervisor "${supervisor.firstName} ${supervisor.lastName}" already assigned to "${queueToAssign.name}" queue.`);
                        } else {
                            // Assign supervisor to queue
                            success = createSupervisorQueue(
                                nccLocation,
                                nccToken,
                                supervisor._id,
                                queueToAssign._id
                            );
                            if (success) {
                                postMessage(`[INFO] Supervisor "${supervisor.firstName} ${supervisor.lastName}" assigned to "${queueToAssign.name}" queue.`);
                            } else {
                                postMessage(`[ERROR] Supervisor "${supervisor.firstName} ${supervisor.lastName}" not assigned to "${queueToAssign.name}" queue.`);
                            }
                        }
                    });
                });
            } else {
                postMessage(`[WARNING] No supervisors found for queue assignment.`);
            }
        }
    }

    // End
    postMessage(`[INFO] Script complete.`);
}