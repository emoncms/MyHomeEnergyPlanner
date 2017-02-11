describe("The appliances calculation", function() {
    var base_demand = function(tfa, occ) {
        return 207.8 * Math.pow(tfa * occ, 0.4714);
    };

    var fm = [
        31 ,  28 ,  31 ,  30 ,  31 ,  30 ,  31 ,  31 ,  30 ,  31 ,  30 ,  31
    ];

    var spread_out = function(total) {
        var out = [];
        var sum = 0;
        for (var i = 0; i<12; i++) {
            var factor = (1 + 0.157 * Math.cos(2 * Math.PI * (1 + i - 1.78) / 12)) * fm[i] / 365.0;
            out[i] = total * factor;
            sum += out[i];
        }
        return {sum:sum, monthly:out};
    };

    var gains = function(monthly, reduced) {
        var out = [];
        for (var i = 0; i<12; i++) {
            out[i] = (reduced ? 0.67 : 1) * (monthly[i] * 1000 / (24 * fm[i]));
        }
        return out;
    };

    var run = function(tfa, occ, reduced) {
        var data = calc.start({});
        extend({
            TFA: tfa,
            occupancy: occ,
            LAC:{
                energy_efficient_cooking: reduced
            }
        }, data);
        return calc.LAC(data);
    };

    // => data.LAC.EA (annual sum)
    // => data.gains_W.Appliances = (monthly gains)
    // => data.energy_requirements.appliances.quantity = annual sum

    it("calculates annual total demand", function() {
        var base = spread_out(base_demand(100, 3));
        var result = run(100, 3, false);

        expect(result.LAC.EA).toBeCloseTo(base.sum);
        expect(result.energy_requirements.appliances.quantity).toBeCloseTo(base.sum);
    });


    it("calculates monthly normal gains", function() {
        var base = spread_out(base_demand(100, 3));
        var result = run(100, 3, false);
        expect(result.gains_W.Appliances).toEachBeCloseTo(gains(base.monthly, false));
    });

    it("calculates monthly reduced gains, without reducing demand", function() {
        var base = spread_out(base_demand(100, 3));
        var result = run(100, 3, true);
        expect(result.gains_W.Appliances).toEachBeCloseTo(gains(base.monthly, true));
        expect(result.LAC.EA).toBeCloseTo(base.sum);
    });
});
