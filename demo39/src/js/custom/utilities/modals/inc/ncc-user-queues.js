/**
 * @function getUserQueues - A function to fetch all user queue objects in NCC
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @returns {Array} - A list of zero or more user queue objects in NCC
 */
function getUserQueues(
    nccLocation,
    nccToken
) {
    var userQueues = [];

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/userqueue`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                userQueues = response.objects;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return userQueues;
}

/**
 * @function searchUserQueues - A function to search for a user queue object in NCC
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @param {String} userId - The user ID to search for
 * @param {String} queueId - The queue ID to search for
 * @returns {Array} - A user queue object in NCC
 */
function searchUserQueues(
    nccLocation,
    nccToken,
    userId,
    queueId
) {
    var userQueue = {};

    var xhr = new XMLHttpRequest();

    var encodedUserId = encodeURIComponent(userId);
    xhr.open("GET", `${nccLocation}/data/api/types/userqueue?q=${encodedUserId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.queueId == queueId
                        && object.userId == userId) {
                        userQueue = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return userQueue;
}

/**
 * @function createUserQueue - A function to assign a user to a queue as an agent
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @param {String} userId - The ID of the NCC user to assign to the queue as an agent
 * @param {String} queueId - The ID of the NCC queue to which the user should be assigned as an agent
 * @returns A boolean value indicating whether the assignment was successful
 */
function createUserQueue(
    nccLocation,
    nccToken,
    userId,
    queueId
) {
    var success = false;
    var data = JSON.stringify({
        "userId": encodeURIComponent(userId),
        "queueId": encodeURIComponent(queueId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/userqueue/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        success = true;
    }

    return success;
}