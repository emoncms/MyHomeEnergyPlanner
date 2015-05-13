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


*/


var calc = {data:{}};

calc.run = function(datain) 
{
    //this.data = JSON.parse(JSON.stringify(datain));
    this.data = datain;

    calc.start();
    calc.floors();
    calc.occupancy();
    calc.fabric();
    calc.ventilation();
    
    calc.LAC();
    calc.water_heating();
    calc.SHW();
    calc.appliancelist();
    calc.generation();
    calc.currentenergy();
    
    calc.temperature();
    calc.space_heating();
    calc.energy_systems();
    calc.SAP();
    
    this.data.totalWK = this.data.fabric.total_heat_loss_WK + this.data.ventilation.average_WK;
   
    this.data.primary_energy_use_m2 = this.data.primary_energy_use/this.data.TFA;
    this.data.kgco2perm2 = this.data.annualco2/this.data.TFA;
    this.data.kwhdpp = (this.data.energy_use/365.0)/this.data.occupancy;
    this.data.primarykwhdpp = (this.data.primary_energy_use/365.0)/this.data.occupancy;
    return this.data;
}

calc.start = function() 
{
    if (this.data==null) this.data = {};
    // Global namespace variables:
    if (this.data.region == undefined) this.data.region = 0;
    if (this.data.altitude == undefined) this.data.altitude = 0;
    if (this.data.household == undefined) this.data.household = {};
    
    this.data.num_of_floors = 0;
    this.data.TFA = 0;
    this.data.volume = 0;
    this.data.occupancy = 0;
    
    this.data.internal_temperature = [18,18,18,18,18,18,18,18,18,18,18,18];
    this.data.external_temperature = [10,10,10,10,10,10,10,10,10,10,10,10];
    this.data.losses_WK = {};
    this.data.gains_W = {};
    
    this.data.energy_requirements = {};
    this.data.total_cost = 0;
    this.data.total_income = 0;
    this.data.primary_energy_use = 0;
    this.data.kgco2perm2 = 0;
    this.data.primary_energy_use_bills = 0;
    this.data.fabric_energy_efficiency = 0;
    
    this.data.totalWK = 0;
}

//---------------------------------------------------------------------------------------------
// FLOORS
// Module Inputs:  this.data.floors
// Global Outputs: this.data.TFA, this.data.volume, this.data.num_of_floors 
//---------------------------------------------------------------------------------------------

calc.floors = function()
{    
    if (this.data.floors==undefined) this.data.floors = [];
 
    for (z in this.data.floors)
    {
        this.data.floors[z].volume = this.data.floors[z].area * this.data.floors[z].height;
        this.data.TFA += this.data.floors[z].area;
        this.data.volume += this.data.floors[z].volume;
        this.data.num_of_floors++;
    }
}

//---------------------------------------------------------------------------------------------
// OCCUPANCY
// SAP calculation of occupancy based on total floor area
// Global inputs:  this.data.TFA  
// Global outputs: this.data.occupancy
//---------------------------------------------------------------------------------------------

calc.occupancy = function()
{
    if (this.data.use_custom_occupancy==undefined) this.data.use_custom_occupancy = false;
    if (this.data.custom_occupancy==undefined) this.data.custom_occupancy = 1;
    if (this.data.TFA > 13.9) {
      this.data.occupancy = 1 + 1.76 * (1 - Math.exp(-0.000349 * Math.pow((this.data.TFA -13.9),2))) + 0.0013 * (this.data.TFA - 13.9);
    } else {
      this.data.occupancy = 1;
    }

    if (this.data.use_custom_occupancy)
    {
        this.data.occupancy = this.data.custom_occupancy;
    }
}

//---------------------------------------------------------------------------------------------
// BUILDING FABRIC
// Calculates total monthly fabric heat loss and monthly solar gains from building elements list
// Module Inputs:  this.data.fabric.elements
// Global Inputs:  this.data.TFA
// Global Outputs: this.data.TMP, this.data.losses_WK.fabric, this.data.gains_W.solar
// Uses external function: calc_solar_gains_from_windows
//---------------------------------------------------------------------------------------------

calc.fabric = function() 
{
    if (this.data.fabric==undefined) this.data.fabric = {};
    if (this.data.fabric.elements==undefined) this.data.fabric.elements = [];
    if (this.data.fabric.thermal_bridging_yvalue==undefined) this.data.fabric.thermal_bridging_yvalue = 0.15;
    
    this.data.fabric.total_heat_loss_WK = 0;
    this.data.fabric.total_thermal_capacity = 0;
    
    this.data.fabric.total_floor_WK = 0;
    this.data.fabric.total_wall_WK = 0;
    this.data.fabric.total_roof_WK = 0;
    this.data.fabric.total_window_WK = 0;
    
    this.data.fabric.annual_solar_gain = 0;
    
    this.data.fabric.total_external_area = 0;
    
    this.data.fabric.total_wall_area = 0;
    this.data.fabric.total_floor_area = 0;
    this.data.fabric.total_roof_area = 0;
    this.data.fabric.total_window_area = 0;      
    // Solar gains
    var sum = 0;
    var gains = [0,0,0,0,0,0,0,0,0,0,0,0];
    
    for (z in this.data.fabric.elements)
    {
        // Calculate heat loss through elements
        
        // Use element length and height if given rather than area.
        if (this.data.fabric.elements[z]['l']!=undefined && this.data.fabric.elements[z]['l']!='' && this.data.fabric.elements[z]['h']!=undefined && this.data.fabric.elements[z]['h']!='')
        {
            this.data.fabric.elements[z].area = this.data.fabric.elements[z]['l'] * this.data.fabric.elements[z]['h'];
        }
        this.data.fabric.elements[z].netarea = this.data.fabric.elements[z].area;
        
        if (this.data.fabric.elements[z].type!='window') {
            this.data.fabric.elements[z].windowarea = 0;
        }
        
        // Subtract window areas:
        
        for (w in this.data.fabric.elements)
        {
            if (this.data.fabric.elements[w].type=='window')
            {
                if (this.data.fabric.elements[w].subtractfrom!=undefined && this.data.fabric.elements[w].subtractfrom == z)
                {
                    var windowarea = this.data.fabric.elements[w].area;
                    
                    if (this.data.fabric.elements[w]['l']!=undefined && this.data.fabric.elements[w]['l']!='' && this.data.fabric.elements[w]['h']!=undefined && this.data.fabric.elements[w]['h']!='')
                    {
                        windowarea = this.data.fabric.elements[w]['l'] * this.data.fabric.elements[w]['h'];
                    }
                    this.data.fabric.elements[z].windowarea += windowarea;
                    this.data.fabric.elements[z].netarea -= windowarea;
                }
            }
        }
        
        
        this.data.fabric.elements[z].wk = this.data.fabric.elements[z].netarea * this.data.fabric.elements[z].uvalue;
        this.data.fabric.total_heat_loss_WK += this.data.fabric.elements[z].wk;
        
        // By checking that the u-value is not 0 = internal walls we can calculate total external area
        if (this.data.fabric.elements[z].uvalue!=0) {
            this.data.fabric.total_external_area += this.data.fabric.elements[z].netarea;
        }
        
        
        if (this.data.fabric.elements[z].type == 'floor') {
            this.data.fabric.total_floor_WK += this.data.fabric.elements[z].wk;
            this.data.fabric.total_floor_area += this.data.fabric.elements[z].netarea;
        }
        if (this.data.fabric.elements[z].type == 'wall') {
            this.data.fabric.total_wall_WK += this.data.fabric.elements[z].wk;
            this.data.fabric.total_wall_area += this.data.fabric.elements[z].netarea;
        }
        if (this.data.fabric.elements[z].type == 'roof') {
            this.data.fabric.total_roof_WK += this.data.fabric.elements[z].wk;
            this.data.fabric.total_roof_area += this.data.fabric.elements[z].netarea;
        }
        if (this.data.fabric.elements[z].type == 'window') {
            this.data.fabric.total_window_WK += this.data.fabric.elements[z].wk;
            this.data.fabric.total_window_area += this.data.fabric.elements[z].netarea;
        }
                
        // Calculate total thermal capacity
        if (this.data.fabric.elements[z].kvalue!=undefined) {
            this.data.fabric.total_thermal_capacity += this.data.fabric.elements[z].kvalue * this.data.fabric.elements[z].area;
        }
        
        if (this.data.fabric.elements[z].type == 'window') 
        {
            var orientation = this.data.fabric.elements[z]['orientation'];
            var area = this.data.fabric.elements[z]['area'];
            var overshading = this.data.fabric.elements[z]['overshading'];
            var g = this.data.fabric.elements[z]['g'];
            var ff = this.data.fabric.elements[z]['ff'];
            
            var gain = 0;

            // The gains for a given window are calculated for each month
            // the result of which needs to be put in a bin for totals for jan, feb etc..
            for (var month=0; month<12; month++)
            {
                // Access factor table: first dimention is shading factor, 2nd in winter, summer.
                var table_6d = [[0.3,0.5],[0.54,0.7],[0.77,0.9],[1.0,1.0]];

                // access factor is time of year dependent
                // Summer months: 5:June, 6:July, 7:August and 8:September (where jan = month 0)
                var summer = 0; if (month>=5 && month<=8) summer = 1;
                var access_factor = table_6d[overshading][summer];

                // Map orientation code from window to solar rad orientation codes.
                if (orientation == 5) orientation = 3; // SE/SW
                if (orientation == 6) orientation = 2; // East/West
                if (orientation == 7) orientation = 1; // NE/NW

                var gain_month = access_factor * area * solar_rad(this.data.region,orientation,90,month) * 0.9 * g * ff;
                gains[month] += gain_month;
                gain += gain_month;
            }

            var accessfactor = [0.5,0.67,0.83,1.0];
            sum += 0.9 * area * g * ff * accessfactor[overshading];
            this.data.fabric.elements[z].gain = gain / 12.0;
            this.data.fabric.annual_solar_gain += this.data.fabric.elements[z].gain;
        }
    }
    
    this.data.fabric.thermal_bridging_heat_loss = this.data.fabric.total_external_area * this.data.fabric.thermal_bridging_yvalue;
    
    this.data.fabric.total_heat_loss_WK += this.data.fabric.thermal_bridging_heat_loss;
    
    this.data.fabric.annual_solar_gain_kwh = this.data.fabric.annual_solar_gain * 0.024 * 365;
    this.data.TMP = this.data.fabric.total_thermal_capacity / this.data.TFA;

    var monthly_fabric_heat_loss = [];
    for (var m=0; m<12; m++) monthly_fabric_heat_loss[m] = this.data.fabric.total_heat_loss_WK;
    
    this.data.losses_WK["fabric"] = monthly_fabric_heat_loss;
    
    this.data.gains_W["solar"] = gains;
    this.data.GL = sum / this.data.TFA;
    
}

//---------------------------------------------------------------------------------------------
// VENTILATION
// Module Inputs: this.data.ventilation object
// Global Inputs: this.data.volume, this.data.num_of_floors, this.data.region
// Global Outputs: this.data.losses_WK.ventilation
// Datasets: datasets.table_u2
//---------------------------------------------------------------------------------------------

calc.ventilation = function()
{ 
    var defaults = {
        number_of_chimneys: 0,
        number_of_openflues: 0,
        number_of_intermittentfans: 0,
        number_of_passivevents: 0,
        number_of_fluelessgasfires: 0,
        
        air_permeability_test: false,
        air_permeability_value: 0,
        
        dwelling_construction: 'timberframe',
        suspended_wooden_floor: 0, // 'unsealed', 'sealed', 0
        draught_lobby: false,
        percentage_draught_proofed: 0,
        number_of_sides_sheltered: 0,
        
        ventilation_type: 'd',
        system_air_change_rate: 0,
        balanced_heat_recovery_efficiency: 100
    }
    
    if (this.data.ventilation==undefined) this.data.ventilation = {};
    for (z in defaults)
    {
        if (this.data.ventilation[z]==undefined) this.data.ventilation[z] = defaults[z];
    }

    var total = 0;
    total += this.data.ventilation.number_of_chimneys * 40;
    total += this.data.ventilation.number_of_openflues * 20;
    total += this.data.ventilation.number_of_intermittentfans * 10;
    total += this.data.ventilation.number_of_passivevents * 10;
    total += this.data.ventilation.number_of_fluelessgasfires * 10;
    
    var infiltration = 0;
    if (this.data.volume!=0) {
        infiltration = total / this.data.volume;
    }
    
    if (this.data.ventilation.air_permeability_test==false) 
    { 
        infiltration += (this.data.num_of_floors - 1) * 0.1;

        if (this.data.ventilation.dwelling_construction=='timberframe') infiltration += 0.2;
        if (this.data.ventilation.dwelling_construction=='masonry') infiltration += 0.35;

        if (this.data.ventilation.suspended_wooden_floor=='unsealed') infiltration += 0.2;
        if (this.data.ventilation.suspended_wooden_floor=='sealed') infiltration += 0.1;

        if (!this.data.ventilation.draught_lobby) infiltration += 0.05;

        // Window infiltration
        infiltration += (0.25 - (0.2 * this.data.ventilation.percentage_draught_proofed / 100 ));
    }
    else
    {
        infiltration += this.data.ventilation.air_permeability_value / 20.0;
    }
    
    var shelter_factor = 1 - (0.075 * this.data.ventilation.number_of_sides_sheltered);

    infiltration *= shelter_factor;

    var adjusted_infiltration = [];
    for (var m = 0; m<12; m++)
    {
        var windspeed = datasets.table_u2[this.data.region][m];
        var windfactor = windspeed / 4;
        adjusted_infiltration[m] = infiltration * windfactor;
    }
    
    // (24a)m effective_air_change_rate
    // (22b)m adjusted_infiltration
    // (23b)  this.input.effective_air_change_rate.exhaust_air_heat_pump
    // (23c)  this.input.balanced_heat_recovery_efficiency
    var effective_air_change_rate = [];
    switch(this.data.ventilation.ventilation_type)
    {
        case 'a':
            for (var m = 0; m<12; m++)
            {
                // (24a)m = (22b)m + (23b) x (1 - (23c) / 100)
                effective_air_change_rate[m] = adjusted_infiltration[m] + this.data.ventilation.system_air_change_rate * (1 - this.data.ventilation.balanced_heat_recovery_efficiency / 100.0);
            }
            break;
            
        case 'b':
            for (var m = 0; m<12; m++)
            {
                // (24b)m = (22b)m + (23b)
                effective_air_change_rate[m] = adjusted_infiltration[m] + this.data.ventilation.system_air_change_rate;
            }
            break;
            
        case 'c':
            for (var m = 0; m<12; m++)
            {
                // if (22b)m < 0.5 × (23b), then (24c) = (23b); otherwise (24c) = (22b) m + 0.5 × (23b)
                // effective_air_change_rate[m] = 
                if (adjusted_infiltration[m] < 0.5 * this.data.ventilation.system_air_change_rate) {
                    effective_air_change_rate[m] = this.data.ventilation.system_air_change_rate;
                } else {
                    effective_air_change_rate[m] = adjusted_infiltration[m] + (0.5 * this.data.ventilation.system_air_change_rate);
                }
            }
            break;
            
        case 'd':
            for (var m = 0; m<12; m++)
            {
                // if (22b)m ≥ 1, then (24d)m = (22b)m otherwise (24d)m = 0.5 + [(22b)m2 × 0.5]
                if (adjusted_infiltration[m] >= 1) {
                    effective_air_change_rate[m] = adjusted_infiltration[m];
                } else {
                    effective_air_change_rate[m] = 0.5 + Math.pow(adjusted_infiltration[m],2) * 0.5;
                }
            }
            break;
    }
    
    var sum = 0;
    var infiltration_WK = [];
    for (var m = 0; m<12; m++)
    {
      infiltration_WK[m] = effective_air_change_rate[m] * this.data.volume * 0.33;
      sum += infiltration_WK[m];
    }
    this.data.ventilation.average_WK = sum / 12.0;
    
    this.data.ventilation.effective_air_change_rate = effective_air_change_rate;
    this.data.ventilation.infiltration_WK = infiltration_WK;
    
    this.data.losses_WK.ventilation = infiltration_WK;
}

//---------------------------------------------------------------------------------------------
// TEMPERATURE
// Module Inputs: this.data.temperature.responsiveness, this.data.temperature.target, this.data.temperature.living_area, this.data.temperature.control_type
// Global Inputs: this.data.TFA, this.data.TMP, this.data.losses_WK, this.data.gains_W, this.data.altitude, this.data.region
// Global Outputs: this.data.internal_temperature, this.data.external_temperature
// Datasets: datasets.table_u1
// Uses external function: calc_utilisation_factor
//---------------------------------------------------------------------------------------------
calc.temperature = function ()
{
    if (this.data.temperature==undefined) this.data.temperature = {};
    if (this.data.temperature.control_type==undefined) this.data.temperature.control_type = 1;
    if (this.data.temperature.living_area==undefined) this.data.temperature.living_area = this.data.TFA;
    if (this.data.temperature.target==undefined) this.data.temperature.target = 21;
    if (this.data.temperature.responsiveness==undefined) this.data.temperature.responsiveness = 1;
    
    var R = this.data.temperature.responsiveness;
    var Th = this.data.temperature.target;
    var TMP = this.data.TMP; // this.data.TMP;
    
    var H = [0,0,0,0,0,0,0,0,0,0,0,0];
    var HLP = [];
    var G = [0,0,0,0,0,0,0,0,0,0,0,0];
    
    for (m=0; m<12; m++) 
    {
        for (z in this.data.losses_WK) {
            H[m] += this.data.losses_WK[z][m];
            HLP[m] = H[m] / this.data.TFA;
        }
        
        for (z in this.data.gains_W) G[m] += this.data.gains_W[z][m];        
    }    
    
    var Te = [];
    for (var m =0; m<12; m++)
    {
        Te[m] = datasets.table_u1[this.data.region][m]-(0.3*this.data.altitude/50);
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
    for (var m=0; m<12; m++) 
    {
        utilisation_factor_A[m] = calc_utilisation_factor(TMP,HLP[m],H[m],Th,Te[m],G[m]);
    }

    // Table 9c: Heating requirement
    // Living area
    // 1. Set Ti to the temperature for the living area during heating periods (Table 9)
    // 2. Calculate the utilisation factor (Table 9a)
    // 3. Calculate the temperature reduction (Table 9b) for each off period (Table 9), u1 and u2, for weekdays

    var Ti_livingarea = [];
    for (var m=0; m<12; m++) 
    { 
        var Ti = Th;

        // (TMP,HLP,H,Ti,Te,G, R,Th,toff)
        var u1a = calc_temperature_reduction(TMP,HLP[m],H[m],Ti,Te[m],G[m],R,Th,7);
        var u1b = calc_temperature_reduction(TMP,HLP[m],H[m],Ti,Te[m],G[m],R,Th,0);
        var u2 =  calc_temperature_reduction(TMP,HLP[m],H[m],Ti,Te[m],G[m],R,Th,8);

        var Tweekday = Th - (u1a + u2);
        var Tweekend = Th - (u1b + u2);
        Ti_livingarea[m] = (5*Tweekday + 2*Tweekend) / 7;
    }

    // rest of dwelling
    var Th2 = [];
    for (var m=0; m<12; m++) {
        // see table 9 page 159
        if (this.data.temperature.control_type==1) Th2[m] = Th - 0.5 * HLP[m];
        if (this.data.temperature.control_type==2) Th2[m] = Th - HLP[m] + (Math.pow(HLP[m],2) / 12);
        if (this.data.temperature.control_type==3) Th2[m] = Th - HLP[m] + (Math.pow(HLP[m],2) / 12);
        //Th2[m] = i.Th - i.HLP[m] + 0.085 *Math.pow(i.HLP[m],2);

        if (isNaN(Th2[m])) Th2[m] = Th;
    }

    var utilisation_factor_B = [];
    for (var m=0; m<12; m++) 
    { 
        var Ti = Th2[m];
        var tmpHLP = HLP[m];
        if (tmpHLP>6.0) tmpHLP = 6.0;
        // TMP,HLP,H,Ti,Te,G  
        utilisation_factor_B[m] = calc_utilisation_factor(TMP,tmpHLP,H[m],Ti,Te[m],G[m]);
    }

    var Ti_restdwelling = [];
    for (var m=0; m<12; m++) 
    { 
        var Th = Th2[m];
        var Ti = Th2[m];

        var u1a = calc_temperature_reduction(TMP,HLP[m],H[m],Ti,Te[m],G[m],R,Th,7);
        var u1b = calc_temperature_reduction(TMP,HLP[m],H[m],Ti,Te[m],G[m],R,Th,0);
        var u2 =  calc_temperature_reduction(TMP,HLP[m],H[m],Ti,Te[m],G[m],R,Th,8);

        var Tweekday = Th - (u1a + u2);
        var Tweekend = Th - (u1b + u2);
        Ti_restdwelling[m] = (5*Tweekday + 2*Tweekend) / 7;
    }

    var fLA = this.data.temperature.living_area / this.data.TFA;
    if (isNaN(fLA)) fLA = 0;

    this.data.internal_temperature = [];
    for (var m=0; m<12; m++) 
    { 
        this.data.internal_temperature[m] = (fLA * Ti_livingarea[m]) + (1 - fLA) * Ti_restdwelling[m];
    }
    
    this.data.external_temperature = Te;
}

//---------------------------------------------------------------------------------------------
// SPACE HEATING AND COOLING
// Calculates space heating and cooling demand.
// Module Inputs: this.data.space_heating.use_utilfactor_forgains
// Global Inputs: this.data.TFA, this.data.internal_temperature, this.data.external_temperature, this.data.losses_WK, this.data.gains_W
// Global Outputs: this.data.energy_requirements.space_heating, this.data.energy_requirements.space_cooling
// Uses external function: calc_utilisation_factor
// Datasets: datasets.table_1a
//---------------------------------------------------------------------------------------------

calc.space_heating = function() 
{
    if (this.data.space_heating==undefined) this.data.space_heating = {};
    if (this.data.space_heating.use_utilfactor_forgains==undefined) this.data.space_heating.use_utilfactor_forgains = true;
    
    // These might all need to be defined within the space_heating namespace to be accessible in the ui.
    var delta_T = [];
    var total_losses = [];
    var total_gains = [];
    var utilisation_factor = [];
    var useful_gains = [];
    
    var heat_demand = [];
    var cooling_demand = [];
    var heat_demand_kwh = [];
    var cooling_demand_kwh = [];
    
    var annual_heating_demand = 0;
    var annual_cooling_demand = 0;

    for (m=0; m<12; m++) 
    {
        // DeltaT (Difference between Internal and External temperature)
        delta_T[m] = this.data.internal_temperature[m] - this.data.external_temperature[m];
        
        // Monthly heat loss totals
        var H = 0; // heat transfer coefficient
        for (z in this.data.losses_WK) H += this.data.losses_WK[z][m];
        total_losses[m] = H * delta_T[m];
        
        // Monthly heat gains total
        var G = 0; 
        for (z in this.data.gains_W) G += this.data.gains_W[z][m];
        total_gains[m] = G;
      
        // Calculate overall utilisation factor for gains
        var HLP = H / this.data.TFA; 
        utilisation_factor[m] = calc_utilisation_factor(this.data.TMP,HLP,H,this.data.internal_temperature[m],this.data.external_temperature[m],total_gains[m]);
        
        // Apply utilisation factor if chosen:
        if (this.data.space_heating.use_utilfactor_forgains) {
            useful_gains[m] = total_gains[m] * utilisation_factor[m];
        } else {
            useful_gains[m] = total_gains[m];
        }
    
        // Space heating demand is simply the difference between the heat loss rate
        // for our target internal temperature and the gains.
        heat_demand[m] = total_losses[m] - useful_gains[m];
        cooling_demand[m] = 0;
        
        // Case of cooling:
        if (heat_demand[m]<0) {
            cooling_demand[m] = useful_gains[m] - total_losses[m];
            heat_demand[m] = 0;
        }
        
        heat_demand_kwh[m] = 0.024 * heat_demand[m] * datasets.table_1a[m];
        cooling_demand_kwh[m] = 0.024 * cooling_demand[m] * datasets.table_1a[m];
        
        annual_heating_demand += heat_demand_kwh[m];
        annual_cooling_demand += cooling_demand_kwh[m];
    }
    
    this.data.space_heating.delta_T = delta_T;
    this.data.space_heating.total_losses = total_losses;
    this.data.space_heating.total_gains = total_gains;
    this.data.space_heating.utilisation_factor = utilisation_factor;
    this.data.space_heating.useful_gains = useful_gains;
    
    this.data.space_heating.heat_demand = heat_demand;
    this.data.space_heating.cooling_demand = cooling_demand;
    this.data.space_heating.heat_demand_kwh = heat_demand_kwh;
    this.data.space_heating.cooling_demand_kwh = cooling_demand_kwh;
    
    this.data.space_heating.annual_heating_demand = annual_heating_demand;
    this.data.space_heating.annual_cooling_demand = annual_cooling_demand;
      
    if (annual_heating_demand>0) this.data.energy_requirements.space_heating = {name: "Space Heating", quantity: annual_heating_demand};
    if (annual_cooling_demand>0) this.data.energy_requirements.space_cooling = {name: "Space Cooling", quantity: annual_cooling_demand};
    
    this.data.fabric_energy_efficiency = (annual_heating_demand + annual_cooling_demand) / this.data.TFA;
    
    
}

//---------------------------------------------------------------------------------------------
// ENERGY SYSTEMS, FUEL COSTS
// Module Inputs: this.data.energy_systems
// Global Inputs: this.data.energy_requirements
// Global Outputs: this.data.fuel_totals, this.data.total_cost
// Datasets: datasets.fuels
//---------------------------------------------------------------------------------------------

calc.energy_systems = function() 
{
    if (this.data.energy_systems == undefined) this.data.energy_systems = {};
    if (this.data.fuels == undefined) this.data.fuels = {};
        
    // Copy dataset over to user data without overwritting user changed properties
    var tmpfuels = JSON.parse(JSON.stringify(datasets.fuels));
    for (fuel in tmpfuels) {
        for (prop in tmpfuels[fuel]) {
            if (this.data.fuels[fuel]!=undefined && this.data.fuels[fuel][prop]!=undefined) tmpfuels[fuel][prop] = this.data.fuels[fuel][prop]
        }
    }
    this.data.fuels = tmpfuels;
    
    this.data.fuel_totals = {};
    
    for (z in this.data.energy_requirements)
    {
        var quantity = this.data.energy_requirements[z].quantity;
        
        if (this.data.energy_systems[z]==undefined) this.data.energy_systems[z] = [];
        
        for (x in this.data.energy_systems[z])
        {
            this.data.energy_systems[z][x].demand = quantity * this.data.energy_systems[z][x].fraction;
            
            this.data.energy_systems[z][x].fuelinput = this.data.energy_systems[z][x].demand / this.data.energy_systems[z][x].efficiency;
            
            var system = this.data.energy_systems[z][x].system;
            var fuel = datasets.energysystems[system].fuel;
            if (this.data.fuel_totals[fuel]==undefined) this.data.fuel_totals[fuel] = {name: fuel, quantity:0};
            this.data.fuel_totals[fuel].quantity += this.data.energy_systems[z][x].fuelinput;
        }
    }
    
    this.data.energy_use = 0;
    this.data.annualco2 = 0;
    for (z in this.data.fuel_totals)
    {   
        this.data.fuel_totals[z].annualcost = this.data.fuel_totals[z].quantity * this.data.fuels[z].fuelcost + this.data.fuels[z].standingcharge*365;
        this.data.fuel_totals[z].fuelcost = this.data.fuels[z].fuelcost;
        this.data.fuel_totals[z].primaryenergy = this.data.fuel_totals[z].quantity * this.data.fuels[z].primaryenergyfactor;
        this.data.fuel_totals[z].annualco2 = this.data.fuel_totals[z].quantity * this.data.fuels[z].co2factor;
        
        this.data.total_cost += this.data.fuel_totals[z].annualcost;
        
        this.data.energy_use += this.data.fuel_totals[z].quantity;
        this.data.primary_energy_use += this.data.fuel_totals[z].primaryenergy;
        this.data.annualco2 += this.data.fuel_totals[z].annualco2;
    }
    
    this.data.net_cost = this.data.total_cost - this.data.total_income;
}

//---------------------------------------------------------------------------------------------
// SAP
// Module Inputs: this.data.SAP.energy_cost_deflator
// Global Inputs: this.data.total_cost
//---------------------------------------------------------------------------------------------

calc.SAP = function() 
{
    this.data.SAP = {};
    
    this.data.SAP.energy_cost_deflator = 0.42;
    
    this.data.SAP.energy_cost_factor = (this.data.total_cost * this.data.SAP.energy_cost_deflator) / (this.data.TFA + 45.0);
    
    if (this.data.SAP.energy_cost_factor >= 3.5) {
        this.data.SAP.rating = 117 - 121 * (Math.log(this.data.SAP.energy_cost_factor) / Math.LN10);
    } else {
        this.data.SAP.rating = 100 - 13.95 * this.data.SAP.energy_cost_factor;
    }
};

calc.LAC = function()
{
    if (this.data.LAC==undefined) this.data.LAC = {};
    if (this.data.LAC.LLE==undefined) this.data.LAC.LLE = 1;
    if (this.data.LAC.L==undefined) this.data.LAC.L = 1;
    if (this.data.LAC.reduced_internal_heat_gains==undefined) this.data.LAC.reduced_internal_heat_gains = false;
    
    // average annual energy consumption for lighting if no low-energy lighting is used is:
    this.data.LAC.EB = 59.73 * Math.pow((this.data.TFA * this.data.occupancy),0.4714);

    if (this.data.LAC.L!=0)
    {
        this.data.LAC.C1 = 1 - (0.50 * this.data.LAC.LLE / this.data.LAC.L);
        this.data.LAC.C2 = 0;
        if (this.data.GL<=0.095) {
          this.data.LAC.C2 = 52.2 * Math.pow(this.data.GL,2) - 9.94 * this.data.GL + 1.433;
        } else {
          this.data.LAC.C2 = 0.96;
        }

        this.data.LAC.EL = this.data.LAC.EB * this.data.LAC.C1 * this.data.LAC.C2;

        var EL_monthly = [];
        var GL_monthly = [];
        
        var EL_sum = 0;
        for (var m=0; m<12; m++) { 
          EL_monthly[m] = this.data.LAC.EL * (1.0 + (0.5 * Math.cos((2*Math.PI * (m - 0.2))/12.0))) * datasets.table_1a[m] / 365.0;
          EL_sum += EL_monthly[m];
          
          GL_monthly[m] = EL_monthly[m] * 0.85 * 1000 / (24 * datasets.table_1a[m]);
          if (this.data.LAC.reduced_internal_heat_gains) GL_monthly[m] = 0.4 * EL_monthly[m];  
        }
        
        if (this.data.use_LAC) {
            this.data.gains_W["Lighting"] = GL_monthly;
            if (EL_sum>0) this.data.energy_requirements.lighting = {name: "Lighting", quantity: EL_sum};
        }
    }

    /*

    Electrical appliances

    */

    // The initial value of the annual energy use in kWh for electrical appliances is
    var EA_initial = 207.8 * Math.pow((this.data.TFA * this.data.occupancy),0.4714);

    var EA_monthly = [];
    var GA_monthly = [];
    var EA = 0; // Re-calculated the annual total as the sum of the monthly values
    for (var m=0; m<12; m++)
    {
      // The appliances energy use in kWh in month m (January = 1 to December = 12) is
      EA_monthly[m] = EA_initial * (1.0 + (0.157 * Math.cos((2*Math.PI * (m - 1.78))/12.0))) * datasets.table_1a[m] / 365.0;
      EA += EA_monthly[m];

      GA_monthly[m] = EA_monthly[m] * 1000 / (24 * datasets.table_1a[m]);
      if (this.data.LAC.reduced_internal_heat_gains) GA_monthly[m] = 0.67 * GA_monthly[m];
    }

    // The annual CO2 emissions in kg/m2/year associated with electrical appliances is
    var appliances_CO2 = (EA * 0.522 ) / this.data.TFA;
    
    if (this.data.use_LAC) {
        this.data.gains_W["Appliances"] = GA_monthly;
        if (EA>0) this.data.energy_requirements.appliances = {name: "Appliances", quantity: EA};
    }
    
    this.data.LAC.EA = EA;

    /*

    Cooking

    */

    // Internal heat gains in watts from cooking
    var GC = 35 + 7 * this.data.occupancy; 
    
    // When lower internal heat gains are assumed for the calculation
    if (this.data.LAC.reduced_internal_heat_gains) GC = 23 + 5 * this.data.occupancy;

    var GC_monthly = [];
    for (var m=0; m<12; m++) GC_monthly[m] = GC;
    
    // CO2 emissions in kg/m2/year associated with cooking
    var cooking_CO2 = (119 + 24 * this.data.occupancy) / this.data.TFA;
    
    this.data.LAC.EC = GC * 0.024 * 365; 
    
    if (this.data.use_LAC) {
        this.data.gains_W["Cooking"] = GC_monthly;
        if (GC>0) this.data.energy_requirements.cooking = {name: "Cooking", quantity: this.data.LAC.EC};
    }
    
    this.data.LAC.GC = this.data.LAC.EC;
};

calc.SHW = function ()
{
    if (this.data.SHW==undefined) this.data.SHW = {};
    /*
    if (this.data.SHW.A==undefined) this.data.SHW.A = 1.25;
    if (this.data.SHW.n0==undefined) this.data.SHW.n0 = 0.599;
    if (this.data.SHW.a1==undefined) this.data.SHW.a1 = 2.772;
    if (this.data.SHW.a2==undefined) this.data.SHW.a2 = 0.009;
    if (this.data.SHW.inclination==undefined) this.data.SHW.inclination = 35;
    if (this.data.SHW.orientation==undefined) this.data.SHW.orientation = 4;
    if (this.data.SHW.overshading==undefined) this.data.SHW.overshading = 1.0;
      */  
    this.data.SHW.a = 0.892 * (this.data.SHW.a1 + 45 * this.data.SHW.a2);
    this.data.SHW.collector_performance_ratio = this.data.SHW.a / this.data.SHW.n0;
    this.data.SHW.annual_solar = annual_solar_rad(this.data.region,this.data.SHW.orientation,this.data.SHW.inclination);   
    this.data.SHW.solar_energy_available = this.data.SHW.A * this.data.SHW.n0 * this.data.SHW.annual_solar * this.data.SHW.overshading;
    
    this.data.SHW.solar_load_ratio = this.data.SHW.solar_energy_available / this.data.water_heating.annual_energy_content;
    
    this.data.SHW.utilisation_factor = 0;
    if (this.data.SHW.solar_load_ratio > 0) this.data.SHW.utilisation_factor = 1 - Math.exp(-1/(this.data.SHW.solar_load_ratio));
    
    this.data.SHW.collector_performance_factor = 0;
    if (this.data.SHW.collector_performance_ratio < 20) {
      this.data.SHW.collector_performance_factor = 0.97 - 0.0367 * this.data.SHW.collector_performance_ratio + 0.0006 * Math.pow(this.data.SHW.collector_performance_ratio,2);
    } else {
      this.data.SHW.collector_performance_factor = 0.693 - 0.0108 * this.data.SHW.collector_performance_ratio;
    }
    if (this.data.SHW.collector_performance_factor<0) this.data.SHW.collector_performance_factor = 0;
    
    this.data.SHW.Veff = 0;
    if (this.data.SHW.combined_cylinder_volume>0) { 
      this.data.SHW.Veff = this.data.SHW.Vs + 0.3 * (this.data.SHW.combined_cylinder_volume - this.data.SHW.Vs);
    } else {
      this.data.SHW.Veff = this.data.SHW.Vs;
    }
    
    this.data.SHW.volume_ratio = this.data.SHW.Veff / this.data.water_heating.Vd_average;
    this.data.SHW.f2 = 1 + 0.2 * Math.log(this.data.SHW.volume_ratio);
    if (this.data.SHW.f2>1) this.data.SHW.f2 = 1;
    this.data.SHW.Qs = this.data.SHW.solar_energy_available * this.data.SHW.utilisation_factor * this.data.SHW.collector_performance_factor * this.data.SHW.f2;
    
    
    // The solar input (in kWh) for month m is 
    
    var sum = 0;
    for (var m=0; m<12; m++) sum += solar_rad(this.data.region,this.data.SHW.orientation,this.data.SHW.inclination,m);
    var annualAverageSolarIrradiance = sum / 12;
    
    this.data.SHW.Qs_monthly = [];
    for (m=0; m<12; m++)
    {
      var fm = solar_rad(this.data.region,this.data.SHW.orientation,this.data.SHW.inclination,m) / annualAverageSolarIrradiance;
      this.data.SHW.Qs_monthly[m] = - this.data.SHW.Qs * fm * datasets.table_1a[m] / 365;
    }
};

calc.water_heating = function()
{
    if (this.data.water_heating==undefined) this.data.water_heating = {};
    if (this.data.water_heating.combi_loss==undefined) this.data.water_heating.combi_loss = [0,0,0,0,0,0,0,0,0,0,0,0];
    if (this.data.water_heating.solar_water_heating==undefined) this.data.water_heating.solar_water_heating = false;
    this.data.water_heating.pipework_insulated_fraction = 1;
    
    
    this.data.water_heating.Vd_average = (25 * this.data.occupancy) + 36;
    if (this.data.water_heating.low_water_use_design) this.data.water_heating.Vd_average *= 0.95;
    
    var Vd_m = [];
    var monthly_energy_content = [];
    var distribution_loss = [0,0,0,0,0,0,0,0,0,0,0,0];
    var energy_lost_from_water_storage = 0;
    var monthly_storage_loss = [0,0,0,0,0,0,0,0,0,0,0,0];
    var primary_circuit_loss = [0,0,0,0,0,0,0,0,0,0,0,0];
    var total_heat_required = [];
    var hot_water_heater_output = [];
    var heat_gains_from_water_heating = [];
    
    this.data.water_heating.annual_energy_content = 0;
    
    for (var m=0; m<12; m++) {
      Vd_m[m] = datasets.table_1c[m] * this.data.water_heating.Vd_average;
      monthly_energy_content[m] = (4.190 * Vd_m[m] * datasets.table_1a[m] * datasets.table_1d[m]) / 3600;
      this.data.water_heating.annual_energy_content += monthly_energy_content[m];
    }
    
    //----------------------------------------------------------------------------------------
    // Only calculate losses for storage and distribution if not instantaneous heating
    if (!this.data.water_heating.instantaneous_hotwater)
    {
      // STORAGE LOSS kWh/d
      if (this.data.water_heating.declared_loss_factor_known) {
        energy_lost_from_water_storage = this.data.water_heating.manufacturer_loss_factor * this.data.water_heating.temperature_factor_a;
      } else {
        energy_lost_from_water_storage = this.data.water_heating.storage_volume * this.data.water_heating.loss_factor_b * this.data.water_heating.volume_factor_b * this.data.water_heating.temperature_factor_b;
      }
      
      for (var m=0; m<12; m++) {
      
        // DISTRIBUTION LOSSES
        distribution_loss[m] = 0.15 * monthly_energy_content[m];
        
        // MONTHLY STORAGE LOSSES
        monthly_storage_loss[m] = datasets.table_1a[m] * energy_lost_from_water_storage;

        if (this.data.water_heating.contains_dedicated_solar_storage_or_WWHRS) {
          monthly_storage_loss[m] = monthly_storage_loss[m] * ((this.data.water_heating.storage_volume-this.data.water_heating.Vs) / (this.data.water_heating.storage_volume));
        }
       
        var hours_per_day = 0;
        
        // PRIMARY CIRCUIT LOSSES
        if (m>=5 && m<=8) {
          hours_per_day = 3;
        } else {
          if (this.data.water_heating.hot_water_control_type == "no_cylinder_thermostat") hours_per_day = 11;
          if (this.data.water_heating.hot_water_control_type == "cylinder_thermostat_without_timer") hours_per_day = 5;
          if (this.data.water_heating.hot_water_control_type == "cylinder_thermostat_with_timer") hours_per_day = 3;
          if (this.data.water_heating.community_heating) hours_per_day = 3;
        }
        
        if (this.data.water_heating.community_heating) this.data.water_heating.pipework_insulated_fraction = 1.0;
        
        primary_circuit_loss[m] = datasets.table_1a[m] * 14 * ((0.0091 * this.data.water_heating.pipework_insulated_fraction + 0.0245 * (1-this.data.water_heating.pipework_insulated_fraction)) * hours_per_day + 0.0263);
        
        if (this.data.water_heating.solar_water_heating) primary_circuit_loss[m] *= datasets.table_h4[m];
   
        total_heat_required[m] = 0.85 * monthly_energy_content[m] + distribution_loss[m] + monthly_storage_loss[m] + primary_circuit_loss[m] + this.data.water_heating.combi_loss[m];
      }
    //----------------------------------------------------------------------------------------
    }
    else
    {
      for (var m=0; m<12; m++) total_heat_required[m] = 0.85 * monthly_energy_content[m];
    }
    
    //----------------------------------------------------------------------------------------
    
    var waterheating_gains = [];
    var annual_waterheating_demand = 0;
    for (var m=0; m<12; m++) {
    
      if (this.data.water_heating.solar_water_heating && this.data.SHW!=undefined && this.data.SHW.Qs_monthly!=undefined) {
        hot_water_heater_output[m] = total_heat_required[m] + this.data.SHW.Qs_monthly[m];
      } else {
        hot_water_heater_output[m] = total_heat_required[m];
      }
      
      if (hot_water_heater_output[m]<0) hot_water_heater_output[m] = 0;
      
      annual_waterheating_demand += hot_water_heater_output[m];
      
      if (this.data.water_heating.hot_water_store_in_dwelling || this.data.water_heating.community_heating) {
        heat_gains_from_water_heating[m] = 0.25 * (0.85*monthly_energy_content[m]+this.data.water_heating.combi_loss[m]) + 0.8*(distribution_loss[m]+monthly_storage_loss[m]+primary_circuit_loss[m]);
      } else {
        heat_gains_from_water_heating[m] = 0.25 * (0.85*monthly_energy_content[m]) + 0.8*(distribution_loss[m]+primary_circuit_loss[m]);
      }
      
      // Table 5 typical gains
      waterheating_gains[m] = (1000 * heat_gains_from_water_heating[m]) / (datasets.table_1a[m] * 24);
    }
    

    /*
    // Combi loss for each month from Table 3a, 3b or 3c (enter “0” if not a combi boiler)
    switch(combi_type)
    {
    case 'instantaneous_no_keephot':
      combi_loss[m] = 600 * fu * table_1a[m] / 365;
      break;
    case 'instantaneous_keephot_timeclock':
      combi_loss[m] = 600 * table_1a[m] / 365;
      break;
    case 'instantaneous_keephot_no_timeclock':
      combi_loss[m] = 900 * table_1a[m] / 365;
      break;
    case '
    }
    */
    
    if (this.data.use_water_heating) {
        this.data.gains_W["waterheating"] = waterheating_gains;
        if (annual_waterheating_demand>0) this.data.energy_requirements.waterheating = {name: "Water Heating", quantity: annual_waterheating_demand};
    }
};

calc.appliancelist = function()
{
    if (this.data.appliancelist==undefined) this.data.appliancelist = {list:[{name: "LED Light", power: 6, hours: 12}]};

    this.data.appliancelist.totalwh = 0;
    this.data.appliancelist.annualkwh = 0;

    for (z in this.data.appliancelist.list) {
        this.data.appliancelist.list[z].energy = this.data.appliancelist.list[z].power * this.data.appliancelist.list[z].hours;
        this.data.appliancelist.totalwh += this.data.appliancelist.list[z].energy;
    }
    
    this.data.appliancelist.annualkwh = this.data.appliancelist.totalwh * 365 * 0.001;
    
    this.data.appliancelist.gains_W = this.data.appliancelist.totalwh / 24.0;
    this.data.appliancelist.gains_W_monthly = [];
    for (var m=0; m<12; m++) this.data.appliancelist.gains_W_monthly[m] = this.data.appliancelist.gains_W;
    
    if (this.data.use_appliancelist) {
        this.data.gains_W["Appliances"] = this.data.appliancelist.gains_W_monthly;
        if (this.data.appliancelist.annualkwh>0) this.data.energy_requirements.appliances = {name: "Appliances", quantity: this.data.appliancelist.annualkwh};
    }
};

calc.generation = function() {

    if (this.data.generation==undefined) this.data.generation = {
        solar_annual_kwh: 0, 
        solar_fraction_used_onsite: 0.5, 
        solar_FIT: 0,
        wind_annual_kwh: 0, 
        wind_fraction_used_onsite: 0.5, 
        wind_FIT: 0,
        hydro_annual_kwh: 0, 
        hydro_fraction_used_onsite: 0.5, 
        hydro_FIT: 0,
        
        solarpv_orientation: 4,
        solarpv_kwp_installed: 0,
        solarpv_inclination: 35,
        solarpv_overshading: 1,
        solarpv_fraction_used_onsite: 0.5,
        solarpv_FIT: 0
    };
    
    var kWp = this.data.generation.solarpv_kwp_installed;
    // 0:North, 1:NE/NW, 2:East/West, 3:SE/SW, 4:South
    var orient = this.data.generation.solarpv_orientation;
    
    var p = this.data.generation.solarpv_inclination;
    var overshading_factor = this.data.generation.solarpv_overshading;

    // annual_solar_radiation 
    // U3.3 in Appendix U for the applicable climate and orientation and tilt of the PV
    // Z PV is the overshading factor from Table H2.
    // p: tilt
    var annual_solar_radiation = annual_solar_rad(this.data.region,orient,p)
    this.data.generation.solarpv_annual_kwh = 0.8 * kWp * annual_solar_radiation * overshading_factor;

    // ----------


    
    this.data.generation.total_energy_income = 0;
    
    if (this.data.use_generation == true)
    {
        if (this.data.generation.solar_annual_kwh>0)
        {
            this.data.energy_requirements.solarpv = {name: "Solar PV", quantity: -this.data.generation.solar_annual_kwh * this.data.generation.solar_fraction_used_onsite};
            this.data.energy_systems.solarpv = [];
            this.data.energy_systems.solarpv[0] = {system: "electric", fraction: 1, efficiency: 1};
            this.data.total_income += this.data.generation.solar_annual_kwh * this.data.generation.solar_FIT;
        }

        if (this.data.generation.wind_annual_kwh>0)
        {
            this.data.energy_requirements.wind = {name: "Wind", quantity: -this.data.generation.wind_annual_kwh * this.data.generation.wind_fraction_used_onsite};
            this.data.energy_systems.wind = [];
            this.data.energy_systems.wind[0] = {system: "electric", fraction: 1, efficiency: 1};
            this.data.total_income += this.data.generation.wind_annual_kwh * this.data.generation.wind_FIT;
        }

        if (this.data.generation.wind_annual_kwh>0)
        {
            this.data.energy_requirements.hydro = {name: "Hydro", quantity: -this.data.generation.hydro_annual_kwh * this.data.generation.hydro_fraction_used_onsite};
            this.data.energy_systems.hydro = [];
            this.data.energy_systems.hydro[0] = {system: "electric", fraction: 1, efficiency: 1};
            this.data.total_income += this.data.generation.hydro_annual_kwh * this.data.generation.hydro_FIT;
        }
        
        if (this.data.generation.solarpv_annual_kwh>0)
        {
            this.data.energy_requirements.solarpv2 = {name: "Solar PV", quantity: -this.data.generation.solarpv_annual_kwh * this.data.generation.solarpv_fraction_used_onsite};
            if (this.data.energy_systems.solarpv2==undefined) {
                this.data.energy_systems.solarpv2 = [{system: "electric", fraction: 1, efficiency: 1}];
            }
            this.data.total_income += this.data.generation.solarpv_annual_kwh * this.data.generation.solarpv_FIT;
        }        
    }
};

calc.currentenergy = function()
{
    if (this.data.currentenergy==undefined) this.data.currentenergy = {
        electric_annual_kwh: 0,
        storageheaters_annual_kwh: 0,
        waterheating_annual_kwh: 0,
        electriccar_annual_kwh: 0,
        heatpump_annual_kwh: 0,
        woodlogs_annual_m3: 0,
        woodpellets_annual_m3: 0,
        oil_annual_L: 0,
        gas_annual_m3: 0,
        LPG_annual_L: 0,
        bottledgas_annual_kg: 0,
        
        electriccar2_annual_miles: 0,
        electriccar2_milesperkwh: 4,
        
        car1_annual_miles: 0,
        car1_mpg: 35,
        
        car2_annual_miles: 0,
        car2_mpg: 35,

        car3_annual_miles: 0,
        car3_mpg: 35,
        
        motorbike_annual_miles: 0,
        motorbike_mpg: 35,
        
        bus_miles: 0,
        train_miles: 0, 
        boat_miles: 0, 
        plane_miles: 0 
    };
    
    var sum = 0;
    
    this.data.currentenergy.electric_kwhd = this.data.currentenergy.electric_annual_kwh / 365.0;
    this.data.currentenergy.electric_co2 = this.data.currentenergy.electric_annual_kwh * 0.02;
    sum += this.data.currentenergy.electric_annual_kwh;
    
    this.data.currentenergy.storageheaters_kwhd = this.data.currentenergy.storageheaters_annual_kwh / 365.0;
    this.data.currentenergy.storageheaters_co2 = this.data.currentenergy.storageheaters_annual_kwh * 0.02;
    sum += this.data.currentenergy.storageheaters_annual_kwh;
    
    this.data.currentenergy.heatpump_kwhd = this.data.currentenergy.heatpump_annual_kwh / 365.0;
    this.data.currentenergy.heatpump_co2 = this.data.currentenergy.heatpump_annual_kwh * 0.02;
    sum += this.data.currentenergy.heatpump_annual_kwh;
    
    this.data.currentenergy.waterheating_kwhd = this.data.currentenergy.waterheating_annual_kwh / 365.0;
    this.data.currentenergy.waterheating_co2 = this.data.currentenergy.waterheating_annual_kwh * 0.02;
    sum += this.data.currentenergy.waterheating_annual_kwh;
    
    this.data.currentenergy.electriccar_kwhd = this.data.currentenergy.electriccar_annual_kwh / 365.0;
    this.data.currentenergy.electriccar_co2 = this.data.currentenergy.electriccar_annual_kwh * 0.02;
    
    // ------    

    this.data.currentenergy.woodlogs_kwhd = (this.data.currentenergy.woodlogs_annual_m3 * 1380) / 365.0;
    this.data.currentenergy.woodlogs_co2 = 0;
    sum += (this.data.currentenergy.woodlogs_annual_m3 * 1380);
    
    this.data.currentenergy.woodpellets_kwhd = (this.data.currentenergy.woodpellets_annual_m3 * 4800) / 365.0;
    this.data.currentenergy.woodpellets_co2 = 0;
    sum += (this.data.currentenergy.woodpellets_annual_m3 * 4800);
    
    this.data.currentenergy.oil_kwhd = (this.data.currentenergy.oil_annual_L * 10.27) / 365.0;
    this.data.currentenergy.oil_co2 = (this.data.currentenergy.oil_annual_L * 2.518);
    sum += this.data.currentenergy.oil_annual_L * 10.27;
    
    this.data.currentenergy.gas_kwhd = (this.data.currentenergy.gas_annual_m3 * 9.8) / 365.0;
    this.data.currentenergy.gas_co2 = (this.data.currentenergy.gas_annual_m3 * 2.198);
    sum += this.data.currentenergy.gas_annual_m3 * 9.8;
    
    this.data.currentenergy.LPG_kwhd = (this.data.currentenergy.LPG_annual_L * 11.0) / 365.0;
    this.data.currentenergy.LPG_co2 = (this.data.currentenergy.LPG_annual_L * 1.5);
    sum += this.data.currentenergy.LPG_annual_L * 11.0;
    
    this.data.currentenergy.bottledgas_kwhd = (this.data.currentenergy.bottledgas_annual_kg * 13.9) / 365.0;
    this.data.currentenergy.bottledgas_co2 = (this.data.currentenergy.bottledgas_annual_kg * 1.5);
    sum += this.data.currentenergy.bottledgas_annual_kg * 13.9;
    
    // ------
    
    this.data.currentenergy.electriccar2_kwhd = (this.data.currentenergy.electriccar2_annual_miles/this.data.currentenergy.electriccar2_milesperkwh) / 365.0;
    this.data.currentenergy.electriccar2_co2 = (this.data.currentenergy.electriccar2_annual_miles/this.data.currentenergy.electriccar2_milesperkwh) * 0.02;


    this.data.currentenergy.car1_kwhd = ((this.data.currentenergy.car1_annual_miles/this.data.currentenergy.car1_mpg)*4.54609*9.7) / 365.0;
    this.data.currentenergy.car1_co2 = ((this.data.currentenergy.car1_annual_miles/this.data.currentenergy.car1_mpg)*4.54609) * 2.31;
    
    this.data.currentenergy.car2_kwhd = ((this.data.currentenergy.car2_annual_miles/this.data.currentenergy.car2_mpg)*4.54609*9.7) / 365.0;
    this.data.currentenergy.car2_co2 = ((this.data.currentenergy.car2_annual_miles/this.data.currentenergy.car2_mpg)*4.54609) * 2.31; 
    
    this.data.currentenergy.car3_kwhd = ((this.data.currentenergy.car3_annual_miles/this.data.currentenergy.car3_mpg)*4.54609*9.7) / 365.0;
    this.data.currentenergy.car3_co2 = ((this.data.currentenergy.car3_annual_miles/this.data.currentenergy.car3_mpg)*4.54609) * 2.31;

    this.data.currentenergy.motorbike_kwhd = ((this.data.currentenergy.motorbike_annual_miles/this.data.currentenergy.motorbike_mpg)*4.54609*9.7) / 365.0;
    this.data.currentenergy.motorbike_co2 = ((this.data.currentenergy.motorbike_annual_miles/this.data.currentenergy.motorbike_mpg)*4.54609) * 2.31;   
    
    // -------
    
    this.data.currentenergy.bus_kwhd = (this.data.currentenergy.bus_miles * 0.53)/365.0;
    this.data.currentenergy.bus_co2 = this.data.currentenergy.bus_miles * 0.176;
    
    this.data.currentenergy.train_kwhd = (this.data.currentenergy.train_miles * 0.096)/365.0;
    this.data.currentenergy.train_co2 = this.data.currentenergy.train_miles * 0.096;
    
    this.data.currentenergy.boat_kwhd = (this.data.currentenergy.boat_miles * 1.0)/365.0;
    this.data.currentenergy.boat_co2 = this.data.currentenergy.boat_miles * 0.192;
    
    this.data.currentenergy.plane_kwhd = (this.data.currentenergy.plane_miles * 0.69)/365.0;
    this.data.currentenergy.plane_co2 = this.data.currentenergy.plane_miles * 0.43;
    // RFI = 3 0.43 kg per mile
    
    this.data.primary_energy_use_bills = sum;
    
    

};



//---------------------------------------------------------------------------------------------
// SEPERATED MODEL FUNCTIONS
//---------------------------------------------------------------------------------------------

// U3.2 Solar radiation on vertical and inclined surfaces
function solar_rad(region,orient,p,m)
{
  var k = datasets.k;
  // convert degrees into radians
  var radians = (p/360.0)*2.0*Math.PI;
 
  var sinp = Math.sin(radians);
  var sin2p = sinp * sinp;
  var sin3p = sinp * sinp * sinp;

  var A = k[1][orient] * sin3p + k[2][orient] * sin2p + k[3][orient] * sinp;
  var B = k[4][orient] * sin3p + k[5][orient] * sin2p + k[6][orient] * sinp;
  var C = k[7][orient] * sin3p + k[8][orient] * sin2p + k[9][orient] * sinp + 1;

  var latitude = (datasets.table_u4[region]/360)*2*Math.PI; // get latitude in degrees and convert to radians
  var sol_dec = (datasets.solar_declination[m]/360)*2*Math.PI; // get solar_declination in degrees and convert to radians
  var cos1 = Math.cos(latitude - sol_dec);
  var cos2 = cos1 * cos1;

  // Rh-inc(orient, p, m) = A × cos2(φ - δ) + B × cos(φ - δ) + C
  var Rh_inc = A * cos2 + B * cos1 + C;

  return datasets.table_u3[region][m] * Rh_inc;
}

// Annual solar radiation on a surface
function annual_solar_rad(region,orient,p)
{
  // month 0 is january, 11: december
  var sum = 0;
  for (var m=0; m<12; m++)
  {
    sum += datasets.table_1a[m] * solar_rad(region,orient,p,m);
  }
  return 0.024 * sum;
}


function calc_solar_gains_from_windows(windows,region)
{
        var gains = [0,0,0,0,0,0,0,0,0,0,0,0];

        for (z in windows)
        {
          var orientation = windows[z]['orientation'];
          var area = windows[z]['area'];
          var overshading = windows[z]['overshading'];
          var g = windows[z]['g'];
          var ff = windows[z]['ff'];

          // The gains for a given window are calculated for each month
          // the result of which needs to be put in a bin for totals for jan, feb etc..
          for (var month=0; month<12; month++)
          {
            // Access factor table: first dimention is shading factor, 2nd in winter, summer.
            var table_6d = [[0.3,0.5],[0.54,0.7],[0.77,0.9],[1.0,1.0]];
         
            // access factor is time of year dependent
            // Summer months: 5:June, 6:July, 7:August and 8:September (where jan = month 0)
            var summer = 0; if (month>=5 && month<=8) summer = 1;
            var access_factor = table_6d[overshading][summer];

            // Map orientation code from window to solar rad orientation codes.
            if (orientation == 5) orientation = 3; // SE/SW
            if (orientation == 6) orientation = 2; // East/West
            if (orientation == 7) orientation = 1; // NE/NW

            gains[month] += access_factor * area * solar_rad(region,orientation,90,month) * 0.9 * g * ff;
          }
        }
  return gains;
}

// Calculation of mean internal temperature for heating
// Calculation of mean internal temperature is based on the heating patterns defined in Table 9.

function calc_utilisation_factor(TMP,HLP,H,Ti,Te,G)
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
  y = Math.round(y*100000000.0) / 100000000.0;

  var n = 0.0;
  if (y>0.0 && y!=1.0) n = (1.0 - Math.pow(y,a)) / (1.0 - Math.pow(y,a+1.0));
  if (y == 1.0) n = a / (a + 1.0);

  if (isNaN(n)) n = 0;
  return n;
}

function calc_temperature_reduction(TMP,HLP,H,Ti,Te,G, R,Th,toff)
{
  // Calculation of utilisation factor
  var tau = TMP / (3.6 * HLP);
  var a = 1.0 + tau / 15.0;
  var L = H * (Ti - Te);
  var y = G / L;

  // Note: to avoid instability when γ is close to 1 round γ to 8 decimal places
  // y = y.toFixed(8);
  y = Math.round(y*100000000.0) / 100000000.0;
  var n = 0.0;
  if (y>0.0 && y!=1.0) n = (1.0 - Math.pow(y,a)) / (1.0 - Math.pow(y,a+1.0));
  if (y == 1.0) n = a / (a + 1.0);

  var tc = 4.0 + 0.25 * tau;

  var Tsc = (1.0 - R) * (Th - 2.0) + R * (Te + n * G / H);

  var u;
  if (toff <= tc) u = 0.5 * toff * toff * (Th - Tsc) / (24 * tc);
  if (toff > tc) u = (Th - Tsc) * (toff - 0.5 * tc) / 24;


  if (isNaN(u)) u = 0;
  return u;
}


