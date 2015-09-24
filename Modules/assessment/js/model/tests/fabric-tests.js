describe("The fabric function", function() {
    // data.fabric.elements
    it("calculates the specific heat loss using areas", function () {
        var data = calc.fabric(calc.start({
            fabric:{
                thermal_bridging_yvalue:0,
                elements: [
                    {area: 10, type: 'wall', uvalue: 2, kvalue: 1}
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
                    {area: 1, l: 2, h: 5, type: 'wall', uvalue: 2, kvalue: 1}
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
                    {area: 20, type: 'wall', uvalue: 2, kvalue: 1},
                    {area: 10, type:'window', uvalue:0, kvalue:0, subtractfrom: 0, overshading: 0
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

    it("calculates solar gains from windows", function () {
        // given a window, we expect some gains.
        var data = calc.fabric(calc.start({
            region: 0, // uk mean region [26 54 96 150 192 200 189 157 115 66 33 21]
            fabric:{
                thermal_bridging_yvalue:0,
                elements: [
                    {area: 1,
                     type:'window',
                     uvalue:1,
                     kvalue:0,
                     subtractfrom: 0,
                     overshading: 3,  // this makes access factors 1
                     orientation: 0, // north
                     // these two also come out as 1, ideally
                     g: 1,
                     ff: 1}
                ]
            }
         }));

        // values to check
        // data.fabric.elements[0].gain
        // data.fabric.annual_solar_gain
        // data.gains_W["solar"] -> monthly gains
        // data.GL

        // gains are supposed to be
        // access factor * area * flux * 0.9 * g perp * FF
        //    6d                   U3            6b     6c

        // above sets most of these to 1
        // so we just have flux * 0.9 [U3]

        // flux from the list above, with an orientation factor
        // decl_m [-20.7 -12.8 -1.8 9.8 18.8 23.1 21.2 13.7 2.9 -8.7 -18.4 -23.0]

        var  month           =  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var  regional_insol  =  [26,     54,     96,    150,  192,   200,   189,   157,   115,  66,    33,     21];
        var  declination     =  [-20.7,  -12.8,  -1.8,  9.8,  18.8,  23.1,  21.2,  13.7,  2.9,  -8.7,  -18.4,  -23.0];
        // the sap table U5 in datasets appears different??
        // copy pasted from p176
        var U5 = function(orientation, thing) {
            var H = ["k",   "north",   "ne/nw",  "e/w",      "sw,sw",  "south"];
            var U5 =
                    [
                        ["k1",  26.3,    0.165   ,1.44,    -2.95,  -0.66],
                        ["k2",  -38.5,   -3.68   ,-2.36,   2.89,   -0.106],
                        ["k3",  14.8,    3.0     ,1.07,    1.17,   2.93],
                        ["k4",  -16.5,   6.38    ,-0.514,  5.67,   3.63],
                        ["k5",  27.3,    -4.53   ,1.89,    -3.54,  -0.374],
                        ["k6",  -11.9,   -0.405  ,-1.64,   -4.28,  -7.4],
                        ["k7",  -1.06,   -4.38   ,-0.542,  -2.72,  -2.71],
                        ["k8",  0.0872,  4.89    ,-0.757,  -0.25,  -0.991],
                        ["k9",  -0.191,  -1.99   ,0.604,   3.07,   4.59]
                    ];
            var col = H.indexOf(orientation);

            var out = U5.map(function(row) {
                if (row[0] === thing) {
                    return 0.0 + row[col];
                } else {
                    return 0;
                }
            }).reduce(function(a, b){return a+b;}, 0);

            return out;
        };

        var pangle = 90 * Math.PI / 180;
        var S = Math.sin(pangle / 2);

        var A = U5("north", "k1") * S + U5("north", "k2") * S + U5("north", "k3") * S;
        var B = U5("north", "k4") * S + U5("north", "k5") * S + U5("north", "k6") * S;
        var C = U5("north", "k7") * S + U5("north", "k8") * S + U5("north", "k9") * S + 1;

        var rad = month.map(function(ix) {
            var ins = regional_insol[ix];
            var dec = declination[ix];

            var angle = (53.5 - dec) * Math.PI / 180;

            var factor = A * Math.cos(angle) + B * Math.cos(angle) + C;

            return ins * factor * 0.9;
        });


        expect(data.gains_W.solar).toEqual(rad);
    });

    it("calculates the external area by looking at u-values", function () {
        var data = calc.fabric(calc.start({
            fabric:{
                thermal_bridging_yvalue:0,
                elements: [
                    {area: 20, type: 'wall', uvalue: 2, kvalue: 1},
                    {area: 10, type:'wall', uvalue:0, kvalue:0}
                ]

            }
        }));

        expect(data.fabric.total_external_area).toBeCloseTo(20);
    });

    it("calculates thermal mass from k-value area inner product", function () {
        var data = calc.fabric(calc.start({fabric: {
            elements: [
                {area: 10, type: 'wall', kvalue:1},
                {area: 5, type: 'wall', kvalue:2},
                {area: 11, type: 'wall', kvalue:3}
            ]
        }}));
        expect(data.fabric.total_thermal_capacity).toBeCloseTo(33 + 20);
    });

    it("uses the default thermal bridging yvalue of 0.15", function () {
        var data = calc.fabric(calc.start({
            fabric:{
                elements: [
                    {l: 2, h: 5, type: 'wall', uvalue: 2, kvalue: 1}
                ]
            }
        }));

        expect(data.fabric.total_wall_WK).toEqual(20);
        expect(data.fabric.thermal_bridging_heat_loss).toEqual(0.15 * 10);
        expect(data.fabric.total_heat_loss_WK).toEqual(20 + 0.15 * 10); // external area is 10
    });

    it("can use another thermal bridging yvalue if you like", function () {
        var data = calc.fabric(calc.start({
            fabric:{
                thermal_bridging_yvalue: 0.1,
                elements: [
                    {l: 2, h: 5, type: 'wall', uvalue: 2, kvalue: 1}
                ]
            }
        }));

        expect(data.fabric.total_wall_WK).toEqual(20);
        expect(data.fabric.thermal_bridging_heat_loss).toEqual(0.1 * 10);
        expect(data.fabric.total_heat_loss_WK).toEqual(20 + 0.1 * 10);
    });

    it("calculates the thermal mass parameter", function () {
        // this is heat capacity / floor area
        var data = calc.start({
            fabric: {
                elements: [ {area: 10, type: 'wall', kvalue:1} ]
            }
        });
        data.TFA = 10;
        data = calc.fabric(data);
        expect(data.TMP).toBeCloseTo(1);
    });

    it("can use a given thermal mass parameter instead", function () {
        var data = calc.start({
            fabric: {
                global_TMP: true,
                global_TMP_value: 2,
                elements: [ {area: 10, type: 'wall', kvalue:1} ]
            }
        });
        data = calc.fabric(data);
        expect(data.TMP).toBeCloseTo(2);
    });
});

// Local Variables:
// js2-additional-externs: ("calc" "describe" "it" "expect")
// End:
