function currentenergy_initUI() {
    data = project['master'];
    var E = data.currentenergy.energyitems;
    console.log(E);
    var out = "";
    var lastgroup = "";
    for (z in E)
    {
        if (E[z].selected == 0 && E[z].group != 'Transport') {
            if (E[z].group != lastgroup)
                out += "<optgroup label='" + E[z].group + "'>";
            lastgroup = E[z].group;
            out += "<option value='" + z + "'>" + E[z].name + "</option>";
        }
    }
    $("#energyitem_select").html(out);

    var out = "";
    for (z in E)
    {
        if (E[z].selected == 1)
        {
            out += "<tr>";
            out += "<td>" + E[z].name;
            if (E[z].note != "")
                out += "<br><i style='font-size:12px'>" + E[z].note + "</i>";
            out += "</td>";
            out += "<td><input type='text' style='width:60px' key='data.currentenergy.energyitems." + z + ".quantity' /> " + E[z].units + "</td>";
            /*if (E[z].mpg != undefined) {
                out += "<td><input type='text' style='width:60px' key='data.currentenergy.energyitems." + z + ".mpg' /> mpg</td>";
            } else {
                out += "<td></td>";
            }*/
            out += "<td><span type='text' key='data.currentenergy.energyitems." + z + ".kwhd' dp=1/> kWh/d</td>";
            out += "<td><span type='text' key='data.currentenergy.energyitems." + z + ".annual_co2' dp=2/> kg</td>";
            out += "<td><input type='text' style='width:50px' key='data.currentenergy.energyitems." + z + ".unitcost' dp=2 /> £/" + E[z].units + "</td>";
            out += "<td><input type='text' style='width:50px' key='data.currentenergy.energyitems." + z + ".standingcharge' dp=2 /></td>";
            out += "<td>£<span type='text' key='data.currentenergy.energyitems." + z + ".annual_cost' dp=2/></td>";
            out += "<td><i class='currentenergy-deleteitem icon-trash' tag='" + z + "'></i></td></tr>";
        }

    }
    $("#currentenergy_energyitems").html(out);
}

function currentenergy_UpdateUI()
{
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Space heating demand",
        value: Math.round(data.currentenergy.spaceheating_annual_kwhm2),
        units: "kWh/m2",
        targets: {
            //"Passivhaus": 15,
            "Passivhaus retrofit": 25,
            "UK Average": 145
        }
    };
    targetbar("currentenergy-spaceheating", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Primary energy demand",
        value: Math.round(data.currentenergy.primaryenergy_annual_kwhm2),
        units: "kWh/m2",
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
        units: "kgCO2/m2",
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

$("#add_energyitem").click(function () {
    var tag = $("#energyitem_select").val();
    console.log(tag);
    data.currentenergy.energyitems[tag].selected = 1;
    currentenergy_initUI();
    update();
});

$("#currentenergy_energyitems").on("click", ".currentenergy-deleteitem", function () {
    var tag = $(this).attr("tag");
    data.currentenergy.energyitems[tag].selected = 0;
    data.currentenergy.energyitems[tag].quantity = 0;
    currentenergy_initUI();
    update();
});
