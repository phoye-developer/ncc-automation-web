<?php

$tenant_id = (isset($_COOKIE['tenantId'])) ? $_COOKIE['tenantId'] : 'Unknown';
$user_profile = (isset($_COOKIE['userProfile'])) ? $_COOKIE['userProfile'] : 'Unknown';

?>

<!--begin::Tenant info-->
<h1 class="page-heading d-flex flex-column justify-content-center text-gray-900 fw-bold fs-3 m-3">Tenant ID: <?= $tenant_id ?>, User Profile: <?= $user_profile ?></h1>
<!--end::Tenant info-->