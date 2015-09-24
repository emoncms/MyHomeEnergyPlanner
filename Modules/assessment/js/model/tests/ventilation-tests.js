describe("The ventilation function", function() {
    // can check:
    // ventilation.average_WK
    // ventilation.effective_air_change_rate
    // ventilation.infiltration_WK
    // ====
    // losses_WK.ventilation

    // appendix Q?

    var check_ach_for = function(thekey, thevalue) {
        return function() {
            // need to reset volume to 1 after calc.start:
            var input = {
                region: 'hack',
                num_of_floors:0,
                ventilation: {
                    air_permeability_test: true,
                    air_permeability_value: 0,
                    ventilation_type: 'd'
                }
            };

            input.ventilation[thekey] = 1;

            input = calc.start(input);
            input.volume = 1;
            var v = calc.ventilation(input).ventilation;
            // the base infiltration should be 40 ach/hr
            // there are 0 sheltered sides so shelter factor should be 1
            // we add nothing due to permeability
            // wind factor is monthly windspeed / 4
            // however, we have hacked the region dataset to break that so
            // it is 1 in each month
            expect(v[thekey]).toEqual(1);
            expect(v.effective_air_change_rate).toEqual(ncopies(12, thevalue));
        };
    };

    var check_ach_for_sides_and_storeys_and_construction_and_floor = function(sides, storeys, construction, floor, result) {
        var input = calc.start({
            region: 'hack',
            ventilation: {
                dwelling_construction: construction,
                draught_lobby: true,
                ventilation_type: 'd',
                suspended_wooden_floor: floor,
                percentage_draught_proofed: 100,
                number_of_sides_sheltered: sides
            }
        });

        input.num_of_floors = storeys; // reset by calc.start

        var v = calc.ventilation(input).ventilation;

        expect(v.effective_air_change_rate[0]).toBeCloseTo(result);
    };

    var check_ach_with_ventilation_type = function(type, adjusted, misc, result) {
        // we reverse-engineer the calculation so that the adjusted value (22b) is what we want
        // and then we can just check the end calculation
         var input = calc.start({
            region: 'hack',
            ventilation: {
                dwelling_construction: 'masonry', // we know this should be a 0.35
                draught_lobby: true,
                ventilation_type: type,
                suspended_wooden_floor: 0, // no effect
                percentage_draught_proofed: 100,
                number_of_sides_sheltered: 0 // shelter factor = 1
            }
         });

        // goal is
        // adjusted = ((0.1 * storeys - 1) + 0.4 (masonry + windows))
        // so
        // adjusted - 0.4 = 0.1 * (storeys - 1)
        // storeys = 10 * (adjusted - 0.4)  + 1

        input.num_of_floors = 1 + 10 * (adjusted - 0.4); // reset by calc.start
        extend(misc, input);

        var o = calc.ventilation(input);
        var v = o.ventilation;

        expect(v.effective_air_change_rate[0]).toBeCloseTo(result);

        return o;
    };

    // fiddle table U2 - this is not exactly wonderful but it makes the expectations easier to check
    datasets.table_u2['hack'] = {};
    for (var i = 0; i<12; i++) datasets.table_u2['hack'][i] = 4;

    it("uses correct default values", function () {
        var v = calc.ventilation(calc.start({})).ventilation;
        expect(v.number_of_chimneys).toEqual(0);
        expect(v.number_of_openflues).toEqual(0);
        expect(v.number_of_intermittentfans).toEqual(0);
        expect(v.number_of_passivevents).toEqual(0);
        expect(v.number_of_fluelessgasfires).toEqual(0);
        expect(v.air_permeability_test).toEqual(false);
        expect(v.air_permeability_value).toEqual(0);
        expect(v.dwelling_construction).toEqual('timberframe');
        expect(v.suspended_wooden_floor).toEqual(0);
        expect(v.draught_lobby).toEqual(false);
        expect(v.percentage_draught_proofed).toEqual(0);
        expect(v.number_of_sides_sheltered).toEqual(0);
        expect(v.ventilation_type).toEqual('d');
        expect(v.system_air_change_rate).toEqual(0);
        expect(v.balanced_heat_recovery_efficiency).toEqual(100);
    });

    it("adds 40 m3/hr for chimneys",           check_ach_for('number_of_chimneys', 40));
    it("adds 20 m3/hr for open flues",         check_ach_for('number_of_openflues', 20));
    it("adds 10 m3/hr for intermittent fans",  check_ach_for('number_of_intermittentfans', 10));
    it("adds 10 m3/hr for passive vents",      check_ach_for('number_of_passivevents', 10));
    it("adds 40 m3/hr for flueless gas fires", check_ach_for('number_of_fluelessgasfires', 40));


    it("uses the shelter factor depending on number of sheltered sides", function() {
        // (41 storeys - 1) * 0.1 = 4
        // + 0.35 due to masonry construction (timber is not correct)
        // + 0.05 due to window infil
        // = 4.4

        // * shelter factor =
        // = 3.74

        check_ach_for_sides_and_storeys_and_construction_and_floor(2, 41,'masonry',false, 3.74); // 1 - (0.075 * 2) = 0.85
        check_ach_for_sides_and_storeys_and_construction_and_floor(3, 41,'masonry',false, 3.41); // 1 - (0.075 * 3) = 0.775
        check_ach_for_sides_and_storeys_and_construction_and_floor(4, 41,'masonry',false, 3.08); // 1 - (0.075 * 4) = 0.7
    });

    it("adds 0.1 ach/hr for storeys", function() {
        // similar to above, except without shelter factor
        check_ach_for_sides_and_storeys_and_construction_and_floor(0, 41, 'masonry',false, 4.4);
        check_ach_for_sides_and_storeys_and_construction_and_floor(0, 51, 'masonry',false, 5.4);
        check_ach_for_sides_and_storeys_and_construction_and_floor(0, 61, 'masonry',false, 6.4);
    });

    it("adds 0.25 ach/hr for timber and steel frames", function() {
        // so this ought to be
        // 1 from storeys (this is just to make it go big enough to not get adjusted in (24d))
        // 0.25 due to timber construction
        // 0.05 due to windows
        // * shelter factor which is 1
        // = 1.3

        check_ach_for_sides_and_storeys_and_construction_and_floor(0, 11, 'timberframe', false, 1.3);
    });

    it("adds 0.35 ach/hr for masonry construction", function() {
        // as above but + 0.1 more
        check_ach_for_sides_and_storeys_and_construction_and_floor(0, 11, 'masonry', false, 1.4);
    });

    it("adds 0.2 ach/hr for unsealed timber floors", function() {
        check_ach_for_sides_and_storeys_and_construction_and_floor(0, 11, 'masonry', 'unsealed', 1.6);
    });

    it("adds 0.1 ach/hr for sealed timber floors", function() {
        check_ach_for_sides_and_storeys_and_construction_and_floor(0, 11, 'masonry', 'sealed', 1.5);
    });

    it("calculates (25) = (22) when MVHR and efficiency = 100%", function() {
        // when efficiency is 100, we have input = output
        check_ach_with_ventilation_type('a', 10, {}, 10);
        check_ach_with_ventilation_type('a', 20, {}, 20);
    });

    it("calculates (25) = (22) + system_air_change_rate when MVHR and efficiency = 0%", function() {
        check_ach_with_ventilation_type('a', 10, {ventilation:{
            system_air_change_rate: 10,
            balanced_heat_recovery_efficiency: 0}}, 20);
        check_ach_with_ventilation_type('a', 20, {ventilation:{
            system_air_change_rate: 0.5,
            balanced_heat_recovery_efficiency: 0}}, 20.5);
    });

     it("calculates (25) = (22) + system_air_change_rate/2 when MVHR and efficiency = 1/2", function() {
        check_ach_with_ventilation_type('a', 10, {ventilation:{
            system_air_change_rate: 10,
            balanced_heat_recovery_efficiency: 50}}, 15);
    });

    it("calculates ach MV as base ach rate + system ach rate", function() {
        check_ach_with_ventilation_type('b', 10, {}, 10);
        check_ach_with_ventilation_type('b', 10, {ventilation:{system_air_change_rate:10}}, 20);
    });

    it("calculates ach with whole house extract ventilation as system ach rate if (22b) < 0.5 system ach rate", function() {
        check_ach_with_ventilation_type('c', 4.9, {ventilation:{system_air_change_rate:10}}, 10);
    });

    it("calculates ach with whole house extract ventilation as (22b) + 0.5 * system ach rate if (22b) >= system rate", function() {
        check_ach_with_ventilation_type('c', 0.5, {ventilation:{system_air_change_rate:0.5}}, 0.75);
    });

    it("calculates ach with natural ventilation using 0.5 + 0.5 (ach squared) when ach < 1", function() {
        check_ach_with_ventilation_type('d', 0.5, {}, 0.5 + 0.5 * 0.5 * 0.5);
        check_ach_with_ventilation_type('d', 0.1, {}, 0.5 + 0.5 * 0.1 * 0.1);
        check_ach_with_ventilation_type('d', 0,   {}, 0.5);
    });

    it("calculates the ventilation heat loss as volume * ach rate / 3", function() {
        var result = check_ach_with_ventilation_type('d', 10, {volume:100}, 10);
        // check the heat loss is 10 * volume / 3
        expect(result.ventilation.average_WK).toBeCloseTo( 10 * 100 * 0.33 );
        for (var m = 0; m<12; m++)
            expect(result.losses_WK.ventilation[m]).toBeCloseTo(10*100 * 0.33);
    });
});

// Local Variables:
// js2-additional-externs: ("calc" "describe" "it" "expect" "extend" "ncopies")
// End:
