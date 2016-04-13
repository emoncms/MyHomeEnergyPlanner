console.log("debug waterheating.js");

function waterheating_UpdateUI()
{
    if (data.water_heating.instantaneous_hotwater)
        $(".loss-interface").hide('fast');
    else {
        $(".loss-interface").show('fast');
        if (data.water_heating.storage)
            $('.storage').show('fast');
        else
            $('.storage').hide('fast');
    }

    if (data.water_heating.declared_loss_factor_known) {
        $(".declared-loss-factor-known").show('fast');
        $(".declared-loss-factor-not-known").hide('fast');
    } else {
        $(".declared-loss-factor-known").hide('fast');
        $(".declared-loss-factor-not-known").show('fast');
    }

    if (data.water_heating.override_annual_energy_content)
        $('#annual_energy_content').html('<input type="text"  dp=0 style="width:35px; margin-right:10px" key="data.water_heating.annual_energy_content" /> kWh/year');
    else
        $('#annual_energy_content').html('<span key="data.water_heating.annual_energy_content" dp=0></span>  kWh/year');

    if (data.water_heating.system == 'Combi boiler') {
        $('#combi-boiler').show('fast');
        if (data.water_heating.combi_boiler == 'storage_over55' || data.water_heating.combi_boiler == 'storage_less55')
            $('#combi-storage-volume').show('fast');
        else
            $('#combi-storage-volume').hide('fast');
    }
    else
        $('#combi-boiler').hide('fast');

}

function waterheating_initUI() {
    $('#solarhotwater-link').prop('href', 'view?id=' + p.id + '#' + scenario + '/solarhotwater');
}

$('#openbem').on('click', '[key="data.water_heating.solar_water_heating"]', function () {
    data.use_SHW = !data.water_heating.solar_water_heating; // I don't know why but only works properly coping the negative
});

$('#openbem').on('change', '[key="data.water_heating.system"]', function () {
    if ($('[key="data.water_heating.system"]').val() == 'Community heating')
        data.water_heating.community_heating = 1;
    else
        data.water_heating.community_heating = false;
});