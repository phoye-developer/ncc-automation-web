function getListById(
    nccLocation,
    nccToken,
    listId
) {
    var list = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/outboundlist/${listId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            list = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return list;
}