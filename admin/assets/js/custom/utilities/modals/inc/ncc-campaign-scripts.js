function getCampaignScriptById(
    nccLocation,
    nccToken,
    campaignScriptId
) {
    var campaignScript = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaignscript/${campaignScriptId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            campaignScript = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return campaignScript;
}

function getCampaignScriptByName(
    nccLocation,
    nccToken,
    campaignScriptName
) {
    var campaignScript = {};

    var xhr = new XMLHttpRequest();

    let encodedCampaignScriptName = encodeURIComponent(campaignScriptName);
    xhr.open("GET", `${nccLocation}/data/api/types/campaignscript?q=${encodedCampaignScriptName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let campaignScripts = response.objects;
                campaignScripts.forEach(object => {
                    if (object.name === campaignScriptName) {
                        campaignScript = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignScript;
}

function upsertCampaignScript(
    nccLocation,
    nccToken,
    campaignScriptBody
) {
    var success = false;
    var data = JSON.stringify(campaignScriptBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaignscript/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    try {
        xhr.send(data);

        if (xhr.status == 201) {
            success = true;
        }
    } catch (error) {
        console.log(error);
    }

    return success;
}