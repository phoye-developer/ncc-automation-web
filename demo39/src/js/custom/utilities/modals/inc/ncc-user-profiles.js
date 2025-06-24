function getUserProfileById(
    nccLocation,
    nccToken,
    userProfileId
) {
    var userProfile = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/userprofile/${userProfileId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            userProfile = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return userProfile;
}

function getUserProfileByName(
    nccLocation,
    nccToken,
    userProfileName
) {
    var userProfile = {};

    var xhr = new XMLHttpRequest();

    var encodedUserProfileName = encodeURIComponent(userProfileName);
    xhr.open("GET", `${nccLocation}/data/api/types/userprofile?q=${encodedUserProfileName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let userProfiles = response.objects;
                userProfiles.forEach(object => {
                    if (object.name == userProfileName) {
                        userProfile = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return userProfile;
}

function upsertUserProfile(
    nccLocation,
    nccToken,
    userProfileBody
) {
    var success = false;
    var data = JSON.stringify(userProfileBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/userprofile/`, false);
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