function getTimeEventById(
    nccLocation,
    nccToken,
    timeEventId
) {
    var timeEvent = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/timeevent/${timeEventId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            timeEvent = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return timeEvent;
}

function getTimeEventByName(
    nccLocation,
    nccToken,
    timeEventName
) {
    var timeEvent = {};

    var xhr = new XMLHttpRequest();

    let encodedTimeEventName = encodeURIComponent(timeEventName);
    xhr.open("GET", `${nccLocation}/data/api/types/timeevent?q=${encodedTimeEventName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == timeEventName) {

                        timeEvent = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return timeEvent;
}

function upsertTimeEvent(
    nccLocation,
    nccToken,
    timeEventBody
) {
    var success = false;
    var data = JSON.stringify(timeEventBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/timeevent/`, false);
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