/*****************************************************
 * 
 * Version: 6.0
 * 
 * - Version of the model is noted as major.minor -> changes of the major value are due to 
 the addition of a new library. Changes of the minor values are due to changes only in existing libraries.
 * 
 */
var standard_library = {
    elements: {
        // --------------------------------------------------
        // English Heritage U-values
        // --------------------------------------------------
        "EH_UB1m": {
            tags: ["Wall"],
            name: "Brick 300mm with internal plaster",
            description: "Measured U-value, ENGLEFIELD Brick 300mm with plaster + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.2, max:1.6, mean:1.40}, kvalue: 150,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_UB1c": {
            tags: ["Wall"],
            name: "Brick 300mm with internal plaster",
            description: "Calculated U-value, ENGLEFIELD Brick 300mm with plaster + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.5, max:1.7, mean:1.60}, kvalue: 150,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_UBDm": {
            tags: ["Wall"],
            name: "Brick 300mm, drylined",
            description: "Measured U-value, ENGLEFIELD Brick 300mm, drylined with plasterboard + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.0, max:1.1, mean:1.05}, kvalue: 100,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_UBDc": {
            tags: ["Wall"],
            name: "Brick 300mm, drylined",
            description: "Calculated U-value, ENGLEFIELD Brick 300mm, drylined with plasterboard + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.1, max:1.2, mean:1.15}, kvalue: 100,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_UB2m": {
            tags: ["Wall"],
            name: "Brick 225mm with internal plaster",
            description: "Measured U-value, SHREWSBURY Brick 225mm with plaster + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.0, max:1.5, mean:1.25}, kvalue: 150,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_UB2c": {
            tags: ["Wall"],
            name: "Brick 225mm with internal plaster",
            description: "Calculated U-value, SHREWSBURY Brick 225mm with plaster + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.8, max:2.0, mean:1.90}, kvalue: 150,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_UB3m": {
            tags: ["Wall"],
            name: "Brick 225mm with internal plaster",
            description: "Measured U-value, WALSALL Brick 225mm with plaster + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.9, max:2.3, mean:1.25}, kvalue: 150,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_UB3c": {
            tags: ["Wall"],
            name: "Brick 225mm with internal plaster",
            description: "Calculated U-value, WALSALL Brick 225mm with plaster + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:1.8, max:2.0, mean:1.90}, kvalue: 150,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        "EH_IBm": {
            tags: ["Wall"],
            name: "Brick 225mm, drylined, insulated plasterboard",
            description: "Measured & calculated U-value, WALSALL Brick 225mm, drylined, insulated (25mm) plasterboard  + wallpaper or paint",
            location: "",
            source: "English Heritage 2013, Page 9, Table 3",
            uvalue: {min:0.6, max:0.7, mean:0.65}, kvalue: 50,
            notes: "Wet bricks increases thermal conductivity significantly"
        },
        // --------------------------------------------------
        // Historic Scotland U-values
        // --------------------------------------------------
        "HS_SP": {
            tags: ["Wall"],
            name: "Stonewall 600mm, plaster on laths",
            description: "Measured U-value, Stonewall 600mm, plaster on laths",
            location: "",
            source: "Historic Scotland 2011, Page 21",
            uvalue: {min:0.9, max:1.3, mean:1.1}, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        },
        "HS_SDP": {
            tags: ["Wall"],
            name: "Stonewall 600mm, drylined",
            description: "Measured U-value, Stonewall 600mm, drylined",
            location: "",
            source: "Historic Scotland 2011, Page 21",
            uvalue: {min:0.7, max:1.1, mean:0.9}, kvalue: 100,
            notes: "Damp walls increase U-value significantly"
        },
        "HS_SS": {
            tags: ["Wall"],
            name: "Sandstone 550mm, bare",
            description: "Measured U-value, Sandstone 550mm, bare",
            location: "",
            source: "Historic Scotland 2011, Page 24",
            uvalue: {min:1.3, max:1.5, mean:1.4}, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        },
        "HS_SSD": {
            tags: ["Wall"],
            name: "Sandstone 600mm, drylined",
            description: "Measured U-value, Sandstone 600mm, drylined",
            location: "",
            source: "Historic Scotland 2011, Page 24",
            uvalue: {min:1.0, max:1.2, mean:1.1}, kvalue: 100,
            notes: "Damp walls increase U-value significantly"
        },
        // --------------------------------------------------
        // Energy Saving Trust U-values
        // --------------------------------------------------
        "EST_SSP": {
            tags: ["Wall"],
            name: "Stonewall 600mm, lath & plaster",
            description: "Traditional sandstone (or granite) 600mm, internal lath and plaster finish (for the pre-1919 period), Energy Saving Trust, 2004, table 2",
            location: "",
            source: "Historic Scotland 2011, Page 28",
            uvalue: 1.7, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        },
        "EST_CW": {
            tags: ["Wall"],
            name: "Stonewall 600mm, lath & plaster",
            description: "Cavity wall involving brick and block with external render (for 1919‐1975), Energy Saving Trust, 2004, table 2",
            location: "",
            source: "Historic Scotland 2011, Page 28",
            uvalue: 1.7, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        },
        // --------------------------------------------------
        // CIBSE U-values
        // --------------------------------------------------
        "CIBSE_SS": {
            tags: ["Wall"],
            name: "Stonewall 600mm, airspace & plaster on laths.",
            description: "Stonewall 600mm with 50mm airspace and finished with 25mm dense plaster on laths. (Anderson, 2006a, table 3.49 and 3.50)",
            location: "",
            source: "Historic Scotland 2011, Page 28",
            uvalue: 1.38, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        },
        "CIBSE_UB1": {
            tags: ["Wall"],
            name: "Solid Brick, 220 mm, plaster ",
            description: "220 mm solid brick wall with 13 mm dense plaster. (Anderson, 2006a, table 3.49 and 3.50)",
            location: "",
            source: "Historic Scotland 2011, Page 28",
            uvalue: 2.09, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        },
        "CIBSE_UB2": {
            tags: ["Wall"],
            name: "Solid Brick, 220 mm, drylined",
            description: "220 mm solid brick wall with 50 mm airspace/battens and 12.5 mm plasterboard (Anderson, 2006a, table 3.49 and 3.50)",
            location: "",
            source: "Historic Scotland 2011, Page 28",
            uvalue: 1.41, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        },
        "CIBSE_UB3": {
            tags: ["Wall"],
            name: "Brick cavity wall, plaster ",
            description: "Brick/brick cavity wall with 105 mm brick, 50 mm airspace, 105 mm brick, and 13 mm dense plaster (Anderson, 2006a, table 3.49 and 3.50)",
            location: "",
            source: "Historic Scotland 2011, Page 28",
            uvalue: 1.44, kvalue: 150,
            notes: "Damp walls increase U-value significantly"
        }
    },
    elements_measures: {
        "CIBSE_UB2": {
            tags: ['Wall'],
            name: "Solid Brick, 220 mm, drylined",
            description: "220 mm solid brick wall with 50 mm airspace/battens and 12.5 mm plasterboard (Anderson, 2006a, table 3.49 and 3.50)",
            location: "",
            source: "Historic Scotland 2011, Page 28",
            uvalue: 1.41, kvalue: 150,
            notes: "",
            
            performance: '1.41 W/m<sup>2</sup>.K',
            
            cost_units: 'sqm', cost: 175, min_cost: 100,
            EWI: false,
            who_by: "",
            disruption: "HIGH",
            benefits: "", key_risks: "", associated_work: "", maintenance: ""
        }
    },
    draught_proofing_measures: {
    
    },
    ventilation_systems: {
    
    },
    ventilation_systems_measures: {
    
    },
    extract_ventilation_points: {
    
    },
    intentional_vents_and_flues_measures: {
    
    },
    water_usage: {
    
    },
    storage_type: {
    
    },
    storage_type_measures: {
    
    },
    appliances_and_cooking: {
    
    },
    heating_systems: {
        "ASHP1": {
            category: 'Heat pumps',
            name: "Air-source heat pump (Energy Saving Trust 2013 average SPFH4: 2.45)",
            description: "Install a heat pump to provide heat to your home. The air-source heat pump upgrades the temperature of the ambient external air through a condenser unit to upgrade its temperature to be useful in your home. A heat pump is more efficient at low flow temperatures.",
            winter_efficiency: 245, summer_efficiency: 245, performance: '245%',
            central_heating_pump: 0, fans_and_supply_pumps: 0,
            responsiveness: 1, 
            primary_circuit_loss: 'Yes',
            source: "Energy Saving Trust 2013",
            benefits: "Fuel Bills and Carbon Emissions",
            cost_units: 'unit', cost: 8000,
            who_by: "",
            disruption: "MEDIUM",
            associated_work: "advanced heating controls",
            key_risks: "poor design, installation and controls set-up. ",
            notes: "A heat pump requires careful design, installation and comissioning to ensure efficient operation. Works best with lower temperatures for space heating - so with underfloor heating or oversized radiators designed for lower flow and return temperatures.",
            maintenance: "Regular servicing and monitoring to ensure efficient operation. "
        },
        "GSHP1": {
            category: 'Heat pumps',
            name: "Ground-source heat pump (Energy Saving Trust 2013 average SPFH4: 2.82)",
            description: "Install a heat pump to provide heat to your home. A series of pipes in laid in the ground, or a borehole is dug, so that low-grade heat can be extracted from the ground, which remains at a roughly constant temperature throughout the year, this is then upgraded through a condenser unit to provide higher temperatures. A heat pump is more efficient at low flow temperatures.",
            winter_efficiency: 282, summer_efficiency: 282, performance: '282%',
            central_heating_pump: 0, fans_and_supply_pumps: 0,
            responsiveness: 1,
            primary_circuit_loss: 'Yes',
            source: "Energy Saving Trust 2013",
            benefits: "Fuel Bills and Carbon Emissions",
            cost_units: 'unit', cost: 12000,
            who_by: "",
            disruption: "HIGH",
            associated_work: "advanced heating controls",
            key_risks: "poor design, installation and controls set-up. ",
            notes: "A heat pump requires careful design, installation and comissioning to ensure efficient operation. Works best with lower temperatures for space heating - so with underfloor heating or oversized radiators designed for lower flow and return temperatures.",
            maintenance: "Regular servicing and monitoring to ensure efficient operation. "
        },
        "GSHP2": {
            category: 'Heat pumps',
            name: "Ground-source heat pump (Energy Saving Trust 2013 high performance SPFH4: 3.40)",
            description: "Install a heat pump to provide heat to your home. A series of pipes in laid in the ground, or a borehole is dug, so that low-grade heat can be extracted from the ground, which remains at a roughly constant temperature throughout the year, this is then upgraded through a condenser unit to provide higher temperatures. A heat pump is more efficient at low flow temperatures.",
            winter_efficiency: 340, summer_efficiency: 340, performance: '340%',
            central_heating_pump: 0, fans_and_supply_pumps: 0,
            responsiveness: 1,
            primary_circuit_loss: 'Yes',
            source: "Energy Saving Trust 2013",
            benefits: "Fuel Bills and Carbon Emissions",
            cost_units: 'unit', cost: 12000,
            who_by: "",
            disruption: "HIGH",
            associated_work: "advanced heating controls",
            key_risks: "poor design, installation and controls set-up. ",
            notes: "A heat pump requires careful design, installation and comissioning to ensure efficient operation. Works best with lower temperatures for space heating - so with underfloor heating or oversized radiators designed for lower flow and return temperatures.",
            maintenance: "Regular servicing and monitoring to ensure efficient operation. "
        }
    },
    heating_systems_measures: {
    
    },
    pipework_insulation: {
    
    },
    hot_water_control_type: {
    
    },
    space_heating_control_type: {
    
    },
    clothes_drying_facilities: {
    
    },
    generation_measures: {
    
    }
};

//The items in the extendeed library are not added to the list in the library helper (and not displayed in the manager, etc)
var extended_library = {
    lighting_measures: {
        L01: {
            name: "Low Energy Lights",
            description: "Replacement low energy light bulbs (LEDs) to replace incandecents and halogens, and, in some cases, fluorecent bulbs.  ",
            performance: '100 lumens/watt minimum',
            benefits: "Carbon, Fuel Bills, Lighting Quality. ",
            cost_units: 'unit',
            cost: 4,
            who_by: "DIY",
            disruption: "LOW",
            associated_work: "Electricals and wiring. ",
            key_risks: "Changes to wiring etc should be undertaken by a qualified electrican. ",
            notes: "Where spotlights or downlighters are being replaced care should be taken in ensuring transformers on existing circuits are suitable for LEDs - if unssure take advice from a qualified electrician. Where compact fluorecents are reaching the end of their life, it is also worth replacing them with LEDs - and this may in many cases result in better quality lighting. ",
            maintenance: "Occasional Cleaning, eventual replacement"
        }
    }
};
