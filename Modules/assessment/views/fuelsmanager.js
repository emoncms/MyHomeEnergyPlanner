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
        html += "<tr style='background-color:#eee'><th class='header' colspan=5>" + category + "</th>";
        html += "<tr>" + $('#fuelsmanager-table-header-template').html() + '</tr>';
        fuels_by_category[category].forEach(function (fuel) {
            html += "<tr>";
            html += "<td>" + fuel + "</td>";
            html += "<td><input style='width:85px;' min=0 step=0.001 type='number' dp=3 key='data.fuels." + fuel + ".co2factor' /></td>";
            html += "<td><input style='width:85px;' min=0 step=0.001 type='number' dp=3 key='data.fuels." + fuel + ".primaryenergyfactor' /></td>";
            html += "<td><input style='width:85px;' min=0 step=0.01 type='number' dp=2 key='data.fuels." + fuel + ".fuelcost' /></td>";
            html += "<td><input style='width:85px;' min=0 step=1 type='number' dp=0 key='data.fuels." + fuel + ".standingcharge' /></td>";
            html += "</tr>";
        });

    }

    $('#fuelsmanager-table').append(html);
}

function fuelsmanager_UpdateUI() {
}
