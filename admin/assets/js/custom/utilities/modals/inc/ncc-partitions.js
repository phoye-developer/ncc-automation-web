function getPartitionById(
    nccLocation,
    nccToken,
    partitionId
) {
    var partition = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/partitions/${partitionId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            partition = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return partition;
}

function getPartitionByName(
    nccLocation,
    nccToken,
    partitionName
) {
    var partition = {};

    var xhr = new XMLHttpRequest();

    let encodedPartitionName = encodeURIComponent(partitionName);
    xhr.open("GET", `${nccLocation}/data/api/types/partitions?q=${encodedPartitionName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let partitions = response.objects;
                partitions.forEach(object => {
                    if (object.name === partitionName) {
                        partition = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return partition;
}

function upsertPartition(
    nccLocation,
    nccToken,
    partitionBody
) {
    var success = false;
    var data = JSON.stringify(partitionBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/partitions/`, false);
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