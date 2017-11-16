console.log("Debug currentenergy.js");


function currentenergy_initUI() {
    data = project['master'];

    $('#type_of_fuel_select').html(get_fuels_for_select());
    $('#currentenergy_use_by_fuel').html('');
    for (var fuel in data.currentenergy.use_by_fuel) {
        var html = "<tr>";
        html += "<td>" + fuel + "</td>";
        html += "<td><input type='number' style='width:80px' key='data.currentenergy.use_by_fuel." + fuel + ".annual_use' dp=2 /></td>";
        html += "<td>x <span key='data.fuels." + fuel + ".co2factor' dp=2 /></td>";
        html += "<td><span key='data.currentenergy.use_by_fuel." + fuel + ".annual_co2' dp=2 /></td>";
        html += "<td>x <span key='data.fuels." + fuel + ".primaryenergyfactor' dp=2 /></td>";
        html += "<td><span key='data.currentenergy.use_by_fuel." + fuel + ".primaryenergy' dp=2 /></td>";
        html += "<td><span key='data.fuels." + fuel + ".fuelcost' dp=2 /></td>";
        html += "<td><span key='data.fuels." + fuel + ".standingcharge' dp=2 /></td>";
        html += "<td>£<span key='data.currentenergy.use_by_fuel." + fuel + ".annualcost' dp=2 /></td>";
        html += "<td><i class='currentenergy-delete-fuel icon-trash' style='cursor:pointer' fuel='" + fuel + "'></i></td>";
        html += '</tr>';
        $('#currentenergy_use_by_fuel').append(html);
    }

    if (data.currentenergy.onsite_generation === 1)
        $('#onsite-generation').show();
    else
        $('#onsite-generation').hide();
}

function currentenergy_UpdateUI()
{
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Primary energy demand",
        value: Math.round(data.currentenergy.primaryenergy_annual_kwhm2),
        units: "kWh/m" + String.fromCharCode(178),
        targets: {
            "Passivhaus": 120,
            "UK Average": 350
        }
    };
    targetbar("currentenergy-primaryenergy", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "CO2 Emission rate",
        value: Math.round(data.currentenergy.total_co2m2),
        units: "kgCO" + String.fromCharCode(8322) + "/m" + String.fromCharCode(178),
        targets: {
            "80% by 2050": 17,
            "UK Average": 85
        }
    };
    targetbar("currentenergy-co2", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Per person energy use",
        value: data.currentenergy.energyuseperperson.toFixed(1),
        units: "kWh/day",
        targets: {
            "70% heating saving": 8.6,
            "UK Average": 19.6
        }
    };
    targetbar("currentenergy-perperson", options);
}


$("#add_use_by_fuel").click(function () {
    var fuel_type = $("#type_of_fuel_select").val();
    data.currentenergy.use_by_fuel[fuel_type] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
    currentenergy_initUI();
    update();
});

$('#openbem').on('click', '.currentenergy-delete-fuel', function () {
    var fuel = $(this).attr(('fuel'));
    delete data.currentenergy.use_by_fuel[fuel];
    currentenergy_initUI();
    update();
});

$('#openbem').on('change', '[key="data.currentenergy.onsite_generation"]', function () {
    $('#onsite-generation').toggle();
});
