describe("The space heating function", function() {
    it("calculates space heat demand using newton's law of cooling", function() {
        var data = calc.start({});
        extend(
            {
                TFA: 2,
                internal_temperature: ncopies(12, 20),
                external_temperature: ncopies(12, 10),
                losses_WK: {x: ncopies(12, 3)},
                gains_W: {x: ncopies(12, 0)},
                space_heating: {
                    use_utilfactor_forgains: false
                }
            },
            data);

        var result = calc.space_heating(data);

        expect(result.space_heating.heat_demand).toEqual(ncopies(12, 30));
        expect(result.energy_requirements.space_heating.quantity).toBeCloseTo(
            // 30 watts * 365 days in kWh - rounded off the quarter day for consistency.
            262.8
        );

    });

    it("calculates demand net of gains without utilisation factor", function() {
        var data = calc.start({});
        extend(
            {
                TFA: 2,
                internal_temperature: ncopies(12, 20),
                external_temperature: ncopies(12, 10),
                losses_WK: {x: ncopies(12, 3)},
                gains_W: {x: ncopies(12, 10)},
                space_heating: {
                    use_utilfactor_forgains: false
                }
            },
            data);

        var result = calc.space_heating(data);
        expect(result.space_heating.heat_demand).toEqual(ncopies(12, 20));
    });

    it("calculates demand net of gains with utilisation factor reapplied", function() {
        // for this we need to specify some more parameters, as it will calculate a utilisation factor

        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                internal_temperature: ncopies(12, 20),
                external_temperature: ncopies(12, 10),
                losses_WK: {x: ncopies(12, 3)},
                gains_W: {x: ncopies(12, 10)},
                space_heating: {
                    use_utilfactor_forgains: true
                }
            },
            data);

        var factor = 0.7518992; // worked out in notes calculation
        var result = calc.space_heating(data);
        expect(result.space_heating.heat_demand[0]).toBeCloseTo(30 - 10 * factor);
    });

    it("calculates space cooling demand using newton's law of cooling", function() {
        // so we have a heat loss rate given 24 inside and X outside
        fail();

        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                internal_temperature: ncopies(12, 10),
                external_temperature: ncopies(12, 10),
                losses_WK: {x: ncopies(12, 3)},
                gains_W: {x: ncopies(12, 10)},
                space_heating: {
                    use_utilfactor_forgains: false
                }
            },
            data);

        var result = calc.space_heating(data);

        // heat loss rate is $14 3 => 42$ watts
        // Utilisation factor is 0.751899255778
        // we appear to be missing table 5 gains, which need to be excluded from the cooling gains

    });
});

// Local Variables:
// js2-additional-externs: ("calc" "describe" "it" "expect" "extend" "ncopies")
// End:
