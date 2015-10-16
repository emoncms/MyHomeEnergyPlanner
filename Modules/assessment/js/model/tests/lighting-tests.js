describe("The lighting calculation", function() {
    var base_demand = function(mul, exp, tfa, occ, lelf) {
        return mul * Math.pow(tfa * occ, exp) * (1 - 0.5 * lelf);
    };

    var c2 = function(gl) {
        if (gl <= 0.095) {
            return 52.2 * gl * gl - 9.94 * gl + 1.433;
        } else {
            return 0.96;
        }
    };

    var fm = [
        31 , // jan
        28 , // feb
        31 , // mar
        30 , // apr
        31 , // may
        30 , //jun
        31 , // jul
        31 , // aug
        30 , // sep
        31 , // oct
        30 , // nov
        31   // dec
    ];

    var spread_out = function(total) {
        var out = [];
        var sum = 0;
        for (var i = 0; i<12; i++) {
            var factor = (1 + Math.cos(2 * Math.PI * (1 + i - 0.2) / 12) / 2) * fm[i] / 365.0;
            out[i] = total * factor;
            sum += out[i];
        }
        return {sum:sum, monthly:out};
    };

    var to_gains = function(reduced, monthly) {
        var result = [];
        for (var i = 0; i<12; i++) {
            result[i] = (reduced ? 0.4 : 1) * (monthly[i] * 0.85 * 1000 / (24.0 * fm[i]));
        }
        return result;
    };

    var run = function(occupancy, TFA, GL, LLE, L, reduced) {
        var data = calc.start();
        extend(
            {
                occupancy: occupancy,
                TFA: TFA,
                GL: GL,
                LAC: {
                    LLE: LLE,
                    L: L,
                    reduced_internal_heat_gains: reduced
                }
            },
            data
        );
        return calc.LAC(data);
    };

    it("uses the GL threshold in L3/L4 correctly", function() {
        var result = run(1, 1, 0.0951, 0, 1, false);
        expect(result.LAC.C2).toEqual(0.96);

        result = run(1, 1, 1, 0, 1, false);
        expect(result.LAC.C2).toEqual(0.96);

        result = run(1, 1, 0.06, 0, 1, false);
        expect(result.LAC.C2).toEqual(c2(0.06));
    });


    it("produces standard gains and consumption normally", function() {
        var result = run(1, 1, 0.08, 0, 1, false);
        var base = spread_out(base_demand(59.73, 0.4715, 1, 1, 0) * c2(0.08));
        // sum => result.energy_requirements.lighting.quantity

        expect(result.energy_requirements.lighting.quantity).toBeCloseTo(base.sum);
        // monthly => data.gains_W.Lighting
        expect(result.gains_W.Lighting).toEachBeCloseTo(to_gains(false, base.monthly));

        // this test is failing - I think it is meant to because the month index is off by one in the adjustment L7
        // in the implementation code
    });


    it("produces low-energy lighting gains and consumption", function() {
        var result = run(1, 1, 0.08, 0.5, 1, false);
        var base = spread_out(base_demand(59.73, 0.4715, 1, 1, 0.5) * c2(0.08));
        // sum => result.energy_requirements.lighting.quantity

        expect(result.energy_requirements.lighting.quantity).toBeCloseTo(base.sum);
        // monthly => data.gains_W.Lighting
        expect(result.gains_W.Lighting).toEachBeCloseTo(to_gains(false, base.monthly));

        // same error, but otherwise OK
    });

    it("produces reduced gains with standard lighting", function() {
        var result = run(1, 1, 0.08, 0, 1, true);
        var base = spread_out(base_demand(59.73, 0.4715, 1, 1, 0) * c2(0.08));
        // sum => result.energy_requirements.lighting.quantity

        expect(result.energy_requirements.lighting.quantity).toBeCloseTo(base.sum);
        // monthly => data.gains_W.Lighting
        expect(result.gains_W.Lighting).toEachBeCloseTo(to_gains(true, base.monthly));

        // same error, but otherwise OK
    });

    it("produces reduced gains with LE lighting", function() {
        var result = run(1, 1, 0.08, 0.5, 1, true);
        var base = spread_out(base_demand(59.73, 0.4715, 1, 1, 0.5) * c2(0.08));
        // sum => result.energy_requirements.lighting.quantity

        expect(result.energy_requirements.lighting.quantity).toBeCloseTo(base.sum);
        // monthly => data.gains_W.Lighting
        expect(result.gains_W.Lighting).toEachBeCloseTo(to_gains(true, base.monthly));

        // same error, but otherwise OK. equation in SAP is a bit weird though (L9a)
    });
});
