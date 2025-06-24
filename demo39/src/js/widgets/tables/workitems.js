"use strict";

// Class definition
var KTTablesWorkitems = function () {
    var table;
    var datatable;

    // Private methods
    const initDatatable = () => {

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            "lengthChange": false,
            'pageLength': 5,
            'ordering': false,
            'paging': true,
            'autoWidth': false
        });
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_workitems_table');

            if (!table) {
                return;
            }

            initDatatable();
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTTablesWorkitems;
}

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTTablesWorkitems.init();
});
