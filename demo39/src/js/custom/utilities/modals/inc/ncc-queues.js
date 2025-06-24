function getQueueById(
    nccLocation,
    nccToken,
    queueId
) {
    var queue = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/queue/${queueId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            queue = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return queue;
}

function getQueueByName(
    nccLocation,
    nccToken,
    queueName
) {
    var queue = {};

    var xhr = new XMLHttpRequest();

    let encodedQueueName = encodeURIComponent(queueName);
    xhr.open("GET", `${nccLocation}/data/api/types/queue?q=${encodedQueueName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let queues = response.objects;
                queues.forEach(object => {
                    if (object.name === queueName) {
                        queue = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return queue;
}

function createQueue(
    nccLocation,
    nccToken,
    template
) {
    var queue = {};

    var data = JSON.stringify(template);

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/queue/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    try {
        xhr.send(data);

        if (xhr.status == 201) {
            let response = JSON.parse(xhr.responseText);
            if ("_id" in response) {
                queue = response;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return queue;
}

function upsertQueue(
    nccLocation,
    nccToken,
    queueBody
) {
    var success = false;
    var data = JSON.stringify(queueBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/queue/`, false);
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