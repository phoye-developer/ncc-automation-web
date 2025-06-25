<!DOCTYPE html>
<!--
Author: Nextiva, Inc.
Product Name: Nextiva Automation Tool Version: 1.0.0
Website: https://www.nextiva.com
Contact: phoye@nextiva.com
-->
<html lang="en">
<!--begin::Head-->

<head>
    <title>Nextiva Automation Tool</title>
    <meta charset="utf-8" />
    <meta name="description" content="A web-based application for provisioning Nextiva." />
    <meta name="keywords" content="Nextiva, contact center, provisioning" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Nextiva Automation Tool" />
    <meta property="og:url" content="https://nextiva.com" />
    <meta property="og:site_name" content="Nextiva Automation Tool" />
    <link rel="canonical" href="https://enterprise-demos.com/admin/?page=index" />
    <link rel="shortcut icon" href="assets/media/logos/favicon.ico" />
    <!--begin::Fonts(mandatory for all pages)-->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700" />
    <!--end::Fonts-->
    <!--begin::Vendor Stylesheets(used for this page only)-->
    <link href="assets/plugins/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugins/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />
    <!--end::Vendor Stylesheets-->
    <!--begin::Global Stylesheets-->
    <!--end::Global Stylesheets-->
    <!--begin::Global Stylesheets Bundle(mandatory for all pages)-->
    <link href="assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
    <!--end::Global Stylesheets Bundle-->
    <script>
        // Frame-busting to prevent site from being loaded within a frame without permission (click-jacking)
        if (window.top != window.self) {
            window.top.location.replace(window.self.location.href);
        }

        // Check if nccLocation and nccToken cookies exist
        let nccLocation = "";
        let nccToken = "";
        const cookies = decodeURIComponent(document.cookie).split(";").map(cookie => cookie.trim());
        cookies.forEach(cookie => {
            if (cookie.startsWith("nccLocation=")) {
                nccLocation = cookie.substring(12);
            } else if (cookie.startsWith("nccToken=")) {
                nccToken = cookie.substring(9);
            }
        });
        if (nccLocation === "" || nccToken === "") {
            window.location.href = "sign-in.php";
        }

        setInterval(() => {
            let success = false;
            const cookies = decodeURIComponent(document.cookie).split(";").map(cookie => cookie.trim());
            cookies.forEach(cookie => {
                if (
                    cookie.startsWith("nccLocation=") ||
                    cookie.startsWith("nccToken=")
                ) {
                    success = true;
                }
            });
            if (!success) {
                window.location.href = "sign-in.php";
            }
        }, 5000);
    </script>
</head>
<!--end::Head-->
<!--begin::Body-->

<body id="kt_app_body" data-kt-app-header-fixed="true" data-kt-app-header-fixed-mobile="true" data-kt-app-sidebar-enabled="true" data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-hoverable="true" data-kt-app-sidebar-push-toolbar="true" data-kt-app-sidebar-push-footer="true" class="app-default">
    <?php include 'partials/theme-mode/_init.php' ?>
    <?php include 'layout/_default.php' ?>
    <?php include 'partials/_scrolltop.php' ?>
    <!--begin::Javascript-->
    <script>
        var hostUrl = "assets/";
    </script>
    <!--begin::Global Javascript Bundle(mandatory for all pages)-->
    <script src="assets/plugins/global/plugins.bundle.js"></script>
    <script src="assets/js/scripts.bundle.js"></script>
    <!--end::Global Javascript Bundle-->
    <!--begin::Vendors Javascript(used for this page only)-->
    <script src="assets/plugins/custom/fullcalendar/fullcalendar.bundle.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/radar.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/map.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/continentsLow.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/usaLow.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/worldTimeZonesLow.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/worldTimeZoneAreasLow.js"></script>
    <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
    <!--end::Vendors Javascript-->
    <!--begin::Custom Javascript(used for this page only)-->
    <script src="assets/js/widgets.bundle.js"></script>
    <script src="assets/js/custom/widgets.js"></script>
    <script src="assets/js/custom/apps/chat/chat.js"></script>
    <script src="assets/js/custom/utilities/modals/upgrade-plan.js"></script>
    <script src="assets/js/custom/utilities/modals/users-search.js"></script>
    <script src="assets/plugins/custom/datatables/datatables.bundle.js"></script>
    <!--end::Custom Javascript-->
    <!--end::Javascript-->
</body>
<!--end::Body-->

</html>