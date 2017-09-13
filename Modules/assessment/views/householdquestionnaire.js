console.log('debug householdquestionnaire.js')

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

var textAreaLength = 0;
$("#openbem").on("textInput", '[key="data.household.commentary"]', function () { // I have added this event because the Commentary box in Household questionnaire was not getting saved when the assessor refreshed the page or moved to another one before losing the focus of the input (which is what triggers the onChange event)
    if ($(this)[0].value.length - textAreaLength > 15) {
        textAreaLength = $(this)[0].value.length;
        $(this).trigger("change");
    }
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
            data.household['3b_extra_showers'].splice($(this).attr('shower-id'), 1);
            console.log(data.household['3b_extra_showers']);
            update();
        })

    }

    if (data.temperature.hours_off.weekday.length > 0) {
        $('#periods_heating_off_weekday').html('Periods heating off week day:').show();
        for (var period in data.temperature.hours_off.weekday) {
            if (period != 0)
                $('#periods_heating_off_weekday').append(',');
            if (data.temperature.hours_off.weekday[period] == null)
                data.temperature.hours_off.weekday[period] = 0;
            $('#periods_heating_off_weekday').append(' ' + data.temperature.hours_off.weekday[period].toFixed(1) + 'h');
        }
    }
    if (data.temperature.hours_off.weekend.length > 0) {
        $('#periods_heating_off_weekend').html('Periods heating off weekend:').show();
        for (var period in data.temperature.hours_off.weekend) {
            if (period != 0)
                $('#periods_heating_off_weekend').append(',')
            if (data.temperature.hours_off.weekend[period] == null)
                data.temperature.hours_off.weekend[period] = 0;
            $('#periods_heating_off_weekend').append(' ' + data.temperature.hours_off.weekend[period].toFixed(1) + 'h');
        }
    }
}
;
function householdquestionnaire_initUI() {
    data = project['master'];
    if (data.household == undefined || Object.keys(data.household).length === 0)
        data.household = {
            "3a_heatinghours_weekday_on1_hours": 7,
            "3a_heatinghours_weekday_on1_mins": 0,
            "3a_heatinghours_weekday_off1_hours": 9,
            "3a_heatinghours_weekday_off1_mins": 0,
            "3a_heatinghours_weekday_on2_hours": 16,
            "3a_heatinghours_weekday_on2_mins": 0,
            "3a_heatinghours_weekday_off2_hours": 23,
            "3a_heatinghours_weekday_off2_mins": 0,
            "3a_heatinghours_weekend_on1_hours": 7,
            "3a_heatinghours_weekend_on1_mins": 0,
            "3a_heatinghours_weekend_off1_hours": 23,
            "3a_heatinghours_weekend_off1_mins": 0,
            "commentary": "",
            "assessors_name": "",
            "assessors_biography": "",
            "houseimage": "",
            "1a_name": "",
            "1a_addressline1": "",
            "1a_addressline2": "",
            "1a_addressline3": "",
            "1a_towncity": "",
            "1a_postcode": "",
            "1a_localauthority": "",
            "1a_conservationarea": "No",
            "1a_listedbuilding": false,
            "1b_housetype": "flat-conversion",
            "1b_bedrooms": "",
            "1b_agesap": "before-1900",
            "1b_age": "",
            "2a_tenure": "owner-occupied",
            "2a_lengthofoccupancy": "Just moved in",
            "2b_adults18to65": "",
            "2b_adults65plus": "",
            "2b_childrenlessthan5": "",
            "2b_children5to17": "",
            "2b_pets": "",
            "2b_health": "",
            "3a_roomthermostat": "",
            "3a_roomthermostatcomment": "",
            "3a_TRVs": false,
            "3a_programmer": false,
            "3a_timer": false,
            "3a_cylinderthermostat": false,
            "3a_zonecontrol": false,
            "3a_boilerenergymanager": false,
            "3a_intelligentthermostats": false,
            "3a_remotecontrol": false,
            "3a_TRVs_comment": "",
            "3a_programmer_comment": "",
            "3a_timer_comment": "",
            "3a_cylinderthermostat_comment": "",
            "3a_zonecontrol_comment": "",
            "3a_boilerenergymanager_comment": "",
            "3a_intelligentthermostats_comment": "",
            "3a_remotecontrol_comment": "",
            "3a_habitable_rooms_not_heated": "",
            "3b_showertype": "Unknown",
            "3b_showerrating": "",
            "3b_shower_frequency": "",
            "3b_shower_flowrate": "",
            "3b_bath_frequency": "",
            "3b_kitchen_taps_num": "",
            "3b_utility_room_taps_num": "",
            "3b_bathroom_1_taps_num": "",
            "3b_bathroom_2_taps_num": "",
            "3b_kitchen_taps_type": "No energy saving feature",
            "3b_utility_room_taps_type": "No energy saving feature",
            "3b_bathroom_1_taps_type": "No energy saving feature",
            "3b_bathroom_2_taps_type": "No energy saving feature",
            "3c_extract_vents": false,
            "3c_intake_vents": false,
            "3c_trickle_vents": false,
            "3c_trickle_vents_comment": "",
            "3c_intake_vents_comment": "",
            "3c_extract_vents_comment": "",
            "3c_airbricks_comment": "",
            "reading_temp1": "",
            "reading_humidity1": "",
            "reading_temp2": "",
            "reading_humidity2": "",
            "4b_drying_outdoorline": "",
            "4b_drying_indoorrack": "",
            "4b_drying_airingcupboard": "",
            "4b_drying_tumbledryer": "",
            "4b_drying_washerdryer": "",
            "4b_drying_radiators": "",
            "4b_drying_electricmaiden": "",
            "5a_past_location": "",
            "5a_past_severity": "",
            "5a_past_howresolved": "",
            "5a_current_location": "",
            "5a_current_severity": "",
            "5a_current_howresolved": "",
            "5b_loftconversion": "",
            "5b_extension": "",
            "5b_insulation": "",
            "5b_windows": "",
            "5b_heatinghotwater": "",
            "5b_other": "",
            "5c_damp_location": "",
            "5c_damp_severity": "",
            "5c_damp_duration": "",
            "5c_condensation_location": "",
            "5c_condensation_severity": "",
            "5c_condensation_duration": "",
            "5c_mould_location": "",
            "5c_mould_severity": "",
            "5c_mould_duration": "",
            "6a_temperature_winter": "Just right",
            "6a_temperature_summer": "Just right",
            "6a_airquality_winter": "Just right",
            "6a_airquality_summer": "Just right",
            "6a_draughts_summer": "Just right",
            "6a_draughts_winter": "Just right",
            "6a_problem_locations": "",
            "6b_daylightamount": "Just right",
            "6b_artificallightamount": "Just right",
            "6b_problem_locations": "",
            "6c_noise_comment": "",
            "6d_unloved_rooms": "",
            "6d_favourite_room": "",
            "7a_occupancylength": "Short term move out within the next 5 years",
            "7a_occupancylength_comment": "",
            "7a_lifestylechange_comment": "",
            "7a_homeconversion_comment": "",
            "7b_carbon": "",
            "7b_money": "",
            "7b_comfort": "",
            "7b_airquality": "",
            "7b_modernisation": "",
            "7b_health": "",
            "7c_local": "",
            "7c_natural": "",
            "7c_performance": "",
            "7c_hitech": "",
            "7c_health": "",
            "7c_moisture": "",
            "7c_lowmaintenance": "",
            "7d_externally": "",
            "7d_internally": "",
            "7e_disruption_level": "Minimal internal disruption",
            "7e_disruption_comment": "",
            "7f_timescale": "Within the next few months",
            "7f_timescale_comment": "",
            "7g_fixedpot_comment": "",
            "7g_worksplanned_comment": "",
            "7g_grantfunding_comment": "",
            "7h_work": "In packages",
            "7h_work_comment": "",
            "7i_DIYconfidence": "Very confident",
            "7i_DIYconfidence_comment": "",
            "7i_buildingprofessionals": "",
            "1a_LSOA": ""
        }
}
;