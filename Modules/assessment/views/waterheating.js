console.log("debug waterheating.js");

function waterheating_UpdateUI()
{
    if (data.water_heating.instantaneous_hotwater)
        $(".loss-interface").hide();
    else
        $(".loss-interface").show();

    if (data.water_heating.declared_loss_factor_known) {
        $(".declared-loss-factor-known").show();
        $(".declared-loss-factor-not-known").hide();
    } else {
        $(".declared-loss-factor-known").hide();
        $(".declared-loss-factor-not-known").show();
    }

    if (data.water_heating.override_annual_energy_content)
        $('#annual_energy_content').html('<input type="text"  dp=0 style="width:35px; margin-right:10px" key="data.water_heating.annual_energy_content" /> kWh/year');
    else
        $('#annual_energy_content').html('<span key="data.water_heating.annual_energy_content" dp=0></span>  kWh/year');

    if (data.water_heating.combi_boiler == 'Storage combi boiler, store volume > 55 litres' || data.water_heating.combi_boiler == 'Storage combi boiler, store volume < 55 litres')
        $('#combi-storage-volume').show();
    else
        $('#combi-storage-volume').hide();
}

function waterheating_initUI() {
}

$('#openbem').on('click', '[key="data.water_heating.solar_water_heating"]', function () {
    data.use_SHW = !data.water_heating.solar_water_heating; // I don't know why but only works properly coping the negative
});