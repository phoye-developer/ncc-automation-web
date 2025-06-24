function getWidgetById(
    nccLocation,
    nccToken,
    widgetId
) {
    var widget = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/widget/${widgetId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            widget = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return widget;
}

function getWidgetByName(
    nccLocation,
    nccToken,
    widgetName
) {
    var widget = {};

    var xhr = new XMLHttpRequest();

    let encodedWidgetName = encodeURIComponent(widgetName);
    xhr.open("GET", `${nccLocation}/data/api/types/widget?q=${encodedWidgetName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == widgetName) {

                        widget = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return widget;
}

function upsertWidget(
    nccLocation,
    nccToken,
    widgetBody
) {
    var success = false;
    var data = JSON.stringify(widgetBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/widget/`, false);
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