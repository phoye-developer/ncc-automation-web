function getCampaignById(
    nccLocation,
    nccToken,
    campaignId
) {
    var campaign = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaign/${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            campaign = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return campaign;
}

function getCampaignByName(
    nccLocation,
    nccToken,
    campaignName
) {
    var campaign = {};

    var xhr = new XMLHttpRequest();

    let encodedCampaignName = encodeURIComponent(campaignName);
    xhr.open("GET", `${nccLocation}/data/api/types/campaign?q=${encodedCampaignName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == campaignName) {

                        campaign = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaign;
}

function upsertCampaign(
    nccLocation,
    nccToken,
    campaignBody
) {
    var success = false;
    var data = JSON.stringify(campaignBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaign/`, false);
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