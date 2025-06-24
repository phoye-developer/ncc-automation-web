function getTemplateById(
    nccLocation,
    nccToken,
    templateId
) {
    var template = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/template/${templateId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            template = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return template;
}

function getTemplateByName(
    nccLocation,
    nccToken,
    templateName
) {
    var template = {};

    var xhr = new XMLHttpRequest();

    let encodedTemplateName = encodeURIComponent(templateName);
    xhr.open("GET", `${nccLocation}/data/api/types/template?q=${encodedTemplateName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == templateName) {

                        template = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return template;
}

function upsertTemplate(
    nccLocation,
    nccToken,
    templateBody
) {
    var success = false;
    var data = JSON.stringify(templateBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/template/`, false);
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