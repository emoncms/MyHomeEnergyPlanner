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

$('#openbem').on('click', '.apply-ventilation-measure-from-lib', function () {
    library_helper.init();
    library_helper.type = $(this).attr('type');
    $('#apply-measure-ventilation-finish').hide();
    $('#apply-measure-ventilation-modal .modal-body > div').hide();

    // Populate selects in modal to choose library and measure
    var out = library_helper.get_list_of_libraries_for_select(library_helper.type);
    $("#apply-measure-ventilation-library-select").html(out);
    var library_id = $('#apply-measure-ventilation-library-select').val();
    out = library_helper.get_list_of_items_for_select(library_id);
    $('#apply-measure-ventilation-items-select').html(out);

    // Populate body of modal
    var tag = $('#apply-measure-ventilation-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-ventilation-modal .modal-body').html(out);

    // Specific action for eact type of measure
    switch (library_helper.type) {
        case 'draught_proofing_measures':
            $('#apply-measure-ventilation-modal #myModalIntroText').html('Choose a measure from a library and <b>adjust the q50 value</b>');
            break;
        case('ventilation_systems_measures'):
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and depending on the Ventilation type adjust the other fields.</p>');
            break;
    }
    $('#apply-measure-ventilation-modal').modal('show');
});

$('#openbem').on('change', '#apply-measure-ventilation-library-select', function () {
    var library_id = $("#apply-measure-ventilation-library-select").val();
    out = library_helper.get_list_of_items_for_select(library_id);
    $('#apply-measure-ventilation-items-select').html(out);

    var tag = $('#apply-measure-ventilation-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-ventilation-modal .modal-body').html(out);
});

$('#openbem').on('change', '#apply-measure-ventilation-items-select', function () {
    var library_id = $("#apply-measure-ventilation-library-select").val();
    var tag = $('#apply-measure-ventilation-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-ventilation-modal .modal-body').html(out);
});

$('#openbem').on('click', '#apply-measure-ventilation-ok', function () {
    if (data.measures == undefined)
        data.measures = {};
    if (data.measures.ventilation == undefined)
        data.measures.ventilation = {};
    // The first time we apply a measure to an element we record its original stage
    if (data.measures.ventilation[library_helper.type] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.measures.ventilation[library_helper.type] = {};
    }
    switch (library_helper.type) {
        case 'draught_proofing_measures':
            if (data.measures.ventilation[library_helper.type].original_structural_infiltration == undefined) // first time
                data.measures.ventilation[library_helper.type].original_structural_infiltration = data.ventilation.structural_infiltration;
            var measure = library_helper.draught_proofing_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            data.ventilation.air_permeability_value = measure[tag].q50;
            update();
            data.measures.ventilation[library_helper.type].measure = measure[tag];
            data.measures.ventilation[library_helper.type].measure.structural_infiltration = data.ventilation.structural_infiltration_from_test;
            console.log(data.measures);
            break;
        case 'ventilation_systems_measures':
            if (data.measures.ventilation[library_helper.type].original == undefined) // first time
                data.measures.ventilation[library_helper.type].original = data.ventilation.ventilation_type;
            var measure = library_helper.ventilation_systems_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            console.log(data.ventilation);
            data.ventilation.ventilation_type = measure[tag].ventilation_type;
            data.ventilation.system_air_change_rate = measure[tag].system_air_change_rate;
            data.ventilation.balanced_heat_recovery_efficiency = measure[tag].balanced_heat_recovery_efficiency;
            for (z in {'number_of_intermittentfans': {}, 'number_of_passivevents': {}}) {
                measure[tag][z].replace(' ', '');
                if (measure[tag][z].charAt(0) === '+') {
                    var increment_in = 1.0 * measure[tag][z].slice(1);
                    if (!isNaN(increment_in))
                        data.ventilation[z] += increment_in;
                }
                else if (measure[tag][z].charAt(0) === '-') {
                    var decrement_in = 1.0 * measure[tag][z].slice(1);
                    if (!isNaN(decrement_in))
                        data.ventilation[z] -= decrement_in;
                }
                else if (measure[tag][z] == '') {
                    // Do nothing
                }
                else {
                    var new_value = 1.0 * measure[tag][z];
                    if (!isNaN(new_value))
                        data.ventilation[z] = new_value;
                }
                data.measures.ventilation[library_helper.type].measure = measure[tag];
                break;
            }
    }
    update();
    $('#apply-measure-ventilation-modal').modal('hide');
});
function ventilation_initUI()
{
    if (data.ventilation.air_permeability_test) {
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
function ventilation_UpdateUI() {
    ventilation_initUI();
}