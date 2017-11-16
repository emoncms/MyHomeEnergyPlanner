var view_html = {};

function load_view(eid, view)
{
    if (view_html[view] != undefined) {
        $(eid).html(view_html[view]);
        return view_html[view];
    }

    var result_html = "";
    $.ajax({url: jspath + "views/" + view + ".html", async: false, cache: false, success: function (data) {
            result_html = data;
        }});

    $(eid).html(result_html);

    // Load js
    $.ajax({
        url: jspath + "views/" + view + ".js",
        dataType: 'script',
        async: false
    });

    view_html[view] = result_html;

    return result_html;
}

function varset(key, value)
{
    var lastval = "";
    var p = key.split('.');

    switch (p.length) {
        case 0:
            break;
        case 1:
            lastval = window[p[0]];
            window[p[0]] = value;
            break;
        case 2:
            lastval = window[p[0]][p[1]];
            window[p[0]][p[1]] = value;
            break;
        case 3:
            lastval = window[p[0]][p[1]][p[2]];
            window[p[0]][p[1]][p[2]] = value;
            break;
        case 4:
            lastval = window[p[0]][p[1]][p[2]][p[3]];
            window[p[0]][p[1]][p[2]][p[3]] = value;
            break;
        case 5:
            lastval = window[p[0]][p[1]][p[2]][p[3]][p[4]];
            window[p[0]][p[1]][p[2]][p[3]][p[4]] = value;
            break;
        case 6:
            lastval = window[p[0]][p[1]][p[2]][p[3]][p[4]][p[5]];
            window[p[0]][p[1]][p[2]][p[3]][p[4]][p[5]] = value;
            break;
    }
    return lastval;
}

function InitUI()
{
    // Call page specific updateui function
    var functionname = page + "_initUI";
    if (window[functionname] != undefined)
        window[functionname]();

    $(".monthly").each(function () {

        var name = $(this).attr('key');
        var dp = $(this).attr('dp');
        var title = $(this).attr('title');
        var units = $(this).attr('units');

        var out = "<td>" + title + "</td>";
        for (var m = 0; m < 12; m++)
        {
            out += "<td key='" + name + "." + m + "' dp=" + dp + " units='" + units + "'></td>";
        }

        $(this).html("<tr>" + out + "</tr>");
    });
}

function UpdateUI(data)
{
    // Call page specific updateui function
    var functionname = page + "_UpdateUI";
    if (window[functionname] != undefined)
        window[functionname]();

    getkeys('data', data);

    for (z in keys)
    {
        var value = keys[z];
        var target = $("[key='" + z + "']");

        if (target.length) {

            var dp = 1 * target.attr('dp');
            var units = target.attr('units');
            if (!isNaN(dp))
                value = (1 * value).toFixed(dp);

            if (units != undefined)
                value += "" + units;

            if (target.is('span')) {
                target.html(value);
            }
            else if (target.is('input[type=text]')) {
                target.val(value);
            }
            else if (target.is('input[type=number]')) {
                target.val(value);
            }
            else if (target.is('input[type=checkbox]')) {
                target.prop('checked', value);
            }
            else if (target.is('input[type=hidden]')) {
                target.val(value);
            }
            else if (target.is('textarea')) {
                target.html(value);
            }
            else if (target.is('select')) {
                target.val(value);
            }
            else if (target.is('td')) {
                target.html(value);
            }
            else if (target.is('th')) {
                target.html(value);
            }
            else if (target.is('div')) {
                target.html(value);
            }
        }
    }
}

function getkeys(key, val)
{
    switch (typeof val) {
        case "object":
            for (subkey in val)
                getkeys(key + "." + subkey, val[subkey]);
            break;
        case "string":
            keys[key] = val;
            break;
        case "number":
            keys[key] = val;
            break;
        case "boolean":
            keys[key] = val;
            break;
    }
}

function getuikeys()
{
    var uikeys = [];
    $("[key]").each(function () {
        uikeys.push($(this).attr('key'));
    });
    return uikeys;
}

Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};

function alertifnotlogged(data) {
    if (data === "Not logged") {
        $('#modal-error-submitting-data').show();
    }
}

function get_fuels_for_select(category_to_show) {
    // Group fuels by category
    var fuels_by_category = {};
    for (var fuel in data.fuels) {
        var category = data.fuels[fuel].category;
        if (fuels_by_category[category] == undefined)
            fuels_by_category[category] = [];
        fuels_by_category[category].push(fuel);
    }

    // Generate output string according to the category passed to the function, if the category exist we return optionns for that category, if it doesn't exist we return all the fuel sorted by category
    var options = '';
    if (fuels_by_category[category_to_show] != undefined) {
        for (fuel in data.fuels) {
            if (data.fuels[fuel].category == category_to_show)
                options += '<option value="' + fuel + '">' + fuel + '</option>';
        }
    }
    else {
        for (category in fuels_by_category) {
            if (category != 'generation') {
                options += '<optgroup label="' + category + '">';
                for (index in fuels_by_category[category])
                    options += '<option value="' + fuels_by_category[category][index] + '">' + fuels_by_category[category][index] + '</option>';
                options += '</optgroup>';
            }
        }
    }
    return options;
}

function get_a_fuel(type_of_fuel) { // Returns the first fuel for a specific type found in data.fuels for a specific type
    for (var fuel in data.fuels) {
        if (data.fuels[fuel].category == type_of_fuel)
            return fuel;
    }
}

function get_fuel_categories() {
    var categories = [];
    for (var fuel in project.master.fuels) {
        if (categories.indexOf(project.master.fuels[fuel].category) === -1)
            categories.push(project.master.fuels[fuel].category);
    }
    return categories;
}

function add_quantity_and_cost_to_measure(measure) { // Add extra properties to measure 
    if (measure.cost_units == 'sqm') {
        if (measure.EWI != undefined && measure.EWI == true) // are of EWI is bigger than the actual area of the wall
            measure.area != undefined ? measure.quantity = 1.15 * measure.area : measure.quantity = 0;
        else
            measure.area != undefined ? measure.quantity = measure.area : measure.quantity = 0;
    }
    else if (measure.cost_units == 'ln m')
        measure.perimeter != undefined ? measure.quantity = measure.perimeter : measure.quantity = 0;
    else if (measure.cost_units == 'unit')
        measure.quantity = 1;
    else {
        measure.quantity = 1;
        measure.cost_units = 'unit';
    }
    measure.cost_total = measure.quantity * measure.cost;

}

function get_hours_off_weekday(data) {
    var hours_off = [];
    if (project.master.household['3a_heatinghours_weekday_off3_hours'] != undefined
            && project.master.household['3a_heatinghours_weekday_off3_mins'] != undefined
            && (project.master.household['3a_heatinghours_weekday_on3_hours'] != project.master.household['3a_heatinghours_weekday_off3_hours']
                    || project.master.household['3a_heatinghours_weekday_on3_mins'] != project.master.household['3a_heatinghours_weekday_off3_mins'])) {
        var time_on_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_on1_hours'], project.master.household['3a_heatinghours_weekday_on1_mins'], 0, 0);
        var time_off_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_off1_hours'], project.master.household['3a_heatinghours_weekday_off1_mins'], 0, 0);
        var time_on_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_on2_hours'], project.master.household['3a_heatinghours_weekday_on2_mins'], 0, 0);
        var time_off_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_off2_hours'], project.master.household['3a_heatinghours_weekday_off2_mins'], 0, 0);
        var time_on_3 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_on3_hours'], project.master.household['3a_heatinghours_weekday_on3_mins'], 0, 0);
        var time_off_3 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_off3_hours'], project.master.household['3a_heatinghours_weekday_off3_mins'], 0, 0);
        hours_off = (get_hours_three_periods(time_on_1, time_off_1, time_on_2, time_off_2, time_on_3, time_off_3));

    }
    else if (project.master.household['3a_heatinghours_weekday_off2_hours'] != undefined
            && project.master.household['3a_heatinghours_weekday_off2_mins'] != undefined
            && (project.master.household['3a_heatinghours_weekday_on2_hours'] != project.master.household['3a_heatinghours_weekday_off2_hours']
                    || project.master.household['3a_heatinghours_weekday_on2_mins'] != project.master.household['3a_heatinghours_weekday_off2_mins'])) {
        var time_on_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_on1_hours'], project.master.household['3a_heatinghours_weekday_on1_mins'], 0, 0);
        var time_off_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_off1_hours'], project.master.household['3a_heatinghours_weekday_off1_mins'], 0, 0);
        var time_on_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_on2_hours'], project.master.household['3a_heatinghours_weekday_on2_mins'], 0, 0);
        var time_off_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_off2_hours'], project.master.household['3a_heatinghours_weekday_off2_mins'], 0, 0);
        hours_off = (get_hours_two_periods(time_on_1, time_off_1, time_on_2, time_off_2));
    }
    else if (project.master.household['3a_heatinghours_weekday_off1_hours'] != project.master.household['3a_heatinghours_weekday_on1_hours'] || project.master.household['3a_heatinghours_weekday_off1_mins'] != project.master.household['3a_heatinghours_weekday_on1_mins']) {
        var time_off = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_off1_hours'], project.master.household['3a_heatinghours_weekday_off1_mins'], 0, 0);
        var time_on = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekday_on1_hours'], project.master.household['3a_heatinghours_weekday_on1_mins'], 0, 0);
        hours_off.push(get_hours_off_one_period(time_on, time_off));
    }
    else
        hours_off.push(0);
    return hours_off;
}


function get_hours_off_weekend(data) {
    var hours_off = [];
    if (project.master.household['3a_heatinghours_weekend_off3_hours'] != undefined
            && project.master.household['3a_heatinghours_weekend_off3_mins'] != undefined
            && (project.master.household['3a_heatinghours_weekend_on3_hours'] != project.master.household['3a_heatinghours_weekend_off3_hours']
                    || project.master.household['3a_heatinghours_weekend_on3_mins'] != project.master.household['3a_heatinghours_weekend_off3_mins'])) {
        var time_on_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_on1_hours'], project.master.household['3a_heatinghours_weekend_on1_mins'], 0, 0);
        var time_off_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_off1_hours'], project.master.household['3a_heatinghours_weekend_off1_mins'], 0, 0);
        var time_on_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_on2_hours'], project.master.household['3a_heatinghours_weekend_on2_mins'], 0, 0);
        var time_off_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_off2_hours'], project.master.household['3a_heatinghours_weekend_off2_mins'], 0, 0);
        var time_on_3 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_on3_hours'], project.master.household['3a_heatinghours_weekend_on3_mins'], 0, 0);
        var time_off_3 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_off3_hours'], project.master.household['3a_heatinghours_weekend_off3_mins'], 0, 0);
        hours_off = (get_hours_three_periods(time_on_1, time_off_1, time_on_2, time_off_2, time_on_3, time_off_3));

    }
    else if (project.master.household['3a_heatinghours_weekend_off2_hours'] != undefined
            && project.master.household['3a_heatinghours_weekend_off2_mins'] != undefined
            && (project.master.household['3a_heatinghours_weekend_on2_hours'] != project.master.household['3a_heatinghours_weekend_off2_hours']
                    || project.master.household['3a_heatinghours_weekend_on2_mins'] != project.master.household['3a_heatinghours_weekend_off2_mins'])) {
        var time_on_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_on1_hours'], project.master.household['3a_heatinghours_weekend_on1_mins'], 0, 0);
        var time_off_1 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_off1_hours'], project.master.household['3a_heatinghours_weekend_off1_mins'], 0, 0);
        var time_on_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_on2_hours'], project.master.household['3a_heatinghours_weekend_on2_mins'], 0, 0);
        var time_off_2 = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_off2_hours'], project.master.household['3a_heatinghours_weekend_off2_mins'], 0, 0);
        hours_off = (get_hours_two_periods(time_on_1, time_off_1, time_on_2, time_off_2));
    }
    else if (project.master.household['3a_heatinghours_weekend_off1_hours'] != project.master.household['3a_heatinghours_weekend_on1_hours'] || project.master.household['3a_heatinghours_weekend_off1_mins'] != project.master.household['3a_heatinghours_weekend_on1_mins']) {
        var time_off = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_off1_hours'], project.master.household['3a_heatinghours_weekend_off1_mins'], 0, 0);
        var time_on = new Date(2000, 1, 1, project.master.household['3a_heatinghours_weekend_on1_hours'], project.master.household['3a_heatinghours_weekend_on1_mins'], 0, 0);
        hours_off.push(get_hours_off_one_period(time_on, time_off));
    }
    else
        hours_off.push(0);
    return hours_off;
}

function get_hours_off_one_period(time_on, time_off) {
    if (time_on > time_off)  // heating is on before midnight and off after midnight
        return(Math.abs(time_off - time_on) / 36e5);
    else {
        time_on.setDate(time_on.getDate() + 1);
        return(Math.abs(time_on - time_off) / 36e5);
    }
}

function get_hours_two_periods(time_on_1, time_off_1, time_on_2, time_off_2) {
    var hours_off = [];
    hours_off.push((time_on_2 - time_off_1) / 36e5);
    hours_off.push(get_hours_off_one_period(time_on_1, time_off_2));
    return hours_off;
}

function get_hours_three_periods(time_on_1, time_off_1, time_on_2, time_off_2, time_on_3, time_off_3) {
    var hours_off = [];
    hours_off.push((time_on_2 - time_off_1) / 36e5);
    hours_off.push((time_on_3 - time_off_2) / 36e5);
    hours_off.push(get_hours_off_one_period(time_on_1, time_off_3));
    return hours_off;
}
 