function postEvent(
    alertType,
    nccLocation,
    nccToken,
    priority,
    tag,
    text,
    title,
    username
) {
    var data = JSON.stringify({
        "alertType": alertType,
        "nccLocation": nccLocation,
        "nccToken": nccToken,
        "priority": priority,
        "tag": tag,
        "text": text,
        "title": title,
        "username": username
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `http://localhost/ncc-automation-web/admin/api/create_event.php`, false);
    xhr.setRequestHeader("Content-Type", "application/json");

    try {
        xhr.send(data);
    } catch (error) {
        console.log(error);
    }
}