<?php

http_response_code(500);

require('../../../auth_info.php');

// Get inbound request data
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Set outbound request variables
$alert_type = (isset($data['alertType'])) ? $data['alertType'] : false;
$ncc_location = (isset($data['nccLocation'])) ? $data['nccLocation'] : false;
$ncc_token = (isset($data['nccToken'])) ? $data['nccToken'] : false;
$priority = (isset($data['priority'])) ? $data['priority'] : false;
$tag = (isset($data['tag'])) ? $data['tag'] : false;
$text = (isset($data['text'])) ? $data['text'] : false;
$title = (isset($data['title'])) ? $data['title'] : false;
$username = (isset($data['username'])) ? $data['username'] : false;

if (
    $alert_type
    && $ncc_location
    && $ncc_token
    && $priority
    && $tag
    && $text
    && $title
    && $username
) {

    $success = false;

    $curl = curl_init();

    $encoded_username = urlencode($username);
    curl_setopt_array($curl, array(
        CURLOPT_URL => "$ncc_location/data/api/types/user?q=$encoded_username",
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

    curl_close($curl);

    if ($response_code == 200) {

        $success = true;
    }


    if ($success) {

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://api.us3.datadoghq.com/api/v1/events',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => "{
            \"aggregation_key\": \"$username\",
            \"alert_type\": \"$alert_type\",
            \"priority\": \"$priority\",
            \"source_type_name\": \"php\",
            \"title\": \"$title\",
            \"text\": \"$text\",
            \"tags\": [
                \"$tag\"
            ]
        }",
            CURLOPT_HTTPHEADER => array(
                "DD-API-KEY: $dd_api_key",
                "DD-APPLICATION-KEY: $dd_application_key",
                'Content-Type: application/json'
            ),
        ));

        $response = curl_exec($curl);
        $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);
    }
}

http_response_code($response_code);
