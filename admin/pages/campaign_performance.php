<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl" data-ncc-dashboard-page="campaign-performance">
        <div class="card mb-5 mb-xl-8">
            <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
                <div>
                    <h1 class="text-gray-900 fw-bold mb-2">Campaign Performance</h1>
                    <div class="text-muted fs-6">Live campaign completion, dialing progress, and media activity.</div>
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
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Active Campaigns</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-campaign-key="activeCampaigns">0</div></div></div></div>
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Completed Leads</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-campaign-key="completedLeads">0</div></div></div></div>
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Callbacks Due Now</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-campaign-key="callbacksNow">0</div></div></div></div>
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Dialer Errors</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-campaign-key="dialerErrors">0</div></div></div></div>
        </div>

        <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
            <div class="col-xl-7">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Campaign Completion Mix</h3></div>
                    <div class="card-body"><div id="ncc_campaign_completion_chart" style="height: 340px;"></div></div>
                </div>
            </div>
            <div class="col-xl-5">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Top Campaigns</h3></div>
                    <div class="card-body"><div class="d-flex flex-column gap-4" id="ncc_campaign_top_list"></div></div>
                </div>
            </div>
        </div>

        <div class="card card-flush h-xl-100">
            <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Campaign Details</h3></div>
            <div class="card-body pt-2">
                <div class="table-responsive">
                    <table class="table align-middle table-row-dashed fs-6 gy-3">
                        <thead>
                            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th>Campaign</th>
                                <th>Dial Ratio</th>
                                <th>Available Agents</th>
                                <th>Max Wait Time</th>
                                <th>Done %</th>
                                <th>Completed</th>
                                <th>Callbacks Now</th>
                                <th>Dialer Errors</th>
                            </tr>
                        </thead>
                        <tbody id="ncc_campaign_table_body" class="fw-semibold text-gray-700">
                            <tr><td colspan="8" class="text-center text-muted py-10">Waiting for campaign data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Content-->