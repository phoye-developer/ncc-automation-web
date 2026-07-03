<?php

$current_menu = (isset($_GET['menu'])) ? $_GET['menu'] : 'dashboards';
$current_page = (isset($_GET['page'])) ? $_GET['page'] : 'supervisor_overview';
$user_profile = (isset($_COOKIE['userProfile'])) ? $_COOKIE['userProfile'] : false;

?>

<!--begin::Sidebar menu-->
<div id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false"
    class="app-sidebar-menu-primary menu menu-column menu-rounded menu-sub-indention menu-state-bullet-primary px-3 mb-5">
    <!--begin:Menu item-->
    <div data-kt-menu-trigger="click" class="menu-item <?php if ($current_menu == "dashboards"): ?>here show <?php endif; ?>menu-accordion"><!--begin:Menu link--><span class="menu-link"><span class="menu-icon"><i class="ki-outline ki-home-2 fs-2"></i></span><span class="menu-title">Dashboards</span><span class="menu-arrow"></span></span><!--end:Menu link--><!--begin:Menu sub-->
        <div class="menu-sub menu-sub-accordion"><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "supervisor_overview"): ?>active<?php endif; ?>" href="?menu=dashboards&page=supervisor_overview"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Supervisor Overview</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "live_workitems"): ?>active<?php endif; ?>" href="?menu=dashboards&page=live_workitems"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Live Workitems</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "queue_monitor"): ?>active<?php endif; ?>" href="?menu=dashboards&page=queue_monitor"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Queue Monitor</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "agent_status"): ?>active<?php endif; ?>" href="?menu=dashboards&page=agent_status"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Agent Status</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "campaign_performance"): ?>active<?php endif; ?>" href="?menu=dashboards&page=campaign_performance"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Campaigns</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "outbound_lists"): ?>active<?php endif; ?>" href="?menu=dashboards&page=outbound_lists"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Outbound Lists</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
        </div><!--end:Menu sub-->
    </div>
    <!--end:Menu item-->

    <?php if ($user_profile == "Administrator") : ?>

        <!--begin:Menu item-->
        <div data-kt-menu-trigger="click" class="menu-item <?php if ($current_menu == "campaigns"): ?>here show <?php endif; ?>menu-accordion"><!--begin:Menu link--><span class="menu-link"><span class="menu-icon"><i class="ki-outline ki-rocket fs-2"></i></span><span class="menu-title">Campaigns</span><span class="menu-arrow"></span></span><!--end:Menu link--><!--begin:Menu sub-->
            <div class="menu-sub menu-sub-accordion"><!--begin:Menu item-->
                <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "export_campaign"): ?>active<?php endif; ?>" href="?menu=campaigns&page=export_campaign"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Export Campaign</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
                <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "import_campaign"): ?>active<?php endif; ?>" href="?menu=campaigns&page=import_campaign"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Import Campaign</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
            </div><!--end:Menu sub-->
        </div>
        <!--end:Menu item-->

    <?php endif; ?>

    <!--begin:Menu item-->
</div>
<!--end::Sidebar menu-->