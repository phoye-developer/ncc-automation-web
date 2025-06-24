function getSurveyById(
    nccLocation,
    nccToken,
    surveyId
) {
    var survey = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/survey/${surveyId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            survey = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return survey;
}

function getSurveyByName(
    nccLocation,
    nccToken,
    surveyName
) {
    var survey = {};

    var xhr = new XMLHttpRequest();

    let encodedSurveyName = encodeURIComponent(surveyName);
    xhr.open("GET", `${nccLocation}/data/api/types/survey?q=${encodedSurveyName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == surveyName) {

                        survey = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return survey;
}

function upsertSurvey(
    nccLocation,
    nccToken,
    surveyBody
) {
    var success = false;
    var data = JSON.stringify(surveyBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/survey/`, false);
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