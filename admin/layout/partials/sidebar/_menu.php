<?php

$current_menu = (isset($_GET['menu'])) ? $_GET['menu'] : false;
$current_page = (isset($_GET['page'])) ? $_GET['page'] : false;

?>

<!--begin::Sidebar menu-->
<div id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false"
    class="app-sidebar-menu-primary menu menu-column menu-rounded menu-sub-indention menu-state-bullet-primary px-3 mb-5">
    <!--begin:Menu item-->
    <div data-kt-menu-trigger="click" class="menu-item menu-accordion"><!--begin:Menu link--><span class="menu-link"><span class="menu-icon"><i class="ki-outline ki-home-2 fs-2"></i></span><span class="menu-title">Dashboards</span><span class="menu-arrow"></span></span><!--end:Menu link--><!--begin:Menu sub-->
        <div class="menu-sub menu-sub-accordion <?php if (!$current_menu || $current_menu == "dashboards"): ?>show<?php endif; ?>"><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if (!$current_page): ?>active<?php endif; ?>" href="."><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Default</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
        </div><!--end:Menu sub-->
    </div><!--end:Menu item--><!--begin:Menu item-->
    <div data-kt-menu-trigger="click" class="menu-item menu-accordion"><!--begin:Menu link--><span class="menu-link"><span class="menu-icon"><i class="ki-outline ki-rocket fs-2"></i></span><span class="menu-title">Campaigns</span><span class="menu-arrow"></span></span><!--end:Menu link--><!--begin:Menu sub-->
        <div class="menu-sub menu-sub-accordion <?php if ($current_menu == "campaigns"): ?>show<?php endif; ?>"><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "export_campaign"): ?>active<?php endif; ?>" href="?menu=campaigns&page=export_campaign"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Export Campaign</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
            <div class="menu-item"><!--begin:Menu link--><a class="menu-link <?php if ($current_page == "import_campaign"): ?>active<?php endif; ?>" href="?menu=campaigns&page=import_campaign"><span class="menu-bullet"><span class="bullet bullet-dot"></span></span><span class="menu-title">Import Campaign</span></a><!--end:Menu link--></div><!--end:Menu item--><!--begin:Menu item-->
        </div><!--end:Menu sub-->
    </div><!--end:Menu item--><!--begin:Menu item-->
</div>
<!--end::Sidebar menu-->