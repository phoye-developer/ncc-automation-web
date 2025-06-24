function getDialPlanById(
    nccLocation,
    nccToken,
    dialPlanId
) {
    var dialPlan = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/dialplan/${dialPlanId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            dialPlan = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return dialPlan;
}

function getDialPlanByName(
    nccLocation,
    nccToken,
    dialPlanName
) {
    var dialPlan = {};

    var xhr = new XMLHttpRequest();

    let encodedDialPlanName = encodeURIComponent(dialPlanName);
    xhr.open("GET", `${nccLocation}/data/api/types/dialplan?q=${encodedDialPlanName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == dialPlanName) {

                        dialPlan = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return dialPlan;
}

function upsertDialPlan(
    nccLocation,
    nccToken,
    dialPlanBody
) {
    var success = false;
    var data = JSON.stringify(dialPlanBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/dialplan/`, false);
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