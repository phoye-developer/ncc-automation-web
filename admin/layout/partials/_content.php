<?php
include('inc/functions.php');

$ncc_location = (isset($_COOKIE["nccLocation"])) ? $_COOKIE["nccLocation"] : false;
$ncc_token = (isset($_COOKIE["nccToken"])) ? $_COOKIE["nccToken"] : false;

$campaigns = [];
$campaign_names = [];
$dispositions = [];
$disposition_names = [];
$history = [];
$totalInboundCalls = 0;
$totalOutboundCalls = 0;
$totalChats = 0;
$totalSMSTexts = 0;
$totalSocial = 0;
$totalEmails = 0;
$workitems = [];

if (
    $ncc_location
    && $ncc_token
) {
    $campaigns = get_campaigns(
        $ncc_location,
        $ncc_token
    );

    foreach ($campaigns as $campaign) {
        $campaign_names[$campaign['_id']] = $campaign['name'];
    }

    $dispositions = get_dispositions(
        $ncc_location,
        $ncc_token
    );

    foreach ($dispositions as $disposition) {
        $disposition_names[$disposition['_id']] = $disposition['name'];
    }

    $history = get_history(
        $ncc_location,
        $ncc_token
    );

    if (array_key_exists("summary", $history)) {
        $totalInboundCalls = $history["summary"]["totalInbound"];
        $totalOutboundCalls =
            $history["summary"]["totalOutbound"]
            + $history["summary"]["totalPredictive"]
            + $history["summary"]["totalProgressive"];
        $totalChats = $history["summary"]["totalChat"];
        $totalSMS = $history["summary"]["totalSMS"];
        $totalSocial = $history["summary"]["totalSocial"];
        $totalEmail = $history["summary"]["totalEmail"];
    }

    if (array_key_exists("objects", $history)) {
        $workitems = $history["objects"];
    }
}
?>

<!--begin::Content-->
<div id="kt_app_content" class="app-content  flex-column-fluid">
    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container  container-xxl">
        <!--begin::Row-->
        <div class="row g-5 g-xl-10">
            <!--begin::Col-->
            <div class="col-xl-12 mb-5 mb-xl-10">
                <!--begin::Row-->
                <div class="row g-3 g-lg-6">
                    <!--begin::Col-->
                    <div class="col-2">
                        <!--begin::Items-->
                        <div class="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                            <!--begin::Stats-->
                            <div class="m-0">
                                <!--begin::Number-->
                                <span class="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1"><?= $totalInboundCalls ?></span>
                                <!--end::Number-->
                                <!--begin::Desc-->
                                <span class="text-gray-500 fw-semibold fs-6">Inbound calls</span>
                                <!--end::Desc-->
                            </div>
                            <!--end::Stats-->
                        </div>
                        <!--end::Items-->
                    </div>
                    <!--end::Col-->
                    <!--begin::Col-->
                    <div class="col-2">
                        <!--begin::Items-->
                        <div class="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                            <!--begin::Stats-->
                            <div class="m-0">
                                <!--begin::Number-->
                                <span class="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1"><?= $totalOutboundCalls ?></span>
                                <!--end::Number-->
                                <!--begin::Desc-->
                                <span class="text-gray-500 fw-semibold fs-6">Outbound calls</span>
                                <!--end::Desc-->
                            </div>
                            <!--end::Stats-->
                        </div>
                        <!--end::Items-->
                    </div>
                    <!--end::Col-->
                    <!--begin::Col-->
                    <div class="col-2">
                        <!--begin::Items-->
                        <div class="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                            <!--begin::Stats-->
                            <div class="m-0">
                                <!--begin::Number-->
                                <span class="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1"><?= $totalChats ?></span>
                                <!--end::Number-->
                                <!--begin::Desc-->
                                <span class="text-gray-500 fw-semibold fs-6">Chats</span>
                                <!--end::Desc-->
                            </div>
                            <!--end::Stats-->
                        </div>
                        <!--end::Items-->
                    </div>
                    <!--end::Col-->
                    <!--begin::Col-->
                    <div class="col-2">
                        <!--begin::Items-->
                        <div class="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                            <!--begin::Stats-->
                            <div class="m-0">
                                <!--begin::Number-->
                                <span class="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1"><?= $totalSMSTexts ?></span>
                                <!--end::Number-->
                                <!--begin::Desc-->
                                <span class="text-gray-500 fw-semibold fs-6">SMS texts</span>
                                <!--end::Desc-->
                            </div>
                            <!--end::Stats-->
                        </div>
                        <!--end::Items-->
                    </div>
                    <!--end::Col-->
                    <!--begin::Col-->
                    <div class="col-2">
                        <!--begin::Items-->
                        <div class="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                            <!--begin::Stats-->
                            <div class="m-0">
                                <!--begin::Number-->
                                <span class="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1"><?= $totalSocial ?></span>
                                <!--end::Number-->
                                <!--begin::Desc-->
                                <span class="text-gray-500 fw-semibold fs-6">Social</span>
                                <!--end::Desc-->
                            </div>
                            <!--end::Stats-->
                        </div>
                        <!--end::Items-->
                    </div>
                    <!--end::Col-->
                    <!--begin::Col-->
                    <div class="col-2">
                        <!--begin::Items-->
                        <div class="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                            <!--begin::Stats-->
                            <div class="m-0">
                                <!--begin::Number-->
                                <span class="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1"><?= $totalEmails ?></span>
                                <!--end::Number-->
                                <!--begin::Desc-->
                                <span class="text-gray-500 fw-semibold fs-6">Emails</span>
                                <!--end::Desc-->
                            </div>
                            <!--end::Stats-->
                        </div>
                        <!--end::Items-->
                    </div>
                    <!--end::Col-->
                </div>
                <!--end::Row-->
            </div>
            <!--end::Col-->
        </div>
        <!--end::Row-->
        <!--begin::Row-->
        <!--begin::Col-->
        <div class="col-xl-12 mb-5 mb-xl-10">
            <!--begin::Table Widget 4-->
            <div class="card card-flush h-xl-100">
                <!--begin::Card header-->
                <div class="card-header pt-7">
                    <!--begin::Title-->
                    <h3 class="card-title align-items-start flex-column">
                        <span class="card-label fw-bold text-gray-800">Workitems (today)</span>
                    </h3>
                    <!--end::Title-->
                </div>
                <!--end::Card header-->
                <!--begin::Card body-->
                <div class="card-body pt-2">
                    <!--begin::Table-->
                    <table class="table align-middle table-row-dashed fs-6 gy-3" id="kt_workitems_table">
                        <!--begin::Table head-->
                        <thead>
                            <!--begin::Table row-->
                            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th class="min-w-100px">Type</th>
                                <th class="min-w-100px">Campaign</th>
                                <th class="min-w-100px">Disposition</th>
                                <th class="min-w-100px">From</th>
                                <th class="min-w-125px">To</th>
                            </tr>
                            <!--end::Table row-->
                        </thead>
                        <!--end::Table head-->
                        <!--begin::Table body-->
                        <tbody class="fw-bold text-gray-600">
                            <?php foreach ($workitems as $workitem): ?>
                                <tr>
                                    <td><?= $workitem['type'] ?></td>
                                    <td><?= $campaign_names[$workitem['campaignId']] ?></td>
                                    <td><?= @$disposition_names[$workitem['dispositionId']] ?></td>
                                    <td><?= $workitem['from'] ?></td>
                                    <td><?= $workitem['to'] ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                        <!--end::Table body-->
                    </table>
                    <!--end::Table-->
                </div>
                <!--end::Card body-->
            </div>
            <!--end::Table Widget 4-->
        </div>
        <!--end::Col-->
        <!--end::Row-->
    </div>
    <!--end::Content container-->
</div>
<!--end::Content-->