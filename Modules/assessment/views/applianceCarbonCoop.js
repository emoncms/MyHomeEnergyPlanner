function applianceCarbonCoop_initUI() {
    for (z in data.applianceCarbonCoop.list)
        add_applianceCarbonCoop(z);
    //l=lib;

    var library = appliancesCarbonCoop; // in path/assesment/js/model/appliancesCarbonCoop-r1.js

    for (category in library) {
        var first = true;
        for (appliance in library[category]) {
            if (first === true) {
                var row = "<tr><td>" + category + "</td><td>" + appliance + "</td><td><button class='add-element btn' style='margin-left:20px' cat='" + category + "' app='" + appliance + "' >use</button></td></tr>";
                first = false;
            }
            else
                var row = "<tr><td></td><td>" + appliance + "</td><td><button class='add-element btn' style='margin-left:20px' cat='" + category + "' app='" + appliance + "' >use</button></td></tr>";
            $("#library_table").append(row);
        }
    }

}


function applianceCarbonCoop_UpdateUI() {
    for (z in data.applianceCarbonCoop.list) {
        data.applianceCarbonCoop.list[z].energy_demand = data.applianceCarbonCoop.list[z].energy_demand.toFixed(2);
        //data.applianceCarbonCoop.list[z].primary_energy_total = data.applianceCarbonCoop.list[z].primary_energy_total.toFixed(2);
        //data.applianceCarbonCoop.list[z].primary_energy_m2 = data.applianceCarbonCoop.list[z].primary_energy_m2.toFixed(2);
        //data.applianceCarbonCoop.list[z].co2_total = data.applianceCarbonCoop.list[z].co2_total.toFixed(2);
        //data.applianceCarbonCoop.list[z].co2_m2 = data.applianceCarbonCoop.list[z].co2_m2.toFixed(2);
    }

    data.applianceCarbonCoop.energy_demand_total.total = data.applianceCarbonCoop.energy_demand_total.total.toFixed(2);
    //data.applianceCarbonCoop.primary_energy_total.total = data.applianceCarbonCoop.primary_energy_total.total.toFixed(2);
    //data.applianceCarbonCoop.primary_energy_m2.total = data.applianceCarbonCoop.primary_energy_m2.total.toFixed(2);
    //data.applianceCarbonCoop.co2_total.total = data.applianceCarbonCoop.co2_total.total.toFixed(2);
    //data.applianceCarbonCoop.co2_m2.total = data.applianceCarbonCoop.co2_m2.total.toFixed(2);

    data.applianceCarbonCoop.energy_demand_total.cooking = data.applianceCarbonCoop.energy_demand_total.cooking.toFixed(2);
    //data.applianceCarbonCoop.primary_energy_total.cooking = data.applianceCarbonCoop.primary_energy_total.cooking.toFixed(2);
    //data.applianceCarbonCoop.primary_energy_m2.cooking = data.applianceCarbonCoop.primary_energy_m2.cooking.toFixed(2);
    //data.applianceCarbonCoop.co2_total.cooking = data.applianceCarbonCoop.co2_total.cooking.toFixed(2);
    //data.applianceCarbonCoop.co2_m2.cooking = data.applianceCarbonCoop.co2_m2.cooking.toFixed(2);

    data.applianceCarbonCoop.energy_demand_total.appliances = data.applianceCarbonCoop.energy_demand_total.appliances.toFixed(2);
    //data.applianceCarbonCoop.primary_energy_total.appliances = data.applianceCarbonCoop.primary_energy_total.appliances.toFixed(2);
    //data.applianceCarbonCoop.primary_energy_m2.appliances = data.applianceCarbonCoop.primary_energy_m2.appliances.toFixed(2);
    //data.applianceCarbonCoop.co2_total.appliances = data.applianceCarbonCoop.co2_total.appliances.toFixed(2);
    //data.applianceCarbonCoop.co2_m2.appliances = data.applianceCarbonCoop.co2_m2.appliances.toFixed(2);
}

function add_applianceCarbonCoop(z)
{
    $("#applianceCarbonCoop").append($("#template").html());
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
    //$("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.primary_energy_total']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.primary_energy_total');
    //$("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.primary_energy_m2']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.primary_energy_m2');
    //$("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.co2_total']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.co2_total');
    //$("#applianceCarbonCoop [key='data.applianceCarbonCoop.list.z.co2_m2']").attr('key', 'data.applianceCarbonCoop.list.' + z + '.co2_m2');
    $("#applianceCarbonCoop [index='z']").attr('index', z);
}

$("#add-item").click(function () {
    $("#myModal_applianceCarbonCooplibrary").modal('show');
});
$("#library_table").on('click', '.add-element', function () {
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
