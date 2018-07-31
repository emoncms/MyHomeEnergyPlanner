var view_html = {};
var report_html = {};

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
function load_report(eid, view)
{
    // if report in cache, we load it from there
    if (report_html[view] != undefined) {
        $(eid).html(report_html[view]);
        return report_html[view];
    }

    // Load report html 
    var result_html = "";
    $.ajax({url: jspath + "reports/" + view + "/" + view + ".html", async: false, cache: false, success: function (data) {
            result_html = data;
        }});

    $(eid).html(result_html);

    // Load the report javascript
    $.ajax({
        url: jspath + "reports/" + view + "/" + view + ".js",
        dataType: 'script',
        async: false
    });

    report_html[view] = result_html;

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

function varget(key)
{
    var p = key.split('.');
    var val = false;

    switch (p.length) {
        case 0:
            break;
        case 1:
            try {
                val = window[p[0]];
            } catch (err) {
            }
            break;
        case 2:
            try {
                val = window[p[0]][p[1]];
            } catch (err) {
            }
            break;
        case 3:
            try {
                val = window[p[0]][p[1]][p[2]];
            } catch (err) {
            }
            break;
        case 4:
            try {
                val = window[p[0]][p[1]][p[2]][p[3]];
            } catch (err) {
            }
            break;
        case 5:
            try {
                val = window[p[0]][p[1]][p[2]][p[3]][p[4]];
            } catch (err) {
            }
            break;
        case 6:
            try {
                val = window[p[0]][p[1]][p[2]][p[3]][p[4]][p[5]];
            } catch (err) {
            }
            break;
    }
    return val;
}

function InitUI()
{
    // Call page specific updateui function
    if (report == undefined)
        var functionname = page + "_initUI";
    else
        var functionname = report + "_initUI";
    if (window[functionname] != undefined)
        window[functionname]();

    $(".monthly").each(function () {

        var name = $(this).attr('key');
        var dp = $(this).attr('dp');
        var title = $(this).attr('title');
        var units = $(this).attr('units');

        var out = "";
        var sum = 0;
        for (var m = 0; m < 12; m++)
        {
            out += "<td key='" + name + "." + m + "' dp=" + dp + " units='" + units + "'></td>";
            sum += varget(name + "." + m);
        }
        var mean = sum / 12.0;

        $(this).html("<tr><td>" + title + "</td><td>sum:" + sum.toFixed(dp) + "<br>mean:" + mean.toFixed(dp) + "</td>" + out + "</tr>");
    });

    $('.scenario-name').html("<h2>" + scenario.charAt(0).toUpperCase() + scenario.slice(1) + ' - ' + data.scenario_name + "</h2>");
}

function UpdateUI(data)
{
    // Call page specific updateui function
    if (report == undefined)
        var functionname = page + "_UpdateUI";
    else
        var functionname = report + "_UpdateUI";
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
function alert_if_assessment_locked(data) {
    if (data === "Assessment locked") {
        $('#modal-assessment-locked').modal('show');
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


/************************
 **  Hours off
 ************************/
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


/************************
 **  Cost of measures
 ************************/
function measures_costs(scenario) {
    var measures_total_cost = 0;
    if (project[scenario].fabric.measures != undefined)
        measures_total_cost += cost_of_measures_by_id(project[scenario].fabric.measures);
    if (project[scenario].measures.ventilation != undefined) {
        if (project[scenario].measures.ventilation.extract_ventilation_points != undefined)
            measures_total_cost += cost_of_measures_by_id(project[scenario].measures.ventilation.extract_ventilation_points);
        if (project[scenario].measures.ventilation.intentional_vents_and_flues != undefined)
            measures_total_cost += cost_of_measures_by_id(project[scenario].measures.ventilation.intentional_vents_and_flues);
        if (project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined)
            measures_total_cost += cost_of_measures_by_id(project[scenario].measures.ventilation.intentional_vents_and_flues_measures);
        if (project[scenario].measures.ventilation.draught_proofing_measures != undefined)
            measures_total_cost += project[scenario].measures.ventilation.draught_proofing_measures.measure.cost_total;
        if (project[scenario].measures.ventilation.ventilation_systems_measures != undefined)
            measures_total_cost += project[scenario].measures.ventilation.ventilation_systems_measures.measure.cost_total;
        if (project[scenario].measures.ventilation.clothes_drying_facilities != undefined)
            measures_total_cost += cost_of_measures_by_id(project[scenario].measures.ventilation.clothes_drying_facilities);
    }
    if (project[scenario].measures.water_heating != undefined) {
        if (project[scenario].measures.water_heating.water_usage != undefined)
            measures_total_cost += cost_of_measures_by_id(project[scenario].measures.water_heating.water_usage);
        if (project[scenario].measures.water_heating.storage_type != undefined)
            measures_total_cost += project[scenario].measures.water_heating.storage_type.measure.cost_total;
        if (project[scenario].measures.water_heating.pipework_insulation != undefined)
            measures_total_cost += project[scenario].measures.water_heating.pipework_insulation.measure.cost_total;
        if (project[scenario].measures.water_heating.hot_water_control_type != undefined)
            measures_total_cost += project[scenario].measures.water_heating.hot_water_control_type.measure.cost_total;
    }
    if (project[scenario].measures.space_heating_control_type != undefined)
        measures_total_cost += cost_of_measures_by_id(project[scenario].measures.space_heating_control_type);
    if (project[scenario].measures.heating_systems != undefined)
        measures_total_cost += cost_of_measures_by_id(project[scenario].measures.heating_systems);
    if (project[scenario].use_generation == 1 && project[scenario].measures.PV_generation != undefined) {
        measures_total_cost += project[scenario].measures.PV_generation.measure.cost_total;
    }
    if (project[scenario].measures.LAC != undefined) {
        if (project[scenario].measures.LAC.lighting != undefined)
            measures_total_cost += project[scenario].measures.LAC.lighting.measure.cost_total;
    }
    return measures_total_cost;
}
function cost_of_measures_by_id(list_of_measures_by_id) {
    var cost = 0;
    for (var id in list_of_measures_by_id) {
        cost += list_of_measures_by_id[id].measure.cost_total;
    }
    return cost;
}
function add_quantity_and_cost_to_measure(measure) { // Add extra properties to measure 
    if (measure.cost_units == 'sqm') {
        if (measure.EWI != undefined && measure.EWI == true) // ares of EWI is bigger than the actual area of the wall
            measure.area != undefined ? measure.quantity = 1.15 * measure.area : measure.quantity = 0; // We use measure.area not measure.netarea (See issue 382: https://github.com/emoncms/MyHomeEnergyPlanner/issues/382#event-1681266801)
        else
            measure.area != undefined ? measure.quantity = 1.0 * measure.area : measure.quantity = 0;
    }
    else if (measure.cost_units == 'ln m')
        measure.perimeter != undefined ? measure.quantity = 1.0 * measure.perimeter : measure.quantity = 0;
    else if (measure.cost_units == 'unit')
        measure.quantity = 1;
    else {
        measure.quantity = 1;
        measure.cost_units = 'unit';
    }
    if (measure.min_cost != undefined)
        measure.cost_total = 1.0 * measure.min_cost + 1.0 * measure.quantity * measure.cost;
    else
        measure.cost_total = 1.0 * measure.quantity * measure.cost;

        measure.cost_total = 1.0 * measure.cost_total.toFixed(2);
}


/************************
 **  Revert to original
 ************************/
function init_revert_to_original_by_id(selector, item_id, type_of_item) {
    selector = selector + ' .revert-to-original[item-id="' + item_id + '"]';
    if (scenario != 'master') {
        if (measure_applied_to_item_by_id(type_of_item, item_id) != false && data.created_from != undefined) {
            if (data.created_from == 'master')
                $(selector + ' .text').html('Revert to master');
            else {
                var html = 'Revert to Scenario ' + data.created_from.split('scenario')[1];
                $(selector + ' .text').html(html);
            }
            $(selector).show();
            // Check original element still exists, it may have been deleted
            if (item_exists_in_original(data.created_from, item_id, type_of_item) == false) {
                $(selector).removeClass('revert-to-original').css('cursor', 'default').html('Original element doesn\'t<br />exist, cannot revert');
                return;
            }
            $('#openbem').on('click', selector, function () {
                revert_to_original(item_id, type_of_item)
            });
        }
        else {
            $(selector).hide();
        }
    }
    else {
        $(selector).hide();
    }
}
function measure_applied_to_item_by_id(type_of_item, item_id) {
    var measures_by_id = {};
    switch (type_of_item) {
        case'fabric-elements':
            measures_by_id = data.fabric.measures;
            break;
        case'ventilation-EVP':
            measures_by_id = data.measures.ventilation.extract_ventilation_points;
            break;
        default:
            console.error('Type of item not valid');
    }
    for (var measure_id in measures_by_id) {
        if (measure_id == item_id)
            return true;
        /*else if (measure_applied_in_bulk(element_id) != false) {
         return true;
         }*/
    }
    return false;
}
function item_exists_in_original(original_scenario, item_id, type_of_item) {
    var items_array = [];
    switch (type_of_item) {
        case'fabric-elements':
            items_array = project[original_scenario].fabric.elements;
            break;
        case'ventilation-EVP':
            items_array = project[original_scenario].ventilation.EVP
            break;
        default:
            console.error('Type of item not valid');
    }
    for (var e in items_array) {
        if (items_array[e].id == item_id)
            return true;
    }
    return false;
}
function revert_to_original(item_id, type_of_item) {
    if (item_exists_in_original(data.created_from, item_id, type_of_item) == true) {
        var original_items_array = [];
        var current_items_array = [];
        var measures_by_id = {};
        switch (type_of_item) {
            case'fabric-elements':
                original_items_array = project[data.created_from].fabric.elements;
                current_items_array = data.fabric.elements;
                measures_by_id = data.fabric.measures;
                break;
            case'ventilation-EVP':
                original_items_array = project[data.created_from].ventilation.EVP;
                current_items_array = data.ventilation.EVP;
                measures_by_id = data.measures.ventilation.extract_ventilation_points;
                break;
            default:
                console.error('Type of item not valid');
        }
        // copy the original element 
        for (var e in original_items_array) {
            if (original_items_array[e].id == item_id) {
                current_items_array[get_item_index_by_id(item_id, current_items_array)] = JSON.parse(JSON.stringify(original_items_array[e]));
                break;
            }
        }
        // delete measure
        delete(measures_by_id[item_id]);
        /*var applied_in_bulk = measure_applied_in_bulk(item_id);
         if (applied_in_bulk == false)
         delete(measures_by_id[item_id]);
         else
         delete(measures_by_id[applied_in_bulk].original_elements[item_id]);*/

    }
    /*elements_initUI();*/
    update();
}
function get_item_index_by_id(id, array) {
    for (var index in array) {
        if (array[index].id == id)
            return index;
    }
}
