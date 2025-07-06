<?php
include('inc/functions.php');

$ncc_location = (isset($_COOKIE["nccLocation"])) ? $_COOKIE["nccLocation"] : false;
$ncc_token = (isset($_COOKIE["nccToken"])) ? $_COOKIE["nccToken"] : false;

$campaigns = [];
$reports = [];
$home_tabs = [];

if (
    $ncc_location
    && $ncc_token
) {
    $data = get_export_campaign_info(
        $ncc_location,
        $ncc_token
    );

    $campaigns = $data[0];
    $reports = $data[1];
    $home_tabs = $data[2];
}

if (count($campaigns) > 0) {

    // Sort $campaigns by 'name'
    usort($campaigns, function ($a, $b) {
        return strcmp($a['name'], $b['name']);
    });
}

if (count($reports) > 0) {

    // Sort $reports by 'name'
    usort($reports, function ($a, $b) {
        return strcmp($a['name'], $b['name']);
    });
}

if (count($home_tabs) > 0) {

    // Sort $home_tabs by 'name'
    usort($home_tabs, function ($a, $b) {
        return strcmp($a['name'], $b['name']);
    });
}
?>

<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container container-fluid">
        <!--begin::Card-->
        <div class="card">
            <!--begin::Card body-->
            <div class="card-body">
                <!--begin::Stepper-->
                <div class="stepper stepper-links d-flex flex-column pt-5" id="kt_export_campaign_stepper">
                    <!--begin::Nav-->
                    <div class="stepper-nav mb-5">
                        <!--begin::Step 1-->
                        <div class="stepper-item current" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Campaign</h3>
                        </div>
                        <!--end::Step 1-->
                        <!--begin::Step 2-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Reports</h3>
                        </div>
                        <!--end::Step 2-->
                        <!--begin::Step 3-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Home tabs</h3>
                        </div>
                        <!--end::Step 3-->
                        <!--begin::Step 4-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Export</h3>
                        </div>
                        <!--end::Step 4-->
                    </div>
                    <!--end::Nav-->
                    <!--begin::Form-->
                    <form class="mx-auto mw-900px w-100 pt-5 pb-10" novalidate="novalidate" id="kt_export_campaign_form">
                        <!--begin::Step 1-->
                        <div class="current" data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-100">
                                <!--begin::Input group-->
                                <div class="fv-row mb-5">
                                    <!--begin::Label-->
                                    <label class="form-label required">Campaign name</label>
                                    <!--end::Label-->
                                    <!--begin::Input-->
                                    <select name="campaign" class="form-select form-select-lg form-select-solid" data-control="select2" data-placeholder="Select..." data-allow-clear="true" data-hide-search="true">
                                        <option></option>
                                        <?php foreach ($campaigns as $campaign): ?>
                                            <option value="<?= $campaign["_id"] ?>"><?= $campaign["name"] ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                    <!--end::Input-->
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-6">
                                    <div class="form-check form-switch form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" id="preserve_authentication" name="preserve_authentication" />
                                        <label class="form-check-label" for="preserve_authentication">
                                            Preserve API authentication
                                        </label>
                                    </div>
                                </div>
                                <!--end::Input group-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 1-->
                        <!--begin::Step 2-->
                        <div data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-100">
                                <!--begin::Input group-->
                                <select id="kt_dual_listbox_reports" name="reports" class="dual-listbox" multiple>
                                    <?php foreach ($reports as $report): ?>
                                        <option value="<?= $report["_id"] ?>"><?= $report["name"] ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <!--end::Input group-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 2-->
                        <!--begin::Step 3-->
                        <div data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-100">
                                <!--begin::Input group-->
                                <select id="kt_dual_listbox_home_tabs" name="home_tabs" class="dual-listbox" multiple>
                                    <?php foreach ($home_tabs as $home_tab): ?>
                                        <option value="<?= $home_tab["_id"] ?>"><?= $home_tab["name"] ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <!--end::Input group-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 3-->
                        <!--begin::Step 4-->
                        <div data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-100">
                                <!--begin::Body-->
                                <div class="mb-0">
                                    <!--begin::Alert-->
                                    <!--begin::Notice-->
                                    <div class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6 mb-5">
                                        <!--begin::Icon-->
                                        <i class="ki-outline ki-information fs-2tx text-warning me-4"></i>
                                        <!--end::Icon-->
                                        <!--begin::Wrapper-->
                                        <div class="d-flex flex-stack flex-grow-1">
                                            <!--begin::Content-->
                                            <div class="fw-semibold">
                                                <h4 class="text-gray-900 fw-bold">Keep this page open!</h4>
                                                <div class="fs-6 text-gray-700">Please wait until the script below completes to close, reload, or navigate away from this page.
                                                </div>
                                            </div>
                                            <!--end::Content-->
                                        </div>
                                        <!--end::Wrapper-->
                                    </div>
                                    <!--end::Notice-->
                                    <!--end::Alert-->
                                    <!--begin::Input group-->
                                    <div class="fv-row mb-10">
                                        <!--end::Label-->
                                        <label class="form-label">Output</label>
                                        <!--end::Label-->
                                        <!--begin::Input-->
                                        <textarea name="export_campaign_output" class="form-control form-control-lg form-control-solid output" rows="15" disabled></textarea>
                                        <!--end::Input-->
                                    </div>
                                    <!--end::Input group-->
                                </div>
                                <!--end::Body-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 4-->
                        <!--begin::Actions-->
                        <div class="d-flex flex-stack pt-15">
                            <!--begin::Wrapper-->
                            <div class="mr-2">
                                <button type="button" class="btn btn-lg btn-light-primary me-3 d-none" data-kt-stepper-action="previous">
                                    <i class="ki-outline ki-arrow-left fs-4 me-1"></i>Back</button>
                            </div>
                            <!--end::Wrapper-->
                            <!--begin::Wrapper-->
                            <div>
                                <button type="button" class="btn btn-lg btn-primary me-3 d-none" data-kt-stepper-type="action" data-kt-stepper-action="submit">
                                    <span class="indicator-label">Submit
                                        <i class="ki-outline ki-arrow-right fs-3 ms-2 me-0"></i></span>
                                    <span class="indicator-progress">Please wait...
                                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                                </button>
                                <button type="button" class="btn btn-lg btn-primary me-3 d-none" data-kt-stepper-type="action" data-kt-stepper-action="logout">
                                    <span class="indicator-label">Switch Account</span>
                                    <span class="indicator-progress">Please wait...
                                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                                </button>
                                <button type="button" class="btn btn-lg btn-primary" data-kt-stepper-action="next">Continue
                                    <i class="ki-outline ki-arrow-right fs-4 ms-1 me-0"></i></button>
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Actions-->
                    </form>
                    <!--end::Form-->
                </div>
                <!--end::Stepper-->
            </div>
            <!--end::Card body-->
        </div>
        <!--end::Card-->
    </div>
    <!--end::Content container-->
</div>
<!--end::Content-->
<!--begin::Javascript-->
<script>
    var hostUrl = "assets/";
</script>
<!--begin::Global Javascript Bundle(mandatory for all pages)-->
<script src="assets/plugins/global/plugins.bundle.js"></script>
<script src="assets/js/scripts.bundle.js"></script>
<!--end::Global Javascript Bundle-->
<!--begin::Vendors Javascript(used for this page only)-->
<!--end::Vendors Javascript-->
<!--begin::Custom Javascript(used for this page only)-->
<script src="assets/js/custom/utilities/modals/export-campaign.js"></script>
<script src="assets/js/custom/utilities/modals/dual-listbox.js"></script>
<script src="assets/js/custom/utilities/modals/dual-listbox-reports.js"></script>
<script src="assets/js/custom/utilities/modals/dual-listbox-home-tabs.js"></script>
<!--end::Custom Javascript-->
<!--end::Javascript-->