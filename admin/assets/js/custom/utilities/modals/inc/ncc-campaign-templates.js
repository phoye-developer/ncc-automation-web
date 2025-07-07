function searchCampaignTemplates(
    nccLocation,
    nccToken,
    campaignId,
    templateId
) {
    var campaignTemplate = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaigntemplate?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.templateId == templateId
                        && object.campaignId == campaignId) {
                        campaignTemplate = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignTemplate;
}

function createCampaignTemplate(
    nccLocation,
    nccToken,
    campaignId,
    templateId
) {
    var campaignTemplate = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "templateId": encodeURIComponent(templateId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaigntemplate/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignTemplate = JSON.parse(xhr.responseText);
    }

    return campaignTemplate;
}