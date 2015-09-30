describe("The hot water calculation", function() {
    // I think these tests reveal that one of the constants is a little off in the water heating
    // calculation somewhere, as the results are all close but not quite bang on.

    // Either that or I have copied a number wrongly from SAP.

    it("determines hot water demand from occupancy with (43)", function() {
        var input = calc.start({});
        extend({occupancy: 3},input);
        var result = calc.water_heating(input);
        expect(result.water_heating.Vd_average).toBeCloseTo(25 * 3 + 36);
    });

    it("reduce the demand by 5% when in a low water use design", function() {
        var input = calc.start({});
        extend({occupancy: 3,
                water_heating:{low_water_use_design:true}},
               input);
        var result = calc.water_heating(input);
        expect(result.water_heating.Vd_average).toBeCloseTo((25 * 3 + 36) * 0.95);
    });

    var days = [ 31 ,  28 ,  31 ,  30 ,  31 ,  30 ,  31 ,  31 ,  30 ,  31 ,  30 ,  31 ];
    var dT   = [41.2, 41.4, 40.1, 37.6, 36.4, 33.9, 30.4, 33.4, 33.5, 36.3, 39.4, 39.9];
    var f    = [1.10, 1.06, 1.02, 0.98, 0.94, 0.90, 0.90, 0.94, 0.98, 1.02, 1.06, 1.10];

    it("determines the energy content of hot water with the rise temperature and the monthly usage factor per (45)", function() {
        var input = calc.start({});
        extend({occupancy: 3},input);
        var result = calc.water_heating(input);

        // expected value (45)
        var base = 25*3+36;
        var expected = [];
        var sum = 0;
        for (var i = 0; i<12; i++) {
            expected[i] = base * f[i] * 4.18 * days[i] * dT[i] / 3600;
            sum += expected[i];
        }

        expect(result.water_heating.annual_energy_content).toBeCloseTo(sum); // slightly different? not sure why.
    });

    // these next two are ugly tests as they are a bit buried, and so are reverse-engineered to work

    it("responds to primary pipework insulation fraction", function() {
        fail("It doesn't, but I don't know whether you want this as a feature or not.");
    });

    it("adds 15% distribution loss and primary losses if hot water is not point-of-use, but not otherwise", function() {
        var input = calc.start({});
        var ppif = 1; // TODO primary pipwork insulation is not possible to set
        extend({occupancy: 3,
                use_water_heating: true,
                water_heating: {
                    pipework_insulated_fraction: ppif,
                    hot_water_control_type: "no_cylinder_thermostat"
                }
               },input);
        var result = calc.water_heating(input);
        var with_losses = result.energy_requirements.waterheating.quantity;

        input = calc.start({});
        extend({occupancy: 3,
                use_water_heating: true,
                water_heating: {
                    instantaneous_hotwater: true
                }},input);
        result = calc.water_heating(input);

        var without_losses = result.energy_requirements.waterheating.quantity;

        var base = 25*3+36;
        var primary_loss = 0;
        var distribution_loss = 0;
        for (var i = 0; i<12; i++) {
            distribution_loss += 0.15 * base * f[i] * 4.18 * days[i] * dT[i] / 3600;
            var h = (i > 4 && i < 9) ? 3 : 11; // june is month 6. september is month 9. however, off by one

            var primary_loss_i = days[i] * 14 * (
                (0.0091 * ppif + 0.0245 * (1-ppif)) * h + 0.0263
            );

            primary_loss += primary_loss_i;
        }

        expect(without_losses).toBeCloseTo(0.85 * distribution_loss / 0.15);

        // now we have to reverse a bit more calculation
        // with_losses should be
        // 0.85 * X + P + D
        // without should be
        // 0.85 * X
        // with - without should be P + D

        expect(with_losses - without_losses).toBeCloseTo(primary_loss + distribution_loss);
        console.log(primary_loss, distribution_loss);
    });

    it("calculates hot water cylinder losses using table 2", function() {
        fail("I should write a test.");
    });

    it("uses defined cylinder losses if available", function() {
        fail("I should write a test.");
    });
});
