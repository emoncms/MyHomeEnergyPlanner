//console.log('debug householdquestionnaire.js')

$('#add-shower').on('click', function () {
    if (data.household['3b_extra_showers'] == undefined)
        data.household['3b_extra_showers'] = [];
    var extra_shower_index = data.household['3b_extra_showers'].length;
    data.household['3b_extra_showers'].push({});
    $('#more-showers').append('<p><b>Extra shower ' + (extra_shower_index + 1).toString() + '</b><table class="table"><tr><td>Shower type:</td><td>' +
            '<select key="data.household.3b_extra_showers.' + extra_shower_index + '.showertype">' +
            '<option value="Unknown">Unknown</option>' +
            '<option value="Mixer direct">Mixer (direct)</option>' +
            '<option value="Electric">Electric</option>' +
            '<option value="Pumpedpower direct">Pumped/power (direct)</option>' +
            '<option value="Pumpedpower electric">Pumped/power (electric)</option>' +
            '</select>' +
            '<tr><td>If electric, shower rating (kW):</td><td>' +
            '  <input type="number" value="" key="data.household.3b_extra_showers.' + extra_shower_index + '.showerrating" /></td></tr>' +
            '<tr><td>Frequency of use:</td><td>' +
            '   <input type="number" value="" key="data.household.3b_extra_showers.' + extra_shower_index + '.shower_frequency" /></td></tr>' +
            '<tr><td>Flow rate if known (litres/min):</td><td>' +
            '   <input type="number" value="" key="data.household.3b_extra_showers.' + extra_shower_index + '.shower_flowrate" /></td></tr>' +
            '<tr><td>Bath, frequency of use (per day):</td><td>' +
            '<input type="number" value="" key="data.household.3b_extra_showers.' + extra_shower_index + '.bath_frequency" /></td></tr>'
            );
});

function householdquestionnaire_UpdateUI() {
    if (data.household['3b_extra_showers'] != undefined) {
        $('#more-showers').html('');
        for (var i = 0; i < data.household['3b_extra_showers'].length; i++) {
            $('#more-showers').append('<p><b>Extra shower ' + (i + 1).toString() + '</b><i style="margin-left:10px;cursor:pointer" class="icon-trash remove-shower" shower-id="' + i + '"></i></p><table class="table"><tr><td>Shower type:</td><td>' +
                    '<select id="extra_shower_' + i + '" key="data.household.3b_extra_showers.' + i + '.showertype">' +
                    '<option value="Unknown">Unknown</option>' +
                    '<option value="Mixer direct">Mixer (direct)</option>' +
                    '<option value="Electric">Electric</option>' +
                    '<option value="Pumpedpower direct">Pumped/power (direct)</option>' +
                    '<option value="Pumpedpower electric">Pumped/power (electric)</option>' +
                    '</select>' +
                    '<tr><td>If electric, shower rating (kW):</td><td>' +
                    '  <input type="number" value="" key="data.household.3b_extra_showers.' + i + '.showerrating" /></td></tr>' +
                    '<tr><td>Frequency of use:</td><td>' +
                    '   <input type="number" value="" key="data.household.3b_extra_showers.' + i + '.shower_frequency" /></td></tr>' +
                    '<tr><td>Flow rate if known (litres/min):</td><td>' +
                    '   <input type="number" value="" key="data.household.3b_extra_showers.' + i + '.shower_flowrate" /></td></tr>' +
                    '<tr><td>Bath, frequency of use (per day):</td><td>' +
                    '<input type="number" value="" key="data.household.3b_extra_showers.' + i + '.bath_frequency" /></td></tr></table>'
                    );
        }
        $('.remove-shower').on('click', function () {
            console.log(data.household['3b_extra_showers']);
            data.household['3b_extra_showers'].splice($(this).attr('shower-id'),1);
            console.log(data.household['3b_extra_showers']);
            update();
        })
        
    }
}

;