function getRestCallById(
    nccLocation,
    nccToken,
    restCallId
) {
    var restCall = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/restcall/${restCallId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            restCall = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return restCall;
}

function getRestCallByName(
    nccLocation,
    nccToken,
    restCallName
) {
    var restCall = {};

    var xhr = new XMLHttpRequest();

    let encodedRestCallName = encodeURIComponent(restCallName);
    xhr.open("GET", `${nccLocation}/data/api/types/restcall?q=${encodedRestCallName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == restCallName) {

                        restCall = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return restCall;
}

function upsertRestCall(
    nccLocation,
    nccToken,
    restCallBody
) {
    var success = false;
    var data = JSON.stringify(restCallBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/restcall/`, false);
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