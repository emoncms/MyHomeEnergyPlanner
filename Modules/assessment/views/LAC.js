console.log('debug lac.js');

function LAC_initUI() {

    //LAC SAP
    $('#LAC-lighting-fuels').html('');
    for (index in data.LAC.fuels_lighting) {
        if (index != 0) { // First fuel in array is added on LAC.html so no need to add it here
            var out = '<tr><td></td><td><select key="data.LAC.fuels_lighting.' + index + '.fuel" class="electric-fuels"></select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fraction&nbsp;&nbsp;<input type="number" style="width:55px" step="0.01" max="1" key="data.LAC.fuels_lighting.' + index + '.fraction" default="0">    </td></tr>'
            $('#LAC-lighting-fuels').append(out);
        }
    }
    $('#LAC-appliances-fuels').html('');
    for (index in data.LAC.fuels_appliances) {
        if (index != 0) { // First fuel in array is added on LAC.html so no need to add it here
            var out = '<tr><td></td><td><select key="data.LAC.fuels_appliances.' + index + '.fuel" class="electric-fuels"></select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fraction&nbsp;&nbsp;<input type="number" style="width:55px" step="0.01" max="1" key="data.LAC.fuels_appliances.' + index + '.fraction" default="0">    </td></tr>'
            $('#LAC-appliances-fuels').append(out);
        }
    }
    $('#LAC-cooking-fuels').html('');
    for (index in data.LAC.fuels_cooking) {
        if (index != 0) { // First fuel in array is added on LAC.html so no need to add it here
            var out = '<tr><td></td><td><select key="data.LAC.fuels_cooking.' + index + '.fuel" class="electric-fuels"></select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fraction&nbsp;&nbsp;<input type="number" style="width:55px" step="0.01" max="1" key="data.LAC.fuels_cooking.' + index + '.fraction" default="0">    </td></tr>'
            $('#LAC-cooking-fuels').append(out);
        }
    }

    // Detailed list
    for (z in data.appliancelist.list)
        add_applianceDetailedList(z);

    // Carbon Coop
    for (z in data.applianceCarbonCoop.list)
        add_applianceCarbonCoop(z);
    var library = appliancesCarbonCoop; // in path/assesment/js/model/appliancesCarbonCoop-r1.js
    for (category in library) {
        var first = true;
        for (appliance in library[category]) {
            if (first === true) {
                var row = "<tr><td>" + category + "</td><td>" + appliance + "</td><td><button class='add-element-CarbonCoop btn' style='margin-left:20px' cat='" + category + "' app='" + appliance + "' >use</button></td></tr>";
                first = false;
            }
            else
                var row = "<tr><td></td><td>" + appliance + "</td><td><button class='add-element-CarbonCoop btn' style='margin-left:20px' cat='" + category + "' app='" + appliance + "' >use</button></td></tr>";
            $("#library_table-CarbonCoop").append(row);
        }
    }

    //Nothing to do to init the SAP div

    //For all of them
    $('select.electric-fuels').each(function () {
        $(this).html(get_electric_fuels_for_select());
    });

    $('select.fuels').each(function () {
        $(this).html(get_fuels_for_select());
    });

    // Show divs according o the type of calculation
    show_LAC_divs(data.LAC_calculation_type)
}
;

function LAC_UpdateUI() {
    for (z in data.applianceCarbonCoop.list) {
        data.applianceCarbonCoop.list[z].energy_demand = 1.0 * data.applianceCarbonCoop.list[z].energy_demand.toFixed(2);
    }
    data.applianceCarbonCoop.energy_demand_total.total = 1.0 * data.applianceCarbonCoop.energy_demand_total.total.toFixed(2);
    data.applianceCarbonCoop.energy_demand_total.cooking = 1.0 * data.applianceCarbonCoop.energy_demand_total.cooking.toFixed(2);
    data.applianceCarbonCoop.energy_demand_total.appliances = 1.0 * data.applianceCarbonCoop.energy_demand_total.appliances.toFixed(2);
}

$('#openbem').on('change', '#LAC_calculation_type', function () {
    show_LAC_divs($('#LAC_calculation_type').val());
});

function show_LAC_divs(type_of_calc) {
    $('#LAC-container .to-be-hidden').hide();
    switch (type_of_calc) {
        case 'detailedlist':
            $('#detailed-list').show();
            break;
        case 'SAP':
            $('#lighting-SAP').show();
            $('#appliances-SAP').show();
            $('#cooking-SAP').show();
            break;
        case 'carboncoop_SAPlighting':
            $('#lighting-SAP').show();
            $('#CarbonCoop').show();
            break;
    }
}


/*********************
 *  Detailed list    *
 *  *****************/
$("#add-item-detailedlist").click(function () {
    var size = data.appliancelist.list.length;
    var name = "Item " + (size + 1);
    data.appliancelist.list.push({name: name, category: 'lighting', power: 0, hours: 0, energy: 0});
    add_applianceDetailedList(size);

    update();
});

function add_applianceDetailedList(z)
{
    $("#appliancelist").append($("#template-detailedlist").html());
    $("#appliancelist [key='data.appliancelist.list.z.name']").attr('key', 'data.appliancelist.list.' + z + '.name');
    $("#appliancelist [key='data.appliancelist.list.z.category']").attr('key', 'data.appliancelist.list.' + z + '.category');
    $("#appliancelist [key='data.appliancelist.list.z.power']").attr('key', 'data.appliancelist.list.' + z + '.power');
    $("#appliancelist [key='data.appliancelist.list.z.hours']").attr('key', 'data.appliancelist.list.' + z + '.hours');
    $("#appliancelist [key='data.appliancelist.list.z.energy']").attr('key', 'data.appliancelist.list.' + z + '.energy');
}


/*********************
 * Carbon Coop       *
 ********************/
function add_applianceCarbonCoop(z)
{
    $("#applianceCarbonCoop").append($("#template-CarbonCoop").html());
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.category']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.category');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.name']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.name');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.number_used']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.number_used');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.a_plus_rated']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.a_plus_rated');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.norm_demand']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.norm_demand');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.units']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.units');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.utilisation_factor']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.utilisation_factor');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.frequency']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.frequency');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.reference_quantity']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.reference_quantity');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.electric_fraction']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.electric_fraction');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.dhw_fraction']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.dhw_fraction');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.gas_fraction']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.gas_fraction');
    $("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.energy_demand']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.energy_demand');
    $("#applianceCarbonCoop [index='z']").attr('index', z);
}
$("#add-item-CarbonCoop").click(function () {
    $("#myModal_applianceCarbonCooplibrary").modal('show');
});
$("#library_table-CarbonCoop").on('click', '.add-element-CarbonCoop', function () {
    var category = $(this).attr("cat");
    var appliance = $(this).attr("app");

    // Add appliance to data
    var library = appliancesCarbonCoop; // in path/assesment/js/model/appliancesCarbonCoop-r1.js/
    var appliance_to_add = {category: category, name: appliance, number_used: 0, a_plus_rated: false, units: "", utilisation_factor: 0, frequency: 0, reference_quantity: 0, electric_fraction: 0, dhw_fraction: 0, gas_fraction: 0, primary_energy_total: 0, primary_energy_m2: 0, co2_total: 0, co2_m2: 0};
    for (z in library[category][appliance]) {
        z_for_data = z.replace(" ", "_").toLowerCase();
        appliance_to_add[z_for_data] = library[category][appliance][z];
    }

    data.applianceCarbonCoop.list.push(appliance_to_add);

    $("#myModal_applianceCarbonCooplibrary").modal('hide');

    // Add appliance to the view and update
    add_applianceCarbonCoop(data.applianceCarbonCoop.list.length - 1);
    update();
});

$("#applianceCarbonCoop").on('click', '.delete-appliance', function () {
    index = $(this).attr('index');
    $(this).closest('tr').remove();
    data.applianceCarbonCoop.list.splice(index, 1);
    //appliannceCarbonCoop_initUI();
    update();
});

$('#openbem').on('click', '.add_LAC_fuel', function () { // Fix index
    var type = $(this).attr('type');
    var array_name = 'fuels_' + type;
    data.LAC[array_name].push({fuel: 'Standard Tariff', fraction: 0});
    var index = data.LAC[array_name].length - 1;
    if (type == 'cooking') // The only difference is the class in the select
        var out = '<tr><td></td><td><select key="data.LAC.fuels_' + type + '.' + index + '.fuel" class="fuels"></select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fraction&nbsp;&nbsp;<input type="number" style="width:55px" step="0.01" max="1" key="data.LAC.fuels_' + type + '.' + index + '.fraction" default="0">    </td></tr>'
    else
        var out = '<tr><td></td><td><select key="data.LAC.fuels_' + type + '.' + index + '.fuel" class="electric-fuels"></select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fraction&nbsp;&nbsp;<input type="number" style="width:55px" step="0.01" max="1" key="data.LAC.fuels_' + type + '.' + index + '.fraction" default="0">    </td></tr>'
    $('#LAC-' + type + '-fuels').append(out);

    // Update
    update();
    $('select.electric-fuels').each(function () {
        $(this).html(get_electric_fuels_for_select());
    });

    $('select.fuels').each(function () {
        $(this).html(get_fuels_for_select());
    });
});

function get_electric_fuels_for_select() {
    var options = '';
    for (fuel in data.fuels) {
        if (data.fuels[fuel].category == 'Electricity')
            options += '<option value="' + fuel + '">' + fuel + '</option>';
    }
    return options;
}

function get_fuels_for_select() {
    var options = '';
    var fuels_by_category = {};
    // Group fuels by category
    for (var fuel in data.fuels) {
        var category = data.fuels[fuel].category;
        if (fuels_by_category[category] == undefined)
            fuels_by_category[category] = [];
        fuels_by_category[category].push(fuel);
    }
    // Generate output string
    for (category in fuels_by_category) {
        options += '<optgroup label="' + category + '">';
        for (index in fuels_by_category[category])
            options += '<option value="' + fuels_by_category[category][index] + '">' + fuels_by_category[category][index] + '</option>';
        options += '</optgroup>';
    }
    return options;
}

