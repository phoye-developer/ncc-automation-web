function getScriptById(
    nccLocation,
    nccToken,
    scriptId
) {
    var script = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/script/${scriptId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            script = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return script;
}

function getScriptByName(
    nccLocation,
    nccToken,
    scriptName
) {
    var script = {};

    var xhr = new XMLHttpRequest();

    let encodedScriptName = encodeURIComponent(scriptName);
    xhr.open("GET", `${nccLocation}/data/api/types/script?q=${encodedScriptName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == scriptName) {

                        script = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return script;
}

function upsertScript(
    nccLocation,
    nccToken,
    scriptBody
) {
    var success = false;
    var data = JSON.stringify(scriptBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/script/`, false);
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