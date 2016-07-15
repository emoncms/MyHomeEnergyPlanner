console.log("debug heating.js");

if (typeof library_helper != "undefined")
    library_helper.type = 'water_usage';
else
    var library_helper = new libraryHelper('systems', $("#openbem"));

function heating_UpdateUI()
{
    add_water_usage();

    if (data.water_heating.override_annual_energy_content)
        $('#annual_energy_content').html('<input type="text"  dp=0 style="width:35px; margin-right:10px" key="data.water_heating.annual_energy_content" /> kWh/year');
    else
        $('#annual_energy_content').html('<span key="data.water_heating.annual_energy_content" dp=0></span>  kWh/year');

    show_hide_if_master();
}

function heating_initUI() {
    // Measures
    if (data.measures == undefined)
        data.measures = {};
    if (data.measures.water_heating == undefined)
        data.measures.water_heating = {};

    // Water heating
    add_water_usage(); // water efficiency

    $('#solarhotwater-link').prop('href', 'view?id=' + p.id + '#' + scenario + '/solarhotwater');
    
    // Space heating
    
    
    show_hide_if_master();
}


$('#openbem').on('click', '[key="data.water_heating.solar_water_heating"]', function () {
    data.use_SHW = !data.water_heating.solar_water_heating; // I don't know why but only works properly coping the negative
});

$('#openbem').on('click', '.add-water-efficiency-from-lib', function () {
    library_helper.init();
    library_helper.type = 'water_usage';
    library_helper.onAddItemFromLib();
});
$('#openbem').on('click', '.add-water_usage', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    item.id = get_WU_max_id(data.water_heating.water_usage) + 1;
    data.water_heating.water_usage.push(item);
    update();
});
$('#openbem').on('click', '.delete-water-usage', function () {
    var row = $(this).attr('row');
    data.water_heating.water_usage.splice(row, 1);
    update();
});
$('#openbem').on('click', '.edit-item-water-usage', function () {
    library_helper.type = 'water_usage';
    library_helper.onEditItem($(this));
});

$('#openbem').on('click', '.apply-water-heating-measure', function () {
    // Set variables in library_helper
    library_helper.init();
    library_helper.type_of_measure = $(this).attr('type');
    if (library_helper.type_of_measure == 'water_usage')
        library_helper.type = 'water_usage';
    if (library_helper.type_of_measure == 'storage_type')
        library_helper.type = 'storage_type';
    if (library_helper.type_of_measure == 'pipework_insulation')
        library_helper.type = 'storage_type'; // we do this assingment in order to not break the populationn of the library selects in the modal
    else
        library_helper.type = library_helper.type_of_measure;
    // Prepare modal
    $('#apply-measure-water-heating-finish').hide();
    $('#apply-measure-water-heating-modal .modal-body > div').hide();
    // Populate selects in modal to choose library and measure
    var out = library_helper.get_list_of_libraries_for_select(library_helper.type);
    $("#apply-measure-water-heating-library-select").html(out);
    var library_id = $('#apply-measure-water-heating-library-select').val();
    out = library_helper.get_list_of_items_for_select(library_id);
    $('#apply-measure-water-heating-items-select').html(out);
    // Populate body of modal
    var tag = $('#apply-measure-water-heating-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-water-heating-modal .modal-body').html(out);
    // Specific action for each type of measure
    switch (library_helper.type_of_measure) {
        case 'water_usage':
            $('#apply-measure-water-heating-what-to-do').hide();
            $('#apply-measure-water-heating-library-item-selects').show();
            $('#apply-measure-water-heating-modal .modal-body').show();
            $('#apply-measure-water-heating-pipework-insulation').hide();
            $('#apply-measure-water-heating-modal #myModalIntroText').html('Choose a measure from a library');
            break;
        case 'storage_type':
            $('#apply-measure-water-heating-what-to-do').hide();
            $('#apply-measure-water-heating-library-item-selects').show();
            $('#apply-measure-water-heating-modal .modal-body').show();
            $('#apply-measure-water-heating-pipework-insulation').hide();
            $('#apply-measure-water-heating-modal #myModalIntroText').html('Choose a measure from a library');
            break;
        case 'pipework_insulation':
            $('#apply-measure-water-heating-pipework-insulation select').val(data.water_heating.pipework_insulation);
            $('#apply-measure-water-heating-what-to-do').hide();
            $('#apply-measure-water-heating-library-item-selects').hide();
            $('#apply-measure-water-heating-modal .modal-body').hide();
            $('#apply-measure-water-heating-pipework-insulation').show();
            $('#apply-measure-water-heating-modal #myModalIntroText').html('Choose a measure from the drop down');
            break;
    }
    $('#apply-measure-water-heating-modal').modal('show');
});
$('#openbem').on('change', '#apply-measure-water-heating-library-select', function () {
    var library_id = $("#apply-measure-water-heating-library-select").val();
    out = library_helper.get_list_of_items_for_select(library_id);
    $('#apply-measure-water-heating-items-select').html(out);
    var tag = $('#apply-measure-water-heating-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-water-heating-modal .modal-body').html(out);
});
$('#openbem').on('change', '#apply-measure-water-heating-items-select', function () {
    var library_id = $("#apply-measure-water-heating-library-select").val();
    var tag = $('#apply-measure-water-heating-items-select').val();
    var function_name = library_helper.type + '_item_to_html';
    var item = library_helper.get_library_by_id(library_id).data[tag];
    out = library_helper[function_name](item, tag);
    $('#apply-measure-water-heating-modal .modal-body').html(out);
});
$('#openbem').on('click', '#apply-measure-water-heating-ok', function () {
// The first time we apply a measure to an element we record its original stage
    if (data.measures.water_heating[library_helper.type] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.measures.water_heating[library_helper.type] = {};
    }
    switch (library_helper.type_of_measure) {
        case 'water_usage':
            var measure = library_helper.water_usage_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            measure.id = get_WU_max_id(data.water_heating.water_usage) + 1;
            // Add extra properties to measure 
            measure[tag].cost_units = '/unit';
            measure[tag].quantity = 1;
            measure[tag].cost_total = measure[tag].quantity * measure[tag].cost;
            // Update data object and add measure
            data.measures.water_heating[library_helper.type][measure.id] = {};
            data.measures.water_heating[library_helper.type][measure.id].original = 'empty';
            data.measures.water_heating[library_helper.type][measure.id].measure = measure[tag];
            data.water_heating.water_usage.push(measure[tag]);
            break;
        case 'storage_type':
            if (data.measures.water_heating[library_helper.type].original == undefined) // first time
                data.measures.water_heating[library_helper.type].original = data.water_heating.storage_type;
            var measure = library_helper.storage_type_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            // Add extra properties to measure 
            measure[tag].cost_units = '/unit';
            measure[tag].quantity = 1;
            measure[tag].cost_total = measure[tag].quantity * measure[tag].cost;
            // Update data object and add measure
            data.measures.water_heating[library_helper.type].measure = measure[tag];
            data.water_heating.storage_type = measure[tag];
            break;
        case 'pipework_insulation':
            if (data.measures.water_heating['pipework_insulation'] == undefined)
                data.measures.water_heating['pipework_insulation'] = {};
            if (data.measures.water_heating['pipework_insulation'].original == undefined) // first time
                data.measures.water_heating['pipework_insulation'].original = data.water_heating.pipework_insulation;
            data.measures.water_heating['pipework_insulation'].measure = $('#apply-measure-water-heating-pipework-insulation select').val();
            data.water_heating.pipework_insulation = $('#apply-measure-water-heating-pipework-insulation select').val();
            break;
    }
    update();
    waterheating_initUI();
    $('#apply-measure-water-heating-modal').modal('hide');
});

$('#openbem').on('click', '.select-type-of-storage-from-lib', function () {
    library_helper.init();
    library_helper.type = 'storage_type';
    library_helper.onAddItemFromLib();
});
$('#openbem').on('click', '.add-storage-type ', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    data.water_heating.storage_type = item;
    update();
    waterheating_initUI()
});

function get_WU_max_id() {
    var max_id = 0;
    // Find the max id
    for (z in data.water_heating.water_usage) {
        if (data.water_heating.water_usage[z].id != undefined && data.water_heating.water_usage[z].id > max_id)
            max_id = data.water_heating.water_usage[z].id;
    }
    for (z in data.measures.water_heating.water_usage) {
        if (z > max_id)
            max_id = z;
    }
    return max_id;
}
function add_water_usage() {
    if (data.water_heating.water_usage.length > 0)
        $('#water-usage').show();
    else
        $('#water-usage').hide();
    $('#water-usage').html('');
    for (z in data.water_heating.water_usage) {
        var item = data.water_heating.water_usage[z];
        var out = '<tr><td style="padding-left:75px;width:250px;border:none">' + item.tag + ': ' + item.name + '</td><td style="border:none">';
        //out += '<button class="apply-water-heating-measure if-not-master" type="water_usage" item_id="' + item.id + '" style="margin-right:25px">Apply Measure</button>'
        out += '<span class="edit-item-water-usage" row="' + z + '" tag="' + item.tag + '" style="cursor:pointer; margin-right:15px" item=\'' + JSON.stringify(item) + '\' title="Editing this way is not considered a Measure"> <a><i class = "icon-edit"> </i></a></span>';
        out += '<span class = "delete-water-usage" row="' + z + '" style="cursor:pointer" title="Deleting an element this way is not considered a Measure" ><a> <i class="icon-trash" ></i></a></span></td></tr> ';
        $('#water-usage').append(out);
    }
}
function edit_item(item, index, item_subsystem) {
    for (z in item)
        item = item[z]; // item comes in the format: system = {electric:{bla bla bla}} and we transform it to: system = {bla bla bla}
    if (library_helper.type === 'water_usage') {
        var object = 'water_usage';
    }
    for (z in data.water_heating[object][index]) { // We copy over all the properties that are not asked when editting an system, like id or tag
        if (item[z] == undefined)
            item[z] = data.water_heating[object][index][z];
    }
    data.water_heating[object][index] = item;
    update();
}