/**
 * @function getSupervisorQueues - A function to fetch all supervisor queue objects in NCC
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @returns {Array} - A list of zero or more supervisor queue objects in NCC
 */
function getSupervisorQueues(
    nccLocation,
    nccToken
) {
    var supervisorQueues = [];

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/supervisorqueue`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                supervisorQueues = response.objects;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return supervisorQueues;
}

/**
 * @function searchSupervisorQueues - A function to search for a supervisor queue object in NCC
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @param {String} supervisorId - The supervisor ID to search for
 * @param {String} queueId - The queue ID to search for
 * @returns {Array} - A supervisor queue object in NCC
 */
function searchSupervisorQueues(
    nccLocation,
    nccToken,
    supervisorId,
    queueId
) {
    var supervisorQueue = {};

    var xhr = new XMLHttpRequest();

    var encodedSupervisorId = encodeURIComponent(supervisorId);
    xhr.open("GET", `${nccLocation}/data/api/types/supervisorqueue?q=${encodedSupervisorId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.queueId == queueId
                        && object.userId == supervisorId) {
                        supervisorQueue = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return supervisorQueue;
}

/**
 * @function createSupervisorQueue - A function to assign a supervisor to a queue as an supervisor
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @param {String} supervisorId - The ID of the NCC supervisor to assign to the queue as an supervisor
 * @param {String} queueId - The ID of the NCC queue to which the supervisor should be assigned as an supervisor
 * @returns A boolean value indicating whether the assignment was successful
 */
function createSupervisorQueue(
    nccLocation,
    nccToken,
    supervisorId,
    queueId
) {
    var success = false;
    var data = JSON.stringify({
        "userId": encodeURIComponent(supervisorId),
        "queueId": encodeURIComponent(queueId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/supervisorqueue/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        success = true;
    }

    return success;
}