<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl" data-ncc-dashboard-page="queue-monitor">
        <div class="card mb-5 mb-xl-8">
            <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
                <div>
                    <h1 class="text-gray-900 fw-bold mb-2">Queue Monitor</h1>
                    <div class="text-muted fs-6">Live queue staffing and service pressure across NCC queues.</div>
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
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Logged In</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-queue-key="loggedInAgents">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Available</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-queue-key="availableAgents">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Working</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-queue-key="workingAgents">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Busy</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-queue-key="busyAgents">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Wrapup</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-queue-key="wrapupAgents">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">No Answer</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-queue-key="noAnswerAgents">0</div></div></div></div>
        </div>

        <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
            <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7">
                        <h3 class="card-title fw-bold text-gray-900">Filter Queues</h3>
                    </div>
                    <div class="card-body d-flex flex-column gap-5">
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">Media Type</label>
                            <select class="form-select form-select-solid" id="ncc_queue_filter_media" style="max-width: 260px;">
                                <option value="">All media types</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">Queue Focus</label>
                            <select class="form-select form-select-solid" id="ncc_queue_filter_focus" style="max-width: 260px;">
                                <option value="">All queues</option>
                                <option value="attention">Needs attention</option>
                                <option value="healthy">Healthy only</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">Staffing Drilldown</label>
                            <select class="form-select form-select-solid" id="ncc_queue_filter_staffing" style="max-width: 260px;">
                                <option value="">All staffing states</option>
                                <option value="loggedInAgents">Logged In</option>
                                <option value="availableAgents">Available</option>
                                <option value="workingAgents">Working</option>
                                <option value="busyAgents">Busy</option>
                                <option value="wrapupAgents">Wrapup</option>
                                <option value="noAnswerAgents">No Answer</option>
                            </select>
                        </div>
                        <div class="text-muted fs-8">Click a staffing chart slice to toggle the matching drilldown automatically.</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-9">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Queue Staffing Distribution</h3></div>
                    <div class="card-body"><div id="ncc_queue_staffing_chart" style="height: 340px;"></div></div>
                </div>
            </div>
        </div>

        <div class="card card-flush h-xl-100">
            <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Queue Details</h3></div>
            <div class="card-body pt-2">
                <div class="table-responsive">
                    <table class="table align-middle table-row-dashed fs-6 gy-3">
                        <thead>
                            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th>Queue</th>
                                <th>Workitems</th>
                                <th>Call</th>
                                <th>SMS</th>
                                <th>Chat</th>
                                <th>Available</th>
                                <th>Working</th>
                                <th>Busy</th>
                                <th>CMQT</th>
                                <th>Alarms</th>
                            </tr>
                        </thead>
                        <tbody id="ncc_queue_table_body" class="fw-semibold text-gray-700">
                            <tr><td colspan="10" class="text-center text-muted py-10">Waiting for queue data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Content-->