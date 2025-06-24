function getWhatsAppTemplateById(
    nccLocation,
    nccToken,
    whatsAppTemplateId
) {
    var whatsapptemplate = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/whatsapptemplate/${whatsAppTemplateId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            whatsapptemplate = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return whatsapptemplate;
}

function getWhatsAppTemplateByName(
    nccLocation,
    nccToken,
    whatsAppTemplateName
) {
    var whatsAppTemplate = {};

    var xhr = new XMLHttpRequest();

    let encodedWhatsAppTemplateName = encodeURIComponent(whatsAppTemplateName);
    xhr.open("GET", `${nccLocation}/data/api/types/whatsapptemplate?q=${encodedWhatsAppTemplateName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == whatsAppTemplateName) {

                        whatsAppTemplate = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return whatsAppTemplate;
}

function upsertWhatsAppTemplate(
    nccLocation,
    nccToken,
    whatsAppTemplateBody
) {
    var success = false;
    var data = JSON.stringify(whatsAppTemplateBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/whatsapptemplate/`, false);
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