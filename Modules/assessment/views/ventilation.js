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
    if (v == 'PS')
        data.ventilation.number_of_intermittentfans = 0;
    if (ventilation_type == 'a' || ventilation_type == 'b' || ventilation_type == 'c') {
        data.ventilation.number_of_intermittentfans = 0;
        data.ventilation.number_of_passivevents = 0;
    }
    ventilation_initUI();

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
        case 'ventilation_systems_measures':
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and depending on the Ventilation type adjust the other fields.</p>');
            break;
        case 'extract_ventilation_points_measures':
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and depending on the number of fans to add.</p>');
            break;
        case 'intentional_vents_and_flues_measures':
            library_helper.item_id = $(this).attr('item_id');
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and set the new <i>ventilationn rate</i>.</p>');
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
            break;
        case 'ventilation_systems_measures':
            if (data.measures.ventilation[library_helper.type].original == undefined) // first time
                data.measures.ventilation[library_helper.type].original = data.ventilation.ventilation_type;
            var measure = library_helper.ventilation_systems_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
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
            }
            break;
        case 'extract_ventilation_points_measures':
            if (data.measures.ventilation[library_helper.type].original == undefined) // first time
                data.measures.ventilation[library_helper.type].original = data.ventilation.number_of_intermittentfans;
            var measure = library_helper.extract_ventilation_points_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            data.ventilation.number_of_intermittentfans += 1.0 * measure[tag].number_of_intermittentfans_to_add;
            data.measures.ventilation[library_helper.type].measure = measure[tag];
            break;
        case 'intentional_vents_and_flues_measures':
            var original_item = get_IVF_by_id(library_helper.item_id);
            var measure = library_helper.intentional_vents_and_flues_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            if (data.measures.ventilation[library_helper.type][library_helper.item_id] == undefined) { // first time
                data.measures.ventilation[library_helper.type][library_helper.item_id] = {};
                data.measures.ventilation[library_helper.type][library_helper.item_id].original_ventilation_rate = original_item.ventilation_rate;
            }
            for (z in original_item) {
                if (measure[tag][z] != undefined)
                    original_item[z] = measure[tag][z];
            }
            data.measures.ventilation[library_helper.type][library_helper.item_id].measure = measure[tag];
            break;
    }
    update();
    $('#apply-measure-ventilation-modal').modal('hide');
});
$('#openbem').on('click', '.add-IVF-from-lib', function () {
    library_helper.init();
    library_helper.type = 'intentional_vents_and_flues';
    library_helper.onAddItemFromLib();
});
$('#openbem').on('click', '.add-IVF', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    item.id = get_IVF_max_id() + 1;
    data.ventilation.IVF.push(item);
    update();
});
$('#openbem').on('click', '.delete-IVF', function () {
    var row = $(this).attr('row');
    data.ventilation.IVF.splice(row, 1);
    update();
});
$('#openbem').on('click', '.edit-item-IVF', function () {
    library_helper.type = 'intentional_vents_and_flues';
    library_helper.onEditItem($(this));
});

function ventilation_initUI()
{
    if (data.measures == undefined)
        data.measures = {};
    if (data.measures.ventilation == undefined)
        data.measures.ventilation = {};
    // Structural infiltration
    if (data.ventilation.air_permeability_test) {
        $("#structural").hide();
        $("#air_permeability_value_tbody").show();
    } else {
        $("#structural").show();
        $("#air_permeability_value_tbody").hide();
    }

    // Ventilation system
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
            $('#fans_and_vents_div').hide();
            break;
        case 'b':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            $('#fans_and_vents_div').hide();
            break;
        case 'c':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            $('#fans_and_vents_div').hide();
            break;
        case 'd':
            $("#system_air_change_rate_div").hide();
            $("#balanced_heat_recovery_efficiency_div").hide();
            $('#fans_and_vents_div').show();
            break;
    }

    // Intentional vents, flues and extraction points (IVF)
    $('#IVF').html('');
    for (z in data.ventilation.IVF) {
        var item = data.ventilation.IVF[z];
        var out = '<tr><td>' + item.tag + ': ' + item.name + '</td><td><input type="text" style="width: 190px" key="data.ventilation.IVF.' + z + '.location"></td><td>' + item.type + '</td><td style="padding-left:100px">' + item.ventilation_rate + '</td>';
        out += '<td> <button class="apply-ventilation-measure-from-lib if-not-master" type="intentional_vents_and_flues_measures" item_id="' + item.id + '" style="margin-right:25px">Apply Measure</button>'
        out += '<span class="edit-item-IVF" row="' + z + '" tag="' + item.tag + '" style="cursor:pointer; margin-right:15px" item=\'' + JSON.stringify(item) + '\' title="Editing a system this way is not considered a Measure"> <a><i class = "icon-edit"> </i></a></span>';
        out += '<span class = "delete-IVF" row="' + z + '" style="cursor:pointer" title="Deleting an element this way is not considered a Measure" ><a> <i class="icon-trash" ></i></a></span></td></tr> ';
        $('#IVF').append(out);
    }
}

function ventilation_UpdateUI() {
    ventilation_initUI();
}

function get_IVF_max_id() {
    var max_id = 0;
    // Find the max id
    for (z in data.ventilation.IVF) {
        if (data.ventilation.IVF[z].id != undefined && data.ventilation.IVF[z].id > max_id)
            max_id = data.ventilation.IVF[z].id;
    }
    for (z in data.measures.ventilation.IVF) {
        if (z > max_id)
            max_id = z;
    }
    return max_id;
}

function edit_item(item, index, item_subsystem) {
    for (z in item)
        item = item[z]; // item comes in the format: system = {electric:{bla bla bla}} and we transform it to: system = {bla bla bla}
    if (library_helper.type === 'intentional_vents_and_flues') {
        for (z in data.ventilation.IVF[index]) { // We copy over all the properties that are not asked when editting an system, like id or tag
            if (item[z] == undefined)
                item[z] = data.ventilation.IVF[index][z];
        }
        data.ventilation.IVF[index] = item;
    }
    update();
}

function get_IVF_by_id(item_id) {
    for (z in data.ventilation.IVF) {
        if (item_id == data.ventilation.IVF[z].id)
            return data.ventilation.IVF[z];
    }
}