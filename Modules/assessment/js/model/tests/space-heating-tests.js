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

    it("calculates space cooling demand using SAP rules", function() {
        // so we have a heat loss rate given 24 inside and X outside

        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                internal_temperature: ncopies(12, 10),
                external_temperature: [0,0,0,0,0,10,10,10,0,0,0,0],
                losses_WK: {x: ncopies(12, 1)},
                gains_W: {x: ncopies(12, 15)},
                space_heating: {
                    use_utilfactor_forgains: false
                }
            },
            data);

        var result = calc.space_heating(data);

        // heat loss rate is $loss := 0 W => 0$ watts
        // Utilisation factor should be $ u := 1 => 1 $

        // we appear to be missing table 5 gains, which need to be excluded from the cooling gains
        // so I can't really check they are excluded as there is no way they could be incldued

        // $ gains := 15 W => 15 W $
        // $ cooling_req := gains - loss u => 15 W $
        // monthly kWh = $ akw := as(cooling_req 30 day, kW hr) => 10.8 hr kW $ // ok maybe not 30 days, but there we go
        // intermittency factor in table 10b is always 0.25 apparently, so we have
        // cooling requirement is cooled fraction * intermittency * baseline

        // it seems that in the model, we are taking cooling demand to be wherever the heat demand is negative
        // not sure whether to test for this, as it is not what the SAP spec says but it is more sensible?

        // SAP says we should have cooling in a certain 3 months, no matter what, and it should be worked out
        // by multiplying by 1/4 and the cooled fraction.

        // let us presume a cooled fraction of 100%
        // $ (1 0.25 akw / month) 3 month => 8.1 hr kW $
        expect(result.space_heating.annual_cooling_demand).toBeCloseTo(8.1);

        fail("table 5 gains should be represented somehow, so they can be ignored here");
    });
});

// Local Variables:
// js2-additional-externs: ("calc" "describe" "it" "expect" "extend" "ncopies")
// End:
