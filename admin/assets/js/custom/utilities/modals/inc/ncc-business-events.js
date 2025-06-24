function getBusinessEventById(
    nccLocation,
    nccToken,
    businessEventId
) {
    var businessEvent = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/businessevent/${businessEventId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            businessEvent = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return businessEvent;
}

function getBusinessEventByName(
    nccLocation,
    nccToken,
    businessEventName
) {
    var businessEvent = {};

    var xhr = new XMLHttpRequest();

    let encodedBusinessEventName = encodeURIComponent(businessEventName);
    xhr.open("GET", `${nccLocation}/data/api/types/businessevent?q=${encodedBusinessEventName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == businessEventName) {

                        businessEvent = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return businessEvent;
}

function upsertBusinessEvent(
    nccLocation,
    nccToken,
    businessEventBody
) {
    var success = false;
    var data = JSON.stringify(businessEventBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/businessevent/`, false);
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