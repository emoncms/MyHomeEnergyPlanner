console.log('debug householdquestionnaire.js')

$.ajax({
    url: jspath + "js/papaparse/papaparse.js",
    dataType: 'script',
    async: false
});

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

$('#upload_questionnaire').submit(function (e) {
    e.preventDefault();
    var file = $('#file_to_upload')[0].files[0];
    var fr = new FileReader();
    var file_text = '';
    fr.onload = receivedText;
    fr.readAsText(file);
    function receivedText() {
        var questionnaire_to_import = Papa.parse(fr.result, {header: true, skipEmptyLines: true});
        if (questionnaire_to_import.errors.length > 0) {
            var error_string = "";
            questionnaire_to_import.errors.forEach(function (error) {
                error_string += error.message + ' - Row ' + error.row + '. ';
            });
            $('#upload-result').css('color', 'red').html("There is a problem with the file.<br /> Error message: " + error_string);
            console.error(questionnaire_to_import);
        }
        else {
            import_questionnaire(questionnaire_to_import.data[0]);
            update();
            $('#upload-result').css('color', 'black').html("Questionnaire uploaded and imported");
            console.log(questionnaire_to_import);
            console.log(JSON.stringify(questionnaire_to_import));
        }
    }
});

$('#openbem').on('click', '#file_to_upload', function () {
    $('#upload-result').css('color', 'black').html("");
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

function householdquestionnaire_initUI() {
    data = project['master'];
    if (data.household == undefined || Object.keys(data.household).length === 0)
        data.household = default_household_quesionnaire;
}

function import_questionnaire(datain) {
    for (var field in questionnaire_csv_headers_map) {
        if (datain[field] != undefined)
            varset(questionnaire_csv_headers_map[field], datain[field]);
    }

    // Validate data in (some of the dropdowns and checkboxes)
    data['1a_listedbuilding'] = data['1a_listedbuilding'] == "Yes" ? 1 : 0;
    switch (data.household['1b_housetype']) {
        case'Flat (conversion)':
            data.household['1b_housetype'] = "flat-conversion";
            break;
        case'Flat (purpose built)':
            data.household['1b_housetype'] = "flat-purposebuilt";
            break;
        case'Mid-terrace':
            data.household['1b_housetype'] = "mid-terrace";
            break;
        case'End-terrace':
            data.household['1b_housetype'] = "end-terrace";
            break;
        case'Semi-detached':
            data.household['1b_housetype'] = "semi-detached";
            break;
        case'Detached':
            data.household['1b_housetype'] = "detached";
            break;

    }
    switch (data.household['2a_tenure']) {
        case'Owner occupied':
            data.household['2a_tenure'] = "owner-occupied";
            break;
        case'Private tenant':
            data.household['2a_tenure'] = "private-tenant";
            break;
        case'Shared ownership':
            data.household['2a_tenure'] = "shared-ownership";
            break;
        case'Tenant (social housing)':
            data.household['2a_tenure'] = "tenant-social-housing";
            break;
    }

    if (datain['Controllers'].search("Thermostatic Radiator Valves (TRVs)") != -1)
        data.household['3a_TRVs'] = 1;
    if (datain['Controllers'].search("Programmer") != -1)
        data.household['3a_programmer_comment'] = 1;
    if (datain['Controllers'].search("Timer") != -1)
        data.household['3a_timer_comment'] = 1;
    if (datain['Controllers'].search("Cylinder thermostat") != -1)
        data.household['3a_cylinderthermostat_comment'] = 1;
    if (datain['Controllers'].search("Zone control") != -1)
        data.household['3a_zonecontrol'] = 1;
    if (datain['Controllers'].search("Boiler energy manager") != -1)
        data.household['3a_boilerenergymanager'] = 1;
    if (datain['Controllers'].search("Intelligent thermostats (e.g. NEST)") != -1)
        data.household['3a_intelligentthermostats'] = 1;
    if (datain['Controllers'].search("Remote control (e.g. HIVE)") != -1)
        data.household['3a_remotecontrol'] = 1;

    if (datain['Vents'].search("Trickle vents") != -1)
        data.household['3c_trickle_vents'] = 1;
    if (datain['Vents'].search("Intake vents") != -1)
        data.household['3c_intake_vents'] = 1;
    if (datain['Vents'].search("Extract vents") != -1)
        data.household['3c_extract_vents'] = 1;
}

var default_household_quesionnaire = {
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
    "7i_buildingprofessionals": ""
};

var questionnaire_csv_headers_map = {
    "Your name": "data.household.1a_name",
    "Address line 1": "data.household.1a_addressline1",
    "Address line 2": "data.household.1a_addressline2",
    "Address line 3": "data.household.1a_addressline3",
    "Town/city": "data.household.1a_towncity",
    "Post code": "data.household.1a_postcode",
    "Local authority": "data.household.1a_localauthority",
    "Lower Super Output Area (LSOA)": "data.household.1a_LSOA",
    "Conservation area": "data.household.1a_conservationarea",
    "Listed building": "data.household.1a_listedbuilding",
    "House type": "data.household.1b_housetype",
    "Number of bedrooms": "data.household.1b_bedrooms",
    "Age": "data.household.1b_agesap",
    "Exact year": "data.household.1b_age",
    "Tenure": "data.household.2a_tenure",
    "Length of occupancy": "data.household.2a_lengthofoccupancy",
    "Number of adults 18-65": "data.household.2b_adults18to65",
    "Number of adults 65+": "data.household.2b_adults65plus",
    "Number of children <5": "data.household.2b_childrenlessthan5",
    "Number of children 5-17": "data.household.2b_children5to17",
    "Do you have any pets?": "data.household.2b_pets",
    "Do you have any health conditions that could be caused or affected by living in a cold or damp home? If so, please describe and note who this affects.": "data.household.2b_health",
    "Do you completely switch off your space heating over summer? ": "data.household.3a_heatingoffsummer",
    "Room thermostat temperature setting": "data.household.3a_roomthermostat",
    "How do you use your room thermostat?": "data.household.3a_roomthermostatcomment",
    "Number of habitable rooms not heated": "data.household.3a_habitable_rooms_not_heated",
    "Shower type": "data.household.3b_showertype",
    "Shower - If electric, shower rating (kW):": "data.household.3b_showerrating",
    "Shower - Frequency of use per day:": "data.household.3b_shower_frequency",
    "Shower - Flow rate if known (litres/min):": "data.household.3b_shower_flowrate",
    "Bath, frequency of use (per day):": "data.household.3b_bath_frequency",
    "Number of taps in kitchen": "data.household.3b_kitchen_taps_num",
    "Type of taps in kitchen": "data.household.3b_kitchen_taps_type",
    "Number of taps in utility room": "data.household.3b_utility_room_taps_num",
    "Type of taps in utility room": "data.household.3b_utility_room_taps_type",
    "Number of taps in bathroom 1": "data.household.3b_bathroom_1_taps_num",
    "Type of taps in utility room in bathroom 1": "data.household.3b_bathroom_1_taps_type",
    "Number of taps in bathroom 2": "data.household.3b_bathroom_2_taps_num",
    "Type of taps in utility room in bathroom 2": "data.household.3b_bathroom_2_taps_type",
    "Are air bricks clear from obstructions?": "data.household.3c_airbricks_comment",
    "T&H - Temperature reading 1": "data.household.reading_temp1",
    "T&H - Humidity reading 1": "data.household.reading_humidity1",
    "T&H - Temperature reading 2": "data.household.reading_temp2",
    "T&H - Humidity reading 2": "data.household.reading_humidity2",
    "Outdoor clothes line": "data.household.4b_drying_outdoorline",
    "Indoor clothes racks": "data.household.4b_drying_indoorrack",
    "Airing cupboard": "data.household.4b_drying_airingcupboard",
    "Tumble dryer": "data.household.4b_drying_tumbledryer",
    "Washer/dryer": "data.household.4b_drying_washerdryer",
    "Radiators": "data.household.4b_drying_radiators",
    "Electric drying maiden": "data.household.4b_drying_electricmaiden",
    "Past structural problems - Location": "data.household.5a_past_location",
    "Past structural problems - Severity": "data.household.5a_past_severity",
    "Past structural problems - How was it resolved?": "data.household.5a_past_howresolved",
    "Current structural problems - Location": "data.household.5a_current_location",
    "Current structural problems - Severity": "data.household.5a_current_severity",
    "Current structural problems - How was it resolved?": "data.household.5a_current_howresolved",
    "Loft conversion - Insert date and comments": "data.household.5b_loftconversion",
    "Extension - Insert date and comments": "data.household.5b_extension",
    "Insulation - Insert date and comments": "data.household.5b_insulation",
    "Windows - Insert date and comments": "data.household.5b_windows",
    "Heating and hot water system - Insert date and comments": "data.household.5b_heatinghotwater",
    "Other": "data.household.5b_other",
    "Damp - location": "data.household.5c_damp_location",
    "Damp - severity": "data.household.5c_damp_severity",
    "Damp - duration": "data.household.5c_damp_duration",
    "Condensation - location": "data.household.5c_condensation_location",
    "Condensation - severity": "data.household.5c_condensation_severity",
    "Condensation - duration": "data.household.5c_condensation_duration",
    "Mould - location": "data.household.5c_mould_location",
    "Mould - severity": "data.household.5c_mould_severity",
    "Mould - duration": "data.household.5c_mould_duration",
    "Temperature in Winter": "data.household.6a_temperature_winter",
    "Temperature in Summer": "data.household.6a_temperature_summer",
    "Air quality in Winter": "data.household.6a_airquality_winter",
    "Air quality in Summer": "data.household.6a_airquality_summer",
    "Draughts in Winter": "data.household.6a_draughts_winter",
    "Draughts in Summer": "data.household.6a_draughts_summer",
    "Thermal comfort - Any problem locations?": "data.household.6a_problem_locations",
    "The amount of daylight is": "data.household.6b_daylightamount",
    "The amount of artificial light is": "data.household.6b_artificallightamount",
    "Lighting - Any problem locations?": "data.household.6b_problem_locations",
    "Any problems with noise from neighbours, between rooms or from outside?": "data.household.6c_noise_comment",
    "Are any rooms in your home unloved? Why?": "data.household.6d_unloved_rooms",
    "Do you have a favourite room? Why?": "data.household.6d_favourite_room",
    "How long do you see yourself living here?": "data.household.7a_occupancylength",
    "Do you envisage any changes in your lifestyle/household? (e.g. working from home, children/other family members)": "data.household.7a_lifestylechange_comment",
    "Do you envisage extending your home/loft conversion?": "data.household.7a_homeconversion_comment",
    "Save carbon": "data.household.7b_carbon",
    "Save money": "data.household.7b_money",
    "Improve comfort": "data.household.7b_comfort",
    "Improve indoor air quality": "data.household.7b_airquality",
    "General modernisation": "data.household.7b_modernisation",
    "Improve health": "data.household.7b_health",
    "Would you mind changing the aesthetics of your house externally?": "data.household.7d_externally",
    "Would you mind changing the aesthetics of your house internally?": "data.household.7d_internally",
    "What would be an acceptable level of disruption?": "data.household.7e_disruption_level",
    "Disruption comment": "data.household.7e_disruption_comment",
    "When are you likely to start retrofit work on your home?": "data.household.7f_timescale",
    "Timescales comment": "data.household.7f_timescale_comment",
    "Do you have a fixed pot of money?": "data.household.7g_fixedpot_comment",
    "Or do you plan to set a budget according to the works planned?": "data.household.7g_worksplanned_comment",
    "Do you plan to use any grant funding?": "data.household.7g_grantfunding_comment",
    "How do you plan to do the work?": "data.household.7h_work",
    "How confident would you be to undertake some of the work DIY?": "data.household.7i_DIYconfidence",
    "Procurement comment": "data.household.7i_DIYconfidence_comment",
    "Are you likely to use building professionals in the design and planning of your retrofit (e.g. architect, quantity surveyor)? Or are you likely to use a contractor for this?": "data.household.7i_buildingprofessionals"
};