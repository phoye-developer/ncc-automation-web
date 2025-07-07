function searchCampaignDispositions(
    nccLocation,
    nccToken,
    campaignId,
    dispositionId
) {
    var campaignDisposition = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaigndisposition?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.dispositionId == dispositionId
                        && object.campaignId == campaignId) {
                        campaignDisposition = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignDisposition;
}

function createCampaignDisposition(
    nccLocation,
    nccToken,
    campaignId,
    dispositionId
) {
    var campaignDisposition = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "dispositionId": encodeURIComponent(dispositionId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaigndisposition/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignDisposition = JSON.parse(xhr.responseText);
    }

    return campaignDisposition;
}