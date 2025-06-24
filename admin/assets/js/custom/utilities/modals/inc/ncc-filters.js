function getFilterById(
    nccLocation,
    nccToken,
    filterId
) {
    var filter = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/filter/${filterId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            filter = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return filter;
}

function getFilterByName(
    nccLocation,
    nccToken,
    filterName
) {
    var filter = {};

    var xhr = new XMLHttpRequest();

    let encodedFilterName = encodeURIComponent(filterName);
    xhr.open("GET", `${nccLocation}/data/api/types/filter?q=${encodedFilterName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == filterName) {

                        filter = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return filter;
}

function upsertFilter(
    nccLocation,
    nccToken,
    filterBody
) {
    var success = false;
    var data = JSON.stringify(filterBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/filter/`, false);
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