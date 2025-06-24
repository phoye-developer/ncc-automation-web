function getReportById(
    nccLocation,
    nccToken,
    reportId
) {
    var report = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/report/${reportId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            report = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return report;
}

function getReportByName(
    nccLocation,
    nccToken,
    reportName
) {
    var report = {};

    var xhr = new XMLHttpRequest();

    let encodedReportName = encodeURIComponent(reportName);
    xhr.open("GET", `${nccLocation}/data/api/types/report?q=${encodedReportName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == reportName) {

                        report = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return report;
}

function upsertReport(
    nccLocation,
    nccToken,
    reportBody
) {
    var success = false;
    var data = JSON.stringify(reportBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/report/`, false);
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