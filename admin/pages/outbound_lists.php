<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl" data-ncc-dashboard-page="outbound-lists">
        <div class="card mb-5 mb-xl-8">
            <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
                <div>
                    <h1 class="text-gray-900 fw-bold mb-2">Outbound Lists</h1>
                    <div class="text-muted fs-6">Live outbound list completion, callbacks, and dialing readiness.</div>
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
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Lists</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-outbound-key="lists">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">In List</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-outbound-key="totalInList">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Completed</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-outbound-key="completed">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Callbacks</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-outbound-key="callbacks">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Not Dialed</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-outbound-key="notDialed">0</div></div></div></div>
            <div class="col-sm-6 col-xl-2"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Errors</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-outbound-key="dialerErrors">0</div></div></div></div>
        </div>

        <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
            <div class="col-xl-7">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Outbound Completion Mix</h3></div>
                    <div class="card-body"><div id="ncc_outbound_completion_chart" style="height: 340px;"></div></div>
                </div>
            </div>
            <div class="col-xl-5">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Top Outbound Lists</h3></div>
                    <div class="card-body"><div class="d-flex flex-column gap-4" id="ncc_outbound_top_list"></div></div>
                </div>
            </div>
        </div>

        <div class="card card-flush h-xl-100">
            <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Outbound List Details</h3></div>
            <div class="card-body pt-2">
                <div class="table-responsive">
                    <table class="table align-middle table-row-dashed fs-6 gy-3">
                        <thead>
                            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th>List</th>
                                <th>Active</th>
                                <th>Total In List</th>
                                <th>Completed</th>
                                <th>Done %</th>
                                <th>Callbacks</th>
                                <th>Callbacks Now</th>
                                <th>Not Dialed</th>
                                <th>Errors</th>
                            </tr>
                        </thead>
                        <tbody id="ncc_outbound_table_body" class="fw-semibold text-gray-700">
                            <tr><td colspan="9" class="text-center text-muted py-10">Waiting for outbound list data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Content-->