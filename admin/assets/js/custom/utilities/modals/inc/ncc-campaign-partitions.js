function searchCampaignPartitions(
    nccLocation,
    nccToken,
    campaignId,
    partitionId
) {
    var campaignPartition = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/campaignspartitions?q=${campaignId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if (response.total > 0) {
                let objects = response.objects;
                objects.forEach(object => {
                    if (object.partitionsId == partitionId
                        && object.campaignId == campaignId) {
                        campaignPartition = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return campaignPartition;
}

function createCampaignPartition(
    nccLocation,
    nccToken,
    campaignId,
    partitionId
) {
    var campaignPartition = {};
    var data = JSON.stringify({
        "campaignId": encodeURIComponent(campaignId),
        "partitionsId": encodeURIComponent(partitionId)
    });

    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/campaignspartitions/`, false);
    xhr.setRequestHeader("Authorization", nccToken);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    if (xhr.status == 201) {
        campaignPartition = JSON.parse(xhr.responseText);
    }

    return campaignPartition;
}