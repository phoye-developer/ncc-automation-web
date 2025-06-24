function getSurveyThemeById(
    nccLocation,
    nccToken,
    surveyThemeId
) {
    var surveyTheme = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/surveytheme/${surveyThemeId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            surveyTheme = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return surveyTheme;
}

function getSurveyThemeByName(
    nccLocation,
    nccToken,
    surveyThemeName
) {
    var surveyTheme = {};

    var xhr = new XMLHttpRequest();

    let encodedSurveyThemeName = encodeURIComponent(surveyThemeName);
    xhr.open("GET", `${nccLocation}/data/api/types/surveytheme?q=${encodedSurveyThemeName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == surveyThemeName) {

                        surveyTheme = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return surveyTheme;
}

function upsertSurveyTheme(
    nccLocation,
    nccToken,
    surveyThemeBody
) {
    var success = false;
    var data = JSON.stringify(surveyThemeBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/surveytheme/`, false);
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