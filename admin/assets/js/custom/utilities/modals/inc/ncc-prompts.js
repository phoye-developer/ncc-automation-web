function getPromptById(
    nccLocation,
    nccToken,
    promptId
) {
    var prompt = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/prompt/${promptId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            prompt = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return prompt;
}

function getPromptByName(
    nccLocation,
    nccToken,
    promptName
) {
    var prompt = {};

    var xhr = new XMLHttpRequest();

    let encodedPromptName = encodeURIComponent(promptName);
    xhr.open("GET", `${nccLocation}/data/api/types/prompt?q=${encodedPromptName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == promptName) {

                        prompt = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return prompt;
}

function upsertPrompt(
    nccLocation,
    nccToken,
    promptBody
) {
    var success = false;
    var data = JSON.stringify(promptBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/prompt/`, false);
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