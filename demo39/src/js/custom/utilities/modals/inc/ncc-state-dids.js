function getStateDidById(
    nccLocation,
    nccToken,
    stateDidId
) {
    var stateDid = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/statedid/${stateDidId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            stateDid = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return stateDid;
}

function getStateDidByName(
    nccLocation,
    nccToken,
    stateDidName
) {
    var stateDid = {};

    var xhr = new XMLHttpRequest();

    let encodedStateDidName = encodeURIComponent(stateDidName);
    xhr.open("GET", `${nccLocation}/data/api/types/statedid?q=${encodedStateDidName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == stateDidName) {

                        stateDid = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return stateDid;
}

function upsertStateDid(
    nccLocation,
    nccToken,
    stateDidBody
) {
    var success = false;
    var data = JSON.stringify(stateDidBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/statedid/`, false);
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