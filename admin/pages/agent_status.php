<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl" data-ncc-dashboard-page="agent-status">
        <div class="card mb-5 mb-xl-8">
            <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
                <div>
                    <h1 class="text-gray-900 fw-bold mb-2">Agent Status</h1>
                    <div class="text-muted fs-6">Live agent presence, channel load, and quality indicators.</div>
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
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Logged In Agents</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-agent-key="loggedIn">0</div></div></div></div>
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Working Agents</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-agent-key="working">0</div></div></div></div>
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Available Agents</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-agent-key="available">0</div></div></div></div>
            <div class="col-sm-6 col-xl-3"><div class="card card-flush h-100"><div class="card-body"><div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Quality Alerts</div><div class="text-gray-900 fw-bolder fs-2hx" data-ncc-agent-key="qualityAlerts">0</div></div></div></div>
        </div>

        <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
            <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Filter Agents</h3></div>
                    <div class="card-body d-flex flex-column gap-5">
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">Status</label>
                            <select class="form-select form-select-solid" id="ncc_agent_filter_status" style="max-width: 260px;">
                                <option value="">All statuses</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">Quality</label>
                            <select class="form-select form-select-solid" id="ncc_agent_filter_quality" style="max-width: 260px;">
                                <option value="">All agents</option>
                                <option value="flagged">Quality alerts only</option>
                                <option value="clean">No quality alerts</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-gray-700 fw-semibold fs-7 text-uppercase">Channel</label>
                            <select class="form-select form-select-solid" id="ncc_agent_filter_channel" style="max-width: 260px;">
                                <option value="">All channels</option>
                            </select>
                        </div>
                        <div class="text-muted fs-8">Click a status chart slice to toggle that status as an agent drilldown.</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-6">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Agent Status Distribution</h3></div>
                    <div class="card-body"><div id="ncc_agent_status_chart" style="height: 340px;"></div></div>
                </div>
            </div>
            <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Agents Requiring Attention</h3></div>
                    <div class="card-body"><div class="d-flex flex-column gap-4" id="ncc_agent_attention_list"></div></div>
                </div>
            </div>
        </div>

        <div class="card card-flush h-xl-100">
            <div class="card-header pt-7"><h3 class="card-title fw-bold text-gray-900">Agent Details</h3></div>
            <div class="card-body pt-2">
                <div class="table-responsive">
                    <table class="table align-middle table-row-dashed fs-6 gy-3">
                        <thead>
                            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th>Agent</th>
                                <th>Group</th>
                                <th>Derived Status</th>
                                <th>Status Duration</th>
                                <th>Channel</th>
                                <th>Quality Flags</th>
                                <th>Login Time</th>
                            </tr>
                        </thead>
                        <tbody id="ncc_agent_table_body" class="fw-semibold text-gray-700">
                            <tr><td colspan="7" class="text-center text-muted py-10">Waiting for agent data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<!--end::Content-->