function getFieldMappingsById(
    nccLocation,
    nccToken,
    fieldMappingsId
) {
    var fieldMappings = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/fieldmappings/${fieldMappingsId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            fieldMappings = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return fieldMappings;
}

function getFieldMappingsByName(
    nccLocation,
    nccToken,
    fieldMappingsName
) {
    var fieldMappings = {};

    var xhr = new XMLHttpRequest();

    let encodedFieldMappingsName = encodeURIComponent(fieldMappingsName);
    xhr.open("GET", `${nccLocation}/data/api/types/fieldmappings?q=${encodedFieldMappingsName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == fieldMappingsName) {

                        fieldMappings = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return fieldMappings;
}

function upsertFieldMappings(
    nccLocation,
    nccToken,
    fieldMappingsBody
) {
    var success = false;
    var data = JSON.stringify(fieldMappingsBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/fieldmappings/`, false);
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