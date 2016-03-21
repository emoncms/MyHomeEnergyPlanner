$("[key='data.ventilation.ventilation_type']").change(function () {

    var ventilation_type;
    switch ($(this).val())
    {
        case 'NV':
        case 'IE':
        case 'PS':
            ventilation_type = 'd'; // Natural ventilation or whole house positive input ventilation from loft'
            break;
        case 'DEV':
        case'MEV':
            ventilation_type = 'c'; // Whole house extract ventilation or positive input ventilation from outside
            break;
        case 'MV':
            ventilation_type = 'b'; // Balanced mechanical ventilation without heat recovery (MV)
            break;
        case 'MVHR':
            ventilation_type = 'a'; //Balanced mechanical ventilation with heat recovery (MVHR)
            break;
    }
    switch (ventilation_type)
    {
        case 'a':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").show();
            break;
        case 'b':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'c':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'd':
            $("#system_air_change_rate_div").hide();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
    }

});

$("[key='data.ventilation.air_permeability_test']").change(function () {

    var val = $(this)[0].checked;

    if (val == true) {
        $("#structural").hide();
        $("#air_permeability_value_tbody").show();
    } else {
        $("#structural").show();
        $("#air_permeability_value_tbody").hide();
    }

});

function ventilation_initUI()
{
    if (data.ventilation.air_permeability_test)
    {
        $("#structural").hide();
        $("#air_permeability_value_tbody").show();
    } else {
        $("#structural").show();
        $("#air_permeability_value_tbody").hide();
    }

    switch (data.ventilation.ventilation_type)
    {
        case 'a':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").show();
            break;
        case 'b':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'c':
            $("#system_air_change_rate_div").show();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
        case 'd':
            $("#system_air_change_rate_div").hide();
            $("#balanced_heat_recovery_efficiency_div").hide();
            break;
    }
}
