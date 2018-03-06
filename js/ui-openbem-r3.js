function draw_openbem_graphics()
{
    var floorwk = data.fabric.total_floor_WK;
    var ventilationwk = data.ventilation.average_ventilation_WK;
    var infiltrationwk = data.ventilation.average_infiltration_WK;
    var windowswk = data.fabric.total_window_WK;
    var wallswk = data.fabric.total_wall_WK;
    var roofwk = data.fabric.total_roof_WK;
    var thermalbridgewk = data.fabric.thermal_bridging_heat_loss;

    var totalwk = floorwk + ventilationwk + infiltrationwk + windowswk + wallswk + roofwk + thermalbridgewk;

    var uscale = 30;

    var s1 = Math.sqrt(floorwk / uscale);
    var s2 = Math.sqrt(ventilationwk / uscale);
    var s3 = Math.sqrt(windowswk / uscale);
    var s4 = Math.sqrt(wallswk / uscale);
    var s5 = Math.sqrt(roofwk / uscale);
    var s6 = Math.sqrt(thermalbridgewk / uscale);
    var s7 = Math.sqrt(infiltrationwk / uscale);

    $("#house-floor").attr("transform", "translate(460,620) rotate(90) scale(" + s1 + ")");
    $("#house-ventilation").attr("transform", "translate(260,535) rotate(180) scale(" + s2 + ")");
    $("#house-windows").attr("transform", "translate(260,345) rotate(180) scale(" + s3 + ")");
    $("#house-walls").attr("transform", "translate(730,535) rotate(0) scale(" + s4 + ")");
    $("#house-roof").attr("transform", "translate(640,185) rotate(-55) scale(" + s5 + ")");
    $("#house-thermalbridge").attr("transform", "translate(730,345) rotate(0) scale(" + s6 + ")");
    $("#house-infiltration").attr("transform", "translate(340,205) rotate(235) scale(" + s7 + ")");

    $("#house-floorwk").html(Math.round(floorwk) + " W/K");
    $("#house-ventilationwk").html(Math.round(ventilationwk) + " W/K");
    $("#house-windowswk").html(Math.round(windowswk) + " W/K");
    $("#house-wallswk").html(Math.round(wallswk) + " W/K");
    $("#house-roofwk").html(Math.round(roofwk) + " W/K");
    $("#house-thermalbridgewk").html(Math.round(thermalbridgewk) + " W/K");
    $("#house-infiltrationwk").html(Math.round(infiltrationwk) + " W/K");
    $("#house-totalwk").html(Math.round(totalwk) + " W/K");

    var targetbarwidth = $("#targetbars").width();

    $("#spaceheating").css("width", targetbarwidth);
    $("#primaryenergy").css("width", targetbarwidth);
    $("#co2").css("width", targetbarwidth);
    $("#perperson").css("width", targetbarwidth);

    var targetbarheight = 60;// 0.13 * targetbarwidth;
    if (targetbarheight < 60)
        targetbarheight = 60;
    $("#spaceheating").css("height", targetbarheight);
    $("#primaryenergy").css("height", targetbarheight);
    $("#co2").css("height", targetbarheight);
    $("#perperson").css("height", targetbarheight);

    // ---------------------------------------------------------------------------------
    var value = '';
    var units = '';
    // ---------------------------------------------------------------------------------
    if (isNaN(data.space_heating_demand_m2) == true) {
        value = 'No data yet';
        units = '';
    }
    else {
        value = Math.round(data.space_heating_demand_m2);
        units = "kWh/m" + String.fromCharCode(178);
    }
    var options = {
        name: "Space heating demand",
        value: value,
        units: units,
        targets: {
            //"Passivhaus": 15,
            "Min target": datasets.target_values.space_heating_demand_lower,
            "Max target": datasets.target_values.space_heating_demand_upper,
            "UK Average": datasets.uk_average_values.space_heating_demand
        }
    };
    targetbar("spaceheating", options);
    // ---------------------------------------------------------------------------------
    if (isNaN(data.primary_energy_use_m2) == true) {
        value = 'No data yet';
        units = '';
    }
    else {
        value = Math.round(data.primary_energy_use_m2);
        units = "kWh/m" + String.fromCharCode(178);
    }
    var options = {
        name: "Primary energy demand",
        value: value,
        units: units,
        targets: {
            "Target": datasets.target_values.primary_energy_demand_passive_house,
            "UK Average": datasets.uk_average_values.primary_energy_demand
        }
    };
    targetbar("primaryenergy", options);
    // ---------------------------------------------------------------------------------
    if (isNaN(data.kgco2perm2) == true) {
        value = 'No data yet';
        units = '';
    }
    else {
        value = Math.round(data.kgco2perm2);
        units = "kgCO" + String.fromCharCode(8322) + "/m" + String.fromCharCode(178);
    }
    var options = {
        name: "CO2 Emission rate",
        value: value,
        units: units,
        targets: {
            
            "Zero Carbon": 0,
            "80% by 2050": 17,
            "UK Average": datasets.uk_average_values.co2_emission_rate
        }
    };
    targetbar("co2", options);
    // ---------------------------------------------------------------------------------
    if (isNaN(data.kwhdpp) == true) {
        value = 'No data yet';
        units = '';
    }
    else {
        value = Math.round(data.kwhdpp.toFixed(1));
        units = "kWh/day";
    }
    var options = {
        name: "Per person energy use",
        value: value,
        units: units,
        targets: {
            "70% heating saving": datasets.target_values.energy_use_per_person,
            "UK Average": datasets.uk_average_values.energy_use_per_person
        }
    };
    targetbar("perperson", options);
    // ---------------------------------------------------------------------------------
    if(scenario != undefined){
        if(scenario != 'master')
            $('#measures-costs').html('Measures cost: £' + measures_costs(scenario));
        else
            $('#measures-costs').html('');
    }
}

function draw_rating(ctx)
{

    var sap_rating = data.SAP.rating.toFixed(0);
    var kwhm2 = "?";
    var letter = "";
    var color = 0;
    var kwhd = 0;
    var kwhdpp = 0;

    var band = 0;
    for (z in datasets.ratings)
    {
        if (sap_rating >= datasets.ratings[z].start && sap_rating <= datasets.ratings[z].end)
        {
            band = z;
            break;
        }
    }

    color = datasets.ratings[band].color;
    letter = datasets.ratings[band].letter;

    ctx.clearRect(0, 0, 269, 350);

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.fillRect(0, 0, 269, 350);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(0, 0, 269, 350);
    ctx.strokeRect(0, 0, 269, 350);

    var mid = 269 / 2;

    ctx.beginPath();
    ctx.arc(mid, mid, 100, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.font = "bold 22px arial";
    ctx.fillText("SAP", mid, 90);
    ctx.font = "bold 92px arial";
    ctx.fillText(sap_rating, mid, mid + 30);
    ctx.font = "bold 22px arial";
    ctx.fillText(letter + " RATING", mid, mid + 60);
    ctx.font = "bold 32px arial";
    ctx.fillText(kwhm2, mid, 280);
    ctx.font = "bold 18px arial";
    ctx.fillText("DAILY: " + kwhd, mid, 308);
    ctx.font = "bold 18px arial";
    ctx.fillText("PER PERSON: " + kwhdpp, mid, 336);
}
