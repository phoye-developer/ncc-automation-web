<?php

$tenant_id = (isset($_COOKIE['tenantId'])) ? $_COOKIE['tenantId'] : 'Unknown';

?>

<!--begin::Tenant info-->
<h1 class="page-heading d-flex flex-column justify-content-center text-gray-900 fw-bold fs-3 m-3">Tenant ID: <?= $tenant_id ?></h1>
<!--end::Tenant info-->