"use strict";

// Class definition
var KTTablesWidget4 = function () {
    var table;
    var datatable;

    // Private methods
    const initDatatable = () => {

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            "lengthChange": false,
            'pageLength': 10,
            'ordering': false,
            'paging': true
        });
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_table_widget_4_table');

            if (!table) {
                return;
            }

            initDatatable();
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTTablesWidget4;
}

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTTablesWidget4.init();
});
