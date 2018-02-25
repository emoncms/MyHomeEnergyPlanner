console.log("debug heating.js");
if (typeof library_helper != "undefined")
    library_helper.type = 'water_usage';
else
    var library_helper = new libraryHelper('heating_systems', $("#openbem"));
function heating_UpdateUI()
{
    add_water_usage();
    add_heating_systems();
    add_storage();
    if (data.water_heating.override_annual_energy_content)
        $('#annual_energy_content').html('<input type="text"  dp=0 style="width:35px; margin-right:10px" key="data.water_heating.annual_energy_content" /> kWh/year');
    else
        $('#annual_energy_content').html('<span key="data.water_heating.annual_energy_content" dp=0></span>  kWh/year');
    //Add "Hot water storage control type" and "Pipework insulation" if any of the systems requires it
    data.heating_systems.forEach(function (system) {
        if (system.primary_circuit_loss == 'Yes')
            $('.if-primary-circuit-loss').show();
        else
            $('.if-primary-circuit-loss').hide();
    });
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
    $('#solarhotwater-link').prop('href', 'view?id=' + p.id + '#' + scenario + '/solarhotwater');
    // Space heating
    for (var day_type in data.temperature.hours_off) {
        var total_hours = 0;
        for (i in data.temperature.hours_off[day_type])
            total_hours += data.temperature.hours_off[day_type][i];
        $('#hours-off-' + day_type).html(total_hours);
    }
    heating_UpdateUI();
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
    if (library_helper.type_of_measure == 'add_heating_systems_measure')
        library_helper.type = 'heating_systems_measures';
    else
        library_helper.type = library_helper.type_of_measure;
    // 2. Prepare modal
    $('#apply-measure-water-heating-finish').hide();
    $('#apply-measure-water-heating-modal .modal-body > div').hide();
    // Populate selects in modal to choose library and measure
    var out = library_helper.get_list_of_libraries_for_select(library_helper.type);
    $("#apply-measure-water-heating-library-select").html(out);
    var library_id = $('#apply-measure-water-heating-library-select').val();
    if (library_helper.type == 'heating_systems_measures' || library_helper.type == 'storage_type_measures')
        out = library_helper.get_list_of_items_for_select_by_category(library_id);
    else
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
            $('#apply-measure-water-heating-modal #myModalIntroText').html('Choose a measure from a library');
            break;
        case 'storage_type':
            $('#apply-measure-water-heating-what-to-do').hide();
            $('#apply-measure-water-heating-library-item-selects').show();
            $('#apply-measure-water-heating-modal .modal-body').show();
            $('#apply-measure-water-heating-modal #myModalIntroText').html('Choose a measure from a library');
            break;
        case 'pipework_insulation':
            $('#apply-measure-water-heating-pipework-insulation select').val(data.water_heating.pipework_insulation);
            $('#apply-measure-water-heating-what-to-do').hide();
            $('#apply-measure-water-heating-library-item-selects').show();
            $('#apply-measure-water-heating-modal .modal-body').show();
            $('#apply-measure-water-heating-modal #myModalIntroText').html('Choose a measure from a library');
            break;
        case'space_heating_control_type':
        case 'heating_systems_measures':
            var item_index = $(this).attr('item-index');
            $('#apply-measure-water-heating-ok').attr('item-index', item_index);
        default:
            $('#apply-measure-water-heating-what-to-do').hide();
            $('#apply-measure-water-heating-library-item-selects').show();
            $('#apply-measure-water-heating-modal .modal-body').show();
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
    if (library_helper.type === 'space_heating_control_type') {
        if (data.measures.space_heating_control_type == undefined) {
            data.measures.space_heating_control_type = {};
        }
    }
    else if (library_helper.type === 'heating_systems_measures') {
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
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.measures.water_heating[library_helper.type][measure.id] = {};
            data.measures.water_heating[library_helper.type][measure.id].original = 'empty';
            data.measures.water_heating[library_helper.type][measure.id].measure = measure[tag];
            data.water_heating.water_usage.push(measure[tag]);
            break;
        case 'storage_type_measures':
            if (data.measures.water_heating[library_helper.type].original == undefined) // first time
                data.measures.water_heating[library_helper.type].original = data.water_heating.storage_type;
            var measure = library_helper.storage_type_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.measures.water_heating[library_helper.type].measure = measure[tag];
            data.water_heating.storage_type = measure[tag];
            break;
        case 'pipework_insulation':
            if (data.measures.water_heating['pipework_insulation'] == undefined)
                data.measures.water_heating['pipework_insulation'] = {};
            if (data.measures.water_heating['pipework_insulation'].original == undefined) // first time
                data.measures.water_heating['pipework_insulation'].original = data.water_heating.pipework_insulation;
            var measure = library_helper.pipework_insulation_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.measures.water_heating['pipework_insulation'].measure = measure[tag];
            data.water_heating.pipework_insulation = measure[tag].pipework_insulation;
            break;
        case 'hot_water_control_type':
            if (data.measures.water_heating['hot_water_control_type'] == undefined)
                data.measures.water_heating['hot_water_control_type'] = {};
            if (data.measures.water_heating['hot_water_control_type'].original == undefined) // first time
                data.measures.water_heating['hot_water_control_type'].original = data.water_heating.hot_water_control_type;
            var measure = library_helper.hot_water_control_type_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.measures.water_heating['hot_water_control_type'].measure = measure[tag];
            data.water_heating.hot_water_control_type = measure[tag].control_type;
            break;
        case 'space_heating_control_type':
            var item_index = $(this).attr('item-index');
            var item = data.heating_systems[item_index];
            if (data.measures.space_heating_control_type[item.id] == undefined) //if first time we apply a measure to this system
                data.measures.space_heating_control_type[item.id] = {original: item.heating_controls, measure: {}};
            var measure = library_helper.space_heating_control_type_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Update data object and add measure
            data.measures.space_heating_control_type[item.id].measure = measure[tag];
            data.heating_systems[item_index].heating_controls = measure[tag].control_type;
            break;
        case 'heating_systems_measures':
            var item_index = $(this).attr('item-index');
            var item = data.heating_systems[item_index];
            if (data.measures.heating_systems[item.id] == undefined) //if first time we apply a measure to this system
                data.measures.heating_systems[item.id] = {original: item, measure: {}};
            var measure = library_helper.heating_systems_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            if (measure[tag].category == 'Warm air systems')
                measure[tag].fans_and_supply_pumps = 0.4 * measure[tag].sfp * data.volume;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Add properties that were in the original item
            for (z in item) {
                if (measure[tag][z] == undefined)
                    measure[tag][z] = item[z];
            }
// Update data object and add measure
            data.measures.heating_systems[item.id].measure = measure[tag];
            data.heating_systems[item_index] = measure[tag];
            break;
        case 'add_heating_systems_measure':
            var item_id = get_HS_max_id() + 1;
            if (data.measures.heating_systems[item_id] == undefined) //if first time we apply a measure to this system
                data.measures.heating_systems[item_id] = {original: 'empty', measure: {}};
            var measure = library_helper.heating_systems_measures_get_item_to_save();
            for (z in measure)
                var tag = z;
            measure[tag].tag = tag;
            measure[tag].id = item_id;
            if (measure[tag].category == 'Warm air systems')
                measure[tag].fans_and_supply_pumps = 0.4 * measure[tag].sfp * data.volume;
            add_quantity_and_cost_to_measure(measure[tag]);
            // Add extra properties to measure 
            measure[tag].id = get_HS_max_id() + 1;
            measure[tag].fuel = 'Standard Tariff';
            measure[tag].fraction_space = 1;
            measure[tag].fraction_water_heating = 1;
            measure[tag].main_space_heating_system = 'secondaryHS';
            measure[tag].temperature_adjustment = 0;
            measure[tag].provides = 'heating_and_water';
            measure[tag].instantaneous_water_heating = false;
            measure[tag].heating_controls = 1;
            // Update data object and add measure
            data.measures.heating_systems[item_id].measure = measure[tag];
            data.heating_systems.push(measure[tag]);
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
$('#openbem').on('click', '.delete-storage', function () {
    delete data.water_heating.storage_type;
    console.log('hola')
    update();
});
$('#openbem').on('click', '.add-heating-system', function () {
    var tag = $(this).attr('tag');
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    var item = library[tag];
    item.tag = tag;
    if (item.category = 'Warm air systems')
        item.fans_and_supply_pumps = 0.4 * item.sfp * data.volume;
    item.id = get_HS_max_id() + 1;
    item.fuel = 'Standard Tariff';
    item.fraction_space = 1;
    item.fraction_water_heating = 1;
    item.main_space_heating_system = 'secondaryHS';
    item.temperature_adjustment = 0;
    item.provides = 'heating_and_water';
    item.instantaneous_water_heating = false;
    item.heating_controls = 1;
    data.heating_systems.push(item);
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
    var out = "<tr><th>Tag</th><th>Name</th><th>Provides</th><th>Space heating / Winter efficiency</th><th>Water heating / Summer efficiency</th>\n\
<th>Fuel</th><th>Fraction  <i class='icon-question-sign' title='This defines what proportion of the space heating or water heating for a home is provided by the system listed. For example, a standard assumption might be that a gas boiler provides 90% (0.9) of the space heating, and an open fire or room stove provides 10% (0.1). However, this can be adjusted using assessors informed judgement as required - and as many systems as are present can be included. If there are two main heating systems identified, the proportion of heat provided by each system should be taken as the relative heated floor area served by each system' /></th><th>Main heating system <i class='icon-question-sign' title='The main heating system is that which heats the largest proportion of the dwelling, and often provided hot water as well as space heating. If there is more than one main heating system identified, main system 1 always heats the living space. Secondary heating systems are room heaters - such as open fires or wood-stoves. If portable room heaters are used, they should be included in the calculations (note this is a deviation from standard SAP - ref p.40 SAP 9.92)' /></th><th>Responsiveness <i class='icon-question-sign' title='Refer to Table 4d, p.209 SAP 9.92' /></th><th>Temperature adjustment <i class='icon-question-sign' title='SAP2012, table 4e, p.210'></i></th><th>Space heating controls <i class='icon-question-sign' title='Refer to Table 4e, p.210 SAP 9.92' /></th><th>Instantaneous water heating?</th></tr>"
    $('#heating-systems').append(out);

    // Generate html string
    var mainHSs = {mainHS1: false, mainHS2: false};// Used to enable/disable options in the "main_space_heating_system" select

    for (z in data.heating_systems) {
        var item = data.heating_systems[z];
        out = '<tr><td style="text-align:center">' + item.tag + '<br /><br />';
        out += '<span class="edit-item-heating-system if-master" row="' + z + '" tag="' + item.tag + '" style="cursor:pointer; margin-right:15px" item=\'' + JSON.stringify(item) + '\' title="Editing this way is not considered a Measure"> <a><i class = "icon-edit"> </i></a></span>';
        out += '<span class = "delete-heating-system if-master" row="' + z + '" style="cursor:pointer" title="Deleting an element this way is not considered a Measure" ><a> <i class="icon-trash" ></i></a></span>';
        out += '<span class="apply-water-heating-measure if-not-master" type="heating_systems_measures" item-index="' + z + '" style="cursor:pointer"><button class="btn if-not-locked" style="margin-left: 20px">Apply measure</button></span></td><td>' + item.name + '</td>';
        out += '<td><select style="width:100px" key="data.heating_systems.' + z + '.provides"><option value="heating">Space heating</option><option value="water">Water heating</option><option value="heating_and_water">Space and water heating</option></select></td>';
        out += '<td class="if-SH">' + item.winter_efficiency + '</td><td class="if-WH">' + item.summer_efficiency + '</td>';
        out += '<td><select style="width:150px" key="data.heating_systems.' + z + '.fuel">' + get_fuels_for_select() + '</select></td>';
        out += '<td><p class="if-SH"><input style="width:55px" type="number" key="data.heating_systems.' + z + '.fraction_space" max="1" step="0.01" min="0" /></p>\n\
        <p class="if-WH"><input style="width:55px" type="number" key="data.heating_systems.' + z + '.fraction_water_heating" max="1" step="0.01" min="0" /></td>';
        out += '<td class="if-SH"><select style="width:100px" key="data.heating_systems.' + z + '.main_space_heating_system">';
        if (mainHSs.mainHS1 === false) {
            out += '<option value = "mainHS1" > Main heating system </option>';
            out += '<option value="mainHS2_whole_house" disabled>2<sup>nd</sup > Main heating system - whole house </option>';
            out += '<option value="mainHS2_part_of_the_house" disabled>2<sup>nd</sup > Main heating system - different part of the house </option>'
        }
        else if (mainHSs.mainHS2 === false) {
            out += '<option value = "mainHS1" disabled> Main heating system </option>';
            out += '<option value="mainHS2_whole_house">2<sup>nd</sup > Main heating system - whole house </option>';
            out += '<option value="mainHS2_part_of_the_house">2<sup>nd</sup > Main heating system - different part of the house </option>';
        }
        else {
            out += '<option value = "mainHS1" disabled> Main heating system </option>';
            out += '<option value="mainHS2_whole_house" disabled>2<sup>nd</sup > Main heating system - whole house </option>';
            out += '<option value="mainHS2_part_of_the_house" disabled>2<sup>nd</sup > Main heating system - different part of the house </option>';
        }
        if (item.main_space_heating_system == 'mainHS1')
            mainHSs.mainHS1 = true;
        else if (item.main_space_heating_system == 'mainHS2_whole_house' || item.main_space_heating_system == 'mainHS2_part_of_the_house')
            mainHSs.mainHS2 = true;
        out += '<option value="secondaryHS">Secondary heating system</option > </select></td >';
        out += '<td class = "if-SH" > <input style = "width:55px" type = "number" key = "data.heating_systems.' + z + '.responsiveness" max = "1" step = "0.01" min = "0" /> </td>';
        out += '<td class = "if-SH" > <input style = "width:55px" type = "number" key = "data.heating_systems.' + z + '.temperature_adjustment" max = "1" step = "0.01" min = "0" /> </td>';
        out += '<td class = "if-SH" style = "text-align:center" > <input class="controls-input" style = "width:40px" type = "number" key = "data.heating_systems.' + z + '.heating_controls" max = "3" step = "1" min = "1" /> \n\
        <br /> <span class = "apply-water-heating-measure if-not-master" type = "space_heating_control_type" item-index = "' + z + '" style = "cursor:pointer" > <button class = "btn if-not-locked" > Apply measure </button></span > </td>';
        out += '<td class = "if-WH" > <input type = "checkbox" key = "data.heating_systems.' + z + '.instantaneous_water_heating" /> </td></tr > ';

        $('#heating-systems').append(out);
        if(scenario != 'master')
            $('.controls-input').attr("disabled",true);
        switch (data.heating_systems[z].provides) {
            case 'heating':
                $('.if-WH').html('');
                $('p.if-WH').hide();
                break;
            case 'water':
                $('.if-SH').html('');
                $('p.if-SH').hide();
                break;
            case 'heating_and_water':
                $('[key="data.heating_systems.' + z + '.fraction_space"]').parent().html('Space: ' + $('[key="data.heating_systems.' + z + '.fraction_space"]').parent().html());
                $('[key="data.heating_systems.' + z + '.fraction_water_heating"]').parent().html('Water: ' + $('[key="data.heating_systems.' + z + '.fraction_water_heating"]').parent().html());
                break;
        }
        $('.if-WH').removeClass('if-WH');
        $('.if-SH').removeClass('if-SH');
    }

}
function add_storage() {
    $('#type_of_storage').html('');
    var st = data.water_heating.storage_type;
    if (st == undefined) {
        $('#type_of_storage').append('<tr><th>Type of storage <span class="select-type-of-storage-from-lib if-master" style="cursor:pointer"><button class="btn" style="margin-left: 20px"> Add from library</button></span></th></tr>');
    }
    else {
        var specific_header = '';
        var specific_st_info = '';
        if (st.declared_loss_factor_known == true) {
            specific_header = '<th>Manufacturers loss factor</th><th>Temperature factor a</th>';
            specific_st_info = '<td>' + st.manufacturer_loss_factor + '</td><td>' + st.temperature_factor_a + '</td>';
        }
        else {
            specific_header = '<th>Loss factor b</th><th>Volume factor b</th><th>Temperature factor b</th>';
            specific_st_info = '<td>' + st.loss_factor_b + '</td><td>' + st.volume_factor_b + '</td><td>' + st.temperature_factor_b + '</td>';
        }
        $('#type_of_storage').append('<tr><th>Type of storage </th><th>Volume</th>' + specific_header + '<th>Inside dwelling?</th><th style="width:150px">Contains dedicated solar storage or WWHRS volume? <i class="icon-question-sign" title="WWHRS: Waste Water Heat Recovery" /></th><th></th></tr>');
        $('#type_of_storage').append('<tr><td>' + st.tag + ': ' + st.name + '</td><td>' + st.storage_volume + '</td>'+ specific_st_info + '<td><input type="checkbox" key="data.water_heating.hot_water_store_in_dwelling" /></td><td><input style="width:54px" type="number" min="0" key="data.water_heating.contains_dedicated_solar_storage_or_WWHRS" /> litres</td><td style="width:200px"><span class="delete-storage" style="cursor:pointer" title="Deleting an element this way is not considered a Measure"><a> <i class="icon-trash"></i></a></span><span class="select-type-of-storage-from-lib if-master" style="cursor:pointer"><button class="btn" style="margin-left: 20px"> Replace from library</button></span><span class="apply-water-heating-measure if-not-master" type="storage_type_measures" style="cursor:pointer"><button class="btn" style="margin-left: 20px"> Apply measure</button></span></td></tr>');
    }

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