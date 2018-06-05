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
    ventilation_initUI();

});
$("[key='data.ventilation.air_permeability_test']").change(function () {

    var val = $(this)[0].checked;
    if (val == true) {
        $("#structural").hide('slow');
        $("#air_permeability_value_tbody").show('slow');
    } else {
        $("#structural").show('slow');
        $("#air_permeability_value_tbody").hide('slow');
    }

});
$('#openbem').on('click', '.add-ventilation-system-from-lib', function () {
    library_helper.init();
    library_helper.type = 'ventilation_systems';
    library_helper.onAddItemFromLib();
});
$('#openbem').on('click', '.add-ventilation-system', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    data.ventilation.ventilation_type = item.ventilation_type;
    data.ventilation.ventilation_name = item.name;
    data.ventilation.ventilation_tag = tag;
    data.ventilation.system_air_change_rate = item.system_air_change_rate;
    data.ventilation.system_specific_fan_power = item.specific_fan_power;
    data.ventilation.balanced_heat_recovery_efficiency = item.balanced_heat_recovery_efficiency;
    update();
});
$('#openbem').on('click', '.apply-ventilation-measure-from-lib', function () {
    // Set variables in library_helper
    library_helper.init();
    library_helper.type_of_measure = $(this).attr('type');
    if (library_helper.type_of_measure == 'add_extract_ventilation_points')
        library_helper.type = 'extract_ventilation_points';
    else if (library_helper.type_of_measure == 'add_intentional_vents_and_flues')
        library_helper.type = 'intentional_vents_and_flues';
    else if (library_helper.type_of_measure == 'add_CDF')
        library_helper.type = 'clothes_drying_facilities';
    else if (library_helper.type_of_measure == 'bulk_measure_intentional_vents_and_flues')
        library_helper.type = 'intentional_vents_and_flues_measures';
    else
        library_helper.type = library_helper.type_of_measure;
    // Prepare modal
    $('#apply-measure-ventilation-finish').hide('slow');
    $('#apply-measure-ventilation-modal .modal-body > div').hide('slow');
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
    // Specific action for each type of measure
    switch (library_helper.type_of_measure) {
        case 'draught_proofing_measures':
            data.ventilation.air_permeability_test = true;
            $('#number-EVP-to-add').hide();
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('Choose a measure from a library and <b>adjust the q50 value</b>');
            break;
        case 'ventilation_systems_measures':
            $('#number-EVP-to-add').hide();
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and depending on the Ventilation type adjust the other fields.</p>');
            break;
        case 'extract_ventilation_points':
            $('#number-EVP-to-add').hide();
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a type of measure.</p>');
            library_helper.item_id = $(this).attr('item_id');
            //$('[name=apply-measure-ventilation-what-to-do][value=remove]').click();
            break;
        case 'bulk_measure_intentional_vents_and_flues':
            library_helper.item_ids = [];
            $('#number-EVP-to-add').hide();
            $('input.bulk-IVF:checked').each(function () {
                library_helper.item_ids.push($(this).attr('id'));
            });
            $('#apply-IVF-bulk-measure-modal').modal('hide');
        case 'intentional_vents_and_flues_measures':
            $('#number-EVP-to-add').hide();
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            library_helper.item_id = $(this).attr('item_id');
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and set the new <i>ventilation rate</i>.</p>');
            break;
        case 'add_extract_ventilation_points':
            $('#number-EVP-to-add').show();
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library.</p>');
            break;
        case 'add_intentional_vents_and_flues':
            $('#number-EVP-to-add').hide();
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library.</p>');
            break;
        case 'add_CDF':
            $('#number-EVP-to-add').hide();
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library.</p>');
            break;
    }
    $('#apply-measure-ventilation-modal').modal('show');
});
$('#openbem').on('click', '#apply-IVF-bulk-measure', function () {
    var out = '<table class="table" style="margin-left:15px">';
    out += '<tr><th><input type="checkbox" id="IVF-bulk-measure-check-all"></th><th>Name</th><th>Location</th><th>Type</th><th>Ventilation rate</th></tr>';
    data.ventilation.IVF.forEach(function (IVF, index) {
        out += '<tr><td><input type="checkbox" class="bulk-IVF" row="' + index + '" id="' + IVF.id + '"></td><td>' + IVF.name + '</td><td>' + IVF.location + '</td><td>' + IVF.type + '</td><td>' + IVF.ventilation_rate + '</td></tr>';
    });
    out += '</table>';
    $('#apply-IVF-bulk-measure-modal .modal-body').html(out);
    $('#apply-IVF-bulk-measure-modal').modal('show');
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
    switch (library_helper.type_of_measure) {
        case 'draught_proofing_measures':
            if (data.measures.ventilation[library_helper.type].original_structural_infiltration == undefined) // first time
                data.measures.ventilation[library_helper.type].original_structural_infiltration = data.ventilation.structural_infiltration;
            var measure = library_helper.draught_proofing_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            if (measure[tag].q50 < 0) // Draught lobby
                data.ventilation.air_permeability_value -= measure[tag].q50;
            else
                data.ventilation.air_permeability_value = measure[tag].q50;
            data.measures.ventilation[library_helper.type].measure = measure[tag];
            update();
            data.measures.ventilation[library_helper.type].measure.structural_infiltration = data.ventilation.structural_infiltration_from_test;
            update();
            $('#apply-measure-ventilation-modal').modal('hide');
            break;
        case 'ventilation_systems_measures':
            if (data.measures.ventilation[library_helper.type].original == undefined) // first time
                data.measures.ventilation[library_helper.type].original = data.ventilation.ventilation_type;
            var measure = library_helper.ventilation_systems_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.ventilation.ventilation_type = measure[tag].ventilation_type;
            data.ventilation.ventilation_name = measure[tag].name;
            data.ventilation.system_air_change_rate = measure[tag].system_air_change_rate;
            data.ventilation.balanced_heat_recovery_efficiency = measure[tag].balanced_heat_recovery_efficiency;
            data.ventilation.system_specific_fan_power = measure[tag].specific_fan_power;
            data.measures.ventilation[library_helper.type].measure = measure[tag];
            break;
        case 'extract_ventilation_points':
            apply_extract_ventilation_points();
            break;
        case 'bulk_measure_intentional_vents_and_flues':
            apply_bulk_measure_intentional_vents_and_flues();
            break;
        case 'intentional_vents_and_flues_measures':
            apply_measure_intentional_vents_and_flues();
            break;
        case 'add_extract_ventilation_points':
            apply_measure_add_extract_ventilation_points();
            break;
        case 'add_intentional_vents_and_flues':
            var measure = library_helper.intentional_vents_and_flues_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            measure[tag].id = get_IVF_max_id() + 1;
            measure[tag].location = '--';
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.ventilation.IVF.push(measure[tag]);
            if (data.measures.ventilation[library_helper.type][measure[tag].id] == undefined) { // first time
                data.measures.ventilation[library_helper.type][measure[tag].id] = {};
                data.measures.ventilation[library_helper.type][measure[tag].id].original = 'empty';
            }
            data.measures.ventilation[library_helper.type][measure[tag].id].measure = measure[tag];
            break;
        case 'add_CDF':
            var measure = library_helper.clothes_drying_facilities_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            measure[tag].id = get_CDF_max_id() + 1;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.ventilation.CDF.push(measure[tag]);
            if (data.measures.ventilation[library_helper.type][measure[tag].id] == undefined) { // first time
                data.measures.ventilation[library_helper.type][measure[tag].id] = {};
                data.measures.ventilation[library_helper.type][measure[tag].id].original = 'empty';
            }
            data.measures.ventilation[library_helper.type][measure[tag].id].measure = measure[tag];
            $('#apply-measure-ventilation-modal').modal('hide');
            break;
    }
    update();
    $('#apply-measure-ventilation-modal').modal('hide');
});
$('#openbem').on('click', '[name=apply-measure-ventilation-what-to-do]', function () {
    library_helper.what_to_do = $(this).val();
    switch (library_helper.what_to_do) {
        case 'remove':
            $('#apply-measure-ventilation-library-item-selects').hide('slow');
            $('#apply-measure-ventilation-modal .modal-body').hide('slow');
            break;
        case'replace':
            $('#apply-measure-ventilation-library-item-selects').show('slow');
            $('#apply-measure-ventilation-modal .modal-body').show('slow');
            break;
    }

});
$('#openbem').on('click', '.add-IVF-from-lib', function () {
    library_helper.init();
    library_helper.type = 'intentional_vents_and_flues';
    library_helper.onAddItemFromLib();
});
$('#openbem').on('click', '.add-EVP-from-lib', function () {
    library_helper.init();
    library_helper.type = 'extract_ventilation_points';
    library_helper.onAddItemFromLib();
});
$('#openbem').on('click', '.add-CDF-from-lib', function () {
    library_helper.init();
    library_helper.type = 'clothes_drying_facilities';
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
$('#openbem').on('click', '.add-EVP', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    item.id = get_EVP_max_id() + 1;
    data.ventilation.EVP.push(item);
    update();
});
$('#openbem').on('click', '.add-clothes-drying-facilities', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    item.id = get_CDF_max_id() + 1;
    data.ventilation.CDF.push(item);
    update();
});
$('#openbem').on('click', '.delete-IVF', function () {
    var row = $(this).attr('row');
    data.ventilation.IVF.splice(row, 1);
    update();
});
$('#openbem').on('click', '.delete-EVP', function () {
    var row = $(this).attr('row');
    data.ventilation.EVP.splice(row, 1);
    update();
});
$('#openbem').on('click', '.delete-CDF', function () {
    var row = $(this).attr('row');
    data.ventilation.CDF.splice(row, 1);
    update();
});
$('#openbem').on('click', '.edit-item-EVP', function () {
    library_helper.type = 'extract_ventilation_points';
    library_helper.onEditItem($(this));
});
$('#openbem').on('click', '.edit-item-IVF', function () {
    library_helper.type = 'intentional_vents_and_flues';
    library_helper.onEditItem($(this));
});
$('#openbem').on('click', '#IVF-bulk-measure-check-all', function () {
    if ($('#IVF-bulk-measure-check-all').prop('checked') === true)
        $('input.bulk-IVF').prop('checked', true);
    else
        $('input.bulk-IVF').prop('checked', false);
});

function ventilation_initUI() {
    if (data.measures == undefined)
        data.measures = {};
    if (data.measures.ventilation == undefined)
        data.measures.ventilation = {};
    // Structural infiltration
    if (data.ventilation.air_permeability_test) {
        $("#structural").hide('slow');
        $("#air_permeability_value_tbody").show('slow');
    } else {
        $("#structural").show('slow');
        $("#air_permeability_value_tbody").hide('slow');
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
            $(".system_air_change_rate_input").show('slow');
            $(".balanced_heat_recovery_efficiency_input").show('slow');
            $('#fans_and_vents_div').hide('slow');
            break;
        case 'b':
            $(".system_air_change_rate_input").show('slow');
            $(".balanced_heat_recovery_efficiency_input").hide('slow');
            $('#fans_and_vents_div').hide('slow');
            break;
        case 'c':
            $(".system_air_change_rate_input").show('slow');
            $(".balanced_heat_recovery_efficiency_input").hide('slow');
            $('#fans_and_vents_div').hide('slow');
            break;
        case 'd':
            $(".system_air_change_rate_input").hide('slow');
            $(".balanced_heat_recovery_efficiency_input").hide('slow');
            if (data.ventilation.ventilation_type == 'NV')
                $('#fans_and_vents_div').hide('slow');
            else
                $('#fans_and_vents_div').show('slow');
            break;
    }

    // Extract ventilation points (intermittent fans and passive vents) -EVP
    $('#EVP').html('');
    for (z in data.ventilation.EVP) {
        var item = data.ventilation.EVP[z];
        var out = '<tr><td>' + item.tag + ': ' + item.name + '</td><td><input type="text" style="width: 190px" key="data.ventilation.EVP.' + z + '.location"></td><td>' + item.type + '</td><td style="padding-left:100px">' + item.ventilation_rate + '</td>';
        out += '<td> <button class="apply-ventilation-measure-from-lib if-not-master" type="extract_ventilation_points" item_id="' + item.id + '" style="margin-right:25px">Apply Measure</button>'
        out += '<span class="edit-item-EVP" row="' + z + '" tag="' + item.tag + '" style="cursor:pointer; margin-right:15px" item=\'' + JSON.stringify(item) + '\' title="Editing a system this way is not considered a Measure"> <a><i class = "icon-edit"> </i></a></span>';
        out += '<span class = "delete-EVP" row="' + z + '" style="cursor:pointer" title="Deleting an element this way is not considered a Measure" ><a> <i class="icon-trash" ></i></a></span>';
        out += '<span class="revert-to-original" item-id="' + item.id + '" item-type="ventilation-EVP" style="margin-left:15px; display:inline-block;cursor: pointer"><img src="' + path + 'Modules/assessment/img-assets/undo.gif" style="width:14px" /><span class="text" /></span>';
        out += '</td></tr> ';
        $('#EVP').append(out);
        init_revert_to_original_by_id('#fans_and_vents_div #EVP', item.id, 'ventilation-EVP');
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

    // Clothes drying facilities (CDF)
    $('#CDF').html('');
    for (z in data.ventilation.CDF) {
        var item = data.ventilation.CDF[z];
        var out = '<tr><td style="padding-left:75px;width:5px;border:none"><span class = "delete-CDF" row="' + z + '" style="cursor:pointer" title="Deleting an element this way is not considered a Measure" ><a> <i class="icon-trash" ></i></a></span></td>'
        out += '<td>' + item.tag + ': ' + item.name + '</td></tr>';
        $('#CDF').append(out);
    }

    // Darught proofing measure applied
    if (data.measures.ventilation['draught_proofing_measures'] != undefined)
        $('#draught-proofing_measure-applied').html('Measure applied: ' + data.measures.ventilation['draught_proofing_measures'].measure.name);

    show_hide_if_master();
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
    for (z in data.measures.ventilation.intentional_vents_and_flues_measures) {
        if (z > max_id)
            max_id = z;
    }
    return max_id;
}

function get_EVP_max_id() {
    var max_id = 0;
    // Find the max id
    for (z in data.ventilation.EVP) {
        if (data.ventilation.EVP[z].id != undefined && data.ventilation.EVP[z].id > max_id)
            max_id = data.ventilation.EVP[z].id;
    }
    for (z in data.measures.ventilation.EVP) {
        if (z > max_id)
            max_id = z;
    }
    return max_id;
}

function get_CDF_max_id() {
    var max_id = 0;
    // Find the max id
    for (z in data.ventilation.CDF) {
        if (data.ventilation.CDF[z].id != undefined && data.ventilation.CDF[z].id > max_id)
            max_id = data.ventilation.CDF[z].id;
    }
    for (z in data.measures.ventilation.CDF) {
        if (z > max_id)
            max_id = z;
    }
    return max_id;
}

function edit_item(item, index, item_subsystem) {
    for (z in item)
        item = item[z]; // item comes in the format: system = {electric:{bla bla bla}} and we transform it to: system = {bla bla bla}

    var object = '';
    if (library_helper.type === 'intentional_vents_and_flues')
        object = 'IVF';
    if (library_helper.type === 'extract_ventilation_points')
        object = 'EVP';

    for (z in data.ventilation[object][index]) { // We copy over all the properties that are not asked when editting an system, like id or tag
        if (item[z] == undefined)
            item[z] = data.ventilation[object][index][z];
    }

    data.ventilation[object][index] = item;
    update();
}

function get_IVF_by_id(item_id) {
    for (z in data.ventilation.IVF) {
        if (item_id == data.ventilation.IVF[z].id) {
            data.ventilation.IVF[z].row = z;
            return data.ventilation.IVF[z];
        }
    }
}

function get_EVP_by_id(item_id) {
    for (z in data.ventilation.EVP) {
        if (item_id == data.ventilation.EVP[z].id) {
            data.ventilation.EVP[z].row = z;
            return data.ventilation.EVP[z];
        }
    }
}

function apply_measure_intentional_vents_and_flues() {
    var original_item = get_IVF_by_id(library_helper.item_id);
    var measure = library_helper.intentional_vents_and_flues_measures_get_item_to_save();
    for (z in measure)
        var tag = z;
    measure[tag].tag = tag;
    if (data.measures.ventilation[library_helper.type][library_helper.item_id] == undefined) { // first time
        data.measures.ventilation[library_helper.type][library_helper.item_id] = {};
        data.measures.ventilation[library_helper.type][library_helper.item_id].original = original_item;
    }
    for (z in original_item) {
        if (measure[tag][z] == undefined)
            measure[tag][z] = original_item[z];
    }
    add_quantity_and_cost_to_measure(measure[tag]);
    // Update data object and add measure
    data.ventilation.IVF[original_item.row] = measure[tag];
    data.measures.ventilation[library_helper.type][library_helper.item_id].measure = measure[tag];

    // Cjeck if a measure was already applied to this element in a bulk measure
    for (var measure_id in data.measures.ventilation.intentional_vents_and_flues_measures) {
        var old_measure = data.measures.ventilation.intentional_vents_and_flues_measures[measure_id];
        if (old_measure.original_elements != undefined)  // this is a bulk measure, we need to look inside
            check_and_delete_element_from_bulk_measure_IVF(original_item.id, measure_id);
    }
}

function apply_bulk_measure_intentional_vents_and_flues() {
    var original_elements = {};
    var total_cost = 0;
    var measure = library_helper.intentional_vents_and_flues_measures_get_item_to_save();
    for (z in measure)
        var tag = z;
    measure[tag].tag = tag;
    measure[tag].quantity = 0;
    measure[tag].cost_total = 0;

    // Iterate all the items we want to apply the measure to in order to delete previous meaasures applied to them and apply the new measure
    library_helper.item_ids.forEach(function (id) {
        var original_item = get_IVF_by_id(id);
        original_elements[id] = original_item;
        // Replace original item with the measure
        for (z in measure[tag])
            data.ventilation.IVF[original_item.row][z] = measure[tag][z];
        // Check if there is already a measure applied to the element, if so delete it
        if (data.measures.ventilation.intentional_vents_and_flues_measures != undefined) {
            for (var measure_id in data.measures.ventilation.intentional_vents_and_flues_measures) {
                var old_measure = data.measures.ventilation.intentional_vents_and_flues_measures[measure_id];
                if (measure_id == id) // A measure was applied to this element
                    delete (data.measures.ventilation.intentional_vents_and_flues_measures[measure_id]);
                else if (old_measure.original_elements != undefined) { // this is a bulk measure, we need to look inside
                    check_and_delete_element_from_bulk_measure_IVF(id, measure_id);
                }
            }
        }
        // Add cost to measure
        measure[tag].quantity++;
        measure[tag].cost_total += 1.0 * measure[tag].cost;
    });
    // Save measure
    var measure_id = 1 + 1.0 * get_IVF_max_id();
    data.measures.ventilation.intentional_vents_and_flues_measures[measure_id] = {original_elements: original_elements, measure: measure[tag]};
}

function apply_extract_ventilation_points() {
    var original_item = get_EVP_by_id(library_helper.item_id);
    if (data.measures.ventilation[library_helper.type][library_helper.item_id] == undefined) { // first time
        data.measures.ventilation[library_helper.type][library_helper.item_id] = {};
        data.measures.ventilation[library_helper.type][library_helper.item_id].original = original_item;
    }
    var measure = library_helper.extract_ventilation_points_get_item_to_save();
    for (z in measure)
        var tag = z;
    measure[tag].tag = tag;
    for (z in original_item) {
        if (measure[tag][z] == undefined)
            measure[tag][z] = original_item[z];
    }
    add_quantity_and_cost_to_measure(measure[tag]);
    // Update data object and add measure
    data.ventilation.EVP[original_item.row] = measure[tag];
    data.measures.ventilation[library_helper.type][library_helper.item_id].measure = measure[tag];
}

function apply_measure_add_extract_ventilation_points() {
    // How many EVPs to add
    var n_to_add = $('#number-EVP-to-add input').val();

    // Fetch measure
    var single_measure = library_helper.extract_ventilation_points_get_item_to_save();
    for (var z in single_measure)
        var tag = z;
    single_measure[tag].tag = tag;
    add_quantity_and_cost_to_measure(single_measure[tag]);

    // Add EVP and save measure
    if (n_to_add == 1) {
        single_measure[tag].id = get_EVP_max_id() + 1;
        data.ventilation.EVP.push(single_measure[tag]);
        var measure = single_measure;
    }
    else {
        var measure = single_measure;
        var original_elements = {};
        measure[tag].original_elements = {};
        for (i = 0; i < n_to_add; i++) {
            var EVP = single_measure[tag];
            EVP.id = get_EVP_max_id() + 1;
            EVP.location = '--';
            data.ventilation.EVP.push(EVP);
            original_elements[EVP.id] = 'empty';
        }
        measure[tag].id = get_EVP_max_id() + 1;
        measure[tag].location = '--';
        measure[tag].quantity = n_to_add;
        measure[tag].cost_total = n_to_add * single_measure[tag].cost_total;
    }
    if (data.measures.ventilation[library_helper.type][measure[tag].id] == undefined) { // first time
        data.measures.ventilation[library_helper.type][measure[tag].id] = {};
    }
    data.measures.ventilation[library_helper.type][measure[tag].id].measure = measure[tag];
    if (n_to_add == 1)
        data.measures.ventilation[library_helper.type][measure[tag].id].original = 'empty';
    else
        data.measures.ventilation[library_helper.type][measure[tag].id].original_elements = original_elements;
}

function check_and_delete_element_from_bulk_measure_IVF(IVF_id, measure_id) {
    var old_measure = data.measures.ventilation.intentional_vents_and_flues_measures[measure_id];
    if (old_measure.original_elements[IVF_id] != undefined) {
        delete(old_measure.original_elements[IVF_id]);
        if (Object.keys(old_measure.original_elements).length == 0)
            delete(data.measures.ventilation.intentional_vents_and_flues_measures[measure_id]);
        // Recalculate cost of the old bulk measure
        old_measure.measure.quantity = Object.keys(old_measure.original_elements).length;
        old_measure.measure.cost_total = old_measure.measure.cost * old_measure.measure.quantity;
    }
}