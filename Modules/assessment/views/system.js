console.log("debug systems.js");

if (typeof library_helper != "undefined")
    library_helper.type = 'systems';
else
    var library_helper = new libraryHelper('systems', $("#openbem"));

$("#openbem").on("click", '.add-system', function () {
    var system = $(this).attr('system');
    var eid = $(this).attr('eid');
    var library = library_helper.get_library_by_id($(this).attr('library'));
    var system_id = 1 + get_systems_max_id();

    var system_to_add = JSON.parse(JSON.stringify(library.data[system]));
    system_to_add.system = system;
    system_to_add.fraction = 1.0;
    system_to_add.id = system_id;
    system_to_add.demand = data.energy_requirements[eid].quantity;

    //data.energy_systems[eid].push({system: system, fraction: 1.0});
    data.energy_systems[eid].push(system_to_add);
    $("#modal-system-library").modal("hide");
    update();
});

$("#openbem").on("click", '.delete-system', function () {
    var sid = $(this).attr('sid');
    var eid = $(this).attr('eid');
    data.energy_systems[eid].splice(sid, 1);
    update();
});

function system_UpdateUI()
{
    $("#energyrequirements").html("");
    for (z in data.energy_requirements)
    {
        $("#energyrequirements").append($("#energyrequirement-template").html());
        $("#energyrequirements [key='data.energy_requirements.template.name']").attr('key', 'data.energy_requirements.' + z + '.name');
        $("#energyrequirements [key='data.energy_requirements.template.quantity']").attr('key', 'data.energy_requirements.' + z + '.quantity');
        $("#energyrequirements [eid=template]").attr('eid', z);

        if (z == 'space_heating')
            $("#energyrequirements .secondary-space-heating.template").show();
        $("#energyrequirements .secondary-space-heating.template").removeClass('template');
        //if (z == 'solarpv' || z == 'wind' || z == 'hydro' || z == 'solarpv2')
        //  $("#energyrequirements [eid='" + z + "']").hide();

        for (x in data.energy_systems[z])
            add_energy_system(z, x);
    }

    $('#generation').html("");
    if (data.use_generation != 1) {
        $('#generation-container').hide();
        $("#fit_income").html('£0');
    }
    else {
        $('#generation-container').show();
        $("#fit_income").html('<b>£<span key="data.total_income" dp=0></span></b>');
        for (z in data.generation.systems) {
            $('#generation').append($('#suppliedby-generation-template').html());
            $("#generation [key='data.generation.template.x.name']").attr('key', 'data.generation.systems.' + z + '.name');
            $("#generation [key='data.generation.template.x.quantity']").attr('key', 'data.generation.systems.' + z + '.quantity');
            $("#generation [key='data.generation.template.x.CO2']").attr('key', 'data.generation.systems.' + z + '.CO2');
        }
    }

    $("#fuel_totals").html("");
    for (z in data.fuel_totals)
    {
        $("#fuel_totals").append($("#fuel_totals_template").html());
        $("#fuel_totals [key='data.fuel_totals.z.name']").attr('key', 'data.fuel_totals.' + z + '.name');
        $("#fuel_totals [key='data.fuel_totals.z.quantity']").attr('key', 'data.fuel_totals.' + z + '.quantity');
        $("#fuel_totals [key='data.fuel_totals.z.primaryenergy']").attr('key', 'data.fuel_totals.' + z + '.primaryenergy');
        $("#fuel_totals [key='data.fuel_totals.z.annualco2']").attr('key', 'data.fuel_totals.' + z + '.annualco2');

        $("#fuel_totals [key='data.fuel_totals.z.annualcost']").attr('key', 'data.fuel_totals.' + z + '.annualcost');
        $("#fuel_totals [key='data.fuels.f.standingcharge']").attr('key', 'data.fuels.' + z + '.standingcharge');

        $("#fuel_totals [key='data.fuels.f.fuelcost']").attr('key', 'data.fuels.' + z + '.fuelcost');
        $("#fuel_totals [key='data.fuels.f.primaryenergyfactor']").attr('key', 'data.fuels.' + z + '.primaryenergyfactor');
        $("#fuel_totals [key='data.fuels.f.co2factor']").attr('key', 'data.fuels.' + z + '.co2factor');
    }
}

// Automatically load efficiency for heating system when heating system is changed
$("#openbem").on("change", '.heating_system_selector', function () {
    var system = $(this).val();
    var x = $(this).attr("x");
    var z = $(this).attr("z");
});

function add_energy_system(z, x)
{
    $("#energyrequirements").append($("#suppliedby-template").html());
    var prefixA = "#energyrequirements [key='data.energy_systems.template.x";
    var prefixB = 'data.energy_systems.' + z + '.' + x;
    $(prefixA + ".system']").attr('key', prefixB + '.system');
    $(prefixA + ".name']").attr('key', prefixB + '.name');
    $(prefixA + ".description']").attr('key', prefixB + '.description');
    $(prefixA + ".fraction']").attr('key', prefixB + '.fraction');
    $(prefixA + ".demand']").attr('key', prefixB + '.demand');
    $(prefixA + ".efficiency']").attr('key', prefixB + '.efficiency');
    $(prefixA + ".fuelinput']").attr('key', prefixB + '.fuelinput');

    $("#energyrequirements [eid='eid']").attr('eid', z);
    $("#energyrequirements [sid='sid']").attr('sid', x);
    $("#energyrequirements [row='template']").attr('row', x);
    $("#energyrequirements [item='template']").attr('item', JSON.stringify(data.energy_systems[z][x]));
    $("#energyrequirements [tag='template']").attr('tag', data.energy_systems[z][x].system);
    $("#energyrequirements [type-of-item='template']").attr('type-of-item', z);
    $("#energyrequirements [item_id='template']").attr('item_id', data.energy_systems[z][x].id);

    $("#energyrequirements [z='tmp']").attr('z', z);
    $("#energyrequirements [x='tmp']").attr('x', x);

    if (z == 'space_heating') {
        $("#energyrequirements [key='data.energy_systems.template.x.secondary']").attr('key', prefixB + '.secondary');
        $("#energyrequirements .secondary-space-heating.template").show();
    }
    $("#energyrequirements .secondary-space-heating.template").removeClass('template');

    if (z == 'solarpv' || z == 'wind' || z == 'hydro' || z == 'solarpv2') {
        $('#energyrequirements .fraction.template').html('');
        $('#energyrequirements .fraction.template').html('<span key="' + prefixB + '.fraction" style="margin-left:0px" dp="2" />');
        $('#energyrequirements .suppliedby-template-buttons').html('');
    }
    $('#energyrequirements .fraction.template').removeClass('template');
    $('#energyrequirements .suppliedby-template-buttons').removeClass('suppliedby-template-buttons');






}

function system_initUI()
{
    if (data.measures.energy_systems == undefined) // Normally this is done in model-rX.js. The model is intended for calculations so i prefer to initialize data.measures.energy_systems here
        data.measures.energy_systems = {};

    /**************************************************************************
     /* FOR BACKWARDS COMPATIBILITY
     * We have just added "id" to the systems so 
     * that we can track measures applied to a specific system. The following 
     * code will allow us create id for systems that were in the data object before
     ***************************************************************************/
    var max_id = get_systems_max_id();
    // Add "id" to the elemments that have not got it
    for (z in data.energy_systems) {
        for (i in data.energy_systems[z]) {
            if (data.energy_systems[z][i].id == undefined) {
                data.energy_systems[z][i].id = max_id++;
            }
        }
    }
    // End backwards compatibility for "ids"

    /**************************************************************************
     /* FOR BACKWARDS COMPATIBILITY
     * We have just added "description","performance","benefits","cost","who_by",
     * "who_by","disruption","associated_work","key_risks","notes" and "maintenance" 
     * to the systems. We initialize them if they are empty (systems that were 
     * created before the addition)
     ***************************************************************************/
    for (z in data.energy_systems) {
        for (i in data.energy_systems[z]) {
            if (data.energy_systems[z][i].description == undefined)
                data.energy_systems[z][i].description = '--';
            if (data.energy_systems[z][i].performance == undefined)
                data.energy_systems[z][i].performance = '--';
            if (data.energy_systems[z][i].benefits == undefined)
                data.energy_systems[z][i].benefits = '--';
            if (data.energy_systems[z][i].cost == undefined)
                data.energy_systems[z][i].cost = '--';
            if (data.energy_systems[z][i].who_by == undefined)
                data.energy_systems[z][i].who_by = '--';
            if (data.energy_systems[z][i].disruption == undefined)
                data.energy_systems[z][i].disruption = '--';
            if (data.energy_systems[z][i].associated_work == undefined)
                data.energy_systems[z][i].associated_work = '--';
            if (data.energy_systems[z][i].key_risks == undefined)
                data.energy_systems[z][i].key_risks = '--';
            if (data.energy_systems[z][i].notes == undefined)
                data.energy_systems[z][i].notes = '--';
            if (data.energy_systems[z][i].maintenance == undefined)
                data.energy_systems[z][i].maintenance = '--';
        }
    }
    // End backwards compatibility for "description","performance","benefits","cost","who_by",
    //  "who_by","disruption","associated_work","key_risks","notes" and "maintenance"



    // Add different types of fuel to the Add/edit system modal 
    /*
     for (z in data.fuels) {
     $(".edit-system-fuel").append($('<option>', {
     value: z,
     text: z
     }));
     }
     */

    //var out = "";
    //for (z in datasets.energysystems) out += "<option value='"+z+"'>"+datasets.energysystems[z].name+"</option>";
    //$(".heating_system_selector").html(out);
}

function edit_item(system, row, type_of_item) {
    for (index in system)
        system = system[index]; // system comes in the format: system = {electric:{bla bla bla}} and we transform it to: system = {bla bla bla}

    for (z in data.energy_systems[type_of_item][row]) { // We copy over all the properties that are not asked when editting an system, this are the ones that the user inputed like "notes" and "fraction"
        if (system[z] == undefined)
            system[z] = data.energy_systems[type_of_item][row][z];
    }

    data.energy_systems[type_of_item][row] = system;

    system_UpdateUI();
    update();
}

function get_systems_max_id() {
    var max_id = 0;
    // Find the max id
    for (z in data.energy_systems) {
        for (i in data.energy_systems[z]) {
            if (data.energy_systems[z][i].id != undefined && data.energy_systems[z][i].id > max_id)
                max_id = data.energy_systems[z][i].id;
        }
    }
    for (z in data.measures.energy_systems) {
        if (z > max_id)
            max_id = z;
    }
    return max_id;
}

function apply_measure(measure) {
    var requirement = measure.requirement;
    // The first time we apply a measure to an element we record its original stage
    if (data.measures.energy_systems[measure.item_id] == undefined) { // If it is the first time we apply a measure to this element iin this scenario
        data.measures.energy_systems[measure.item_id] = {};
        data.measures.energy_systems[measure.item_id].original_element = JSON.parse(JSON.stringify(data.energy_systems[requirement][measure.row]));
    }

    switch (measure.type) {
        case 'remove':
            var selector = '[row="' + measure.row + '"]'
            $(selector).closest('tr').remove();
            data.energy_systems[requirement].splice(measure.row, 1);
            data.measures.energy_systems[measure.item_id].measure = "Element deleted";
            break;
        case 'replace':
        case 'edit':
            console.log(measure);
            for (z in measure.item) // measure.item only has one element, we do it this way to the "property", in this case somemthing like "CV1" oof "ROOF1"
                var system = z;
            measure.item[system].system = system;
            for (z in data.energy_systems[requirement][measure.row]) { // We copy over all the properties that are not asked when applying measures, this are the ones that the user inputed like "notes" and "fraction"
                if (measure.item[system][z] == undefined)
                    measure.item[system][z] = data.energy_systems[requirement][measure.row][z];
            }
            //console.log(data.energy_systems.elements[measure.row]);
            data.measures.energy_systems[measure.item_id].measure = measure.item[system];
            data.energy_systems[requirement][measure.row] = measure.item[system];
            //console.log(data.energy_systems.elements[measure.row]);
            break;
    }

    system_UpdateUI();
    update();
}

/*
 $("#openbem").on("click", '.save-system', function () {
 
 var system = $(".edit-system-tag").val();
 data.systemlibrary[system] = {
 name: $(".edit-system-name").val(),
 efficiency: $(".edit-system-efficiency").val(),
 winter: $(".edit-system-winter").val(),
 summer: $(".edit-system-summer").val(),
 fuel: $(".edit-system-fuel").val(),
 };
 $("#modal-system-library").modal("hide");
 update();
 });
 */

/*
 $("#openbem").on("click", '.edit-system', function () {
 var system = $(this).attr('system');
 
 $(".edit-system-tag").val(system);
 $(".edit-system-name").val(data.systemlibrary[system].name);
 $(".edit-system-efficiency").val(data.systemlibrary[system].efficiency);
 $(".edit-system-winter").val(data.systemlibrary[system].winter);
 $(".edit-system-summer").val(data.systemlibrary[system].summer);
 $(".edit-system-fuel").val(data.systemlibrary[system].fuel);
 
 $("#modal-system-library-table-view").hide();
 $("#modal-system-library-editnew-view").show();
 
 $(".save-system").show();
 });
 */

/*
 $("#openbem").on("click", '.create-system', function () {
 console.log("create system");
 $(".edit-system-tag").val("");
 $(".edit-system-name").val("");
 $(".edit-system-efficiency").val("1.0");
 $(".edit-system-winter").val("1.0");
 $(".edit-system-summer").val("1.0");
 $(".edit-system-fuel").val("electric");
 
 $("#modal-system-library-table-view").hide();
 $("#modal-system-library-editnew-view").show();
 
 $(".save-system").show();
 });
 */

/*
 $("#openbem").on("click", '.modal-add-system', function () {
 var eid = $(this).attr('eid');
 
 var out = "";
 console.log(data.systemlibrary);
 for (z in data.systemlibrary) {
 out += "<tr><td>" + data.systemlibrary[z].name + "<br>";
 out += "<span style='font-size:80%'>";
 out += "<b>Efficiency:</b> " + Math.round(data.systemlibrary[z].efficiency * 100) + "%, ";
 out += "<b>Winter:</b> " + Math.round(data.systemlibrary[z].winter * 100) + "%, ";
 out += "<b>Summer:</b> " + Math.round(data.systemlibrary[z].summer * 100) + "%, ";
 out += "<b>Fuel:</b> " + data.systemlibrary[z].fuel;
 out += "</span></td>";
 
 out += "<td></td>";
 out += "<td style='text-align:right'>";
 out += "<button eid='" + eid + "' system='" + z + "' class='btn edit-system'>Edit</button>";
 out += "<button eid='" + eid + "' system='" + z + "' class='btn add-system'>Use</button>";
 out += "</td>";
 out += "</tr>";
 }
 $("#system-library-table").html(out);
 
 $("#modal-system-library-table-view").show();
 $("#modal-system-library-editnew-view").hide();
 $("#modal-system-library").modal("show");
 $(".save-system").hide();
 });
 */

