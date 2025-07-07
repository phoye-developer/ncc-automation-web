function searchCampaignDialPlans(
    nccLocation,
    nccToken,
    campaignId,
    dialPlanId
) {
    var campaignDialPlan = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaigndialplan?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.dialplanId == dialPlanId
                        && object.campaignId == campaignId) {
                        campaignDialPlan = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignDialPlan;
}

function createCampaignDialPlan(
    nccLocation,
    nccToken,
    campaignId,
    dialPlanId
) {
    var campaignDialPlan = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "dialplanId": encodeURIComponent(dialPlanId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaigndialplan/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignDialPlan = JSON.parse(xhr.responseText);
    }

    return campaignDialPlan;
}