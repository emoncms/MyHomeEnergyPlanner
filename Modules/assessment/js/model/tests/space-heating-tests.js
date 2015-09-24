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
        console.log(result);

        expect(result.space_heating.heat_demand).toEqual(ncopies(12, 30));
        expect(result.energy_requirements.space_heating.quantity).toBeCloseTo(
            // 30 watts * 365 days in kWh - rounded off the quarter day for consistency.
            262.8
        );

    });

    it("calculates demand net of gains without utilisation factor", function() {

    });

    it("calculates demand net of gains with utilisation factor reapplied", function() {

    });

    it("calculates space cooling demand using newton's law of cooling", function() {

    });

    it("calculates a fabric energy efficiency value from heat and cooling demand", function() {

    });
});

// Local Variables:
// js2-additional-externs: ("calc" "describe" "it" "expect" "extend" "ncopies")
// End:
