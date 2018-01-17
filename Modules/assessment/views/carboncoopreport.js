console.log('debug carboncoopreport.js');
function carboncoopreport_initUI() {

    data = project['master'];
    WebFontConfig = {
        google: {families: ['Karla:400,400italic,700:latin']}
    };
    (function () {
        var wf = document.createElement('script');
        wf.src = '../Lib/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();
    $.ajax({
        url: jspath + "views/compare.js",
        dataType: 'script',
        async: false
    });
    var scenarios = ["master", "scenario1", "scenario2", "scenario3"];
    WebFontConfig.active = function () {
        //  carboncoopreport_UpdateUI();
    };
}

function carboncoopreport_UpdateUI() {

    var scenarios = ["master", "scenario1", "scenario2", "scenario3"];

    // Picture
    if (data.featuredimage) {
        $(".js-home-image-wrapper").html('');
        var img = $('<img class="home-image">').attr("src", path + "Modules/assessment/images/" + projectid + "/" + data.featuredimage)
        img.appendTo(".js-home-image-wrapper");
    }

    // I don't think this does anything
    if (printmode == true) {
        $("#bound").css("width", "1200px"); // set to width to optimum to avoid antialiasing
        $(".js-printer-friendly-link").css("display", "none");
    } else {
        $(".js-printer-friendly-link").attr("href", path + "assessment/print?id=" + projectid + "#master/carboncoopreport");
    }

    // Organization
    var hash = window.location.hash;
    var org_report = hash.slice(hash.search('=') + 1);
    console.log(org_report);

    // Report date
    var date = new Date();
    var months_numbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    $('#report_date').html(date.getDate() + '-' + months_numbers[date.getMonth()] + '-' + date.getFullYear());

    // Figure 1: Retrofit Priorities
    //  Shows retrofit priorities - in order - identifying whether interested in retrofit for cost, comfort or carbon reasons etc.

    var priorities = {};
    var household = project["master"].household;
    var prioritiesPossibilities = [
        "7b_carbon",
        "7b_money",
        "7b_comfort",
        "7b_airquality",
        "7b_modernisation",
        "7b_health",
    ]

    if (typeof household['7b_carbon'] != "undefined") {
        priorities.carbon = {
            title: "Save carbon",
            order: household['7b_carbon']
        }
    }

    if (typeof household['7b_money'] != "undefined") {
        priorities.money = {
            title: "Save money",
            order: household['7b_money'],
        }
    }

    if (typeof household['7b_comfort'] != "undefined") {
        priorities.comfort = {
            title: "Improve comfort",
            order: household['7b_comfort'],
        }
    }

    if (typeof household['7b_airquality'] != "undefined") {
        priorities.airquality = {
            title: "Improve indoor air quality",
            order: household['7b_airquality']
        }
    }

    if (typeof household['7b_modernisation'] != "undefined") {
        priorities.modernisation = {
            title: "General modernisation",
            order: household['7b_modernisation'],
        }
    }

    if (typeof household['7b_health'] != "undefined") {
        priorities.health = {
            title: "Improve health",
            order: household['7b_health'],
        }
    }

    var sortedPriorities = [];
    for (var priority in priorities) {
        sortedPriorities.push([priority, priorities[priority]['order'], priorities[priority]['title']])
    }
    sortedPriorities.sort(function (a, b) {
        return parseInt(a[1]) - parseInt(b[1])
    })

    $("#retrofit-priorities").html('');
    for (var priority_order = 1; priority_order <= 3; priority_order++) {
        for (var i = 0; i < sortedPriorities.length; i++) {
            if (sortedPriorities[i][1] == priority_order)
                $("#retrofit-priorities").append("<li>" + sortedPriorities[i][1] + ". " + sortedPriorities[i][2] + "</li>");
        }
    }


    // Figure 2: Performance Summary
    // Quick overview/summary - Benchmarking Bar Charts. Need to ensure that all scenarios displayed, not just one as on current graph.
    // Space Heating Demand (kWh/m2.a)
    // Primary Energy Demand (kWh/m2.a)
    // CO2 emission rate (kgCO2/m2.a)
    // CO2 emission rate - per person (kgCO2/m2.a)

    var values = [];
    for (var i = 0; i < scenarios.length; i++) {
        if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].space_heating_demand_m2 != "undefined") {
            values[i] = Math.round(project[scenarios[i]].space_heating_demand_m2);
        } else {
            values[i] = 0;
        }
    }

    colors = [
        "rgb(236, 157, 163)",
        "rgb(164, 211, 226)",
        "rgb(184, 237, 234)",
        "rgb(251, 212, 139)"
    ];

    var options = {
        name: "Space heating demand",
        font: "Karla",
        colors: colors,
        value: Math.round(data.space_heating_demand_m2),
        values: values,
        units: "kWh/m" + String.fromCharCode(178) + ".a", //String.fromCharCode(178) = 2 superscript
        targets: {
            "Min Target": datasets.target_values.space_heating_demand_lower,
            "Max Target": datasets.target_values.space_heating_demand_upper,
            "UK average": datasets.uk_average_values.space_heating_demand
        },
        targetRange: [datasets.target_values.space_heating_demand_lower, datasets.target_values.space_heating_demand_upper]
    };
    targetbarCarboncoop("space-heating-demand", options);
    // ---------------------------------------------------------------------------------
    var values = [];
    for (var i = 0; i < scenarios.length; i++) {
        if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].primary_energy_use_m2 != "undefined") {
            values[i] = Math.round(project[scenarios[i]].primary_energy_use_m2);
        } else {
            values[i] = 0;
        }
    }

    var options = {
        name: "Primary energy demand",
        value: Math.round(data.primary_energy_use_m2),
        colors: colors,
        values: values,
        units: "kWh/m" + String.fromCharCode(178) + ".a", //String.fromCharCode(178) = 2 superscript
        targets: {
            // "Passivhaus": 120,
            "Carbon Coop 2050 target (inc. renewables)": datasets.target_values.primary_energy_demand,
            "UK Average": datasets.uk_average_values.primary_energy_demand
        }
    };
    targetbarCarboncoop("primary-energy", options);
    // ---------------------------------------------------------------------------------

    var values = [];
    for (var i = 0; i < scenarios.length; i++) {
        if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].kgco2perm2 != "undefined") {
            values[i] = Math.round(project[scenarios[i]].kgco2perm2);
        } else {
            values[i] = 0;
        }
    }

    var options = {
        name: "CO<sub>2</sub> Emission rate <i class='icon-question-sign' title='Carbon emissions and number of homes: DECC (2014) \"United Kindgdom Housing Energy Fact File: 2013\", 28 January 2014, accessed at http://www.gov.uk/government/statistics/united-kingdom-housing-energy-fact-file-2013\n\n"
                + "Average Floor Area: National Statistics, (2016), \"English Housing Survey 2014 to 2015: Headline Report\", 18 Feb 2016, accessed at http://www.gov.uk/government/statistics/english-housing-survey-2014-to-2015-headline-report \n\n"
                + "CO<sub>2</sub> emissions factors are 15 year ones, based on figures published by BRE at http://www.bre.co.uk/filelibrary/SAP/2012/Emission-and-primary-factors-2013-2027.pdf' />",
        value: Math.round(data.kgco2perm2),
        colors: colors,
        values: values,
        units: "kgCO" + String.fromCharCode(8322) + "/m" + String.fromCharCode(178) + ".a", //String.fromCharCode(178) = 2 superscript
        targets: {
            "Carbon Coop 2050 target": datasets.target_values.co2_emission_rate,
            "UK Average": datasets.uk_average_values.co2_emission_rate,
        }
    };
    targetbarCarboncoop("co2-emission-rate", options);


    // ---------------------------------------------------------------------------------

    //    var values = [];
    // for (var i = 0 ; i < scenarios.length ; i++){
    // 	if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].kwhdpp != "undefined"){
    // 		values[i] =  Math.round(project[scenarios[i]].kwhdpp.toFixed(1));
    // 	} else {
    // 		values[i] = 0;
    // 	}
    // }

    // var options = {
    //     name: "Per person energy use",
    //     value: data.kwhdpp.toFixed(1),
    //     colors: colors,
    //     values: values,
    //     units: "kWh/day",
    //     targets: {
    //         "70% heating saving": 8.6,
    //         "UK Average": 19.6
    //     }
    // };
    // targetbarCarboncoop("energy-use-per-person", options);

    $(".key-square--master").html('<img src="' + path + 'Modules/assessment/img-assets/figure_2_your_home.jpg" />');
    $(".key-square--scenario1").html('<img src="' + path + 'Modules/assessment/img-assets/figure_2_scenario_1.jpg" />');
    $(".key-square--scenario2").html('<img src="' + path + 'Modules/assessment/img-assets/figure_2_scenario_2.jpg" />');
    $(".key-square--scenario3").html('<img src="' + path + 'Modules/assessment/img-assets/figure_2_scenario_3.jpg" />');


    // Figure 3: How does my home lose heat?
    //

    function heatlossData(scenario) {
        if (typeof project[scenario] != "undefined" && typeof project[scenario].fabric != "undefined") {
            return {
                floorwk: Math.round(project[scenario].fabric.total_floor_WK),
                ventilationwk: Math.round(project[scenario].ventilation.average_ventilation_WK),
                infiltrationwk: Math.round(project[scenario].ventilation.average_infiltration_WK),
                windowswk: Math.round(project[scenario].fabric.total_window_WK),
                wallswk: Math.round(project[scenario].fabric.total_wall_WK),
                roofwk: Math.round(project[scenario].fabric.total_roof_WK),
                thermalbridgewk: Math.round(project[scenario].fabric.thermal_bridging_heat_loss),
                totalwk: Math.round(project[scenario].fabric.total_floor_WK + project[scenario].ventilation.average_WK + project[scenario].fabric.total_window_WK + project[scenario].fabric.total_wall_WK + project[scenario].fabric.total_roof_WK + project[scenario].fabric.thermal_bridging_heat_loss)
            }
        } else {
            return {
                floorwk: 0,
                ventilationwk: 0,
                infiltrationwk: 0,
                windowswk: 0,
                wallswk: 0,
                roofwk: 0,
                thermalbridgewk: 0,
                totalwk: 0
            }
        }
    }

    $("body").on("click", ".js-house-heatloss-diagram-picker span", function (e) {
        var scenario = $(this).data("scenario");
        $(".js-house-heatloss-diagram-picker span").removeClass("selected");
        $(this).addClass("selected");
        $(".js-house-heatloss-diagrams-wrapper .centered-house").css({
            "display": "none"
        });
        $("div[data-scenario-diagram='" + scenario + "']").css("display", "block");
    });
    heatlossDataMaster = heatlossData("master");
    heatlossDataScenario1 = heatlossData("scenario1");
    heatlossDataScenario2 = heatlossData("scenario2");
    heatlossDataScenario3 = heatlossData("scenario3");
    // if (printmode != true){
    // 	$("#house-heatloss-diagram-scenario1, #house-heatloss-diagram-scenario2, #house-heatloss-diagram-scenario3, .js-house-heatloss-diagrams-wrapper p").css({
    // 		"display": "none"
    // 	});
    // } else {
    // 	$(".js-house-heatloss-diagram-picker").css("display", "none");
    // }

    function calculateRedShade(value, calibrateMax) {
        var calibrateMax = 292;
        return "rgba(255,0,0, " + (value / calibrateMax) + ")";
    }

    function generateHouseMarkup(heatlossData) {

        var uscale = 30;
        var sFloor = Math.sqrt(heatlossData.floorwk / uscale);
        var sVentilation = Math.sqrt(heatlossData.ventilationwk / uscale);
        var sInfiltration = Math.sqrt(heatlossData.infiltrationwk / uscale);
        var sWindows = Math.sqrt(heatlossData.windowswk / uscale);
        var sWalls = Math.sqrt(heatlossData.wallswk / uscale);
        var sRoof = Math.sqrt(heatlossData.roofwk / uscale);
        var sThermal = Math.sqrt(heatlossData.thermalbridgewk / uscale);
        var html = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\
     width="444px" height="330.5px" viewBox="0 0 444 330.5" enable-background="new 0 0 444 330.5" xml:space="preserve">\
     <path fill="none" stroke="#F0533C" stroke-width="6" stroke-miterlimit="10" d="M106.8,108.1"/>\
     <polyline fill="none" stroke="#F0533C" stroke-width="8" stroke-miterlimit="10" points="316.6,108.1 316.6,263.4 106.8,263.4 \
     106.8,230.9 "/>\
     <polyline fill="none" stroke="#F0533C" stroke-width="11" stroke-miterlimit="10" points="95.7,119.5 211.7,33.5 327.6,119.5 "/>\
     <path fill="none" stroke="#F0533C" stroke-width="6" stroke-miterlimit="10" d="M57.8,240.6"/>\
     <line fill="none" stroke="#F0533C" stroke-width="8" stroke-miterlimit="10" x1="106.5" y1="195.6" x2="106.5" y2="160.7"/>\
     <line opacity="0.4" fill="none" stroke="#F0533C" stroke-width="8" stroke-miterlimit="10" x1="106.5" y1="160.7" x2="106.5" y2="125.8"/>\
     <line fill="none" stroke="#F0533C" stroke-width="8" stroke-miterlimit="10" x1="106.8" y1="125.8" x2="106.8" y2="107.8"/>\
     <polygon id="roof" fill="#F0533C" transform="translate(270,60) scale(' + sRoof + ')" points="6.9,-23.6 -6.9,-5.4 7.7,5.6 21.5,-12.7 28.5,-7.4 24.9,-32.3 -0.1,-28.9 "/>\
     <polygon id="windows" transform="translate(92,144) scale(-' + sWindows + ')" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>\
     <polygon id="ventilation" transform="translate(92,235) scale(-' + sVentilation + ')" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>\
     <polygon id="infiltration" transform="translate(140,65) scale(-' + sInfiltration + ') rotate(52)" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>\
     <polygon id="wall" transform="translate(330,242) scale(' + sWalls + ')" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>\
     <polygon id="thermal-bridging" transform="translate(330,144) scale(' + sThermal + ')" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>\
     <polygon id="floor" transform="translate(213,278) scale(' + sFloor + ')" fill="#F0533C" points="9.1,22.9 9.1,0 -9.1,0 -9.1,22.9 -17.9,22.9 0,40.6 17.9,22.9 "/>\
     <text transform="matrix(1 0 0 1 191.0084 172.7823)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="14">TOTAL </tspan><tspan x="-5.4" y="16.8" fill="#F0533C" font-size="14">' + heatlossData.totalwk + ' W/K</tspan></text>\
     <text transform="matrix(1 0 0 1 328.5163 95)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Thermal Bridging</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.thermalbridgewk + ' W/K</tspan></text>\
     <text transform="matrix(1 0 0 1 230.624 21.1785)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Roof</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.roofwk + ' W/K</tspan></text>\
     <text transform="matrix(1 0 0 1 330.5875 283.9302)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Walls</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.wallswk + ' W/K</tspan></text>\
     <text transform="matrix(1 0 0 1 53.3572 283.9302)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Planned ventilation</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.ventilationwk + ' W/K</tspan></text>\
     <text transform="matrix(1 0 0 1 150.0000 21)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Draughts</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.infiltrationwk + ' W/K</tspan></text>\
     <text transform="matrix(1 0 0 1 35.0902 90.1215)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Windows and doors</tspan><tspan x="11.2" y="12" fill="#F0533C" font-size="11">' + heatlossData.windowswk + ' W/K</tspan></text>\
     <text transform="matrix(1 0 0 1 248.466 283.9302)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Floor</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.floorwk + ' W/K</tspan></text>\
     <g opacity="0.4">\
     <polygon fill="#F0533C" points="110.1,133.2 102.8,128.8 102.8,129.9 110.1,134.3 	"/>\
     <polygon fill="#F0533C" points="110.1,141.5 102.8,137.1 102.8,138.2 110.1,142.6 	"/>\
     <polygon fill="#F0533C" points="110.1,149.8 102.8,145.4 102.8,146.4 110.1,150.8 	"/>\
     <polygon fill="#F0533C" points="110.1,158 102.8,153.6 102.8,154.7 110.1,159.1 	"/>\
     </g>\
     <line opacity="0.4" fill="none" stroke="#F0533C" stroke-width="8" stroke-miterlimit="10" x1="106.5" y1="230.7" x2="106.5" y2="195.8"/>\
     <g opacity="0.4">\
     <polygon fill="#F0533C" points="110.1,203.2 102.8,198.8 102.8,199.9 110.1,204.3 	"/>\
     <polygon fill="#F0533C" points="110.1,211.5 102.8,207.1 102.8,208.2 110.1,212.6 	"/>\
     <polygon fill="#F0533C" points="110.1,219.8 102.8,215.4 102.8,216.4 110.1,220.8 	"/>\
     <polygon fill="#F0533C" points="110.1,228 102.8,223.6 102.8,224.7 110.1,229.1 	"/>\
     </g>\
     </svg>'
        return html;
    }


    $("#house-heatloss-diagram-master .js-svg").html($(generateHouseMarkup(heatlossDataMaster)));
    $("#house-heatloss-diagram-scenario1 .js-svg").html($(generateHouseMarkup(heatlossDataScenario1)));
    $("#house-heatloss-diagram-scenario2 .js-svg").html($(generateHouseMarkup(heatlossDataScenario2)));
    $("#house-heatloss-diagram-scenario3 .js-svg").html($(generateHouseMarkup(heatlossDataScenario3)));
    // termal bridging right pointing arrow: <polygon opacity="0.5" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>


    // Figure 4: Your home’s heat balance
    // Heat transfer per year by element. The gains and losses here need to balance. 
    // data.annual_losses_kWh_m2 appears to be empty, so there are currently no negative stacks on this chart
    //

    var values = [];
    for (var i = 0; i < scenarios.length; i++) {
        if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].kwhdpp != "undefined") {
            values[i] = Math.round(project[scenarios[i]].kwhdpp.toFixed(1));
        } else {
            values[i] = 0;
        }
    }

    var dataFig4 = [];
    var max_value = 250; // used to set the height of the chart
    if (typeof project['master'] != "undefined" && typeof project["master"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Your Home Now',
            value: [
                {value: project["master"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal Gains'},
                {value: project["master"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar Gains'},
                {value: project["master"].space_heating.annual_heating_demand_m2, label: 'Space Heating Requirement'},
                {value: -project["master"].annual_losses_kWh_m2["fabric"], label: 'Fabric Losses'},
                {value: -(project["master"].annual_losses_kWh_m2["ventilation"] + project["master"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation and Infiltration Losses'},
            ]
        });
        if (max_value < (project["master"].annual_losses_kWh_m2["fabric"] + project["master"].annual_losses_kWh_m2["ventilation"] + project["master"].annual_losses_kWh_m2["infiltration"]))
            max_value = 50 + project["master"].annual_losses_kWh_m2["fabric"] + project["master"].annual_losses_kWh_m2["ventilation"] + project["master"].annual_losses_kWh_m2["infiltration"];
    }

    if (typeof project['scenario1'] != "undefined" && typeof project["scenario1"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Scenario 1',
            value: [
                {value: project["scenario1"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal Gains'},
                {value: project["scenario1"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar Gains'},
                {value: project["scenario1"].space_heating.annual_heating_demand_m2, label: 'Space Heating Requirement'},
                {value: -project["scenario1"].annual_losses_kWh_m2["fabric"], label: 'Fabric Losses'},
                {value: -(project["scenario1"].annual_losses_kWh_m2["ventilation"] + project["scenario1"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation and Infiltration Losses'},
            ]
        });
        if (max_value < (project["scenario1"].annual_losses_kWh_m2["fabric"] + project["scenario1"].annual_losses_kWh_m2["ventilation"] + project["scenario1"].annual_losses_kWh_m2["infiltration"]))
            max_value = 50 + project["scenario1"].annual_losses_kWh_m2["fabric"] + project["scenario1"].annual_losses_kWh_m2["ventilation"] + project["scenario1"].annual_losses_kWh_m2["infiltration"];
    }

    if (typeof project['scenario2'] != "undefined" && typeof project["scenario2"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Scenario 2',
            value: [
                {value: project["scenario2"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal Gains'},
                {value: project["scenario2"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar Gains'},
                {value: project["scenario2"].space_heating.annual_heating_demand_m2, label: 'Space Heating Requirement'},
                {value: -project["scenario2"].annual_losses_kWh_m2["fabric"], label: 'Fabric Losses'},
                {value: -(project["scenario2"].annual_losses_kWh_m2["ventilation"] + project["scenario2"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation and Infiltration Losses'},
            ]
        });
        if (max_value < (project["scenario2"].annual_losses_kWh_m2["fabric"] + project["scenario2"].annual_losses_kWh_m2["ventilation"] + project["scenario2"].annual_losses_kWh_m2["infiltration"]))
            max_value = 50 + project["scenario2"].annual_losses_kWh_m2["fabric"] + project["scenario2"].annual_losses_kWh_m2["ventilation"] + project["scenario2"].annual_losses_kWh_m2["infiltration"];
    }

    if (typeof project['scenario3'] != "undefined" && typeof project["scenario3"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Scenario 3',
            value: [
                {value: project["scenario3"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal Gains'},
                {value: project["scenario3"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar Gains'},
                {value: project["scenario3"].space_heating.annual_heating_demand_m2, label: 'Space Heating Requirement'},
                {value: -project["scenario3"].annual_losses_kWh_m2["fabric"], label: 'Fabric Losses'},
                {value: -(project["scenario3"].annual_losses_kWh_m2["ventilation"] + project["scenario3"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation and Infiltration Losses'},
            ]
        });
        if (max_value < (project["scenario3"].annual_losses_kWh_m2["fabric"] + project["scenario3"].annual_losses_kWh_m2["ventilation"] + project["scenario3"].annual_losses_kWh_m2["infiltration"]))
            max_value = 50 + project["scenario3"].annual_losses_kWh_m2["fabric"] + project["scenario3"].annual_losses_kWh_m2["ventilation"] + project["scenario3"].annual_losses_kWh_m2["infiltration"];
    }

    var EnergyDemand = new BarChart({
        chartTitle: 'Heat Balance',
        chartTitleColor: 'rgb(87, 77, 86)',
        yAxisLabelColor: 'rgb(87, 77, 86)',
        barLabelsColor: 'rgb(87, 77, 86)',
        yAxisLabel: "kWh/m" + String.fromCharCode(178) + ".year",
        fontSize: 33,
        width: 1075.35,
        chartHeight: 600,
        division: 50,
        barWidth: 110,
        barGutter: 120,
        chartHigh: max_value,
        chartLow: -max_value,
        font: "Karla",
        defaultBarColor: 'rgb(231,37,57)',
        barColors: {
            'Internal Gains': 'rgb(24,86,62)',
            'Solar Gains': 'rgb(240,212,156)',
            'Space Heating Requirement': 'rgb(236,102,79)',
            'Fabric Losses': 'rgb(246,167,7)',
            'Ventilation and Infiltration Losses': 'rgb(157, 213, 203)',
        },
        data: dataFig4,
    });
    $('#heat-balance').html('');
    EnergyDemand.draw('heat-balance');


    // Figure 5: Space Heating Demand
    var values = [];
    var max_value = 250; // used to set the height of the chart
    for (var i = 0; i < scenarios.length; i++) {
        if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].space_heating_demand_m2 != "undefined") {
            values[i] = Math.round(project[scenarios[i]].space_heating_demand_m2);
            if (max_value < values[i])
                max_value = values[i] + 50;
        } else {
            values[i] = 0;
        }
    }

    var SpaceHeatingDemand = new BarChart({
        chartTitleColor: 'rgb(87, 77, 86)',
        yAxisLabelColor: 'rgb(87, 77, 86)',
        barLabelsColor: 'rgb(87, 77, 86)',
        yAxisLabel: 'kWh/m' + String.fromCharCode(178) + '.year',
        fontSize: 33,
        font: "Karla",
        division: 50,
        chartHigh: max_value,
        width: 1200,
        chartHeight: 600,
        barWidth: 110,
        barGutter: 80,
        defaultBarColor: 'rgb(157,213,203)',
        // barColors: {
        // 	'Space heating': 'rgb(157,213,203)',
        // 	'Pumps, fans, etc.': 'rgb(24,86,62)',
        // 	'Cooking': 'rgb(40,153,139)',
        // },
        targets: [
            {
                label: 'Min. target',
                target: datasets.target_values.space_heating_demand_lower,
                color: 'rgb(231,37,57)'
            },
            {
                label: 'Max. target',
                target: datasets.target_values.space_heating_demand_upper,
                color: 'rgb(231,37,57)'
            },
            {
                label: 'UK Average',
                target: datasets.uk_average_values.space_heating_demand,
                color: 'rgb(231,37,57)'
            },
        ],
        targetRange: [
            {
                label: '(kWh/m2.a)',
                target: 20,
                color: 'rgb(231,37,57)'
            },
            {
                label: '(kWh/m2.a)',
                target: 70,
                color: 'rgb(231,37,57)'
            },
        ],
        data: [
            {label: 'Your home now ', value: values[0]},
            {label: 'Scenario 1', value: values[1]},
            {label: 'Scenario 2', value: values[2]},
            {label: 'Scenario 3', value: values[3]},
        ]
    });
    $('#fig-5-space-heating-demand').html('');
    SpaceHeatingDemand.draw('fig-5-space-heating-demand');


    // Figure 6: Energy Demand
    var max_value = 40000;
    function getEnergyDemandData() {
        var data = {};
        for (var i = 0; i < scenarios.length; i++) {
            data[scenarios[i]] = [];
            var electric = 0;
            var gas = 0;
            var other = 0;
            if (typeof project[scenarios[i]] !== "undefined") {
                if (typeof project[scenarios[i]].fuel_totals !== "undefined") {
                    for (var fuel in project[scenarios[i]].fuel_totals) {
                        if (project[scenarios[i]].fuels[fuel].category == 'Electricity')
                            electric += project[scenarios[i]].fuel_totals[fuel].quantity;
                        else if (project[scenarios[i]].fuels[fuel].category == 'Gas')
                            gas += project[scenarios[i]].fuel_totals[fuel].quantity;
                        else if (fuel != 'generation')
                            other += project[scenarios[i]].fuel_totals[fuel].quantity;
                    }
                    data[scenarios[i]].push({value: gas, label: 'Gas', variance: gas * 0.3});
                    data[scenarios[i]].push({value: electric, label: 'Electric', variance: electric * 0.3});
                    data[scenarios[i]].push({value: other, label: 'Other', variance: other * 0.3});
                }
            }
            if (max_value < (gas + electric + other))
                max_value = gas + electric + other + 5000;
        }


        data.bills = [
            {
                value: 0,
                label: 'Gas',
            },
            {value: 0,
                label: 'Electric',
            },
            {
                value: 0,
                label: "Other"
            }
        ];
        for (var fuel in project['master'].currentenergy.use_by_fuel) {
            var f_use = project['master'].currentenergy.use_by_fuel[fuel];
            if (project['master'].fuels[fuel].category == 'Gas')
                data.bills[0].value += f_use.annual_use;
            else if (project['master'].fuels[fuel].category == 'Electricity')
                data.bills[1].value += f_use.annual_use;
            else
                data.bills[2].value += f_use.annual_use;
        }
        data.bills[1].value += project['master'].currentenergy.generation.fraction_used_onsite * project['master'].currentenergy.generation.annual_generation; // We added consumption coming from generation
        if (max_value < (data.bills[0].value + data.bills[1].value + 1.0 * data.bills[2].value))
            max_value = data.bills[0].value + data.bills[1].value + 1.0 * data.bills[2].value + 5000;
        return data;
    }

    var energyDemandData = getEnergyDemandData();
    var EnergyDemand = new BarChart({
        chartTitleColor: 'rgb(87, 77, 86)',
        yAxisLabelColor: 'rgb(87, 77, 86)', barLabelsColor: 'rgb(87, 77, 86)',
        yAxisLabel: 'kWh/year',
        fontSize: 33,
        font: "Karla",
        width: 1200,
        chartHeight: 600,
        division: 5000,
        chartHigh: max_value,
        barWidth: 110, barGutter: 80,
        defaultBarColor: 'rgb(231,37,57)', defaultVarianceColor: 'rgb(2,37,57)',
        barColors: {
            'Gas': 'rgb(236,102,79)',
            'Electric': 'rgb(240,212,156)',
            'Other': 'rgb(24,86,62)',
        }, data: [
            {label: 'Your Home Now', value: energyDemandData.master},
            {label: 'Bills data', value: energyDemandData.bills},
            {label: 'Scenario 1', value: energyDemandData.scenario1},
            {label: 'Scenario 2', value: energyDemandData.scenario2},
            {label: 'Scenario 3', value: energyDemandData.scenario3},
        ]
    });
    $('#energy-demand').html('');
    EnergyDemand.draw('energy-demand');


    // Figure 7:    
    function getPrimaryEnergyUseData() {
        var primaryEnergyUseData = {};
        primaryEnergyUseData.max = 500;
        primaryEnergyUseData.min = 0;
        for (var i = 0; i < scenarios.length; i++) {
            primaryEnergyUseData[scenarios[i]] = [];
            if (typeof project[scenarios[i]] !== "undefined") {
                if (typeof project[scenarios[i]].primary_energy_use_by_requirement !== "undefined") {
                    if (typeof project[scenarios[i]].primary_energy_use_by_requirement['waterheating'] !== "undefined") {
                        primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].primary_energy_use_by_requirement['waterheating'] / data.TFA, label: 'Water Heating'});
                    }

                    if (typeof project[scenarios[i]].primary_energy_use_by_requirement['space_heating'] !== "undefined") {
                        primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].primary_energy_use_by_requirement['space_heating'] / data.TFA, label: 'Space Heating'});
                    }

                    if (typeof project[scenarios[i]].primary_energy_use_by_requirement['cooking'] !== "undefined") {
                        primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].primary_energy_use_by_requirement['cooking'] / data.TFA, label: 'Cooking'});
                    }

                    if (typeof project[scenarios[i]].primary_energy_use_by_requirement['appliances'] !== "undefined") {
                        primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].primary_energy_use_by_requirement['appliances'] / data.TFA, label: 'Appliances'});
                    }

                    if (typeof project[scenarios[i]].primary_energy_use_by_requirement['lighting'] !== "undefined") {
                        primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].primary_energy_use_by_requirement['lighting'] / data.TFA, label: 'Lighting'});
                    }

                    if (typeof project[scenarios[i]].primary_energy_use_by_requirement['fans_and_pumps'] !== "undefined") {
                        primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].primary_energy_use_by_requirement['fans_and_pumps'] / data.TFA, label: 'Fans and Pumps'});
                    }
                    if (project[scenarios[i]].use_generation == 1 && project[scenarios[i]].fuel_totals['generation'].primaryenergy < 0) { // we offset the stack displacing it down for the amount of renewables
                        var renewable_left = -project[scenarios[i]].fuel_totals['generation'].primaryenergy / data.TFA; // fuel_totals['generation'].primaryenergy is negative
                        primaryEnergyUseData[scenarios[i]].forEach(function (use) {
                            if (use.value <= renewable_left) {
                                renewable_left -= use.value;
                                use.value = -use.value;
                            }
                            if (use.value > renewable_left) {
                                primaryEnergyUseData[scenarios[i]].push({value: use.value - renewable_left, label: use.label}); // we create another bar with the same color than current use with the amount that is still positive
                                use.value = -renewable_left; // the amount offseted
                                renewable_left = 0;
                            }
                        });
                    }
                }
            }
            if (typeof project[scenarios[i]] !== "undefined" && project[scenarios[i]].primary_energy_use_m2 > primaryEnergyUseData.max)
                primaryEnergyUseData.max = project[scenarios[i]].primary_energy_use_m2;
            if (typeof project[scenarios[i]] !== "undefined" && project[scenarios[i]].use_generation == 1 && project[scenarios[i]].fuel_totals['generation'].primaryenergy / project[scenarios[i]].TFA < primaryEnergyUseData.min)  // fuel_totals['generation'] is negative
                primaryEnergyUseData.min = project[scenarios[i]].fuel_totals['generation'].primaryenergy / project[scenarios[i]].TFA;
        }

        primaryEnergyUseData.bills = [
            {
                value: data.currentenergy.primaryenergy_annual_kwhm2,
                label: "Non categorized"},
            {
                value: -data.currentenergy.generation.primaryenergy / data.TFA,
                label: "Non categorized"}
        ]

        return primaryEnergyUseData;
    }

    var primaryEnergyUseData = getPrimaryEnergyUseData();
    var primaryEneryUse = new BarChart({
        chartTitleColor: 'rgb(87, 77, 86)',
        yAxisLabelColor: 'rgb(87, 77, 86)',
        barLabelsColor: 'rgb(87, 77, 86)',
        yAxisLabel: 'kWh/m' + String.fromCharCode(178) + '.year',
        fontSize: 33,
        font: "Karla",
        width: 1200,
        chartHeight: 600,
        division: 50,
        barWidth: 110,
        barGutter: 80,
        chartHigh: primaryEnergyUseData.max,
        chartLow: primaryEnergyUseData.min - 50,
        defaultBarColor: 'rgb(157,213,203)',
        barColors: {
            'Water Heating': 'rgb(157,213,203)',
            'Space Heating': 'rgb(66, 134, 244)',
            'Cooking': 'rgb(24,86,62)',
            'Appliances': 'rgb(240,212,156)',
            'Lighting': 'rgb(236,102,79)', 'Fans and Pumps': 'rgb(246, 167, 7)', 'Non categorized': 'rgb(131, 51, 47)',
            // 'Generation': 'rgb(200,213,203)'
        },
        data: [{label: 'Your Home Now', value: primaryEnergyUseData.master},
            {label: 'Bills data', value: primaryEnergyUseData.bills}, {label: 'Scenario 1', value: primaryEnergyUseData.scenario1},
            {label: 'Scenario 2', value: primaryEnergyUseData.scenario2},
            {label: 'Scenario 3', value: primaryEnergyUseData.scenario3}
        ],
        targets: [
            {
                label: 'UK Average 360 kWh/m' + String.fromCharCode(178) + '.a',
                target: 360,
                color: 'rgb(231,37,57)'
            }, {
                label: 'Carbon Coop Target 120 kWh/m' + String.fromCharCode(178) + '.a',
                target: 120,
                color: 'rgb(231,37,57)'
            }
        ],
    });
    $('#primary-energy-use').html('');
    primaryEneryUse.draw('primary-energy-use');


    // Figure 8: Carbon dioxide emissions in kgCO2/m2.a
    //
    //
    var carbonDioxideEmissionsData = [];
    var max = 100;
    if (typeof project["master"] !== "undefined" && typeof project["master"].kgco2perm2 !== "undefined") {
        carbonDioxideEmissionsData.push({label: "Your home now", value: project["master"].kgco2perm2});
    }
    carbonDioxideEmissionsData.push({label: "Bills data", value: project["master"].currentenergy.total_co2m2});
    if (typeof project["scenario1"] !== "undefined" && typeof project["scenario1"].kgco2perm2 !== "undefined") {
        carbonDioxideEmissionsData.push({label: "Scenario 1", value: project["scenario1"].kgco2perm2});
    }
    if (typeof project["scenario2"] !== "undefined" && typeof project["scenario2"].kgco2perm2 !== "undefined") {
        carbonDioxideEmissionsData.push({label: "Scenario 2", value: project["scenario2"].kgco2perm2});
    }
    if (typeof project["scenario3"] !== "undefined" && typeof project["scenario3"].kgco2perm2 !== "undefined") {
        carbonDioxideEmissionsData.push({label: "Scenario 3", value: project["scenario3"].kgco2perm2});
    }

    carbonDioxideEmissionsData.forEach(function (scenario) {
        if (scenario.value > max)
            max = scenario.value + 10;
    });
    var CarbonDioxideEmissions = new BarChart({
        chartTitleColor: 'rgb(87, 77, 86)',
        yAxisLabelColor: 'rgb(87, 77, 86)', barLabelsColor: 'rgb(87, 77, 86)',
        yAxisLabel: 'kgCO' + String.fromCharCode(8322) + '/m' + String.fromCharCode(178) + '.year', fontSize: 33,
        font: "Karla",
        division: 10,
        width: 1200,
        chartHeight: 600,
        chartHigh: max,
        barWidth: 110,
        barGutter: 80,
        defaultBarColor: 'rgb(157,213,203)',
        data: carbonDioxideEmissionsData,
        targets: [
            {
                label: 'Carbon Coop Target - ' + datasets.target_values.co2_emission_rate + 'kgCO' + String.fromCharCode(8322) + '/m' + String.fromCharCode(178) + '.year', target: datasets.target_values.co2_emission_rate,
                color: 'rgb(231,37,57)'
            },
            {
                label: 'UK Average - ' + datasets.uk_average_values.co2_emission_rate + 'kgCO' + String.fromCharCode(8322) + '/m' + String.fromCharCode(178) + '.year',
                target: datasets.uk_average_values.co2_emission_rate,
                color: 'rgb(231,37,57)'
            },
        ], });
    $('#carbon-dioxide-emissions').html('');
    CarbonDioxideEmissions.draw('carbon-dioxide-emissions');


    // Figure 9: Bar chart showing carbon dioxide emissions rate (kgCO2/person.a)      //
    //
    var carbonDioxideEmissionsPerPersonData = [];
    if (typeof project["master"] != "undefined" && typeof project["master"].annualco2 !== "undefined" && typeof project["master"].occupancy !== "undefined") {
        carbonDioxideEmissionsPerPersonData.push({label: "Your home now", value: project["master"].annualco2 / project["master"].occupancy});
    }

    carbonDioxideEmissionsPerPersonData.push({label: "Bills data", value: project["master"].TFA * project["master"].currentenergy.total_co2m2 / project["master"].occupancy});
    if (typeof project["scenario1"] != "undefined" && typeof project["scenario1"].annualco2 !== "undefined" && typeof project["scenario1"].occupancy !== "undefined") {
        carbonDioxideEmissionsPerPersonData.push({label: "Scenario 1", value: project["scenario1"].annualco2 / project["scenario1"].occupancy});
    }
    if (typeof project["scenario2"] != "undefined" && typeof project["scenario2"].annualco2 !== "undefined" && typeof project["scenario2"].occupancy !== "undefined") {
        carbonDioxideEmissionsPerPersonData.push({label: "Scenario 2", value: project["scenario2"].annualco2 / project["scenario2"].occupancy});
    }
    if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"].annualco2 !== "undefined" && typeof project["scenario3"].occupancy !== "undefined") {
        carbonDioxideEmissionsPerPersonData.push({label: "Scenario 3", value: project["scenario3"].annualco2 / project["scenario3"].occupancy});
    }

    var max = 8000;
    carbonDioxideEmissionsPerPersonData.forEach(function (scenario) {
        if (scenario.value > max)
            max = scenario.value + 1000;
    });

    var CarbonDioxideEmissionsPerPerson = new BarChart({
        chartTitleColor: 'rgb(87, 77, 86)',
        yAxisLabelColor: 'rgb(87, 77, 86)',
        barLabelsColor: 'rgb(87, 77, 86)',
        yAxisLabel: 'kgCO' + String.fromCharCode(8322) + '/person/year',
        fontSize: 33,
        font: "Karla",
        division: max < 28000 ? 1000 : 2000,
        chartHigh: max,
        width: 1200,
        chartHeight: 600,
        barWidth: 110,
        barGutter: 70,
        defaultBarColor: 'rgb(157,213,203)', defaultVarianceColor: 'rgb(231,37,57)',
        // barColors: {
        // 	'Space heating': 'rgb(157,213,203)',
        // 	'Pumps, fans, etc.': 'rgb(24,86,62)',
        // 	'Cooking': 'rgb(40,153,139)',         // },
        data: carbonDioxideEmissionsPerPersonData
    });
    $('#carbon-dioxide-emissions-per-person').html('');
    CarbonDioxideEmissionsPerPerson.draw('carbon-dioxide-emissions-per-person');


    // Figure 10: Estimated Energy cost comparison       // Bar chart showing annual fuel cost. Waiting on Trystan for data
    //
    var estimatedEnergyCostsData = [];
    var max = 3500;
    if (typeof project["master"] != "undefined" && typeof project["master"].total_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Your home now", value: project["master"].total_cost});
        if (max < project["master"].total_cost + 0.3 * project["master"].total_cost)
            max = project["master"].total_cost + 0.3 * project["master"].total_cost;
    }
    estimatedEnergyCostsData.push({label: "Bills data", value: project["master"].currentenergy.total_cost});
    if (max < project["master"].currentenergy.total_cost + 0.3 * project["master"].currentenergy.total_cost)
        max = project["master"].currentenergy.total_cost + 0.3 * project["master"].currentenergy.total_cost;
    if (typeof project["scenario1"] != "undefined" && typeof project["scenario1"].total_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Scenario 1", value: project["scenario1"].total_cost});
        if (max < project["scenario1"].total_cost + 0.3 * project["scenario1"].total_cost)
            max = project["scenario1"].total_cost + 0.3 * project["scenario1"].total_cost;
    }
    if (typeof project["scenario2"] != "undefined" && typeof project["scenario2"].total_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Scenario 2", value: project["scenario2"].total_cost});
        if (max < project["scenario2"].total_cost + 0.3 * project["scenario2"].total_cost)
            max = project["scenario2"].total_cost + 0.3 * project["scenario2"].total_cost;
    }
    if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"].total_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Scenario 3", value: project["scenario3"].total_cost});
        if (max < project["scenario3"].total_cost + 0.3 * project["scenario3"].total_cost)
            max = project["scenario3"].total_cost + 0.3 * project["scenario3"].total_cost;
    }

    var EstimatedEnergyCosts = new BarChart({
        chartTitleColor: 'rgb(87, 77, 86)',
        yAxisLabelColor: 'rgb(87, 77, 86)',
        barLabelsColor: 'rgb(87, 77, 86)',
        yAxisLabel: '£/year',
        fontSize: 33,
        font: "Karla",
        division: 500,
        chartHigh: max,
        width: 1200,
        chartHeight: 600,
        barGutter: 80, defaultBarColor: 'rgb(157,213,203)',
        data: estimatedEnergyCostsData
    });
    $('#estimated-energy-cost-comparison').html('');
    EstimatedEnergyCosts.draw('estimated-energy-cost-comparison');

    // Figure 11: Your home compared with the average home.      // Main SAP assumptions  vs actual condition comparison - table stating 'higher' or 'lower'.
    // Would be useful to have total hours of heating (currently only given times heating is on - see question 3a)
    // Where is data for number of rooms not heated? Appliance Q?
    //

    //$(".js-occupancy-comparison").html(compare(2.9, data.occupancy));
    //var normalDayHeatingHours = getTimeDifference(data.household["3a_heatinghours_normal_on1"], data.household["3a_heatinghours_normal_off1"]);
    //var altDayHeatingHours = getTimeDifference(data.household["3a_heatinghours_normal_on2"], data.household["3a_heatinghours_normal_off2"]);
    var hours_off = 0;
    for (var period in data.temperature.hours_off.weekday)
        hours_off += data.temperature.hours_off.weekday[period];
    var normalDayHeatingHours = 24 - hours_off;
    hours_off = 0;
    for (var period in data.temperature.hours_off.weekend)
        hours_off += data.temperature.hours_off.weekend[period];
    var altDayHeatingHours = 24 - hours_off;
    var totalHeatingHours = normalDayHeatingHours; // We only take into account weekdays hours, discussion in issue 182

    function compare(num1, num2) {
        if (num1 > num2) {
            return "Lower";
        } else if (num1 < num2) {
            return "Higher";
        } else if (num1 == num2) {
            return "Same";
        } else {
            return "N/A";
        }
    }

    // time format is "11:30" or "15:00" etc
    function getTimeDifference(time1, time2) {
        if (time1 == null || time2 == null) {
            return false;
        }
        // thanks to http://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
        var time1Array = time1.split(":");
        var time2Array = time2.split(":");
        // use a constant date (e.g. 2000-01-01) and the desired time to initialize two dates

        var date1 = new Date(2000, 0, 1, time1Array[0], time1Array[1]);
        var date2 = new Date(2000, 0, 1, time2Array[0], time2Array[1]);
        // the following is to handle cases where the times are on the opposite side of
        // midnight e.g. when you want to get the difference between 9:00 PM and 5:00 AM

        if (date2 < date1) {
            date2.setDate(date2.getDate() + 1);
        }

        var diff = date2 - date1;
        // diff is in miliseconds so convert to hours
        return diff / (1000 * 60 * 60);
    }

    // $(".js-average-heating-hours").html(totalHeatingHours);
    $(".js-average-heating-hours-comparison").html(compare(9, totalHeatingHours));//
    $(".js-thermostat-comparison").html(compare(21, parseFloat(data.household["3a_roomthermostat"])));
    $('#js-habitable-not-heated-rooms').html(project['master'].household["3a_habitable_rooms_not_heated"])
    $(".js-unheated-rooms-comparison").html(compare(0, project['master'].household["3a_habitable_rooms_not_heated"]));
    $(".js-appliance-energy-use").html(Math.round(project.master.energy_requirements.appliances != undefined ? project.master.energy_requirements.appliances.quantity : 0));
    $(".js-appliance-energy-use-comparison").html(compare(3880, Math.round(project.master.energy_requirements.appliances != undefined ? project.master.energy_requirements.appliances.quantity : 0)));
    // Figure 12: SAP chart
    //
    //

    function calculateSapRatingFromScore(score) {

        if (!score) {
            return false;
        }

        var sapRatings = {
            "90": "A",
            "80": "B",
            "70": "C", "60": "D",
            "50": "E",
            "40": "F",
            "30": "G",
        }
        var scoreFlooredToNearestTen = Math.floor(score / 10) * 10;
        //Lowest band goes all the way to zero, but push up to 30 in order to draw graph
        if (scoreFlooredToNearestTen < 30) {
            scoreFlooredToNearestTen = 30;
        }
        return sapRatings[scoreFlooredToNearestTen];
    }


    if (typeof project["master"] != "undefined" && typeof project["master"]["SAP"] !== "undefined") {
        var sapNow = Math.round(project["master"]["SAP"]["rating"]);
    } else {
        var sapNow = false;
    }

    if (typeof project["scenario1"] != "undefined" && typeof project["scenario1"]["SAP"] !== "undefined") {
        var sapScenario1 = Math.round(project["scenario1"]["SAP"]["rating"]);
    } else {
        var sapScenario1 = false;
    }

    if (typeof project["scenario2"] != "undefined" && typeof project["scenario2"]["SAP"] !== "undefined") {
        var sapScenario2 = Math.round(project["scenario2"]["SAP"]["rating"]);
    } else {
        var sapScenario2 = false;
    }
    if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"]["SAP"] !== "undefined") {
        var sap2050 = Math.round(project["scenario3"]["SAP"]["rating"]);
    } else {
        var sap2050 = false;
    }

    var sapAverage = 59;
    // var sap2050 = Math.round(project["scenario3"]["SAP"]["rating"]);

    $(".js-sap-score-now").html(sapNow);
    $(".js-sap-rating-now").html(calculateSapRatingFromScore(sapNow));
    $(".js-sap-score-scenario1").html(sapScenario1);
    $(".js-sap-rating-scenario1").html(calculateSapRatingFromScore(sapScenario1));
    $(".js-sap-score-scenario2").html(sapScenario2);
    $(".js-sap-rating-scenario2").html(calculateSapRatingFromScore(sapScenario2));
    $(".js-sap-score-2050").html(sap2050);
    $(".js-sap-rating-2050").html(calculateSapRatingFromScore(sap2050));
    $(".js-sap-score-average").html(sapAverage);
    $(".js-sap-rating-average").html(calculateSapRatingFromScore(sapAverage));

    // Figure 13: Comfort Tables.
    //	
    //
    function createComforTable(options, tableID, chosenValue) {
        $("#" + tableID + " .comfort-table-td").remove();
        for (var i = options.length - 1; i >= 0; i--) {

            if (options[i].title == chosenValue) {
                var background = options[i].color;
                $("#" + tableID + " .extreme-left").after($("<td class='comfort-table-td comfort-table-option " + i + "'><img src='../Modules/assessment/img-assets/" + options[i].color + "_box.jpg' style='height:30px;width:30px;vertical-align:middle' /></td>"));
            } else {
                var background = 'transparent';
                $("#" + tableID + " .extreme-left").after($("<td class='comfort-table-td comfort-table-option " + i + "'></td>"));
            }
            //$("#" + tableID + " .extreme-left").after($("<td class='comfort-table-td comfort-table-option " + i + "'  style='background:" + background + "'></td>"));
        }
    }

    //var red = "rgb(228, 27, 58)";
    //var green = "rgb(149, 211, 95)";

    // Temperature in Winter
    if (project.master.household["6a_temperature_winter"] == undefined
            || project.master.household["6a_airquality_winter"] == undefined
            || project.master.household["6a_airquality_summer"] == undefined
            || project.master.household["6a_temperature_summer"] == undefined
            || project.master.household["6b_daylightamount"] == undefined
            || project.master.household["6b_artificallightamount"] == undefined) {
        $('.comfort-tables').html('<p>There is not enough information, please check section 6 in Household Questionnaire. </p>')
    } else {
        var options = [{
                title: "Too cold", color: 'red',
            }, {
                title: "Just right",
                color: 'green',
            }, {
                title: "Too hot", color: 'red'
            }
        ];
        createComforTable(options, "comfort-table-winter-temp", project.master.household["6a_temperature_winter"]);
        // Air quality
        var options = [
            {
                title: "Too dry", color: 'red',
            }, {
                title: "Just right",
                color: 'green',
            }, {title: "Too stuffy",
                color: 'red'
            }];
        createComforTable(options, "comfort-table-winter-air", project.master.household["6a_airquality_winter"]);
        createComforTable(options, "comfort-table-summer-air", project.master.household["6a_airquality_summer"]);
        // Temperature in Summer
        var options = [
            {
                title: "Too cold", color: 'red',
            }, {
                title: "Just right", color: 'green',
            }, {
                title: "Too hot",
                color: 'red'
            }
        ];
        createComforTable(options, "comfort-table-summer-temp", project.master.household["6a_temperature_summer"]);
        // Air quality in Summer
        var options = [
            {
                title: "Too dry", color: 'red',
            }, {
                title: "Just right",
                color: 'green',
            }, {
                title: "Too stuffy",
                color: 'red'
            }];
        createComforTable(options, "comfort-table-summer-air", project.master.household["6a_airquality_summer"]);
        var options = [
            {
                title: "Too little",
                color: 'red',
            }, {title: "Just right",
                color: 'green',
            }, {
                title: "Too much",
                color: 'red'
            }
        ];
        createComforTable(options, "comfort-table-daylight-amount", project.master.household["6b_daylightamount"]);
        var options = [
            {
                title: "Too little",
                color: 'red',
            }, {
                title: "Just right",
                color: 'green',
            }, {
                title: "Too much",
                color: 'red'
            }
        ];
        createComforTable(options, "comfort-table-artificial-light-amount", project.master.household["6b_artificallightamount"]);
        var options = [
            {
                title: "Too draughty",
                color: 'red',
            }, {
                title: "Just right",
                color: 'green',
            }, {
                title: "Too still",
                color: 'red'
            }
        ];
        createComforTable(options, "comfort-table-draughts-summer", project.master.household["6a_draughts_summer"]);
        var options = [
            {
                title: "Too draughty",
                color: 'red',
            }, {
                title: "Just right",
                color: 'green',
            }, {
                title: "Too still",
                color: 'red'
            }
        ];
        createComforTable(options, "comfort-table-draughts-winter", project.master.household["6a_draughts_winter"]);
    }

    // Figure 14: Humidity Data
    // 
    //
    if (data.household.reading_humidity1 == undefined && data.household.reading_humidity2 == undefined)
        $(".js-average-humidity").html('There is not enough information, please check section 3 in Household Questionnaire.');
    else if (data.household.reading_humidity1 != undefined && data.household.reading_humidity2 == undefined)
        $(".js-average-humidity").html('When we visited, the relative humidity was ' + data.household.reading_humidity1 + ' %. (The ideal range is 40-60%).');
    else if (data.household.reading_humidity1 == undefined && data.household.reading_humidity2 != undefined)
        $(".js-average-humidity").html(' When we visited, the relative humidity was ' + data.household.reading_humidity2 + '%. (The ideal range is 40-60%).');
    else {
        var averageHumidity = 0.5 * (data.household.reading_humidity1 + data.household.reading_humidity2);
        $(".js-average-humidity").html('When we visited, the relative humidity was ' + averageHumidity + '%. (The ideal range is 40-60%).');
    }

    // Figure 15: Temperature Data
    // 
    //
    if (data.household.reading_temp1 == undefined && data.household.reading_temp2 == undefined)
        $(".js-average-temp").html('There is not enough information, please check section 3 in Household Questionnaire.');
    else if (data.household.reading_temp1 != undefined && data.household.reading_temp2 == undefined)
        $(".js-average-temp").html('When we visited, the relative temperature was ' + data.household.reading_temp1 + ' °C.<br />(It is recommended that living spaces are at 16<sup>o</sup>C as a minium.');
    else if (data.household.reading_temp1 == undefined && data.household.reading_temp2 != undefined)
        $(".js-average-temp").html(' When we visited, the relative temperature was ' + data.household.reading_temp2 + '°C.<br />(It is recommended that living spaces are at 16<sup>o</sup>C as a minium.');
    else {
        var averageHumidity = 0.5 * (data.household.reading_temp1 + data.household.reading_temp2);
        $(".js-average-temp").html('When we visited, the relative temperature was ' + averageHumidity + '°C.<br />(It is recommended that living spaces are at 16<sup>o</sup>C as a minium (World Health Organisation).');
    }
    // Figure 16: You also told us...
    // 
    //
    data.household['6c_noise_comment'] == undefined ? $('.js-noise_comment').html('There is not enough information, please check section 6 in Household Questionnaire.') : $('.js-noise_comment').html(data.household['6c_noise_comment']);
    data.household['6b_problem_locations'] == undefined || data.household['6b_problem_locations'] === '' ? $('.js-problem_locations_daylight').html('There is not enough information, please check section 6 in Household Questionnaire.') : $('.js-problem_locations_daylight').html(data.household['6b_problem_locations']);
    data.household['6a_problem_locations'] == undefined || data.household['6a_problem_locations'] == '' ? $('.js-problem_locations').html('There is not enough information, please check section 6 in Household Questionnaire.') : $('.js-problem_locations').html(data.household['6a_problem_locations']);
    data.household['6d_favourite_room'] == undefined || data.household['6d_favourite_room'] == '' ? $('.js-favourite_room').html('There is not enough information, please check section 6 in Household Questionnaire.') : $('.js-favourite_room').html(data.household['6d_favourite_room']);
    data.household['6d_unloved_rooms'] == undefined || data.household['6d_unloved_rooms'] == '' ? $('.js-unloved_rooms').html('There is not enough information, please check section 6 in Household Questionnaire.') : $('.js-unloved_rooms').html(data.household['6d_unloved_rooms']);

    var laundryHabits = "";
    if (typeof data.household["4b_drying_outdoorline"] != "undefined" && data.household["4b_drying_outdoorline"]) {
        laundryHabits += "outdoor clothes line, ";
    }
    if (typeof data.household["4b_drying_indoorrack"] != "undefined" && data.household["4b_drying_indoorrack"]) {
        laundryHabits += "indoor clothes racks, ";
    }
    if (typeof data.household["4b_drying_airingcupboard"] != "undefined" && data.household["4b_drying_airingcupboard"]) {
        laundryHabits += "airing cupboard, ";
    }
    if (typeof data.household["4b_drying_tumbledryer"] != "undefined" && data.household["4b_drying_tumbledryer"]) {
        laundryHabits += "tumble dryer, ";
    }
    if (typeof data.household["4b_drying_washerdryer"] != "undefined" && data.household["4b_drying_washerdryer"]) {
        laundryHabits += "washer/dryer, ";
    }
    if (typeof data.household["4b_drying_radiators"] != "undefined" && data.household["4b_drying_radiators"]) {
        laundryHabits += "radiators, ";
    }
    if (typeof data.household["4b_drying_electricmaiden"] != "undefined" && data.household["4b_drying_electricmaiden"]) {
        laundryHabits += "electric maiden, ";
    }

    if (laundryHabits.length === 0)
        laundryHabits = 'There is not enough information, please check section 4 in Household Questionnaire.'
    else
        var laundryHabits = laundryHabits.slice(0, -2);
    $(".js-laundry-habits").html(laundryHabits);

    // Figure 15 and Figure 16 and Figure 17: Scenarios Measures    //
    // Calculate Total cost

    for (scenario in project) {
        if (scenario == 'scenario1' || scenario == 'scenario3' || scenario == 'scenario2') {
            $('#tota-cost-' + scenario).html('£' + Math.round(measures_costs(scenario) / 10) * 10);
        }
    }

    // Tables - Figure 18
    var measuresTableColumns = [
        "name",
        "location",
        "description",
        "performance",
        "benefits",
        "cost",
        "cost_units",
        "quantity",
        "cost_total",
        "who_by",
        "key_risks",
        "disruption",
        "associated_work",
        "maintenance",
        "notes"
    ];
    function populateMeasuresTable(scenario, tableSelector, summaryTableSelector, listSelector) {
        if (project[scenario].fabric.measures != undefined)
            addListOfMeasuresByIdToSummaryTable(project[scenario].fabric.measures, tableSelector, summaryTableSelector, listSelector);
        if (project[scenario].measures != undefined) {
            if (project[scenario].measures.ventilation != undefined) {
                if (project[scenario].measures.ventilation.extract_ventilation_points != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.extract_ventilation_points, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.ventilation.intentional_vents_and_flues != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues_measures, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.ventilation.draught_proofing_measures != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.ventilation.draught_proofing_measures, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.ventilation.ventilation_systems_measures != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.ventilation.ventilation_systems_measures, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.ventilation.clothes_drying_facilities != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.clothes_drying_facilities, tableSelector, summaryTableSelector, listSelector);
            }
            if (project[scenario].measures.water_heating != undefined) {
                if (project[scenario].measures.water_heating.water_usage != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.water_heating.water_usage, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.water_heating.storage_type != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.water_heating.storage_type, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.water_heating.pipework_insulation != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.water_heating.pipework_insulation, tableSelector, summaryTableSelector, listSelector);
                if (project[scenario].measures.water_heating.hot_water_control_type != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.water_heating.hot_water_control_type, tableSelector, summaryTableSelector, listSelector);
            }
            if (project[scenario].measures.space_heating_control_type != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.space_heating_control_type, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.heating_systems != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.heating_systems, tableSelector, summaryTableSelector, listSelector);
            if (project[scenario].measures.space_heating != undefined) {
                if (project[scenario].measures.space_heating.heating_control != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.space_heating.heating_control, tableSelector, summaryTableSelector, listSelector);
            }
            if (project[scenario].use_generation == 1 && project[scenario].measures.PV_generation != undefined) {
                addMeasureToSummaryTable(project[scenario].measures.PV_generation, tableSelector, summaryTableSelector, listSelector);
            }
            if (project[scenario].measures.LAC != undefined) {
                if (project[scenario].measures.LAC.lighting != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.LAC.lighting, tableSelector, summaryTableSelector, listSelector);
            }
        }
    }
    function addListOfMeasuresByIdToSummaryTable(listOfMeasures, tableSelector, summaryTableSelector, listSelector) {
        for (var measureID in listOfMeasures) {
            var measure = listOfMeasures[measureID];
            addMeasureToSummaryTable(measure, tableSelector, summaryTableSelector, listSelector);
        }
    }
    function addMeasureToSummaryTable(measure, tableSelector, summaryTableSelector, listSelector) {
        // Complete table
        var html = "<tr>";
        var row = $('<tr></tr>');
        for (var i = 0; i < measuresTableColumns.length; i++) {
            var cell = $('<td></td>');
            cell.html(isNaN(measure.measure[measuresTableColumns[i]]) ? measure.measure[measuresTableColumns[i]] : (1.0 * measure.measure[measuresTableColumns[i]]).toFixed(2));
            row.append(cell);
        }
        $(tableSelector).append(row);
        //Summary table
        addRowToSummaryTable(summaryTableSelector, measure.measure.name, measure.measure.location, measure.measure.description, measure.measure.performance,
                measure.measure.benefits, (1.0 * measure.measure.cost_total).toFixed(2), measure.measure.who_by, measure.measure.disruption);

        //List
        html = "<table class='no-break'>";
        html += '<tr><td style="width:13%"><strong>Measure: </strong></td><td colspan=3>' + measure.measure.name + '</td></tr>';
        if (typeof measure.measure.location != 'undefined') {
            var location = measure.measure.location.replace(/,br/g, ', '); // for measures applied in bulk to fabric elements the location has the form of: W9,brW10,brW21,brD3,brW4,brW5,brW6a,brW16 , and we dont want that
            if (location[location.length - 2] == ',' && location[location.length - 1] == ' ')
                location = location.substring(0, location.length - 2);
            html += '<tr><td><strong>Label/location: </strong></td><td colspan=3>' + location + '</td></tr>';
        }
        else
            html += '<tr><td><strong>Label/location: </strong></td><td colspan=3> Whole house</td></tr>';
        html += '<tr><td><strong>Description: </strong></td><td colspan=3>' + measure.measure.description + '</td></tr>';
        html += '<tr><td><strong>Associated work: </strong></td><td colspan=3>' + measure.measure.associated_work + '</td></tr>';
        if (measure.measure.maintenance != 'undefined')
            html += '<tr><td><strong>Maintenance: </strong></td><td colspan=3>' + measure.measure.maintenance + '</td></tr>';
        else
            html += '<tr><td><strong>Maintenance: </strong></td><td colspan=3> N/A</td></tr>';
        html += '<tr><td><strong>Special and other considerations: </strong></td><td colspan=3>' + measure.measure.notes + '</td></tr>';
        html += '<tr><td><strong>Who by: </strong></td><td style="width:35%">' + measure.measure.who_by + '</td>';
        html += '<td style="width:13%"><strong>Key risks: </strong></td><td>' + measure.measure.key_risks + '</td></tr>';
        html += '<tr><td><strong>Benefits: </strong></td><td>' + measure.measure.benefits + '</td>';
        html += '<td><strong>Dirt and disruption: </strong></td><td>' + measure.measure.disruption.replace('MEDIUMHIGH', 'MEDIUM / HIGH') + '</td></tr>';
        var perf = measure.measure.performance.replace("WK.m2", "W/m<sup>2</sup>.K")
                .replace("W/K.m2", "W/m<sup>2</sup>.K")
                .replace('m3m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('m3/m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('na', 'n/a'); // We have realized that some units were inputted wrong in the library
        html += '<tr><td><strong>Performance target: </strong></td><td style="width:35%">' + perf + '</td>';
        html += '<td colspan=2><table  style="width:100%">';
        html += measure.measure.min_cost == undefined ? '' : '<tr><td><strong>Minimum cost</strong></td><td colspan=3>' + measure.measure.min_cost + '</td></tr>';
        html += '<tr><td style="width:25%"><strong>Cost (£/unit): </strong></td><td>' + measure.measure.cost + '</td><td style="width:30%"><strong>Units: </strong></td><td>' + measure.measure.cost_units + '</td></tr>';
        html += '<tr><td><strong>Quantity (units): </strong></td><td>' + (1.0 * measure.measure.quantity).toFixed(2) + '</td><td><strong>Total cost (£): </strong></td><td>' + (1.0 * measure.measure.cost_total).toFixed(2) + '</td></tr></table></td></tr>';
        html += "</table>";
        $(listSelector).append(html);
    }

    function initialiseMeasuresTable(tableSelector) {
        var html = '<tr>\
     <th class="tg-yw4l" rowspan="2">Measure</th>\<th class="tg-yw4l" rowspan="2">Label/location</th>\
     <th class="tg-yw4l" rowspan="2">Description</th>\
     <th class="tg-yw4l" rowspan="2">Performance Target</th>\         <th class="tg-yw4l" rowspan="2">Benefits (in order)</th>\
     <th class="tg-yw4l" colspan="4">How Much?</th>\
     <th class="tg-yw4l" rowspan="2">Who by?</th>\
     <th class="tg-yw4l" rowspan="2">Key risks</th>\
     <th class="tg-yw4l" rowspan="2">Dirt and disruption?</th>\
     <th class="tg-yw4l" rowspan="2">Associated work?</th>\
     <th class="tg-yw4l" rowspan="2">Maintenace</th>\
     <th class="tg-yw4l" rowspan="2">Special and other considerations</th>\
     </tr>\
     <tr>\
     <td class="th">Rate (£)</td>\ 						    <td class="th">Unit</td>\
     <td class="th">Quantity</td>\
     <td class="th">Total</td>\
     </tr>';
        return $(tableSelector).html(html);
    }
    function createMeasuresTable(scenario, tableSelector, summaryTableSelector, listSelector) {
        initialiseMeasuresTable(tableSelector);
        initiliaseMeasuresSummaryTable(summaryTableSelector);
        populateMeasuresTable(scenario, tableSelector, summaryTableSelector, listSelector);
    }

    function initiliaseMeasuresSummaryTable(summaryTableSelector) {
        var html = "<thead>\
     <tr>\
     <th>Name</th>\<th>Label/location</th>\ <th>Performance target</th>\         <th>Benefits (in order)</th>\ 	 	 	<th>Cost</th>\
     <th>Completed By</th>\
     <th>Disruption</th>\
     </tr>\ 			</thead>\
     <tbody>\
     </tbody>";
        return $(summaryTableSelector).html(html);
    }

    function addRowToSummaryTable(tableSelector, name, location, description, performance, benefits, cost, who_by, disruption) {
        var html = '<tr><td class="highlighted-col">' + name + '</td>';
        if (typeof location != 'undefined') {
            location = location.replace(/,br/g, ', '); // for measures applied in bulk to fabric elements the location has the form of: W9,brW10,brW21,brD3,brW4,brW5,brW6a,brW16 , and we dont want that
            if (location[location.length - 2] == ',' && location[location.length - 1] == ' ')
                location = location.substring(0, location.length - 2);
            if (location.length > 50)
                location = "Various";
            html += '<td><div class="text-width-limiter">' + location + '</div>';
        }
        else
            html += '<td><div class="text-width-limiter">Whole house</div>';
        html += '</td>';
        var perf = performance.replace("WK.m2", "W/m<sup>2</sup>.K")
                .replace("W/K.m2", "W/m<sup>2</sup>.K")
                .replace('m3m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('m3/m2.hr50pa', 'm<sup>3</sup>/m<sup>2</sup>.hr50pa')
                .replace('na', 'n/a'); // We have realized that some units were inputted wrong in the library
        html += '<td>' + perf + '</td>';
        html += '<td>' + benefits + '</td>';
        html += '<td class="cost">£' + Number(cost).toFixed(0) + '</td>';
        html += '<td>' + who_by + '</td>';
        html += '<td>' + disruption.replace('MEDIUMHIGH', 'MEDIUM / HIGH') + '</td>';
        html += '</tr>';
        $(tableSelector + " tbody").append($(html));
    }

    if (typeof project["scenario1"] != "undefined") {
        $(".output-scenario1-name").html(project["scenario1"]["scenario_name"]);
        $('#scenario1-measures').html("");
        $('.js-measures1-summary').html("");
        $('#scenario1-measures-list').html("");
        createMeasuresTable("scenario1", "#scenario1-measures", ".js-measures1-summary", '#scenario1-measures-list');
    }
    else
        $(".output-scenario1-name").html('This scenario has not been created');

    if (typeof project["scenario2"] != "undefined") {
        $(".output-scenario2-name").html(project["scenario2"]["scenario_name"]);
        $('#scenario2-measures').html("");
        $('.js-measures2-summary').html("");
        $('#scenario2-measures-list').html("");
        createMeasuresTable("scenario2", "#scenario2-measures", ".js-measures2-summary", '#scenario2-measures-list');
    }
    else
        $(".output-scenario2-name").html('This scenario has not been created');

    if (typeof project["scenario3"] != "undefined") {
        $(".output-scenario3-name").html(project["scenario3"]["scenario_name"]);
        $('#scenario3-measures').html("");
        $('.js-measures3-summary').html("");
        $('#scenario3-measures-list').html("");
        createMeasuresTable("scenario3", "#scenario3-measures", ".js-measures3-summary", '#scenario3-measures-list');
    }
    else
        $(".output-scenario3-name").html('This scenario has not been created');

    // We have decided we don't want the Measures Complete tables as a table because they take too much vertical space
    // I prefer to hide them instead of deleting them just in case we wnat to do something with them in the future
    $('#scenario1-measures').hide();
    $('#scenario2-measures').hide();
    $('#scenario3-measures').hide();

    // Figure 18: Scenario 2 Measures
    //
    //

    // Figure 19: Scenario 3 Measures
    //
    //

    // Figures  15, 16, 17, 18, 19, 20 - Display message when scenario is created from another scenario
    if (project['scenario1'] != undefined && project['scenario1'].created_from != undefined && project['scenario1'].created_from != 'master')
        $('.scenario1-inheritance').html('This scenario assumes the measures in Scenario ' + project['scenario1'].created_from.split('scenario')[1] + ' have already been carried out and adds to them').show();
    if (project['scenario2'] != undefined && project['scenario2'].created_from != undefined && project['scenario2'].created_from != 'master')
        $('.scenario2-inheritance').html('This scenario assumes the measures in Scenario ' + project['scenario2'].created_from.split('scenario')[1] + ' have already been carried out and adds to them').show();
    if (project['scenario3'] != undefined && project['scenario3'].created_from != undefined && project['scenario3'].created_from != 'master')
        $('.scenario3-inheritance').html('This scenario assumes the measures in Scenario ' + project['scenario3'].created_from.split('scenario')[1] + ' have already been carried out and adds to them').show();

    // Commentary
    if (data.household.commentary != undefined) {
        var commentary = data.household.commentary.replace(/\n/gi, "<br />");
        $('#commentary').html(commentary);
    }

    // Figure 23: Appendix B - data from household questionnaire
    //
    //
    $(".js-heating-hours-normal").html(normalDayHeatingHours);
    $(".js-heating-hours-alt").html(altDayHeatingHours);
    // Scenario comparison
    if (typeof project["scenario1"] != "undefined")
        compareCarbonCoop("scenario1", "#js-scenario1-comparison");
    if (typeof project["scenario2"] != "undefined")
        compareCarbonCoop("scenario2", "#js-scenario2-comparison");
    if (typeof project["scenario3"] != "undefined")
        compareCarbonCoop("scenario3", "#js-scenario3-comparison");


    // Generate link to export to pdf
    $('#export-to-pdf-link').prop('href', 'printcarboncoopreport?html=' + $('div.carbon-report-wrapper').html());

    // Insert Carbon Co-op logo
    $('#logo-in-report').attr("src", path + "Modules/assessment/img-assets/carbonco-op_logo.jpg").attr('alt', 'Carbon Co-op logo');


    // Specific report content per organization
    if (org_report === 'CAfS') {
        $('h1.doc-title-org').html('Cumbria Action for Sustainability')
        $('.org-name').html('CAfS');

        // CSS
        $('#print-css').append("@media print{\n\
                .carbon-report-wrapper .doc-title-wrapper{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper .top-border-title{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper .section-title{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper #performace-summary-key{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper .sap-table{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper .right-align-item-list li{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper th{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper td{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper .measures-list>table{border-color: rgb(161,205,68)}\n\
                .carbon-report-wrapper .three-col-table thead th:after,\n\
                .carbon-report-wrapper .three-col-table thead th:before\n\
                    {background:rgb(161,205,68)}\n\
                .carbon-report-wrapper .js-measures1-summary th, .carbon-report-wrapper .js-measures1-summary td,\n\
                .carbon-report-wrapper .js-measures2-summary th, .carbon-report-wrapper .js-measures2-summary td,\n\
                .carbon-report-wrapper .js-measures3-summary th, .carbon-report-wrapper .js-measures3-summary td\n\
                    {border-color: rgb(161,205,68);}\n\
            }");

        // Logos in cover page
        $('#extra_logo').attr("src", path + "Modules/assessment/img-assets/CAfS_Logo_CMYK.jpg").attr('alt', 'Cumbria Action for Sustainability logo').css('width', '150px');
        $('#cover').append('<img id="bgltr_logo" class="printable-inline" style="margin-left: 150px; width: 100px;" src="' + path + 'Modules/assessment/img-assets/hi_big_e_min_blue.jpg" />')

        // Extra info in cover page
        var to_append = '<p class="printable" style="font-size:14px;margin-top:50px">Your report is provided by Cumbria Action for Sustainability (CAfS) with funding from The Big Lottery. It is produced in partnership with Carbon Coop, who provide the accredited audit framework along with targets included in the report. </p>';
        to_append += "<p class='printable' style='font-size:12px; text-align:center'>Cumbria Action for Sustainability - Eden Rural Foyer, Old London Road, Penrith, CA11 8ET - 01768 210 276 - www.cafs.org.uk <br />Registered Charity Number: 1123155</p>";
        $('#cover').append(to_append)

        // Adjust size of title in first page to fit the logo
        $('#logo-in-report').css('margin-top', '100px');
        $('#print-css').append("@media print{\n\
                .doc-sub-title.MHEP{font-size:30px}\n\
                h1.doc-title-org{font-size:30px}\n\
                .doc-title-wrapper.doc-title{margin-bottom:50px}\n\
            }");

        // Contact for questions
        $('#contact-for-questions').html('andrew@cafs.org.uk');

        // Section 3.0
        $('#section-3-title').html('How can CAfS help?');
        $('#section-3-how-can-we-help').html("<p>Cumbria Action for Sustainability (CAfS) is a charity based in Penrith who work with individuals, businesses and communities to help them become more sustainable.</p>\n\
            <p>CAfS promotes low carbon living, energy saving and reduced use of fossil fuels, by providing energy and weather resilience audits, information, advice and motivation through  site visits, practical projects and training.</p>\n\
            <p>When taking things forward in your home it is important to realise there are no one-size-fits-all solutions. Some people employ professionals to oversee recommended improvements, others carry out he work on a DIY basis. Some plan for one big project to achieve everything, others work in stages, incrementally over years.</p>\n\
            <p>Whatever way you decide to progress, there are a number of ways CAfS can help you with further information and advice.</p>");
        $('#section-3-available-to-title').html('3.1 Available to you');
        $('#section-3-available-to').html('<p><strong>Talks and training</strong><br />We host talks, short and multi-day training courses in effective retrofitting. These are led by experts in the field, often local architects and other building professionals who are experienced with working with Cumbrian properties and helping householders tackle extreme weather and flooding issues along with energy efficiency improvements. Our courses have proven effective in providing specialist information and enabled delegates to obtain trusted and independent information.</p>\n\
            <p><strong>CAfS Greenbuild Festival</strong><br />Held in September each year our programme of events across Cumbria provides a valuable opportunity to see retrofit projects in action, many in progress, others complete. It\'s a great opportunity to speak with householders about effectiveness of improvements, materials, installation, costs and lessons learned.</p>\n\
            <ul style="margin:0 30px 30px"><li style="font-size:16px">Visit low-energy homes & buildings</li><li style="font-size:16px">See renewables in action</li><li style="font-size:16px">Explore sustainable living</li><li style="font-size:16px">Join talks, workshops & training</li></ul>\n\
            <p>See www.cafs.org.uk/events for details of upcoming events you can attend.</p>');
        $('#carbon-coop-services').html('');
        $('#section-3-3').html('');
        $('#section-3-4').html('');
    }

}
