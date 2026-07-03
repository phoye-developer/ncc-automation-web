<!--begin::Content-->
<div id="kt_app_content" class="app-content flex-column-fluid">
    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container container-xxl" data-ncc-dashboard-page="supervisor-overview">
        <div class="card mb-5 mb-xl-8">
            <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
                <div>
                    <h1 class="text-gray-900 fw-bold mb-2">Supervisor Overview</h1>
                    <div class="text-muted fs-6">Live supervisor statistics powered by NCC event relay.</div>
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
            <div class="col-sm-6 col-xl-4">
                <a href="?menu=dashboards&page=live_workitems" class="card card-flush h-100 border border-hover-primary" data-ncc-drilldown-link="active-workitems">
                    <div class="card-body">
                        <div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Active Workitems</div>
                        <div class="text-gray-900 fw-bolder fs-2hx" data-ncc-summary-key="activeWorkitems">0</div>
                        <div class="text-muted fs-7 mt-2">Open the full live queue for direct supervision.</div>
                    </div>
                </a>
            </div>
            <div class="col-sm-6 col-xl-4">
                <div class="card card-flush h-100">
                    <div class="card-body">
                        <div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Queues Requiring Attention</div>
                        <div class="text-gray-900 fw-bolder fs-2hx" data-ncc-summary-key="queuesRequiringAttention">0</div>
                        <div class="text-muted fs-7 mt-2">Active work with no available agents or active queue alarms.</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xl-4">
                <div class="card card-flush h-100">
                    <div class="card-body">
                        <div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Available Agents</div>
                        <div class="text-gray-900 fw-bolder fs-2hx" data-ncc-summary-key="availableAgents">0</div>
                        <div class="text-muted fs-7 mt-2">Summed from live queue staffing snapshots.</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xl-4">
                <div class="card card-flush h-100">
                    <div class="card-body">
                        <div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Busy / Working Agents</div>
                        <div class="text-gray-900 fw-bolder fs-2hx" data-ncc-summary-key="busyWorkingAgents">0</div>
                        <div class="text-muted fs-7 mt-2">Agents currently engaged across the live queue view.</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xl-4">
                <div class="card card-flush h-100">
                    <div class="card-body">
                        <div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Active Campaigns</div>
                        <div class="text-gray-900 fw-bolder fs-2hx" data-ncc-summary-key="activeCampaigns">0</div>
                        <div class="text-muted fs-7 mt-2">Campaigns currently represented in the active work stream.</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-xl-4">
                <div class="card card-flush h-100">
                    <div class="card-body">
                        <div class="text-gray-500 fs-7 text-uppercase fw-bold mb-2">Outbound Lists Near Completion</div>
                        <div class="text-gray-900 fw-bolder fs-2hx" data-ncc-summary-key="outboundListsNearCompletion">0</div>
                        <div class="text-muted fs-7 mt-2">Lists between 80% and 99% complete.</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
            <div class="col-xl-8">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7">
                        <h3 class="card-title fw-bold text-gray-900">Active Workitems by Media</h3>
                    </div>
                    <div class="card-body">
                        <div id="ncc_overview_media_chart" style="height: 340px;"></div>
                    </div>
                </div>
            </div>
            <div class="col-xl-4">
                <div class="card card-flush h-xl-100">
                    <div class="card-header pt-7">
                        <h3 class="card-title fw-bold text-gray-900">Top Active Campaigns</h3>
                    </div>
                    <div class="card-body">
                        <div class="d-flex flex-column gap-4" id="ncc_overview_campaigns"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-flush h-xl-100">
            <div class="card-header pt-7">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 w-100">
                    <h3 class="card-title fw-bold text-gray-900">Current Active Workitems</h3>
                    <a href="?menu=dashboards&page=live_workitems" class="btn btn-sm btn-light-primary">Open Live Workitems</a>
                </div>
            </div>
            <div class="card-body pt-2">
                <div class="table-responsive">
                    <table class="table align-middle table-row-dashed fs-6 gy-3">
                        <thead>
                            <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                <th>Type</th>
                                <th>Campaign</th>
                                <th>Agent</th>
                                <th>State</th>
                                <th>Duration</th>
                                <th>Alarm</th>
                            </tr>
                        </thead>
                        <tbody id="ncc_overview_workitems_body" class="fw-semibold text-gray-700">
                            <tr>
                                <td colspan="6" class="text-center text-muted py-10">Waiting for active workitems...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!--end::Content container-->
</div>
<!--end::Content-->