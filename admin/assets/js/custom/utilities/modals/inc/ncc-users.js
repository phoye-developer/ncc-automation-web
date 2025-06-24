/**
 * @function getUsers - A function to fetch all NCC users
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @returns {Array} - An array with zero or more NCC users
 */
function getUsers(
    nccLocation,
    nccToken
) {
    var users = [];

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/user`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                users = response.objects;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return users;
}

/**
 * @function getUsersByUserProfileId - A function to search for NCC users with a specific user profile ID
 * @param {String} nccLocation - The environment for the NCC tenant (e.g., https://astonvilla.thrio.io)
 * @param {String} nccToken - The current NCC token for the login session
 * @param {String} userProfileId - The user profile ID of interest
 * @returns {Array} - An array with zero or more NCC users
 */
function getUsersByUserProfileId(
    nccLocation,
    nccToken,
    userProfileId
) {
    var users = [];

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/user?q=${userProfileId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.userprofileId == userProfileId) {
                        users.push(object);
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return users;
}