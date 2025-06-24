function getWorkflowById(
    nccLocation,
    nccToken,
    workflowId
) {
    var workflow = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/workflow/${workflowId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            workflow = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return workflow;
}

function getWorkflowByName(
    nccLocation,
    nccToken,
    workflowName
) {
    var workflow = {};

    var xhr = new XMLHttpRequest();

    let encodedWorkflowName = encodeURIComponent(workflowName);
    xhr.open("GET", `${nccLocation}/data/api/types/workflow?q=${encodedWorkflowName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == workflowName) {

                        workflow = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return workflow;
}

function upsertWorkflow(
    nccLocation,
    nccToken,
    workflowBody
) {
    var success = false;
    var data = JSON.stringify(workflowBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/workflow/`, false);
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