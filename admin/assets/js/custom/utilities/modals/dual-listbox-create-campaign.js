// Class definition
var KTDualListbox = function () {
    // Private functions
    var demo3 = function () {
        // Dual Listbox
        var $this = $('#kt_dual_listbox_3');

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
            availableTitle: 'Available dispositions',
            selectedTitle: 'Selected dispositions',
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
            demo3();
        },
    };
}();

jQuery(document).ready(function () {
    KTDualListbox.init();
});