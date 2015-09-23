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
