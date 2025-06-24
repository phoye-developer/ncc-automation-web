function getDispositionById(
    nccLocation,
    nccToken,
    dispositionId
) {
    var disposition = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/disposition/${dispositionId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            disposition = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return disposition;
}

function getDispositionByName(
    nccLocation,
    nccToken,
    dispositionName
) {
    var disposition = {};

    var xhr = new XMLHttpRequest();

    let encodedDispositionName = encodeURIComponent(dispositionName);
    xhr.open("GET", `${nccLocation}/data/api/types/disposition?q=${encodedDispositionName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let dispositions = response.objects;
                dispositions.forEach(object => {
                    if (object.name === dispositionName) {
                        disposition = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return disposition;
}

function createDisposition(
    nccLocation,
    nccToken,
    template
) {
    var disposition = {};
    var data = JSON.stringify(template);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/disposition/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    try {
        xhr.send(data);

        if (xhr.status == 201) {
            let response = JSON.parse(xhr.responseText);
            if ("_id" in response) {
                disposition = response;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return disposition;
}

function upsertDisposition(
    nccLocation,
    nccToken,
    dispositionBody
) {
    var success = false;
    var data = JSON.stringify(dispositionBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/disposition/`, false);
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