function getDashboardById(
    nccLocation,
    nccToken,
    dashboardId
) {
    var dashboard = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/dashboard/${dashboardId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            dashboard = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return dashboard;
}

function getDashboardByName(
    nccLocation,
    nccToken,
    dashboardName
) {
    var dashboard = {};

    var xhr = new XMLHttpRequest();

    let encodedDashboardName = encodeURIComponent(dashboardName);
    xhr.open("GET", `${nccLocation}/data/api/types/dashboard?q=${encodedDashboardName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == dashboardName) {

                        dashboard = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return dashboard;
}

function upsertDashboard(
    nccLocation,
    nccToken,
    dashboardBody
) {
    var success = false;
    var data = JSON.stringify(dashboardBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/dashboard/`, false);
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