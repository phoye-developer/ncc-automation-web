/**
 * @function searchUserProfileDispositions
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @param {String} userProfileId - The ID of the NCC user profile of interest
 * @param {String} dispositionId - The ID of the NCC disposition of interest
 * @returns {Boolean} - The result of whether the user profile is assigned to the disposition
 */
function searchUserProfileDispositions(
    nccLocation,
    nccToken,
    userProfileId,
    dispositionId
) {
    var exists = false;

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/userprofiledisposition?q=${dispositionId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let userProfileDispositions = response.objects;
                userProfileDispositions.forEach(object => {
                    if (object.userprofileId == userProfileId) {
                        exists = true;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return exists;
}

/**
 * @function createUserProfileDisposition
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @param {String} userProfileId - The ID of the NCC user profile to which the disposition should be assigned
 * @param {String} dispositionId - The ID of the NCC disposition to be assigned to the user profile
 * @returns {Object} - An NCC user profile disposition object
 */
function createUserProfileDisposition(
    nccLocation,
    nccToken,
    userProfileId,
    dispositionId
) {
    var success = false;

    var data = JSON.stringify({
        "userprofileId": userProfileId,
        "dispositionId": dispositionId
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/userprofiledisposition/`, false);
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