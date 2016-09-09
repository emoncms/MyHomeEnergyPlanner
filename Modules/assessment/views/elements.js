console.log('debug elements.js');

if (typeof library_helper != "undefined")
    library_helper.type = 'elements';
else
    var library_helper = new libraryHelper('elements', $("#openbem"));


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

    data.fabric.elements.push(element);
    var newelementid = data.fabric.elements.length - 1;
    if (type == "Wall")
        add_element("#elements", newelementid);
    if (type == "Roof")
        add_element("#roofs", newelementid);
    if (type == "Floor")
        add_floor(newelementid);
    if (type == "Window" || type == "Door" || type == "Roof_light" || type == "Hatch")
        add_window(newelementid);
    if (type == "Party_wall" || type == "party_wall")
        add_element("#party_walls", newelementid);
    update();

    if (type != "Window" && type != "Door" && type != "Roof_light" && type != "Floor" && type != "Hatch") {
        for (z in data.fabric.elements) {
            if (data.fabric.elements[z].type == "Window" || data.fabric.elements[z].type == "Door" || data.fabric.elements[z].type == "Roof_light" || data.fabric.elements[z].type == "Hatch") {
                $("#windows [key='data.fabric.elements." + z + ".subtractfrom']").append("<option value='" + newelementid + "'>" + data.fabric.elements[newelementid].name + "</option>");
            }
        }
    }

    $('#myModal').modal('hide');
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


/*$("#create-element").click(function () {
 // Empty "tag" so that it has nothing, we leave the other inputs as it can be handy for the user
 $('#create-element-tag').val("");
 $("#myModalcreateelement").modal('show');
 $('#myModal').modal('hide');
 });
 /*$("#create-element-type").change(function () {
 var type = $(this).val();
 if (type == "Window") {
 $(".create-element-window-options").show('fast');
 } else {
 $(".create-element-window-options").hide('fast');
 }
 });
 */
/*$("#create-element-save").click(function () {
 
 var type = $("#create-element-type").val();
 var tag = $("#create-element-tag").val();
 //if (element_library[tag]==undefined) {
 element_library[tag] = {};
 element_library[tag].name = $("#create-element-name").val();
 element_library[tag].source = $("#create-element-source").val();
 element_library[tag].uvalue = $("#create-element-uvalue").val();
 element_library[tag].kvalue = $("#create-element-kvalue").val();
 if (type == "Window")
 element_library[tag].g = $("#create-element-g").val();
 if (type == "Window")
 element_library[tag].gL = $("#create-element-gL").val();
 if (type == "Window")
 element_library[tag].ff = $("#create-element-ff").val();
 element_library[tag].tags = [type];
 //element_library[tag].criteria = $("#create-element-criteria").val().split(",");
 
 // Measures
 if ($('#create-element-name').val() !== "")
 element_library[tag].name = $("#create-element-name").val();
 if ($('#create-element-description').val() !== "")
 element_library[tag].description = $("#create-element-description").val();
 if ($('#create-element-performance').val() !== "")
 element_library[tag].performance = $("#create-element-performance").val();
 if ($('#create-element-benefits').val() !== "")
 element_library[tag].benefits = $("#create-element-benefits").val();
 if ($('#create-element-cost').val() !== "")
 element_library[tag].cost = $("#create-element-cost").val();
 if ($('#create-element-who_by').val() !== "")
 element_library[tag]["who_by"] = $("#create-element-who_by").val();
 if ($('#create-element-disruption').val() !== "")
 element_library[tag].disruption = $("#create-element-disruption").val();
 if ($('#create-element-associated_work').val() !== "")
 element_library[tag]["associated_work"] = $("#create-element-associated_work").val();
 if ($('#create-element-key_risks').val() !== "")
 element_library[tag]["key_risks"] = $("#create-element-key_risks").val();
 if ($('#create-element-notes').val() !== "")
 element_library[tag].notes = $("#create-element-notes").val();
 if ($('#create-element-maintenance').val() !== "")
 element_library[tag].maintenance = $("#create-element-maintenance").val();
 $.ajax({type: "POST", url: path + "assessment/savelibrary.json", data: "id=" + selected_library + "&data=" + JSON.stringify(element_library), success: function (result) {
 console.log("save library result: " + result);
 }});
 $("#myModalcreateelement").modal('hide');
 //} else {
 //    alert("Element or measure already exists");
 //}
 });*/

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
    $(id + " [row='template']").attr('row', z);
    $(id + " [item_id='template']").attr('item_id', data.fabric.elements[z].id);
    $(id + " [item='template']").attr('item', JSON.stringify(data.fabric.elements[z]));
    $(id + " [tag='template']").attr('tag', data.fabric.elements[z].lib);
}

function add_floor(z)
{
    var id = "#floors";
    var element = data.fabric.elements[z];

    $(id).append($("#floor-template").html());
    $(id + " [key='data.fabric.elements.template.type']").attr('key', 'data.fabric.elements.' + z + '.type');
    $(id + " [key='data.fabric.elements.template.name']").attr('key', 'data.fabric.elements.' + z + '.name');
    $(id + " [key='data.fabric.elements.template.location']").attr('key', 'data.fabric.elements.' + z + '.location');
    $(id + " [key='data.fabric.elements.template.lib']").attr('key', 'data.fabric.elements.' + z + '.lib');
    $(id + " [key='data.fabric.elements.template.l']").attr('key', 'data.fabric.elements.' + z + '.l');
    $(id + " [key='data.fabric.elements.template.h']").attr('key', 'data.fabric.elements.' + z + '.h');
    $(id + " [key='data.fabric.elements.template.area']").attr('key', 'data.fabric.elements.' + z + '.area');
    $(id + " [key='data.fabric.elements.template.uvalue']").attr('key', 'data.fabric.elements.' + z + '.uvalue');
    $(id + " [key='data.fabric.elements.template.kvalue']").attr('key', 'data.fabric.elements.' + z + '.kvalue');
    $(id + " [key='data.fabric.elements.template.wk']").attr('key', 'data.fabric.elements.' + z + '.wk');
    $(id + " [key='data.fabric.elements.template.EWI']").html(data.fabric.elements[z].EWI == true ? 'EWI' : '');
    $(id + " [key='data.fabric.elements.template.EWI']").removeAttr('key');
    $(id + " [row='template']").attr('row', z);
    $(id + " [item_id='template']").attr('item_id', data.fabric.elements[z].id);
    $(id + " [item='template']").attr('item', JSON.stringify(data.fabric.elements[z]));
    $(id + " [tag='template']").attr('tag', data.fabric.elements[z].lib);

    if (data.fabric.elements[z].uvalue == 0)
        $(id + " [key='data.fabric.elements." + z + ".uvalue']").css('color', 'red');
}

function add_window(z)
{
    var element = data.fabric.elements[z];

    $("#windows").append($("#window-template").html());
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
    $("#windows [tag='template']").attr('tag', data.fabric.elements[z].lib);
    $('#windows .window_fields_template').removeClass('window_fields_template');

    var name = data.fabric.elements[z].name;
    name = name.toLowerCase();
    if (data.fabric.elements[z].type == 'Door' || name.indexOf("door") != -1) {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#ffeeee');
    }

    if (data.fabric.elements[z].type == 'Roof_light' || name.indexOf("roof") != -1) {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#eeffee');
    }

    if (data.fabric.elements[z].type == 'Hatch') {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#ddeeff');
    }

    $("#windows [row='template']").attr('row', z);
    $("#windows [item_id='template']").attr('item_id', data.fabric.elements[z].id);
    $("#windows [item='template']").attr('item', JSON.stringify(data.fabric.elements[z]));

    var subtractfromhtml = "<option value='no' ></option>";
    for (i in data.fabric.elements) {
        // here
        if (data.fabric.elements[i].type != 'Window' && data.fabric.elements[i].type != 'Door' && data.fabric.elements[i].type != 'Roof_light' && data.fabric.elements[i].type != 'Floor' && data.fabric.elements[i].type != 'Hatch')
            subtractfromhtml += "<option value='" + data.fabric.elements[i].id + "'>" + data.fabric.elements[i].location + "</option>";
        //subtractfromhtml += "<option value='" + i + "'>" + data.fabric.elements[i].name + "</option>";
    }
    $("#windows [key='data.fabric.elements." + z + ".subtractfrom']").html(subtractfromhtml);
}

function elements_initUI()
{
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
        } else if (type == 'Floor' || type == 'floor') {
            add_floor(z);
        } else if (type == 'Roof' || type == 'roof') {
            add_element("#roofs", z);
        } else if (type == 'Window' || type == 'window' || type == 'Door' || type == 'Roof_light' || type == 'Hatch') {
            add_window(z);
        } else if (type == 'Party_wall' || type == 'party_wall') {
            add_element("#party_walls", z);
        }
    }

    // Enable/disable dropdown for global TMP
    if (data.fabric.global_TMP === 1)
        $("[key='data.fabric.global_TMP_value']").prop('disabled', false);
    else
        $("[key='data.fabric.global_TMP_value']").prop('disabled', true);

    /*loadlibrarylist(function () {
     loadlibrary(selected_library, function () {
     });
     });*/
}

function elements_UpdateUI()
{
    for (z in data.fabric.elements) {
        var color = "#fff";

        var name = data.fabric.elements[z].name;
        name = name.toLowerCase();

        if (data.fabric.elements[z].type == 'Door' || name.indexOf("door") != -1) {
            color = '#ffeeee';
        }

        if (data.fabric.elements[z].type == 'Roof_light' || name.indexOf("roof") != -1) {
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
    return max_id;
}


function apply_measure(measure) {
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
            if (measure.item[lib].EWI != undefined && measure.item[lib].EWI == true) {
                data.fabric.elements[measure.row].l = 0;
                data.fabric.elements[measure.row].h = 0;
                data.fabric.elements[measure.row].area = 1.15 * data.fabric.elements[measure.row].area;
            }

            console.log(measure);
        case 'replace':
        case 'edit':
            measure.item[lib].lib = lib;
            for (z in data.fabric.elements[measure.row]) { // We copy over all the properties that are not asked when applying measures, this are the ones that the user inputed like "length" and "height"
                if (measure.item[lib][z] == undefined)
                    measure.item[lib][z] = data.fabric.elements[measure.row][z];
            }
            // Add extra properties to measure 
            measure.item[lib].cost_units = '/sq m';
            measure.item[lib].quantity = measure.item[lib].area;
            measure.item[lib].cost_total = measure.item[lib].quantity * measure.item[lib].cost;
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

//-----------------------------------------------------------------------------------------------
// Element library
//-----------------------------------------------------------------------------------------------
/*
 function loadlibrarylist(callback) {
 var mylibraries = [];
 
 $.ajax({url: path + "assessment/listlibrary.json", datatype: "json", success: function (result) {
 mylibraries = result;
 
 var standardlibcreated = false;
 for (z in mylibraries) {
 if (mylibraries[z].name.indexOf("StandardLibrary") > -1)
 standardlibcreated = true;
 }
 
 if (!standardlibcreated)
 {
 var library_name = "StandardLibrary - " + p.author
 $.ajax({url: path + "assessment/newlibrary.json", data: "name=" + library_name, datatype: "json", async: false, success: function (result) {
 selected_library = result;
 element_library = standard_element_library;
 mylibraries[0] = {id: selected_library, name: library_name};
 $.ajax({type: "POST", url: path + "assessment/savelibrary.json", data: "id=" + selected_library + "&data=" + JSON.stringify(element_library), success: function (result) {
 console.log("save library result: " + result);
 }});
 }});
 }
 
 selected_library = mylibraries[0].id;
 
 var out = "";
 for (z in mylibraries) {
 out += "<option value=" + mylibraries[z].id + ">" + mylibraries[z].name + "</option>";
 }
 
 out += "<option value=-1 class='newlibraryoption' style='background-color:#eee'>Create new</option>";
 $("#library-select").html(out);
 $("#library-select").val(selected_library);
 
 callback();
 }});
 }
 
 function loadlibrary(id, callback) {
 element_library = {};
 // selected_library = id
 // try loading the library from the database
 $.ajax({url: path + "assessment/loadlibrary.json", data: "id=" + id, datatype: "json", success: function (result) {
 element_library = result;
 // check if library is empty
 var num = 0;
 for (z in element_library)
 num++;
 // if empty load standard library
 // if (num==0) element_library = standard_element_library;
 callback();
 }});
 }
 */
/*$("#openbem").on("click", '.add-element-from-lib', function () {
 selected_library_tag = $(this).attr("tags");
 draw_library(selected_library_tag);
 });
 
 function draw_library(tag)
 {
 var out = "";
 for (z in element_library) {
 if (element_library[z].tags.indexOf(tag) != -1) {
 out += "<tr class='librow' lib='" + z + "' type='" + tag + "'>";
 out += "<td style='width:20px;'>" + z + "</td>";
 
 out += "<td style='width:200px;'>" + element_library[z].name;
 out += "<br><span style='font-size:13px'><b>Source:</b> " + element_library[z].source + "</span>";
 /*if (element_library[z].criteria.length)
 out += "<br><span style='font-size:13px'><b>Measure criteria:</b> " + element_library[z].criteria.join(", ") + "</span>";
 *//*
  out += "</td>";
  out += "<td style='width:200px; font-size:13px'>";
  out += "<b>U-value:</b> " + element_library[z].uvalue + " W/K.m2";
  out += "<br><b>k-value:</b> " + element_library[z].kvalue + " kJ/K.m2";
  if (element_library[z].tags[0] == "Window") {
  out += "<br><b>g:</b> " + element_library[z].g + ", ";
  out += "<b>gL:</b> " + element_library[z].gL + ", ";
  out += "<b>ff:</b> " + element_library[z].ff;
  }
  out += "</td>";
  out += "<td style='width:120px' >";
  out += "<i style='cursor:pointer' class='icon-pencil edit-element' lib='" + z + "' type='" + tag + "'></i>";
  // out += "<i class='icon-trash' style='margin-left:20px'></i>";
  out += "<button class='add-element btn' style='margin-left:20px' lib='" + z + "' type='" + tag + "'>use</button</i>";
  out += "</td>";
  out += "</tr>";
  }
  }
  $("#element_library").html(out);
  $('#myModal').css({left: '50%'});
  $('#myModal').modal('show');
  }*/
/*
 $("#openbem").on("click", '.apply-measure-list', function () {
 var row = $(this).attr('row');
 var element = data.fabric.elements[row];
 var measure_options = ["description", "performance", "benefits", "cost", "who_by", "disruption", "associated_work", "key_risks", "notes", "maintenance"];
 // The header of the table
 var out = '<tr class="librow apply-measure"><th>Tag</th><th>Name</th><th>Source</th><th>U-value</th><th>K-value</th>';
 out += '<th class="element-window-option">g</th><th class="element-window-option">gL</th><th class="element-window-option">Frame factor (ff)</th>';
 out += '<th>Code</th><th>Description</th><th>Performance</th><th>Benefits</th><th>Cost</th><th>Who by</th><th>Disruption</th><th>Associated work</th><th>Key risks</th><th>Notes</th><th>Maintenance</th></tr>';
 // The rest of the table
 for (z in element_library) {
 /* for (i in measure_options) {
 if (element_library[z][i] === undefined)
 element_library[z][measure_options[i]] = "";
 }*/
//if (element_library[z].criteria.indexOf(element.lib) != -1) {
/*if (element_library[z].tags[0].toLowerCase() == element.type) {
 out += "<tr class='librow apply-measure' lib='" + z + "' row='" + row + "' item_id='" + element.id + "' style='cursor:pointer'>";
 out += "<td>" + z + "</td>";
 out += "<td>" + element_library[z].name + "</td>";
 out += "<td>" + element_library[z].source + "</td>";
 out += "<td>" + element_library[z].uvalue + " W/K.m2</td>";
 out += "<td>" + element_library[z].kvalue + " kJ/K.m2</td>";
 out += "<td class='element-window-option'>" + element_library[z].g + " kJ/K.m2</td>";
 out += "<td class='element-window-option'>" + element_library[z].gL + " kJ/K.m2</td>";
 out += "<td class='element-window-option'>" + element_library[z].ff + " kJ/K.m2</td>";
 out += "<td>" + element_library[z].description + "</td>";
 out += "<td>" + element_library[z].performance + "</td>";
 out += "<td>" + element_library[z].benefits + "</td>";
 out += "<td>" + element_library[z].cost + "</td>";
 out += "<td>" + element_library[z].who_by + "</td>";
 out += "<td>" + element_library[z].disruption + "</td>";
 out += "<td>" + element_library[z].associated_work + "</td>";
 out += "<td>" + element_library[z].key_risks + "</td>";
 out += "<td>" + element_library[z].notes + "</td>";
 out += "<td>" + element_library[z].maintenance + "</td>";
 // out += "<td>"+element_library[z].criteria.join(",")+"</td>";
 out += "</tr>";
 }
 }
 $("#element_library").html(out);
 if (element.type == "window") {
 $('.element-window-option').show('fast');
 $('#myModal').css({left: 450});
 }
 else {
 $('.element-window-option').hide('fast');
 $('#myModal').css({left: 650});
 }
 
 $('#myModal').modal('show');
 });
 */
/*$("#openbem").on("click", '.changed-apply-measure', function () {
 var lib = $(this).attr('lib');
 var row = $(this).attr('row');
 var item_id = $(this).attr('item_id');
 
 if (data.fabric.measures[item_id] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
 data.fabric.measures[item_id] = {};
 data.fabric.measures[item_id].original_element = JSON.parse(JSON.stringify(data.fabric.elements[row]));
 }
 
 if (lib != undefined) {
 for (z in element_library[lib])
 data.fabric.elements[row][z] = element_library[lib][z];
 data.fabric.elements[row].lib = lib;
 }
 
 data.fabric.measures[item_id].measure = data.fabric.elements[row];
 update();
 $('#myModal').modal('hide');
 });*/



/*
 $("#openbem").on("click", ".edit-element", function () {
 var lib = $(this).attr('lib');
 var type = element_library[lib].tags[0];
 $("#create-element-tag").val(lib);
 $("#create-element-name").val(element_library[lib].name);
 $("#create-element-source").val(element_library[lib].source);
 $("#create-element-uvalue").val(element_library[lib].uvalue);
 $("#create-element-kvalue").val(element_library[lib].kvalue);
 //$("#create-element-criteria").val(element_library[lib].criteria.join(","));
 
 $("#create-element-type").val(type);
 if (type == "Window") {
 $("#create-element-g").val(element_library[lib].g);
 $("#create-element-gL").val(element_library[lib].gL);
 $("#create-element-ff").val(element_library[lib].ff);
 $(".create-element-window-options").show('fast');
 }
 else
 $(".create-element-window-options").hide('fast');
 $("#myModalcreateelement").modal('show');
 $('#myModal').modal('hide');
 });
 $("#openbem").on("click", ".newlibraryoption", function () {
 $(".library-select-view").hide('fast');
 $(".new-library-view").show('fast');
 });
 $("#openbem").on("click", "#newlibrary", function () {
 var name = $("#newlibrary-name").val();
 console.log("newlibrary:" + name);
 $.ajax({url: path + "assessment/newlibrary.json", data: "name=" + name, datatype: "json", success: function (result) {
 console.log("result: " + result);
 loadlibrarylist();
 $(".library-select-view").show('fast');
 $(".new-library-view").hide('fast');
 }});
 });
 $("#library-select").change(function () {
 var id = $(this).val() * 1.0;
 if (id != -1) {
 console.log(id);
 selected_library = id;
 loadlibrary(id, function () {
 draw_library(selected_library_tag);
 });
 }
 });
 $("#openbem").on("click", "#cancelnewlibrary", function () {
 $(".library-select-view").show('fast');
 $(".new-library-view").hide('fast');
 });
 $("#open-share-library").click(function () {
 $("#modal-share-library").modal('show');
 $('#myModal').modal('hide');
 $.ajax({url: path + "assessment/getsharedlibrary.json", data: "id=" + selected_library, success: function (shared) {
 var out = "<tr><th>Shared with:</th><th>Has write persmissions</th><th></th></tr>";
 var write = "";
 for (var i in shared) {
 console.log(shared);
 write = shared[i].write == 1 ? 'Yes' : 'No';
 // if (myusername!=shared[i].username) 
 out += "<tr><td>" + shared[i].username + "</td><td>" + write + "</td><td><i style='cursor:pointer' class='icon-trash remove-user' userid='" + shared[i].userid + "'></i></td></tr>";
 }
 if (out == "<tr><th>Shared with:</th><th>Has write persmissions</th><th></th></tr>")
 out = "<tr><td colspan='3'>This library is currently private</td></tr>";
 $("#shared-with-table").html(out);
 }});
 });
 $("#share-library").click(function () {
 $('#return-message').html('');
 var username = $("#sharename").val();
 var write_permissions = $('#write_permissions').is(":checked");
 
 if (selected_library != -1) {
 $.ajax({
 url: path + "assessment/sharelibrary.json",
 data: "id=" + selected_library + "&name=" + username + "&write_permissions=" + write_permissions,
 success: function (data) {
 $('#return-message').html(data);
 $.ajax({url: path + "assessment/getsharedlibrary.json", data: "id=" + selected_library, success: function (shared) {
 var out = "<tr><th>Shared with:</th><th>Has write persmissions</th></tr>";
 var write = "";
 for (var i in shared) {
 write = shared[i].write == 1 ? 'Yes' : 'No';
 // if (myusername!=shared[i].username) 
 out += "<tr><td>" + shared[i].username + "</td><td>" + write + "</td></tr>";
 }
 if (out == "")
 out = "<tr><td colspan='2'>This library is currently private</td></tr>";
 $("#shared-with-table").html(out);
 }});
 }});
 }
 });*/

