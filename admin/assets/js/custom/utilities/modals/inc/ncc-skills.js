function getSkillById(
    nccLocation,
    nccToken,
    skillId
) {
    var skill = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${nccLocation}/data/api/types/skill/${skillId}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {
            skill = JSON.parse(xhr.responseText);
        }
    } catch (error) {
        console.log(error);
    }

    return skill;
}

function getSkillByName(
    nccLocation,
    nccToken,
    skillName
) {
    var skill = {};

    var xhr = new XMLHttpRequest();

    let encodedSkillName = encodeURIComponent(skillName);
    xhr.open("GET", `${nccLocation}/data/api/types/skill?q=${encodedSkillName}`, false);
    xhr.setRequestHeader("Authorization", nccToken);

    try {
        xhr.send();

        if (xhr.status == 200) {

            let response = JSON.parse(xhr.responseText);

            if (response.count > 0) {

                let objects = response.objects;

                objects.forEach(object => {

                    if (object.name == skillName) {

                        skill = object;
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

    return skill;
}

function upsertSkill(
    nccLocation,
    nccToken,
    skillBody
) {
    var success = false;
    var data = JSON.stringify(skillBody);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${nccLocation}/data/api/types/skill/`, false);
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