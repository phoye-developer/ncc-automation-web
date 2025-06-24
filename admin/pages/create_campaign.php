<?php
include('inc/functions.php');

$ncc_location = (isset($_COOKIE["nccLocation"])) ? $_COOKIE["nccLocation"] : false;
$ncc_token = (isset($_COOKIE["nccToken"])) ? $_COOKIE["nccToken"] : false;

$pstn_numbers = [];
$available_addresses = [];

$base_dispositions = [
    "Pending - Awaiting Customer Response",
    "Pending - Awaiting Internal Review",
    "Pending - Callback Required",
    "Pending - Escalated to Supervisor",
    "Pending - Escalated to Support",
    "Pending - System Error",
    "Resolved - Block Number",
    "Resolved - Customer Disconnected",
    "Resolved - No Action Needed",
    "Resolved - Out of Scope",
    "Resolved - Request Cancelled"
];
$existing_dispositions = [];

if (
    $ncc_location
    && $ncc_token
) {
    $pstn_numbers = get_pstn_numbers(
        $ncc_location,
        $ncc_token
    );

    $campaign_addresses = get_campaign_addresses(
        $ncc_location,
        $ncc_token
    );

    $available_addresses = array_diff(
        $pstn_numbers,
        $campaign_addresses
    );

    $existing_dispositions = get_disposition_names(
        $ncc_location,
        $ncc_token
    );
}

$dispositions = array_unique(array_merge($base_dispositions, $existing_dispositions));
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
                <div class="stepper stepper-links d-flex flex-column pt-15" id="kt_create_campaign_stepper">
                    <!--begin::Nav-->
                    <div class="stepper-nav mb-5">
                        <!--begin::Step 1-->
                        <div class="stepper-item current" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Basic info</h3>
                        </div>
                        <!--end::Step 1-->
                        <!--begin::Step 2-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Workflow</h3>
                        </div>
                        <!--end::Step 2-->
                        <!--begin::Step 3-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Numbers</h3>
                        </div>
                        <!--end::Step 3-->
                        <!--begin::Step 4-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Dispositions</h3>
                        </div>
                        <!--end::Step 4-->
                        <!--begin::Step 5-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Settings</h3>
                        </div>
                        <!--end::Step 5-->
                        <!--begin::Step 6-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Create</h3>
                        </div>
                        <!--end::Step 6-->
                    </div>
                    <!--end::Nav-->
                    <!--begin::Form-->
                    <form class="mx-auto mw-900px w-100 pt-5 pb-10" novalidate="novalidate" id="kt_create_campaign_form">
                        <!--begin::Step 1-->
                        <div class="current" data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-100"><!--begin::Input group-->
                                <div class="fv-row mb-5">
                                    <!--begin::Label-->
                                    <label class="d-flex align-items-center form-label">
                                        <span class="required">Campaign name</span>
                                    </label>
                                    <!--end::Label-->
                                    <!--begin::Input-->
                                    <input name="campaign_name" class="form-control form-control-lg form-control-solid" />
                                    <!--end::Input-->
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-5">
                                    <!--begin::Label-->
                                    <label class="form-label required">Business name</label>
                                    <!--end::Label-->
                                    <!--begin::Input-->
                                    <input name="business_name" class="form-control form-control-lg form-control-solid" />
                                    <!--end::Input-->
                                    <!--begin::Hint-->
                                    <div class="form-text">The business name will be used to greet users and as the name of the survey theme.</div>
                                    <!--end::Hint-->
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-5">
                                    <!--begin::Label-->
                                    <label class="form-label required">Business vertical</label>
                                    <!--end::Label-->
                                    <!--begin::Input-->
                                    <select name="vertical" class="form-select form-select-lg form-select-solid" data-control="select2" data-placeholder="Select..." data-allow-clear="true" data-hide-search="true">
                                        <option></option>
                                        <option value="general">General</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="finserv">FinServ</option>
                                        <option value="insurance">Insurance</option>
                                        <option value="retail">Retail</option>
                                        <option value="pubsec">PubSec</option>
                                    </select>
                                    <!--end::Input-->
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
                                <div class="mb-0 fv-row">
                                    <!--begin::Label-->
                                    <label class="d-flex align-items-center form-label mb-5"><span class="required">Select a workflow type</span></label>
                                    <!--end::Label-->
                                    <!--begin::Options-->
                                    <div class="mb-0">
                                        <!--begin:Option-->
                                        <label class="d-flex flex-stack mb-5 cursor-pointer">
                                            <!--begin:Label-->
                                            <span class="d-flex align-items-center me-2">
                                                <!--begin::Icon-->
                                                <span class="symbol symbol-50px me-6">
                                                    <span class="symbol-label">
                                                        <i class="ki-outline ki-android fs-1 text-gray-600"></i>
                                                    </span>
                                                </span>
                                                <!--end::Icon-->
                                                <!--begin::Description-->
                                                <span class="d-flex flex-column">
                                                    <span class="fw-bold text-gray-800 text-hover-primary fs-5">Intelligent Virtual Agent (IVA)</span>
                                                    <span class="fs-6 fw-semibold text-muted">Use a Dialogflow ES agent to route workitems</span>
                                                </span>
                                                <!--end:Description-->
                                            </span>
                                            <!--end:Label-->
                                            <!--begin:Input-->
                                            <span class="form-check form-check-custom form-check-solid">
                                                <input class="form-check-input" type="radio" name="workflow_type" value="iva" />
                                            </span>
                                            <!--end:Input-->
                                        </label>
                                        <!--end::Option-->
                                        <!--begin:Option-->
                                        <label class="d-flex flex-stack mb-5 cursor-pointer">
                                            <!--begin:Label-->
                                            <span class="d-flex align-items-center me-2">
                                                <!--begin::Icon-->
                                                <span class="symbol symbol-50px me-6">
                                                    <span class="symbol-label">
                                                        <i class="ki-outline ki-menu fs-1 text-gray-600"></i>
                                                    </span>
                                                </span>
                                                <!--end::Icon-->
                                                <!--begin::Description-->
                                                <span class="d-flex flex-column">
                                                    <span class="fw-bold text-gray-800 text-hover-primary fs-5">Non-IVA, DTMF</span>
                                                    <span class="fs-6 fw-semibold text-muted">Use DTMF and radio button input to route workitems</span>
                                                </span>
                                                <!--end:Description-->
                                            </span>
                                            <!--end:Label-->
                                            <!--begin:Input-->
                                            <span class="form-check form-check-custom form-check-solid">
                                                <input class="form-check-input" type="radio" name="workflow_type" value="non_iva" />
                                            </span>
                                            <!--end:Input-->
                                        </label>
                                        <!--end::Option-->
                                        <!--begin:Option-->
                                        <label class="d-flex flex-stack mb-0 cursor-pointer">
                                            <!--begin:Label-->
                                            <span class="d-flex align-items-center me-2">
                                                <!--begin::Icon-->
                                                <span class="symbol symbol-50px me-6">
                                                    <span class="symbol-label">
                                                        <i class="ki-outline ki-arrow-right fs-1 text-gray-600"></i>
                                                    </span>
                                                </span>
                                                <!--end::Icon-->
                                                <!--begin::Description-->
                                                <span class="d-flex flex-column">
                                                    <span class="fw-bold text-gray-800 text-hover-primary fs-5">Direct Line</span>
                                                    <span class="fs-6 fw-semibold text-muted">Route workitems directly to Customer Service</span>
                                                </span>
                                                <!--end:Description-->
                                            </span>
                                            <!--end:Label-->
                                            <!--begin:Input-->
                                            <span class="form-check form-check-custom form-check-solid">
                                                <input class="form-check-input" type="radio" name="workflow_type" value="direct" />
                                            </span>
                                            <!--end:Input-->
                                        </label>
                                        <!--end::Option-->
                                    </div>
                                    <!--end::Options-->
                                </div>
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
                                <div class="fv-row mb-5">
                                    <!--begin::Label-->
                                    <label class="form-label">PSTN address</label>
                                    <!--end::Label-->
                                    <!--begin::Input-->
                                    <select name="pstn_address" class="form-select form-select-lg form-select-solid" data-control="select2" data-placeholder="Select..." data-allow-clear="true" data-hide-search="true">
                                        <option></option>
                                        <?php foreach ($available_addresses as $available_address): ?>
                                            <option value="<?= $available_address ?>"><?= $available_address ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                    <!--end::Input-->
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-5">
                                    <!--begin::Label-->
                                    <label class="form-label required">Campaign caller ID</label>
                                    <!--end::Label-->
                                    <!--begin::Input-->
                                    <select name="campaign_caller_id" class="form-select form-select-lg form-select-solid" data-control="select2" data-placeholder="Select..." data-allow-clear="true" data-hide-search="true">
                                        <option></option>
                                        <?php foreach ($pstn_numbers as $pstn_number): ?>
                                            <option value="<?= $pstn_number ?>"><?= $pstn_number ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                    <!--end::Input-->
                                </div>
                                <!--end::Input group-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 3-->
                        <!--begin::Step 4-->
                        <div data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-100">
                                <!--begin::Input group-->
                                <select id="kt_dual_listbox_3" name="dispositions" class="dual-listbox" multiple>
                                    <?php foreach ($dispositions as $disposition): ?>
                                        <option value="<?= $disposition ?>"><?= $disposition ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <!--end::Input group-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 4-->
                        <!--begin::Step 5-->
                        <div data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-100">
                                <!--begin::Input group-->
                                <div class="fv-row mb-6">
                                    <div class="form-check form-switch form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" id="assign_agents_queues" name="assign_agents_queues" />
                                        <label class="form-check-label" for="assign_agents_queues">
                                            Assign agents to queues
                                        </label>
                                    </div>
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-6">
                                    <div class="form-check form-switch form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" id="assign_supervisors_queues" name="assign_supervisors_queues" />
                                        <label class="form-check-label" for="assign_supervisors_queues">
                                            Assign supervisors to queues
                                        </label>
                                    </div>
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-6">
                                    <div class="form-check form-switch form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" id="assign_supervisors_campaign" name="assign_supervisors_campaign" />
                                        <label class="form-check-label" for="assign_supervisors_campaign">
                                            Assign supervisors to campaign
                                        </label>
                                    </div>
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-6">
                                    <div class="form-check form-switch form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" id="assign_agents_topics" name="assign_agents_topics" />
                                        <label class="form-check-label" for="assign_agents_topics">
                                            Assign agents to topics
                                        </label>
                                    </div>
                                </div>
                                <!--end::Input group-->
                                <!--begin::Input group-->
                                <div class="fv-row mb-6">
                                    <div class="form-check form-switch form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" id="assign_supervisors_topics" name="assign_supervisors_topics" />
                                        <label class="form-check-label" for="assign_supervisors_topics">
                                            Assign supervisors to topics
                                        </label>
                                    </div>
                                </div>
                                <!--end::Input group-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 5-->
                        <!--begin::Step 6-->
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
                                        <textarea name="output" class="form-control form-control-lg form-control-solid output" rows="15" disabled></textarea>
                                        <!--end::Input-->
                                    </div>
                                    <!--end::Input group-->
                                </div>
                                <!--end::Body-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 6-->
                        <!--begin::Actions-->
                        <div class="d-flex flex-stack pt-15">
                            <!--begin::Wrapper-->
                            <div class="mr-2">
                                <button type="button" class="btn btn-lg btn-light-primary me-3" data-kt-stepper-action="previous">
                                    <i class="ki-outline ki-arrow-left fs-4 me-1"></i>Back</button>
                            </div>
                            <!--end::Wrapper-->
                            <!--begin::Wrapper-->
                            <div>
                                <button type="button" class="btn btn-lg btn-primary me-3" data-kt-stepper-action="submit">
                                    <span class="indicator-label">Submit
                                        <i class="ki-outline ki-arrow-right fs-3 ms-2 me-0"></i></span>
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
<script src="assets/js/custom/utilities/modals/create-campaign.js"></script>
<script src="assets/js/custom/utilities/modals/dual-listbox.js"></script>
<script src="assets/js/custom/utilities/modals/dual-listbox-create-campaign.js"></script>
<!--end::Custom Javascript-->
<!--end::Javascript-->