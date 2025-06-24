function getFunctionById(
    nccLocation,
    nccToken,
    functionId
) {
    var nccFunction = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/function/${functionId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            nccFunction = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return nccFunction;
}

function getFunctionByName(
    nccLocation,
    nccToken,
    nccFunctionName
) {
    var nccFunction = {};

    var xhr = new XMLHttpRequest();

    let encodedFunctionName = encodeURIComponent(nccFunctionName);
    xhr.open("GET", `${nccLocation}/data/api/types/function?q=${encodedFunctionName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == nccFunctionName) {

                        nccFunction = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return nccFunction;
}

function upsertFunction(
    nccLocation,
    nccToken,
    nccFunctionBody
) {
    var success = false;
    var data = JSON.stringify(nccFunctionBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/function/`, false);
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