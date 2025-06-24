function getScorecardById(
    nccLocation,
    nccToken,
    scorecardId
) {
    var scorecard = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/scorecard/${scorecardId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            scorecard = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return scorecard;
}

function getScorecardByName(
    nccLocation,
    nccToken,
    scorecardName
) {
    var scorecard = {};

    var xhr = new XMLHttpRequest();

    let encodedScorecardName = encodeURIComponent(scorecardName);
    xhr.open("GET", `${nccLocation}/data/api/types/scorecard?q=${encodedScorecardName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == scorecardName) {

                        scorecard = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return scorecard;
}

function upsertScorecard(
    nccLocation,
    nccToken,
    scorecardBody
) {
    var success = false;
    var data = JSON.stringify(scorecardBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/scorecard/`, false);
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