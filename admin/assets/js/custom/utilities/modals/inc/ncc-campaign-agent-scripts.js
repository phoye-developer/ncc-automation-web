function searchCampaignAgentScripts(
    nccLocation,
    nccToken,
    campaignId,
    campaignScriptId
) {
    var campaignAgentScript = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaignagentscript?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (
                        object.campaignscriptId == campaignScriptId
                        && object.campaignId == campaignId
                    ) {
                        campaignAgentScript = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignAgentScript;
}

function createCampaignAgentScript(
    nccLocation,
    nccToken,
    campaignId,
    campaignScriptId
) {
    var campaignAgentScript = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "campaignscriptId": encodeURIComponent(campaignScriptId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaignagentscript/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignAgentScript = JSON.parse(xhr.responseText);
    }

    return campaignAgentScript;
}