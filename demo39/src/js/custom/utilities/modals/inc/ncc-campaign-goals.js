function getCampaignGoalsById(
    nccLocation,
    nccToken,
    campaignGoalsId
) {
    var campaignGoals = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaigngoals/${campaignGoalsId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            campaignGoals = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return campaignGoals;
}

function getCampaignGoalByName(
    nccLocation,
    nccToken,
    campaignGoalName
) {
    var campaignGoal = {};

    var xhr = new XMLHttpRequest();

    let encodedCampaignGoalName = encodeURIComponent(campaignGoalName);
    xhr.open("GET", `${nccLocation}/data/api/types/campaigngoals?q=${encodedCampaignGoalName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == campaignGoalName) {

                        campaignGoal = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignGoal;
}

function upsertCampaignGoal(
    nccLocation,
    nccToken,
    campaignGoalBody
) {
    var success = false;
    var data = JSON.stringify(campaignGoalBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaigngoals/`, false);
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