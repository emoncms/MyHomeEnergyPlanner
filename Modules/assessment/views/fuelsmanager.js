console.log('Debug fuelsmanager.js');


function fuelsmanager_initUI() {
    data = project.master;

    // Sort by category
    var fuels_by_category = {};
    for (var fuel in project.master.fuels) {
        var category = project.master.fuels[fuel].category
        if (fuels_by_category[category] == undefined)
            fuels_by_category[category] = [];
        fuels_by_category[category].push(fuel);
    }

    // Sort categories alphabetically
    var categories_sorted = [];

    for (var category in fuels_by_category)
        categories_sorted.push(category);

    categories_sorted.sort(function (a, b) {
        var textA = a[0].toUpperCase();
        var textB = b[0].toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });


    // Add fuels to table
    var html = "";
    for (var category_index in categories_sorted) {
        var category = categories_sorted[category_index];
        html += "<tr style='background-color:#eee'><th class='header' colspan=6>" + category + "</th>";
        html += "<tr>" + $('#fuelsmanager-table-header-template').html() + '</tr>';
        fuels_by_category[category].forEach(function (fuel) {
            html += "<tr>";
            html += "<td>" + fuel + "</td>";
            html += "<td><input style='width:85px;' min=0 step=0.001 type='number' dp=3 key='data.fuels." + fuel + ".co2factor' /></td>";
            html += "<td><input style='width:85px;' min=0 step=0.001 type='number' dp=3 key='data.fuels." + fuel + ".primaryenergyfactor' /></td>";
            html += "<td><input style='width:85px;' min=0 step=0.01 type='number' dp=2 key='data.fuels." + fuel + ".fuelcost' /></td>";
            html += "<td><input style='width:85px;' min=0 step=1 type='number' dp=0 key='data.fuels." + fuel + ".standingcharge' /></td>";
            if (is_in_default_fuels(fuel) == false)
                html += "<td><i class='icon-trash delete-fuel' style='cursor:pointer' fuel='" + fuel + "'></i></td>";
            else
                html += "<td></td>";
            html += "</tr>";
        });

    }

    $('#fuelsmanager-table').append(html);
}

function fuelsmanager_UpdateUI() {
}

$('#openbem').on('click', '.delete-fuel', function () {
    var fuel_to_delete = $(this).attr('fuel');

    var deletable = true;
    var scenarios_that_use_this_fuel = [];
    for (scenario in project) {
        for (var fuel in project[scenario].fuel_totals) {
            if (fuel_to_delete == fuel) {
                deletable = false;
                scenarios_that_use_this_fuel.push(scenario);
            }
        }
    }

    if (deletable) {
        $('#delete_fuel-modal .modal-body').html('Are you sure you want to delete ' + fuel_to_delete + '?');
        $('#delete-fuel-ok').attr('fuel', fuel_to_delete);
        $('#delete_fuel-modal #delete-fuel-ok').show();
    }
    else {
        var html = '<p>' + fuel + ' cannot be deleted.</p><p>It is used in: ' + scenarios_that_use_this_fuel[0];
        scenarios_that_use_this_fuel.forEach(function (scenario, index) {
            if (index > 0)
                html += ', ' + scenario;
        });
        html += '</p>';
        $('#delete_fuel-modal .modal-body').html(html);
        $('#delete_fuel-modal #delete-fuel-ok').hide();
    }

    $('#delete_fuel-modal').modal('show');
});

$('#openbem').on('click', '#delete-fuel-ok', function () {
    var fuel = $(this).attr('fuel');
    console.log(project.master.fuels);
    $(this).removeAttr('fuel');
    delete project.master.fuels[fuel];

    console.log(project.master.fuels);
    fuelsmanager_initUI();
    $('#delete_fuel-modal').modal('hide');
});

$('#openbem').on('click', '#add-fuel', function () {
    var categories = get_fuel_categories();
    $('#new-fuelname').val('');
    $('#new-fuel-category').html('');
    categories.forEach(function (cat) {
        $('#new-fuel-category').append('<option value="' + cat + '">' + cat + '</option>');
    });
    populate_new_fuel_fields();
    $('#add_fuel-modal').modal('show');
});

$('#openbem').on('click', '#add_fuel-ok', function () {
    var new_fuel = {
        category: $('#new-fuel-category').val(),
        co2factor: $('#new-fuel-co2factor').val(),
        primaryenergyfactor: $('#new-fuel-primmaryenergyfactor').val(),
        fuelcost: $('#new-fuel-unitcost').val(),
        standingcharge: $('#new-fuel-annualstandingcharge').val()
    };
    project.master.fuels[$('#new-fuelname').val()] = new_fuel;
    update();
    $('#add_fuel-modal').modal('hide');
});

$('#openbem').on('change', '#new-fuel-category', function () {
    populate_new_fuel_fields();
});

function is_in_default_fuels(fuel) {
    for (f in datasets.fuels) {
        if (fuel == f)
            return true;
    }
    return false;
}

function populate_new_fuel_fields() {
    switch ($('#new-fuel-category').val()) {
        case 'Gas':
            $('#new-fuel-co2factor').val(datasets.fuels['Mains Gas'].co2factor);
            $('#new-fuel-primmaryenergyfactor').val(datasets.fuels['Mains Gas'].primaryenergyfactor);
            break;
        case 'Electricity':
        case 'generation':
            $('#new-fuel-co2factor').val(datasets.fuels['Standard Tariff'].co2factor);
            $('#new-fuel-primmaryenergyfactor').val(datasets.fuels['Standard Tariff'].primaryenergyfactor);
            break;
        case 'Oil':
            $('#new-fuel-co2factor').val(datasets.fuels['Heating Oil'].co2factor);
            $('#new-fuel-primmaryenergyfactor').val(datasets.fuels['Heating Oil'].primaryenergyfactor);
            break;
        case 'Solid fuel':
            $('#new-fuel-co2factor').val(0);
            $('#new-fuel-primmaryenergyfactor').val(0);
            break;
    }
}
