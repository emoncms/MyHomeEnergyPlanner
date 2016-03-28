console.log('Debug ventilation.js');

if (typeof library_helper != "undefined")
    library_helper.type = 'systems';
else
    var library_helper = new libraryHelper('systems', $("#openbem"));

$("[key='data.ventilation.ventilation_type']").change(function () {

    var v = $(this).val();
    var ventilation_type;
    switch (v)
    {
        case 'NV':
        case 'IE':
        case 'PS':
            ventilation_type = 'd'; // Natural ventilation or whole house positive input ventilation from loft'
            break;
        case 'DEV':
        case 'MEV':
            ventilation_type = 'c'; // Whole house extract ventilation or positive input ventilation from outside
            break;
        case 'MV':
            ventilation_type = 'b'; // Balanced mechanical ventilation without heat recovery (MV)
            break;
        case 'MVHR':
            ventilation_type = 'a'; //Balanced mechanical ventilation with heat recovery (MVHR)
            break;
    }
    switch (ventilation_type)
    {
        case 'a':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").show();
            break;
        case 'b':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'c':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'd':
            $("#system_air_change_rate_div").hide();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
    }

});

$("[key='data.ventilation.air_permeability_test']").change(function () {

    var val = $(this)[0].checked;

    if (val == true) {
        $("#structural").hide();
        $("#air_permeability_value_tbody").show();
    } else {
        $("#structural").show();
        $("#air_permeability_value_tbody").hide();
    }

});

$('#openbem').on('click', '.apply-ventilation-measure', function () {
    library_helper.init();
    $('#apply-measure-ventilation-finish').hide();
    $('#apply-measure-ventilation-modal .modal-body > div').hide();

    switch ($(this).attr('type')) {
        case 'draught-proofing':
            $('#apply-measure-ventilation-modal #myModalIntroText').html('Choose a measure from a library and <b>adjust the q50 value</b>');

            var out = library_helper.get_list_of_libraries_for_select('draught_proofing_measures');
            $("#apply-measure-draught-proofing-from-lib").html(out);

            var library_id = $('#apply-measure-draught-proofing-from-lib').val();
            out = library_helper.get_list_of_items_for_select(library_id);
            $('#apply-measure-draught-proofing-lib-items').html(out);

            var tag = $('#apply-measure-draught-proofing-lib-items').val();
            out = library_helper.draught_proofing_measures_item_to_html(library_helper.get_library_by_id(library_id).data[tag], tag);
            $('#apply-measure-draught-proofing-item-fields').html(out);

            $('#apply-measure-draught-proofing').show();
            break;
    }
    $('#apply-measure-ventilation-ok').attr('type', $(this).attr('type'));
    $('#apply-measure-ventilation-modal').modal('show');
});

$('#openbem').on('change', '#apply-measure-draught-proofing-from-lib', function () {
    var library_id = $("#apply-measure-draught-proofing-from-lib").val();
    out = library_helper.get_list_of_items_for_select(library_id);
    $('#apply-measure-draught-proofing-lib-items').html(out);

    var tag = $('#apply-measure-draught-proofing-lib-items').val();
    out = library_helper.draught_proofing_measures_item_to_html(library_helper.get_library_by_id(library_id).data[tag], tag);
    $('#apply-measure-draught-proofing-item-fields').html(out);

});

$('#openbem').on('change', '#apply-measure-draught-proofing-lib-items', function () {
    var library_id = $("#apply-measure-draught-proofing-from-lib").val();
    var tag = $('#apply-measure-draught-proofing-lib-items').val();

    console.log(library_helper.get_library_by_id(library_id).data[tag]);
    console.log(tag);
    out = library_helper.draught_proofing_measures_item_to_html(library_helper.get_library_by_id(library_id).data[tag], tag);
    $('#apply-measure-draught-proofing-item-fields').html(out);
});

$('#openbem').on('click', '#apply-measure-ventilation-ok', function () {
    type_of_measure = $(this).attr('type');

    if (data.measures == undefined)
        data.measures = {};
    if (data.measures.ventilation == undefined)
        data.measures.ventilation = {};

    // The first time we apply a measure to an element we record its original stage
    if (data.measures.ventilation[type_of_measure] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.measures.ventilation[type_of_measure] = {};
    }
    switch (type_of_measure) {
        case 'draught-proofing':
            if (data.measures.ventilation[type_of_measure].original_structural_infiltration == undefined) // first time
                data.measures.ventilation[type_of_measure].original_structural_infiltration = data.ventilation.structural_infiltration;

            var measure = library_helper.draught_proofing_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure.tag = tag;
            data.ventilation.air_permeability_value = measure[tag].q50;
            update();
            data.measures.ventilation[type_of_measure].measure = measure[tag];
            data.measures.ventilation[type_of_measure].measure.structural_infiltration = data.ventilation.structural_infiltration_from_test;
            console.log(data.measures);
            break;
    }
    $('#apply-measure-ventilation-modal').modal('hide');
});

function ventilation_initUI()
{
    if (data.ventilation.air_permeability_test)
    {
        $("#structural").hide();
        $("#air_permeability_value_tbody").show();
    } else {
        $("#structural").show();
        $("#air_permeability_value_tbody").hide();
    }

    var ventilation_type;
    switch (data.ventilation.ventilation_type)
    {
        case 'NV':
        case 'IE':
        case 'PS':
            ventilation_type = 'd'; // Natural ventilation or whole house positive input ventilation from loft'
            break;
        case 'DEV':
        case'MEV':
            ventilation_type = 'c'; // Whole house extract ventilation or positive input ventilation from outside
            break;
        case 'MV':
            ventilation_type = 'b'; // Balanced mechanical ventilation without heat recovery (MV)
            break;
        case 'MVHR':
            ventilation_type = 'a'; //Balanced mechanical ventilation with heat recovery (MVHR)
            break;
        default: // this one will be the case the firs time an assesment is run after changing the types 21-03-16
            data.ventilation.ventilation_type = 'NV';
            ventilation_type = 'd';
            break;
    }
    switch (ventilation_type)
    {
        case 'a':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").show();
            break;
        case 'b':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'c':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'd':
            $("#system_air_change_rate_div").hide();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
    }
}
