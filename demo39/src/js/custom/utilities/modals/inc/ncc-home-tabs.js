function getHomeTabById(
    nccLocation,
    nccToken,
    homeTabId
) {
    var homeTab = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/hometab/${homeTabId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            homeTab = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return homeTab;
}

function getHomeTabByName(
    nccLocation,
    nccToken,
    homeTabName
) {
    var homeTab = {};

    var xhr = new XMLHttpRequest();

    let encodedHomeTabName = encodeURIComponent(homeTabName);
    xhr.open("GET", `${nccLocation}/data/api/types/hometab?q=${encodedHomeTabName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == homeTabName) {

                        homeTab = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return homeTab;
}

function upsertHomeTab(
    nccLocation,
    nccToken,
    homeTabBody
) {
    var success = false;
    var data = JSON.stringify(homeTabBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/hometab/`, false);
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