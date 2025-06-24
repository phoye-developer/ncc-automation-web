function getCategorySummaryById(
    nccLocation,
    nccToken,
    categorySummaryId
) {
    var categorySummary = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/categorysummary/${categorySummaryId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            categorySummary = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return categorySummary;
}

function getCategorySummaryByName(
    nccLocation,
    nccToken,
    categorySummaryName
) {
    var categorySummary = {};

    var xhr = new XMLHttpRequest();

    let encodedCategorySummaryName = encodeURIComponent(categorySummaryName);
    xhr.open("GET", `${nccLocation}/data/api/types/categorysummary?q=${encodedCategorySummaryName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == categorySummaryName) {

                        categorySummary = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return categorySummary;
}

function upsertCategorySummary(
    nccLocation,
    nccToken,
    categorySummaryBody
) {
    var success = false;
    var data = JSON.stringify(categorySummaryBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/categorysummary/`, false);
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