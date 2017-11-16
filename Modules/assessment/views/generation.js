console.log('debug generation.js');

if (typeof library_helper != "undefined")
    library_helper.type = 'generation_measures';
else
    var library_helper = new libraryHelper('generation_measures', $("#openbem"));

function generation_initUI() {
    if (data.generation.use_PV_calculator == 1) {
        $('#PV_calculator').show();
        $('input[key="data.generation.solar_annual_kwh"').hide();
        $('span#solar_annual_kwh').html(data.generation.solar_annual_kwh.toFixed(0)).show();
    }
    else {
        $('#PV_calculator').hide();
        $('input[key="data.generation.solar_annual_kwh"').show();
        $('span#solar_annual_kwh').hide();
    }

    if (data.measures.PV_generation != undefined) {
        $('[key="data.generation.use_PV_calculator"]').hide().append('See PV calculator');
        $('#solarpv_kwp_installed').html('<span key="data.generation.solarpv_kwp_installed" /> kWp');
        $('#PV_calculator_message').show();
    }
}

function generation_UpdateUI() {
    generation_initUI();
}

$('#openbem').on('change', '[key="data.generation.use_PV_calculator"]', function () {
    if (data.generation.use_PV_calculator == 1) {
        $('#PV_calculator').show(800);
        $('input[key="data.generation.solar_annual_kwh"').hide();
        $('span#solar_annual_kwh').html(data.generation.solar_annual_kwh.toFixed(0)).show();
    }
    else{
        $('#PV_calculator').hide(800);
        $('input[key="data.generation.solar_annual_kwh"').show();
        $('span#solar_annual_kwh').html(data.generation.solar_annual_kwh.toFixed(0)).hide();
    }
});



$('#openbem').on('click', '.apply-generation-measure-from-lib', function () {
    // Set variables in library_helper
    library_helper.init();

    // Prepare modal
    $('#apply-measure-generation-finish').hide('slow');
    $('#apply-measure-generation-modal .modal-body > div').hide('slow');
    // Populate selects in modal to choose library and measure
    var out = library_helper.get_list_of_libraries_for_select(library_helper.type);
    $("#apply-measure-generation-library-select").html(out);
    var library_id = $('#apply-measure-generation-library-select').val();
    out = library_helper.get_list_of_items_for_select(library_id);
    $('#apply-measure-generation-items-select').html(out);
    // Populate body of modal
    var tag = $('#apply-measure-generation-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-generation-modal .modal-body').html(out);
    $('#apply-measure-generation-library-item-selects').show();
    $('#apply-measure-generation-modal .modal-body').show();
    $('#apply-measure-generation-modal').modal('show');
});

$('#openbem').on('change', '#apply-measure-generation-library-select', function () {
    var library_id = $("#apply-measure-generation-library-select").val();
    out = library_helper.get_list_of_items_for_select(library_id);
    $('#apply-measure-generation-items-select').html(out);
    var tag = $('#apply-measure-generation-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-generation-modal .modal-body').html(out);
});

$('#openbem').on('change', '#apply-measure-generation-items-select', function () {
    var library_id = $("#apply-measure-generation-library-select").val();
    var tag = $('#apply-measure-generation-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-generation-modal .modal-body').html(out);
});

$('#openbem').on('click', '#apply-measure-generation-ok', function () {
    // The first time we apply a measure to an element we record its original stage
    if (data.measures.PV_generation == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.measures.PV_generation = {original_annual_generation: data.generation.solar_annual_kwh, measure: {}};
    }

    var measure = library_helper.generation_measures_get_item_to_save();
    for (var t in measure)
        var tag = t;
    measure[tag].tag = tag;
    data.measures.PV_generation.measure = measure[tag];
    data.measures.PV_generation.measure.quantity = measure[tag].kWp;
    data.measures.PV_generation.measure.cost_total = measure[tag].cost * measure[tag].kWp;

    // We copy over the kWp to the PV calculator, we show the calculator, we remove the checkbox so 
    // there is no other option than using the calculator and we disable the input for the kWp
    data.generation.solarpv_kwp_installed = measure[tag].kWp;
    $('#solarpv_kwp_installed').html('<span key="data.generation.solarpv_kwp_installed"> kWp');
    $('#PV_calculator').show();
    data.generation.use_PV_calculator = 1;
    $('[key="data.generation.use_PV_calculator"]').hide().append('See PV calculator');
    $('#PV_calculator_message').show();
    update();
    $('#apply-measure-generation-modal').modal('hide');
});
