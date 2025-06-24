function getCategoryById(
    nccLocation,
    nccToken,
    categoryId
) {
    var category = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/category/${categoryId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            category = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return category;
}

function getCategoryByName(
    nccLocation,
    nccToken,
    categoryName
) {
    var category = {};

    var xhr = new XMLHttpRequest();

    let encodedCategoryName = encodeURIComponent(categoryName);
    xhr.open("GET", `${nccLocation}/data/api/types/category?q=${encodedCategoryName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == categoryName) {

                        category = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return category;
}

function upsertCategory(
    nccLocation,
    nccToken,
    categoryBody
) {
    var success = false;
    var data = JSON.stringify(categoryBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/category/`, false);
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