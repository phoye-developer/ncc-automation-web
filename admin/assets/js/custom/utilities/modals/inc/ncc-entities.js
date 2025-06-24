function getEntityById(
    nccLocation,
    nccToken,
    entityId
) {
    var entity = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/entity/${entityId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            entity = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return entity;
}

function getEntityByName(
    nccLocation,
    nccToken,
    entityName
) {
    var entity = {};

    var xhr = new XMLHttpRequest();

    let encodedEntityName = encodeURIComponent(entityName);
    xhr.open("GET", `${nccLocation}/data/api/types/entity?q=${encodedEntityName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == entityName) {

                        entity = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return entity;
}

function upsertEntity(
    nccLocation,
    nccToken,
    entityBody
) {
    var success = false;
    var data = JSON.stringify(entityBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/entity/`, false);
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