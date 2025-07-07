function searchCampaignScorecards(
    nccLocation,
    nccToken,
    campaignId,
    scorecardId
) {
    var campaignScorecard = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaignscorecard?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (
                        object.scorecardId == scorecardId
                        && object.campaignId == campaignId
                    ) {
                        campaignScorecard = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignScorecard;
}

function createCampaignScorecard(
    nccLocation,
    nccToken,
    campaignId,
    scorecardId
) {
    var campaignScorecard = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "scorecardId": encodeURIComponent(scorecardId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaignscorecard/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignScorecard = JSON.parse(xhr.responseText);
    }

    return campaignScorecard;
}