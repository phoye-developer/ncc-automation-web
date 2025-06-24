function getMusicById(
    nccLocation,
    nccToken,
    musicId
) {
    var music = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/music/${musicId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            music = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return music;
}

function getMusicByName(
    nccLocation,
    nccToken,
    musicName
) {
    var music = {};

    var xhr = new XMLHttpRequest();

    let encodedMusicName = encodeURIComponent(musicName);
    xhr.open("GET", `${nccLocation}/data/api/types/music?q=${encodedMusicName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == musicName) {

                        music = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return music;
}

function upsertMusic(
    nccLocation,
    nccToken,
    musicBody
) {
    var success = false;
    var data = JSON.stringify(musicBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/music/`, false);
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