console.log('Debug compare.js');
function compare_initUI() {
    // Summary
    generateSummary('#summary');
    // Comparison tables
    for (var scenario in project) {
        if (scenario != 'master') {
            $('#compare').append('<h3 style="margin-top:25px">Master/' + scenario + ' Comparison table</h3>');
            $('#compare').append('<hr />');
            $('#compare').append('<div id="comparison-' + scenario + '" style="margin-left:25px">');
            compareCarbonCoop(scenario, "#comparison-" + scenario);
        }
    }
}

function generateSummary(outputElement) {
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
    $(outputElement).append(out);
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


function compareCarbonCoop(scenario, outputElement) {

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
    $(outputElement).html(out);
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
                || project[scenario].ventilation.ventilation_type == 'PS')
                && project[scenario].measures.ventilation != undefined
                && project[scenario].measures.ventilation.extract_ventilation_points != undefined) {
            changed = true;
            for (z in project[scenario].measures.ventilation.extract_ventilation_points) {
                var EVP = project[scenario].measures.ventilation.extract_ventilation_points[z];
                if (EVP.original == 'empty')
                    out += '<tr><td>A new <i>' + EVP.measure.name + ' (' + EVP.measure.ventilation_rate + ' m<sup>3</sup>/h)</i> has been added to <i>'
                            + EVP.measure.location + '</i> </td></tr>';
                else {
                    out += '<tr><td>The <i>' + EVP.original.name + ' (' + EVP.original.ventilation_rate
                            + ' m<sup>3</sup>/h)</i> in <i>' + EVP.original.location
                            + '</i> has been replaced with <i>' + EVP.measure.name + ' (' + EVP.measure.ventilation_rate
                            + ' m<sup>3</sup>/h)</i></td></tr>';
                }
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

    return {html: out, changed: changed};
}

function compareInfiltration(scenario) {
    var out = "";
    var changed = false;
    if (project.master.ventilation.air_permeability_test === false && project[scenario].ventilation.air_permeability_test === false) {
        var properties_to_check = [
            ['Number of sides sheltered', 'ventilation.number_of_sides_sheltered'],
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
    else if (project.master.ventilation.air_permeability_test === false
            && project[scenario].ventilation.air_permeability_test === true
            && project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.draught_proofing_measures != undefined) {
        changed = true;
        out += '<tr><td>The structural infiltration due to dwelling construction was changed applying <i>'
                + project[scenario].measures.ventilation.draught_proofing_measures.measure.name
                + '</i> with q50 = <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.q50
                + ' cubic metres per hour per square metre of envelope</i> </td></tr>';
        out += '<tr><td>The structural infiltration due to dwelling construction was <i>'
                + project[scenario].measures.ventilation.draught_proofing_measures.original_structural_infiltration
                + ' ACH</i>, after applying the measures: <i>' + project[scenario].ventilation.structural_infiltration.toFixed(2)
                + ' ACH</i></td></tr>';
        +'</i></td></tr>';
    }
    else if (project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.draught_proofing_measures != undefined) {
        changed = true;
        out += '<tr><td>The original Infiltration due to dweling construction was calculated \n\
        based on air tightness test with q50 = <i>' + project.master.ventilation.air_permeability_value
                + ' cubic metres per hour per square metre of envelope area</i>. \n\
        After applying <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.name
                + '</i>,  q50 = <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.q50
                + '</i></td></tr>';
        out += '<tr><td>The structural infiltration due to dwelling construction was <i>'
                + project[scenario].measures.ventilation.draught_proofing_measures.original_structural_infiltration
                + ' ACH</i>, after applying the measures: <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.structural_infiltration
                + ' ACH</i></td></tr>';
        +'</i></td></tr>';
    }
    if (project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.intentional_vents_and_flues != undefined) {
        changed = true;
        for (z in project[scenario].measures.ventilation.intentional_vents_and_flues) {
            var IVF = project[scenario].measures.ventilation.intentional_vents_and_flues[z];
            out += '<tr><td>A new <i>' + IVF.measure.name + ' (' + IVF.measure.ventilation_rate + ' m<sup>3</sup>/h)</i> has been added to <i>'
                    + IVF.measure.location + '</i> </td></tr>';
        }
    }
    if (project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined) {
        for (z in project[scenario].measures.ventilation.intentional_vents_and_flues_measures) {
            var IVF = project[scenario].measures.ventilation.intentional_vents_and_flues_measures[z];
            out += '<tr><td>The <i>' + IVF.original.name + ' (' + IVF.original.ventilation_rate
                    + ' m<sup>3</sup>/h)</i> in <i>' + IVF.original.location
                    + '</i> has been replaced with <i>' + IVF.measure.name + ' (' + IVF.measure.ventilation_rate
                    + ' m<sup>3</sup>/h)</i></td></tr>';
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
        ['Loses due to ventilation and infiltration (WK)', 'ventilation.average_WK']
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
    if (project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.clothes_drying_facilities != undefined) {
        for (z in project[scenario].measures.ventilation.clothes_drying_facilities) {
            changed = true;
            out += '<tr><td>A new <i>' + project[scenario].measures.ventilation.clothes_drying_facilities[z].measure.name + '</i> has been added</td></tr>';
        }
    }

    return {html: out, changed: changed};
}

function compareFabric(scenario) {
    var out = "";
    var changed = false;
    if (project[scenario].fabric.measures != undefined && Object.keys(project[scenario].fabric.measures).length > 0) {
        changed = true;
        for (z in project[scenario].fabric.measures) {
            var measure = project[scenario].fabric.measures[z];
            if (measure.original_element != undefined) // Measure applied to only one element
                out += compareFabricElement(measure.original_element, measure.measure);
            if (measure.original_elements != undefined) { // Bulk Measure 
                for (var id in measure.original_elements)
                    out += compareFabricElement(measure.original_elements[id], measure.measure);
            }

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
    // Hot water demand
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

// Check if any water usage has been deleted
    project.master.water_heating.water_usage.forEach(function (wu_in_master, key) {
        var found = false;
        project[scenario].water_heating.water_usage.forEach(function (wu_in_scenario, key) {
            if (wu_in_master.id === wu_in_scenario.id && wu_in_master.tag === wu_in_scenario.tag)
                found = true;
        });
        if (found === false) {
            changed = true;
            out += '<tr><td><i>' + wu_in_master.name + '</i> has been removed</td></tr>';
        }
    });
    // Check if any water usage has been added
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.water_usage != undefined
            && Object.keys(project[scenario].measures.water_heating.water_usage).length > 0) {
        changed = true;
        for (var key in project[scenario].measures.water_heating.water_usage)
            out += '<tr><td>A new <i>' + project[scenario].measures.water_heating.water_usage[key].measure.name + '</i> has been added</td></tr>';
    }

// Space heating demand
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

// Heating systems
    if (project[scenario].measures.heating_systems != undefined
            && Object.keys(project[scenario].measures.heating_systems).length > 0) {
        changed = true;
        for (id in project[scenario].measures.heating_systems) {
            var heating_system = project[scenario].measures.heating_systems[id];
            if (heating_system.original != 'empty')
                out += '<tr><td><i>' + heating_system.original.name + '</i> has been replaced with <i>' + heating_system.measure.name + '</i></td></tr>';
            else
                out += '<tr><td>A new heating system has been added: <i>' + heating_system.measure.name + '</i></td></tr>';
        }
    }

//Heating systems deleted and change on their parameters
    /*project.master.heating_systems.forEach(function (hs_in_master, index) {
     var hs_in_scenario = getHeatingSystemById(hs_in_master.id, scenario);
     for (var parameter in hs_in_master) {
     if (hs_in_master[parameter] != hs_in_scenario[parameter]) {
     changed = true;
     out += '<tr><td>The <i>' + parameter + '</i> of <i>' + hs_in_master.name + '</i> has changed from <i>'
     + hs_in_master[parameter] + '</i> to <i>' + hs_in_scenario[parameter] + '</i> </td></tr>';
     }
     }
     });*/

// Space heating system controls
    if (project[scenario].measures.space_heating_control_type != undefined
            && Object.keys(project[scenario].measures.space_heating_control_type).length > 0) {
        changed = true;
        for (var id in project[scenario].measures.space_heating_control_type) {
            var heating_system_control = project[scenario].measures.space_heating_control_type[id];
            out += '<tr><td>The control of <i>' + getHeatingSystemById(id, scenario).name + '</i> has been replaced with <i>' + heating_system_control.measure.name + '</i></td></tr>';
        }
    }

//Hot water systems
    var properties_to_check = [
        ['Include solar hot water?', 'water_heating.solar_water_heating']
    ];
    var SHW = comparePropertiesInArray(scenario, properties_to_check);
    if (SHW.changed === true) {
        changed = true;
        out += SHW.html;
    }

// Check if the hot water storage control type has changed 
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.hot_water_control_type != undefined) {
        changed = true;
        out += '<tr><td>The hot water storage control type has changed from <i>' + project[scenario].measures.water_heating.hot_water_control_type.original + '</i> to <i>' + project[scenario].measures.water_heating.hot_water_control_type.measure.control_type
                + '</i></td></tr>';
    }

// Check if the primary pipework insulation has changed 
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.pipework_insulation != undefined) {
        changed = true;
        out += '<tr><td>The primary circuit pipework insulation has changed from <i>'
                + project[scenario].measures.water_heating.pipework_insulation.original
                + '</i> to <i>' + project[scenario].measures.water_heating.pipework_insulation.measure.pipework_insulation
                + '</i></td></tr>';
    }
// Storage type
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.storage_type_measures != undefined) {
        changed = true;
        out += '<tr><td>The type of storage has changed from <i>'
                + project[scenario].measures.water_heating.storage_type_measures.original.name + '</i> to <i>' + project[scenario].measures.water_heating.storage_type_measures.measure.name
                + '</i></td></tr>';
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
        ['Solar PV Feed in tariff (£/kWh)', 'generation.solar_FIT'],
        ['Wind Annual Generation', 'generation.wind_annual_kwh'],
        ['Wind Fraction used on-site', 'generation.wind_fraction_used_onsite'],
        ['Wind Feed in tariff (£/kWh)', 'generation.wind_FIT'],
        ['Hydro Annual Generation', 'generation.hydro_annual_kwh'],
        ['Hydro Fraction used on-site', 'generation.hydro_fraction_used_onsite'],
        ['Hydro Feed in tariff (£/kWh)', 'generation.hydro_FIT'],
        ['Array Installed Capacity kWp (PV calculator)', 'generation.solarpv_kwp_installed'],
        ['Array Orientation (PV calculator)', 'generation.solarpv_orientation'],
        ['Array Inclination (PV calculator)', 'generation.solarpv_inclination'],
        ['Overshading factor (PV calculator)', 'generation.solarpv_overshading'],
        ['Annual generation (PV calculator)', 'generation.solarpv_annual_kwh'],
        ['Fraction used on-site (PV calculator)', 'generation.solarpv_fraction_used_onsite'],
        ['Feed in tariff (£/kWh) (PV calculator)', 'generation.solarpv_FIT']
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
