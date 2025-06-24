<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container container-fluid">
        <!--begin::Card-->
        <div class="card">
            <!--begin::Card body-->
            <div class="card-body">
                <!--begin::Stepper-->
                <div class="stepper stepper-links d-flex flex-column pt-5" id="kt_import_campaign_stepper">
                    <!--begin::Nav-->
                    <div class="stepper-nav mb-5">
                        <!--begin::Step 1-->
                        <div class="stepper-item current" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">File</h3>
                        </div>
                        <!--end::Step 1-->
                        <!--begin::Step 2-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Objects</h3>
                        </div>
                        <!--end::Step 2-->
                        <!--begin::Step 3-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Review</h3>
                        </div>
                        <!--end::Step 3-->
                        <!--begin::Step 4-->
                        <div class="stepper-item" data-kt-stepper-element="nav">
                            <h3 class="stepper-title">Import</h3>
                        </div>
                        <!--end::Step 4-->
                    </div>
                    <!--end::Nav-->
                    <!--begin::Form-->
                    <form class="mx-auto mw-900px w-100 pt-5 pb-10" novalidate="novalidate" id="kt_import_campaign_form">
                        <!--begin::Step 1-->
                        <div class="current" data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-75 mx-auto">
                                <!--begin::Input group-->
                                <div class="fv-row mb-8">
                                    <input class="form-control" type="file" name="import_file" id="import_file">
                                    <div class="fs-7 fw-semibold text-muted m-3">.json file required</div>
                                </div>
                                <!--end::Input group-->
                            </div>
                            <!--end::Wrapper-->
                        </div>
                        <!--end::Step 1-->
                        <!--begin::Step 2-->
                        <div data-kt-stepper-element="content">
                            <!--begin::Wrapper-->
                            <div class="w-75 mx-auto">

                                <!--begin::Input group-->
                                <div class="mb-8">
                                    <!--begin::Label-->
                                    <div class="fs-6 fw-semibold mb-2">Objects</div>
                                    <!--end::Label-->
                                    <!--begin::Objects-->
                                    <div class="mh-300px scroll-y me-n7 pe-7">
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Business events</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="business_events">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Campaign goals</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="campaign_goals">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Campaign scripts</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="campaign_scripts">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Campaigns</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="campaigns">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Categories</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="categories">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Category summaries</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="category_summaries">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Classifications</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="classifications">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Dashboards</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="dashboards">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Dial plans</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="dial_plans">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Dispositions</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="dispositions">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Entities</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="entities">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Field mappings</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="field_mappings">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">File servers</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="file_servers">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Filters</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="filters">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Functions</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="functions">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Home tabs</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="home_tabs">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Music</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="music">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Partitions</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="partitions">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Prompts</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="prompts">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Queues</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="queues">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Reports</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="reports">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">REST calls</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="rest_calls">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Scorecards</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="scorecards">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Scripts</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="scripts">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Skills</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="skills">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">State DIDs</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="state_dids">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Survey themes</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="survey_themes">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Surveys</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="surveys">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Templates</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="templates">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Time events</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="time_events">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">User profiles</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="user_profiles">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">WhatsApp templates</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="whats_app_templates">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Widgets</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="widgets">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                        <!--begin::Object-->
                                        <div class="d-flex flex-stack py-4 border-bottom border-gray-300 border-bottom-dashed">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <div class="fs-5 fw-bold text-gray-900">Workflows</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Access menu-->
                                            <div class="ms-2 w-125px">
                                                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true" name="workflows">
                                                    <option value="ignore" selected="selected">Ignore</option>
                                                    <option value="create">Create</option>
                                                    <option value="update">Update</option>
                                                </select>
                                            </div>
                                            <!--end::Access menu-->
                                        </div>
                                        <!--end::Object-->
                                    </div>
                                    <!--end::Objects-->
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
                                                <div class="fs-6 text-gray-700">Please wait until the script below completes before clicking Submit.
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
                                        <textarea name="import_campaign_review_output" class="form-control form-control-lg form-control-solid output" rows="15" disabled></textarea>
                                        <!--end::Input-->
                                    </div>
                                    <!--end::Input group-->
                                </div>
                                <!--end::Body-->
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
                                        <textarea name="import_campaign_submit_output" class="form-control form-control-lg form-control-solid output" rows="15" disabled></textarea>
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
                        <div class="d-flex flex-stack pt-5">
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
                                <button type="button" class="btn btn-lg btn-primary me-3 d-none" data-kt-stepper-type="action" data-kt-stepper-action="review">
                                    <span class="indicator-label">Review
                                        <i class="ki-outline ki-arrow-right fs-3 ms-2 me-0"></i></span>
                                    <span class="indicator-progress">Please wait...
                                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                                </button>
                                <button type="button" class="btn btn-lg btn-primary d-inline-block" data-kt-stepper-action="next">Continue
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
<script src="assets/js/custom/utilities/modals/import-campaign.js"></script>
<!--end::Custom Javascript-->
<!--end::Javascript-->