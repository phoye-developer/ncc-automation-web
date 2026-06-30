<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container container-xxl" data-ncc-dashboard-page="live-workitems">
        <div class="card mb-5 mb-xl-8">
            <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
                <div>
                    <h1 class="text-gray-900 fw-bold mb-2">Live Workitems</h1>
                    <div class="text-muted fs-6">Realtime active workitems across all media types.</div>
                </div>
                <div class="d-flex flex-column align-items-md-end">
                    <span class="badge badge-light-warning fs-7 fw-bold mb-2" data-ncc-connection-status>Connecting...</span>
                    <div class="text-muted fs-8">Last update: <span data-ncc-last-update>Waiting for live data</span></div>
                    <div class="text-muted fs-8">Events received: <span data-ncc-event-count>0</span></div>
                </div>
            </div>
        </div>

        <div class="alert alert-warning d-flex align-items-center p-5 mb-5" data-ncc-inline-state>
            <i class="ki-outline ki-arrows-circle fs-2hx text-warning me-4"></i>
            <div class="d-flex flex-column">
                <span class="fw-semibold">Connecting...</span>
                <span class="fs-7 text-muted">Waiting for the first live supervisor stats message.</span>
            </div>
        </div>

        <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
            <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7">
                        <h3 class="card-title fw-bold text-gray-900">Filter Active Workitems</h3>
                    </div>
                    <div class="card-body d-flex flex-column gap-5">
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">Media Type</label>
                            <select class="form-select form-select-solid" id="ncc_workitems_filter_media" style="max-width: 260px;">
                                <option value="">All media types</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">State</label>
                            <select class="form-select form-select-solid" id="ncc_workitems_filter_state" style="max-width: 260px;">
                                <option value="">All states</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-9">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7">
                        <h3 class="card-title fw-bold text-gray-900">Workitems by Media</h3>
                    </div>
                    <div class="card-body">
                        <div id="ncc_live_media_chart" style="height: 340px;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-flush h-xl-100">
            <div class="card-header pt-7">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 w-100">
                    <h3 class="card-title fw-bold text-gray-900">Current Active Workitems</h3>
                    <div class="text-muted fs-7">Default sort: longest duration first</div>
                </div>
            </div>
            <div class="card-body pt-2">
                <div class="table-responsive">
                    <table class="table align-middle table-row-dashed fs-6 gy-3" id="ncc_live_workitems_table">
                        <thead>
                            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th>Type</th>
                                <th>Campaign</th>
                                <th>Queue</th>
                                <th>Agent</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Queue Time</th>
                                <th>Talk Time</th>
                                <th>Duration</th>
                                <th>Customer/Intent</th>
                            </tr>
                        </thead>
                        <tbody class="fw-semibold text-gray-700"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!--end::Content container-->
</div>
<!--end::Content-->