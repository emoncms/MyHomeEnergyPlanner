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
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('Choose a measure from a library and <b>adjust the q50 value</b>');
            break;
        case 'ventilation_systems_measures':
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and depending on the Ventilation type adjust the other fields.</p>');
            break;
        case 'extract_ventilation_points':
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a type of measure.</p>');
            library_helper.item_id = $(this).attr('item_id');
            //$('[name=apply-measure-ventilation-what-to-do][value=remove]').click();
            break;
        case 'intentional_vents_and_flues_measures':
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            library_helper.item_id = $(this).attr('item_id');
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library and set the new <i>ventilation rate</i>.</p>');
            break;
        case 'add_extract_ventilation_points':
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library.</p>');
            break;
        case 'add_intentional_vents_and_flues':
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library.</p>');
            break;
        case 'add_CDF':
            $('#apply-measure-ventilation-what-to-do').hide();
            $('#apply-measure-ventilation-library-item-selects').show();
            $('#apply-measure-ventilation-modal .modal-body').show();
            $('#apply-measure-ventilation-modal #myModalIntroText').html('<p>Choose a measure from a library.</p>');
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
            break;
        case 'intentional_vents_and_flues_measures':
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
            break;
        case 'add_extract_ventilation_points':
            var measure = library_helper.extract_ventilation_points_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            measure[tag].id = get_EVP_max_id() + 1;
            measure[tag].location = '--';
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.ventilation.EVP.push(measure[tag]);
            if (data.measures.ventilation[library_helper.type][measure[tag].id] == undefined) { // first time
                data.measures.ventilation[library_helper.type][measure[tag].id] = {};
                data.measures.ventilation[library_helper.type][measure[tag].id].original = 'empty';
            }
            data.measures.ventilation[library_helper.type][measure[tag].id].measure = measure[tag];
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

function ventilation_initUI(){
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
        out += '<span class = "delete-EVP" row="' + z + '" style="cursor:pointer" title="Deleting an element this way is not considered a Measure" ><a> <i class="icon-trash" ></i></a></span></td></tr> ';
        $('#EVP').append(out);
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
    for (z in data.measures.ventilation.IVF) {
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