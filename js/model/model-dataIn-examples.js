var dataIn_model_r9 = {
    altituda: 10,
    region: 7,
    floors: [
        {height: 1, area: 1}
    ],
    use_custom_occupancy: false, // when set to false occupancy is calculated according to SAP
    custom_occupancy: 1,
    fabric: {
        elements: [
            {
                type: 'wall', // Wall, Floor, Roof, Loft, Roof_light, Hatch, Party_wall
                area: 1, // used if no l or h
                //l:1, 
                //h:1
                uvalue: 1,
                kvalue: 1,
                g: 0, // Windows, doors, doors and roof lights
                gl: 0, // Windows, doors, doors and roof lights
                ff: 0, // Windows, doors, doors and roof lights
                orientation: 4, // Windows, doors, doors and roof lights -> N = 0 __ SE/SW = 3||5 __ E/W = 6||2 __ NE/NW = 1||7 __ S = 4
                overshading: 3, // Windows, doors, doors and roof lights  ->  >80% = 0 __ 60%-80% = 1 __ 20%/60% = 2 __ <20% = 3
            }
        ],
        thermal_bridging_yvalue: 0.15,
        global_TMP: false,
        global_TMP_value: 100 // Low = 100, Medium = 250, High = 450
    },
    ventilation: {
        ventilation_type: 'IE', // NV, IE, DEV, MEV, MV, MVHR, PS
        dwelling_construction: 'timberframe', // 'masonry' || 'timberframe' || 
        suspended_wooden_floor: 'unsealed', // 'unsealed' || 'sealed' || 'solid'
        draught_lobby: false,
        percentage_draught_proofed: 100, // windows
        air_permeability_test: false, // when true: infiltration rate calculated from test (air_permeability_value), when false: infiltration rate calculated from building characteristics (dwelling_construction, suspended_wooden_floor, draught_lobby and percentage_draught_proofed)
        air_permeability_value: 15, // q50, cubic meters per hour per square meter of envelope area
        number_of_sides_sheltered: 1,
        system_air_change_rate: 0.5,
        system_specific_fan_power: 3, // for MVHR
        balanced_heat_recovery_efficiency: 50, // for MVHR
        IVF: [//Intentional vents and flues (IVF: Chimneys, open flues and flueless gas fires)
            {
                type: "Intermittent fan", // not used in the model but handy to have
                ventilation_rate: 10,
            }
        ],
        EVP: [//Extract ventilation points
            {
                type: 'Chimney', // not used in the model but handy to have
                ventilation_rate: 80,
            }
        ]
    },
    temperature: {
        target: 21,
        living_area: 20,
        hours_off: {weekday: [7, 8], weekend: [8]}
    },
    heating_systems: [// the lines with "//" are the ones that I haven't found as inputs yet so they may not be needed as inputs
        {
            "category": "Warm air systems", //
            "winter_efficiency": 90,
            "summer_efficiency": 80,
            "central_heating_pump": 120, //
            "central_heating_pump_inside": false,
            "fans_and_supply_pumps": null, //
            "responsiveness": 1, // Refer to Table 4d, p.209 SAP 9.92
            "combi_loss": "Instantaneous, without keep hot-facility", // Instantaneous, without keep hot-facility || Instantaneous, with keep-hot facility controlled by time clock || Instantaneous, with keep-hot facility not controlled by time clock || Storage combi boiler >= 55 litres || Storage combi boiler < 55 litres
            "primary_circuit_loss": "No", // yes || No
            "fuel": "Mains Gas", //
            "fraction_space": 1,
            "fraction_water_heating": 1,
            "main_space_heating_system": "mainHS1", // mainHS1 || mainHS2_whole_house || mainHS2_part_of_the_house
            "temperature_adjustment": 0, // Refer to SAP2012, table 4e, p.210
            "provides": "heating_and_water", // heating || water || heating_and_water
            "instantaneous_water_heating": false, //
            "heating_controls": 1, // 1|| 2 || 3  -  Refer to Table 4e, p.210 SAP 9.92
            "efficiency": 0.85 //
        }
    ],
    space_heating: {
        "use_utilfactor_forgains": true,
        "heating_off_summer": true
    },
    use_generation: true,
    generation: {
        use_PV_calculator: true, // when set to true, solar_annual_kwh is calculated Using the PV calculator
        solar_annual_kwh: 0,
        solar_fraction_used_onsite: 0,
        solar_FIT: 0,
        solar_export_FIT: 0,
        wind_annual_kwh: 0,
        wind_fraction_used_onsite: 0,
        wind_FIT: 0,
        wind_export_FIT: 0,
        hydro_annual_kwh: 0,
        hydro_fraction_used_onsite: 0,
        hydro_FIT: 0,
        hydro_export_FIT: 0,
        solarpv_orientation: 4, // PV calculator: 0 (N) || 1 (NE/NW) || 2 (E/W) || 3 (SE/SW) || 4 (S)
        solarpv_kwp_installed: 3, // PV calculator
        solarpv_inclination: 35, // PV calculator, degrees
        solarpv_overshading: 1 // PV calculator: 0.5 (heavy > 80%) || 0.65 (Significant 60% - 80%) || 0.8 (Modest 20% - 60%) || 1 (None or very little, less than 20%)
    },
    LAC_calculation_type: 'SAP', // SAP || carboncoop_SAPlighting || detailedlist
    LAC: {
        L: 10, // The total number of fixed lighting outlets
        LLE: 8, // The number of fixed low energy lighting outlets
        reduced_heat_gains_lighting: true,
        energy_efficient_appliances: true,
        energy_efficient_cooking: true
    },
    applianceCarbonCoop: {
        list: [// The annual demand of an item is: "frequency x norm_demand x frequency x utilisation_factor x  reference_quantity"
            {
                a_plus_rated: false,
                category: "appliances", // appliances || cooking
                efficiency: "1",
                frequency: "555",
                fuel: "Standard Tariff",
                name: "Small Consumer Electronics",
                norm_demand: "0.8",
                number_used: 1,
                reference_quantity: "3",
                type_of_fuel: "Electricity",
                units: "kW",
                utilisation_factor: "1"
            }
        ]
    },
    appliancelist: {
        list: [
            {
                name: "LED Light",
                power: 6,
                hours: 12,
                category: 'lighting',
                fuel: 'Standard Tariff',
                efficiency: 1
            }
        ]
    },
    use_SHW: false, // if set to true Solar Hot Water is included in the calculations
    SHW: {
        a1: 3.7, // Collector linear heat loss coefficient, a1, from test certificate
        a2: 0.01, // Collector 2nd order heat loss coefficient, a2, from test certificate
        n0: 0.78, // Zero-loss collector efficiency, η0, from test certificate or Table H1
        orientation: 0, // 0 (N) || 1 (NE/NW)  || 2 (E/W)  || 3 (SE/SW)  ||4 (S) 
        inclination: 45,
        A: 8, // Aperture area of solar collector, m2
        combined_cylinder_volume: 0, // In litres
        Vs: 300, //Dedicated solar storage volume, Vs, (litres)
        volume_ratio: 0.5	// Volume ratio Veff/Vd,avera
    },
    water_heating: {
        low_water_use_design: false, //
        override_annual_energy_content: false, // true || false
        annual_energy_content: 0, // input to the module when override_annual_energy_content is set to true
        hot_water_control_type: 'no_cylinder_thermostat', // no_cylinder_thermostat || Cylinder thermostat, water heating not separately timed || Cylinder thermostat, water heating separately timed
        pipework_insulation: 'Uninsulated primary pipework', // Uninsulated primary pipework || First 1m from cylinder insulated || All accesible piperwok insulated || Fully insulated primary pipework
        contains_dedicated_solar_storage_or_WWHRS: 0, // Volume in litres
        solar_water_heating: false, // true || false
        hot_water_store_in_dwelling: true, // 	true || false
        community_heating: false, //	true || false
        storage_type: {// if undefined, it means there is no storage
            name: "Cylinder with electric immersion, up to 130 litres, 80mm loose fit jacket (DIY)",
            category: 'Cylinders with inmersion',
            manufacturer_loss_factor: 0,
            temperature_factor_a: 0,
            storage_volume: 110,
            loss_factor_b: 0.024,
            volume_factor_b: 1.063,
            temperature_factor_b: 0.6,
            declared_loss_factor_known: false,
        }
    },
    currentenergy: {
        use_by_fuel: {
            'Mains Gas': {// needs to be in data.fuels
                annual_use: 18000
            }
        },
        onsite_generation: true, // true || false
        generation: {
            annual_generation: 1500,
            fraction_used_onsite: 0.25,
            annual_FIT_income: 0
        }
    }
}