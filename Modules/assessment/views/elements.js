console.log('debug elements.js');
console.log(data.fabric.measures);
$("#openbem").on("click", '.add-element', function () {

    var lib = $(this).attr("lib");
    var type = $(this).attr("type").toLowerCase();
    var element_id = get_elements_max_id() + 1;
    // Create default element
    var element = {type: type, name: type, lib: lib, l: 0, h: 0, area: 0, uvalue: 0, kvalue: 0, wk: 0, id: element_id};
    // If library is defined replace defaults with parameters from library
    if (lib != undefined) {
        for (z in element_library[lib])
            element[z] = element_library[lib][z];
    }

    if (type == "window") {
        element.orientation = 3;
        element.overshading = 2;
    }

    data.fabric.elements.push(element);
    var newelementid = data.fabric.elements.length - 1;
    if (type == "wall")
        add_element("#elements", newelementid);
    if (type == "roof")
        add_element("#roofs", newelementid);
    if (type == "floor")
        add_element("#floors", newelementid);
    if (type == "window")
        add_window(newelementid);
    update();
    if (type != "window" && type != "floor") {
        for (z in data.fabric.elements) {
            if (data.fabric.elements[z].type == "window") {
                $("#windows [key='data.fabric.elements." + z + ".subtractfrom']").append("<option value='" + newelementid + "'>" + data.fabric.elements[newelementid].name + "</option>");
            }
        }
    }

    $('#myModal').modal('hide');
});
$("#openbem").on("click", '.delete-element', function () {
    var row = $(this).attr('row');
    var element_id = 1.0 * $(this).attr('element_id');

    $(this).closest('tr').remove();
    data.fabric.elements.splice(row, 1);

    // Deleting an element is considered a measure
    if (data.fabric.measures[element_id] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.fabric.measures[element_id] = {};
        data.fabric.measures[element_id].original_element = JSON.parse(JSON.stringify(data.fabric.elements[row]));
    }
    data.fabric.measures[element_id].measure = "Element deleted";

    elements_initUI();
    update();
});
$("#create-element").click(function () {
// Empty "tag" so that it has nothing, we leave the other inputs as it can be handy for the user
    $('#create-element-tag').val("");
    $("#myModalcreateelement").modal('show');
    $('#myModal').modal('hide');
});
$("#create-element-type").change(function () {
    var type = $(this).val();
    if (type == "Window") {
        $(".create-element-window-options").show();
    } else {
        $(".create-element-window-options").hide();
    }
});
$("#create-element-save").click(function () {

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
    if ($('#create-element-performance-units').val() !== "")
        element_library[tag].performance_units = $("#create-element-performance-units").val();
    if ($('#create-element-benefits').val() !== "")
        element_library[tag].benefits = $("#create-element-benefits").val();
    if ($('#create-element-cost').val() !== "")
        element_library[tag].cost = $("#create-element-cost").val();
    if ($('#create-element-cost-units').val() !== "")
        element_library[tag].cost_units = $("#create-element-cost-units").val();
    if ($('#create-element-cost-quantity').val() !== "")
        element_library[tag].cost_quantity = $("#create-element-cost-quantity").val();
    if ($('#create-element-cost-total').val() !== "")
        element_library[tag].cost_total = $("#create-element-cost-total").val();
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
    $(id).append($("#element-template").html());
    $(id + " [key='data.fabric.elements.template.type']").attr('key', 'data.fabric.elements.' + z + '.type');
    $(id + " [key='data.fabric.elements.template.name']").attr('key', 'data.fabric.elements.' + z + '.name');
    $(id + " [key='data.fabric.elements.template.lib']").attr('key', 'data.fabric.elements.' + z + '.lib');
    $(id + " [key='data.fabric.elements.template.l']").attr('key', 'data.fabric.elements.' + z + '.l');
    $(id + " [key='data.fabric.elements.template.h']").attr('key', 'data.fabric.elements.' + z + '.h');
    $(id + " [key='data.fabric.elements.template.area']").attr('key', 'data.fabric.elements.' + z + '.area');
    $(id + " [key='data.fabric.elements.template.windowarea']").attr('key', 'data.fabric.elements.' + z + '.windowarea');
    $(id + " [key='data.fabric.elements.template.netarea']").attr('key', 'data.fabric.elements.' + z + '.netarea');
    $(id + " [key='data.fabric.elements.template.uvalue']").attr('key', 'data.fabric.elements.' + z + '.uvalue');
    $(id + " [key='data.fabric.elements.template.kvalue']").attr('key', 'data.fabric.elements.' + z + '.kvalue');
    $(id + " [key='data.fabric.elements.template.wk']").attr('key', 'data.fabric.elements.' + z + '.wk');
    $(id + " [row='template']").attr('row', z);
    $(id + " [element_id='template']").attr('element_id', data.fabric.elements[z].id);
}

function add_window(z)
{
    $("#windows").append($("#window-template").html());
    $("#windows [key='data.fabric.elements.template.lib']").attr('key', 'data.fabric.elements.' + z + '.lib');
    $("#windows [key='data.fabric.elements.template.name']").attr('key', 'data.fabric.elements.' + z + '.name');
    $("#windows [key='data.fabric.elements.template.description']").attr('key', 'data.fabric.elements.' + z + '.description');
    $("#windows [key='data.fabric.elements.template.subtractfrom']").attr('key', 'data.fabric.elements.' + z + '.subtractfrom');
    $("#windows [key='data.fabric.elements.template.l']").attr('key', 'data.fabric.elements.' + z + '.l');
    $("#windows [key='data.fabric.elements.template.h']").attr('key', 'data.fabric.elements.' + z + '.h');
    $("#windows [key='data.fabric.elements.template.area']").attr('key', 'data.fabric.elements.' + z + '.area');
    $("#windows [key='data.fabric.elements.template.uvalue']").attr('key', 'data.fabric.elements.' + z + '.uvalue');
    $("#windows [key='data.fabric.elements.template.orientation']").attr('key', 'data.fabric.elements.' + z + '.orientation');
    $("#windows [key='data.fabric.elements.template.overshading']").attr('key', 'data.fabric.elements.' + z + '.overshading');
    $("#windows [key='data.fabric.elements.template.g']").attr('key', 'data.fabric.elements.' + z + '.g');
    $("#windows [key='data.fabric.elements.template.gL']").attr('key', 'data.fabric.elements.' + z + '.gL');
    $("#windows [key='data.fabric.elements.template.ff']").attr('key', 'data.fabric.elements.' + z + '.ff');
    $("#windows [key='data.fabric.elements.template.wk']").attr('key', 'data.fabric.elements.' + z + '.wk');
    $("#windows [key='data.fabric.elements.template.gain']").attr('key', 'data.fabric.elements.' + z + '.gain');
    var name = data.fabric.elements[z].name;
    name = name.toLowerCase();
    if (name.indexOf("door") != -1) {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#ffeeee');
    }

    if (name.indexOf("roof") != -1) {
        $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', '#eeffee');
    }

    $("#windows [row='template']").attr('row', z);
    $("#windows [element_id='template']").attr('element_id', data.fabric.elements[z].id);
    var subtractfromhtml = "<option value='no' ></option>";
    for (i in data.fabric.elements) {
        if (data.fabric.elements[i].type != 'window' && data.fabric.elements[i].type != 'floor')
            subtractfromhtml += "<option value='" + i + "'>" + data.fabric.elements[i].name + "</option>";
    }
    $("#windows [key='data.fabric.elements." + z + ".subtractfrom']").html(subtractfromhtml);
}

function elements_initUI()
{
    if (data.fabric.measures == undefined) // Normally this is done in model-rX.js. The model is intended for calculations so i prefer to initialize data.fabric.measures here
        data.fabric.measures = {};

    /**************************************************************************
     /* FOR BACKWARDS COMPATIBILITY
     * We have just added "id" to the elements so 
     * that we can track measures apply to the one specific element the following 
     * code will allow us create id for elements that were in the data object 
     ***************************************************************************/
    var max_id = get_elements_max_id();
    // Add "id" to the elemments that have not got it
    for (z in data.fabric.elements) {
        if (data.fabric.elements[z].id == undefined) {
            data.fabric.elements[z].id = max_id++;
        }
    }
    // End backwards compatibility for "ids"

    /**************************************************************************
     /* FOR BACKWARDS COMPATIBILITY
     * We have just added "description","performance","benefits","cost","who_by",
     * "who_by","disruption","associated_work","key_risks","notes" and "maintenance" 
     * to the measures. We initialize them if they are empty (measures that were 
     * applied before the addition)
     ***************************************************************************/
    for (z in data.fabric.measures) {
        check_and_add_measure_fields(data.fabric.measures[z].measure);
    }
    // End backwards compatibility for "description","performance","benefits","cost","who_by",
     //  "who_by","disruption","associated_work","key_risks","notes" and "maintenance"

    $("#elements").html("");
    $("#roofs").html("");
    $("#floors").html("");
    $("#windows").html("");

    // Initial addition of floors
    for (z in data.fabric.elements) {
        if (data.fabric.elements[z].type == 'wall') {
            add_element("#elements", z);
        } else if (data.fabric.elements[z].type == 'floor') {
            add_element("#floors", z);
        } else if (data.fabric.elements[z].type == 'roof') {
            add_element("#roofs", z);
        } else if (data.fabric.elements[z].type == 'window') {
            add_window(z);
        }
    }

    // Enable/disable dropdown for global TMP
    if (data.fabric.global_TMP === 1)
        $("[key='data.fabric.global_TMP_value']").prop('disabled', false);
    else
        $("[key='data.fabric.global_TMP_value']").prop('disabled', true);

    loadlibrarylist(function () {
        loadlibrary(selected_library, function () {
        });
    });
}

function elements_UpdateUI()
{
    for (z in data.fabric.elements) {

        if (data.fabric.elements[z].type == 'window') {
            var name = data.fabric.elements[z].name;
            name = name.toLowerCase();

            var color = "#fff";
            if (name.indexOf("door") != -1)
                color = '#ffeeee';
            if (name.indexOf("roof") != -1)
                color = '#ddffdd';

            $("#windows [key='data.fabric.elements." + z + ".name']").parent().parent().css('background-color', color);

        }
    }
}

function get_elements_max_id() {
    var max_id = 0;
    // Find the max id
    for (z in data.fabric.elements) {
        if (data.fabric.elements[z].id != undefined && data.fabric.elements[z].id > max_id)
            max_id = data.fabric.elements[z].id;
    }    
    for (z in data.fabric.measures){
        if (data.fabric.measures[z].id != undefined && data.fabric.measures[z].original_element.id > max_id)
            max_id = data.fabric.measures[z].id;
    }
    return max_id;
}

//-----------------------------------------------------------------------------------------------
// Element library
//-----------------------------------------------------------------------------------------------

function loadlibrarylist(callback) {
    var mylibraries = [];

    $.ajax({url: path + "assessment/listlibrary.json", datatype: "json", success: function (result) {
            mylibraries = result;

            var standardlibcreated = false;
            for (z in mylibraries) {
                if (mylibraries[z].name == "StandardLibrary")
                    standardlibcreated = true;
            }

            if (!standardlibcreated)
            {
                $.ajax({url: path + "assessment/newlibrary.json", data: "name=StandardLibrary", datatype: "json", async: false, success: function (result) {
                        selected_library = result;
                        element_library = standard_element_library;
                        mylibraries[0] = {id: selected_library, name: "StandardLibrary"};
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

$("#openbem").on("click", '.add-element-from-lib', function () {
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
             */
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
}

function get_element_value(element) {
    return element;
}

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
        $(".create-element-window-options").show();
    }
    else
        $(".create-element-window-options").hide();
    $("#myModalcreateelement").modal('show');
    $('#myModal').modal('hide');
});
$("#openbem").on("click", ".newlibraryoption", function () {
    $(".library-select-view").hide();
    $(".new-library-view").show();
});
$("#openbem").on("click", "#newlibrary", function () {
    var name = $("#newlibrary-name").val();
    console.log("newlibrary:" + name);
    $.ajax({url: path + "assessment/newlibrary.json", data: "name=" + name, datatype: "json", success: function (result) {
            console.log("result: " + result);
            loadlibrarylist();
            $(".library-select-view").show();
            $(".new-library-view").hide();
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
    $(".library-select-view").show();
    $(".new-library-view").hide();
});
$("#open-share-library").click(function () {
    $("#modal-share-library").modal('show');
    $('#myModal').modal('hide');
    $.ajax({url: path + "assessment/getsharedlibrary.json", data: "id=" + selected_library, success: function (shared) {
            var out = "";
            for (var i in shared) {
                // if (myusername!=shared[i].username) 
                out += "<tr><td>" + shared[i].username + "</td></tr>";
            }
            if (out == "")
                out = "<tr><td>This library is currently private</td></tr>";
            $("#shared-with-table").html(out);
        }});
});
$("#share-library").click(function () {
    var username = $("#sharename").val();
    if (selected_library != -1) {
        $.ajax({
            url: path + "assessment/sharelibrary.json",
            data: "id=" + selected_library + "&name=" + username,
            success: function (data) {

                $.ajax({url: path + "assessment/getsharedlibrary.json", data: "id=" + selected_library, success: function (shared) {
                        var out = "";
                        for (var i in shared) {
                            // if (myusername!=shared[i].username) 
                            out += "<tr><td>" + shared[i].username + "</td></tr>";
                        }
                        if (out == "")
                            out = "<tr><td>This library is currently private</td></tr>";
                        $("#shared-with-table").html(out);
                    }});
            }});
    }
});


//------------------------------------------------------------------------------
// Measures
//------------------------------------------------------------------------------

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
        if (element_library[z].tags[0].toLowerCase() == element.type) {
            out += "<tr class='librow apply-measure' lib='" + z + "' row='" + row + "' element_id='" + element.id + "' style='cursor:pointer'>";
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
        $('.element-window-option').show();
        $('#myModal').css({left: 450});
    }
    else {
        $('.element-window-option').hide();
        $('#myModal').css({left: 650});
    }

    $('#myModal').modal('show');
});
$("#openbem").on("click", '.apply-measure', function () {
    var lib = $(this).attr('lib');
    var row = $(this).attr('row');
    var element_id = $(this).attr('element_id');

    if (data.fabric.measures[element_id] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.fabric.measures[element_id] = {};
        data.fabric.measures[element_id].original_element = JSON.parse(JSON.stringify(data.fabric.elements[row]));
    }

    if (lib != undefined) {
        for (z in element_library[lib])
            data.fabric.elements[row][z] = element_library[lib][z];
        check_and_add_measure_fields(data.fabric.elements[row]); // If the element in the library was not created as a measure, the specific measure fields (description, performance, cost...) will be missing
        data.fabric.elements[row].lib = lib;
    }

    data.fabric.measures[element_id].measure = data.fabric.elements[row];
    update();
    console.log(data.fabric.measures);
    $('#myModal').modal('hide');
});

function check_and_add_measure_fields(element) {
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
