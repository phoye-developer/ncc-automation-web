function searchCampaignWhatsAppTemplates(
    nccLocation,
    nccToken,
    campaignId,
    whatsAppTemplateId
) {
    var campaignWhatsAppTemplate = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaignwhatsapptemplate?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (
                        object.whatsAppTemplateId == whatsAppTemplateId
                        && object.campaignId == campaignId
                    ) {
                        campaignWhatsAppTemplate = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignWhatsAppTemplate;
}

function createCampaignWhatsAppTemplate(
    nccLocation,
    nccToken,
    campaignId,
    whatsAppTemplateId
) {
    var campaignWhatsAppTemplate = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "whatsAppTemplateId": encodeURIComponent(whatsAppTemplateId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaignwhatsapptemplate/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignWhatsAppTemplate = JSON.parse(xhr.responseText);
    }

    return campaignWhatsAppTemplate;
}