console.log("debug heating.js");

if (typeof library_helper != "undefined")
    library_helper.type = 'water_usage';
else
    var library_helper = new libraryHelper('heating_systems', $("#openbem"));

function heating_UpdateUI()
{
    add_water_usage();
    add_heating_systems();

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
    if (data.measures.space_heating == undefined)
        data.measures.space_heating = {};

    // Water heating
    add_water_usage(); // water efficiency
    $('#solarhotwater-link').prop('href', 'view?id=' + p.id + '#' + scenario + '/solarhotwater');

    // Space heating
    for (var day_type in data.temperature.hours_off) {
        var total_hours = 0;
        for (i in data.temperature.hours_off[day_type])
            total_hours += data.temperature.hours_off[day_type][i];
        $('#hours-off-' + day_type).html(total_hours);
    }

    //Heating systems
    add_heating_systems();

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
$('#openbem').on('click', '.add-heating-system-from-lib', function () {
    library_helper.init();
    library_helper.type = 'heating_systems';
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
    //1. Set variables in library_helper
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

    // 2. Prepare modal
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

    // 3. Specific action for each type of measure
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
        case 'heating_systems':
            var item_index = $(this).attr('item-index');
            $('#apply-measure-water-heating-ok').attr('item-index', item_index);
        default:
            $('#apply-measure-water-heating-what-to-do').hide();
            $('#apply-measure-water-heating-library-item-selects').show();
            $('#apply-measure-water-heating-modal .modal-body').show();
            $('#apply-measure-water-heating-pipework-insulation').hide();
            $('#apply-measure-water-heating-modal #myModalIntroText').html('Choose a measure from a library');
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
    if (library_helper.type === 'heating_control') {
        if (data.measures.space_heating[library_helper.type] == undefined) { 
            data.measures.space_heating[library_helper.type] = {};
        }
    }
    else if (library_helper.type === 'heating_systems') {
        if (data.measures.heating_systems == undefined) { 
            data.measures.heating_systems = {};
        }
    }
    else if (data.measures.water_heating[library_helper.type] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
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
        case 'heating_control':
            if (data.measures.space_heating['heating_control'] == undefined)
                data.measures.space_heating['heating_control'] = {};
            if (data.measures.space_heating['heating_control'].original == undefined) // first time
                data.measures.space_heating['heating_control'].original = data.temperature.control_type;
            var measure = library_helper.heating_control_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            // Add extra properties to measure 
            measure[tag].cost_units = '/unit';
            measure[tag].quantity = 1;
            measure[tag].cost_total = measure[tag].quantity * measure[tag].cost;
            // Update data object and add measure
            data.measures.space_heating[library_helper.type].measure = measure[tag];
            data.temperature.control_type = measure[tag].heating_control_type;
            break;
        case 'heating_systems':
            var item_index = $(this).attr('item-index');
            var item = data.heating_systems[item_index];
            if (data.measures.heating_systems[item.id] == undefined) //if first time we apply a measure to this system
                data.measures.heating_systems[item.id] = {original: item, measure: {}};
            var measure = library_helper.heating_systems_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            // Add extra properties to measure 
            measure[tag].cost_units = '/unit';
            measure[tag].quantity = 1;
            measure[tag].cost_total = measure[tag].quantity * measure[tag].cost;
            // Add properties that were in the original item
            for (z in item) {
                if (measure[tag][z] == undefined)
                    measure[tag][z] = item[z];
            }
            // Update data object and add measure
            data.measures.heating_systems[item.id].measure = measure[tag];
            data.heating_systems[item_index] = measure[tag];
            console.log(data.heating_systems[item_index]);
            break;
    }
    heating_initUI();
    update();
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
    heating_initUI()
});

$('#openbem').on('click', '.add-heating-system', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    item.id = get_HS_max_id() + 1;
    item.fuel = 'Standard Tariff';
    item.fraction = 1;
    item.main_space_heating_system = false;
    item.provides_water_heating = false;
    item.instantaneous_water_heating = false;
    item.storage = false;
    item.combi_keep_hot = 'No';
    data.heating_systems.push(item);
    console.log(data.heating_systems);
    update();
});
$('#openbem').on('click', '.delete-heating-system', function () {
    var row = $(this).attr('row');
    data.heating_systems.splice(row, 1);
    update();
});
$('#openbem').on('click', '.edit-item-heating-system', function () {
    library_helper.type = 'heating_systems';
    library_helper.onEditItem($(this));
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
function get_HS_max_id() {
    var max_id = 0;
    // Find the max id
    for (z in data.heating_systems) {
        if (data.heating_systems[z].id != undefined && data.heating_systems[z].id > max_id)
            max_id = data.heating_systems[z].id;
    }
    for (z in data.measures.heating_systems) {
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
function add_heating_systems() {
    if (data.heating_systems.length > 0)
        $('#heating-systems').show();
    else
        $('#heating-systems').hide();
    $('#heating-systems').html('');
    var out = "<tr><th>Tag</th><th>Name</th><th>Winter efficiency (space heating)</th><th>Summer efficiency (water heating)</th>\n\
<th>Fuel</th><th>Fraction</th><th>Responsiveness</th><th>Main heating system <i class='icon-question-sign' title='If more than one main system it is assumed that both heat the heat house and have same heating control type (SAP2012, p221)' /></th><th>Provides water heating?</th><th>Instantaneoud water heating?</th><th>Storage</th><th></th></tr>"
    for (z in data.heating_systems) {
        var item = data.heating_systems[z];
        out += '<tr><td>' + item.tag + '</td><td>' + item.name + '</td><td>' + item.winter_efficiency + '</td><td>' + item.summer_efficiency + '</td>\n\
<td><select key="data.heating_systems.' + z + '.fuel">' + get_fuels_for_select() + '</select></td><td><input style="width:55px" type="number" key="data.heating_systems.' + z + '.fraction" max="1" step="0.01" min="0" /></td><td><input style="width:40px" type="number" key="data.heating_systems.' + z + '.responsiveness" max="3" step="1" min="1" /></td><td><input type="checkbox" key="data.heating_systems.' + z + '.main_space_heating_system" /></td><td><input type="checkbox" key="data.heating_systems.' + z + '.provides_water_heating" /></td><td><input type="checkbox" key="data.heating_systems.' + z + '.instantaneous_water_heating" /></td><td><input type="checkbox" key="data.heating_systems.' + z + '.storage" /></td>';
        //out += '<button class="apply-water-heating-measure if-not-master" type="water_usage" item_id="' + item.id + '" style="margin-right:25px">Apply Measure</button>'
        out += '<td style="width:255px; text-align: center"><span class="edit-item-heating-system" row="' + z + '" tag="' + item.tag + '" style="cursor:pointer; margin-right:15px" item=\'' + JSON.stringify(item) + '\' title="Editing this way is not considered a Measure"> <a><i class = "icon-edit"> </i></a></span>';
        out += '<span class = "delete-heating-system" row="' + z + '" style="cursor:pointer" title="Deleting an element this way is not considered a Measure" ><a> <i class="icon-trash" ></i></a></span>';
        out += '<span class="apply-water-heating-measure if-not-master" type="heating_systems" item-index="' + z + '" style="cursor:pointer"><button class="btn if-not-locked" style="margin-left: 20px">Apply measure</button></span></td></tr> ';
    }
    $('#heating-systems').append(out);
}
function edit_item(item, index, item_subsystem) {
    for (z in item)
        item = item[z]; // item comes in the format: system = {electric:{bla bla bla}} and we transform it to: system = {bla bla bla}
    if (library_helper.type === 'water_usage') {
        var object = 'water_usage';
        for (z in data.water_heating[object][index]) { // We copy over all the properties that are not asked when editting an system, like id or tag
            if (item[z] == undefined)
                item[z] = data.water_heating[object][index][z];
        }
        data.water_heating[object][index] = item;
    }
    else if (library_helper.type === 'heating_systems') {
        for (z in data.heating_systems[index]) { // We copy over all the properties that are not asked when editting an system, like id or tag
            if (item[z] == undefined)
                item[z] = data.heating_systems[index][z];
        }
        data.heating_systems[index] = item;
    }

    update();
}