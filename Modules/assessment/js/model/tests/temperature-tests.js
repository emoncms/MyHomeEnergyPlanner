describe("The temperature function", function() {
    // Module Inputs: data.temperature.responsiveness, data.temperature.target, data.temperature.living_area, data.temperature.control_type
    // Global Inputs: data.TFA, data.TMP, data.losses_WK, data.gains_W, data.altitude, data.region
    // Global Outputs: data.internal_temperature, data.external_temperature

    // to force temperature inputs, we define a new row in the appropriate table
    datasets.table_u1['hack'] = {};
    // it's 10 degrees all the time in sunny hackford.
    for (var i = 0; i<12; i++) datasets.table_u1['hack'][i] = 10;

    // for these tests, we can force the rest of dwelling temperature output
    // by setting living area fraction to 0

    it("copies external temperature from table u1 to data.external_temperature", function() {
        var data = calc.start({});
        extend(
            { altitude: 0, region: 'hack' },
            data);

        var result = calc.temperature(data);
        expect(result.external_temperature).toEqual(ncopies(12, 10));
    });

    it("clamps HLP to 6 when calculating rest-of-dwelling temperature", function() {
        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                losses_WK: {x: ncopies(12, 7)}, // makes HLP 7
                gains_W:   {x: ncopies(12, 2)},
                altitude:  0,
                region: 'hack',

                temperature: {
                    responsiveness: 0,
                    target: 21,
                    living_area: 0,
                    control_type: 1
                }
            },
            data);

        var result = calc.temperature(data).internal_temperature;

        expect(result[0]).toBeCloseTo(17.203);
        // appears there is a bug here as well - Th2 is not being calculated with min(6, HLP), as this
        // gives the result when HLP is 7 in my calc formulae
    });

    it("weights temperature between rest of dwelling and main dwelling using floor area", function() {
        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                losses_WK: {x: ncopies(12, 1)},
                gains_W:   {x: ncopies(12, 2)},
                altitude:  0,
                region: 'hack',

                temperature: {
                    responsiveness: 0.5,
                    target: 21,
                    living_area: 0.5,
                    control_type: 1
                }
            },
            data);

        var result = calc.temperature(data).internal_temperature;

        expect(result[0]).toBeCloseTo((18.35 + 18.761)/2);
    });

    // TODO adjustments due to heating system controls? not implemented, but maybe ought to be.

    it("adjusts rest-of-dwelling temperature for control type 1", function() {
        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                losses_WK: {x: ncopies(12, 1)},
                gains_W:   {x: ncopies(12, 2)},
                altitude:  0,
                region: 'hack',

                temperature: {
                    responsiveness: 0,
                    target: 21,
                    living_area: 0,
                    control_type: 1
                }
            },
            data);

        var result = calc.temperature(data).internal_temperature;

        expect(result[0]).toBeCloseTo(19.707);
    });

    it("adjusts rest-of-dwelling temperature for control type 2", function() {
        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                losses_WK: {x: ncopies(12, 1)},
                gains_W:   {x: ncopies(12, 2)},
                altitude:  0,
                region: 'hack',

                temperature: {
                    responsiveness: 0,
                    target: 21,
                    living_area: 0,
                    control_type: 2
                }
            },
            data);

        var result = calc.temperature(data).internal_temperature;

        expect(result[0]).toBeCloseTo(19.291);
    });

    it("adjusts rest-of-dwelling temperature for control type 3", function() {
        var data = calc.start({});
        extend(
            {
                TFA: 1,
                TMP: 1,
                losses_WK: {x: ncopies(12, 1)},
                gains_W:   {x: ncopies(12, 2)},
                altitude:  0,
                region: 'hack',

                temperature: {
                    responsiveness: 0,
                    target: 21,
                    living_area: 0,
                    control_type: 3
                }
            },
            data);

        var result = calc.temperature(data).internal_temperature;

        expect(result[0]).toBeCloseTo(19.00);
        // this test fails - looks like the model does not adjust hours of heating off
        // for control type 3 (does adjust Th2 correctly though)
    });
});

describe("The temperature reduction calculation", function() {
    // calc_temperature_reduction(TMP, HLP, H, Ti, Te, G, R, Th, toff)
    // in table 9b, defined in terms of tau from 9a,

    // to match the definition, defining a wrapper which does TMP and HLP for us:

    var ctr_tc = function(tc, H, Ti, Te, G, R, Th, Toff) {
        // tau = TMP / 3.6 HLP
        // TMP = tau * 3.6 HLP
        // tc = 4 + 0.25 tau
        // (tc - 4)/0.25 = tau
        var tau = (tc - 4) * 4;
        return calc_temperature_reduction(tau * 3.6, 1, H, Ti, Te, G, R, Th, Toff);
    };

    // compute the value of nu for a given set of parameters since we
    // need it to validate that the temperature reduction did the
    // right thing.
    var ctr_nu = function(tc, H, Ti, Te, G) {
        var tau = (tc - 4) * 4;
        var a = 1 + tau/15.0;
        var L = H * (Ti - Te);
        var gamma = G / L;
        if (gamma > 0) {
            if (gamma === 1) {
                return a/(a+1.0);
            } else {
                return (1-Math.pow(gamma, a)) / (1 - Math.pow(gamma, a+1));
            }
        } else {
            return 1;
        }
    };

    // calculation is
    // Tsc = (1 - R) * (Th - 2) + R( Te + nu G/H)
    // wait what. what's nu. oh for goodness' sake SAP.

    it("varies with responsiveness", function() {
        // test with toff > tc, so we are in option 2, which is easier
        var tc = 5;
        var toff = 10;

        var u = ctr_tc(tc, 1, 21, 12, 10,
                       0,//responsiveness = 0, temperature = demand - 2
                       21, toff);

        // so Tsc = 19
        // u = (21 - 19) * (toff - 0.5 tc) / 24
        expect(u).toBeCloseTo((21 - 19) * (toff - tc/2.0) / 24.0);

        var u2 = ctr_tc(tc,
                        1,  // H
                        21, // Ti
                        12, // Te
                        10, // G
                        1,//responsiveness = 0, temperature = Te + nu G / H
                        21, toff);

        var nu = ctr_nu(tc, 1, 21, 12, 10);

        var Tsc = 12 + nu * 10;

        expect(u2).toBeCloseTo((21 - Tsc) * (toff - 0.5 * tc)/24.0);

        var u3 = ctr_tc(tc,
                        1,  // H
                        21, // Ti
                        12, // Te
                        10, // G
                        0.5,//responsiveness = 0, temperature = Te + nu G / H
                        21, toff);

        Tsc = (Tsc + 19) / 2;

        expect(u3).toBeCloseTo((21 - Tsc) * (toff - 0.5 * tc)/24.0);
    });

    it("uses the first rule in table 9b when heating off hours does not exceed time constant", function() {
        // this is already checked above, really

        var tc = 5;
        var toff = 5;

        var u = ctr_tc(tc, 1, 21, 12, 10,
                       0,//responsiveness = 0, temperature = demand - 2
                       21, toff);

        // so Tsc = 19
        // u = (21 - 19) * (toff - 0.5 tc) / 24 <-- rule 1
        expect(u).toBeCloseTo((21 - 19) * (toff - tc/2.0) / 24.0);
    });

    it("uses the second rule in table 9b when heating off hours exceeds time constant", function() {
        var tc = 5;
        var toff = 4.9;

        var u = ctr_tc(tc, 1, 21, 12, 10,
                       0,//responsiveness = 0, temperature = demand - 2
                       21, toff);

        // so Tsc = 19
        // u = 0.5 toff^2 * (Th - Tsc) / (24 Tc)
        expect(u).toBeCloseTo(0.5 * Math.pow(toff, 2) * (21 - 19) / (24 * tc));
    });
});

describe("The gains-utilisation function", function() {
    // signature is
    //calc_utilisation_factor(TMP, HLP, H, Ti, Te, G)

    it("works when gamma is positive but not 1", function() { // not the best spec, but that's SAP for you. it's a horror
        // gamma is G / ( Ti - Te )
        // so if we want gamma to be positive, G and Ti-Te must be
        var G = 10;
        var Ti = 18;
        var Te = 16;

        // chosen for a to come out to 2
        var H = 1;
        var HLP = 1;
        var TMP = 3.6 * 15;

        // so this should come out as
        // 15 * 3.6 / ( 3.6 ) = 15 = tau
        // a = 1 + tau / 15 = 2
        // L = 1 * (3)
        // gamma = 10 / 2 = 5

        // result = ( 1 - gamma ^2 ) / ( 1 - gamma^3 )
        // = (1 - 25) / (1 - 125)
        // = 24 / 124 = 0.193
        var factor = calc_utilisation_factor(TMP, HLP, H, Ti, Te, G);
        expect(factor).toBeCloseTo(0.193);
    });

    it("rounds infinity down to 1 million when L is zero", function() {
        var G = 10;
        var Ti = 18;
        var Te = 16;

        var H = 0; // makes L zero
        var HLP = 1;
        var TMP = 3.6 * 15;

        // gamma ought to be 10^6, if following the spec
        // factor should be
        // (1 - 10^12) / ( 1 - 10^13)

        var factor = calc_utilisation_factor(TMP, HLP, H, Ti, Te, G);
        expect(factor).toBeCloseTo(.00000099999999999900);
    });

    it("works when gamma is 1", function() {
        var G = 10;
        var Ti = 20;
        var Te = 10;

        var H = 1;
        var HLP = 1;
        var TMP = 3.6 * 15;

        // L is 10, so is G, so gamma is 1

        var factor = calc_utilisation_factor(TMP, HLP, H, Ti, Te, G);
        expect(factor).toBeCloseTo(2/3.0);
    });

    it("works when gamma is zero or negative", function() {
        var G = -1;
        var Ti = 20;
        var Te = 10;

        var H = 1;
        var HLP = 1;
        var TMP = 3.6 * 15;

        // L is 10, so is G, so gamma is 1

        var factor = calc_utilisation_factor(TMP, HLP, H, Ti, Te, G);
        expect(factor).toBeCloseTo(1);
    });
});

// Local Variables:
// js2-additional-externs: ("calc" "describe" "it" "expect")
// End:
