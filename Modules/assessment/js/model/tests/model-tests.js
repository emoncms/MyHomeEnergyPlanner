

describe("The SAP calculation", function () {
    // each of these is a statement about the sap calculation
    it("produces a value when computed", function() {
        var result = calc.run(null);
        expect(result).toBeDefined();
    });

    it("produces a sensible result for a small house with a typical boiler");
    it("produces a sensible result for a large house with storage heaters");
    it("produces a sensible result for a house with solar DHW");
});

describe("The start function", function () {
    var expect_defaults = function (data) {
        expect(data.num_of_floors).toEqual(0);
        expect(data.TFA).toEqual(0);
        expect(data.volume).toEqual(0);
        expect(data.occupancy).toEqual(0);
        expect(data.internal_temperature).toEqual([18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18]);
        expect(data.external_temperature).toEqual([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
        expect(data.losses_WK).toEqual({});
        expect(data.gains_W).toEqual({});
        expect(data.energy_requirements).toEqual({});
        expect(data.total_cost).toEqual(0);
        expect(data.total_income).toEqual(0);
        expect(data.primary_energy_use).toEqual(0);
        expect(data.primary_energy_use_bills).toEqual(0);
        expect(data.fabric_energy_efficiency).toEqual(0);
        expect(data.totalWK).toEqual(0);
    };

    it("creates blank data", function () {
        var start = calc.start();

        expect(start.region).toEqual(0);
        expect(start.altitude).toEqual(0);
        expect(start.household).toEqual({});

        expect_defaults(start);

        // we only want these things to be defined
        // any new things, update the test!

        expect(Object.keys(start).sort()).toEqual(
            [
                "region", "altitude", "household",
                "num_of_floors", "TFA", "volume",
                "occupancy", "internal_temperature",
                "external_temperature", "losses_WK",
                "energy_requirements", "total_cost",
                "total_income", "primary_energy_use",
                "kgco2perm2", "primary_energy_use_bills",
                "fabric_energy_efficiency", "totalWK",
                "gains_W"
            ].sort()
        );
    });

    it("resets non-blank data", function () {
        var start = calc.start({
            region: 9,
            altitude: 1000,
            household: {a:1},

            num_of_floors: 1, TFA: 1, volume: 1, occupancy: 1,
            internal_temperature: 1, external_temperature: 1,
            losses_WK: 1, gains_W: 1, energy_requirements: 1,
            total_cost: 1, total_income: 1, primary_energy_use: 1,
            primary_energy_use_bills: 1, kgco2perm2: 1, fabric_energy_efficiency: 1,
            totalWK: 1
        });

        expect(start.region).toEqual(9);
        expect(start.altitude).toEqual(1000);
        expect(start.household).toEqual({a:1});

        expect_defaults(start);
    });
});

describe("The floors function", function () {
    it("creates zero floors for no input", function () {
        var data = calc.floors(calc.start());
        expect(data.floors).toEqual([]);
        expect(data.TFA).toEqual(0);
        expect(data.volume).toEqual(0);
        expect(data.num_of_floors).toEqual(0);
    });

    it("computes total floor area, volume, and number of floors appropriately", function () {
        var data = calc.floors(calc.start({
            TFA: 10000,
            volume: 10000,
            floors: [
                {area: 50, height: 10},
                {area: 10, height: 1},
                {area: 0,  height: 1},
                {area: 1,  height: 0}
            ]
        }));

        expect(data.TFA).toEqual(61);
        expect(data.volume).toEqual(510);
        expect(data.num_of_floors).toEqual(4);
    });
});

describe("The occupancy function", function() {
    it("computes standard occupancy for small floors", function() {
        expect(calc.occupancy({
            TFA: 13.9,
            use_custom_occupancy: false
        }).occupancy).toEqual(1);
        expect(calc.occupancy({
            TFA: 10,
            use_custom_occupancy: false
        }).occupancy).toEqual(1);
    });
    it("computes standard occupancy for large floors", function() {
        expect(calc.occupancy({
            TFA: 13.95,
            use_custom_occupancy: false
        }).occupancy).toBeCloseTo(
            1 + 1.76 * (1 - Math.exp( -0.000349 * 0.05 * 0.05 )) + 0.0013 * (0.05)
        );

        expect(calc.occupancy({
            TFA: 23.95,
            use_custom_occupancy: false
        }).occupancy).toBeCloseTo(
            1 + 1.76 * (1 - Math.exp( -0.000349 * 100 )) + 0.0013 * 10
        );
    });
    it("uses custom occupancy when set", function() {
        expect(calc.occupancy({
            custom_occupancy: 1234.5,
            use_custom_occupancy: true
        }).occupancy).toEqual(1234.5);
    }); // data.use_custom_occupancy & data.custom_occupancy -> data.occupancy
});

describe("The fabric function", function() {
    // data.fabric.elements
    it("calculates the specific heat loss using areas", function () {
        var data = calc.fabric(calc.start({
            fabric:{
                thermal_bridging_yvalue:0,
                elements: [
                    {area: 10,
                     type: 'wall',
                     uvalue: 2,
                     kvalue: 1}
                ]
            }
        }));

        expect(data.fabric.total_wall_WK).toEqual(20);
        expect(data.fabric.total_heat_loss_WK).toEqual(20);
    });
    it("calculates the specific heat loss using width and height if given",function () {
        var data = calc.fabric(calc.start({
            fabric:{
                thermal_bridging_yvalue:0,
                elements: [
                    {area: 1,
                     l: 2,
                     h: 5,
                     type: 'wall',
                     uvalue: 2,
                     kvalue: 1}
                ]
            }
        }));

        expect(data.fabric.total_wall_WK).toEqual(20);
        expect(data.fabric.total_heat_loss_WK).toEqual(20);
    });
    it("excludes window area from wall area", function() {
        var data = calc.fabric(calc.start({
            fabric:{
                thermal_bridging_yvalue:0,
                elements: [
                    {area: 20,
                     type: 'wall',
                     uvalue: 2,
                     kvalue: 1},
                    {area: 10,
                     type:'window',
                     uvalue:0,
                     kvalue:0,
                     subtractfrom: 0,
                     overshading: 0
                    }
                ]

            }
        }));

        expect(data.fabric.total_wall_WK).toEqual(20);
        expect(data.fabric.total_heat_loss_WK).toEqual(20);
    });
    it("includes window losses", function () {
        var data = calc.fabric(calc.start({
            fabric:{
                thermal_bridging_yvalue:0,
                elements: [
                    {area: 20,
                     type: 'wall',
                     uvalue: 2,
                     kvalue: 1},
                    {area: 10,
                     type:'window',
                     uvalue:1,
                     kvalue:0,
                     subtractfrom: 0,
                     overshading: 0
                    }
                ]

            }
        }));

        expect(data.fabric.total_wall_WK).toEqual(20);
        expect(data.fabric.total_window_WK).toEqual(10);
        expect(data.fabric.total_heat_loss_WK).toEqual(30);
    });
    it("calculates solar gains from windows");
    it("calculates the external area by looking at u-values");
    it("calculates thermal mass from k-value area inner product");
    it("uses the default thermal bridging yvalue of 0.15");
    it("can use another thermal bridging yvalue if you like");
    it("calculates the thermal mass parameter");
    it("can use a given thermal mass parameter");
});

describe("The ventilation function", function() {
    // can check:
    // ventilation.average_WK
    // ventilation.effective_air_change_rate
    // ventilation.infiltration_WK
    // ====
    // losses_WK.ventilation

    it("uses correct default values");
    it("adds xach/hr for chimneys");
    it("adds yach/hr for open flues");
    it("adds zach/hr for intermittent fans");
    it("adds aach/hr for passive vents");
    it("adds bach/hr for flueless gas fires");
    it("uses air permeability tests when set");
});

describe("The temperature function", function() {
    // Module Inputs: data.temperature.responsiveness, data.temperature.target, data.temperature.living_area, data.temperature.control_type
    // Global Inputs: data.TFA, data.TMP, data.losses_WK, data.gains_W, data.altitude, data.region
    // Global Outputs: data.internal_temperature, data.external_temperature

    it("sets the external temperature by region");
    it("sets the living area temperature appropriately");
    it("sets the rest-of-dwelling temperature appropriately");

    it("uses the living area fraction to produce the monthly mean");
});

describe("The space heating function", function () {
    it("exists");
});

describe("The energy systems function", function () {
    it("exists");
});

describe("The lighting calculation", function () {
    it("exists");
});

describe("Solar hot water", function () {
    it("exists");
});

describe("Domestic hot water", function () {
    it("exists");
});

describe("The appliances calculation", function () {
    it("exists");
});

describe("Generation calculations", function () {
    it("exists");
});

// Local Variables:
// js2-additional-externs: ("calc" "describe" "it" "expect")
// End:
