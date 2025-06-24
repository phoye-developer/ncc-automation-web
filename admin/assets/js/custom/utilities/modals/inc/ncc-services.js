function getServiceById(
    nccLocation,
    nccToken,
    serviceId
) {
    var service = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/service/${serviceId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            service = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return service;
}

function getServiceByName(
    nccLocation,
    nccToken,
    serviceName
) {
    var service = {};

    var xhr = new XMLHttpRequest();

    var encodedServiceName = encodeURIComponent(serviceName);
    xhr.open("GET", `${nccLocation}/data/api/types/service?q=${encodedServiceName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.total > 0) {
                let services = response.objects;
                services.forEach(object => {
                    if (object.name == serviceName) {
                        service = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return service;
}