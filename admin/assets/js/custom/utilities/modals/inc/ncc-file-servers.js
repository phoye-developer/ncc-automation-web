function getFileServerById(
    nccLocation,
    nccToken,
    fileServerId
) {
    var fileServer = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/fileserver/${fileServerId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            fileServer = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return fileServer;
}

function getFileServerByName(
    nccLocation,
    nccToken,
    fileServerName
) {
    var fileServer = {};

    var xhr = new XMLHttpRequest();

    let encodedFileServerName = encodeURIComponent(fileServerName);
    xhr.open("GET", `${nccLocation}/data/api/types/fileserver?q=${encodedFileServerName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == fileServerName) {

                        fileServer = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return fileServer;
}

function upsertFileServer(
    nccLocation,
    nccToken,
    fileServerBody
) {
    var success = false;
    var data = JSON.stringify(fileServerBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/fileserver/`, false);
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