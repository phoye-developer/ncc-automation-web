<?php

function get_pstn_numbers(
    $ncc_location,
    $ncc_token
) {
    $pstn_numbers = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/pstnnumber",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $body = json_decode($response, true);
        $objects = $body["objects"];
        foreach ($objects as $object) {
            array_push($pstn_numbers, $object["name"]);
        }
    }

    curl_close($curl);

    return $pstn_numbers;
}

function get_campaigns(
    $ncc_location,
    $ncc_token
) {
    $campaigns = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/campaign",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $body = json_decode($response, true);
        $campaigns = $body["objects"];
    }

    curl_close($curl);

    return $campaigns;
}

function get_campaign_addresses(
    $ncc_location,
    $ncc_token
) {
    $campaign_addresses = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/campaign",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $body = json_decode($response, true);
        $objects = $body["objects"];
        foreach ($objects as $object) {
            if (isset($object["addresses"])) {
                $object_addresses = $object["addresses"];
                foreach ($object_addresses as $object_address) {
                    array_push($campaign_addresses, $object_address);
                }
            }
        }
    }

    curl_close($curl);

    return $campaign_addresses;
}

function get_dispositions(
    $ncc_location,
    $ncc_token
) {
    $dispositions = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/disposition",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $body = json_decode($response, true);
        $dispositions = $body["objects"];
    }

    curl_close($curl);

    return $dispositions;
}

function get_disposition_names(
    $ncc_location,
    $ncc_token
) {
    $disposition_names = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/disposition",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $body = json_decode($response, true);
        $dispositions = $body["objects"];
        foreach ($dispositions as $disposition) {
            array_push($disposition_names, $disposition["name"]);
        }
    }

    curl_close($curl);

    return $disposition_names;
}

function get_reports(
    $ncc_location,
    $ncc_token
) {
    $reports = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/report",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $body = json_decode($response, true);
        $reports = $body["objects"];
    }

    curl_close($curl);

    return $reports;
}

function get_home_tabs(
    $ncc_location,
    $ncc_token
) {
    $home_tabs = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/hometab",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $body = json_decode($response, true);
        $home_tabs = $body["objects"];
    }

    curl_close($curl);

    return $home_tabs;
}

function get_history(
    $ncc_location,
    $ncc_token
) {
    $history = [];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/analytics/api/types/workitems/history?rangeType=today",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            "Authorization: $ncc_token"
        ),
    ));

    $response = curl_exec($curl);
    $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($response_code == 200) {
        $history = json_decode($response, true);
    }

    curl_close($curl);

    return $history;
}
