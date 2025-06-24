function getClassificationById(
    nccLocation,
    nccToken,
    classificationId
) {
    var classification = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/classification/${classificationId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            classification = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return classification;
}

function getClassificationByName(
    nccLocation,
    nccToken,
    classificationName
) {
    var classification = {};

    var xhr = new XMLHttpRequest();

    let encodedClassificationName = encodeURIComponent(classificationName);
    xhr.open("GET", `${nccLocation}/data/api/types/classification?q=${encodedClassificationName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == classificationName) {

                        classification = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return classification;
}

function upsertClassification(
    nccLocation,
    nccToken,
    classificationBody
) {
    var success = false;
    var data = JSON.stringify(classificationBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/classification/`, false);
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