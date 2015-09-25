function appliancePHPP_initUI() {
    for (z in data.appliancePHPP.list)
        add_appliancePHPP(z);
    //l=lib;

    var library = appliancesPHPP; // in path/assesment/js/model/appliancesPHPP-r1.js

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


function appliancePHPP_UpdateUI() {
    for (z in data.appliancePHPP.list) {
        data.appliancePHPP.list[z].primary_energy_total = data.appliancePHPP.list[z].primary_energy_total.toFixed(2);
        data.appliancePHPP.list[z].primary_energy_m2 = data.appliancePHPP.list[z].primary_energy_m2.toFixed(2);
        data.appliancePHPP.list[z].co2_total = data.appliancePHPP.list[z].co2_total.toFixed(2);
        data.appliancePHPP.list[z].co2_m2 = data.appliancePHPP.list[z].co2_m2.toFixed(2);
    }

    data.appliancePHPP.primary_energy_total.total = data.appliancePHPP.primary_energy_total.total.toFixed(2);
    data.appliancePHPP.primary_energy_m2.total = data.appliancePHPP.primary_energy_m2.total.toFixed(2);
    data.appliancePHPP.co2_total.total = data.appliancePHPP.co2_total.total.toFixed(2);
    data.appliancePHPP.co2_m2.total = data.appliancePHPP.co2_m2.total.toFixed(2);

    data.appliancePHPP.primary_energy_total.cooking = data.appliancePHPP.primary_energy_total.cooking.toFixed(2);
    data.appliancePHPP.primary_energy_m2.cooking = data.appliancePHPP.primary_energy_m2.cooking.toFixed(2);
    data.appliancePHPP.co2_total.cooking = data.appliancePHPP.co2_total.cooking.toFixed(2);
    data.appliancePHPP.co2_m2.cooking = data.appliancePHPP.co2_m2.cooking.toFixed(2);

    data.appliancePHPP.primary_energy_total.appliances = data.appliancePHPP.primary_energy_total.appliances.toFixed(2);
    data.appliancePHPP.primary_energy_m2.appliances = data.appliancePHPP.primary_energy_m2.appliances.toFixed(2);
    data.appliancePHPP.co2_total.appliances = data.appliancePHPP.co2_total.appliances.toFixed(2);
    data.appliancePHPP.co2_m2.appliances = data.appliancePHPP.co2_m2.appliances.toFixed(2);
}

function add_appliancePHPP(z)
{
    $("#appliancePHPP").append($("#template").html());
    $("#appliancePHPP [key='data.appliancePHPP.list.z.category']").attr('key', 'data.appliancePHPP.list.' + z + '.category');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.name']").attr('key', 'data.appliancePHPP.list.' + z + '.name');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.number_used']").attr('key', 'data.appliancePHPP.list.' + z + '.number_used');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.a_plus_rated']").attr('key', 'data.appliancePHPP.list.' + z + '.a_plus_rated');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.norm_demand']").attr('key', 'data.appliancePHPP.list.' + z + '.norm_demand');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.units']").attr('key', 'data.appliancePHPP.list.' + z + '.units');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.utilisation_factor']").attr('key', 'data.appliancePHPP.list.' + z + '.utilisation_factor');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.frequency']").attr('key', 'data.appliancePHPP.list.' + z + '.frequency');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.reference_quantity']").attr('key', 'data.appliancePHPP.list.' + z + '.reference_quantity');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.electric_fraction']").attr('key', 'data.appliancePHPP.list.' + z + '.electric_fraction');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.dhw_fraction']").attr('key', 'data.appliancePHPP.list.' + z + '.dhw_fraction');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.gas_fraction']").attr('key', 'data.appliancePHPP.list.' + z + '.gas_fraction');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.primary_energy_total']").attr('key', 'data.appliancePHPP.list.' + z + '.primary_energy_total');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.primary_energy_m2']").attr('key', 'data.appliancePHPP.list.' + z + '.primary_energy_m2');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.co2_total']").attr('key', 'data.appliancePHPP.list.' + z + '.co2_total');
    $("#appliancePHPP [key='data.appliancePHPP.list.z.co2_m2']").attr('key', 'data.appliancePHPP.list.' + z + '.co2_m2');
    $("#appliancePHPP [index='z']").attr('index', z);
}

$("#add-item").click(function () {
    $("#myModal_appliancePHPPlibrary").modal('show');
});
$("#library_table").on('click', '.add-element', function () {
    var category = $(this).attr("cat");
    var appliance = $(this).attr("app");

    // Add appliance to data
    var library = appliancesPHPP; // in path/assesment/js/model/appliancesPHPP-r1.js/
    var appliance_to_add = {category: category, name: appliance, number_used: 0, a_plus_rated: false, units: "", utilisation_factor: 0, frequency: 0, reference_quantity: 0, electric_fraction: 0, dhw_fraction: 0, gas_fraction: 0, primary_energy_total: 0, primary_energy_m2: 0, co2_total: 0, co2_m2: 0};
    for (z in library[category][appliance]) {
        z_for_data = z.replace(" ", "_").toLowerCase();
        appliance_to_add[z_for_data] = library[category][appliance][z];
    }

    data.appliancePHPP.list.push(appliance_to_add);

    $("#myModal_appliancePHPPlibrary").modal('hide');

    // Add appliance to the view and update
    add_appliancePHPP(data.appliancePHPP.list.length - 1);
    update();
});

$("#appliancePHPP").on('click', '.delete-appliance', function () {
    index = $(this).attr('index');
    $(this).closest('tr').remove();
    data.appliancePHPP.list.splice(index, 1);
    //applianncePHPP_initUI();
    update();
});
