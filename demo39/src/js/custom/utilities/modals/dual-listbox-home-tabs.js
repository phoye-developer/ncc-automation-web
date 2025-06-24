// Class definition
var KTDualListboxHomeTabs = function () {
    // Private functions
    var exportHomeTabs = function () {
        // Dual Listbox
        var $this = $('#kt_dual_listbox_home_tabs');

        // get options
        var options = [];
        $this.children('option').each(function () {
            var value = $(this).val();
            var label = $(this).text();
            options.push({
                text: label,
                value: value
            });
        });

        // init dual listbox
        var dualListBox = new DualListbox($this.get(0), {
            addEvent: function (value) {
                console.log(value);
            },
            removeEvent: function (value) {
                console.log(value);
            },
            availableTitle: 'Available home tabs',
            selectedTitle: 'Selected home tabs',
            addButtonText: 'Add',
            removeButtonText: 'Remove',
            addAllButtonText: 'Add All',
            removeAllButtonText: 'Remove All',
            options: options,
        });
    };

    return {
        // public functions
        init: function () {
            exportHomeTabs();
        },
    };
}();

jQuery(document).ready(function () {
    KTDualListboxHomeTabs.init();
});