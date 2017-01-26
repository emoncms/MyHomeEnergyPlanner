
var datasets = {
    fuels: {
        // standing charge in £, unit cost in p/kWh
        // For electricity co2factor and primaryenergyfactor: http://www.bre.co.uk/filelibrary/SAP/2012/Emission-and-primary-factors-2013-2027.pdf
        // For other fuel's  co2factor and primaryenergyfactor: https://www.bre.co.uk/filelibrary/SAP/2016/CONSP-07---CO2-and-PE-factors---V1_0.pdf
        // Cost: https://github.com/emoncms/MyHomeEnergyPlanner/files/706014/BRE.SAP-fuel-prices-July-2015-summary.xls.pdf
        'Mains Gas': {category: 'Gas', standingcharge: 101, fuelcost: 4.25, co2factor: 0.222, primaryenergyfactor: 1.28, SAP_code: 1},
        'Bulk LPG': {category: 'Gas', standingcharge: 70, fuelcost: 8.46, co2factor: 0.242, primaryenergyfactor: 1.166, SAP_code: 2},
        'Bottled LPG ': {category: 'Gas', standingcharge: 0, fuelcost: 10.61, co2factor: 0.242, primaryenergyfactor: 1.166, SAP_code: 3},
        'Heating Oil': {category: 'Oil', standingcharge: 0, fuelcost: 5.43, co2factor: 0.298, primaryenergyfactor: 1.189, SAP_code: 4},
        'House Coal': {category: 'Solid fuel', standingcharge: 0, fuelcost: 4.01, co2factor: 0.416, primaryenergyfactor: 1.079, SAP_code: 11},
        'Anthracite': {category: 'Solid fuel', standingcharge: 0, fuelcost: 4.02, co2factor: 0.416, primaryenergyfactor: 1.079, SAP_code: 15},
        'Manufactured smokeless fuel': {category: 'Solid fuel', standingcharge: 0, fuelcost: 5.04, co2factor: 0.490, primaryenergyfactor: 1.265, SAP_code: 12},
        'Wood Logs': {category: 'Solid fuel', standingcharge: 0, fuelcost: 4.65, co2factor: 0.026, primaryenergyfactor: 1.058, SAP_code: 20},
        'Wood Pellets (secondary heating/ in bags)': {category: 'Solid fuel', standingcharge: 0, fuelcost: 6.3, co2factor: 0.045, primaryenergyfactor: 1.32, SAP_code: 22},
        'Wood pellets (main heating/ bulk supply)': {category: 'Solid fuel', standingcharge: 0, fuelcost: 5.7, co2factor: 0.045, primaryenergyfactor: 1.32, SAP_code: 23},
        'Wood chips': {category: 'Solid fuel', standingcharge: 0, fuelcost: 3.36, co2factor: 0.030, primaryenergyfactor: 1.174, SAP_code: 21},
        'Dual Fuel Appliance': {category: 'Solid fuel', standingcharge: 0, fuelcost: 4.36, co2factor: 0.108, primaryenergyfactor: 1.062, SAP_code: 10},
        'Standard Tariff': {category: 'Electricity', standingcharge: 66, fuelcost: 15.06, co2factor: 0.381, primaryenergyfactor: 3.28, SAP_code: 30},
        '7-Hour tariff - High Rate': {category: 'Electricity', standingcharge: 13, fuelcost: 17.81, co2factor: 0.381, primaryenergyfactor: 3.28, SAP_code: 32},
        '7 Hour tariff - Low Rate': {category: 'Electricity', standingcharge: 0, fuelcost: 6.67, co2factor: 0.381, primaryenergyfactor: 3.28, SAP_code: 31},
        '10-hour tariff - High Rate': {category: 'Electricity', standingcharge: 12, fuelcost: 17.1, co2factor: 0.381, primaryenergyfactor: 3.28, SAP_code: 34},
        '10-hour tariff - Low Rate': {category: 'Electricity', standingcharge: 0, fuelcost: 9.25, co2factor: 0.381, primaryenergyfactor: 3.28, SAP_code: 33},
        '24-hour heating tariff': {category: 'Electricity', standingcharge: 40, fuelcost: 7.75, co2factor: 0.381, primaryenergyfactor: 3.28, SAP_code: 35},
        'generation': {category: 'generation', standingcharge: 0, fuelcost: 15.06, co2factor: 0.381, primaryenergyfactor: 3.28, SAP_code: 0}
    },
    regions: [
        "UK average",
        "Thames",
        "South East England",
        "Southern England",
        "South West England",
        "Severn Wales / Severn England",
        "Midlands",
        "West Pennines Wales / West Pennines England.",
        "North West England / South West Scotland",
        "Borders Scotland / Borders England",
        "North East England",
        "East Pennines",
        "East Anglia",
        "Wales",
        "West Scotland",
        "East Scotland",
        "North East Scotland",
        "Highland",
        "Western Isles",
        "Orkney",
        "Shetland",
        "Northern Ireland"
    ],
    table_u1: [
        [4.3, 4.9, 6.5, 8.9, 11.7, 14.6, 16.6, 16.4, 14.1, 10.6, 7.1, 4.2],
        [5.1, 5.6, 7.4, 9.9, 13.0, 16.0, 17.9, 17.8, 15.2, 11.6, 8.0, 5.1],
        [5.0, 5.4, 7.1, 9.5, 12.6, 15.4, 17.4, 17.5, 15.0, 11.7, 8.1, 5.2],
        [5.4, 5.7, 7.3, 9.6, 12.6, 15.4, 17.3, 17.3, 15.0, 11.8, 8.4, 5.5],
        [6.1, 6.4, 7.5, 9.3, 11.9, 14.5, 16.2, 16.3, 14.6, 11.8, 9.0, 6.4],
        [4.9, 5.3, 7.0, 9.3, 12.2, 15.0, 16.7, 16.7, 14.4, 11.1, 7.8, 4.9],
        [4.3, 4.8, 6.6, 9.0, 11.8, 14.8, 16.6, 16.5, 14.0, 10.5, 7.1, 4.2],
        [4.7, 5.2, 6.7, 9.1, 12.0, 14.7, 16.4, 16.3, 14.1, 10.7, 7.5, 4.6],
        [3.9, 4.3, 5.6, 7.9, 10.7, 13.2, 14.9, 14.8, 12.8, 9.7, 6.6, 3.7],
        [4.0, 4.5, 5.8, 7.9, 10.4, 13.3, 15.2, 15.1, 13.1, 9.7, 6.6, 3.7],
        [4.0, 4.6, 6.1, 8.3, 10.9, 13.8, 15.8, 15.6, 13.5, 10.1, 6.7, 3.8],
        [4.3, 4.9, 6.5, 8.9, 11.7, 14.6, 16.6, 16.4, 14.1, 10.6, 7.1, 4.2],
        [4.7, 5.2, 7.0, 9.5, 12.5, 15.4, 17.6, 17.6, 15.0, 11.4, 7.7, 4.7],
        [5.0, 5.3, 6.5, 8.5, 11.2, 13.7, 15.3, 15.3, 13.5, 10.7, 7.8, 5.2],
        [4.0, 4.4, 5.6, 7.9, 10.4, 13.0, 14.5, 14.4, 12.5, 9.3, 6.5, 3.8],
        [3.6, 4.0, 5.4, 7.7, 10.1, 12.9, 14.6, 14.5, 12.5, 9.2, 6.1, 3.2],
        [3.3, 3.6, 5.0, 7.1, 9.3, 12.2, 14.0, 13.9, 12.0, 8.8, 5.7, 2.9],
        [3.1, 3.2, 4.4, 6.6, 8.9, 11.4, 13.2, 13.1, 11.3, 8.2, 5.4, 2.7],
        [5.2, 5.0, 5.8, 7.6, 9.7, 11.8, 13.4, 13.6, 12.1, 9.6, 7.3, 5.2],
        [4.4, 4.2, 5.0, 7.0, 8.9, 11.2, 13.1, 13.2, 11.7, 9.1, 6.6, 4.3],
        [4.6, 4.1, 4.7, 6.5, 8.3, 10.5, 12.4, 12.8, 11.4, 8.8, 6.5, 4.6],
        [4.8, 5.2, 6.4, 8.4, 10.9, 13.5, 15.0, 14.9, 13.1, 10.0, 7.2, 4.7]
    ],
    // Table U2: Wind speed (m/s) for calculation of infiltration rate
    table_u2: [
        [5.1, 5.0, 4.9, 4.4, 4.3, 3.8, 3.8, 3.7, 4.0, 4.3, 4.5, 4.7],
        [4.2, 4.0, 4.0, 3.7, 3.7, 3.3, 3.4, 3.2, 3.3, 3.5, 3.5, 3.8],
        [4.8, 4.5, 4.4, 3.9, 3.9, 3.6, 3.7, 3.5, 3.7, 4.0, 4.1, 4.4],
        [5.1, 4.7, 4.6, 4.3, 4.3, 4.0, 4.0, 3.9, 4.0, 4.5, 4.4, 4.7],
        [6.0, 5.6, 5.6, 5.0, 5.0, 4.4, 4.4, 4.3, 4.7, 5.4, 5.5, 5.9],
        [4.9, 4.6, 4.7, 4.3, 4.3, 3.8, 3.8, 3.7, 3.8, 4.3, 4.3, 4.6],
        [4.5, 4.5, 4.4, 3.9, 3.8, 3.4, 3.3, 3.3, 3.5, 3.8, 3.9, 4.1],
        [4.8, 4.7, 4.6, 4.2, 4.1, 3.7, 3.7, 3.7, 3.7, 4.2, 4.3, 4.5],
        [5.2, 5.2, 5.0, 4.4, 4.3, 3.9, 3.7, 3.7, 4.1, 4.6, 4.8, 4.7],
        [5.2, 5.2, 5.0, 4.4, 4.1, 3.8, 3.5, 3.5, 3.9, 4.2, 4.6, 4.7],
        [5.3, 5.2, 5.0, 4.3, 4.2, 3.9, 3.6, 3.6, 4.1, 4.3, 4.6, 4.8],
        [5.1, 5.0, 4.9, 4.4, 4.3, 3.8, 3.8, 3.7, 4.0, 4.3, 4.5, 4.7],
        [4.9, 4.8, 4.7, 4.2, 4.2, 3.7, 3.8, 3.8, 4.0, 4.2, 4.3, 4.5],
        [6.5, 6.2, 5.9, 5.2, 5.1, 4.7, 4.5, 4.5, 5.0, 5.7, 6.0, 6.0],
        [6.2, 6.2, 5.9, 5.2, 4.9, 4.7, 4.3, 4.3, 4.9, 5.4, 5.7, 5.4],
        [5.7, 5.8, 5.7, 5.0, 4.8, 4.6, 4.1, 4.1, 4.7, 5.0, 5.2, 5.0],
        [5.7, 5.8, 5.7, 5.0, 4.6, 4.4, 4.0, 4.1, 4.6, 5.2, 5.3, 5.1],
        [6.5, 6.8, 6.4, 5.7, 5.1, 5.1, 4.6, 4.5, 5.3, 5.8, 6.1, 5.7],
        [8.3, 8.4, 7.9, 6.6, 6.1, 6.1, 5.6, 5.6, 6.3, 7.3, 7.7, 7.5],
        [7.9, 8.3, 7.9, 7.1, 6.2, 6.1, 5.5, 5.6, 6.4, 7.3, 7.8, 7.3],
        [9.5, 9.4, 8.7, 7.5, 6.6, 6.4, 5.7, 6.0, 7.2, 8.5, 8.9, 8.5],
        [5.4, 5.3, 5.0, 4.7, 4.5, 4.1, 3.9, 3.7, 4.2, 4.6, 5.0, 5.0]
    ],
    // Table U3: Mean global solar irradiance (W/m2) on a horizontal plane, and solar declination
    // Row corresponds to region id in SAP specification 0:UK average etc..
    // 2nd dimention row index corresponds to month
    table_u3: [
        [26, 54, 96, 150, 192, 200, 189, 157, 115, 66, 33, 21],
        [30, 56, 98, 157, 195, 217, 203, 173, 127, 73, 39, 24],
        [32, 59, 104, 170, 208, 231, 216, 182, 133, 77, 41, 25],
        [35, 62, 109, 172, 209, 235, 217, 185, 138, 80, 44, 27],
        [36, 63, 111, 174, 210, 233, 204, 182, 136, 78, 44, 28],
        [32, 59, 105, 167, 201, 226, 206, 175, 130, 74, 40, 25],
        [28, 55, 97, 153, 191, 208, 194, 163, 121, 69, 35, 23],
        [24, 51, 95, 152, 191, 203, 186, 152, 115, 65, 31, 20],
        [23, 51, 95, 157, 200, 203, 194, 156, 113, 62, 30, 19],
        [23, 50, 92, 151, 200, 196, 187, 153, 111, 61, 30, 18],
        [25, 51, 95, 152, 196, 198, 190, 156, 115, 64, 32, 20],
        [26, 54, 96, 150, 192, 200, 189, 157, 115, 66, 33, 21],
        [30, 58, 101, 165, 203, 220, 206, 173, 128, 74, 39, 24],
        [29, 57, 104, 164, 205, 220, 199, 167, 120, 68, 35, 22],
        [19, 46, 88, 148, 196, 193, 185, 150, 101, 55, 25, 15],
        [21, 46, 89, 146, 198, 191, 183, 150, 106, 57, 27, 15],
        [19, 45, 89, 143, 194, 188, 177, 144, 101, 54, 25, 14],
        [17, 43, 85, 145, 189, 185, 170, 139, 98, 51, 22, 12],
        [16, 41, 87, 155, 205, 206, 185, 148, 101, 51, 21, 11],
        [14, 39, 84, 143, 205, 201, 178, 145, 100, 50, 19, 9],
        [12, 34, 79, 135, 196, 190, 168, 144, 90, 46, 16, 7],
        [24, 52, 96, 155, 201, 198, 183, 150, 107, 61, 30, 18]
    ],
    // Index corresponds to month
    solar_declination: [-20.7, -12.8, -1.8, 9.8, 18.8, 23.1, 21.2, 13.7, 2.9, -8.7, -18.4, -23.0],
    // Table U4: Representative latitude
    // Index corresponds to region id in SAP specification 0:UK average etc..
    table_u4: [
        [53.5, 79],
        [51.6, 53],
        [51.1, 55],
        [50.9, 50],
        [50.5, 85],
        [51.5, 99],
        [52.6, 116],
        [53.5, 71],
        [54.6, 119],
        [55.2, 101],
        [54.4, 78],
        [53.5, 79],
        [52.1, 29],
        [52.6, 138],
        [55.9, 113],
        [56.2, 117],
        [57.3, 123],
        [57.5, 218],
        [57.7, 59],
        [59.0, 53],
        [60.1, 50],
        [54.6, 72]
    ],
    // Table U5: Constants for calculation of solar flux on vertical and inclined surfaces
    // 2nd dimention index: 0:North 1:NE/NW 2:East/West 3:SE/SW 4:South
    /*
     k: {
     1: [0.056, -2.85, -0.241, 0.839, 2.35],
     2: [-5.79, 2.89, -0.024, -0.604, -2.97],
     3: [6.23, 0.298, 0.351, 0.989, 2.4],
     4: [3.32, 4.52, 0.604, -0.554, -3.04],
     5: [-0.159, -6.28, -0.494, 0.251, 3.88],
     6: [-3.74, 1.47, -0.502, -2.49, -4.97],
     7: [-2.7, -2.58, -1.79, -2.0, -1.31],
     8: [3.45, 3.96, 2.06, 2.28, 1.27],
     9: [-1.21, -1.88, -0.405, 0.807, 1.83]
     },*/

    // Angles may need to be converted to radians depending on the software implementation of the sine and cosine functions
    k: {
        1: [26.3, 0.165, 1.44, -2.95, -0.66],
        2: [-38.5, -3.68, -2.36, 2.89, -0.106],
        3: [14.8, 3.0, 1.07, 1.17, 2.93],
        4: [-16.5, 6.38, -0.514, 5.67, 3.63],
        5: [27.3, -4.53, 1.89, -3.54, -0.374],
        6: [-11.9, -0.405, -1.64, -4.28, -7.4],
        7: [-1.06, -4.38, -0.542, -2.72, -2.71],
        8: [0.0872, 4.89, -0.757, -0.25, -0.991],
        9: [-0.191, -1.99, 0.604, 3.07, 4.59]
    },
    table_1a: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    table_1c: [1.1, 1.06, 1.02, 0.98, 0.94, 0.90, 0.90, 0.94, 0.98, 1.02, 1.06, 1.10],
    // Table 1d: Temperature rise of hot water drawn off (∆Tm, in K)
    table_1d: [41.2, 41.4, 40.1, 37.6, 36.4, 33.9, 30.4, 33.4, 33.5, 36.3, 39.4, 39.9],
    // Primary circuit loss factors with solar heating 
    table_h4: [1.0, 1.0, 0.94, 0.70, 0.45, 0.44, 0.44, 0.48, 0.76, 0.94, 1.0, 1.0],
    ratings: [
        {start: 92, end: 100, letter: 'A', color: "#009a44"},
        {start: 81, end: 91, letter: 'B', color: "#2dca73"},
        {start: 69, end: 80, letter: 'C', color: "#b8f351"},
        {start: 55, end: 68, letter: 'D', color: "#f5ec00"},
        {start: 39, end: 54, letter: 'E', color: "#ffac4d"},
        {start: 21, end: 38, letter: 'F', color: "#fd8130"},
        {start: 1, end: 20, letter: 'G', color: "#fd001a"}
    ],
    energysystems: {
        'electric': {name: "Standard Electric", efficiency: 1.0, winter: 1.0, summer: 1.0, fuel: 'electric'},
        'gasboiler': {name: "Standard Gas boiler", efficiency: 0.90, winter: 0.90, summer: 0.80, fuel: 'gas'},
        'oilboiler': {name: "Oil boiler", efficiency: 0.85, winter: 0.85, summer: 0.85, fuel: 'oil'},
        'heatpump': {name: "Heatpump", efficiency: 3.0, winter: 3.0, summer: 3.0, fuel: 'electric'},
        'woodbatch': {name: "Wood batch boiler", efficiency: 0.92, winter: 0.92, summer: 0.92, fuel: 'wood'},
        'woodpellet': {name: "Wood pellet boiler", efficiency: 0.92, winter: 0.92, summer: 0.92, fuel: 'wood'},
        'woodstove': {name: "Wood stove", efficiency: 0.87, winter: 0.87, summer: 0.87, fuel: 'wood'},
        'openwoodfire': {name: "Open wood fire", efficiency: 0.25, winter: 0.25, summer: 0.25, fuel: 'wood'},
        'electricheater': {name: "Electric room heater", efficiency: 1.0, winter: 1.0, summer: 1.0, fuel: 'electric'},
        'electricimmersion': {name: "Electric immersion heater", efficiency: 1.0, winter: 1.0, summer: 1.0, fuel: 'electric'},
        'electric-high': {name: "High rate electric", efficiency: 1.0, winter: 1.0, summer: 1.0, fuel: 'electric-high'},
        'electric-low': {name: "Low rate electric", efficiency: 1.0, winter: 1.0, summer: 1.0, fuel: 'electric-low'},
    },
  target_values:{
      space_heating_demand_lower: 20, // kWh/m2.a
      space_heating_demand_upper: 70, // kWh/m2.a
      space_heating_demand_passive_house: 25, // kWh/m2.a
      primary_energy_demand:120, // kWh/m2.a
      primary_energy_demand_passive_house: 120, // kWh/m2.a
      co2_emission_rate: 17, // kgCO2/m2.a
      energy_use_per_person: 8.6 // kgCO2/m2.a
  },
  uk_average_values:{
      space_heating_demand: 120, // kWh/m2.a
      primary_energy_demand:360, // kWh/m2.a
      co2_emission_rate: 50.3, // kgCO2/m2.a
      energy_use_per_person: 19.6 // kgCO2/m2.a
  }
};
