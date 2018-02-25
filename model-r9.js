/*
 
 An open source building energy model based on SAP.
 
 Studying the SAP model we see that the calculations can be broken down into sub
 calculation modules and that it could be possible to create a flexible model where
 you can include or exclude certain parts depending on the granularity or adherance
 to SAP that you would like.
 
 Principles
 
 - All variables that are accessed in the ui need to be available via the data object.
 
 - Variables written to from one module and accessed from another need to be in the
 global name space.
 
 - Variables used internally by a module that are also accessed in the ui should be
 defined within the module namespace.
 
 - Variables used internally by a module that are not accessed by the ui should be
 defined as local variables within the module's calc function.
 
 - variable naming: this_is_a_variable. _ between words. Abreviations can be in capitals
 otherwise lower case.
 
 - if the module has a primary data object i.e floors call the module by the data object
 name.
 
 - calc functions should be divided by task.
 
 - Version of the model is noted as major.minor -> changes of the major value are due to 
 a change of inputs to the model. Changes of the minor values are due to changes only in the code.
 */

var version = 9.21;

var calc = {data: {}};


/******************************************************************
 * RUN
 * 
 * Run all the modules in the right order 
 * 
 ******************************************************************/
calc.run = function (datain)
{
    calc.data = calc.start(datain);
    calc.start(calc.data);
    calc.floors(calc.data);
    calc.occupancy(calc.data);
    calc.fabric(calc.data);
    calc.ventilation(calc.data);
    calc.LAC_SAP(calc.data);
    calc.water_heating(calc.data);
    calc.SHW(calc.data);
    calc.applianceCarbonCoop(calc.data);
    calc.appliancelist(calc.data);
    calc.generation(calc.data);
    calc.currentenergy(calc.data);
    calc.metabolic_losses_fans_and_pumps_gains(calc.data);
    calc.temperature(calc.data);
    calc.fans_and_pumps_and_combi_keep_hot(calc.data);
    calc.gains_summary(calc.data);
    calc.space_heating(calc.data);
    calc.heating_systems(calc.data);
    calc.fuel_requirements(calc.data);
    calc.primary_energy_by_requirement(calc.data);
    calc.SAP(calc.data);
    calc.data.totalWK = calc.data.fabric_total_heat_loss_WK + calc.data.ventilation.average_WK;
    calc.data.primary_energy_use_m2 = calc.data.primary_energy_use / calc.data.TFA;
    calc.data.kgco2perm2 = calc.data.annualco2 / calc.data.TFA;
    calc.data.kwhdpp = (calc.data.energy_use / 365.0) / calc.data.occupancy;
    calc.data.primarykwhdpp = (calc.data.primary_energy_use / 365.0) / calc.data.occupancy;
    return calc.data;
}

/******************************************************************
 * START
 * 
 * Inits the data input object 
 * 
 ******************************************************************/
calc.start = function (data)
{
    data = data || {};
    // Global namespace variables:
    if (data.region == undefined)
        data.region = 0;
    if (data.altitude == undefined)
        data.altitude = 0;
    if (data.LAC_calculation_type == undefined)
        data.LAC_calculation_type = 'SAP';
    if (data.fuels == undefined)
        data.fuels = datasets.fuels;
    data.num_of_floors = 0;
    data.TFA = 0;
    data.volume = 0;
    data.occupancy = 0;
    data.internal_temperature = [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18];
    data.external_temperature = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    data.losses_WK = {};
    data.gains_W = {};
    data.annual_useful_gains_kWh_m2 = {};
    data.annual_losses_kWh_m2 = {};
    data.energy_requirements = {};
    data.fuel_requirements = {
        lighting: {quantity: 0, list: []},
        cooking: {quantity: 0, list: []},
        appliances: {quantity: 0, list: []},
        waterheating: {quantity: 0, list: []},
        space_heating: {quantity: 0, list: []},
        fans_and_pumps: {quantity: 0, list: []}
    };
    data.fuel_totals = {};
    data.mean_internal_temperature = {};
    data.total_cost = 0;
    data.total_income = 0;
    data.primary_energy_use = 0;
    data.kgco2perm2 = 0;
    data.primary_energy_use_bills = 0;
    data.space_heating_demand_m2 = 0;
    data.primary_energy_use_by_requirement = {};
    data.totalWK = 0;

    return data;
}

/*---------------------------------------------------------------------------------------------
 // FLOORS
 // 
 // Inputs from user:  
 //      - data.floors
 //      
 // Global Outputs: 
 //      - data.TFA
 //      - data.volume
 //      - data.num_of_floors
 //--------------------------------------------------------------------------------------------*/

calc.floors = function (data)
{
    if (data.floors == undefined)
        data.floors = [];
    for (z in data.floors)
    {
        data.floors[z].volume = data.floors[z].area * data.floors[z].height;
        data.TFA += data.floors[z].area;
        data.volume += data.floors[z].volume;
        data.num_of_floors++;
    }

    return data;
}

/*---------------------------------------------------------------------------------------------
 // OCCUPANCY
 // 
 // SAP calculation of occupancy based on total floor area
 // 
 // Global inputs:  
 //      - data.use_custom_occupancy
 //      - data.custom_occupancy
 //      - data.TFA
 //      
 // Global outputs: 
 //  - data.occupancy
 //--------------------------------------------------------------------------------------------*/

calc.occupancy = function (data)
{
    if (data.use_custom_occupancy == undefined)
        data.use_custom_occupancy = false;
    if (data.custom_occupancy == undefined)
        data.custom_occupancy = 1;
    if (data.TFA > 13.9) {
        data.occupancy = 1 + 1.76 * (1 - Math.exp(-0.000349 * Math.pow((data.TFA - 13.9), 2))) + 0.0013 * (data.TFA - 13.9);
    } else {
        data.occupancy = 1;
    }

    if (data.use_custom_occupancy)
    {
        data.occupancy = data.custom_occupancy;
    }

    return data;
}

/*---------------------------------------------------------------------------------------------
 // BUILDING FABRIC
 // 
 // Calculates:
 //      - total monthly fabric heat loss
 //      - monthly solar gains from building elements list
 //      
 // Inputs from user:  
 //      - data.fabric.elements, 
 //      - data.fabric.thermal_bridging_yvalue, 
 //      - data.fabric.global_TMP // global thermal mass parameter: true or false
 //      - data.fabric.global_TMP_value
 //      
 // Inputs from other modules:  
 //      - data.TFA
 //      
 // Global Outputs: 
 //      - data.TMP, 
 //      - data.losses_WK.fabric, 
 //      - data.gains_W.solar, 
 //      - data.GL
 //      - data.fabric_total_heat_loss_WK
 //      
 // Module Variables: 
 //      - data.fabric.TMP
 //      - data.fabric.elements[z].netarea
 //      - data.fabric.elements[z].windowarea
 //      - data.fabric.elements[z].wk
 //      - data.fabric.elements[z].gain
 //      - data.fabric.total_external_area
 //      - data.fabric.total_floor_WK
 //      - data.fabric.total_floor_area
 //      - data.fabric.total_wall_WK
 //      - data.fabric.total_wall_area
 //      - data.fabric.total_roof_WK
 //      - data.fabric.total_roof_area
 //      - data.fabric.total_window_WK
 //      - data.fabric.total_window_area
 //      - data.fabric.total_party_wall_WK
 //      - data.fabric.total_party_wall_area
 //      - data.fabric.total_thermal_capacity
 //      - data.fabric.thermal_bridging_heat_loss
 //      - data.fabric.fabric_heat_loss_WK
 //      - data.fabric.total_heat_loss_WK
 //      - data.fabric.annual_solar_gain
 //      - data.fabric.annual_solar_gain_kwh
 //      
 // Uses external function: 
 //      - calc_solar_gains_from_windows
 // 
 // Datasets:
 //      - table_6d_solar_access_factor
 //      - table_6d_light_access_factor
 // 
 //---------------------------------------------------------------------------------------------*/

calc.fabric = function (data, solar_acces_factor)
{
    if (data.fabric == undefined)
        data.fabric = {};
    if (data.fabric.elements == undefined)
        data.fabric.elements = [];
    if (data.fabric.thermal_bridging_yvalue == undefined)
        data.fabric.thermal_bridging_yvalue = 0.15;
    if (data.fabric.global_TMP == undefined)
        data.fabric.global_TMP = false;
    if (data.fabric.global_TMP_value == undefined)
        data.fabric.global_TMP_value = 250; // medium
    if (solar_acces_factor == undefined)
        solar_acces_factor = 'winter'; // solar gains for heating only use 'Winter access factor', while the summer one is used for the calculatin of "Solar gains for cooling and Summer temperatures", table 6d, p. 216 SAP2012
    data.fabric_total_heat_loss_WK = 0;
    data.fabric.total_heat_loss_WK = 0;
    data.fabric.total_thermal_capacity = 0;
    data.fabric.total_floor_WK = 0;
    data.fabric.total_wall_WK = 0;
    data.fabric.total_roof_WK = 0;
    data.fabric.total_window_WK = 0;
    data.fabric.total_party_wall_WK = 0;
    data.fabric.annual_solar_gain = 0;
    data.fabric.total_external_area = 0;
    data.fabric.total_wall_area = 0;
    data.fabric.total_floor_area = 0;
    data.fabric.total_roof_area = 0;
    data.fabric.total_window_area = 0;
    data.fabric.total_party_wall_area = 0;
    // Solar gains
    var sum = 0; // lighting gains
    var gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Solar gains
    /*var gains_by_orientation = {
     0:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     1:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     2:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     3:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     4:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     5:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
     };*/
    for (z in data.fabric.elements)
    {
// Calculate heat loss through elements

// Use element length and height if given rather than area.
        if (data.fabric.elements[z]['l'] != undefined && data.fabric.elements[z]['l'] != '' && data.fabric.elements[z]['h'] != undefined && data.fabric.elements[z]['h'] != '')
        {
            data.fabric.elements[z].area = data.fabric.elements[z]['l'] * data.fabric.elements[z]['h'];
        }
        data.fabric.elements[z].netarea = data.fabric.elements[z].area;
        if (data.fabric.elements[z].type != 'window' && data.fabric.elements[z].type != 'Window' && data.fabric.elements[z].type != 'Door' && data.fabric.elements[z].type != 'Roof_light' && data.fabric.elements[z].type != 'Hatch') {
            data.fabric.elements[z].windowarea = 0;
        }

// Subtract window areas:

        for (w in data.fabric.elements)
        {
            if (data.fabric.elements[w].type == 'window' || data.fabric.elements[w].type == 'Window' || data.fabric.elements[w].type == 'Door' || data.fabric.elements[w].type == 'Roof_light' || data.fabric.elements[w].type == 'Hatch')
            {
//if (data.fabric.elements[w].subtractfrom != undefined && data.fabric.elements[w].subtractfrom == z)
                if (data.fabric.elements[w].subtractfrom != undefined && data.fabric.elements[w].subtractfrom == data.fabric.elements[z].id)
                {
                    var windowarea = data.fabric.elements[w].area;
                    if (data.fabric.elements[w]['l'] != undefined && data.fabric.elements[w]['l'] != '' && data.fabric.elements[w]['h'] != undefined && data.fabric.elements[w]['h'] != '')
                    {
                        windowarea = data.fabric.elements[w]['l'] * data.fabric.elements[w]['h'];
                    }
                    data.fabric.elements[z].windowarea += windowarea;
                    data.fabric.elements[z].netarea -= windowarea;
                }
            }
        }

        if (data.fabric.elements[z].type == 'window' || data.fabric.elements[z].type == 'Window' || data.fabric.elements[z].type == 'Roof_light')
            data.fabric.elements[z].wk = data.fabric.elements[z].netarea * (1 / (1 / data.fabric.elements[z].uvalue + 0.04)); // SAP assumes we are using curtains: paragraph 3.2, p. 15, SAP2012
        else
            data.fabric.elements[z].wk = data.fabric.elements[z].netarea * data.fabric.elements[z].uvalue;
        data.fabric.total_heat_loss_WK += data.fabric.elements[z].wk;
        // By checking that the u-value is not 0 = internal walls we can calculate total external area
        //if (data.fabric.elements[z].uvalue != 0 && data.fabric.elements[z].netarea != undefined) {
        if (data.fabric.elements[z].uvalue != 0 && data.fabric.elements[z].type != 'party_wall' && data.fabric.elements[z].type != 'Party_wall') {
            if (data.fabric.elements[z].netarea == undefined)
                data.fabric.elements[z].netarea = 0;
            data.fabric.total_external_area += data.fabric.elements[z].netarea;
        }


        if (data.fabric.elements[z].type == 'floor' || data.fabric.elements[z].type == 'Floor') {
            data.fabric.total_floor_WK += data.fabric.elements[z].wk;
            data.fabric.total_floor_area += data.fabric.elements[z].netarea;
        }
        if (data.fabric.elements[z].type == 'wall' || data.fabric.elements[z].type == 'Wall') {
            data.fabric.total_wall_WK += data.fabric.elements[z].wk;
            data.fabric.total_wall_area += data.fabric.elements[z].netarea;
        }
        if (data.fabric.elements[z].type == 'roof' || data.fabric.elements[z].type == 'Roof' || data.fabric.elements[z].type == 'Loft') {
            data.fabric.total_roof_WK += data.fabric.elements[z].wk;
            data.fabric.total_roof_area += data.fabric.elements[z].netarea;
        }
        if (data.fabric.elements[z].type == 'window' || data.fabric.elements[z].type == 'Window' || data.fabric.elements[z].type == 'Door' || data.fabric.elements[z].type == 'Roof_light' || data.fabric.elements[z].type == 'Hatch') {
            data.fabric.total_window_WK += data.fabric.elements[z].wk;
            data.fabric.total_window_area += data.fabric.elements[z].netarea;
        }
        if (data.fabric.elements[z].type == 'party_wall' || data.fabric.elements[z].type == 'Party_wall') {
            data.fabric.total_party_wall_WK += data.fabric.elements[z].wk;
            data.fabric.total_party_wall_area += data.fabric.elements[z].netarea;
        }

// Calculate total thermal capacity
        if (data.fabric.elements[z].kvalue != undefined) {
            data.fabric.total_thermal_capacity += data.fabric.elements[z].kvalue * data.fabric.elements[z].area;
        }

        if (data.fabric.elements[z].type == 'window' || data.fabric.elements[z].type == 'Window' || data.fabric.elements[z].type == 'Door' || data.fabric.elements[z].type == 'Roof_light')
        {
            var orientation = data.fabric.elements[z]['orientation'] != '' ? data.fabric.elements[z]['orientation'] : 0; // For a reason that i haven't been able to find when it is zero, orientation = data.fabric.elements[z]['orientation'] becomes an empty string
            //var orientation = data.fabric.elements[z]['orientation'];
            var area = data.fabric.elements[z]['area'];
            var overshading = data.fabric.elements[z]['overshading'] != '' ? data.fabric.elements[z]['overshading'] : 0; // For a reason that i haven't been able to find when it is zero, orientation = data.fabric.elements[z]['overshading'] becomes an empty string
            //var overshading = data.fabric.elements[z]['overshading'];
            var g = data.fabric.elements[z]['g'];
            var gL = data.fabric.elements[z]['gL'];
            var ff = data.fabric.elements[z]['ff'];
            var gain = 0;
            // The gains for a given window are calculated for each month
            // the result of which needs to be put in a bin for totals for jan, feb etc..
            for (var month = 0; month < 12; month++)
            {
                // access factor is time of year dependent
                // Summer months: 5:June, 6:July, 7:August and 8:September (where jan = month 0)
                var summer = 0;
                if (solar_acces_factor == 'summer' && month >= 5 && month <= 8) // solar gains for heating only use 'Winter access factor', while the summer one is used for the calculatin of "Solar gains for cooling and Summer temperatures", table 6d, p. 216 SAP2012
                    summer = 1;
                // According to SAP2012 (p,26 note2) a solar access factor of 1.0 [...] should be used for roof lights, but we think that is not right (see issue 237: https://github.com/emoncms/MyHomeEnergyPlanner/issues/237 
                /*if (data.fabric.elements[z].type == 'Roof_light')
                 var access_factor = 1.0;
                 else*/
                var access_factor = datasets.table_6d_solar_access_factor[overshading][summer];
                // Map orientation code from window to solar rad orientation codes.
                if (orientation == 5)
                    orientation = 3; // SE/SW
                if (orientation == 6)
                    orientation = 2; // East/West
                if (orientation == 7)
                    orientation = 1; // NE/NW

                var gain_month = access_factor * area * solar_rad(data.region, orientation, 90, month) * 0.9 * g * ff;
                gains[month] += gain_month; // Solar gains
                gain += gain_month;
            }

            // According to SAP2012 (p,26 note2) a solar access factor of 1.0 [...] should be used for roof lights, but we think that is not right (see issue 237: https://github.com/emoncms/MyHomeEnergyPlanner/issues/237 
            /*if (data.fabric.elements[z].type == 'Roof_light')
             sum += 0.9 * area * gL * ff * 1.0; // Ligthing gains
             else*/
            sum += 0.9 * area * gL * ff * datasets.table_6d_light_access_factor[overshading]; // Ligthing gains
            data.fabric.elements[z].gain = gain / 12.0;
            data.fabric.annual_solar_gain += data.fabric.elements[z].gain;
        }
    }

    data.fabric.thermal_bridging_heat_loss = data.fabric.total_external_area * data.fabric.thermal_bridging_yvalue;
    data.fabric.fabric_heat_loss_WK = data.fabric.total_heat_loss_WK;
    data.fabric.total_heat_loss_WK += data.fabric.thermal_bridging_heat_loss;
    data.fabric.annual_solar_gain_kwh = data.fabric.annual_solar_gain * 0.024 * 365;
    if (data.fabric.global_TMP)
        data.TMP = data.fabric.global_TMP_value;
    else
        data.TMP = data.fabric.total_thermal_capacity / data.TFA;
    var monthly_fabric_heat_loss = [];
    for (var m = 0; m < 12; m++)
        monthly_fabric_heat_loss[m] = data.fabric.total_heat_loss_WK;
    data.fabric_total_heat_loss_WK = data.fabric.total_heat_loss_WK;
    data.losses_WK["fabric"] = monthly_fabric_heat_loss;
    data.gains_W["solar"] = gains;
    data.GL = sum / data.TFA;
    return data;
};

/*---------------------------------------------------------------------------------------------
 // VENTILATION
 // Inputs from user: 
 //      - data.ventilation.ventilation_type
 //      - data.ventilation.IVF
 //      - data.ventilation.EVP
 //      - data.ventilation.dwelling_construction
 //      - data.ventilation.suspended_wooden_floor
 //      - data.ventilation.suspended_wooden_floor
 //      - data.ventilation.draught_lobby
 //      - data.ventilation.percentage_draught_proofed
 //      - data.ventilation.air_permeability_test
 //      - data.ventilation.air_permeability_value
 //      - data.ventilation.number_of_sides_sheltered
 //      - data.ventilation.system_air_change_rate
 //      - data.ventilation.balanced_heat_recovery_efficiency
 //      
 // Inputs from other modules: 
 //      - data.volume
 //      - data.num_of_floors
 //      - data.region
 //      
 // Global Outputs: 
 //      - data.losses_WK.ventilation
 // 
 // Module variables:
 //      - data.ventilation.infiltration_chimeneyes_fires_fans
 //      - data.ventilation.infiltration_rate // includes chimneys and fans
 //      - data.ventilation.EVP_air_changes
 //      - data.ventilation.infiltration_rate_incorp_shelter_factor
 //      - data.ventilation.windfactor // monthly
 //      - data.ventilation.adjusted_infiltration // monthly
 //      - data.ventilation.adjusted_EVP_air_changes // monthly
 //      - data.ventilation.average_WK 
 //      - data.ventilation.average_infiltration_WK
 //      - data.ventilation.average_ventilation_WK
 //      - data.ventilation.effective_air_change_rate 
 //      - data.ventilation.infiltration_WK 
 //      - data.ventilation.ventilation_WK 
 //      - data.losses_WK.ventilation 
 //      - data.losses_WK.infiltration
 //      - data.ventilation.SAP_ventilation_WK // includes loses due to the ventilation system and infiltration
 //      - data.totalWK_monthly 
 // 
 // Datasets: 
 //      - datasets.table_u2
 //      
 //---------------------------------------------------------------------------------------------*/

calc.ventilation = function (data)
{
    var defaults = {
        air_permeability_test: false,
        air_permeability_value: 0,
        dwelling_construction: 'timberframe',
        suspended_wooden_floor: 0, // 'unsealed', 'sealed', 0
        draught_lobby: false,
        percentage_draught_proofed: 0,
        number_of_sides_sheltered: 0,
        ventilation_type: 'NV',
        ventilation_name: 'Natural ventilation',
        system_air_change_rate: 0.5,
        system_specific_fan_power: 3,
        balanced_heat_recovery_efficiency: 65,
        structural_infiltration: 0,
        IVF: [],
        EVP: [],
        CDF: []
    };
    if (data.ventilation == undefined)
        data.ventilation = {};
    for (z in defaults)
    {
        if (data.ventilation[z] == undefined)
            data.ventilation[z] = defaults[z];
    }

    var total_IVF = 0;
    var total_EVP = 0;
    // Intentional vents and flues (IVF: Chimneys, open flues and flueless gas fires)
    for (z in data.ventilation.IVF)
        total_IVF += 1.0 * data.ventilation.IVF[z].ventilation_rate;
    // According to SAP2012 the loses due to EVP are "infiltration loses" but after 
    // discussion (GIT issue 177: https://github.com/emoncms/MyHomeEnergyPlanner/issues/177)
    // we have decided to consider them "ventilation losses"
    if (data.ventilation.ventilation_type == 'IE' || data.ventilation.ventilation_type == 'PS') {
        for (z in data.ventilation.EVP)
            total_EVP += 1.0 * data.ventilation.EVP[z].ventilation_rate;
    }

    var infiltration = 0;
    var EVP_air_changes = 0;

    if (data.volume != 0) {
        infiltration = total_IVF / data.volume;
        EVP_air_changes = total_EVP / data.volume;
        data.ventilation.infiltration_chimeneyes_fires_fans = infiltration;
    }

    // Strucutral infiltration
    data.ventilation.structural_infiltration = (data.num_of_floors - 1) * 0.1;
    if (data.ventilation.dwelling_construction == 'timberframe')
        data.ventilation.structural_infiltration += 0.25;
    if (data.ventilation.dwelling_construction == 'masonry')
        data.ventilation.structural_infiltration += 0.35;
    if (data.ventilation.suspended_wooden_floor == 'unsealed')
        data.ventilation.structural_infiltration += 0.2;
    if (data.ventilation.suspended_wooden_floor == 'sealed')
        data.ventilation.structural_infiltration += 0.1;
    if (!data.ventilation.draught_lobby)
        data.ventilation.structural_infiltration += 0.05;
    data.ventilation.structural_infiltration += (0.25 - (0.2 * data.ventilation.percentage_draught_proofed / 100));
    // Structural infiltration from test
    //data.ventilation.structural_infiltration_from_test = data.ventilation.air_permeability_value / 20.0; // This is the formula used in SAP, but it is wrong the units here are "m3/h/m2 of envelope area" but should be ACH
    var m3m2Ea_to_ACH_coefficient = (data.fabric.total_external_area + data.fabric.total_party_wall_area) / data.volume; // = Envelope area / dwelling volume
    data.ventilation.structural_infiltration_from_test = m3m2Ea_to_ACH_coefficient * data.ventilation.air_permeability_value / 20.0;
    if (data.ventilation.air_permeability_test == false)
        infiltration += data.ventilation.structural_infiltration;
    else
        infiltration += data.ventilation.structural_infiltration_from_test;
    data.ventilation.infiltration_rate = infiltration;
    data.ventilation.EVP_air_changes = EVP_air_changes;
    var shelter_factor = 1 - (0.075 * data.ventilation.number_of_sides_sheltered);
    infiltration *= shelter_factor;
    EVP_air_changes *= shelter_factor;
    data.ventilation.infiltration_rate_incorp_shelter_factor = infiltration;
    var adjusted_infiltration = [];
    var adjusted_EVP_air_changes = [];
    data.ventilation.windfactor = [];
    data.ventilation.adjusted_infiltration = [];
    data.ventilation.adjusted_EVP_air_changes = [];
    for (var m = 0; m < 12; m++)
    {
        var windspeed = datasets.table_u2[data.region][m];
        var windfactor = windspeed / 4;
        adjusted_infiltration[m] = infiltration * windfactor;
        adjusted_EVP_air_changes[m] = EVP_air_changes * windfactor;
        data.ventilation.windfactor[m] = windfactor;
        data.ventilation.adjusted_infiltration[m] = adjusted_infiltration[m];
        data.ventilation.adjusted_EVP_air_changes[m] = adjusted_EVP_air_changes[m];
    }

    // (24a)m effective_air_change_rate
    // (22b)m adjusted_infiltration
    // (23b)  input.effective_air_change_rate.exhaust_air_heat_pump
    // (23c)  input.balanced_heat_recovery_efficiency
    var effective_air_change_rate = [];
    var infiltration_WK = [];
    var ventilation_WK = [];
    var ventilation_type;
    switch (data.ventilation.ventilation_type)
    {
        case 'NV':
        case 'IE':
        case 'PS':
            ventilation_type = 'd'; // Natural ventilation or whole house positive input ventilation from loft
            break;
        case 'DEV':
        case'MEV':
            ventilation_type = 'c'; // Whole house extract ventilation or positive input ventilation from outside
            break;
        case 'MV':
            ventilation_type = 'b'; // Balanced mechanical ventilation without heat recovery (MV)
            break;
        case 'MVHR':
            ventilation_type = 'a'; //Balanced mechanical ventilation with heat recovery (MVHR)
            break;
        default:
            data.ventilation.ventilation_type = 'NV';
            ventilation_type = 'd';
            break;
    }

    // Calculation of infiltration and ventilation looses (SAP2012 only adds both together and call them "ventilation looses", confusing
    switch (ventilation_type)
    {
        case 'a':
            for (var m = 0; m < 12; m++)
            {
                // (24a)m = (22b)m + (23b) x (1 - (23c) / 100)
                effective_air_change_rate[m] = adjusted_infiltration[m] + data.ventilation.system_air_change_rate * (1 - data.ventilation.balanced_heat_recovery_efficiency / 100.0);
                infiltration_WK[m] = data.volume * 0.33 * adjusted_infiltration[m];
                ventilation_WK[m] = data.volume * 0.33 * data.ventilation.system_air_change_rate * (1 - data.ventilation.balanced_heat_recovery_efficiency / 100.0);
            }
            break;
        case 'b':
            for (var m = 0; m < 12; m++)
            {
                // (24b)m = (22b)m + (23b)
                effective_air_change_rate[m] = adjusted_infiltration[m] + data.ventilation.system_air_change_rate;
                infiltration_WK[m] = data.volume * 0.33 * adjusted_infiltration[m];
                ventilation_WK[m] = data.volume * 0.33 * data.ventilation.system_air_change_rate;
            }
            break;
        case 'c':
            for (var m = 0; m < 12; m++)
            {
                // if (22b)m < 0.5 × (23b), then (24c) = (23b); otherwise (24c) = (22b) m + 0.5 × (23b)
                // effective_air_change_rate[m] =
                if (adjusted_infiltration[m] < 0.5 * data.ventilation.system_air_change_rate) {
                    effective_air_change_rate[m] = data.ventilation.system_air_change_rate;
                    infiltration_WK[m] = 0;
                    ventilation_WK[m] = data.volume * 0.33 * data.ventilation.system_air_change_rate;
                } else {
                    effective_air_change_rate[m] = adjusted_infiltration[m] + (0.5 * data.ventilation.system_air_change_rate);
                    infiltration_WK[m] = data.volume * 0.33 * adjusted_infiltration[m];
                    ventilation_WK[m] = data.volume * 0.33 * 0.5 * data.ventilation.system_air_change_rate;
                }
            }
            break;
        case 'd':
            for (var m = 0; m < 12; m++)
            {
                // if (22b)m ≥ 1, then (24d)m = (22b)m otherwise (24d)m = 0.5 + [(22b)m2 × 0.5]
                if ((adjusted_infiltration[m] + adjusted_EVP_air_changes[m]) >= 1) {
                    effective_air_change_rate[m] = adjusted_infiltration[m] + adjusted_EVP_air_changes[m];
                    infiltration_WK[m] = data.volume * 0.33 * adjusted_infiltration[m];
                    ventilation_WK[m] = data.volume * 0.33 * adjusted_EVP_air_changes[m];
                } else {
                    effective_air_change_rate[m] = 0.5 + Math.pow(adjusted_infiltration[m], 2) * 0.5;
                    infiltration_WK[m] = data.volume * 0.33 * (0.5 + Math.pow(adjusted_infiltration[m], 2) * 0.5 + adjusted_infiltration[m] * adjusted_EVP_air_changes[m]);
                    ventilation_WK[m] = data.volume * 0.33 * Math.pow(adjusted_EVP_air_changes[m], 2) * 0.5;
                }
            }
            break;
    }

    var sum_infiltration = 0;
    var sum_ventilation = 0;
    var SAP_ventilation_WK = [];
    var HTC = [];
    for (var m = 0; m < 12; m++)
    {
        sum_infiltration += infiltration_WK[m];
        sum_ventilation += ventilation_WK[m];
        SAP_ventilation_WK[m] = infiltration_WK[m] + ventilation_WK[m];
        HTC[m] = data.fabric_total_heat_loss_WK + SAP_ventilation_WK[m];
    }

    data.ventilation.average_WK = (sum_infiltration + sum_ventilation) / 12.0;
    data.ventilation.average_infiltration_WK = sum_infiltration / 12.0;
    data.ventilation.average_ventilation_WK = sum_ventilation / 12.0;
    data.ventilation.effective_air_change_rate = effective_air_change_rate;
    data.ventilation.infiltration_WK = infiltration_WK;
    data.ventilation.ventilation_WK = ventilation_WK;
    data.losses_WK.ventilation = ventilation_WK;
    data.losses_WK.infiltration = infiltration_WK;
    data.ventilation.SAP_ventilation_WK = SAP_ventilation_WK;
    data.totalWK_monthly = HTC;
    return data;
};

/*---------------------------------------------------------------------------------------------
 // TEMPERATURE
 // 
 // Inputs from user: 
 //      - data.temperature.target
 //      - data.temperature.living_area
 //      
 // Inputs from other modules: 
 //      - data.TFA
 //      - data.TMP
 //      - data.losses_WK    
 //      - data.gains_W
 //      - data.altitude
 //      - data.region
 //	- data.heating_systems
 //	- data.temperature.hours_off
 //      
 // Global Outputs: 
 //      - data.internal_temperature
 //      - data.external_temperature
 //      - data.HLP
 //	- data.mean_internal_temperature.u_factor_living_area
 //      - data.mean_internal_temperature.m_i_t_living_area
 //      - data.mean_internal_temperature.t_heating_periods_rest_of_dwelling
 //      - data.mean_internal_temperature.u_factor_rest_of_dwelling
 //      - data.mean_internal_temperature.m_i_t_rest_of_dwelling
 //      - data.mean_internal_temperature.fLA
 //      - data.mean_internal_temperature.m_i_t_whole_dwelling
 //      - data.temperature.temperature_adjustment
 //	- data.mean_internal_temperature.m_i_t_whole_dwelling_adjusted
 //
 //
 // Module Variables:
 //	- data.temperature.responsiveness
 //
 // Datasets: 
 //      - datasets.table_u1
 // 
 // Uses external function: 
 //      - calc_utilisation_factor
 //	- calc_MeanInternalTemperature
 //	- calc_Th2
 //
 //---------------------------------------------------------------------------------------------*/
calc.temperature = function (data)
{
    if (data.temperature == undefined)
        data.temperature = {};
    if (data.temperature.living_area == undefined)
        data.temperature.living_area = data.TFA;
    if (data.temperature.target == undefined)
        data.temperature.target = 21;
    if (data.temperature.temperature_adjustment == undefined)
        data.temperature.temperature_adjustment = 0;
    if (data.temperature.hours_off == undefined)
        data.temperature.hours_off = {weekday: [7, 8], weekend: [8]};

    // Get Main heating systems
    var mainHSs = {}; // It will take the form of: mainHSs = {mainHS1: systemObject, mainHS2: systemObject}
    data.heating_systems.forEach(function (system) {
        if ((system.provides == 'heating' || system.provides == 'heating_and_water') && system.fraction_space > 0) {
            switch (system.main_space_heating_system) {
                case 'mainHS1':
                    mainHSs.mainHS1 = system;
                    break;
                case 'mainHS2_whole_house':
                    mainHSs.mainHS2 = system;
                    mainHSs.mainHS2.whole_house = true;
                    break;
                case 'mainHS2_part_of_the_house':
                    mainHSs.mainHS2 = system;
                    mainHSs.mainHS2.whole_house = false;
                    break;
            }
        }
    });

    // In case of two main heating systems, calculate their fraction of "main heating" (different than fraction of "space heating")
    if (mainHSs.mainHS1 != undefined && mainHSs.mainHS2 != undefined) {
        var fraction_MHS1 = mainHSs.mainHS1.fraction_space / (mainHSs.mainHS1.fraction_space + mainHSs.mainHS2.fraction_space)
        var fraction_MHS2 = mainHSs.mainHS2.fraction_space / (mainHSs.mainHS1.fraction_space + mainHSs.mainHS2.fraction_space)
    }

    // Calculate responsiveness - SAP21012, table 9b, p. 220
    data.temperature.responsiveness = 1; // In case no 1st Main heating system has been selected
    if (mainHSs.mainHS1 != undefined && mainHSs.mainHS2 == undefined)  // if there is only one main system
        data.temperature.responsiveness = mainHSs.mainHS1.responsiveness;
    else if (mainHSs.mainHS1 != undefined && mainHSs.mainHS2 != undefined) // if there are two
        data.temperature.responsiveness = fraction_MHS1 * mainHSs.mainHS1.responsiveness + fraction_MHS2 * mainHSs.mainHS2.responsiveness;

    // Ohter preprationn for the formula
    var R = data.temperature.responsiveness;
    var Th = data.temperature.target;
    var Th_monthly = [Th, Th, Th, Th, Th, Th, Th, Th, Th, Th, Th, Th];
    var TMP = data.TMP; // data.TMP;

    var fLA = data.temperature.living_area / data.TFA;
    if (isNaN(fLA))
        fLA = 0;

    var H = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var HLP = [];
    var G = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (m = 0; m < 12; m++)
    {
        for (z in data.losses_WK) {
            H[m] += data.losses_WK[z][m];
            HLP[m] = H[m] / data.TFA;
        }

        for (z in data.gains_W)
            G[m] += data.gains_W[z][m];
    }

    var Te = [];
    for (var m = 0; m < 12; m++)
    {
//Te[m] = datasets.table_u1[data.region][m] - (0.3 * data.altitude / 50);
        Te[m] = datasets.table_u1[data.region][m];
    }

//----------------------------------------------------------------------------------------------------------------
// 7. Mean internal temperature (heating season)
//----------------------------------------------------------------------------------------------------------------

// Bring calculation of (96)m forward as its used in section 7.
// Monthly average external temperature from Table U1
// for (var i=1; i<13; i++) data['96-'+i] = table_u1[i.region][i-1]-(0.3 * i.altitude / 50);

// See utilisationfactor.js for calculation
// Calculation is described on page 159 of SAP document
// Would be interesting to understand how utilisation factor equation
// can be derived

    var utilisation_factor_A = [];
    for (var m = 0; m < 12; m++)
    {
        utilisation_factor_A[m] = calc_utilisation_factor(TMP, HLP[m], H[m], Th, Te[m], G[m]);
    }

// Table 9c: Heating requirement

// Living area  
    var Ti_livingarea = calc_MeanInternalTemperature(Th_monthly, data.temperature.hours_off, TMP, HLP, H, Te, G, R);


// rest of dwelling - SAP2012, table 9, p.221
    var Th2 = [];
    var Ti_restdwelling = [];
    if (mainHSs.mainHS1 != undefined) {
        if (mainHSs.mainHS2 == undefined || mainHSs.mainHS2.whole_house == true) {
            Th2 = calc_Th2(mainHSs.mainHS1.heating_controls, Th, HLP);
            Ti_restdwelling = calc_MeanInternalTemperature(Th2, data.temperature.hours_off, TMP, HLP, H, Te, G, R);
        }
        if (mainHSs.mainHS2 != undefined && mainHSs.mainHS2.whole_house == false) { // The 2nd main heating system heats a different part of the house
            if (mainHSs.mainHS2.fraction_space > (1 - fLA)) {
                Th2 = calc_Th2(mainHSs.mainHS2.heating_controls, Th, HLP);
                Ti_restdwelling = calc_MeanInternalTemperature(Th2, data.temperature.hours_off, TMP, HLP, H, Te, G, R);
            }
            else {
                Th2 = calc_Th2(mainHSs.mainHS1.heating_controls, Th, HLP);
                var Ti_restdwelling_S1 = calc_MeanInternalTemperature(Th2, data.temperature.hours_off, TMP, HLP, H, Te, G, R);

                Th2 = calc_Th2(mainHSs.mainHS2.heating_controls, Th, HLP);
                var Ti_restdwelling_S2 = calc_MeanInternalTemperature(Th2, data.temperature.hours_off, TMP, HLP, H, Te, G, R);

                for (var m = 0; m < 12; m++) {
                    var T1 = Ti_restdwelling_S1[m] * (fraction_MHS1 - fLA) / (1 - fLA);
                    var T2 = Ti_restdwelling_S2[m] * (fraction_MHS1) / (1 - fLA)
                    Ti_restdwelling[m] = (T1 + T2) / 2;
                }
            }
        }
    }
    if (Ti_restdwelling.length == 0)
        Ti_restdwelling = Ti_livingarea;

    var utilisation_factor_B = [];
    for (var m = 0; m < 12; m++)
    {
        var Ti = Th2[m];
        var tmpHLP = HLP[m];
        if (tmpHLP > 6.0)
            tmpHLP = 6.0;
        // TMP,HLP,H,Ti,Te,G
        utilisation_factor_B[m] = calc_utilisation_factor(TMP, tmpHLP, H[m], Ti, Te[m], G[m]);
    }

    data.internal_temperature = [];
    for (var m = 0; m < 12; m++)
    {
        data.internal_temperature[m] = (fLA * Ti_livingarea[m]) + (1 - fLA) * Ti_restdwelling[m];
    }

    data.HLP = HLP;
    data.mean_internal_temperature.u_factor_living_area = utilisation_factor_A;
    data.mean_internal_temperature.m_i_t_living_area = Ti_livingarea;
    data.mean_internal_temperature.t_heating_periods_rest_of_dwelling = Th2;
    data.mean_internal_temperature.u_factor_rest_of_dwelling = utilisation_factor_B;
    data.mean_internal_temperature.m_i_t_rest_of_dwelling = Ti_restdwelling;
    data.mean_internal_temperature.fLA = fLA;
    data.mean_internal_temperature.m_i_t_whole_dwelling = JSON.parse(JSON.stringify(data.internal_temperature));
    data.external_temperature = Te;

    // Temperature adjustment
    if (mainHSs.mainHS1 != undefined && mainHSs.mainHS2 == undefined)  // if there is only one main system
        data.temperature.temperature_adjustment = mainHSs.mainHS1.temperature_adjustment;
    else if (mainHSs.mainHS1 != undefined && mainHSs.mainHS2 != undefined) { // if there are two
        if (mainHSs.mainHS2.whole_house == true)
            data.temperature.temperature_adjustment = mainHSs.mainHS1.temperature_adjustment;
        else
            data.temperature.temperature_adjustment = mainHSs.mainHS1.fraction_space * mainHSs.mainHS1.temperature_adjustment + mainHSs.mainHS2.fraction_space * mainHSs.mainHS2.temperature_adjustment
    }

    for (var m = 0; m < 12; m++)
    {
        data.internal_temperature[m] = data.internal_temperature[m] + data.temperature.temperature_adjustment;
    }
    data.mean_internal_temperature.m_i_t_whole_dwelling_adjusted = data.internal_temperature;
    return data;
};

/*---------------------------------------------------------------------------------------------
 // SPACE HEATING AND COOLING
 // Calculates space heating and cooling demand.
 // 
 // Inputs from user: 
 //      - data.space_heating.use_utilfactor_forgains
 //	- data.space_heating.heating_off_summer
 //      
 // Inputs from other modules: 
 //      - data.internal_temperature
 //	- data.external_temperature
 //	- data.losses_WK
 //	- data.gains_W
 //	- data.TFA
 //	- data.TMP
 //      
 // Global Outputs: 
 //	- data.annual_useful_gains_kWh_m2
 //	- data.annual_losses_kWh_m2 
 //	- data.space_heating_demand_m2
 //	- data.energy_requirements.space_heating
 //	- data.energy_requirements.space_cooling
 //
 // Module Variables:
 //	- data.space_heating.delta_T
 //	- data.space_heating.total_losses
 //	- data.space_heating.total_gains
 //	- data.space_heating.utilisation_factor
 //	- data.space_heating.useful_gains
 //	- data.space_heating.heat_demand
 //	- data.space_heating.cooling_demand
 //	- data.space_heating.heat_demand_kwh
 //	- data.space_heating.cooling_demand_kwh
 //	- data.space_heating.annual_heating_demand
 //	- data.space_heating.annual_cooling_demand
 //	- data.space_heating.annual_heating_demand_m2
 //	- data.space_heating.annual_cooling_demand_m2
 //
 // Datasets: 
 //      - datasets.table_1a
 // 
 // Uses external function: 
 //      - calc_utilisation_factor
 //      
 //------------------------------------------------------------------------------------------*/

calc.space_heating = function (data)
{
    if (data.space_heating == undefined)
        data.space_heating = {};
    if (data.space_heating.use_utilfactor_forgains == undefined)
        data.space_heating.use_utilfactor_forgains = true;
    if (data.space_heating.heating_off_summer == undefined)
        data.space_heating.heating_off_summer = true;
    // These might all need to be defined within the space_heating namespace to be accessible in the ui.
    var delta_T = [];
    var total_losses = [];
    var total_gains = [];
    var utilisation_factor = [];
    var useful_gains = [];
    var annual_useful_gains_kWh_m2 = {"Internal": 0, "Solar": 0}; //  Units: kwh/m2/year
    var annual_losses_kWh_m2 = {};
    var heat_demand = [];
    var cooling_demand = [];
    var heat_demand_kwh = [];
    var cooling_demand_kwh = [];
    var annual_heating_demand = 0;
    var annual_cooling_demand = 0;

    for (m = 0; m < 12; m++) {
// DeltaT (Difference between Internal and External temperature)
        delta_T[m] = data.internal_temperature[m] - data.external_temperature[m];
        // Monthly heat loss totals
        var H = 0; // heat transfer coefficient
        for (z in data.losses_WK)
            H += data.losses_WK[z][m];
        total_losses[m] = H * delta_T[m];
        if (data.space_heating.heating_off_summer == 1 && m >= 5 && m <= 8) // SAP2012, p.220
            total_losses[m] = 0;
        // Monthly heat gains total
        var G = 0;
        for (z in data.gains_W)
            G += data.gains_W[z][m];
        total_gains[m] = G;
        if (data.space_heating.heating_off_summer == 1 && m >= 5 && m <= 8) // SAP2012, p.220
            total_gains[m] = 0;
        // Calculate overall utilisation factor for gains
        var HLP = H / data.TFA;
        utilisation_factor[m] = calc_utilisation_factor(data.TMP, HLP, H, data.internal_temperature[m], data.external_temperature[m], total_gains[m]);
        // Apply utilisation factor if chosen:
        if (data.space_heating.use_utilfactor_forgains) {
            useful_gains[m] = total_gains[m] * utilisation_factor[m];
        } else {
            useful_gains[m] = total_gains[m];
        }

//      Space heating demand is simply the difference between the heat loss rate
//      for our target internal temperature and the gains.
        heat_demand[m] = total_losses[m] - useful_gains[m];
        cooling_demand[m] = 0;
        // Case of cooling:
        if (heat_demand[m] < 0) {
            cooling_demand[m] = useful_gains[m] - total_losses[m];
            heat_demand[m] = 0;
        }

        if (data.space_heating.heating_off_summer == 1 && m >= 5 && m <= 8) // SAP2012, p.220
            heat_demand[m] = 0;
        heat_demand_kwh[m] = 0.024 * heat_demand[m] * datasets.table_1a[m];
        cooling_demand_kwh[m] = 0.024 * cooling_demand[m] * datasets.table_1a[m];
        annual_heating_demand += heat_demand_kwh[m];
        annual_cooling_demand += cooling_demand_kwh[m];

        ///////////////////////////////////////////////////////
        //Annual useful gains and losses. Units: kwh/m2/year //
        ///////////////////////////////////////////////////////
        if (data.space_heating.heating_off_summer == 0 || (m < 5 || m > 8)) {
            var gains_source = "";
            for (z in data.gains_W) {
                if (z === "Appliances" || z === "Lighting" || z === "Cooking" || z === "waterheating" || z === 'fans_and_pumps' || z === 'metabolic' || z === 'losses')
                    gains_source = "Internal";
                if (z === "solar")
                    gains_source = "Solar";
                // Apply utilisation factor if chosen:
                if (data.space_heating.use_utilfactor_forgains) {
                    annual_useful_gains_kWh_m2[gains_source] += (utilisation_factor[m] * data.gains_W[z][m] * 0.024 * datasets.table_1a[m]) / data.TFA;
                } else {
                    annual_useful_gains_kWh_m2[gains_source] += data.gains_W[z][m] * 0.024 / data.TFA;
                }
            }
            // Annual losses. Units: kwh/m2/year
            for (z in data.losses_WK) {
                if (annual_losses_kWh_m2[z] == undefined)
                    annual_losses_kWh_m2[z] = 0;
                annual_losses_kWh_m2[z] += (data.losses_WK[z][m] * 0.024 * delta_T[m] * datasets.table_1a[m]) / data.TFA;
            }
        }
    }

    data.space_heating.delta_T = delta_T;
    data.space_heating.total_losses = total_losses;
    data.space_heating.total_gains = total_gains;
    data.space_heating.utilisation_factor = utilisation_factor;
    data.space_heating.useful_gains = useful_gains;
    data.annual_useful_gains_kWh_m2 = annual_useful_gains_kWh_m2;
    data.annual_losses_kWh_m2 = annual_losses_kWh_m2;
    data.space_heating.heat_demand = heat_demand;
    data.space_heating.cooling_demand = cooling_demand;
    data.space_heating.heat_demand_kwh = heat_demand_kwh;
    data.space_heating.cooling_demand_kwh = cooling_demand_kwh;
    data.space_heating.annual_heating_demand = annual_heating_demand;
    data.space_heating.annual_cooling_demand = annual_cooling_demand;
    data.space_heating.annual_heating_demand_m2 = annual_heating_demand / data.TFA;
    data.space_heating.annual_cooling_demand_m2 = annual_cooling_demand / data.TFA;
    if (annual_heating_demand > 0)
        data.energy_requirements.space_heating = {name: "Space Heating", quantity: annual_heating_demand, monthly: heat_demand_kwh};
    if (annual_cooling_demand > 0)
        data.energy_requirements.space_cooling = {name: "Space Cooling", quantity: annual_cooling_demand, monthly: cooling_demand_kwh};
    data.space_heating_demand_m2 = (annual_heating_demand + annual_cooling_demand) / data.TFA;
    return data;
};

/*---------------------------------------------------------------------------------------------
 // HEATING SYSTEMS
 //  
 // Calculates fuel requirements for water heating   */
//  and space heating                                */
//
// Inputs from user: 
//      - data.heating_systems
//      
// Inputs from other modules: 
//      - data.energy_requirements.waterheating
//	- data.energy_requirements.space_heating
//      
// Global Outputs: 
//	- data.fuel_requirements.waterheating
//	- data.fuel_requirements.space_heating
//
//---------------------------------------------------------------------------------------------*/

calc.heating_systems = function (data) {
    if (data.heating_systems == undefined)
        data.heating_systems = [];

    //////////////////////////////////////
    // Fuel requirements  Water Heating //
    //////////////////////////////////////
    var f_requirements = [];
    data.heating_systems.forEach(function (system) {
        if (system.provides == 'water' || system.provides == 'heating_and_water') {
            // Calculate system efficiency
            switch (system.provides) {
                case 'water':
                    system.efficiency = system.summer_efficiency / 100;
                    break;
                case 'heating_and_water':
                    var Q_water = system.fraction_water_heating * data.energy_requirements.waterheating.quantity;
                    if (data.energy_requirements.space_heating == undefined)
                        data.energy_requirements.space_heating = {quantity: 0};
                    var Q_space = system.fraction_space * data.energy_requirements.space_heating.quantity;
                    var n_winter = system.summer_efficiency / 100;
                    var n_summer = system.winter_efficiency / 100;
                    system.efficiency = (Q_water + Q_space) / ((Q_space / n_winter) + (Q_water / n_summer));
                    break;
            }

            // Sort them by 'fuel'
            if (f_requirements[system.fuel] == undefined)
                f_requirements[system.fuel] = {demand: 0, fraction: 0, fuel: system.fuel, fuel_input: 0};
            var demand = system.fraction_water_heating * data.energy_requirements.waterheating.quantity;
            f_requirements[system.fuel].demand += demand;
            f_requirements[system.fuel].fuel_input += demand / system.efficiency;
            f_requirements[system.fuel].fraction += system.fraction_water_heating;
        }
    });
    // Copy over to data.fuel_requirements and calculate total fuel input
    data.fuel_requirements.waterheating.quantity = 0;
    for (fuel in f_requirements) {
        data.fuel_requirements.waterheating.list.push(f_requirements[fuel]);
        data.fuel_requirements.waterheating.quantity += f_requirements[fuel].fuel_input;
    }

    //////////////////////////////////////
    // Fuel requirements  Space Heating //
    //////////////////////////////////////
    var f_requirements = [];
    data.heating_systems.forEach(function (system) {
        if (system.provides == 'heating' || system.provides == 'heating_and_water') {
            // Sort them by 'fuel'
            if (f_requirements[system.fuel] == undefined)
                f_requirements[system.fuel] = {demand: 0, fraction: 0, fuel: system.fuel, fuel_input: 0};
            var demand = system.fraction_space * data.energy_requirements.space_heating.quantity;
            f_requirements[system.fuel].demand += demand;
            f_requirements[system.fuel].fuel_input += demand / (system.winter_efficiency / 100);
            f_requirements[system.fuel].fraction += system.fraction_space;
        }
    });
    // Copy over to data.fuel_requirements and calculate total fuel input
    data.fuel_requirements.space_heating.quantity = 0;
    for (fuel in f_requirements) {
        data.fuel_requirements.space_heating.list.push(f_requirements[fuel]);
        data.fuel_requirements.space_heating.quantity += f_requirements[fuel].fuel_input;
    }

};

/*---------------------------------------------------------------------------------------------
 // FUEL REQUIREMENTS
 // Calculates the totals for each type of fuel (Mains Gas, Standard Tariff, etc) from 
 // the fuel requirements (appliances, cooking, space_heating, etc)
 //
 // Inputs from user: 
 //      -  data.use_generation
 //      
 // Inputs from other modules: 
 //      - data.fuel_requirements
 //	- data.fuels
 //	- data.generation
 //      
 // Global Outputs: 
 //	- data.fuel_totals
 //	- data.energy_use
 //	- data.annualco2
 //	- data.energy_delivered
 //	- data.total_cost
 //	- data.primary_energy_use
 //	- data.net_cost
 //
 //---------------------------------------------------------------------------------------------*/
calc.fuel_requirements = function (data) {

    // Fuel totals
    data.fuel_totals = {}; // remove this line when we get rif of energy_systems
    for (z in data.fuel_requirements)
    {
        for (x in data.fuel_requirements[z].list)
        {
            data.fuel_requirements[z].list[x].fuel_input_monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            var fuel = data.fuel_requirements[z].list[x].fuel;
            if (data.fuel_totals[fuel] == undefined)
                data.fuel_totals[fuel] = {name: fuel, quantity: 0};
            if (isNaN(data.fuel_requirements[z].list[x].fuel_input) != true)
                data.fuel_totals[fuel].quantity += data.fuel_requirements[z].list[x].fuel_input;
        }
    }

    // Total energy use, fuel costs, Annual CO2 and primary energy due to the energy requirements
    data.energy_use = 0;
    data.annualco2 = 0;
    data.energy_delivered = 0
    for (z in data.fuel_totals)
    {
        data.fuel_totals[z].annualcost = data.fuel_totals[z].quantity * data.fuels[z].fuelcost / 100 + data.fuels[z].standingcharge;
        //data.fuel_totals[z].fuelcost = data.fuels[z].fuelcost;
        data.fuel_totals[z].primaryenergy = data.fuel_totals[z].quantity * data.fuels[z].primaryenergyfactor;
        data.fuel_totals[z].annualco2 = data.fuel_totals[z].quantity * data.fuels[z].co2factor;
        data.total_cost += data.fuel_totals[z].annualcost;
        data.energy_use += data.fuel_totals[z].quantity;
        data.primary_energy_use += data.fuel_totals[z].primaryenergy;
        data.annualco2 += data.fuel_totals[z].annualco2;
    }
    data.energy_delivered = data.energy_use;
    // Annual CO2, primary energy and cost saved due to generation. Be aware generation is not used for the calculation of Energy use
    if (data.use_generation == 1) {
        data.fuel_totals['generation'] = {
            name: 'generation',
            quantity: -data.generation.total_generation,
            annualco2: -data.generation.total_CO2,
            primaryenergy: -data.generation.total_primaryenergy,
            annualcost: -data.generation.total_used_onsite * data.fuels.generation.fuelcost / 100
        };
        data.primary_energy_use += data.fuel_totals['generation'].primaryenergy;
        data.annualco2 += data.fuel_totals['generation'].annualco2;
        data.total_cost += data.fuel_totals['generation'].annualcost;
        data.energy_delivered += data.fuel_totals['generation'].quantity;
    }

    data.net_cost = data.use_generation == 1 ? data.total_cost - data.total_income : data.total_cost;
    return data;
};

/*---------------------------------------------------------------------------------------------
 // PRIMARY ENERGY USE BY REQUIREMENT
 // 
 // Inputs from other modules: 
 //      - data.fuel_requirements
 //      
 // Global Outputs: 
 //	- data.primary_energy_use_by_requirement
 //	
 //---------------------------------------------------------------------------------------------*/
calc.primary_energy_by_requirement = function (data) {
    for (var req in data.fuel_requirements) {
        data.primary_energy_use_by_requirement[req] = 0;
        for (z in data.fuel_requirements[req].list) {
            var fuel_input = data.fuel_requirements[req].list[z].fuel_input;
            var fuel = data.fuel_requirements[req].list[z].fuel;

            data.primary_energy_use_by_requirement[req] += fuel_input * data.fuels[fuel].primaryenergyfactor;
        }
    }
};


/*---------------------------------------------------------------------------------------------
 // SAP
 // Calculates SAP (energy cost) and EI (environmental impact) ratings. 
 // Beware SAP doesn't take into account the energy for appliances 
 // and cooking for the calculation of total cost and primary energy use. 
 // 
 // Inputs from other modules: 
 //      - data
 //      
 // Global Outputs: 
 //	- data.SAP
 //
 // Module Variables:
 //	- data.SAP.total_costSAP
 //	- data.SAP.annualco2SAP
 //	- data.SAP.kgco2perm2SAP
 //	- data.SAP.energy_cost_deflator
 //	- data.SAP.energy_cost_factor
 //	- data.SAP.primary_energy_useSAP
 //	- data.SAP.primary_energy_use_m2SAP
 //	- data.SAP.rating
 //	- data.SAP.EI_rating
 //	
 //--------------------------------------------------------------------------------------------*/

calc.SAP = function (data)
{
    // Calculate total energy cost in the SAP way: taking into account only fuel cost for space heating, water heating, lighting and fans and pumps
    var dataSAP = JSON.parse(JSON.stringify(data));
    dataSAP.total_cost = 0;
    dataSAP.primary_energy_use = 0;
    dataSAP.fuel_requirements.appliances = {quantity: {}, list: []};
    dataSAP.fuel_requirements.cooking = {quantity: {}, list: []};
    dataSAP = calc.fuel_requirements(dataSAP);
    // SAP
    data.SAP = {};
    data.SAP.total_costSAP = dataSAP.total_cost;
    data.SAP.annualco2SAP = dataSAP.annualco2;
    data.SAP.kgco2perm2SAP = dataSAP.annualco2 / data.TFA;
    data.SAP.energy_cost_deflator = 0.42;
    data.SAP.energy_cost_factor = (data.SAP.total_costSAP * data.SAP.energy_cost_deflator) / (data.TFA + 45.0);
    data.SAP.primary_energy_useSAP = dataSAP.primary_energy_use;
    data.SAP.primary_energy_use_m2SAP = dataSAP.primary_energy_use / data.TFA;
    if (data.SAP.energy_cost_factor >= 3.5) {
        data.SAP.rating = 117 - 121 * (Math.log(data.SAP.energy_cost_factor) / Math.LN10);
    } else {
        data.SAP.rating = 100 - 13.95 * data.SAP.energy_cost_factor;
    }
    var CF = data.SAP.annualco2SAP / (data.TFA + 45);
    if (CF >= 28.3)
        data.SAP.EI_rating = 200 - 95 * (Math.log(CF) / Math.LN10);
    else
        data.SAP.EI_rating = 100 - 1.34 * CF;
    return data;
};

/*---------------------------------------------------------------------------------------------
 // LAC_SAP
 // Calculates heat gains, energy requirements, CO2 emissions and fuel requirements due to lighting, 
 // appliances and cooking following SAP worksheets
 //  - Lighting: SAP2012 Anex L1
 //  - Appliances: SAP2012 Anex L2
 //  - Cooking: Anex L3 for heat gains and CO2. SAP2012 doesn't calculate energy requirements for cooking
 //      while OenBEM does it from the CO2 emssions applying a emissioon factor of 0.519 (assuming cooking is done with electricity.
 //
 // Inputs from user: 
 //      - data.LAC.L // The total number of fixed lighting outlets
 //	- data.LAC.LLE // The number of fixed low energy lighting outlets
 //	- data.LAC.reduced_heat_gains_lighting
 //	- data.LAC.energy_efficient_appliances
 //	- data.LAC.energy_efficient_cooking
 //      
 // Inputs from other modules: 
 //	- data.LAC_calculation_type // SAP || carboncoop_SAPlighting || detailedlist
 //      - data.GL
 //	- data.occupancy
 //      
 // Global Outputs: 
 //	- data.gains_W["Lighting"]
 //	- data.energy_requirements.lighting
 //	- data.fuel_requirements.lighting
 //	- data.TFA
 //	- data.gains_W["Appliances"]
 //	- data.energy_requirements.appliances
 //	- data.fuel_requirements.appliances
 //	- data.gains_W["Cooking"]
 //	- data.energy_requirements.cooking
 //	- data.fuel_requirements.cooking
 //
 // Module Variables:
 //	- data.LAC.EB 
 //	- data.LAC.C1
 //	- data.LAC.C2
 //	- data.LAC.EL  	// annual energy lighting
 //	- data.LAC.fuels_lighting
 //	- data.LAC.fuels_appliances
 //	- data.LAC.EA	// annual energy appliances
 //	- data.LAC.EC	// annual energy cooking
 //	- data.LAC.EC_monthly
 //	- data.LAC.GC	// gains cooking
 //
 // Datasets: 
 //      - datasets.table_1a
 //      	
 //---------------------------------------------------------------------------------------------*/
calc.LAC_SAP = function (data) {
    if (data.LAC == undefined)
        data.LAC = {};
    if (data.LAC.LLE == undefined)
        data.LAC.LLE = 1;
    if (data.LAC.L == undefined)
        data.LAC.L = 1;
    if (data.LAC.energy_efficient_cooking == undefined)
        data.LAC.energy_efficient_cooking = false;
    if (data.LAC.energy_efficient_appliances == undefined)
        data.LAC.energy_efficient_appliances = false;
    if (data.LAC.reduced_heat_gains_lighting == undefined)
        data.LAC.reduced_heat_gains_lighting = false;
    if (data.LAC.fuels_lighting == undefined)
        data.LAC.fuels_lighting = [{fuel: 'Standard Tariff', fraction: 1}];
    if (data.LAC.fuels_cooking == undefined)
        data.LAC.fuels_cooking = [{fuel: 'Standard Tariff', fraction: 1}];
    if (data.LAC.fuels_appliances == undefined)
        data.LAC.fuels_appliances = [{fuel: 'Standard Tariff', fraction: 1}];
    /*  LIGHTING     */
    // average annual energy consumption for lighting if no low-energy lighting is used is:
    data.LAC.EB = 59.73 * Math.pow((data.TFA * data.occupancy), 0.4714);
    if (data.LAC.L != 0)
    {
        data.LAC.C1 = 1 - (0.50 * data.LAC.LLE / data.LAC.L);
        data.LAC.C2 = 0;
        if (data.GL <= 0.095) {
            data.LAC.C2 = 52.2 * Math.pow(data.GL, 2) - 9.94 * data.GL + 1.433;
        } else {
            data.LAC.C2 = 0.96;
        }

        data.LAC.EL = data.LAC.EB * data.LAC.C1 * data.LAC.C2;
        var EL_monthly = [];
        var GL_monthly = [];
        var EL_sum = 0;
        for (var m = 0; m < 12; m++) {
            EL_monthly[m] = data.LAC.EL * (1.0 + (0.5 * Math.cos((2 * Math.PI * ((m + 1) - 0.2)) / 12.0))) * datasets.table_1a[m] / 365.0;
            EL_sum += EL_monthly[m];
            GL_monthly[m] = EL_monthly[m] * 0.85 * 1000 / (24 * datasets.table_1a[m]);
            if (data.LAC.reduced_heat_gains_lighting)
                GL_monthly[m] = 0.4 * GL_monthly[m];
        }

        if (EL_sum > 0 && (data.LAC_calculation_type == 'SAP' || data.LAC_calculation_type == 'carboncoop_SAPlighting')) {
            data.gains_W["Lighting"] = GL_monthly;
            data.energy_requirements.lighting = {name: "Lighting", quantity: EL_sum, monthly: EL_monthly};
            var total_fuel_input = 0;
            data.LAC.fuels_lighting.forEach(function (fuel_item) {
                fuel_item.system_efficiency = 1;
                fuel_item.demand = data.energy_requirements.lighting.quantity * fuel_item.fraction;
                fuel_item.fuel_input = data.energy_requirements.lighting.quantity * fuel_item.fraction / fuel_item.system_efficiency;
                total_fuel_input += fuel_item.fuel_input;
            });
            data.fuel_requirements.lighting.list = data.LAC.fuels_lighting;
            data.fuel_requirements.lighting.quantity = total_fuel_input;
        }

        /*   if (data.fuel_requirements.lighting == undefined) {
         data.fuel_requirements.lighting = [];
         data.fuel_requirements.lighting[0] = {fuel: 'Standard Tariff', fraction: 1, fuel_input: 0, sytem_efficiency: 1};
         }*/
    }

    /*  Electrical appliances   */

    // The initial value of the annual energy use in kWh for electrical appliances is
    var EA_initial = 207.8 * Math.pow((data.TFA * data.occupancy), 0.4714);
    var EA_monthly = [];
    var GA_monthly = [];
    var EA = 0; // Re-calculated the annual total as the sum of the monthly values
    for (var m = 0; m < 12; m++)
    {
        // The appliances energy use in kWh in month m (January = 1 to December = 12) is
        EA_monthly[m] = EA_initial * (1.0 + (0.157 * Math.cos((2 * Math.PI * ((m + 1) - 1.78)) / 12.0))) * datasets.table_1a[m] / 365.0;
        GA_monthly[m] = EA_monthly[m] * 1000 / (24 * datasets.table_1a[m]);
        if (data.LAC.energy_efficient_appliances) {
            GA_monthly[m] = 0.67 * GA_monthly[m];
            EA += 0.9 * EA_monthly[m];
        }
        else
            EA += EA_monthly[m];
    }

    // The annual CO2 emissions in kg/m2/year associated with electrical appliances is
    var appliances_CO2 = (EA * 0.522) / data.TFA;
    if (EA > 0 && data.LAC_calculation_type == 'SAP') {
        data.gains_W["Appliances"] = GA_monthly;
        data.energy_requirements.appliances = {name: "Appliances", quantity: EA, monthly: EA_monthly};
        var total_fuel_input = 0;
        data.LAC.fuels_appliances.forEach(function (fuel_item) {
            fuel_item.system_efficiency = 1;
            fuel_item.demand = data.energy_requirements.appliances.quantity * fuel_item.fraction;
            fuel_item.fuel_input = data.energy_requirements.appliances.quantity * fuel_item.fraction / fuel_item.system_efficiency;
            total_fuel_input += fuel_item.fuel_input;
        });
        data.fuel_requirements.appliances.list = data.LAC.fuels_appliances;
        data.fuel_requirements.appliances.quantity = total_fuel_input;
    }

    data.LAC.EA = EA;
    /*     
     Cooking     
     */

    // Internal heat gains in watts from cooking
    var GC = 35 + 7 * data.occupancy;
    // When lower internal heat gains are assumed for the calculation
    if (data.LAC.energy_efficient_cooking)
        GC = 23 + 5 * data.occupancy;
    var GC_monthly = [];
    for (var m = 0; m < 12; m++)
        GC_monthly[m] = GC;
    // CO2 emissions in kg/m2/year associated with cooking
    var cooking_CO2 = (119 + 24 * data.occupancy) / data.TFA;
    if (data.fuels['Standard Tariff'] !== undefined)
        data.LAC.EC = cooking_CO2 * data.TFA / data.fuels['Standard Tariff'].co2factor; // We stimate the clculation of annual energy use from the emissions
    else
        data.LAC.EC = cooking_CO2 * data.TFA / 0.519; // We stimate the clculation of annual energy use from the emissions
    for (m = 0; m < 12; m++)
        data.LAC.EC_monthly = data.LAC.EC / 12;
    if (GC > 0 && data.LAC_calculation_type == 'SAP') {
        data.gains_W["Cooking"] = GC_monthly;
        data.energy_requirements.cooking = {name: "Cooking", quantity: data.LAC.EC, monthly: data.LAC.EC_monthly};
        var total_fuel_input = 0;
        data.LAC.fuels_cooking.forEach(function (fuel_item) {
            fuel_item.system_efficiency = 1;
            fuel_item.demand = data.energy_requirements.cooking.quantity * fuel_item.fraction;
            fuel_item.fuel_input = data.energy_requirements.cooking.quantity * fuel_item.fraction / fuel_item.system_efficiency;
            total_fuel_input += fuel_item.fuel_input;
        });
        data.fuel_requirements.cooking.list = data.LAC.fuels_cooking;
        data.fuel_requirements.cooking.quantity = total_fuel_input;
    }

    data.LAC.GC = data.LAC.EC;
    return data;
};

/*---------------------------------------------------------------------------------------------
 // SHW  -   Solar Hot Water
 // Calculates annual solar input Q (kWh) from a specific SHW system
 //
 // Inputs from user: 
 //      - data.SHW.a1	// Collector linear heat loss coefficient, a1, from test certificate
 //	- data.SHW.a2	// Collector 2nd order heat loss coefficient, a2, from test certificate
 //	- data.SHW.n0	// Zero-loss collector efficiency, η0, from test certificate or Table H1
 //	- data.SHW.orientation
 //	- data.SHW.inclination
 //	- data.SHW.A	// Aperture area of solar collector, m2
 //	- data.SHW.combined_cylinder_volume	// In litres
 //	- data.SHW.Vs	//Dedicated solar storage volume, Vs, (litres)
 //	- data.SHW.volume_ratio	// Volume ratio Veff/Vd,average
 //      
 // Inputs from other modules: 
 //	- data.region
 //	- data.water_heating.annual_energy_content
 //	- data.water_heating.Vd_average
 //      
 // Global Outputs: 
 //	- data.SHW.Qs
 //	- data.SHW.Qs_monthly
 //
 // Module Variables:
 //	- data.SHW.a
 //	- data.SHW.collector_performance_ratio
 //	- data.SHW.annual_solar
 //	- data.SHW.solar_energy_available
 //	- data.SHW.solar_load_ratio
 //	- data.SHW.utilisation_factor
 //	- data.SHW.collector_performance_factor
 //	- data.SHW.Veff
 //	- data.SHW.f2
 //
 // Datasets: 
 //      - datasets.table_1a
 // 
 // Uses external function: 
 //      - annual_solar_rad
 //	- solar_rad
 //      	
 //--------------------------------------------------------------------------------------------*/
calc.SHW = function (data) {
    if (data.SHW == undefined)
        data.SHW = {};
    /*
     if (data.SHW.A==undefined) data.SHW.A = 1.25;
     if (data.SHW.n0==undefined) data.SHW.n0 = 0.599;
     if (data.SHW.a1==undefined) data.SHW.a1 = 2.772;
     if (data.SHW.a2==undefined) data.SHW.a2 = 0.009;
     if (data.SHW.inclination==undefined) data.SHW.inclination = 35;
     if (data.SHW.orientation==undefined) data.SHW.orientation = 4;
     if (data.SHW.overshading==undefined) data.SHW.overshading = 1.0;
     */
    data.SHW.Qs = 0;
    data.SHW.a = 0.892 * (data.SHW.a1 + 45 * data.SHW.a2);
    data.SHW.collector_performance_ratio = data.SHW.a / data.SHW.n0;
    data.SHW.annual_solar = annual_solar_rad(data.region, data.SHW.orientation, data.SHW.inclination);
    data.SHW.solar_energy_available = data.SHW.A * data.SHW.n0 * data.SHW.annual_solar * data.SHW.overshading;
    data.SHW.solar_load_ratio = data.SHW.solar_energy_available / data.water_heating.annual_energy_content;
    data.SHW.utilisation_factor = 0;
    if (data.SHW.solar_load_ratio > 0)
        data.SHW.utilisation_factor = 1 - Math.exp(-1 / (data.SHW.solar_load_ratio));
    data.SHW.collector_performance_factor = 0;
    if (data.SHW.collector_performance_ratio < 20) {
        data.SHW.collector_performance_factor = 0.97 - 0.0367 * data.SHW.collector_performance_ratio + 0.0006 * Math.pow(data.SHW.collector_performance_ratio, 2);
    } else {
        data.SHW.collector_performance_factor = 0.693 - 0.0108 * data.SHW.collector_performance_ratio;
    }
    if (data.SHW.collector_performance_factor < 0)
        data.SHW.collector_performance_factor = 0;
    data.SHW.Veff = 0;
    if (data.SHW.combined_cylinder_volume > 0) {
        data.SHW.Veff = data.SHW.Vs + 0.3 * (data.SHW.combined_cylinder_volume - data.SHW.Vs);
    } else {
        data.SHW.Veff = data.SHW.Vs;
    }

    data.SHW.volume_ratio = data.SHW.Veff / data.water_heating.Vd_average;
    data.SHW.f2 = 1 + 0.2 * Math.log(data.SHW.volume_ratio);
    if (data.SHW.f2 > 1)
        data.SHW.f2 = 1;
    data.SHW.Qs = data.SHW.solar_energy_available * data.SHW.utilisation_factor * data.SHW.collector_performance_factor * data.SHW.f2;
    if (isNaN(data.SHW.Qs) === true)
        data.SHW.Qs = 0;
    // The solar input (in kWh) for month m is

    var sum = 0;
    for (var m = 0; m < 12; m++)
        sum += solar_rad(data.region, data.SHW.orientation, data.SHW.inclination, m);
    var annualAverageSolarIrradiance = sum / 12;
    data.SHW.Qs_monthly = [];
    for (m = 0; m < 12; m++)
    {
        var fm = solar_rad(data.region, data.SHW.orientation, data.SHW.inclination, m) / annualAverageSolarIrradiance;
        data.SHW.Qs_monthly[m] = -data.SHW.Qs * fm * datasets.table_1a[m] / 365;
        if (isNaN(data.SHW.Qs_monthly[m]) === true)
            data.SHW.Qs_monthly[m] = 0;
    }

    return data;
};

/*---------------------------------------------------------------------------------------------
 // water_heating
 // Calculates:
 //   - Gains from: primary circuit loses, storage loses, combi loses and distribution loses
 //   - Energy requirements
 //
 // Inputs from user: 
 //      - data.water_heating.override_annual_energy_content
 //	- data.water_heating.annual_energy_content
 //	- data.water_heating.low_water_use_design
 //	- data.water_heating.hot_water_control_type
 //	- data.water_heating.pipework_insulation
 //	- data.water_heating.storage_type
 //	- data.water_heating.contains_dedicated_solar_storage_or_WWHRSs
 //	- data.water_heating.solar_water_heating
 //	- data.water_heating.hot_water_store_in_dwelling 
 //	- data.water_heating.community_heating
 //      
 // Inputs from other modules: 
 //	- data.heating_systems 
 //	- data.SHW.Qs_monthly
 //      
 // Global Outputs: 
 //	- data.gains_W["waterheating"]
 //      - data.energy_requirements.waterheating
 //
 // Module Variables:
 //	- data.water_heating.Vd_average	
 //	- data.water_heating.override_annual_energy_content 	// Calculated by the module when override_annual_energy_content is set to false
 //	- data.water_heating.pipework_insulated_fraction
 //	- data.water_heating.monthly_energy_content
 //	- data.water_heating.distribution_loss
 //	- data.water_heating.energy_lost_from_water_storage
 //	- data.water_heating.monthly_storage_loss
 //	- data.water_heating.primary_circuit_loss
 //	- data.water_heating.combi_loss
 //	- data.water_heating.total_heat_required
 //	- data.water_heating.hot_water_heater_output
 //	- data.water_heating.annual_waterheating_demand
 //	- data.water_heating.heat_gains_from_water_heating    
 //
 // Datasets: 
 //      - datasets.table_1c
 //	- datasets.table_1a
 //      	
 //---------------------------------------------------------------------------------------------*/
calc.water_heating = function (data) {
    if (data.water_heating == undefined)
        data.water_heating = {};
    if (data.water_heating.combi_loss == undefined)
        data.water_heating.combi_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (data.water_heating.solar_water_heating == undefined)
        data.water_heating.solar_water_heating = false;
    if (data.water_heating.hot_water_control_type == undefined)
        data.water_heating.hot_water_control_type = 'no_cylinder_thermostat';
    if (data.water_heating.pipework_insulation == undefined)
        data.water_heating.pipework_insulation = 'Fully insulated primary pipework';
    if (data.water_heating.Vc == undefined)
        data.water_heating.Vc = 0;
    if (data.water_heating.water_usage == undefined)
        data.water_heating.water_usage = [];
    if (data.water_heating.contains_dedicated_solar_storage_or_WWHRS == undefined)
        data.water_heating.contains_dedicated_solar_storage_or_WWHRS = 0;
    data.water_heating.Vd_average = (25 * data.occupancy) + 36;
    if (data.water_heating.low_water_use_design)
        data.water_heating.Vd_average *= 0.95;
    if (data.heating_systems == undefined)
        data.heating_systems = [];
    var Vd_m = [];
    var monthly_energy_content = [];
    var total_distribution_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var energy_lost_from_water_storage = 0;
    var total_primary_circuit_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var total_combi_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var total_heat_required = [];
    var hot_water_heater_output = [];
    var heat_gains_from_water_heating = [];

    //////////////////////
    //  Energy content  //
    //////////////////////
    if (data.water_heating.override_annual_energy_content == 1) {
        // We don't need to calculate data.water_heating.annual_energy_content as it has been inputed in waterheating.html
        for (var m = 0; m < 12; m++)
            monthly_energy_content[m] = datasets.table_1c[m] * data.water_heating.annual_energy_content / 12;
    }
    else {
        data.water_heating.annual_energy_content = 0;
        for (var m = 0; m < 12; m++) {
            Vd_m[m] = datasets.table_1c[m] * data.water_heating.Vd_average;
            monthly_energy_content[m] = (4.180 * Vd_m[m] * datasets.table_1a[m] * datasets.table_1d[m]) / 3600;
            data.water_heating.annual_energy_content += monthly_energy_content[m];
        }
    }

    //////////////////////////////////////
    // Total heat required              //
    // ///////////////////////////////////
    total_heat_required = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Total heat required due to water heating systems: Calculate losses for distribution, primary circuit and combi for every heating system if not instantaneous heating at point of use
    total_distribution_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    total_primary_circuit_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    total_combi_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    data.heating_systems.forEach(function (system) {
        if ((system.provides == 'water' || system.provides == "heating_and_water") && system.fraction_water_heating > 0) {
            if (system.instantaneous_water_heating) {
                for (var m = 0; m < 12; m++)
                    total_heat_required[m] += 0.85 * system.fraction_water_heating * monthly_energy_content[m];
            }
            else {
                var distribution_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var primary_circuit_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var combi_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                for (var m = 0; m < 12; m++) {
                    // DISTRIBUTION LOSSES
                    distribution_loss[m] = 0.15 * system.fraction_water_heating * monthly_energy_content[m];

                    // PRIMARY CIRCUIT LOSSES - SAP2012, table 3, p.199
                    if (system.primary_circuit_loss == 'Yes') {
                        var hours_per_day = 0;
                        if (m >= 5 && m <= 8) {
                            hours_per_day = 3;
                        } else {
                            if (data.water_heating.hot_water_control_type == "no_cylinder_thermostat")
                                hours_per_day = 11;
                            if (data.water_heating.hot_water_control_type == "Cylinder thermostat, water heating not separately timed")
                                hours_per_day = 5;
                            if (data.water_heating.hot_water_control_type == "Cylinder thermostat, water heating separately timed")
                                hours_per_day = 3;
                            /*if (data.water_heating.community_heating)
                             hours_per_day = 3;*/
                        }

                        if (data.water_heating.pipework_insulation == 'Uninsulated primary pipework')
                            data.water_heating.pipework_insulated_fraction = 0;
                        if (data.water_heating.pipework_insulation == 'First 1m from cylinder insulated')
                            data.water_heating.pipework_insulated_fraction = 0.1;
                        if (data.water_heating.pipework_insulation == 'All accesible piperwok insulated')
                            data.water_heating.pipework_insulated_fraction = 0.3;
                        if (data.water_heating.pipework_insulation == 'Fully insulated primary pipework')
                            data.water_heating.pipework_insulated_fraction = 1.0;

                        /*if (data.water_heating.community_heating)
                         data.water_heating.pipework_insulated_fraction = 1.0;*/

                        primary_circuit_loss[m] = datasets.table_1a[m] * 14 * ((0.0091 * data.water_heating.pipework_insulated_fraction + 0.0245 * (1 - data.water_heating.pipework_insulated_fraction)) * hours_per_day + 0.0263);

                        if (data.water_heating.solar_water_heating)
                            primary_circuit_loss[m] *= datasets.table_h4[m];
                    }

                    // COMBI LOSS-  for each month from Table 3a, 3b or 3c (enter “0” if not a combi boiler)
                    if (system.combi_loss != "0") {
                        if (Vd_m[m] < 100)
                            var fu = Vd_m[m] / 100;
                        else
                            var fu = 1;
                        switch (system.combi_loss)
                        {
                            case 'Instantaneous, without keep hot-facility':
                                combi_loss[m] = 600 * fu * datasets.table_1a[m] / 365;
                                break;
                            case 'Instantaneous, with keep-hot facility controlled by time clock':
                                combi_loss[m] = 600 * datasets.table_1a[m] / 365;
                                break;
                            case 'Instantaneous, with keep-hot facility not controlled by time clock':
                                combi_loss[m] = 900 * datasets.table_1a[m] / 365;
                                break;
                            case 'Storage combi boiler >= 55 litres':
                                combi_loss[m] = 0;
                                break;
                            case 'Storage combi boiler < 55 litres':
                                combi_loss[m] = (600 - (data.water_heating.Vc - 15) * 15) * fu * datasets.table_1a[m] / 365;
                                break;
                        }
                    }

                    // Total heat required due to water heating system losses
                    total_heat_required[m] += 0.85 * system.fraction_water_heating * monthly_energy_content[m] + distribution_loss[m] + primary_circuit_loss[m] + combi_loss[m];
                    total_distribution_loss[m] += distribution_loss[m];
                    total_primary_circuit_loss[m] += primary_circuit_loss[m];
                    total_combi_loss[m] += combi_loss[m];
                }
                //----------------------------------------------------------------------------------------
            }
        }
    });

    // Storage losses are calculated if there is a Storage added
    var monthly_storage_loss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (data.water_heating.storage_type != undefined) {
        //Daily loss
        if (data.water_heating.storage_type.declared_loss_factor_known) {
            energy_lost_from_water_storage = data.water_heating.storage_type.manufacturer_loss_factor * data.water_heating.storage_type.temperature_factor_a;
        } else {
            energy_lost_from_water_storage = data.water_heating.storage_type.storage_volume * data.water_heating.storage_type.loss_factor_b * data.water_heating.storage_type.volume_factor_b * data.water_heating.storage_type.temperature_factor_b;
        }
        // Monthly 
        for (m = 0; m < 12; m++) {
            monthly_storage_loss[m] = datasets.table_1a[m] * energy_lost_from_water_storage;
            if (data.water_heating.contains_dedicated_solar_storage_or_WWHRS > 0 && data.water_heating.storage_type.storage_volume > 0) {
                monthly_storage_loss[m] = monthly_storage_loss[m] * ((1.0 * data.water_heating.storage_type.storage_volume - data.water_heating.contains_dedicated_solar_storage_or_WWHRS) / (data.water_heating.storage_type.storage_volume));
            }
        }
        // Add the loss to the total_heat_required
        for (m = 0; m < 12; m++)
            total_heat_required[m] += monthly_storage_loss[m];
    }

    data.water_heating.monthly_energy_content = monthly_energy_content;
    data.water_heating.distribution_loss = total_distribution_loss;
    data.water_heating.energy_lost_from_water_storage = energy_lost_from_water_storage;
    data.water_heating.monthly_storage_loss = monthly_storage_loss;
    data.water_heating.primary_circuit_loss = total_primary_circuit_loss;
    data.water_heating.combi_loss = total_combi_loss;
    data.water_heating.total_heat_required = total_heat_required;

    //////////////////////////////////////
    // WH energy requirements and gains //
    //////////////////////////////////////
    var waterheating_gains = [];
    var annual_waterheating_demand = 0;
    for (var m = 0; m < 12; m++) {

        if (data.water_heating.solar_water_heating && data.SHW != undefined && data.SHW.Qs_monthly != undefined) {
            hot_water_heater_output[m] = total_heat_required[m] + data.SHW.Qs_monthly[m]; // Beware that data.SHW.Qs_monthly[m] is negative, that makes sense!!!
        } else {
            hot_water_heater_output[m] = total_heat_required[m];
        }

        if (hot_water_heater_output[m] < 0)
            hot_water_heater_output[m] = 0;
        annual_waterheating_demand += hot_water_heater_output[m];
        if (data.water_heating.hot_water_store_in_dwelling || data.water_heating.community_heating) {
            heat_gains_from_water_heating[m] = 0.25 * (0.85 * monthly_energy_content[m] + data.water_heating.combi_loss[m]) + 0.8 * (data.water_heating.distribution_loss[m] + data.water_heating.monthly_storage_loss[m] + data.water_heating.primary_circuit_loss[m]);
        } else {
            heat_gains_from_water_heating[m] = 0.25 * (0.85 * monthly_energy_content[m] + data.water_heating.combi_loss[m]) + 0.8 * (data.water_heating.distribution_loss[m] + data.water_heating.primary_circuit_loss[m]);
        }

        // Table 5 typical gains
        waterheating_gains[m] = (1000 * heat_gains_from_water_heating[m]) / (datasets.table_1a[m] * 24);
    }

    data.water_heating.hot_water_heater_output = hot_water_heater_output;
    data.water_heating.annual_waterheating_demand = annual_waterheating_demand;
    data.water_heating.heat_gains_from_water_heating = heat_gains_from_water_heating;
    data.gains_W["waterheating"] = waterheating_gains;
    if (annual_waterheating_demand > 0)
        data.energy_requirements.waterheating = {name: "Water Heating", quantity: annual_waterheating_demand, monthly: hot_water_heater_output};

    return data;
};


/*---------------------------------------------------------------------------------------------
 // applianceCarbonCoop 
 // Alternative method to calculate heat gains, energy requirements, CO2 emissions and fuel requirements for appliances
 // 
 // Inputs from user: 
 //      - data.applianceCarbonCoop.list
 //      
 // Inputs from other modules: 
 //	- data.LAC_calculation_type
 //      
 // Global Outputs: 
 //	- data.energy_requirements.appliances
 //	- data.energy_requirements.cooking
 //	- data.fuel_requirements.appliances
 //	- data.fuel_requirements.cooking
 //
 // Module Variables:
 //	- data.applianceCarbonCoop.energy_demand_total
 //	- data.applianceCarbonCoop.energy_demand_monthly 	 // shows total for category (cooking and appliances) and both totgether
 //	- data.applianceCarbonCoop.energy_demand_by_type_of_fuel
 //	- data.applianceCarbonCoop.gains_W
 //	- data.applianceCarbonCoop.gains_W_monthly	 // shows total for category (cooking and appliances) and both totgether
 //	- data.applianceCarbonCoop.fuel_input_total
 //	- data.applianceCarbonCoop.list 	// items updated with the energy demand and fuel input values 
 //
 //---------------------------------------------------------------------------------------------*/


calc.applianceCarbonCoop = function (data) {
    if (data.applianceCarbonCoop == undefined)
        data.applianceCarbonCoop = {list: []};
    // Variables in the data object that hold the results
    data.applianceCarbonCoop.energy_demand_total = {appliances: 0, cooking: 0, total: 0};
    data.applianceCarbonCoop.energy_demand_monthly = {appliances: [], cooking: [], total: []};
    data.applianceCarbonCoop.energy_demand_by_type_of_fuel = {cooking: {}, appliances: {}, total: {}};
    data.applianceCarbonCoop.gains_W = [];
    data.applianceCarbonCoop.gains_W_monthly = {};
    data.applianceCarbonCoop.fuel_input_total = {appliances: 0, cooking: 0};
    // 1. Energy demand and fuel_input
    // We do the calculations for each appliance in the list
    for (z in data.applianceCarbonCoop.list) {
        var item = data.applianceCarbonCoop.list[z];
        if (item.energy_demand == undefined)
            item.energy_demand = 0;
        // Energy demand calculation
        item.energy_demand = item.number_used * item.norm_demand * item.utilisation_factor * item.reference_quantity * item.frequency;
        if (item.type_of_fuel == "Electricity" && item.a_plus_rated === 1)
            item.energy_demand = 0.75 * item.energy_demand;
        item.fuel_input = item.energy_demand / item.efficiency;
        // Results: totals from all the appliances
        data.applianceCarbonCoop.energy_demand_total.total += item.energy_demand;
        if (data.applianceCarbonCoop.energy_demand_by_type_of_fuel[item.type_of_fuel] == undefined)
            data.applianceCarbonCoop.energy_demand_by_type_of_fuel[item.type_of_fuel] = 0;
        data.applianceCarbonCoop.energy_demand_by_type_of_fuel[item.type_of_fuel] += item.energy_demand;
        // Results: totals by category
        if (item.category === "Cooking")
            data.applianceCarbonCoop.energy_demand_total.cooking += item.energy_demand;
        else
            data.applianceCarbonCoop.energy_demand_total.appliances += item.energy_demand;
    }

    // 2. Energy demand monthly
    for (m = 0; m < 12; m++) {
        data.applianceCarbonCoop.energy_demand_monthly.appliances[m] = data.applianceCarbonCoop.energy_demand_total.appliances / 12;
        data.applianceCarbonCoop.energy_demand_monthly.cooking[m] = data.applianceCarbonCoop.energy_demand_total.cooking / 12;
        data.applianceCarbonCoop.energy_demand_monthly.total[m] = data.applianceCarbonCoop.energy_demand_total.appliances / 12 + data.applianceCarbonCoop.energy_demand_total.cooking / 12;
    }

    // 3. Gains
    data.applianceCarbonCoop.gains_W['Appliances'] = data.applianceCarbonCoop.energy_demand_total.appliances;
    data.applianceCarbonCoop.gains_W['Cooking'] = data.applianceCarbonCoop.energy_demand_total.cooking;
    data.applianceCarbonCoop.gains_W_monthly['Appliances'] = [];
    data.applianceCarbonCoop.gains_W_monthly['Cooking'] = [];
    for (var m = 0; m < 12; m++) {
        data.applianceCarbonCoop.gains_W_monthly['Appliances'][m] = data.applianceCarbonCoop.gains_W['Appliances'] * datasets.table_1a[m] / 365.0;
        data.applianceCarbonCoop.gains_W_monthly['Cooking'][m] = data.applianceCarbonCoop.gains_W['Cooking'] * datasets.table_1a[m] / 365.0;
    }

    // 4. Energy requirements
    if (data.LAC_calculation_type == 'carboncoop_SAPlighting') {
        if (data.applianceCarbonCoop.energy_demand_total.appliances > 0) {
            data.energy_requirements.appliances = {
                name: "Appliances",
                quantity: data.applianceCarbonCoop.energy_demand_total.appliances,
                monthly: data.applianceCarbonCoop.energy_demand_monthly.appliances
            };
            data.gains_W["Appliances"] = data.applianceCarbonCoop.gains_W_monthly['Appliances'];
        }

        if (data.applianceCarbonCoop.energy_demand_total.cooking > 0) {
            data.energy_requirements.cooking = {
                name: "Cooking",
                quantity: data.applianceCarbonCoop.energy_demand_total.cooking,
                monthly: data.applianceCarbonCoop.energy_demand_monthly.cooking
            };
            data.gains_W["Cooking"] = data.applianceCarbonCoop.gains_W_monthly['Cooking'];
        }
    }

    // 5. Fuel requirements
    // Add fuels

    var f_requirements = {cooking: {}, appliances: {}};
    if (data.LAC_calculation_type == 'carboncoop_SAPlighting') {
        // Sor them by 'cooking' or 'appliances' and 'fuel'
        data.applianceCarbonCoop.list.forEach(function (item) {
            var category = item.category == 'Cooking' ? 'cooking' : 'appliances';
            if (f_requirements[category][item.fuel] == undefined)
                f_requirements[category][item.fuel] = {demand: 0, fraction: 0, fuel: item.fuel, system_efficiency: item.efficiency, fuel_input: 0};
            f_requirements[category][item.fuel].demand += item.energy_demand;
            f_requirements[category][item.fuel].fuel_input += item.fuel_input;
            data.applianceCarbonCoop.fuel_input_total[category] += item.fuel_input;
        });

        // Add fractions
        for (category in ({appliances: {}, cooking: {}})) {
            for (var fuel in f_requirements[category]) {
                f_requirements[category][fuel].fraction = f_requirements[category][fuel].demand / data.applianceCarbonCoop.fuel_input_total[category];
            }
        }
        // Copy over to data.fuel_requirements
        for (var category in f_requirements) {
            data.fuel_requirements[category].quantity = data.applianceCarbonCoop.fuel_input_total[category];
            for (fuel in f_requirements[category]) {
                data.fuel_requirements[category].list.push(f_requirements[category][fuel]);
            }
        }
    }
};


/*---------------------------------------------------------------------------------------------
 // appliancelist  -   
 // Alternative method to calculate heat gains, energy requirements, CO2 emissions and fuel requirements for LAC
 //
 // Inputs from user: 
 //      - data.appliancelist.list: [{name: "LED Light", power: 6, hours: 12, category: 'lighting', fuel: 'Standard Tariff', efficiency: 1}]
 //      
 // Global Outputs: 
 //	- data.energy_requirements
 //	- data.fuel_requirements
 //
 // Module Variables:
 //	- data.appliancelist.lighting.totalwh
 //	- data.appliancelist.lighting.total_fuel_input
 //	- data.appliancelist.lighting.monthlykwh
 //	- data.appliancelist.lighting.gains_W_monthly
 //	- data.appliancelist.lighting.annualkWh
 //	- data.appliancelist.lighting.annual_fuel_input_kwh
 //	- data.appliancelist.lighting.gains_W
 //	- data.appliancelist.cooking.totalwh
 //	- data.appliancelist.cooking.total_fuel_input
 //	- data.appliancelist.cooking.monthlykwh
 //	- data.appliancelist.cooking.gains_W_monthly
 //	- data.appliancelist.appliances.totalwh
 //	- data.appliancelist.appliances.total_fuel_input
 //	- data.appliancelist.appliances.monthlykwh
 //	- data.appliancelist.appliances.gains_W_monthly
 //	- data.appliancelist.list 	//// items updated with the energy demand and fuel input values 
 //	
 // Datasets:
 //      - datasets.table_1a
 //	
 //---------------------------------------------------------------------------------------------*/

calc.appliancelist = function (data) {
    //data.appliancelist={};
    if (data.appliancelist == undefined)
        data.appliancelist = {list: [{name: "LED Light", power: 6, hours: 12, category: 'lighting', fuel: 'Standard Tariff', efficiency: 1}]};
    if (data.appliancelist.lighting == undefined)
        data.appliancelist.lighting = {};
    if (data.appliancelist.cooking == undefined)
        data.appliancelist.cooking = {};
    if (data.appliancelist.appliances == undefined)
        data.appliancelist.appliances = {};
    data.appliancelist.lighting.totalwh = 0;
    data.appliancelist.lighting.total_fuel_input = 0;
    data.appliancelist.lighting.monthlykwh = [];
    data.appliancelist.lighting.gains_W_monthly = [];
    data.appliancelist.cooking.totalwh = 0;
    data.appliancelist.cooking.total_fuel_input = 0;
    data.appliancelist.cooking.monthlykwh = [];
    data.appliancelist.cooking.gains_W_monthly = [];
    data.appliancelist.appliances.totalwh = 0;
    data.appliancelist.appliances.total_fuel_input = 0;
    data.appliancelist.appliances.monthlykwh = [];
    data.appliancelist.appliances.gains_W_monthly = [];
    for (z in data.appliancelist.list) {
        if (data.appliancelist.list[z].category != undefined)
            var category = data.appliancelist.list[z].category;
        else
            var category = 'appliances';
        data.appliancelist.list[z].energy = data.appliancelist.list[z].power * data.appliancelist.list[z].hours;
        data.appliancelist.list[z].fuel_input = data.appliancelist.list[z].energy / data.appliancelist.list[z].efficiency;
        data.appliancelist[category].totalwh += data.appliancelist.list[z].energy;
        data.appliancelist[category].total_fuel_input += data.appliancelist.list[z].fuel_input;
    }

    for (category in {'lighting': '', 'appliances': '', 'cooking': ''}) {
        data.appliancelist[category].annualkwh = data.appliancelist[category].totalwh * 365 * 0.001;
        data.appliancelist[category].annual_fuel_input_kwh = data.appliancelist[category].total_fuel_input * 365 * 0.001;
        for (m = 0; m < 12; m++)
            data.appliancelist[category].monthlykwh[m] = data.appliancelist[category].annualkwh * datasets.table_1a[m] / 365;
        data.appliancelist[category].gains_W = data.appliancelist[category].totalwh / 24.0;
        for (var m = 0; m < 12; m++)
            data.appliancelist[category].gains_W_monthly[m] = data.appliancelist[category].gains_W;
        if (data.LAC_calculation_type == 'detailedlist') {
            data.gains_W[category.charAt(0).toUpperCase() + category.slice(1)] = data.appliancelist[category].gains_W_monthly;
            if (data.appliancelist[category].annualkwh > 0)
                data.energy_requirements[category] = {name: category.charAt(0).toUpperCase() + category.slice(1), quantity: data.appliancelist[category].annualkwh, monthly: data.appliancelist[category].monthlykwh};
        }
    }

    // Fuel requirements
    if (data.LAC_calculation_type == 'detailedlist') {
        var f_requirements = {'lighting': {}, 'appliances': {}, 'cooking': {}};
        var fuel_input_total = {'lighting': 0, 'appliances': 0, 'cooking': 0};
        data.appliancelist.list.forEach(function (item) {
            if (f_requirements[item.category][item.fuel] == undefined)
                f_requirements[item.category][item.fuel] = {demand: 0, fraction: 0, fuel: item.fuel, system_efficiency: item.efficiency, fuel_input: 0};
            f_requirements[item.category][item.fuel].demand += 365 * item.energy / 1000;
            f_requirements[item.category][item.fuel].fuel_input += 365 * item.fuel_input / 1000;
            fuel_input_total[item.category] += 365 * item.fuel_input / 1000;
        });
        // Add fractions
        for (category in {appliances: {}, cooking: {}, lighting: {}}) {
            for (var fuel in f_requirements[category]) {
                f_requirements[category][fuel].fraction = f_requirements[category][fuel].fuel_input / fuel_input_total[category];
            }
        }
        // Copy over to data.fuel_requirements
        for (var category in f_requirements) {
            for (fuel in f_requirements[category]) {
                data.fuel_requirements[category].list.push(f_requirements[category][fuel]);
                data.fuel_requirements[category].quantity = fuel_input_total[category];
            }
        }
    }

    return data;
};

/*---------------------------------------------------------------------------------------------
 // generation
 // Calculates total generation, CO2, primary energy and income from renewables
 //	
 //	// Inputs from user: 
 //	- data.generation.use_PV_calculator
 //      - data.generation.solar_annual_kwh
 //      - data.generation.solar_fraction_used_onsite
 //      - data.generation.solar_FIT
 //      - data.generation.solar_export_FIT
 //      - data.generation.wind_annual_kwh
 //      - data.generation.wind_fraction_used_onsite
 //      - data.generation.wind_FIT
 //      - data.generation.wind_export_FIT
 //      - data.generation.hydro_annual_kwh: 0, hydro_fraction_used_onsite
 //      - data.generation.hydro_FIT
 //      - data.generation.hydro_export_FIT:
 //      - data.generation.solarpv_orientation // PV calculator: 0 (N) || 1 (NE/NW) || 2 (E/W) || 3 (SE/SW) || 4 (S)
 //      - data.generation.solarpv_kwp_installed // PV calculator
 //      - data.generation.solarpv_inclination // PV calculator, degrees
 //      - data.generation.solarpv_overshading // PV calculator: 0.5 (heavy > 80%) || 0.65 (Significant 60% - 80%) || 0.8 (Modest 20% - 60%) || 1 (None or very little, less than 20%)
 //      
 // Inputs from other modules: 
 //	- data.fuels['generation']
 //      
 // Global Outputs: 
 //	- data.total_income 
 //
 // Module Variables:
 //      - data.generation.total_generation: 0,
 //      - data.generation.total_used_onsite: 0,
 //      - data.generation.total_exported: 0,
 //      - data.generation.total_CO2: 0
 //.	- data.generation.total_primaryenergy
 //	- data.generation.total_energy_income
 //	- data.generation.systems
 //
 // External functions:
 //	- annual_solar_rad
 //--------------------------------------------------------------------------------------------*/

calc.generation = function (data) {

    if (data.generation == undefined)
        data.generation = {
            solar_annual_kwh: 0,
            solar_fraction_used_onsite: 0.5,
            solar_FIT: 0,
            solar_export_FIT: 0,
            wind_annual_kwh: 0,
            wind_fraction_used_onsite: 0.5,
            wind_FIT: 0,
            wind_export_FIT: 0,
            hydro_annual_kwh: 0, hydro_fraction_used_onsite: 0.5,
            hydro_FIT: 0,
            hydro_export_FIT: 0,
            solarpv_orientation: 4,
            solarpv_kwp_installed: 0,
            solarpv_inclination: 35,
            solarpv_overshading: 1,
            total_generation: 0,
            total_used_onsite: 0,
            total_exported: 0,
            total_CO2: 0
        };
    if (data.generation.systems == undefined)
        data.generation.systems = {};
    if (data.generation.use_PV_calculator == undefined)
        data.generation.use_PV_calculator = false;

    if (data.generation.use_PV_calculator != false) {
        var kWp = data.generation.solarpv_kwp_installed;

        // 0:North, 1:NE/NW, 2:East/West, 3:SE/SW, 4:South
        var orient = data.generation.solarpv_orientation;
        var p = data.generation.solarpv_inclination;
        var overshading_factor = data.generation.solarpv_overshading;

        // annual_solar_radiation
        // U3.3 in Appendix U for the applicable climate and orientation and tilt of the PV
        // Z PV is the overshading factor from Table H2.
        // p: tilt
        var annual_solar_radiation = annual_solar_rad(data.region, orient, p);

        data.generation.solar_annual_kwh = 0.8 * kWp * annual_solar_radiation * overshading_factor;
    }
    // ----------

    data.generation.total_energy_income = 0;
    data.generation.systems = {};
    if (data.generation.solar_annual_kwh > 0)
    {
        data.generation.systems.solarpv = {name: "Solar PV", quantity: data.generation.solar_annual_kwh, fraction_used_onsite: data.generation.solar_fraction_used_onsite, CO2: data.generation.solar_annual_kwh * data.fuels['generation'].co2factor, primaryenergy: data.generation.solar_annual_kwh * data.fuels['generation'].primaryenergyfactor};
        data.total_income += data.generation.solar_annual_kwh * data.generation.solar_FIT; //income due to generation
        if (data.generation.solar_export_FIT != undefined)
            data.total_income += 0.5 * data.generation.solar_annual_kwh * data.generation.solar_export_FIT; //income due to generation

    }

    if (data.generation.wind_annual_kwh > 0)
    {
        data.generation.systems.wind = {name: "Wind", quantity: data.generation.wind_annual_kwh, fraction_used_onsite: data.generation.wind_fraction_used_onsite, CO2: data.generation.wind_annual_kwh * data.fuels['generation'].co2factor, primaryenergy: data.generation.wind_annual_kwh * data.fuels['generation'].primaryenergyfactor};
        data.total_income += data.generation.wind_annual_kwh * data.generation.wind_FIT; //income due to generation
        if (data.generation.wind_export_FIT != undefined)
            data.total_income += 0.5 * data.generation.wind_annual_kwh * data.generation.wind_export_FIT; //income due to generation
    }

    if (data.generation.hydro_annual_kwh > 0)
    {
        data.generation.systems.hydro = {name: "Hydro", quantity: data.generation.hydro_annual_kwh, fraction_used_onsite: data.generation.hydro_fraction_used_onsite, CO2: data.generation.hydro_annual_kwh * data.fuels['generation'].co2factor, primaryenergy: data.generation.hydro_annual_kwh * data.fuels['generation'].primaryenergyfactor};
        data.total_income += data.generation.hydro_annual_kwh * data.generation.hydro_FIT; //income due to generation
        if (data.generation.hydro_export_FIT != undefined)
            data.total_income += 0.5 * data.generation.hydro_annual_kwh * data.generation.hydro_export_FIT; //income due to generation
    }

    data.generation.total_generation = 0;
    data.generation.total_used_onsite = 0;
    data.generation.total_exported = 0;
    data.generation.total_CO2 = 0;
    data.generation.total_primaryenergy = 0;
    for (z in data.generation.systems) {
        data.generation.total_generation += data.generation.systems[z].quantity;
        data.generation.total_used_onsite += data.generation.systems[z].quantity * data.generation.systems[z].fraction_used_onsite;
        data.generation.total_CO2 += data.generation.systems[z].CO2;
        data.generation.total_primaryenergy = data.generation.systems[z].primaryenergy;
    }
    data.generation.total_exported = data.generation.total_generation - data.generation.total_used_onsite;
    return data;
};


/*---------------------------------------------------------------------------------------------
 // currentenergy
 // Calculates totals from data from bills
 //	
 // Inputs from user: 
 //	- data.currentenergy.use_by_fuel
 //	- data.currentenergy.onsite_generation
 //	- data.currentenergy.generation
 //      
 // Inputs from other modules: 
 //	- data.fuels
 //      
 // Global Outputs: 
 //	- data.TFA
 //	- data.occupancy
 //
 // Module Variables:
 //      - data.currentenergy.primaryenergy_annual_kwh
 //      - data.currentenergy.total_co2
 //      - data.currentenergy.total_cost
 //      - data.currentenergy.annual_net_cost
 //      - data.currentenergy.primaryenergy_annual_kwhm2
 //      - data.currentenergy.total_co2m2
 //      - data.currentenergy.total_costm2
 //      - data.currentenergy.energyuseperperson
 //      	
 //--------------------------------------------------------------------------------------------*/

calc.currentenergy = function (data) {
    if (data.currentenergy == undefined)
        data.currentenergy = {};
    if (data.currentenergy.use_by_fuel == undefined) {
        data.currentenergy.use_by_fuel = {};
    }
    if (data.currentenergy.generation == undefined)
        data.currentenergy.generation = {annual_generation: 0, annual_CO2: 0, primaryenergy: 0, annual_savings: 0, fraction_used_onsite: 0.25, annual_FIT_income: 0};



    var total_co2 = 0;
    var total_cost = 0;
    var primaryenergy_annual_kwh = 0;
    var enduse_annual_kwh = 0;
    for (var fuel in data.currentenergy.use_by_fuel) {
        // Calculations for current fuel
        var f_use = data.currentenergy.use_by_fuel[fuel];
        f_use.annual_co2 = f_use.annual_use * data.fuels[fuel].co2factor;
        f_use.primaryenergy = f_use.annual_use * data.fuels[fuel].primaryenergyfactor;
        if (f_use.annual_use > 0)
            f_use.annualcost = f_use.annual_use * data.fuels[fuel].fuelcost / 100 + data.fuels[fuel].standingcharge;
        else
            f_use.annualcost = 0;

        // Calculation of totals
        total_co2 += f_use.annual_co2;
        total_cost += f_use.annualcost;
        primaryenergy_annual_kwh += f_use.primaryenergy;
        enduse_annual_kwh += f_use.annual_use;
    }

    if (data.currentenergy.onsite_generation === 1) { // See issue 304
        // Add to the totals the amount of energy generated that was used onsite
        enduse_annual_kwh += data.currentenergy.generation.fraction_used_onsite * data.currentenergy.generation.annual_generation;
        primaryenergy_annual_kwh += data.fuels.generation.primaryenergyfactor * data.currentenergy.generation.fraction_used_onsite * data.currentenergy.generation.annual_generation;
        total_co2 += data.fuels.generation.co2factor * data.currentenergy.generation.fraction_used_onsite * data.currentenergy.generation.annual_generation;

        // Calculate generation totals (savings due to generation)
        data.currentenergy.generation.primaryenergy = data.fuels.generation.primaryenergyfactor * data.currentenergy.generation.annual_generation;
        data.currentenergy.generation.annual_CO2 = data.fuels.generation.co2factor * data.currentenergy.generation.annual_generation;
        data.currentenergy.generation.annual_savings = data.fuels.generation.fuelcost / 100 * data.currentenergy.generation.fraction_used_onsite * data.currentenergy.generation.annual_generation;

        // Calculate totals taking into account generation
        total_co2 -= data.currentenergy.generation.annual_CO2;
        primaryenergy_annual_kwh -= data.currentenergy.generation.primaryenergy;
        // total_cost -= data.currentenergy.generation.annual_savings; -- Annual savings are not added: this is moeny that the user would pay on top of what they already pay if they didn't have generation
    }


    data.currentenergy.primaryenergy_annual_kwh = primaryenergy_annual_kwh;
    data.currentenergy.total_co2 = total_co2;
    data.currentenergy.total_cost = total_cost;
    data.currentenergy.annual_net_cost = total_cost - data.currentenergy.generation.annual_FIT_income;
    data.currentenergy.primaryenergy_annual_kwhm2 = primaryenergy_annual_kwh / data.TFA;
    data.currentenergy.total_co2m2 = total_co2 / data.TFA;
    data.currentenergy.total_costm2 = total_cost / data.TFA;
    data.currentenergy.energyuseperperson = (enduse_annual_kwh / 365.0) / data.occupancy;
    return data;
};


/*---------------------------------------------------------------------------------------------
 // fans_and_pumps_and_combi_keep_hot 
 // Calculates Annual energy requirements for pumps, fans and electric keep-hot
 // 
 // Inputs from other modules:  
 //      - data.heating_systems
 //	- data.ventilation.ventilation_type
 //	- data.ventilation.EVP
 //	- data.use_SHW
 //	- data.SHW.pump
 //      
 // Global Outputs: 
 //	- data.fans_and_pumps
 //      - data.energy_requirements.fans_and_pumps
 //	- data.fuel_requirements.fans_and_pumps
 //      
 //---------------------------------------------------------------------------------------------*/

calc.fans_and_pumps_and_combi_keep_hot = function (data) {

// 1.- Annual energy requirements for pumps, fans and electric keep-hot
    var annual_energy = 0;
    var monthly_energy = [];
    // From heating systems (Central heating pump, fans and supply pumps, keep hot facility
    data.heating_systems.forEach(function (system) {
        annual_energy += 1.0 * system.central_heating_pump;
        if (system.category != 'Warm air system')
            annual_energy += 1.0 * system.fans_and_supply_pumps;
        else
            annual_energy += 0.4 * 1.5 * data.volume;
        switch (system.combi_loss) {
            case 'Instantaneous, with keep-hot facility controlled by time clock':
                annual_energy += 600;
                break;
            case 'Instantaneous, with keep-hot facility not controlled by time clock':
                annual_energy += 900;
                break;
        }
    });
    // From Ventilation (SAP2012 document page 213)
    var ventilation_type = '';
    switch (data.ventilation.ventilation_type)
    {
        case 'NV':
        case 'IE':
        case 'PS':
            ventilation_type = 'd'; // Natural ventilation or whole house positive input ventilation from loft or passive stack'
            break;
        case 'DEV':
        case'MEV':
            ventilation_type = 'c'; // Whole house extract ventilation or positive input ventilation from outside
            break;
        case 'MV':
            ventilation_type = 'b'; // Balanced mechanical ventilation without heat recovery (MV)
            break;
        case 'MVHR':
            ventilation_type = 'a'; //Balanced mechanical ventilation with heat recovery (MVHR)
            break;
        default:
            data.ventilation.ventilation_type = 'NV';
            ventilation_type = 'd';
            break;
    }
    switch (ventilation_type) {
        case 'd':  // Natural ventilation or whole house positive input ventilation from loft or passive stack'
            // According to SAP we should do nothing - In this case annual energy is 0, see SAP2012 2.6.1: The energy used by the fan is taken as counterbalancing the effect of using slightly warmer air from the loft space compared with outside
            // But we think this is not accurate, so we add 28kWh/year per Extract Ventilation Point (BREDEM)
            for (z in data.ventilation.EVP) {
                var v_rate = 1.0 * data.ventilation.EVP[z].ventilation_rate;
                if (v_rate > 0)
                    annual_energy += 28;
            }
            break;
        case 'c':  //Positive input ventilation (from outside) or mechanical extract ventilation   
            annual_energy += 2.5 * data.ventilation.system_specific_fan_power * 1.22 * data.volume; // annual_energy += IUF * SFP * 1.22 * V;
            break;
        case 'a':  //Balanced mechanical ventilation with heat recovery (MVHR)
            annual_energy += 2.5 * data.ventilation.system_specific_fan_power * 2.44 * data.ventilation.system_air_change_rate * data.volume; //annual_energy += IUF * SFP * 2.44 * nmech * V;
            break;
        case 'b':  //Balanced mechanical ventilation without heat recovery (MV)
            annual_energy += 2.5 * data.ventilation.system_specific_fan_power * 2.44 * data.ventilation.system_air_change_rate * data.volume; //annual_energy += IUF * SFP * 2.44 * nmech * V;
            break;
    }

// From Solar Hot Water
    if (data.use_SHW == 1) {
        if (data.SHW.pump != undefined && data.SHW.pump == 'electric')
            annual_energy += 50;
    }

    // Energy and fuel requirements
    for (m = 0; m < 12; m++)
        monthly_energy[m] = annual_energy / 12;
    if (annual_energy > 0) {
        data.energy_requirements.fans_and_pumps = {name: "Fans and pumps", quantity: annual_energy, monthly: monthly_energy};

        if (data.fans_and_pumps == undefined)
            data.fans_and_pumps = [{fuel: 'Standard Tariff', fraction: 1}];

        data.fuel_requirements.fans_and_pumps.quantity = 0;

        data.fans_and_pumps.forEach(function (fuel_requirement, index) {
            fuel_requirement.demand = annual_energy * fuel_requirement.fraction;
            fuel_requirement.fuel_input = annual_energy * fuel_requirement.fraction; // We assume efficiency of Electrical system is 1
            data.fuel_requirements.fans_and_pumps.quantity += fuel_requirement.fuel_input;
            data.fuel_requirements.fans_and_pumps.list.push(fuel_requirement);
        });
    }
};


/*---------------------------------------------------------------------------------------------
 // gains
 // Calculates gains for "metabolic", "losses", "fans and pumps"
 //
 // Inputs from other modules:  
 //      - data.space_heating.use_utilfactor_forgains
 //	- data.occupancy
 //	- data.ventilation.ventilation_type
 //	- data.ventilation.system_specific_fan_power
 //	- data.volume
 //      
 // Global Outputs:
 //	- data.gains_W['fans_and_pumps']
 //	- data.gains_W['metabolic']
 //	- data.gains_W['losses']
 //	  
 //---------------------------------------------------------------------------------------------*/

calc.metabolic_losses_fans_and_pumps_gains = function (data) {

    //Internal gains for "Metabolic" and "Losses"
    data.gains_W['metabolic'] = new Array();
    data.gains_W['losses'] = new Array();
    for (m = 0; m < 12; m++) {
        if (typeof data.space_heating === 'object') {
            if (data.space_heating.use_utilfactor_forgains) {
                data.gains_W['metabolic'][m] = 60 * data.occupancy;
                data.gains_W['losses'][m] = -40 * data.occupancy;
            }
            else {
                data.gains_W['metabolic'][m] = 50 * data.occupancy;
                data.gains_W['losses'][m] = -40 * data.occupancy;
            }
        }
    }

    //  Fans and Pumps - SAP2012 table 5, p. 215
    var monthly_heat_gains = 0;
    data.gains_W['fans_and_pumps'] = new Array();
    // Note: From if there was an oil boiler with pump inside dweling we should add 10W of gains, the problem is that i don't know where in MHEP we can as this. Therefor we assume taht in the case of havin an oil boiler the pump is outside :(

    // From ventilation
    var ventilation_type = '';
    switch (data.ventilation.ventilation_type)
    {
        case 'NV':
        case 'IE':
        case 'PS':
            ventilation_type = 'd'; // Natural ventilation or whole house positive input ventilation from loft'
            break;
        case 'DEV':
        case'MEV':
            ventilation_type = 'c'; // Whole house extract ventilation or positive input ventilation from outside
            break;
        case 'MV':
            ventilation_type = 'b'; // Balanced mechanical ventilation without heat recovery (MV)
            break;
        case 'MVHR':
            ventilation_type = 'a'; //Balanced mechanical ventilation with heat recovery (MVHR)
            break;
        default:
            data.ventilation.ventilation_type = 'NV';
            ventilation_type = 'd';
            break;
    }
    switch (ventilation_type) {
        case 'a':  //Balanced mechanical ventilation with heat recovery (MVHR), the heat gains in this case are included in the MVHR efficiency
        case 'd':  //Positive input ventilation (from loft space)
            // Do nothing 
            break;
        case 'c':  //Positive input ventilation (from outside) or mechanical extract ventilation   
            monthly_heat_gains += 2.5 * data.ventilation.system_specific_fan_power * 0.12 * data.volume; // monthly_heat_gains += IUF * SFP *  0.12 *  V;
            break;
        case 'b':  //Balanced mechanical ventilation without heat recovery (MV)
            monthly_heat_gains += 2.5 * data.ventilation.system_specific_fan_power * 0.06 * data.volume; //monthly_heat_gains += IUF * SFP *  0.06 *  V;
            break;
    }

    for (var i = 0; i < 12; i++)
        data.gains_W['fans_and_pumps'][i] = monthly_heat_gains;

};

/*---------------------------------------------------------------------------------------------
 // gains_summary
 // Calculates total solar gains, total internal gains and both together
 //      - Solar gains are calculated in calc.fabric
 //      - Lighting, cooking and appliances are calculated in calc.LAC_SAP(), calc.applianceCarbonCoop() or calc.appliancelist();
 //      - Water heating gains are calculated in water_heating calc.water_heating()
 //      - Gains for fans and pumps, losses and metabolice are calculated in calc.metabolic_losses_fans_and_pumps_gains()
 //      - Useful gains (after applying utilisation factor) are calculated in calc.space_heating()
 //      
 //
 // Inputs from other modules:  
 //      - data.gains_W
 //      
 // Global Outputs:
 //	- data.total_internal_gains
 //	- data.total_solar_gains
 //	- data.total_internal_and_solar_gains
 //	  
 //---------------------------------------------------------------------------------------------*/

calc.gains_summary = function (data) {
    data.total_internal_gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data.total_internal_and_solar_gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data.total_solar_gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (m = 0; m < 12; m++) {
        for (g in data.gains_W) {
            data.total_internal_and_solar_gains[m] += data.gains_W[g][m];
            if (g != 'solar')
                data.total_internal_gains[m] += data.gains_W[g][m];
            else
                data.total_solar_gains[m] += data.gains_W[g][m];
        }
    }

    return data;
}

//---------------------------------------------------------------------------------------------
// SEPERATED MODEL FUNCTIONS
//---------------------------------------------------------------------------------------------
// U3.2 Solar radiation on vertical and inclined surfaces
function solar_rad(region, orient, p, m)
{
    var k = datasets.k; // convert degrees into radians
    var radians = (p / 360.0) * 2.0 * Math.PI;
    var sinp = Math.sin(radians / 2.0); // sinp = sin(p/2)
    var sin2p = sinp * sinp;
    var sin3p = sinp * sinp * sinp;
    var A = k[1][orient] * sin3p + k[2][orient] * sin2p + k[3][orient] * sinp;
    var B = k[4][orient] * sin3p + k[5][orient] * sin2p + k[6][orient] * sinp;
    var C = k[7][orient] * sin3p + k[8][orient] * sin2p + k[9][orient] * sinp + 1;
    var latitude = (datasets.table_u4[region][0] / 360) * 2 * Math.PI; // get latitude in degrees and convert to radians
    var sol_dec = (datasets.solar_declination[m] / 360) * 2 * Math.PI; // get solar_declination in degrees and convert to radians
    var cos1 = Math.cos(latitude - sol_dec);
    var cos2 = cos1 * cos1;
    // Rh-inc(orient, p, m) = A × cos2(φ - δ) + B × cos(φ - δ) + C
    var Rh_inc = A * cos2 + B * cos1 + C;
    return datasets.table_u3[region][m] * Rh_inc;
}

// Annual solar radiation on a surface
function annual_solar_rad(region, orient, p)
{
    // month 0 is january, 11: december
    var sum = 0;
    for (var m = 0; m < 12; m++)
    {
        sum += datasets.table_1a[m] * solar_rad(region, orient, p, m);
    }
    return 0.024 * sum;
}


function calc_solar_gains_from_windows(windows, region)
{
    var gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (z in windows)
    {
        var orientation = windows[z]['orientation'];
        var area = windows[z]['area'];
        var overshading = windows[z]['overshading'];
        var g = windows[z]['g'];
        var ff = windows[z]['ff'];
        // The gains for a given window are calculated for each month         // the result of which needs to be put in a bin for totals for jan, feb etc..
        for (var month = 0; month < 12; month++)
        {
            // access factor is time of year dependent
            // Summer months: 5:June, 6:July, 7:August and 8:September (where jan = month 0)
            var summer = 0;
            if (month >= 5 && month <= 8)
                summer = 1;
            var access_factor = datasets.table_6d_solar_access_factor[overshading][summer];
            // Map orientation code from window to solar rad orientation codes.
            if (orientation == 5)
                orientation = 3; // SE/SW
            if (orientation == 6)
                orientation = 2; // East/West
            if (orientation == 7)
                orientation = 1; // NE/NW

            gains[month] += access_factor * area * solar_rad(region, orientation, 90, month) * 0.9 * g * ff;
        }
    }
    return gains;
}

// Calculation of mean internal temperature for heating
// Calculation of mean internal temperature is based on the heating patterns defined in Table 9.

function calc_utilisation_factor(TMP, HLP, H, Ti, Te, G)
{
    /*
     Symbols and units
     H = heat transfer coefficient, (39)m (W/K)
     G = total gains, (84)m (W)
     Ti = internal temperature (°C)
     Te = external temperature, (96)m (°C)
     TMP = Thermal Mass Parameter, (35), (kJ/m2K) (= Cm for building / total floor area)
     HLP = Heat Loss Parameter, (40)m (W/m2K)
     τ = time constant (h)
     η = utilisation factor
     L = heat loss rate (W)
     */

// Calculation of utilisation factor

// TMP = thermal Mass / Total floor area
    // HLP = heat transfer coefficient (H) / Total floor area

    var tau = TMP / (3.6 * HLP);
    var a = 1.0 + tau / 15.0;
    // calc losses
    var L = H * (Ti - Te);
    // ratio of gains to losses
    var y = G / L;
    // Note: to avoid instability when γ is close to 1 round γ to 8 decimal places
    // y = y.toFixed(8);
    y = Math.round(y * 100000000.0) / 100000000.0;
    var n = 0.0;
    if (y > 0.0 && y != 1.0)
        n = (1.0 - Math.pow(y, a)) / (1.0 - Math.pow(y, a + 1.0));
    if (y == 1.0)
        n = a / (a + 1.0);
    if (y <= 0.0)
        n = 1.0;
    if (isNaN(n))
        n = 0;
    return n;
}

function calc_temperature_reduction(TMP, HLP, H, Ti, Te, G, R, Th, toff) {
    // Calculation of utilisation factor
    var tau = TMP / (3.6 * HLP);
    var a = 1.0 + tau / 15.0;
    var L = H * (Ti - Te);
    var y = G / L;
    // Note: to avoid instability when γ is close to 1 round γ to 8 decimal places
    // y = y.toFixed(8);
    y = Math.round(y * 100000000.0) / 100000000.0;
    var n = 0.0;
    if (y > 0.0 && y != 1.0)
        n = (1.0 - Math.pow(y, a)) / (1.0 - Math.pow(y, a + 1.0));
    if (y == 1.0)
        n = a / (a + 1.0);
    var tc = 4.0 + 0.25 * tau;
    var Tsc = (1.0 - R) * (Th - 2.0) + R * (Te + n * G / H);
    var u;
    if (toff <= tc)
        u = 0.5 * toff * toff * (Th - Tsc) / (24 * tc);
    if (toff > tc)
        u = (Th - Tsc) * (toff - 0.5 * tc) / 24;
    if (isNaN(u))
        u = 0;
    return u;
}

function calc_MeanInternalTemperature(Th, hours_off, TMP, HLP, H, Te, G, R) {
    var Ti_area = [];
    for (var m = 0; m < 12; m++)
    {
        var Thm = Th[m]
        var Ti = Th[m];
        // (TMP,HLP,H,Ti,Te,G, R,Th,toff)
        var temp = {weekday: 0, weekend: 0};
        for (var type in hours_off) {
            for (z in hours_off[type])
                temp[type] += calc_temperature_reduction(TMP, HLP[m], H[m], Ti, Te[m], G[m], R, Thm, hours_off[type][z]);
        }
        var Tweekday = Th[m] - temp.weekday;
        var Tweekend = Th[m] - temp.weekend;
        Ti_area[m] = (5 * Tweekday + 2 * Tweekend) / 7;
    }
    return Ti_area;
}

function calc_Th2(control_type, Th, HLP) {
    var temp = [];
    for (var m = 0; m < 12; m++) {
        var tmpHLP = HLP[m];
        if (tmpHLP > 6.0)
            tmpHLP = 6.0;
        if (control_type == 1)
            temp[m] = Th - 0.5 * tmpHLP;
        if (control_type == 2)
            temp[m] = Th - tmpHLP + (Math.pow(tmpHLP, 2) / 12);
        if (control_type == 3)
            temp[m] = Th - tmpHLP + (Math.pow(tmpHLP, 2) / 12);
        if (isNaN(temp[m]))
            temp[m] = Th;
    }
    return temp;
}