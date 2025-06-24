<!--begin::Sidebar-->
<div id="kt_app_sidebar" class="app-sidebar  flex-column "
	data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
	<!--begin::Wrapper-->
	<div class="app-sidebar-wrapper">
		<div
			id="kt_app_sidebar_wrapper"
			class="hover-scroll-y my-5 my-lg-2 mx-4"
			data-kt-scroll="true"
			data-kt-scroll-activate="{default: false, lg: true}"
			data-kt-scroll-height="auto"
			data-kt-scroll-dependencies="#kt_app_header"
			data-kt-scroll-wrappers="#kt_app_sidebar_wrapper"
			data-kt-scroll-offset="5px">
			<?php include 'layout/partials/sidebar/_menu.php' ?>
		</div>
	</div>
	<!--end::Wrapper-->
</div>
<!--end::Sidebar-->