function searchCampaignSpeechContexts(
    nccLocation,
    nccToken,
    campaignId,
    speechContextId
) {
    var campaignSpeechContext = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaignspeechcontext?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.classificationId == speechContextId
                        && object.campaignId == campaignId) {
                        campaignSpeechContext = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignSpeechContext;
}

function createCampaignSpeechContext(
    nccLocation,
    nccToken,
    campaignId,
    speechContextId
) {
    var campaignSpeechContext = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "classificationId": encodeURIComponent(speechContextId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaignspeechcontext/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignSpeechContext = JSON.parse(xhr.responseText);
    }

    return campaignSpeechContext;
}