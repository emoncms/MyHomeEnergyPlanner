console.log('debug elements.js');
if (typeof library_helper != "undefined")
    library_helper.type = 'elements';
else
    var library_helper = new libraryHelper('elements', $("#openbem"));

// button defined in: libraryHelper:elements_library_to_html
$("#openbem").on("click", '.add-element', function () {

    var lib = $(this).attr("lib");
    var type = $(this).attr("type");
    type = type.charAt(0).toUpperCase() + type.slice(1); // Ensure first letter is capital
    var item_id = 1 + get_elements_max_id();
    var library = library_helper.get_library_by_id($(this).attr('library')).data;
    // Create default element
    var element = {type: type, name: type, lib: lib, l: 0, h: 0, area: 0, uvalue: 0, kvalue: 0, wk: 0, id: item_id};
    // If library is defined replace defaults with parameters from library
    if (lib != undefined) {
        for (z in library[lib])
            element[z] = library[lib][z];
    }

// Set a default value for orientation and overshading
    if (type == "Window" || type == "Door" || type == "Roof_light") {
        element.orientation = 3;
        element.overshading = 2;
    }

// Set a default value for subtractfrom
    if (type == "Window" || type == "Door" || type == "Roof_light")
        element.subtractfrom = $('.subtractfrom')[0][0].value;
    data.fabric.elements.push(element);
    var newelementid = data.fabric.elements.length - 1;
    if (type == "Wall")
        add_element("#elements", newelementid);
    if (type == "Roof" || type == "Loft")
        add_element("#roofs", newelementid);
    if (type == "Floor")
        add_floor(newelementid);
    if (type == "Window" || type == "Door" || type == "Roof_light" || type == "Hatch")
        add_window(newelementid);
    if (type == "Party_wall" || type == "party_wall")
        add_element("#party_walls", newelementid);
    update();
    $('#myModal').modal('hide');
});

// button defined in: libraryHelper:elements_library_to_html
$("#openbem").on("click", '.change-element', function () {

    var row = $(this).attr("row");
    var lib = $(this).attr("lib");
    var type = $(this).attr("type");
    type = type.charAt(0).toUpperCase() + type.slice(1); // Ensure first letter is capital

    console.log("change element row=" + row + " lib=" + lib);

    var library = library_helper.get_library_by_id($(this).attr('library')).data;

    data.fabric.elements[row].lib = lib;
    if (lib != undefined) {
        for (var z in library[lib]) {
            if (z != 'location')
                data.fabric.elements[row][z] = library[lib][z];
        }
    }

    update();
});

$("#openbem").on("click", '.delete-element', function () {
    var row = $(this).attr('row');
    var item_id = 1.0 * $(this).attr('item_id');
    $(this).closest('tr').remove();
    data.fabric.elements.splice(row, 1);
    elements_initUI();
    update();
});

$("#openbem").on("click", '#apply-measure-TB', function () {
    $('#TB-measure-value').val(data.fabric.thermal_bridging_yvalue);
    $('#apply-measure-TB-modal').modal('show');
});
$("#openbem").on("click", '#apply-measure-TB-modal-ok', function () {
//We only record the original value if this is the first time we apply the measure in this scenario
    if (data.measures.thermal_bridging == undefined) {
        data.measures.thermal_bridging = {original_element: {}, measure: {}};
        data.measures.thermal_bridging.original_element.value = data.fabric.thermal_bridging_yvalue;
    }

//Apply measure
    data.fabric.thermal_bridging_yvalue = $('#TB-measure-value').val();
    data.measures.thermal_bridging.measure.value = $('#TB-measure-value').val();
    data.measures.thermal_bridging.measure.description = $('#TB-measure-description').val();
    ;
    $('#apply-measure-TB-modal').modal('hide');
    elements_initUI();
    update();
});
$("#openbem").on("change", '.floor-uvalue', function () {
    if ($(this).val() == 0)
        $(this).css('color', 'red');
    else
        $(this).css('color', 'black');
});
$("#openbem").on("click", '.apply-bulk-measure', function () {
// We use the modal from the library_helper but we modify it (remove/add buttons) to chang its behaviour
// When we finsih with it -on("click", '#bulk-measure-next'- we leave it as it was originally
    $('#apply-measure-ok').hide();
    $('#apply-measure-modal .modal-footer').append('<button id="bulk-measure-next" tags="' + $(this).attr('tags') + '" class="btn btn-primary">Next</button>');
    library_helper.onApplyMeasure($(this));
    $('#apply-measure-modal').on('hidden.bs.modal', function (e) { // Bind event to tidy up the modal when we dismiss it
        $('#apply-measure-modal .modal-body').show();
        $('#apply-measure-modal #modal-bulk-measure-body').remove();
        $('#bulk-measure-finish').remove();
        $('#bulk-measure-next').remove();
        $('#apply-measure-ok').show();
    });
});
$("#openbem").on("click", '#bulk-measure-next', function () {
// Prepare conten for modal
    var out = '<div id="modal-bulk-measure-body" style="padding: 15px" >';
    out += '<p>Choose elements to appply measures to.</p>';
    out += '<table class="table" style="margin-left:15px">';
    var label = $(this).attr('tags') == 'Window' ? 'Substract from' : '';
    out += '<tr><th><input type="checkbox" id="bulk-measure-check-all" /></th>\n\
        <th>Name</th><th>Label</th><th>' + label + '</th></tr>';
    if ($(this).attr('tags') == 'Window') { // We sort them by the wall the windows are substrated from
        var window_by_wall = {};
        for (var row in data.fabric.elements) {
            var element = data.fabric.elements[row];
            if (element.type == "Window") {
                if (window_by_wall[element.subtractfrom] == undefined)
                    window_by_wall[element.subtractfrom] = [];
                window_by_wall[element.subtractfrom].push({element: element, row: row});
            }
        }
        for (var wall in window_by_wall) { // We display them
            for (var index in window_by_wall[wall]) {
                var element = window_by_wall[wall][index].element;
                if (element.type == $(this).attr('tags')) {
                    out += "<tr><td><input type='checkbox' class='bulk-element' element-row='" + window_by_wall[wall][index].row + "' /></td>";
                    out += '<td>' + element.name + "</td>";
                    out += "<td>" + element.location + "</td>";
                    out += "<td>" + get_element_by_id(element.subtractfrom).location + "</td>";
                    out += '</tr>';
                }
            }
        }
    }
    else {
        for (var row in data.fabric.elements) {
            var element = data.fabric.elements[row];
            if (element.type == $(this).attr('tags')) {
                out += "<tr><td><input type='checkbox' class='bulk-element' element-row='" + row + "' /></td>";
                out += '<td>' + element.name + "</td>";
                out += "<td>" + element.location + "</td>";
                out += "<td></td>";
                out += '</tr>';
            }
        }
    }
    out += '</table>';
    out += '</div>';
    // Add content and buttons, hide what we don't need from the original modal
    $('#apply-measure-modal .modal-body').after($(out));
    $('#apply-measure-modal .modal-body').hide();
    $('#bulk-measure-next').remove();
    $('#apply-measure-modal .modal-footer').append('<button id="bulk-measure-finish" class="btn btn-primary">Finish</button>');
});
$("#openbem").on("click", '#bulk-measure-finish', function () {
    // Check that there is no previous measure applied to each element and if there is then delete it
    $('.bulk-element').each(function (i, obj) { // For each window checked
        if (obj.checked == true) {
            var row = $(obj).attr('element-row');
            var element_id = data.fabric.elements[row].id
            // applied as single measure
            if (data.fabric.measures[element_id] != undefined)
                delete(data.fabric.measures[element_id]);
            // applied as part of a bulk measure
            var applied_in_bulk = measure_applied_in_bulk(element_id);
            if (applied_in_bulk != false) {
                delete_element_from_bulk_measure(element_id, applied_in_bulk);
            }
        }
    });

    // Create measure
    var measure = library_helper.elements_measures_get_item_to_save();
    for (var lib in measure) {
        measure[lib].lib = lib;
    }
    measure[lib].id = 1 + get_elements_max_id();
    measure[lib].location = '';
    var area = 0;

    // Save original elements
    data.fabric.measures[measure[lib].id] = {};
    data.fabric.measures[measure[lib].id].original_elements = {};
    $('.bulk-element').each(function (i, obj) { // For each window checked
        if (obj.checked == true) {
            var row = $(obj).attr('element-row');
            area += data.fabric.elements[row].netarea;
            measure[lib].location += data.fabric.elements[row].location + ',<br>';
            for (var attr in measure[lib]) {
                var element_id = data.fabric.elements[row].id;
                data.fabric.measures[measure[lib].id].original_elements[element_id] = JSON.parse(JSON.stringify(data.fabric.elements[row]));
            }
        }
    });

    //Apply measure to the selected elements
    $('.bulk-element').each(function (i, obj) {
        if (obj.checked == true) {
            var row = $(obj).attr('element-row');
            for (var attr in measure[lib]) {
                if (attr != 'location' && attr != 'id')
                    data.fabric.elements[row][attr] = measure[lib][attr];
            }
            measure[lib].type = data.fabric.elements[row].type; // I know this shouldn't be here, but it is the only place where I can get the type of the element to add it to the measure
        }
    });

    // Save measure and calculate totals
    data.fabric.measures[measure[lib].id].measure = measure[lib];
    add_quantity_and_cost_to_bulk_fabric_measure(measure[lib].id);

    elements_initUI();
    update();

    // Tidy up the apply-measure modal
    $('#apply-measure-modal').modal('hide');
});
$("#openbem").on("change", '#bulk-measure-check-all', function () {
    $('.bulk-element').prop('checked', $('#bulk-measure-check-all')[0].checked);
    /*if ($('#bulk-measure-check-all')[0].checked === true)
     $('.bulk-element').attr('checked', 'checked');
     else
     $('.bulk-element').attr('checked', false);
     */
});
$("#openbem").on("click", '.revert-to-original', function () {
    var element_id = $(this).attr('item_id');
    if (element_exists_in_original(data.created_from, element_id) == true) {
        // copy the original element 
        for (var e in project[data.created_from].fabric.elements) {
            if (project[data.created_from].fabric.elements[e].id == element_id) {
                data.fabric.elements[get_element_index_by_id(element_id)] = JSON.parse(JSON.stringify(project[data.created_from].fabric.elements[e]));
                break;
            }
        }
        // delete measure
        var applied_in_bulk = measure_applied_in_bulk(element_id);
        if (applied_in_bulk == false)
            delete(data.fabric.measures[element_id]);
        else
            delete(data.fabric.measures[applied_in_bulk].original_elements[element_id]);
    }
    elements_initUI();
    update();
});
$("#openbem").on("click", '.calculate-floor-uvalue', function () {
    var z = $(this).attr('z');
    var area = $('[key="data.fabric.elements.' + z + '.area"]').val();
    var perimeter = $('[key="data.fabric.elements.' + z + '.perimeter"]').val();
    $('#openFUVC-modal #area input').val(area).change();
    $('#openFUVC-modal #perimeter input').val(perimeter).change();
    openFUVC_helper.launch_calculator(function (uvalue) {
        $('[key="data.fabric.elements.' + z + '.uvalue"]').val(uvalue.toFixed(2));
        $('[key="data.fabric.elements.' + z + '.uvalue"]').change();
        if (area == "" || area != $('#openFUVC-modal #area input').val()) {
            var new_area = $('#openFUVC-modal #area input').val();
            $('[key="data.fabric.elements.' + z + '.area"]').val(new_area);
            $('[key="data.fabric.elements.' + z + '.area"]').change();
        }
        if (perimeter == "" || perimeter != $('#openFUVC-modal #perimeter input')) {
            var new_perimeter = $('#openFUVC-modal #perimeter input').val();
            $('[key="data.fabric.elements.' + z + '.perimeter"]').val(new_perimeter);
            $('[key="data.fabric.elements.' + z + '.perimeter"]').change();
        }
    });
});
$("#openbem").on("click", '.move-up', function () {
    var original_element = JSON.parse($(this).attr('item'));
    var index_original_element = $(this).attr('row');
    var move = false;
    // Find next item  of the same type up
    for (var i = 1.0 * index_original_element - 1; i >= 0; i--) {
        if (original_element.type == "Wall" || original_element.type == "Party_wall" || original_element.type == "Floor") {
            if (original_element.type == data.fabric.elements[i].type) {
                move = true;
                data.fabric.elements[index_original_element] = JSON.parse(JSON.stringify(data.fabric.elements[i]));
                data.fabric.elements[i] = original_element;
                break;
            }
        }
        else if (original_element.type == "Roof" || original_element.type == "Loft") {
            move = true;
            if (data.fabric.elements[i].type == "Roof" || data.fabric.elements[i].type == "Loft") {
                data.fabric.elements[index_original_element] = JSON.parse(JSON.stringify(data.fabric.elements[i]));
                data.fabric.elements[i] = original_element;
                break;
            }
        }
        else {
            if (data.fabric.elements[i].type == "Window" || data.fabric.elements[i].type == "Door" || data.fabric.elements[i].type == "Roof_light" || data.fabric.elements[i].type == "Hatch") {
                move = true;
                data.fabric.elements[index_original_element] = JSON.parse(JSON.stringify(data.fabric.elements[i]));
                data.fabric.elements[i] = original_element;
                break;
            }
        }
    }
    if (move == true) {
        elements_initUI();
        update();
    }
});
$("#openbem").on("click", '.move-down', function () {
    var original_element = JSON.parse($(this).attr('item'));
    var index_original_element = $(this).attr('row');
    var move = false;
    // Find next item  of the same type up
    for (var i = 1.0 * index_original_element + 1; i < data.fabric.elements.length; i++) {
        if (original_element.type == "Wall" || original_element.type == "Party_wall" || original_element.type == "Floor") {
            if (original_element.type == data.fabric.elements[i].type) {
                move = true;
                data.fabric.elements[index_original_element] = JSON.parse(JSON.stringify(data.fabric.elements[i]));
                data.fabric.elements[i] = original_element;
                break;
            }
        }
        else if (original_element.type == "Roof" || original_element.type == "Loft") {
            move = true;
            if (data.fabric.elements[i].type == "Roof" || data.fabric.elements[i].type == "Loft") {
                data.fabric.elements[index_original_element] = JSON.parse(JSON.stringify(data.fabric.elements[i]));
                data.fabric.elements[i] = original_element;
                break;
            }
        }
        else {
            if (data.fabric.elements[i].type == "Window" || data.fabric.elements[i].type == "Door" || data.fabric.elements[i].type == "Roof_light" || data.fabric.elements[i].type == "Hatch") {
                move = true;
                data.fabric.elements[index_original_element] = JSON.parse(JSON.stringify(data.fabric.elements[i]));
                data.fabric.elements[i] = original_element;
                break;
            }
        }
    }
    if (move == true) {
        elements_initUI();
        update();
    }
});

$("[key='data.fabric.global_TMP']").change(function () {
    value = $("[key='data.fabric.global_TMP']").is(":checked");
    if (value === true)
        $("[key='data.fabric.global_TMP_value']").prop('disabled', false);
    else
        $("[key='data.fabric.global_TMP_value']").prop('disabled', true);
});

function add_element(id, z)
{
    var element = data.fabric.elements[z];
    $(id).append($("#element-template").html());
    var row = $(id + " [row='template']");
    $(id + " [key='data.fabric.elements.template.type']").attr('key', 'data.fabric.elements.' + z + '.type');
    $(id + " [key='data.fabric.elements.template.name']").attr('key', 'data.fabric.elements.' + z + '.name');
    $(id + " [key='data.fabric.elements.template.location']").attr('key', 'data.fabric.elements.' + z + '.location');
    $(id + " [key='data.fabric.elements.template.lib']").attr('key', 'data.fabric.elements.' + z + '.lib');
    $(id + " [key='data.fabric.elements.template.l']").attr('key', 'data.fabric.elements.' + z + '.l');
    $(id + " [key='data.fabric.elements.template.h']").attr('key', 'data.fabric.elements.' + z + '.h');
    $(id + " [key='data.fabric.elements.template.area']").attr('key', 'data.fabric.elements.' + z + '.area');
    $(id + " [key='data.fabric.elements.template.windowarea']").attr('key', 'data.fabric.elements.' + z + '.windowarea');
    $(id + " [key='data.fabric.elements.template.netarea']").attr('key', 'data.fabric.elements.' + z + '.netarea');
    $(id + " [key='data.fabric.elements.template.uvalue']").attr('key', 'data.fabric.elements.' + z + '.uvalue');
    $(id + " [key='data.fabric.elements.template.kvalue']").attr('key', 'data.fabric.elements.' + z + '.kvalue');
    $(id + " [key='data.fabric.elements.template.wk']").attr('key', 'data.fabric.elements.' + z + '.wk');
    $(id + " [key='data.fabric.elements.template.EWI']").html(data.fabric.elements[z].EWI == true ? 'EWI' : '');
    $(id + " [key='data.fabric.elements.template.EWI']").removeAttr('key');
    row.attr('row', z);
    row.attr('item_id', data.fabric.elements[z].id);
    row.attr('item', JSON.stringify(data.fabric.elements[z]));
    if (data.fabric.elements[z].type != "Loft" && data.fabric.elements[z].type != "Roof")
        row.attr('tags', data.fabric.elements[z].type);
    else
        row.attr('tags', 'Roof,Loft');

    // Revert to original
    init_revert_to_original(id, z);

}

function add_floor(z)
{
    var id = "#floors";
    var element = data.fabric.elements[z];
    $(id).append($("#floor-template").html());
    var row = $(id + " [row='template']");
    $(id + " [key='data.fabric.elements.template.type']").attr('key', 'data.fabric.elements.' + z + '.type');
    $(id + " [key='data.fabric.elements.template.name']").attr('key', 'data.fabric.elements.' + z + '.name');
    $(id + " [key='data.fabric.elements.template.location']").attr('key', 'data.fabric.elements.' + z + '.location');
    $(id + " [key='data.fabric.elements.template.lib']").attr('key', 'data.fabric.elements.' + z + '.lib');
    $(id + " [key='data.fabric.elements.template.perimeter']").attr('key', 'data.fabric.elements.' + z + '.perimeter');
    $(id + " [key='data.fabric.elements.template.area']").attr('key', 'data.fabric.elements.' + z + '.area');
    $(id + " .calculate-floor-uvalue[z='template'").attr('z', z);
    $(id + " [key='data.fabric.elements.template.uvalue']").attr('key', 'data.fabric.elements.' + z + '.uvalue');
    $(id + " [key='data.fabric.elements.template.kvalue']").attr('key', 'data.fabric.elements.' + z + '.kvalue');
    $(id + " [key='data.fabric.elements.template.wk']").attr('key', 'data.fabric.elements.' + z + '.wk');
    $(id + " [key='data.fabric.elements.template.EWI']").html(data.fabric.elements[z].EWI == true ? 'EWI' : '');
    $(id + " [key='data.fabric.elements.template.EWI']").removeAttr('key');
    row.attr('row', z);
    row.attr('item_id', data.fabric.elements[z].id);
    row.attr('item', JSON.stringify(data.fabric.elements[z]));
    row.attr('tags', data.fabric.elements[z].type);

    if (data.fabric.elements[z].uvalue == 0)
        $(id + " [key='data.fabric.elements." + z + ".uvalue']").css('color', 'red');

    // Revert to original 
    init_revert_to_original(id, z);
}

function add_window(z)
{
    var element = data.fabric.elements[z];
    $("#windows").append($("#window-template").html());
    var row = $("#windows [row='template']");
    $("#windows [key='data.fabric.elements.template.lib']").attr('key', 'data.fabric.elements.' + z + '.lib');
    $("#windows [key='data.fabric.elements.template.name']").attr('key', 'data.fabric.elements.' + z + '.name');
    $("#windows [key='data.fabric.elements.template.location']").attr('key', 'data.fabric.elements.' + z + '.location');
    $("#windows [key='data.fabric.elements.template.description']").attr('key', 'data.fabric.elements.' + z + '.description');
    $("#windows [key='data.fabric.elements.template.subtractfrom']").attr('key', 'data.fabric.elements.' + z + '.subtractfrom');
    $("#windows [key='data.fabric.elements.template.l']").attr('key', 'data.fabric.elements.' + z + '.l');
    $("#windows [key='data.fabric.elements.template.h']").attr('key', 'data.fabric.elements.' + z + '.h');
    $("#windows [key='data.fabric.elements.template.area']").attr('key', 'data.fabric.elements.' + z + '.area');
    $("#windows [key='data.fabric.elements.template.uvalue']").attr('key', 'data.fabric.elements.' + z + '.uvalue');
    $("#windows [key='data.fabric.elements.template.kvalue']").attr('key', 'data.fabric.elements.' + z + '.kvalue');
    if (data.fabric.elements[z].type != 'Hatch') {
        $("#windows [key='data.fabric.elements.template.orientation']").attr('key', 'data.fabric.elements.' + z + '.orientation');
        $("#windows [key='data.fabric.elements.template.overshading']").attr('key', 'data.fabric.elements.' + z + '.overshading');
        $("#windows [key='data.fabric.elements.template.g']").attr('key', 'data.fabric.elements.' + z + '.g');
        $("#windows [key='data.fabric.elements.template.gL']").attr('key', 'data.fabric.elements.' + z + '.gL');
        $("#windows [key='data.fabric.elements.template.ff']").attr('key', 'data.fabric.elements.' + z + '.ff');
        $("#windows [key='data.fabric.elements.template.gain']").attr('key', 'data.fabric.elements.' + z + '.gain');
    }
    else {
        $("#windows [key='data.fabric.elements.template.orientation']").parent().html('');
        $("#windows [key='data.fabric.elements.template.overshading']").parent().html('');
        $("#windows [key='data.fabric.elements.template.gain']").parent().html('');
        $('#windows .window_fields_template').html('');
    }
    $("#windows [key='data.fabric.elements.template.wk']").attr('key', 'data.fabric.elements.' + z + '.wk');

    $('#windows .window_fields_template').removeClass('window_fields_template');
    data.fabric.elements[z].name = String(data.fabric.elements[z].name);
    var name = data.fabric.elements[z].name;
    name = name.toLowerCase();
    if (data.fabric.elements[z].type == 'Door') {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#ffeeee');
    }

    if (data.fabric.elements[z].type == 'Roof_light') {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#eeffee');
    }

    if (data.fabric.elements[z].type == 'Hatch') {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#ddeeff');
    }

    row.attr('row', z);
    row.attr('item_id', data.fabric.elements[z].id);
    row.attr('item', JSON.stringify(data.fabric.elements[z]));
    row.attr('tags', data.fabric.elements[z].type);

    var subtractfromhtml = "<option value='no' ></option>";
    for (i in data.fabric.elements) {
        // here
        if (data.fabric.elements[i].type != 'Window' && data.fabric.elements[i].type != 'Door' && data.fabric.elements[i].type != 'Roof_light' && data.fabric.elements[i].type != 'Floor' && data.fabric.elements[i].type != 'Hatch')
            subtractfromhtml += "<option value='" + data.fabric.elements[i].id + "'>" + data.fabric.elements[i].location + "</option>";
        //subtractfromhtml += "<option value='" + i + "'>" + data.fabric.elements[i].name + "</option>";
    }
    $("#windows [key='data.fabric.elements." + z + ".subtractfrom']").html(subtractfromhtml);

    // Revert to original
    init_revert_to_original('#windows', z);
}

function elements_initUI()
{
    library_helper.type = 'elements';
    if (data.fabric.measures == undefined) // Normally this is done in model-rX.js. The model is intended for calculations so i prefer to initialize data.fabric.measures here
        data.fabric.measures = {};
    $("#elements").html("");
    $("#roofs").html("");
    $("#floors").html("");
    $("#windows").html("");
    $("#party_walls").html("");
    // Initial addition of floors
    for (z in data.fabric.elements) {
        var type = data.fabric.elements[z].type;
        //type = type.charAt(0).toUpperCase() + type.slice(1); // Ensure first letter is capital
        if (type == 'Wall' || type == 'wall') {
            add_element("#elements", z);
        }
        else if (type == 'Floor' || type == 'floor') {
            add_floor(z);
        }
        else if (type == 'Roof' || type == 'roof' || type == 'Loft') {
            add_element("#roofs", z);
        }
        else if (type == 'Window' || type == 'window' || type == 'Door' || type == 'Roof_light' || type == 'Hatch') {
            add_window(z);
        }
        else if (type == 'Party_wall' || type == 'party_wall') {
            add_element("#party_walls", z);
        }
    }

    // Enable/disable dropdown for global TMP
    if (data.fabric.global_TMP === 1)
        $("[key='data.fabric.global_TMP_value']").prop('disabled', false);
    else
        $("[key='data.fabric.global_TMP_value']").prop('disabled', true);
    // Check all the windows, doors, etc are substracted from somewhere and if not attach them to the first wall, floor, etc from the list. This is a bug fix with backwards compatibility, that's why it's done here
    elements_UpdateUI()
    for (z in data.fabric.elements) {
        if (data.fabric.elements[z].type == "Window" || data.fabric.elements[z].type == "Door" || data.fabric.elements[z].type == "Roof_light" || data.fabric.elements[z].type == "Hatch") {
            if (data.fabric.elements[z].subtractfrom == undefined)
                data.fabric.elements[z].subtractfrom = $('.subtractfrom')[0][0].value;
        }
    }

    // Show "Measured applied" in thermal bridge
    if (data.measures != undefined && data.thermal_bridging != undefined)
        $('#TB-measured-applied').show();
}

function elements_UpdateUI()
{
    for (z in data.fabric.elements) {
        var color = "#fff";
        /*var name = data.fabric.elements[z].name;
         name = name.toLowerCase();*/
        if (data.fabric.elements[z].type == 'Door') {
            color = '#ffeeee';
        }

        if (data.fabric.elements[z].type == 'Roof_light') {
            color = '#ddffdd';
        }

        if (data.fabric.elements[z].type == 'Hatch') {
            color = '#ddeeff';
        }

        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', color);
        /*if (data.fabric.elements[z].type == 'Window') {
         var name = data.fabric.elements[z].name;
         name = name.toLowerCase();
         
         var color = "#fff";
         if (name.indexOf("door") != -1)
         color = '#ffeeee';
         if (name.indexOf("roof") != -1)
         color = '#ddffdd';
         
         // $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', color);
         }*/

    }

    // populate the subtractfrom selects in windows, doors (etc). We do it everytime we update just in case the key that has changed is one of Label/Location
    // Get all the locations (walls, party walls, roofs and lofts
    var options = '';
    for (z in data.fabric.elements) {
        if (data.fabric.elements[z].type != "Window" && data.fabric.elements[z].type != "Door" && data.fabric.elements[z].type != "Roof_light" && data.fabric.elements[z].type != "Hatch" && data.fabric.elements[z].type != "Floor")
            options += "<option value='" + data.fabric.elements[z].id + "'>" + data.fabric.elements[z].location + "</option>";
    }

    $('.revert-to-original-icon').attr('src', path + "Modules/assessment/img-assets/undo.gif");

    // Fill up the substractfrom selects
    $('.subtractfrom').each(function (i, obj) {
        $(this).html(options);
    });
}

function get_elements_max_id() {
    var max_id = 0;
    // Find the max id

    for (z in data.fabric.elements) {
        if (data.fabric.elements[z].id != undefined && data.fabric.elements[z].id > max_id)
            max_id = data.fabric.elements[z].id;
    }
    for (z in data.fabric.measures) {
        if (z > max_id)
            max_id = z;
    }
    return (1.0 * max_id);
}

function apply_measure(measure) {
    // Check is a measure has previously been applied as part of a bulk measure, if so then we delete it
    var applied_in_bulk = measure_applied_in_bulk(measure.item_id);
    if (applied_in_bulk != false)
        delete_element_from_bulk_measure(measure.item_id, applied_in_bulk);

    // The first time we apply a measure to an element we record its original stage
    if (data.fabric.measures[measure.item_id] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.fabric.measures[measure.item_id] = {};
        data.fabric.measures[measure.item_id].original_element = JSON.parse(JSON.stringify(data.fabric.elements[measure.row]));
    }

    for (z in measure.item) // measure.item only has one element, we do it this way to the "property", in this case somemthing like "CV1" oof "ROOF1"
        var lib = z;
    switch (measure.type) {
        case 'remove':
            var selector = '[row="' + measure.row + '"]'
            $(selector).closest('tr').remove();
            data.fabric.elements.splice(measure.row, 1);
            data.fabric.measures[measure.item_id].measure = "Element deleted";
            break;
        case  'replace_from_measure_library': // watch out no 'break' at the end of this case
        case 'replace':
        case 'edit':
            measure.item[lib].lib = lib;
            for (z in data.fabric.elements[measure.row]) { // We copy over all the properties that are not asked when applying measures, this are the ones that the user inputed like "length" and "height"
                if (measure.item[lib][z] == undefined)
                    measure.item[lib][z] = data.fabric.elements[measure.row][z];
            }
            add_quantity_and_cost_to_measure(measure.item[lib]);
            // Update element and add measure
            data.fabric.elements[measure.row] = measure.item[lib];
            data.fabric.measures[measure.item_id].measure = measure.item[lib];
            break;
    }

    elements_initUI();
    update();
}

function get_element_value(element) {
    return element;
}

function check_and_add_measure_fields(element) {
    console.log(element);
    if (element.description == undefined || element.description == '')
        element.description = '--';
    if (element.performance == undefined || element.performance == '')
        element.performance = '--';
    if (element.performance_units == undefined || element.performance_units == '')
        element.performance_units = '--';
    if (element.benefits == undefined || element.benefits == '')
        element.benefits = '--';
    if (element.cost == undefined || element.cost == '')
        element.cost = '--';
    if (element.cost_units == undefined || element.cost_units == '')
        element.cost_units = '--';
    if (element.who_by == undefined || element.who_by == '')
        element.who_by = '--';
    if (element.who_by_units == undefined || element.who_by_units == '')
        element.who_by_units = '--';
    if (element.who_by_quantity == undefined || element.who_by_quantity == '')
        element.who_by_quantity = '--';
    if (element.who_by_total == undefined || element.who_by_total == '')
        element.who_by_total = '--';
    if (element.disruption == undefined || element.disruption == '')
        element.disruption = '--';
    if (element.associated_work == undefined || element.associated_work == '')
        element.associated_work = '--';
    if (element.key_risks == undefined || element.key_risks == '')
        element.key_risks = '--';
    if (element.notes == undefined || element.notes == '')
        element.notes = '--';
    if (element.maintenance == undefined || element.maintenance == '')
        element.maintenance = '--';
}

function edit_item(element, row) {

    for (z in element) {
        var lib = z;
        element[z].lib = z;
    }
    if (element[lib].type == undefined)
        element[lib].type = element[lib].tags[0];
    for (z in data.fabric.elements[row]) { // We copy over all the properties that are not asked when editting an element, this are the ones that the user inputed like "length" and "height"
        if (element[lib][z] == undefined)
            element[lib][z] = data.fabric.elements[row][z];
    }

    data.fabric.elements[row] = element[lib];
    elements_initUI();
    update();
}

function get_element_by_id(id) {
    for (var index in data.fabric.elements) {
        if (data.fabric.elements[index].id == id)
            return data.fabric.elements[index];
    }
}

function get_element_index_by_id(id) {
    for (var index in data.fabric.elements) {
        if (data.fabric.elements[index].id == id)
            return index;
    }
}

function measure_applied_to_element(element_id) {
    for (var measure_id in data.fabric.measures) {
        if (measure_id == element_id)
            return true;
        else if (measure_applied_in_bulk(element_id) != false) {
            return true;
        }
    }
    return false;
}

function element_exists_in_original(original_scenario, element_id) {
    for (e in project[original_scenario].fabric.elements) {
        if (project[original_scenario].fabric.elements[e].id == element_id)
            return true;
    }
    return false;
}

function measure_applied_in_bulk(element_id) { // returns false if measure is not in a bulf measure, returns the measure id if it is
    for (var measure_id in data.fabric.measures) {
        if (data.fabric.measures[measure_id].original_elements != undefined) { // bulk measure
            for (var m in data.fabric.measures[measure_id].original_elements) {
                if (m == element_id)
                    return measure_id;
            }
        }
    }
    return false;
}

function delete_element_from_bulk_measure(element_id, measure_id) {
    delete(data.fabric.measures[measure_id].original_elements[element_id]);
    if (Object.keys(data.fabric.measures[measure_id].original_elements).length == 0)
        delete(data.fabric.measures[measure_id]);
    else  // recalculate cost and quantity
        add_quantity_and_cost_to_bulk_fabric_measure(measure_id);
}

function add_quantity_and_cost_to_bulk_fabric_measure(measure_id) {
    measure_id = 1.0 * measure_id;
    var measure = data.fabric.measures[measure_id].measure;
    measure.quantity = 0;
    measure.cost_total = 0;
    for (var id in data.fabric.measures[measure_id].original_elements) {
        var single_measure = get_element_by_id(id); // Assumes that the measure has already been applied to the element
        add_quantity_and_cost_to_measure(single_measure);
        measure.quantity += single_measure.quantity;
        measure.cost_total += single_measure.cost_total;
    }
}

function init_revert_to_original(id, z) {
    if (measure_applied_to_element(data.fabric.elements[z].id) != false) {
        if (data.created_from != undefined && data.created_from != 'master') {
            var inner_html = $(id + ' .revert-to-original[item_id="' + data.fabric.elements[z].id + '"]').html();
            inner_html = inner_html.replace(/Revert to master/g, 'Revert to Scenario ' + data.created_from.split('scenario')[1]);
            $(id + ' .revert-to-original[item_id="' + data.fabric.elements[z].id + '"]').html(inner_html);
        }
        $(id + ' .revert-to-original[item_id="' + data.fabric.elements[z].id + '"]').show();
        if (data.created_from != undefined && element_exists_in_original(data.created_from, data.fabric.elements[z].id) == false)
            $(id + ' .revert-to-original[item_id="' + data.fabric.elements[z].id + '"]').removeClass('revert-to-original').css('cursor', 'default').html('Original element doesn\'t<br />exist, cannot revert');
    }
    else {
        $(id + ' .revert-to-original[item_id="' + data.fabric.elements[z].id + '"]').hide();
    }
}

