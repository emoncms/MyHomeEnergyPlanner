function ncopies(n, x) {
    var out = [];
    for (var i = 0; i<n; i++) out.push(x);
    return out;
}

function extend(input, output) {
    if (typeof(input) !== 'object' || typeof(output) !== 'object') return;

    Object.keys(input).forEach(function(key) {
        if (typeof input[key] === 'object') {
            if (typeof output[key] === 'object') {
                extend(input[key], output[key]);
            } else {
                output[key] = {};
                extend(input[key], output[key]);
            }
        } else {
            output[key] = input[key];
        }
    });
}

beforeEach(function() {
    jasmine.addMatchers(
        {
            toEachBeCloseTo: function(util, customequality) {
                return {
                    compare: function(actual, expect) {
                        var result = {};
                        var precision = 2;

                        // now we want to have a look at the types
                        if (actual instanceof Array && expect instanceof Array
                           && actual.length == expect.length) {

                            var errors = [];
                            // this is tiresome but I don't know a better way
                            for (var i = 0; i<actual.length; i++) {
                                var a = actual[i];
                                var b = expect[i];
                                var pass = Math.abs(b - a) < (Math.pow(10, -precision) / 2);
                                if (!pass) errors.push(i);
                            }

                            if (errors.length > 0) {
                                return {pass:false,
                                        message: 'Expected pairwise members of arrays to be close to each other: ' +
                                        errors.map(function(ix) {return "element " + ix + ": " + actual[ix] + " /= " + expect[ix];})
                                       };
                            } else {
                                return {pass:true};
                            }
                        } else {
                            return {pass: false,
                                    message: actual + ' and ' + expect + ' are not arrays of equal length'};
                        }
                    }
                };
            }
        }
    );
});
