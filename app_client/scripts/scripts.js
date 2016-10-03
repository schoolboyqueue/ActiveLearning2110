$(document).ready(function() {
    $('#new_item').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            item_level: {
                validators: {
                    notEmpty: {
                        message: 'The item level is required and cannot be empty'
                    }
                }
            },
            armor_value: {
                validators: {
                    notEmpty: {
                        message: 'The armor value is required and cannot be empty'
                    }
                }
            },
            mainStat_Value: {
                validators: {
                    notEmpty: {
                        message: 'The main stat value is required and cannot be empty'
                    }
                }
            } /* <-- removed comma */
        } /* added closing brace */
    });
});
$('.clear-database').on('click', function(e) {
    e.preventDefault();

    var id = $(this).data('id');
    $('#database-clear').data('id', id).modal('show');
});