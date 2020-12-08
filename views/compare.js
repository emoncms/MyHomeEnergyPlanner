console.log('Debug compare.js');
function compare_initUI() {
    // Summary
    $('#summary').append(generateSummary());

    // Comparison tables
    for (var scenario in project) {
        if (scenario != 'master') {
            $('#compare').append('<h3 style="margin-top:25px">Master/' + scenario + ' Comparison table</h3>');
            $('#compare').append('<hr />');
            $('#compare').append('<div id="comparison-' + scenario + '" style="margin-left:25px">');
            $("#comparison-" + scenario).html(compareCarbonCoop(scenario));
        }
    }

    // Summary of measures
    for (var scenario in project) {
        if (scenario != 'master') {
            $('#summary-measures').append('<h3 style="margin-top:25px">' + scenario.charAt(0).toUpperCase() + scenario.slice(1) + ' - summary of measures</h3>');
            $('#summary-measures').append('<hr />');
            $('#summary-measures').append('<div id="summary-measures-' + scenario + '" style="margin-left:25px">');
            $("#summary-measures-" + scenario).append(getMeasuresSummaryTable(scenario));
        }
    }
    $('.measures-summary-table').addClass('table');

    // Complete measures tables
    for (var scenario in project) {
        if (scenario != 'master') {
            $('#complete-measures').append('<h3 style="margin-top:25px">' + scenario.charAt(0).toUpperCase() + scenario.slice(1) + ' - comple list of measures</h3>');
            $('#complete-measures').append('<hr />');
            $('#complete-measures').append('<div id="complete-measures-' + scenario + '" style="margin-left:25px">');
            $("#complete-measures-" + scenario).append(getMeasuresCompleteTables(scenario));
        }
    }
    $('.complete-measures-table').addClass('table');
    $('#complete-measures').hide(); // We don't want to show this one for now

}

//******************************
// Functions for Summary
//******************************
function generateSummary() {
    var out = '<tr><th />';
    for (var scenario in project)
        out += '<th>' + scenario + '<br />' + project[scenario].scenario_name + '</th>'
    out += '</tr>';
    var rows = [
        ['<b>Totals</b>', ],
        ['Space heating demand (kWh/m<sup>2</sup>.a)', 'space_heating_demand_m2'],
        ['Primary energy demand (kWh/m<sup>2</sup>.a)', 'primary_energy_use_m2'],
        ['CO<sub>2</sub> emission rate (kgCO<sub>2</sub>/m<sup>2</sup>.a)', 'kwhdpp'],
        ['Per person energy use (kWh/m<sup>2</sup>.a)', 'kgco2perm2'],
        ['SAP rating', 'SAP', 'rating'],
        ['Fabric Energy Efficiency', 'FEE'],
        ['', ''],
        ['<b>Gains/losses (kWh/m<sup>2</sup>)</b>', ''],
        ['Internal gains', 'annual_useful_gains_kWh_m2', 'Internal'],
        ['Solar gains', 'annual_useful_gains_kWh_m2', "Solar"],
        ['Space heating gains', 'annual_useful_gains_kWh_m2', "Space heating"],
        ['Fabric losses', 'annual_losses_kWh_m2', "fabric"],
        ['Ventilation and Infiltration losses', 'annual_losses_kWh_m2', "ventilation"],
        ['', ''],
        ['<b>Energy demand (kWh.a)</b>', ''],
        ['Appliances', 'energy_requirements', 'appliances', 'quantity'],
        ['Cooking', 'energy_requirements', 'cooking', 'quantity'],
        ['Fans and pumps', 'energy_requirements', 'fans_and_pumps', 'quantity'],
        ['Lighting', 'energy_requirements', 'lighting', 'quantity'],
        ['Space heting', 'energy_requirements', 'space_heating', 'quantity'],
        ['Water heating ', 'energy_requirements', 'waterheating', 'quantity'],
        ['', ''],
        ['<b>Fuel input (kWh.a)</b>', ''],
        ['Appliances', 'fuel_requirements', 'appliances', 'quantity'],
        ['Cooking', 'fuel_requirements', 'cooking', 'quantity'],
        ['Fans and pumps', 'fuel_requirements', 'fans_and_pumps', 'quantity'],
        ['Lighting', 'fuel_requirements', 'lighting', 'quantity'],
        ['Space heting', 'fuel_requirements', 'space_heating', 'quantity'],
        ['Water heating', 'fuel_requirements', 'waterheating', 'quantity'],
        ['', '']
    ];
    var fuel_totals = {};
    for (var scenario in project) {
        for (var fuel in project[scenario].fuel_totals) {
            if (fuel_totals[fuel] == undefined)
                fuel_totals[fuel] = {};
        }
    }
    rows.push(['<b>Demand by fuel(kWh.a)</b>', '']);
    for (var fuel in fuel_totals)
        rows.push([fuel, 'fuel_totals', fuel, 'quantity']);
    rows.push(['', '']);
    rows.push(['<b>Primary energy by fuel(kWh.a)</b>', '']);
    for (var fuel in fuel_totals)
        rows.push([fuel, 'fuel_totals', fuel, 'primaryenergy']);
    rows.push(['', '']);
    rows.push(['<b>CO<sub>2</sub> emissions by fuel (kgCO<sub>2</sub>.a)</b>', '']);
    for (var fuel in fuel_totals)
        rows.push([fuel, 'fuel_totals', fuel, 'annualco2']);
    rows.push(['', '']);
    rows.push(['<b>Annual cost by fuel (£)</b>', '']);
    for (var fuel in fuel_totals)
        rows.push([fuel, 'fuel_totals', fuel, 'annualcost']);
    rows.push(['<b>Total cost (£)</b>', 'total_cost']);
    rows.push(['', '']);
    /*['',''],      
     ['',''],      
     ['',''],      
     ['',''],      
     ['',''],      
     ['',''],      
     ['',''],      
     ['',''],      
     ['',''],      
     ['',''],      
     ['',''], */

    rows.forEach(function (value) {
        out += getValuesForScenarios(value);
    });
    return out;
}

function getValuesForScenarios(value) {
    var out = '<tr><td>' + value[0] + '</td>';
    var val_out = '';
    for (var scenario in project) {
        if (value[2] == undefined)
            val_out = project[scenario][value[1]] != undefined ? project[scenario][value[1]] : undefined;
        else if (value[3] == undefined)
            val_out = project[scenario][value[1]] != undefined ? project[scenario][value[1]][value[2]] : undefined;
        else
            val_out = project[scenario][value[1]][value[2]] != undefined ? project[scenario][value[1]][value[2]][value[3]] : undefined;
        if (isNaN(val_out) === false)
            val_out = val_out.toFixed(2);
        if (val_out == undefined)
            val_out = '';
        out += '<td>' + val_out + '</td>';
    }
    out += '</tr>';
    return out;
}


//**********************************
// Functions for comparison tables
//**********************************
function compareCarbonCoop(scenario) {

    var out = "";
    // Basic dwelling data
    var properties_to_check = [
        ["Region", 'region'],
        ["Altitude", 'altitude'],
        ['Total floor area', 'TFA'],
        ['Total dwelling volume', 'volume'],
        ["Occupancy", 'occupancy']
    ];
    var BDD = comparePropertiesInArray(scenario, properties_to_check);
    if (BDD.changed === true)
        out += '<h3>Basic dwelling data</h3><table class="table table-striped">' + BDD.html + '</table><br />';
    // Ventilation
    var Vent = compareVentilation(scenario);
    if (Vent.changed === true)
        out += '<h3>Ventilation</h3><table class="table table-striped">' + Vent.html + '</table></br>';
    // Infiltration
    var Inf = compareInfiltration(scenario);
    if (Inf.changed === true)
        out += '<h3>Infiltration</h3><table class="table table-striped">' + Inf.html + '</table></br>';
    // Clothes drying facilities     
    var CDF = compareClothesDryingFacilities(scenario);
    if (CDF.changed === true)
        out += '<h3>Clothes drying facilities</h3><table class="table table-striped">' + CDF.html + '</table></br>';
    //Fabric
    var Fabric = compareFabric(scenario);
    if (Fabric.changed === true)
        out += '<h3>Fabric</h3><p>Changes to Floor\'s, Wall\'s, Windows and Roof elements</p>\n\
        <table class="table table-striped"><tr><th>Before</th><th>W/K</th><th>After</th><th>W/K</th><th>Change</th></tr>'
                + Fabric.html + '</table></br>';
    // Lighting - SAP
    var Lighting = compareLighting(scenario);
    if (Lighting.changed === true)
        out += '<h3>Lighting</h3><p>Changes to number of fixed low energy lighting outlets (LLE)</p><table class="table table-striped">' + Lighting.html + '</table></br>';
    // Heating    
    var Heating = compareHeating(scenario);
    if (Heating.changed === true)
        out += '<h3>Heating</h3><table class="table table-striped">' + Heating.html + '</table></br>';
    // Solar hot water
    if (project[scenario].use_SHW == true) {
        var SHW = compareSolarHotWater(scenario);
        if (SHW.changed === true)
            out += '<h3>Solar hot water</h3><table class="table table-striped">' + SHW.html + '</table></br>';
    }
// Generation
    var GEN = compareGeneration(scenario);
    if (GEN.changed === true)
        out += '<h3>Generation</h3><table class="table table-striped">' + GEN.html + '</table></br>';
    // Energy requirements
    var ER = compareEnergyRequirements(scenario);
    if (ER.changed === true)
        out += '<h3>Energy requirements</h3><table class="table table-striped">' + ER.html + '</table></br>';
    // Fuel requirements
    var FR = compareFuelRequirements(scenario);
    if (FR.changed === true)
        out += '<h3>Fuel requirements</h3><table class="table table-striped">' + FR.html + '</table></br>';
    // Totals     
    out += '<h3>Totals</h3><table class="table table-striped"><tr><td></td><td>Before</td><td>After</td></tr>';
    out += '<tr><td>Annual cost</td><td><i>£' + project.master.total_cost.toFixed(0) + '</i></td><td><i>£' + project[scenario].total_cost.toFixed(0) + '</i></td></tr>';
    out += '<tr><td>Total income</td><td><i>£' + project.master.total_income.toFixed(0) + '</i></td><td><i>£' + project[scenario].total_income.toFixed(0) + '</i></td></tr>';
    out += '<tr><td>SAP rating</td><td><i>' + project.master.SAP.rating.toFixed(0) + '</i></td><td><i>' + project[scenario].SAP.rating.toFixed(0) + '</i></td></tr>';
    out += '</table></br>';
    return out;
}

function comparePropertiesInArray(scenario, changes) {
    var out = "<tbody>";
    var changed = false;
    for (z in changes)
    {
        var keystr = changes[z][1];
        var description = changes[z][0];
        var keys = keystr.split(".");
        var subA = project.master;
        var subB = project[scenario];
        for (z in keys)
        {
            if (subA != undefined) {
                subA = subA[keys[z]];
            }
            if (subB != undefined) {
                subB = subB[keys[z]];
            }
        }
        var valA = subA;
        var valB = subB;
        if (valA != valB) {
            if (typeof valA == 'number')
                valA = valA.toFixed(2);
            if (typeof valB == 'number')
                valB = valB.toFixed(2);
            out += "<tr><td><b>" + description + "</b> changed from <i>" + valA + "</i> to <i>" + valB + "</i></td></tr>";
            changed = true;
        }
    }
    out += "</tbody>";
    return {html: out, changed: changed};
}

function compareVentilation(scenario) {
    var out = "";
    var changed = false;
    var properties_to_check = [
        ['Ventilation system type', 'ventilation.ventilation_type']
    ];
    var VSystem = comparePropertiesInArray(scenario, properties_to_check);
    if (VSystem.changed === true) {
        out += VSystem.html;
        changed = true;
        out += "<tbody>";
        // Add specific fields for current Ventilation system
        if (project[scenario].ventilation.ventilation_type == 'IE' || project[scenario].ventilation.ventilation_type == 'PS') {
            for (z in project[scenario].ventilation.EVP)
                out += '<tr><td><i>' + project[scenario].ventilation.EVP[z].name + '</i> added to <i>'
                        + project[scenario].ventilation.EVP[z].location + '</i> - Ventilation rate: <i>'
                        + project[scenario].ventilation.EVP[z].ventilation_rate + ' m<sup>3</sup>/h</i></td></tr>';
        }
        else if (project[scenario].ventilation.ventilation_type == 'DEV' || project[scenario].ventilation.ventilation_type == 'MEV' || project[scenario].ventilation.ventilation_type == 'MV')
            out += '<tr><td>Air change rate: <i>' + project[scenario].ventilation.system_air_change_rate
                    + ' ACH</i> - Specific fan power:  <i>' + project[scenario].ventilation.system_specific_fan_power
                    + ' W/(litre.sec)</i> </td></tr>';
        else if (project[scenario].ventilation.ventilation_type == 'MVHR')
            out += '<tr><td>Air change rate: <i>' + project[scenario].ventilation.system_air_change_rate
                    + ' ACH</i> - Specific fan power:  <i>' + project[scenario].ventilation.system_specific_fan_power
                    + ' W/(litre.sec)</i> - Heat recovery efficiency: <i>' +
                    project[scenario].ventilation.balanced_heat_recovery_efficiency + ' %</i></td></tr>';
        out += "</tbody>";
        //out += '<tr><td><i>' + project[scenario].ventilation. + '</i></td></tr>';
    }
    else {  // It can be the case the system has not changed but maybe we have applied some mesaures to it
        out += '<tbody>';
        out += '<tr><td>The ventilation system has not changed - Type: <i>' + project[scenario].ventilation.ventilation_type + '</i></td></tr>';
        if ((project[scenario].ventilation.ventilation_type == 'IE'
                || project[scenario].ventilation.ventilation_type == 'PS')) {
            if (JSON.stringify(project.master.ventilation.EVP) != JSON.stringify(project[scenario].ventilation.EVP)) {
                changed = true;
                // Search for EVPs that in master and have been changed or removed in scenario
                for (var z in project.master.ventilation.EVP) {
                    var EVP_master = project.master.ventilation.EVP[z];
                    var found = false;
                    for (var i in project[scenario].ventilation.EVP) {
                        var EVP_scenario = project[scenario].ventilation.EVP[i];
                        if (EVP_master.id === EVP_scenario.id) {
                            found = true;
                            if (JSON.stringify(EVP_master) != JSON.stringify(EVP_scenario)) {
                                out += '<tr><td>The <i>' + EVP_master.name + ' (' + EVP_master.ventilation_rate
                                        + ' m<sup>3</sup>/h)</i> in <i>' + EVP_master.location
                                        + '</i> has been replaced with <i>' + EVP_scenario.name + ' (' + EVP_scenario.ventilation_rate
                                        + ' m<sup>3</sup>/h)</i></td></tr>';
                            }
                        }
                    }
                    if (found === false)
                        out += '<tr><td>The <i>' + EVP_master.name + ' (' + EVP_master.ventilation_rate
                                + ' m<sup>3</sup>/h)</i> in <i>' + EVP_master.location
                                + '</i> has been removed</td></tr>';
                }
                // Search for new EVPs in scenario
                for (var z in project[scenario].ventilation.EVP) {
                    var EVP_scenario = project[scenario].ventilation.EVP[z];
                    var found = false;
                    for (var i in project.master.ventilation.EVP) {
                        EVP_master = project.master.ventilation.EVP[i];
                        if (EVP_master.id === EVP_scenario.id)
                            found = true;
                    }
                    if (found === false)
                        out += '<tr><td>A new <i>' + EVP_scenario.name + ' (' + EVP_scenario.ventilation_rate
                                + ' m<sup>3</sup>/h)</i> has been added to <i>' + EVP_scenario.location + '</td></tr>';
                }
            }
            else { // DEV, MV, MEV, MVHR
                properties_to_check = [
                    ['Air change rate', 'ventilation.system_air_change_rate'], ['Specific Fan Power', 'ventilation.system_specific_fan_power'],
                    ['Heat recovery efficiency', 'ventilation.balanced_heat_recovery_efficiency']
                ];
                var possible_changes = comparePropertiesInArray(scenario, properties_to_check);
                if (possible_changes.changed === true) {
                    changed = true;
                    out += possible_changes.html;
                }
            }

            out += '</tbody>';
        }
    }
    // Totals
    properties_to_check = [
        ['Loses due to ventilation (WK)', 'ventilation.average_ventilation_WK']
    ];
    var possible_changes = comparePropertiesInArray(scenario, properties_to_check);
    if (possible_changes.changed === true) {
        changed = true;
        out += possible_changes.html;
    }

    return {html: out, changed: changed};
}

function compareInfiltration(scenario) {
    var out = "";
    var changed = false;
    var properties_to_check = [
        ['Number of sides sheltered', 'ventilation.number_of_sides_sheltered']
    ];
    var changes = comparePropertiesInArray(scenario, properties_to_check);
    if (changes.changed === true) {
        changed = true;
        out += changes.html;
    }
    if (project.master.ventilation.air_permeability_test === false && project[scenario].ventilation.air_permeability_test === false) {
        var properties_to_check = [
            ['Walls', 'ventilation.dwelling_construction'], ['Floors', 'ventilation.suspended_wooden_floor'],
            ['Percentage of windows and doors draught proofed', 'ventilation.percentage_draught_proofed'],
            ['Draught Lobby', 'ventilation.draught_lobby']
        ];
        var changes = comparePropertiesInArray(scenario, properties_to_check);
        if (changes.changed === true) {
            changed = true;
            out += changes.html;
        }
    }

    if (JSON.stringify(project.master.ventilation.IVF) != JSON.stringify(project[scenario].ventilation.IVF)) {
        changed = true;
        // Search for IVFs that in master and have been changed or removed in scenario
        for (var z in project.master.ventilation.IVF) {
            var IVF_master = project.master.ventilation.IVF[z];
            var found = false;
            for (var i in project[scenario].ventilation.IVF) {
                var IVF_scenario = project[scenario].ventilation.IVF[i];
                if (IVF_master.id === IVF_scenario.id) {
                    found = true;
                    if (JSON.stringify(IVF_master) != JSON.stringify(IVF_scenario)) {
                        out += '<tr><td>The <i>' + IVF_master.name + ' (' + IVF_master.ventilation_rate
                                + ' m<sup>3</sup>/h)</i> in <i>' + IVF_master.location
                                + '</i> has been replaced with <i>' + IVF_scenario.name + ' (' + IVF_scenario.ventilation_rate
                                + ' m<sup>3</sup>/h)</i></td></tr>';
                    }
                }
            }
            if (found === false)
                out += '<tr><td>The <i>' + IVF_master.name + ' (' + IVF_master.ventilation_rate
                        + ' m<sup>3</sup>/h)</i> in <i>' + IVF_master.location
                        + '</i> has been removed</td></tr>';
        }
        // Search for new IVFs in scenario
        for (var z in project[scenario].ventilation.IVF) {
            var IVF_scenario = project[scenario].ventilation.IVF[z];
            var found = false;
            for (var i in project.master.ventilation.IVF) {
                IVF_master = project.master.ventilation.IVF[i];
                if (IVF_master.id === IVF_scenario.id)
                    found = true;
            }
            if (found === false)
                out += '<tr><td>A new <i>' + IVF_scenario.name + ' (' + IVF_scenario.ventilation_rate
                        + ' m<sup>3</sup>/h)</i> has been added to <i>' + IVF_scenario.location + '</td></tr>';
        }
    }
    var properties_to_check = [
        ['Structural infiltration', 'ventilation.infiltration_rate_incorp_shelter_factor']
    ];
    var changes = comparePropertiesInArray(scenario, properties_to_check);
    if (changes.changed === true) {
        changed = true;
        out += changes.html;
    }

// Totals
    properties_to_check = [
        ['Loses due to infiltration (WK)', 'ventilation.average_infiltration_WK']
    ];
    var possible_changes = comparePropertiesInArray(scenario, properties_to_check);
    if (possible_changes.changed === true) {
        changed = true;
        out += possible_changes.html;
    }

    return {html: out, changed: changed};
}

function compareClothesDryingFacilities(scenario) {
    var out = "";
    var changed = false;
    // Check if any has been deleted
    project.master.ventilation.CDF.forEach(function (facility_in_master, key) {
        var found = false;
        project[scenario].ventilation.CDF.forEach(function (facility_in_scenario, key) {
            if (facility_in_master.id === facility_in_scenario.id && facility_in_master.tag === facility_in_scenario.tag)
                found = true;
        });
        if (found === false) {
            changed = true;
            out += '<tr><td><i>' + facility_in_master.name + '</i> has been removed</td></tr>';
        }

    });
    // Check if any has been added
    for (var z in project[scenario].ventilation.CDF) {
        changed = true;
        out += '<tr><td>A new <i>' + project[scenario].ventilation.CDF[z].name + '</i> has been added</td></tr>';
    }

    return {html: out, changed: changed};
}

function compareFabric(scenario) {
    var out = "";
    var changed = false;

    // Search for elements that are in master and have been changed or removed in scenario
    for (var z in project.master.fabric.elements) {
        var element_master = project.master.fabric.elements[z];
        var found = false;
        for (var i in project[scenario].fabric.elements) {
            var element_scenario = project[scenario].fabric.elements[i];
            if (element_master.id === element_scenario.id) {
                found = true;
                if (element_master.uvalue * element_master.netarea != element_scenario.uvalue * element_scenario.netarea) {
                    changed = true;
                    out += compareFabricElement(element_master, element_scenario);
                }
            }
        }
        if (found === false) {
            changed = true;
            out += "<tr><td>" + element_master.location + ' - ' + element_master.name + "<br><i>Net area: " + element_master.netarea.toFixed(2)
                    + "m<sup>2</sup>, U-value " + element_master.uvalue + ":, k-value: "
                    + element_master.kvalue;
            if (element_master.type == "Window" || element_master.type == "window"
                    || element_master.type == "Door" || element_master.type == "Roof_light")
                out += ', g: ' + element_master.g + ', gL: ' + element_master.gL + ', ff:' + element_master.ff;
            out += '</i></td>';
            out += "<td style='padding-left:3px;padding-right:5px'>" + (element_master.uvalue * element_master.netarea).toFixed(2) + " W/K</td>";
            out += "<td colspan=2>Element removed</td></tr>";
        }
    }
    // Search for new elements in scenario
    for (var z in project[scenario].fabric.elements) {
        var element_scenario = project[scenario].fabric.elements[z];
        var found = false;
        for (var i in project.master.fabric.elements) {
            element_master = project.master.fabric.elements[i];
            if (element_master.id === element_scenario.id)
                found = true;
        }
        if (found === false) {
            changed = true;
            out += '<tr><td colspan=2>Not present</td>';
            out += "<td>" + element_scenario.location + ' - ' + element_scenario.name + "<br><i>Net area: " + element_scenario.netarea.toFixed(2)
                    + "m<sup>2</sup>, U-value " + element_scenario.uvalue + ":, k-value: "
                    + element_scenario.kvalue;
            if (element_scenario.type == "Window" || element_scenario.type == "window"
                    || element_scenario.type == "Door" || element_scenario.type == "Roof_light")
                out += ', g: ' + element_scenario.g + ', gL: ' + element_scenario.gL + ', ff:' + element_scenario.ff;
            out += '</i></td>';
            out += "<td style='padding-left:3px;padding-right:5px'>" + (element_scenario.uvalue * element_scenario.netarea).toFixed(2) + " W/K</td>";
            out += "<td>";
            out += "<span style='color:#aa0000'>+" + element_scenario.uvalue * element_scenario.netarea + " W/K</span></td>";
            out += "</tr>";
        }
    }

    return {html: out, changed: changed};
}

function compareFabricElement(element, measure) {
    var out = "<tr><td>" + element.location + ' - ' + element.name + "<br><i>Net area: " + element.netarea.toFixed(2)
            + "m<sup>2</sup>, U-value " + element.uvalue + ":, k-value: "
            + element.kvalue;
    if (element.type == "Window" || element.type == "window"
            || element.type == "Door" || element.type == "Roof_light")
        out += ', g: ' + element.g + ', gL: ' + element.gL + ', ff:' + element.ff;
    out += '</i></td>';
    out += "<td style='padding-left:3px;padding-right:5px'>" + (element.uvalue * element.netarea).toFixed(2) + " W/K</td>";
    out += "<td>" + element.location + ' - ' + measure.name + "<br><i>Net area: " + element.netarea.toFixed(2)
            + "m<sup>2</sup>, U-value " + measure.uvalue + ":, k-value: "
            + measure.kvalue;
    if (measure.type == "Window" || measure.type == "window"
            || measure.type == "Door" || measure.type == "Roof_light")
        out += ', g: ' + measure.g + ', gL: ' + measure.gL + ', ff:' + measure.ff;
    out += '</i></td>';
    out += "<td style='padding-left:3px;padding-right:5px'>" + (measure.uvalue * element.netarea).toFixed(2) + " W/K</td>";
    var saving = (element.uvalue * element.netarea) - (measure.uvalue * element.netarea);
    out += "<td>";
    if (saving > 0)
        out += "<span style='color:#00aa00'>-";
    if (saving < 0)
        out += "<span style='color:#aa0000'>+";
    out += (saving).toFixed(2) + " W/K</span></td>";
    out += "</tr>";
    return out;
}

function compareHeating(scenario) {
    var out = "";
    var changed = false;

    ///////////////////
    // Hot water demand
    ////////////////////
    var properties_to_check = [["Designed water use is not more than 125 litres per person per day", 'water_heating.low_water_use_design'],
        ['Do you know how much energy you use for water heating?', 'water_heating.override_annual_energy_content'],
        ['Annual average hot water usage', 'water_heating.Vd_average'],
        ['Annual energy content', 'water_heating.annual_energy_content']
    ];
    var DWU = comparePropertiesInArray(scenario, properties_to_check);
    if (DWU.changed === true) {
        changed = true;
        out += DWU.html;
    }

    ///////////////////
    // Water efficiency
    ///////////////////

    //   Check if any water usage has been deleted
    project.master.water_heating.water_usage.forEach(function (wu_in_master, key) {
        var found = false;
        project[scenario].water_heating.water_usage.forEach(function (wu_in_scenario, key) {
            if (wu_in_master.id === wu_in_scenario.id)
                found = true;
        });
        if (found === false) {
            changed = true;
            out += '<tr><td><i>' + wu_in_master.name + '</i> has been removed</td></tr>';
        }
    });
    // Check if any water usage has been added
    project[scenario].water_heating.water_usage.forEach(function (wu_in_scenario, key) {
        var found = false;
        project.master.water_heating.water_usage.forEach(function (wu_in_master, key) {
            if (wu_in_master.id === wu_in_scenario.id)
                found = true;
        });
        if (found === false)
            out += '<tr><td>A new <i>' + wu_in_scenario.name + '</i> has been added</td></tr>';
    });

    ///////////////////////
    // Space heating demand
    ///////////////////////

    var properties_to_check = [
        ['Living area', 'temperature.living_area'],
        ['Target temperature', 'temperature.target'],
        ['Heating off for the whole summer', 'space_heating.heating_off_summer']
    ];
    var SHD = comparePropertiesInArray(scenario, properties_to_check);
    if (SHD.changed === true) {
        changed = true;
        out += SHD.html;
    }

    ////////////////////
    // Heating systems
    ///////////////////

    //   Check if any heating system has been changed
    var hs_changed = false;
    var out_hs = '<tr><td><h4>Heating systems</h4></td></tr><tbody><tr><th style="width:47%">Before</th><th style="width:47%">After</th></tr>';
    project.master.heating_systems.forEach(function (hs_in_master, key) {
        var found = false;
        project[scenario].heating_systems.forEach(function (hs_in_scenario, key) {
            if (hs_in_master.id === hs_in_scenario.id) {
                var hs_in_master_noeff = hs_in_master;
                var hs_in_scenario_noeff = hs_in_scenario;
                delete hs_in_master_noeff.efficiency; // In order to be able to compare below the two objects, we need to remove the efficiency as it is a calculated value and may be different in the objects. The efficiency depends on other variables that are not exclusive to the heating systemkm (like data.energy_requirements.waterheating.quantity)
                delete hs_in_scenario_noeff.efficiency;
                found = true;
                if (JSON.stringify(hs_in_master_noeff) !== JSON.stringify(hs_in_scenario_noeff)) {
                    hs_changed = true;
                    out_hs += '<tr>';
                    out_hs += '<td>' + get_heating_system_html(hs_in_master, hs_in_scenario) + '</td>';
                    out_hs += '<td>' + get_heating_system_html(hs_in_scenario, hs_in_master) + '</td>';
                    out_hs += '</tr>';
                }
            }
        });
        if (found === false) {
            hs_changed = true;
            out_hs += '<tr><td>' + get_heating_system_html(hs_in_master) + '</td><td>Heating system removed</td></tr>';
        }
    });
    // Check if any heating system has been added
    project[scenario].heating_systems.forEach(function (hs_in_scenario, key) {
        var found = false;
        project.master.heating_systems.forEach(function (hs_in_master, key) {
            if (hs_in_master.id === hs_in_scenario.id)
                found = true;
        });
        if (found === false) {
            hs_changed = true;
            out_hs += '<tr><td>Not present</td><td>' + get_heating_system_html(hs_in_scenario) + '</td></tr>';
        }
    });

    out_hs += '</tbody>';
    if (hs_changed === true) {
        changed = true;
        out += out_hs;
    }

    /////////////////////
    //Hot water systems
    ////////////////////
    var properties_to_check = [
        ['Include solar hot water?', 'water_heating.solar_water_heating']
    ];
    var SHW = comparePropertiesInArray(scenario, properties_to_check);
    if (SHW.changed === true) {
        changed = true;
        out += SHW.html;
    }

    // Check if the storage has changed
    var st_changed = false;
    var out_st = '<tbody><tr><td><h4>Storage</h4></td></tr><tbody><tr><th style="width:47%">Before</th><th style="width:47%">After</th></tr>';
    if (JSON.stringify(project.master.water_heating.storage_type) != JSON.stringify(project[scenario].water_heating.storage_type)) {
        st_changed = true;
        out_st += '<tr><td>' + get_storage_html(project.master.water_heating.storage_type, project[scenario].water_heating.storage_type) + '</td>';
        out_st += '<td>' + get_storage_html(project[scenario].water_heating.storage_type, project.master.water_heating.storage_type) + '</td></tr>';
    }
    out_st += '</tr></tbody>';
    if (st_changed) {
        changed = true;
        out += out_st;
    }

    // Other

    var properties_to_check = [
        ['Storage inside dwelling', 'water_heating.hot_water_store_in_dwelling'],
        ['Contains dedicated solar storage or WWHRS volume?', 'water_heating.contains_dedicated_solar_storage_or_WWHRS'],
        ['Hot water storage control type', 'water_heating.hot_water_control_type'],
        ['Primary circuit pipework insulation', 'water_heating.pipework_insulation'],
        ['', 'water_heating.'],
        ['', 'water_heating.'],
        ['', 'water_heating.'],
        ['', 'water_heating.']
    ];
    var SHW = comparePropertiesInArray(scenario, properties_to_check);
    if (SHW.changed === true) {
        changed = true;
        out += SHW.html;
    }

    return {html: out, changed: changed};
}

function compareEnergyRequirements(scenario) {
    var out = "";
    var changed = false;
    var ER_list = ['appliances', 'cooking', 'fans_and_pumps', 'lighting', 'space_heating', 'waterheating'];
    var ER_names = ['appliances', 'cooking', 'fans and pumps', 'lighting', 'space heating', 'water heating'];
    ER_list.forEach(function (ER, index) {
        if (project.master.energy_requirements[ER] != undefined && project[scenario].energy_requirements[ER] != undefined
                && project.master.energy_requirements[ER].quantity != project[scenario].energy_requirements[ER].quantity) {
            changed = true;
            out += '<tr><td>The demand for <i>' + ER_names[index] + '</i> has changed from <i>'
                    + project.master.energy_requirements[ER].quantity.toFixed(2) + '</i> kWh/year to <i>'
                    + project[scenario].energy_requirements[ER].quantity.toFixed(2) + '</i> kWh/year</td></tr>';
        }
        else if (project.master.energy_requirements[ER] != undefined && project[scenario].energy_requirements[ER] == undefined) // there is a specific case (CarbonCoop for appliances and cooking) when the energy requirements can be undefined
        {
            changed = true;
            out += '<tr><td>The demand for <i>' + ER_names[index] + '</i> has changed from <i>'
                    + project.master.energy_requirements[ER].quantity.toFixed(2) + '</i> kWh/year to <i>0</i> kWh/year</td></tr>';
        }
    });
    if (project.master.generation.total_generation != project[scenario].generation.total_generation) {
        changed = true;
        out += '<tr><td>The total generation has changed from <i>'
                + project.master.generation.total_generation.toFixed(2) + '</i> kWh/year to <i>'
                + project[scenario].generation.total_generation.toFixed(2) + '</i> kWh/year</td></tr>';
    }

    return {html: out, changed: changed};
}

function compareFuelRequirements(scenario) {
    var out = "";
    var changed = false;
    for (var fuel in project.master.fuel_totals) {
        if (project[scenario].fuel_totals[fuel] == undefined) {
            changed = true;
            out += '<tr><td style="padding-right:10px">' + fuel + '</td><td style="padding-right:10px"><i>Quantity: ' + project.master.fuel_totals[fuel].quantity.toFixed(2) + ' kWh, CO<sub>2</sub>: ' + project.master.fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project.master.fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project.master.fuel_totals[fuel].annualcost.toFixed(2)
                    + '</i></td><td style="padding-right:10px" style="padding-right:10px"><i>Quantity: 0 kWh, CO<sub>2</sub>: 0 kg, Primary energy: 0 kWh, \n\
                    Annual cost: £0</i></td><td style="padding-right:10px">100%</td><td>100%</td></tr>';
        }
        else if (project.master.fuel_totals[fuel].quantity != project[scenario].fuel_totals[fuel].quantity) {
            changed = true;
            out += '<tr><td style="padding-right:10px">' + fuel + '</td><td style="padding-right:10px"><i>Quantity: ' + project.master.fuel_totals[fuel].quantity.toFixed(2)
                    + ' kWh, CO<sub>2</sub>: ' + project.master.fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project.master.fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project.master.fuel_totals[fuel].annualcost.toFixed(2)
                    + '</i></td><td style="padding-right:10px"><i>Quantity: ' + project[scenario].fuel_totals[fuel].quantity.toFixed(2)
                    + ' kWh, CO<sub>2</sub>: ' + project[scenario].fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project[scenario].fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project[scenario].fuel_totals[fuel].annualcost.toFixed(2);
            if (project.master.fuel_totals[fuel].quantity != 0)
                out += '</i></td><td style="padding-right:10px">' + (100 * (project.master.fuel_totals[fuel].quantity - project[scenario].fuel_totals[fuel].quantity) / project.master.fuel_totals[fuel].quantity).toFixed(2)
                        + '%</td><td>' + (100 * (project.master.fuel_totals[fuel].annualcost - project[scenario].fuel_totals[fuel].annualcost) / project.master.fuel_totals[fuel].annualcost).toFixed(2) + '%</td></tr>';
            else
                out += '</i></td><td style="padding-right:10px">N/A</td><td>N/A</td></tr>';
        }
    }
    for (var fuel in project[scenario].fuel_totals) {
        if (project.master.fuel_totals[fuel] == undefined) {
            changed = true;
            out += '<tr><td style="padding-right:10px">' + fuel + '</td><td style="padding-right:10px"><i>Quantity: 0 kWh, \n\
        CO<sub>2</sub>: 0 kg, Primary energy: 0 kWh, Annual cost: £0</i></td><td style="padding-right:10px"><i>Quantity: '
                    + project[scenario].fuel_totals[fuel].quantity.toFixed(2) + ' kWh, CO<sub>2</sub>: ' + project[scenario].fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project[scenario].fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project[scenario].fuel_totals[fuel].annualcost.toFixed(2)
                    + '</i></td><td style="padding-right:10px">0%</td><td>0%</td></tr>';
        }
    }

    if (changed === true)
        out = '<tr><td></td><td>Before</td><td>After</td><td>Energy savings</td><td>Cost saving</td></tr>' + out;
    // out+='<tr><td></td></tr>';

    return {html: out, changed: changed};
}

function compareSolarHotWater(scenario) {
    var out = "";
    var changed = false;
    var properties_to_check = [
        ['Solar water heating pump', 'SHW.pump'],
        ['Aperture area of solar collector, m2', 'SHW.A'],
        ['Zero-loss collector efficiency, η0, from test certificate or Table H1', 'SHW.n0'],
        ['Collector linear heat loss coefficient, a1, from test certificate', 'SHW.a1'],
        ['Collector 2nd order heat loss coefficient, a2, from test certificate', 'SHW.a2'], ['Collector Orientation', 'SHW.orientation'],
        ['Collector Inclination', 'SHW.inclination'],
        ['Overshading factor', 'SHW.overshading'],
        ['Solar energy available', 'SHW.solar_energy_available'],
        ['Collector performance factor', 'SHW.collector_performance_factor'],
        ['Dedicated solar storage volume, Vs, (litres)', 'SHW.Vs'],
        ['If combined cylinder, total volume of cylinder (litres)', 'SHW.combined_cylinder_volume'],
        ['Volume ratio Veff/Vd,average', 'SHW.volume_ratio'],
        ['Solar storage volume factor', 'SHW.f2'],
        ['Annual solar input Qs (kWh)', 'SHW.Qs']
    ];
    var DWU = comparePropertiesInArray(scenario, properties_to_check);
    if (DWU.changed === true) {
        changed = true;
        out += DWU.html;
    }

    return {html: out, changed: changed};
}

function compareGeneration(scenario) {
    var out = "";
    var changed = false;
    var properties_to_check = [
        ['Solar PV Annual Generation', 'generation.solar_annual_kwh'],
        ['Solar PV Fraction used on-site', 'generation.solar_fraction_used_onsite'],
        ['Solar PV Feed in tariff Generation (£/kWh)', 'generation.solar_FIT'],
        ['Solar PV Feed in tariff Export (£/kWh)', 'generation.solar_export_FIT'],
        ['Wind Annual Generation', 'generation.wind_annual_kwh'],
        ['Wind Fraction used on-site', 'generation.wind_fraction_used_onsite'],
        ['Wind Feed in tariff Generation (£/kWh)', 'generation.wind_FIT'],
        ['Wind Feed in tariff Export (£/kWh)', 'generation.solar_export_FIT'],
        ['Hydro Annual Generation', 'generation.hydro_annual_kwh'],
        ['Hydro Fraction used on-site', 'generation.hydro_fraction_used_onsite'],
        ['Hydro Feed in tariff Generation (£/kWh)', 'generation.hydro_FIT'],
        ['Hydro Feed in tariff Export (£/kWh)', 'generation.solar_export_FIT'],
                //['Array Installed Capacity kWp (PV calculator)', 'generation.solarpv_kwp_installed'],
                //['Array Orientation (PV calculator)', 'generation.solarpv_orientation'],
                //['Array Inclination (PV calculator)', 'generation.solarpv_inclination'],
                //['Overshading factor (PV calculator)', 'generation.solarpv_overshading']
    ];
    var DWU = comparePropertiesInArray(scenario, properties_to_check);
    if (DWU.changed === true) {
        changed = true;
        out += DWU.html;
    }

    return {html: out, changed: changed};
}

function compareLighting(scenario) {
    var out = "";
    var changed = false;
    var properties_to_check = [
        ['Number of fixed LLE', 'LAC.LLE']
    ];
    var LLE = comparePropertiesInArray(scenario, properties_to_check);
    if (LLE.changed === true) {
        changed = true;
        out += LLE.html;
    }
    return {html: out, changed: changed};
}

function getHeatingSystemById(id, scenario) {
    for (var index in project[scenario].heating_systems) {
        if (id == project[scenario].heating_systems[index].id)
            return project[scenario].heating_systems[index];
    }
    return false;
}

function get_heating_system_html(system, compare_to) {
    if (compare_to == undefined)
        compare_to = system;
    var bold = [];
    for (var key in system) {
        if (system[key] != compare_to[key])
            bold[key] = ['<b>', '</b>'];
        else
            bold[key] = ['', ''];
    }
    if (bold['central_heating_pump_inside'] == undefined)
        bold['central_heating_pump_inside'] = ['', ''];

    var out = "";
    out = '<b>' + system.name + '</b><br /><div style="padding-left:15px"><i>' + bold['fuel'][0] + 'Fuel: ' + system.fuel + bold['fuel'][1] + ', ' + bold['winter_efficiency'][0] + 'Winter eff: ' + system.winter_efficiency + '%, ' + bold['winter_efficiency'][1] + bold['summer_efficiency'][0] + 'Summer eff: ' + system.summer_efficiency + '%' + bold['summer_efficiency'][1];
    var provides = system.provides == 'heating' ? 'Heating' : system.provides == 'water' ? 'Water' : 'Space and water heating';
    out += '<br />' + bold['main_space_heating_system'][0] + 'Provides: ' + provides;
    if (system.provides != "water") {
        var main = system.main_space_heating_system == "mainHS1" ? 'Main heating system' : system.main_space_heating_system == "mainHS2_whole_house" ? '2nd Main heating system - whole house' : system.main_space_heating_system == "mainHS2_part_of_the_house" ? '2nd Main heating system - different part of the house ' : 'Secondary heating system';
        out += "<br />" + main + bold['main_space_heating_system'][1];
    }
    out += '<br />' + bold['central_heating_pump'][0] + ' Central heating pump: ' + system.central_heating_pump + ' kWh/year' + bold['central_heating_pump'][1] + ',' + bold['fans_and_supply_pumps'][0] + ' Fans and supply pumps: ' + system.fans_and_supply_pumps + ' kWh/year' + bold['fans_and_supply_pumps'][1] + '<br />' + bold['responsiveness'][0] + ' Responsiveness: ' + system.responsiveness + bold['responsiveness'][1] + ',' + bold['combi_loss'][0] + ' Combi loss: ' + system.combi_loss + bold['combi_loss'][1] + ', ' + bold['primary_circuit_loss'][0] + 'Primary circuit loss: ' + system.primary_circuit_loss + bold['primary_circuit_loss'][1] + '<br />';
    out += bold['fraction_space'][0] + 'Fraction space: ' + system.fraction_space + bold['fraction_space'][1] + ', ' + bold['fraction_water_heating'][0] + 'Fraction water: ' + system.fraction_water_heating + bold['fraction_water_heating'][1] + '<br />' + bold['temperature_adjustment'][0] + ' Temperature adjustment : ' + system.temperature_adjustment + bold['temperature_adjustment'][1] + ', ' + bold['heating_controls'][0] + 'Space heating controls: ' + system.heating_controls + bold['heating_controls'][1] + '<br />' + bold['instantaneous_water_heating'][0] + ' Instantaneous water heating: ' + system.instantaneous_water_heating + bold['instantaneous_water_heating'][1] + ', ' + bold['central_heating_pump_inside'][0] + 'Central heating pump inside dwelling: ' + system.central_heating_pump_inside + bold['central_heating_pump_inside'][1] + '</i></div>';
    return out;
}

function get_storage_html(storage, compare_to) {
    if (storage == undefined)
        return 'Not present';
    var bold = [];
    for (var key in storage) {
        if (compare_to != undefined && storage[key] != compare_to[key])
            bold[key] = ['<b>', '</b>'];
        else
            bold[key] = ['', ''];
    }

    var out = "";
    out = '<b>' + storage.name + '</b><br /><div style="padding-left:15px"><i>' + bold['storage_volume'][0] + 'Storage volume: ' + storage.storage_volume + bold['storage_volume'][1] + '<br />' + bold['declared_loss_factor_known'][0] + 'Manufacturer\'s declared loss factor known: ' + storage.declared_loss_factor_known + bold['declared_loss_factor_known'][1];
    if (storage.declared_loss_factor_known != false)
        out += '<br />' + bold['manufacturer_loss_factor'][0] + 'Hot water storage loss factor : ' + storage.manufacturer_loss_factor + ' kWh/litre/day' + bold['manufacturer_loss_factor'][1] + '<br />' + bold['temperature_factor_a'][0] + 'Temperature factor : ' + storage.temperature_factor_a + bold['temperature_factor_a'][1];
    else
        out += '<br />' + bold['loss_factor_b'][0] + ' Hot water storage loss factor : ' + storage.loss_factor_b + ' kWh/litre/day' + bold['loss_factor_b'][1] + bold['volume_factor_b'][0] + '<br /> Volume factor: ' + storage.volume_factor_b + bold['volume_factor_b'][1] + ',' + bold['temperature_factor_b'][0] + '<br />Temperature factor: ' + storage.temperature_factor_b + bold['temperature_factor_b'][1] + '</i></div>';
    return out;
}

//*******************************************
// Functions for Summary of measures tables
//*******************************************
function getMeasuresSummaryTable(scenario) {
    var out = '<table class="measures-summary-table"><thead><tr><th>Name</th><th>Label/location</th><th>Performance target</th><th>Benefits (in order)</th><th>Cost</th><th>Completed By</th><th>Disruption</th></tr></thead>';
    out += '<tbody>';

    // Fabric
    if (project[scenario].fabric.measures != undefined)
        out += measuresByIdForSummaryTable(project[scenario].fabric.measures);

    if (project[scenario].measures != undefined) {
        // Ventilation
        if (project[scenario].measures.ventilation != undefined) {
            if (project[scenario].measures.ventilation.extract_ventilation_points != undefined)
                out += measuresByIdForSummaryTable(project[scenario].measures.ventilation.extract_ventilation_points);
            if (project[scenario].measures.ventilation.intentional_vents_and_flues != undefined)
                out += measuresByIdForSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues);
            if (project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined)
                out += measuresByIdForSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues_measures);
            if (project[scenario].measures.ventilation.draught_proofing_measures != undefined)
                out += measureForSummaryTable(project[scenario].measures.ventilation.draught_proofing_measures.measure);
            if (project[scenario].measures.ventilation.ventilation_systems_measures != undefined)
                out += measureForSummaryTable(project[scenario].measures.ventilation.ventilation_systems_measures.measure);
            if (project[scenario].measures.ventilation.clothes_drying_facilities != undefined)
                out += measuresByIdForSummaryTable(project[scenario].measures.ventilation.clothes_drying_facilities);
        }
        // Water heating
        if (project[scenario].measures.water_heating != undefined) {
            if (project[scenario].measures.water_heating.water_usage != undefined)
                out += measuresByIdForSummaryTable(project[scenario].measures.water_heating.water_usage);
            if (project[scenario].measures.water_heating.storage_type != undefined)
                out += measureForSummaryTable(project[scenario].measures.water_heating.storage_type.measure);
            if (project[scenario].measures.water_heating.pipework_insulation != undefined)
                out += measureForSummaryTable(project[scenario].measures.water_heating.pipework_insulation.measure);
            if (project[scenario].measures.water_heating.hot_water_control_type != undefined)
                out += measureForSummaryTable(project[scenario].measures.water_heating.hot_water_control_type.measure);
        }
        // Heating controls
        if (project[scenario].measures.space_heating_control_type != undefined)
            out += measuresByIdForSummaryTable(project[scenario].measures.space_heating_control_type);
        // Heating systems
        if (project[scenario].measures.heating_systems != undefined)
            out += measuresByIdForSummaryTable(project[scenario].measures.heating_systems);
        // Generation
        if (project[scenario].use_generation == 1 && project[scenario].measures.PV_generation != undefined) {
            out += measureForSummaryTable(project[scenario].measures.PV_generation.measure);
        }
        // Lighting
        if (project[scenario].measures.LAC != undefined) {
            if (project[scenario].measures.LAC.lighting != undefined)
                out += measureForSummaryTable(project[scenario].measures.LAC.lighting.measure);
        }
    }

    out += '</tbody>';
    out += '</table>';
    return out;
}

function measureForSummaryTable(measure) {
    // Name
    var html = '<tr><td>' + measure.name + '</td>';

    // Location
    if (typeof measure.location != 'undefined') {
        measure.location = measure.location.replace(/,br/g, ', '); // for measures applied in bulk to fabric elements the location has the form of: W9,brW10,brW21,brD3,brW4,brW5,brW6a,brW16 , and we dont want that
        if (measure.location[measure.location.length - 2] == ',' && measure.location[measure.location.length - 1] == ' ')
            measure.location = measure.location.substring(0, measure.location.length - 2);
        if (measure.location.length > 50)
            measure.location = "Various";
        html += '<td><div class="text-width-limiter">' + measure.location + '</div>';
    }
    else
        html += '<td><div class="text-width-limiter">Whole house</div>';
    html += '</td>';

    // Performance
    if (typeof (measure.performance) != 'string')
        var perf = "";
    else {
        var perf = format_performance_string(measure.performance); // We have realized that some units were inputted wrong in the library
    }
    html += '<td>' + perf + '</td>';

    // Benefits
    html += '<td>' + measure.benefits + '</td>';

    // Cost
    html += '<td class="cost">£' + (1.0 * measure.cost_total).toFixed(2) + '</td>';

    // Who by
    html += '<td>' + measure.who_by + '</td>';

    // Disruption
    if (typeof (disruption) == 'string')
        html += '<td>' + disruption.replace('MEDIUMHIGH', 'MEDIUM / HIGH') + '</td>';
    else
        html += '<td></td>';


    // Finish
    html += '</tr>';
    return(html);
}

function measuresByIdForSummaryTable(measures_by_id) {
    var out = '';
    for (var id in measures_by_id)
        out += measureForSummaryTable(measures_by_id[id].measure);
    return out;
}

function format_performance_string(performance) {
    return performance.replace("WK.m2", "W/m<sup>2</sup>.K")
            .replace("W/K.m2", "W/m<sup>2</sup>.K")
            .replace('m3m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
            .replace('m3/m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
            .replace('W/msup2/sup.K', ' W/m<sup>2</sup>.K')
            .replace('msup3/sup/msup2/sup.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
            .replace('na', 'n/a');
}

//*******************************************
// Functions for Complete measures tables
//*******************************************

function getMeasuresCompleteTables(scenario) {
    var out = '';

    // Fabric
    if (project[scenario].fabric.measures != undefined)
        out += measuresByIdForCompleteTable(project[scenario].fabric.measures);

    if (project[scenario].measures != undefined) {
        // Ventilation
        if (project[scenario].measures.ventilation != undefined) {
            if (project[scenario].measures.ventilation.extract_ventilation_points != undefined)
                out += measuresByIdForCompleteTable(project[scenario].measures.ventilation.extract_ventilation_points);
            if (project[scenario].measures.ventilation.intentional_vents_and_flues != undefined)
                out += measuresByIdForCompleteTable(project[scenario].measures.ventilation.intentional_vents_and_flues);
            if (project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined)
                out += measuresByIdForCompleteTable(project[scenario].measures.ventilation.intentional_vents_and_flues_measures);
            if (project[scenario].measures.ventilation.draught_proofing_measures != undefined)
                out += measureForCompleteTable(project[scenario].measures.ventilation.draught_proofing_measures.measure);
            if (project[scenario].measures.ventilation.ventilation_systems_measures != undefined)
                out += measureForCompleteTable(project[scenario].measures.ventilation.ventilation_systems_measures.measure);
            if (project[scenario].measures.ventilation.clothes_drying_facilities != undefined)
                out += measuresByIdForCompleteTable(project[scenario].measures.ventilation.clothes_drying_facilities);
        }
        // Water heating
        if (project[scenario].measures.water_heating != undefined) {
            if (project[scenario].measures.water_heating.water_usage != undefined)
                out += measuresByIdForCompleteTable(project[scenario].measures.water_heating.water_usage);
            if (project[scenario].measures.water_heating.storage_type != undefined)
                out += measureForCompleteTable(project[scenario].measures.water_heating.storage_type.measure);
            if (project[scenario].measures.water_heating.pipework_insulation != undefined)
                out += measureForCompleteTable(project[scenario].measures.water_heating.pipework_insulation.measure);
            if (project[scenario].measures.water_heating.hot_water_control_type != undefined)
                out += measureForCompleteTable(project[scenario].measures.water_heating.hot_water_control_type.measure);
        }
        // Heating controls
        if (project[scenario].measures.space_heating_control_type != undefined)
            out += measuresByIdForCompleteTable(project[scenario].measures.space_heating_control_type);
        // Heating systems
        if (project[scenario].measures.heating_systems != undefined)
            out += measuresByIdForCompleteTable(project[scenario].measures.heating_systems);
        // Generation
        if (project[scenario].use_generation == 1 && project[scenario].measures.PV_generation != undefined) {
            out += measureForCompleteTable(project[scenario].measures.PV_generation.measure);
        }
        // Lighting
        if (project[scenario].measures.LAC != undefined) {
            if (project[scenario].measures.LAC.lighting != undefined)
                out += measureForCompleteTable(project[scenario].measures.LAC.lighting.measure);
        }
    }
    return out;
}

function measureForCompleteTable(measure) {
    var html = "<table class='complete-measures-table'>";
    html += '<tr><td style="width:13%"><strong>Measure: </strong></td><td colspan=3>' + measure.name + '</td></tr>';
    if (typeof measure.location != 'undefined') {
        var location = measure.location.replace(/,br/g, ', '); // for measures applied in bulk to fabric elements the location has the form of: W9,brW10,brW21,brD3,brW4,brW5,brW6a,brW16 , and we dont want that
        if (location[location.length - 2] == ',' && location[location.length - 1] == ' ')
            location = location.substring(0, location.length - 2);
        html += '<tr><td><strong>Label/location: </strong></td><td colspan=3>' + location + '</td></tr>';
    }
    else
        html += '<tr><td><strong>Label/location: </strong></td><td colspan=3> Whole house</td></tr>';
    html += '<tr><td><strong>Description: </strong></td><td colspan=3>' + measure.description + '</td></tr>';
    html += '<tr><td><strong>Associated work: </strong></td><td colspan=3>' + measure.associated_work + '</td></tr>';
    if (measure.maintenance != 'undefined')
        html += '<tr><td><strong>Maintenance: </strong></td><td colspan=3>' + measure.maintenance + '</td></tr>';
    else
        html += '<tr><td><strong>Maintenance: </strong></td><td colspan=3> N/A</td></tr>';
    html += '<tr><td><strong>Special and other considerations: </strong></td><td colspan=3>' + measure.notes + '</td></tr>';
    html += '<tr><td><strong>Who by: </strong></td><td style="width:35%">' + measure.who_by + '</td>';
    html += '<td style="width:13%"><strong>Key risks: </strong></td><td>' + measure.key_risks + '</td></tr>';
    html += '<tr><td><strong>Benefits: </strong></td><td>' + measure.benefits + '</td>';
    if (measure.disruption != undefined)
        html += '<td><strong>Dirt and disruption: </strong></td><td>' + measure.disruption.replace('MEDIUMHIGH', 'MEDIUM / HIGH') + '</td></tr>';
    else
        html += '<td><strong>Dirt and disruption: </strong></td><td></td></tr>';
    if (measure.performance == undefined)
        var perf = '';
    else
        perf = format_performance_string(measure.performance); // We have realized that some units were inputted wrong in the library
    html += '<tr><td><strong>Performance target: </strong></td><td style="width:35%">' + perf + '</td>';
    html += '<td colspan=2><table  style="width:100%">';
    html += measure.min_cost == undefined ? '' : '<tr><td><strong>Minimum cost</strong></td><td colspan=3>' + measure.min_cost + '</td></tr>';
    html += '<tr><td style="width:25%"><strong>Cost (£/unit): </strong></td><td>' + measure.cost + '</td><td style="width:30%"><strong>Units: </strong></td><td>' + measure.cost_units + '</td></tr>';
    html += '<tr><td><strong>Quantity (units): </strong></td><td>' + (1.0 * measure.quantity).toFixed(2) + '</td><td><strong>Total cost (£): </strong></td><td>' + (1.0 * measure.cost_total).toFixed(2) + '</td></tr></table></td></tr>';
    html += "</table>";

    return html;
}

function measuresByIdForCompleteTable(measures_by_id) {
    var out = '';
    for (var id in measures_by_id)
        out += measureForCompleteTable(measures_by_id[id].measure);
    return out;
}




function populateMeasuresTable(scenario, tableSelector, summaryTableSelector, listSelector) {
    if (project[scenario].fabric.measures != undefined)
        addListOfMeasuresByIdToSummaryTable(project[scenario].fabric.measures, tableSelector, summaryTableSelector, listSelector);
    if (project[scenario].measures != undefined) {
        if (project[scenario].measures.ventilation != undefined) {
            if (project[scenario].measures.ventilation.extract_ventilation_points != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.extract_ventilation_points, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.ventilation.intentional_vents_and_flues != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues_measures, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.ventilation.draught_proofing_measures != undefined)
                addMeasureToSummaryTable(project[scenario].measures.ventilation.draught_proofing_measures, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.ventilation.ventilation_systems_measures != undefined)
                addMeasureToSummaryTable(project[scenario].measures.ventilation.ventilation_systems_measures, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.ventilation.clothes_drying_facilities != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.clothes_drying_facilities, tableSelector, summaryTableSelector, listSelector);
        }
        if (project[scenario].measures.water_heating != undefined) {
            if (project[scenario].measures.water_heating.water_usage != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.water_heating.water_usage, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.water_heating.storage_type != undefined)
                addMeasureToSummaryTable(project[scenario].measures.water_heating.storage_type, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.water_heating.pipework_insulation != undefined)
                addMeasureToSummaryTable(project[scenario].measures.water_heating.pipework_insulation, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.water_heating.hot_water_control_type != undefined)
                addMeasureToSummaryTable(project[scenario].measures.water_heating.hot_water_control_type, tableSelector, summaryTableSelector, listSelector);
        }
        if (project[scenario].measures.space_heating_control_type != undefined)
            addListOfMeasuresByIdToSummaryTable(project[scenario].measures.space_heating_control_type, tableSelector, summaryTableSelector, listSelector);
        if (project[scenario].measures.heating_systems != undefined)
            addListOfMeasuresByIdToSummaryTable(project[scenario].measures.heating_systems, tableSelector, summaryTableSelector, listSelector);
        if (project[scenario].measures.space_heating != undefined) {
            if (project[scenario].measures.space_heating.heating_control != undefined)
                addMeasureToSummaryTable(project[scenario].measures.space_heating.heating_control, tableSelector, summaryTableSelector, listSelector);
        }
        if (project[scenario].use_generation == 1 && project[scenario].measures.PV_generation != undefined) {
            addMeasureToSummaryTable(project[scenario].measures.PV_generation, tableSelector, summaryTableSelector, listSelector);
        }
        if (project[scenario].measures.LAC != undefined) {
            if (project[scenario].measures.LAC.lighting != undefined)
                addMeasureToSummaryTable(project[scenario].measures.LAC.lighting, tableSelector, summaryTableSelector, listSelector);
        }
    }
}
function addListOfMeasuresByIdToSummaryTable(listOfMeasures, tableSelector, summaryTableSelector, listSelector) {
    for (var measureID in listOfMeasures) {
        var measure = listOfMeasures[measureID];
        addMeasureToSummaryTable(measure, tableSelector, summaryTableSelector, listSelector);
    }
}
function addMeasureToSummaryTable(measure, tableSelector, summaryTableSelector, listSelector) {
    // Complete table
    var html = "<tr>";
    var row = $('<tr></tr>');
    for (var i = 0; i < measuresTableColumns.length; i++) {
        var cell = $('<td></td>');
        cell.html(isNaN(measure.measure[measuresTableColumns[i]]) ? measure.measure[measuresTableColumns[i]] : (1.0 * measure.measure[measuresTableColumns[i]]).toFixed(2));
        row.append(cell);
    }
    $(tableSelector).append(row);
    //Summary table
    addRowToSummaryTable(summaryTableSelector, measure.measure.name, measure.measure.location, measure.measure.description, measure.measure.performance,
            measure.measure.benefits, (1.0 * measure.measure.cost_total).toFixed(2), measure.measure.who_by, measure.measure.disruption);

    //List
    html = "<table class='no-break'>";
    html += '<tr><td style="width:13%"><strong>Measure: </strong></td><td colspan=3>' + measure.measure.name + '</td></tr>';
    if (typeof measure.measure.location != 'undefined') {
        var location = measure.measure.location.replace(/,br/g, ', '); // for measures applied in bulk to fabric elements the location has the form of: W9,brW10,brW21,brD3,brW4,brW5,brW6a,brW16 , and we dont want that
        if (location[location.length - 2] == ',' && location[location.length - 1] == ' ')
            location = location.substring(0, location.length - 2);
        html += '<tr><td><strong>Label/location: </strong></td><td colspan=3>' + location + '</td></tr>';
    }
    else
        html += '<tr><td><strong>Label/location: </strong></td><td colspan=3> Whole house</td></tr>';
    html += '<tr><td><strong>Description: </strong></td><td colspan=3>' + measure.measure.description + '</td></tr>';
    html += '<tr><td><strong>Associated work: </strong></td><td colspan=3>' + measure.measure.associated_work + '</td></tr>';
    if (measure.measure.maintenance != 'undefined')
        html += '<tr><td><strong>Maintenance: </strong></td><td colspan=3>' + measure.measure.maintenance + '</td></tr>';
    else
        html += '<tr><td><strong>Maintenance: </strong></td><td colspan=3> N/A</td></tr>';
    html += '<tr><td><strong>Special and other considerations: </strong></td><td colspan=3>' + measure.measure.notes + '</td></tr>';
    html += '<tr><td><strong>Who by: </strong></td><td style="width:35%">' + measure.measure.who_by + '</td>';
    html += '<td style="width:13%"><strong>Key risks: </strong></td><td>' + measure.measure.key_risks + '</td></tr>';
    html += '<tr><td><strong>Benefits: </strong></td><td>' + measure.measure.benefits + '</td>';
    if (measure.measure.disruption != undefined)
        html += '<td><strong>Dirt and disruption: </strong></td><td>' + measure.measure.disruption.replace('MEDIUMHIGH', 'MEDIUM / HIGH') + '</td></tr>';
    else
        html += '<td><strong>Dirt and disruption: </strong></td><td></td></tr>';
    if (measure.measure.performance == undefined)
        var perf = '';
    else
        var perf = measure.measure.performance.replace("WK.m2", "W/m<sup>2</sup>.K")
                .replace("W/K.m2", "W/m<sup>2</sup>.K")
                .replace('m3m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('m3/m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('W/msup2/sup.K', ' W/m<sup>2</sup>.K')
                .replace('msup3/sup/msup2/sup.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('na', 'n/a'); // We have realized that some units were inputted wrong in the library
    html += '<tr><td><strong>Performance target: </strong></td><td style="width:35%">' + perf + '</td>';
    html += '<td colspan=2><table  style="width:100%">';
    html += measure.measure.min_cost == undefined ? '' : '<tr><td><strong>Minimum cost</strong></td><td colspan=3>' + measure.measure.min_cost + '</td></tr>';
    html += '<tr><td style="width:25%"><strong>Cost (£/unit): </strong></td><td>' + measure.measure.cost + '</td><td style="width:30%"><strong>Units: </strong></td><td>' + measure.measure.cost_units + '</td></tr>';
    html += '<tr><td><strong>Quantity (units): </strong></td><td>' + (1.0 * measure.measure.quantity).toFixed(2) + '</td><td><strong>Total cost (£): </strong></td><td>' + (1.0 * measure.measure.cost_total).toFixed(2) + '</td></tr></table></td></tr>';
    html += "</table>";
    $(listSelector).append(html);
}

function initialiseMeasuresTable(tableSelector) {
    var html = '<tr>\
     <th class="tg-yw4l" rowspan="2">Measure</th>\<th class="tg-yw4l" rowspan="2">Label/location</th>\
     <th class="tg-yw4l" rowspan="2">Description</th>\
     <th class="tg-yw4l" rowspan="2">Performance Target</th>\         <th class="tg-yw4l" rowspan="2">Benefits (in order)</th>\
     <th class="tg-yw4l" colspan="4">How Much?</th>\
     <th class="tg-yw4l" rowspan="2">Who by?</th>\
     <th class="tg-yw4l" rowspan="2">Key risks</th>\
     <th class="tg-yw4l" rowspan="2">Dirt and disruption?</th>\
     <th class="tg-yw4l" rowspan="2">Associated work?</th>\
     <th class="tg-yw4l" rowspan="2">Maintenace</th>\
     <th class="tg-yw4l" rowspan="2">Special and other considerations</th>\
     </tr>\
     <tr>\
     <td class="th">Rate (£)</td>\ 						    <td class="th">Unit</td>\
     <td class="th">Quantity</td>\
     <td class="th">Total</td>\
     </tr>';
    return $(tableSelector).html(html);
}
function createMeasuresTable(scenario, tableSelector, summaryTableSelector, listSelector) {
    initialiseMeasuresTable(tableSelector);
    initiliaseMeasuresSummaryTable(summaryTableSelector);
    populateMeasuresTable(scenario, tableSelector, summaryTableSelector, listSelector);
}

function initiliaseMeasuresSummaryTable(summaryTableSelector) {
    var html = "<thead>\
     <tr>\
     <th>Name</th>\<th>Label/location</th>\ <th>Performance target</th>\         <th>Benefits (in order)</th>\ 	 	 	<th>Cost</th>\
     <th>Completed By</th>\
     <th>Disruption</th>\
     </tr>\ 			</thead>\
     <tbody>\
     </tbody>";
    return $(summaryTableSelector).html(html);
}

function addRowToSummaryTable(tableSelector, name, location, description, performance, benefits, cost, who_by, disruption) {
    var html = '<tr><td class="highlighted-col">' + name + '</td>';
    if (typeof location != 'undefined') {
        location = location.replace(/,br/g, ', '); // for measures applied in bulk to fabric elements the location has the form of: W9,brW10,brW21,brD3,brW4,brW5,brW6a,brW16 , and we dont want that
        if (location[location.length - 2] == ',' && location[location.length - 1] == ' ')
            location = location.substring(0, location.length - 2);
        if (location.length > 50)
            location = "Various";
        html += '<td><div class="text-width-limiter">' + location + '</div>';
    }
    else
        html += '<td><div class="text-width-limiter">Whole house</div>';
    html += '</td>';
    if (typeof (performance) != 'string')
        var perf = "";
    else {
        var perf = performance.replace("WK.m2", "W/m<sup>2</sup>.K")
                .replace("W/K.m2", "W/m<sup>2</sup>.K")
                .replace('m3m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('m3/m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('W/msup2/sup.K', ' W/m<sup>2</sup>.K')
                .replace('msup3/sup/msup2/sup.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('na', 'n/a'); // We have realized that some units were inputted wrong in the library
    }
    html += '<td>' + perf + '</td>';
    html += '<td>' + benefits + '</td>';
    html += '<td class="cost">£' + Number(cost).toFixed(0) + '</td>';
    html += '<td>' + who_by + '</td>';
    if (typeof (disruption) == 'string')
        html += '<td>' + disruption.replace('MEDIUMHIGH', 'MEDIUM / HIGH') + '</td>';
    else
        html += '<td></td>';
    html += '</tr>';
    $(tableSelector + " tbody").append($(html));
}
