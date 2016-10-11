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
    var scenarios = ["master", "scenario1", "scenario2", "scenario3"];
    // add empty objects for missing data
    // for (var i = 0 ; i < scenarios.length ; i++){
    // 	var scenarioName = scenarios[i];
    // 	var scenarioObject = project[scenarioName];
    // 	if (typeof scenarioObject === "undefined"){
    // 		project[scenarioName] = {};
    // 	}

    // 	if (typeof project[scenarioName].kwhdpp === "undefined"){
    // 		project[scenarioName].kwhdpp = 0;
    // 	}

    // 	if (typeof project[scenarioName].ventilation === "undefined"){
    // 		project[scenarioName].ventilation = {
    // 			average_WK:0
    // 		};
    // 	}

    // 	if (typeof project[scenarioName].space_heating_demand_m2 === "undefined"){
    // 		project[scenarioName].space_heating_demand_m2 = 0;
    // 	}

    // 	if (typeof project[scenarioName].fabric === "undefined"){
    // 		project[scenarioName].fabric = {
    // 			total_floor_WK: 0,
    // 			total_window_WK:0,
    // 			total_wall_WK:0,
    // 			total_roof_WK:0,
    // 			thermal_bridging_heat_loss:0,
    // 			totalwk:0
    // 		};
    // 	}

    // 	if (typeof project[scenarioName].annual_useful_gains_kWh_m2 === "undefined"){
    // 		project[scenarioName].annual_useful_gains_kWh_m2 = {
    // 			"Internal":0,
    // 			"Space heating":0,
    // 			"Solar": 0
    // 		}
    // 	}

    // 	if (typeof project[scenarioName].fuel_totals === "undefined"){
    // 		project[scenarioName].fuel_totals = {
    // 			"gas":{
    // 				"quantity": 0,
    // 			},
    // 			"electric":{
    // 				"quantity": 0,
    // 			},
    // 			"wood":{
    // 				"quantity": 0,

    // 			}
    // 		}
    // 	}
    // }



    // need to wait until page has loaded so we can use the webfont in our charts.
    //$(window).load(function(){
    WebFontConfig.active = function () {
        carboncoopreport_UpdateUI();
    };
}

function carboncoopreport_UpdateUI() {

    var scenarios = ["master", "scenario1", "scenario2", "scenario3"];
    // $(".home-image").attr("src", project[scenario].household.houseimage);
    if (data.featuredimage) {
        var img = $('<img class="home-image">').attr("src", path + "Modules/assessment/images/" + projectid + "/" + data.featuredimage)
        img.appendTo(".js-home-image-wrapper");
    }

    if (printmode == true) {
        $("#bound").css("width", "1200px"); // set to width to optimum to avoid antialiasing
        $(".js-printer-friendly-link").css("display", "none");
    } else {
        $(".js-printer-friendly-link").attr("href", "/assessment/print?id=" + projectid + "#master/carboncoopreport");
    }

// Report date
    var date = new Date();
    $('#report_date').html(date.getDate() + ' - ' + date.getMonth() + ' - ' + date.getFullYear());
    /* Figure 1: Retrofit Priorities
     //  Shows retrofit priorities - in order - identifying whether interested in retrofit for cost, comfort or carbon reasons etc.
     */

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
    for (var i = 0; i < sortedPriorities.length; i++) {
        $("#retrofit-priorities").append("<li>" + sortedPriorities[i][1] + ". " + sortedPriorities[i][2] + "</li>");
    }


    /* Figure 2: Performance Summary
     // Quick overview/summary - Benchmarking Bar Charts. Need to ensure that all scenarios displayed, not just one as on current graph.
     // Space Heating Demand (kWh/m2.a)
     // Primary Energy Demand (kWh/m2.a)
     // CO2 emission rate (kgCO2/m2.a)
     // CO2 emission rate - per person (kgCO2/m2.a)
     */

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
    ]

    var options = {
        name: "Space heating demand",
        font: "Karla",
        colors: colors,
        value: Math.round(data.space_heating_demand_m2),
        values: values,
        units: "kWh/m2.a",
        targets: {
            "Target Range (lower bound)": 20,
            "Target Range (upper bound)": 70
        },
        targetRange: [20, 70]
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
        units: "kWh/m2.a",
        targets: {
            // "Passivhaus": 120,
            "Carbon Coop 2050 target (inc. renewables)": 120,
            "UK Average": 360
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
        name: "CO2 Emission rate",
        value: Math.round(data.kgco2perm2),
        colors: colors,
        values: values,
        units: "kgCO2/m2.a",
        targets: {
            "Carbon Coop 2050 target": 20,
            "UK Average": 100
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

    $(".key-square--master").css("background", colors[0]);
    $(".key-square--scenario1").css("background", colors[1]);
    $(".key-square--scenario2").css("background", colors[2]);
    $(".key-square--scenario3").css("background", colors[3]);
    /* Figure 3: How does my home lose heat?
     // TODO: Show house graphic with heat loss for the four scenarios.
     */

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
				<text transform="matrix(1 0 0 1 53.3572 283.9302)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Ventilation</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.ventilationwk + ' W/K</tspan></text>\
				<text transform="matrix(1 0 0 1 150.0000 21)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Infiltration</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.infiltrationwk + ' W/K</tspan></text>\
				<text transform="matrix(1 0 0 1 48.0902 90.1215)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Windows</tspan><tspan x="11.2" y="12" fill="#F0533C" font-size="11">' + heatlossData.windowswk + ' W/K</tspan></text>\
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


    /* Figure 4: Your home’s heat balance
     // Heat transfer per year by element. The gains and losses here need to balance. 
     // data.annual_losses_kWh_m2 appears to be empty, so there are currently no negative stacks on this chart
     */

    var values = [];
    for (var i = 0; i < scenarios.length; i++) {
        if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].kwhdpp != "undefined") {
            values[i] = Math.round(project[scenarios[i]].kwhdpp.toFixed(1));
        } else {
            values[i] = 0;
        }
    }

    var dataFig4 = [];
    var max_value = 0; // used to set the height of the chart
    if (typeof project['master'] != "undefined" && typeof project["master"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Your Home Now',
            value: [
                {value: project["master"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                {value: project["master"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                {value: project["master"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                {value: -project["master"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                {value: -(project["master"].annual_losses_kWh_m2["ventilation"] + project["master"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation & Infiltration'},
            ]
        });
        if (max_value < (project["master"].annual_losses_kWh_m2["fabric"] + project["master"].annual_losses_kWh_m2["ventilation"] + project["master"].annual_losses_kWh_m2["infiltration"]))
            max_value = project["master"].annual_losses_kWh_m2["fabric"] + project["master"].annual_losses_kWh_m2["ventilation"] + project["master"].annual_losses_kWh_m2["infiltration"];
    }

    if (typeof project['scenario1'] != "undefined" && typeof project["scenario1"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Scenario 1',
            value: [
                {value: project["scenario1"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                {value: project["scenario1"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                {value: project["scenario1"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                {value: -project["scenario1"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                {value: -(project["scenario1"].annual_losses_kWh_m2["ventilation"] + project["scenario1"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation & Infiltration'},
            ]
        });
        if (max_value < (project["scenario1"].annual_losses_kWh_m2["fabric"] + project["scenario1"].annual_losses_kWh_m2["ventilation"] + project["scenario1"].annual_losses_kWh_m2["infiltration"]))
            max_value = project["scenario1"].annual_losses_kWh_m2["fabric"] + project["scenario1"].annual_losses_kWh_m2["ventilation"] + project["scenario1"].annual_losses_kWh_m2["infiltration"];
    }

    if (typeof project['scenario2'] != "undefined" && typeof project["scenario2"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Scenario 2',
            value: [
                {value: project["scenario2"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                {value: project["scenario2"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                {value: project["scenario2"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                {value: -project["scenario2"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                {value: -(project["scenario2"].annual_losses_kWh_m2["ventilation"] + project["scenario2"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation & Infiltration'},
            ]
        });
        if (max_value < (project["scenario2"].annual_losses_kWh_m2["fabric"] + project["scenario2"].annual_losses_kWh_m2["ventilation"] + project["scenario2"].annual_losses_kWh_m2["infiltration"]))
            max_value = project["scenario2"].annual_losses_kWh_m2["fabric"] + project["scenario2"].annual_losses_kWh_m2["ventilation"] + project["scenario2"].annual_losses_kWh_m2["infiltration"];
    }

    if (typeof project['scenario3'] != "undefined" && typeof project["scenario3"].annual_useful_gains_kWh_m2 != "undefined") {
        dataFig4.push({
            label: 'Scenario 3',
            value: [
                {value: project["scenario3"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                {value: project["scenario3"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                {value: project["scenario3"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                {value: -project["scenario3"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                {value: -(project["scenario3"].annual_losses_kWh_m2["ventilation"] + project["scenario3"].annual_losses_kWh_m2["infiltration"]), label: 'Ventilation & Infiltration'},
            ]
        });
        if (max_value < (project["scenario3"].annual_losses_kWh_m2["fabric"] + project["scenario3"].annual_losses_kWh_m2["ventilation"] + project["scenario3"].annual_losses_kWh_m2["infiltration"]))
            max_value = project["scenario3"].annual_losses_kWh_m2["fabric"] + project["scenario3"].annual_losses_kWh_m2["ventilation"] + project["scenario3"].annual_losses_kWh_m2["infiltration"];
    }

    var EnergyDemand = new BarChart({
        chartTitle: 'Heat Balance',
        yAxisLabel: 'kWh/m2.year',
        fontSize: 22,
        width: 1200,
        chartHeight: 600,
        division: 100,
        barWidth: 110,
        barGutter: 120,
        chartHigh: max_value + 50,
        chartLow: -max_value - 50,
        font: "Karla",
        defaultBarColor: 'rgb(231,37,57)',
        barColors: {
            'Internal': 'rgb(24,86,62)',
            'Solar': 'rgb(240,212,156)',
            'Space heating': 'rgb(236,102,79)',
            'Fabric': 'rgb(246,167,7)',
            'Ventilation & Infiltration': 'rgb(157, 213, 203)',
        },
        data: dataFig4,
    });
    $('#heat-balance').html('');
    EnergyDemand.draw('heat-balance');
    /* Figure 5: Space Heating Demand
     // 
     */

    var values = [];
    for (var i = 0; i < scenarios.length; i++) {
        if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].space_heating_demand_m2 != "undefined") {
            values[i] = Math.round(project[scenarios[i]].space_heating_demand_m2);
        } else {
            values[i] = 0;
        }
    }

    var SpaceHeatingDemand = new BarChart({
        chartTitle: 'Space Heating Demand',
        yAxisLabel: 'kWh/m2.year',
        fontSize: 22,
        font: "Karla",
        division: 'auto',
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
                target: 20,
                color: 'rgb(231,37,57)'
            },
            {
                target: 70,
                color: 'rgb(231,37,57)'
            },
            {
                label: 'UK Average 140 kWh/m2.a',
                target: 140,
                color: 'rgb(231,37,57)'
            },
        ],
        targetRange: [
            {
                label: '20 kWh/m2.a',
                target: 20,
                color: 'rgb(231,37,57)'
            },
            {
                label: '70 kWh/m2.a',
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
    /* Figure 6: Energy Demand
     //
     */

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
        }

        var energyitems = project['master'].currentenergy.energyitems;
        data.bills = [
            {
                value: energyitems["gas-kwh"].annual_kwh + energyitems.bottledgas.annual_kwh
                        + energyitems.gas.annual_kwh + energyitems.lpg.annual_kwh,
                label: 'Gas',
            },
            {
                value: energyitems.electric.annual_kwh + energyitems['electric-heatpump'].annual_kwh +
                        energyitems['electric-heatpump'].annual_kwh + energyitems['electric-waterheating'].annual_kwh
                        + energyitems['electric-car'].annual_kwh + energyitems['electric-e7-day'].annual_kwh
                        + energyitems['electric-e7-night'].annual_kwh,
                label: 'Electric',
            },
            {
                value: energyitems['wood-logs'].annual_kwh + energyitems['wood-pellets'].annual_kwh
                        + energyitems['oil'].annual_kwh,
                label: "Other"
            }
        ];
        return data;
    }

    var energyDemandData = getEnergyDemandData();
    var EnergyDemand = new BarChart({
        chartTitle: 'Energy Demand',
        yAxisLabel: 'kWh/year',
        fontSize: 22,
        font: "Karla",
        width: 1200,
        chartHeight: 600,
        division: 'auto',
        barWidth: 110,
        barGutter: 80,
        defaultBarColor: 'rgb(231,37,57)',
        defaultVarianceColor: 'rgb(2,37,57)',
        barColors: {
            'Gas': 'rgb(236,102,79)',
            'Electric': 'rgb(240,212,156)',
            'Other': 'rgb(24,86,62)',
        },
        data: [
            {label: 'Your Home Now', value: energyDemandData.master},
            {label: 'Bills data', value: energyDemandData.bills},
            {label: 'Scenario 1', value: energyDemandData.scenario1},
            {label: 'Scenario 2', value: energyDemandData.scenario2},
            {label: 'Scenario 3', value: energyDemandData.scenario3},
        ]
    });
    $('#energy-demand').html('');
    EnergyDemand.draw('energy-demand');
    /* Figure 7:
     //
     */
    function getPrimaryEnergyUseData() {
        var primaryEnergyUseData = {};
        primaryEnergyUseData.max = 0;
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
                    if (project[scenarios[i]].use_generation == 1) {
                        primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].fuel_totals['generation'].primaryenergy / data.TFA, label: 'Offset'});
                        primaryEnergyUseData[scenarios[i]][0].value += project[scenarios[i]].fuel_totals['generation'].primaryenergy / data.TFA; // We substract the offset (generation) from the first stack (water heating)
                    }
                    else
                        primaryEnergyUseData[scenarios[i]].push({value: 0, label: 'Offset'});
                }
            }
            if (typeof project[scenarios[i]] !== "undefined" && project[scenarios[i]].primary_energy_use_m2 > primaryEnergyUseData.max)
                primaryEnergyUseData.max = project[scenarios[i]].primary_energy_use_m2;
            if (typeof project[scenarios[i]] !== "undefined" && project[scenarios[i]].use_generation == 1 && project[scenarios[i]].fuel_totals['generation'].primaryenergy < primaryEnergyUseData.min)  // fuel_totals['generation'] is negative
                primaryEnergyUseData.min = project[scenarios[i]].fuel_totals['generation'].primaryenergy / project[scenarios[i]].TFA;
        }

        primaryEnergyUseData.bills = [
            {
                value: data.currentenergy.primaryenergy_annual_kwhm2,
                label: "Non categorized"
            }
        ]

        return primaryEnergyUseData;
    }

    var primaryEnergyUseData = getPrimaryEnergyUseData();
    var primaryEneryUse = new BarChart({
        chartTitle: 'Primary Energy Use',
        yAxisLabel: 'kWh/m2.year',
        fontSize: 22,
        font: "Karla",
        width: 1200,
        chartHeight: 600,
        division: 'auto',
        barWidth: 110,
        barGutter: 80,
        chartHigh: primaryEnergyUseData.max + 50,
        chartLow: primaryEnergyUseData.min - 50,
        defaultBarColor: 'rgb(157,213,203)',
        barColors: {
            'Water Heating': 'rgb(157,213,203)',
            'Space Heating': 'rgb(231,37,57)',
            'Cooking': 'rgb(24,86,62)',
            'Appliances': 'rgb(240,212,156)',
            'Lighting': 'rgb(236,102,79)',
            'Fans and Pumps': 'rgb(246, 167, 7)',
            'Non categorized': 'rgb(131, 51, 47)'
        },
        data: [
            {label: 'Your Home Now', value: primaryEnergyUseData.master},
            {label: 'Bills data', value: primaryEnergyUseData.bills},
            {label: 'Scenario 1', value: primaryEnergyUseData.scenario1},
            {label: 'Scenario 2', value: primaryEnergyUseData.scenario2},
            {label: 'Scenario 3', value: primaryEnergyUseData.scenario3}
        ],
        targets: [
            {
                label: 'UK Average 360 kWh/m2.a',
                target: 360,
                color: 'rgb(231,37,57)'
            },
            {
                label: 'Carbon Coop Target 120 kWh/m2.a',
                target: 120,
                color: 'rgb(231,37,57)'
            }
        ],
    });
    $('#primary-energy-use').html('');
    primaryEneryUse.draw('primary-energy-use');
    /* Figure 8: Carbon dioxide emissions in kgCO2/m2.a
     //
     */
    var carbonDioxideEmissionsData = [];
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

    var CarbonDioxideEmissions = new BarChart({
        chartTitle: 'Carbon Dioxide Emissions',
        yAxisLabel: 'kgCO2/m2.year',
        fontSize: 22,
        font: "Karla",
        division: 'auto',
        width: 1200,
        chartHeight: 600,
        barWidth: 110,
        barGutter: 80,
        defaultBarColor: 'rgb(157,213,203)',
        data: carbonDioxideEmissionsData,
        targets: [
            {
                label: 'Carbon Coop Target',
                target: 20,
                color: 'rgb(231,37,57)'
            },
            {
                label: 'UK Average',
                target: 70,
                color: 'rgb(231,37,57)'
            },
        ],
    });
    $('#carbon-dioxide-emissions').html('');
    CarbonDioxideEmissions.draw('carbon-dioxide-emissions');
    /* Figure 9: Bar chart showing carbon dioxide emissions rate (kgCO2/person.a)
     //
     */
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

    var CarbonDioxideEmissionsPerPerson = new BarChart({
        chartTitle: 'Carbon Dioxide Emissions Per Person',
        yAxisLabel: 'kgCO2/person/year',
        fontSize: 22,
        font: "Karla",
        division: 1000,
        width: 1200,
        chartHeight: 600,
        barWidth: 110,
        barGutter: 80,
        defaultBarColor: 'rgb(157,213,203)',
        defaultVarianceColor: 'rgb(231,37,57)',
        // barColors: {
        // 	'Space heating': 'rgb(157,213,203)',
        // 	'Pumps, fans, etc.': 'rgb(24,86,62)',
        // 	'Cooking': 'rgb(40,153,139)',
        // },
        data: carbonDioxideEmissionsPerPersonData
    });
    $('#carbon-dioxide-emissions-per-person').html('');
    CarbonDioxideEmissionsPerPerson.draw('carbon-dioxide-emissions-per-person');
    /* Figure 10: Estimated Energy cost comparison 
     // Bar chart showing annual fuel cost. Waiting on Trystan for data
     */
    var estimatedEnergyCostsData = [];
    var max = 0;
    if (typeof project["master"] != "undefined" && typeof project["master"].net_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Your home now", value: project["master"].net_cost, variance: 30});
        if (max < project["master"].net_cost + 0.3 * project["master"].net_cost)
            max = project["master"].net_cost + 0.3 * project["master"].net_cost;
    }

    estimatedEnergyCostsData.push({label: "Bills data", value: project["master"].currentenergy.total_cost, variance: 30});
    if (max < project["master"].currentenergy.total_cost + 0.3 * project["master"].currentenergy.total_cost)
        max = project["master"].currentenergy.total_cost + 0.3 * project["master"].currentenergy.total_cost;
    if (typeof project["scenario1"] != "undefined" && typeof project["scenario1"].net_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Scenario 1", value: project["scenario1"].net_cost, variance: 30});
        if (max < project["scenario1"].net_cost + 0.3 * project["scenario1"].net_cost)
            max = project["scenario1"].net_cost + 0.3 * project["scenario1"].net_cost;
    }
    if (typeof project["scenario2"] != "undefined" && typeof project["scenario2"].net_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Scenario 2", value: project["scenario2"].net_cost, variance: 30});
        if (max < project["scenario2"].net_cost + 0.3 * project["scenario2"].net_cost)
            max = project["scenario2"].net_cost + 0.3 * project["scenario2"].net_cost;
    }
    if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"].net_cost !== "undefined") {
        estimatedEnergyCostsData.push({label: "Scenario 3", value: project["scenario3"].net_cost, variance: 30});
        if (max < project["scenario3"].net_cost + 0.3 * project["scenario3"].net_cost)
            max = project["scenario3"].net_cost + 0.3 * project["scenario3"].net_cost;
    }

    var EstimatedEnergyCosts = new BarChart({
        chartTitle: 'Estimate Energy Costs (Net) Comparison',
        yAxisLabel: '£/year',
        fontSize: 22,
        font: "Karla",
        division: 'auto',
        chartHigh: max + 50,
        width: 1200,
        chartHeight: 600,
        barGutter: 80,
        defaultBarColor: 'rgb(157,213,203)',
        data: estimatedEnergyCostsData
    });
    $('#estimated-energy-cost-comparison').html('');
    EstimatedEnergyCosts.draw('estimated-energy-cost-comparison');
    /* Figure 11: Your home compared with the average home.
     // Main SAP assumptions  vs actual condition comparison - table stating 'higher' or 'lower'.
     // Would be useful to have total hours of heating (currently only given times heating is on - see question 3a)
     // Where is data for number of rooms not heated? Appliance Q?
     */

    $(".js-occupancy-comparison").html(compare(2.9, data.occupancy));
    //var normalDayHeatingHours = getTimeDifference(data.household["3a_heatinghours_normal_on1"], data.household["3a_heatinghours_normal_off1"]);
    //var altDayHeatingHours = getTimeDifference(data.household["3a_heatinghours_normal_on2"], data.household["3a_heatinghours_normal_off2"]);
    var hours_off = 0;
    for (var period in data.temperature.weekday)
        hours_off += data.temperature.weekday[period];
    var normalDayHeatingHours = 24 - hours_off;
    hours_off = 0;
    for (var period in data.temperature.weekend)
        hours_off += data.temperature.weekend[period];
    var altDayHeatingHours = 24 - hours_off;
    var totalHeatingHours = normalDayHeatingHours; // Right now we only take into account weekdays hours, there is an issue open about if we need to take into account weekends as well

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

    $(".js-average-heating-hours").html(totalHeatingHours);
    $(".js-average-heating-hours-comparison").html(compare(9, totalHeatingHours));
    $(".js-thermostat-comparison").html(compare(21, parseFloat(data.household["3a_roomthermostat"])));
    $('#js-habitable-not-heated-rooms').html(project['master'].household["3a_habitable_rooms_not_heated"])
    $(".js-unheated-rooms-comparison").html(compare(0, project['master'].household["3a_habitable_rooms_not_heated"]));
    $(".js-appliance-energy-use").html(Math.round(project.master.energy_requirements.appliances.quantity));
    $(".js-appliance-energy-use-comparison").html(compare(3880, Math.round(project.master.energy_requirements.appliances.quantity)));
    /* Figure 12: SAP chart
     //
     */

    function calculateSapRatingFromScore(score) {

        if (!score) {
            return false;
        }

        var sapRatings = {
            "90": "A",
            "80": "B",
            "70": "C",
            "60": "D",
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
    /* Figure 13: Comfort Tables.
     //	
     */
    function createComforTable(options, tableID, chosenValue) {
        $("#" + tableID + " .comfort-table-td").remove();
        for (var i = options.length - 1; i >= 0; i--) {

            if (options[i].title == chosenValue) {
                var background = options[i].color;
            } else {
                var background = 'transparent';
            }
            $("#" + tableID + " .extreme-left").after($("<td class='comfort-table-td comfort-table-option " + i + "'  style='background:" + background + "'></td>"));
        }

    }

    var red = "rgb(228, 27, 58)";
    var green = "rgb(149, 211, 95)";
    // Temperature in Winter
    var options = [
        {
            title: "Too cold",
            color: red,
        }, {
            title: "Just right",
            color: green,
        }, {
            title: "Too hot",
            color: red
        }
    ];
    createComforTable(options, "comfort-table-winter-temp", project.master.household["6a_temperature_winter"]);
    // Air quality in winter

    var options = [
        {
            title: "Too dry",
            color: red,
        }, {
            title: "Just right",
            color: green,
        }, {
            title: "Too stuffy",
            color: red
        }
    ];
    createComforTable(options, "comfort-table-winter-air", project.master.household["6a_airquality_winter"]);
    // Temperature in Summer

    var options = [
        {
            title: "Too cold",
            color: red,
        }, {
            title: "Just right",
            color: green,
        }, {
            title: "Too hot",
            color: red
        }
    ];
    createComforTable(options, "comfort-table-summer-temp", project.master.household["6a_temperature_summer"]);
    // Air quality in Summer

    var options = [
        {
            title: "Too dry",
            color: red,
        }, {
            title: "Just right",
            color: green,
        }, {
            title: "Too stuffy",
            color: red
        }
    ];
    createComforTable(options, "comfort-table-summer-air", project.master.household["6a_airquality_summer"]);
    var options = [
        {
            title: "Too little",
            color: red,
        }, {
            title: "Just right",
            color: green,
        }, {
            title: "Too much",
            color: red
        }
    ];
    createComforTable(options, "comfort-table-daylight-amount", project.master.household["6b_daylightamount"]);
    var options = [
        {
            title: "Too little",
            color: red,
        }, {
            title: "Just right",
            color: green,
        }, {
            title: "Too much",
            color: red
        }
    ];
    createComforTable(options, "comfort-table-artificial-light-amount", project.master.household["6b_artificallightamount"]);
    /* Figure 14: Humidity Data
     // 
     */

    var averageHumidity = 0.5 * (data.household.reading_humidity1 + data.household.reading_humidity2);
    $(".js-average-humidity").html(averageHumidity);
    /* Figure 15: Temperature Data
     // 
     */

    var averageTemperature = 0.5 * (data.household.reading_temp1 + data.household.reading_temp2);
    $(".js-average-temp").html(averageTemperature);
    /* Figure 16: You also told us...
     // 
     */

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

    var laundryHabits = laundryHabits.slice(0, -2);
    $(".js-laundry-habits").html(laundryHabits);
    /* Figure 17: Scenario 1 Measures
     //
     */

    var measuresTableColumns = [
        "name",
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
    function populateMeasuresTable(scenario, tableSelector, summaryTableSelector) {
        if (project[scenario].fabric.measures != undefined)
            addListOfMeasuresByIdToSummaryTable(project[scenario].fabric.measures, tableSelector, summaryTableSelector);
        if (project[scenario].measures != undefined) {
            if (project[scenario].measures.ventilation != undefined) {
                if (project[scenario].measures.ventilation.extract_ventilation_points != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.extract_ventilation_points, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.intentional_vents_and_flues != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues_measures, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.draught_proofing_measures != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.ventilation.draught_proofing_measures, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.ventilation_systems_measures != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.ventilation.ventilation_systems_measures, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.clothes_drying_facilities != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.clothes_drying_facilities, tableSelector, summaryTableSelector);
            }
            if (project[scenario].measures.water_heating != undefined) {
                if (project[scenario].measures.water_heating.water_usage != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.water_heating.water_usage, tableSelector, summaryTableSelector);
                if (project[scenario].measures.water_heating.storage_type != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.water_heating.storage_type, tableSelector, summaryTableSelector);
                if (project[scenario].measures.water_heating.pipework_insulation != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.water_heating.pipework_insulation, tableSelector, summaryTableSelector);
                if (project[scenario].measures.water_heating.hot_water_control_type != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.water_heating.hot_water_control_type, tableSelector, summaryTableSelector);
            }
            if (project[scenario].measures.space_heating_control_type != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.space_heating_control_type, tableSelector, summaryTableSelector);
            if (project[scenario].measures.heating_systems != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.heating_systems, tableSelector, summaryTableSelector);
            // Change this one project[scenario].measures.space_heating_control_type
            if (project[scenario].measures.space_heating != undefined) {
                if (project[scenario].measures.space_heating.heating_control != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.space_heating.heating_control, tableSelector, summaryTableSelector);
            }
        }
    }

    function addListOfMeasuresByIdToSummaryTable(listOfMeasures, tableSelector, summaryTableSelector) {

        for (var measureID in listOfMeasures) {
            var measure = listOfMeasures[measureID];
            addMeasureToSummaryTable(measure, tableSelector, summaryTableSelector);
        }
    }

    function addMeasureToSummaryTable(measure, tableSelector, summaryTableSelector) {
        var html = "<tr>";
        var row = $('<tr></tr>');
        for (var i = 0; i < measuresTableColumns.length; i++) {
            var cell = $('<td></td>');
            cell.html(measure.measure[measuresTableColumns[i]]);
            row.append(cell);
        }
        $(tableSelector).append(row);
        addRowToSummaryTable(summaryTableSelector, measure.measure.name, measure.measure.description,
                measure.measure.benefits, measure.measure.cost_total, measure.measure.who_by, measure.measure.disruption);
    }

    function initialiseMeasuresTable(tableSelector) {
        var html = '<tr>\
            <th class="tg-yw4l" rowspan="2">Measure</th>\
            <th class="tg-yw4l" rowspan="2">Description</th>\
            <th class="tg-yw4l" rowspan="2">Performance Target</th>\
            <th class="tg-yw4l" rowspan="2">Benefits (in order)</th>\
            <th class="tg-yw4l" colspan="4">How Much?</th>\
            <th class="tg-yw4l" rowspan="2">Who by?</th>\
            <th class="tg-yw4l" rowspan="2">Key risks</th>\
            <th class="tg-yw4l" rowspan="2">Dirt and disruption?</th>\
            <th class="tg-yw4l" rowspan="2">Associated work?</th>\
            <th class="tg-yw4l" rowspan="2">Maintenace</th>\
            <th class="tg-yw4l" rowspan="2">Special and other considerations</th>\
						  </tr>\
						  <tr>\
						    <td class="th">Rate</td>\
						    <td class="th">Unit</td>\
						    <td class="th">Quantity</td>\
						    <td class="th">Total</td>\
						  </tr>';
        return $(tableSelector).html(html);
    }

    function createMeasuresTable(scenario, tableSelector, summaryTableSelector) {
        initialiseMeasuresTable(tableSelector);
        initiliaseMeasuresSummaryTable(summaryTableSelector);
        populateMeasuresTable(scenario, tableSelector, summaryTableSelector);
    }

    function initiliaseMeasuresSummaryTable(summaryTableSelector) {
        var html = "<thead>\
				<tr>\
					<th>Name</th>\
            <th>Description</th>\
            <th>Benefits (in order)</th>\
					<th>Cost</th>\
					<th>Completed By</th>\
            <th>Disruption</th>\
				</tr>\
			</thead>\
	 	<tbody>\
			</tbody>";
        return $(summaryTableSelector).html(html);
    }


    function addRowToSummaryTable(tableSelector, name, description, benefits, cost, who_by, disruption) {
        var html = '<tr><td class="highlighted-col">' + name + '</td>';
        html += '<td><div class="text-width-limiter">' + description + '</div>';
        html += '</td>';
        html += '<td>' + benefits + '</td>';
        html += '<td class="cost">£' + cost + '</td>';
        html += '<td>' + who_by + '</td>';
        html += '<td>' + disruption + '</td>';
        html += '</tr>';
        $(tableSelector + " tbody").append($(html));
    }

    if (typeof project["scenario1"] != "undefined") {
        $("#output-scenario1-name").html(project["scenario1"]["scenario_name"]);
        createMeasuresTable("scenario1", "#scenario1-measures", ".js-measures1-summary");
    }
    else
        $("#output-scenario1-name").html('This scenario has not been created');
    if (typeof project["scenario2"] != "undefined") {
        $("#output-scenario2-name").html(project["scenario2"]["scenario_name"]);
        createMeasuresTable("scenario2", "#scenario2-measures", ".js-measures2-summary");
    }
    else
        $("#output-scenario2-name").html('This scenario has not been created');
    if (typeof project["scenario3"] != "undefined") {
        $("#output-scenario3-name").html(project["scenario3"]["scenario_name"]);
        createMeasuresTable("scenario3", "#scenario3-measures", ".js-measures3-summary");
    }
    else
        $("#output-scenario3-name").html('This scenario has not been created');
    /* Figure 18: Scenario 2 Measures
     //
     */

    /* Figure 19: Scenario 3 Measures
     //
     */


    /* Figure 23: Appendix B - data from household questionnaire
     //
     */
    $(".js-heating-hours-normal").html(normalDayHeatingHours);
    $(".js-heating-hours-alt").html(altDayHeatingHours);
    // Scenario comparison
    if (typeof project["scenario1"] != "undefined")
        compareCarbonCoop("scenario1", "#js-scenario1-comparison");
    if (typeof project["scenario2"] != "undefined")
        compareCarbonCoop("scenario2", "#js-scenario2-comparison");
    if (typeof project["scenario3"] != "undefined")
        compareCarbonCoop("scenario3", "#js-scenario2-comparison");
    // Figure 5
    // var options = {
    //       name: "Space heating demand Master",
    //       value: Math.round(project["master"].space_heating_demand_m2),
    //       units: "kWh/m2",     //       targets: {
    //           //"Passivhaus": 15,
    //           "Passivhaus retrofit": 25,
    //           "UK Average": 145
    //       }
    //   };
    //   targetbarCarboncoop("space-heating-demand-1", options);

    //   	 var options = {
    //       name: "Space heating demand Master",
    //       value: Math.round(project["scenario1"].space_heating_demand_m2),
    //       units: "kWh/m2",
    //       targets: {
    //           //"Passivhaus": 15,
    //           "Passivhaus retrofit": 25,
    //           "UK Average": 145
    //       }
    //   };
    //   targetbarCarboncoop("space-heating-demand-2", options);

    //   	 var options = {
    //       name: "Space heating demand Master",
    //       value: Math.round(project["scenario2"].space_heating_demand_m2),
    //       units: "kWh/m2",
    //       targets: {
    //           //"Passivhaus": 15,
    //           "Passivhaus retrofit": 25,
    //           "UK Average": 145
    //       }
    //   };
    //   targetbarCarboncoop("space-heating-demand-3", options);

    //   	 var options = {
    //       name: "Space heating demand Master",
    //       value: Math.round(project["scenario3"].space_heating_demand_m2),
    //       units: "kWh/m2",
    //       targets: {
    //           //"Passivhaus": 15,
    //           "Passivhaus retrofit": 25,
    //           "UK Average": 145
    //       }
    //   };
    //   targetbarCarboncoop("space-heating-demand-4", options);
}

function compareCarbonCoop(scenario, outputElement) {

    var out = "";
    var changes = [
        ["Region", 'region'],
        ["Altitude", 'altitude'],
        ['Total floor area', 'TFA'],
        ['Total dwelling volume', 'volume'],
        ["Occupancy", 'occupancy'],
        ["Number of chimney's", 'ventilation.number_of_chimneys'],
        ["Number of open flue's", 'ventilation.number_of_openflues'],
        ["Number of intermittent fans", 'ventilation.number_of_intermittentfans'],
        ["Number of passive vents", 'ventilation.number_of_passivevents'],
        ["Number of flueless gas fires", 'ventilation.number_of_fluelessgasfires'],
        ["Dwelling construction", 'ventilation.dwelling_construction'],
        ["Suspended wooden floor", 'ventilation.suspended_wooden_floor'],
        ["Draught lobby", 'ventilation.draught_lobby'],
        ["Percentage draught proofed", 'ventilation.percentage_draught_proofed'],
        ["Air permeability test", 'ventilation.air_permeability_test'],
        ["Air permeability value", 'ventilation.air_permeability_value'],
        ["Number of sides sheltered", 'ventilation.number_of_sides_sheltered'],
        ["Ventilation type", 'ventilation.ventilation_type'],
        ["System air change rate", 'ventilation.system_air_change_rate'],
        ["Balanced heat recovery efficiency", 'ventilation.balanced_heat_recovery_efficiency'],
        ["<b>Lighting, Appliances & Cooking:</b> enabled", 'use_LAC'],
        ["<b>Lighting, Appliances & Cooking:</b> Number of low energy light fittings", 'LAC.LLE'],
        ["<b>Lighting, Appliances & Cooking:</b> Number of light fittings", 'LAC.L'],
        ["<b>Lighting, Appliances & Cooking:</b> reduced internal heat gains", 'LAC.energy_efficient_cooking'],
        ["<b>Water Heating:</b> Low water use design", "water_heating.low_water_use_design"],
        ["<b>Water Heating:</b> Instantaneous hotwater", "water_heating.instantaneous_hotwater"],
        ["<b>Water Heating:</b> Solar water heating", "water_heating.solar_water_heating"],
        ["<b>Water Heating:</b> Pipework insulated fraction", "water_heating.pipework_insulated_fraction"],
        ["<b>Water Heating:</b> Declared loss factor known", "water_heating.declared_loss_factor_known"],
        ["<b>Water Heating:</b> Manufacturer loss factor", "water_heating.manufacturer_loss_factor"],
        ["<b>Water Heating:</b> Storage Volume", "water_heating.storage_volume"],
        ["<b>Water Heating:</b> temperature_factor_a", "water_heating.temperature_factor_a"],
        ["<b>Water Heating:</b> loss_factor_b", "water_heating.loss_factor_b"],
        ["<b>Water Heating:</b> volume_factor_b", "water_heating.volume_factor_b"],
        ["<b>Water Heating:</b> temperature_factor_b", "water_heating.temperature_factor_b"],
        ["<b>Water Heating:</b> community_heating", "water_heating.community_heating"],
        ["<b>Water Heating:</b> hot_water_store_in_dwelling", "water_heating.hot_water_store_in_dwelling"],
        ["<b>Water Heating:</b> Contains dedicated solar storage or WWHRS", "water_heating.contains_dedicated_solar_storage_or_WWHRS"],
        ["<b>Water Heating:</b> hot_water_control_type", "water_heating.hot_water_control_type"],
        ["<b>Solar Hot Water:</b> Aperture area of solar collector", "SHW.A"],
        ["<b>Solar Hot Water:</b> Zero-loss collector efficiency, η0", "SHW.n0"],
        ["<b>Solar Hot Water:</b> Collector linear heat loss coefficient, a1", "SHW.a1"],
        ["<b>Solar Hot Water:</b> Collector 2nd order heat loss coefficient, a2", "SHW.a2"],
        ["<b>Solar Hot Water:</b> Collector Orientation", "SHW.orientation"],
        ["<b>Solar Hot Water:</b> Collector Inclination", "SHW.inclination"],
        ["<b>Solar Hot Water:</b> Overshading factor", "SHW.overshading"],
        ["<b>Solar Hot Water:</b> Dedicated solar storage volume, Vs, (litres)", "SHW.Vs"],
        ["<b>Solar Hot Water:</b> Total volume of combined cylinder (litres)", "SHW.combined_cylinder_volume"],
        ["<b>Heating system:</b> Responsiveness", "temperature.responsiveness"],
        ["<b>Heating system:</b> Control type", "temperature.control_type"],
        ["Target living area temperature", "temperature.target"],
        ["Living area", "temperature.living_area"],
        ["<b>Custom model:</b> Use utilisation factor for gains", "space_heating.use_utilfactor_forgains"]
    ];
    // Basic dwelling data
    var properties_to_check = [
        ["Region", 'region'],
        ["Altitude", 'altitude'],
        ['Total floor area', 'TFA'],
        ['Total dwelling volume', 'volume'],
        ["Occupancy", 'occupancy']
    ];
    var BDD = comparePropertiesInArray(scenario, properties_to_check);
    if (BDD.changed === true)
        out += '<h3>Basic dwelling data</h3><table class="table table-striped">' + BDD.html + '</table></br>';
    // Ventilation
    var Vent = compareVentilation(scenario);
    if (Vent.changed === true)
        out += '<h3>Ventilation</h3><table class="table table-striped">' + Vent.html + '</table></br>';
    // Infiltration
    var Inf = compareInfiltration(scenario);
    if (Inf.changed === true)
        out += '<h3>Infiltration</h3><table class="table table-striped">' + Inf.html + '</table></br>';
    // Clothes drying facilities
    var CDF = compareClothesDryingFacilities(scenario);
    if (CDF.changed === true)
        out += '<h3>Clothes drying facilities</h3><table class="table table-striped">' + CDF.html + '</table></br>';
    //Fabric
    var Fabric = compareFabric(scenario);
    if (Fabric.changed === true)
        out += '<h3>Fabric</h3><p>Changes to Floor\'s, Wall\'s, Windows and Roof elements</p>\n\
            <table class="table table-striped"><tr><th>Before</th><th>W/K</th><th>After</th><th>W/K</th><th>Change</th></tr>'
                + Fabric.html + '</table></br>';

    // Heating
    var Heating = compareHeating(scenario);
    if (Heating.changed === true)
        out += '<h3>Heating</h3><table class="table table-striped">' + Heating.html + '</table></br>';

    // Energy requirements
    var ER = compareEnergyRequirements(scenario);
    if (ER.changed === true)
        out += '<h3>Energy requirements</h3><table class="table table-striped">' + ER.html + '</table></br>';

    // Fuel requirements
    var FR = compareFuelRequirements(scenario);
    if (FR.changed === true)
        out += '<h3>Fuel requirements</h3><table class="table table-striped">' + FR.html + '</table></br>';

    // Totals
    out += '<h3>Totals</h3><table class="table table-striped"><tr><td></td><td>Before</td><td>After</td></tr>';
    out += '<tr><td>Annual cost</td><td><i>£' + project.master.total_cost.toFixed(0) + '</i></td><td><i>£' + project[scenario].total_cost.toFixed(0) + '</i></td></tr>';
    out += '<tr><td>Total income</td><td><i>£' + project.master.total_income.toFixed(0) + '</i></td><td><i>£' + project[scenario].total_income.toFixed(0) + '</i></td></tr>';
    out += '<tr><td>SAP rating</td><td><i>' + project.master.SAP.rating.toFixed(0) + '</i></td><td><i>' + project[scenario].SAP.rating.toFixed(0) + '</i></td></tr>';
    out += '</table></br>';

    $(outputElement).html(out);
}

function comparePropertiesInArray(scenario, changes) {
    var out = "<tbody>";
    var changed = false;
    for (z in changes)
    {
        var keystr = changes[z][1];
        var description = changes[z][0];
        var keys = keystr.split(".");
        var subA = project.master;
        var subB = project[scenario];
        for (z in keys)
        {
            if (subA != undefined) {
                subA = subA[keys[z]];
            }
            if (subB != undefined) {
                subB = subB[keys[z]];
            }
        }
        var valA = subA;
        var valB = subB;
        if (valA != valB) {
            if (typeof valA == 'number')
                valA = valA.toFixed(2);
            if (typeof valB == 'number')
                valB = valB.toFixed(2);
            out += "<tr><td><b>" + description + "</b> changed from <i>" + valA + "</i> to <i>" + valB + "</i></td></tr>";
            changed = true;
        }
    }
    out += "</tbody>";
    return {html: out, changed: changed};
}

function compareVentilation(scenario) {
    var out = "";
    var changed = false;
    var properties_to_check = [
        ['Ventilation system type', 'ventilation.ventilation_type']
    ];
    var VSystem = comparePropertiesInArray(scenario, properties_to_check);
    if (VSystem.changed === true) {
        out += VSystem.html;
        changed = true;
        out += "<tbody>";
        // Add specific fields for current Ventilation system
        if (project[scenario].ventilation.ventilation_type == 'IE' || project[scenario].ventilation.ventilation_type == 'PS') {
            for (z in project[scenario].ventilation.EVP)
                out += '<tr><td><i>' + project[scenario].ventilation.EVP[z].name + '</i> added to <i>'
                        + project[scenario].ventilation.EVP[z].location + '</i> - Ventilation rate: <i>'
                        + project[scenario].ventilation.EVP[z].ventilation_rate + ' m<sup>3</sup>/h</i></td></tr>';
        }
        else if (project[scenario].ventilation.ventilation_type == 'DEV' || project[scenario].ventilation.ventilation_type == 'MEV' || project[scenario].ventilation.ventilation_type == 'MV')
            out += '<tr><td>Air change rate: <i>' + project[scenario].ventilation.system_air_change_rate
                    + ' ACH</i> - Specific fan power:  <i>' + project[scenario].ventilation.system_specific_fan_power
                    + ' W/(litre.sec)</i> </td></tr>';
        else if (project[scenario].ventilation.ventilation_type == 'MVHR')
            out += '<tr><td>Air change rate: <i>' + project[scenario].ventilation.system_air_change_rate
                    + ' ACH</i> - Specific fan power:  <i>' + project[scenario].ventilation.system_specific_fan_power
                    + ' W/(litre.sec)</i> - Heat recovery efficiency: <i>' +
                    project[scenario].ventilation.balanced_heat_recovery_efficiency + ' %</i></td></tr>';
        out += "</tbody>";
        //out += '<tr><td><i>' + project[scenario].ventilation. + '</i></td></tr>';
    }
    else {  // It can be the case the system has not changed but maybe we have applied some mesaures to it
        out += '<tbody>';
        out += '<tr><td>The ventilation system has not changed - Type: <i>' + project[scenario].ventilation.ventilation_type + '</i></td></tr>';
        if ((project[scenario].ventilation.ventilation_type == 'IE'
                || project[scenario].ventilation.ventilation_type == 'PS')
                && project[scenario].measures.ventilation != undefined
                && project[scenario].measures.ventilation.extract_ventilation_points != undefined) {
            changed = true;
            for (z in project[scenario].measures.ventilation.extract_ventilation_points) {
                var EVP = project[scenario].measures.ventilation.extract_ventilation_points[z];
                if (EVP.original == 'empty')
                    out += '<tr><td>A new <i>' + EVP.measure.name + ' (' + EVP.measure.ventilation_rate + ' m<sup>3</sup>/h)</i> has been added to <i>'
                            + EVP.measure.location + '</i> </td></tr>';
                else {
                    out += '<tr><td>The <i>' + EVP.original.name + ' (' + EVP.original.ventilation_rate
                            + ' m<sup>3</sup>/h)</i> in <i>' + EVP.original.location
                            + '</i> has been replaced with <i>' + EVP.measure.name + ' (' + EVP.measure.ventilation_rate
                            + ' m<sup>3</sup>/h)</i></td></tr>';
                }
            }
        }
        else { // DEV, MV, MEV, MVHR
            properties_to_check = [
                ['Air change rate', 'ventilation.system_air_change_rate'],
                ['Specific Fan Power', 'ventilation.system_specific_fan_power'],
                ['Heat recovery efficiency', 'ventilation.balanced_heat_recovery_efficiency']
            ];
            var possible_changes = comparePropertiesInArray(scenario, properties_to_check);
            if (possible_changes.changed === true) {
                changed = true;
                out += possible_changes.html;
            }
        }

        // Totals
        properties_to_check = [
            ['Ventilation looses (WK)', 'ventilation.average_WK']
        ];
        var possible_changes = comparePropertiesInArray(scenario, properties_to_check);
        if (possible_changes.changed === true) {
            changed = true;
            out += possible_changes.html;
        }

        out += '</tbody>';
    }

    return {html: out, changed: changed};
}

function compareInfiltration(scenario) {
    var out = "";
    var changed = false;
    if (project.master.ventilation.air_permeability_test === false && project[scenario].ventilation.air_permeability_test === false) {
        var properties_to_check = [
            ['Number of sides sheltered', 'ventilation.number_of_sides_sheltered'],
            ['Walls', 'ventilation.dwelling_construction'],
            ['Floors', 'ventilation.suspended_wooden_floor'],
            ['Percentage of windows and doors draught proofed', 'ventilation.percentage_draught_proofed'],
            ['Draught Lobby', 'ventilation.draught_lobby']
        ];
        var changes = comparePropertiesInArray(scenario, properties_to_check);
        if (changes.changed === true) {
            changed = true;
            out += changes.html;
        }
    }
    else if (project.master.ventilation.air_permeability_test === false && project[scenario].ventilation.air_permeability_test === true) {
        changed = true;
        out += '<tr><td>The structural infiltration due to dwelling construction was changed applying <i>'
                + project[scenario].measures.ventilation.draught_proofing_measures.measure.name
                + '</i> with q50 = <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.q50
                + ' cubic metres per hour per square metre of envelope</i> </td></tr>';
        out += '<tr><td>The structural infiltration due to dwelling construction was <i>'
                + project[scenario].measures.ventilation.draught_proofing_measures.original_structural_infiltration
                + ' ACH</i>, after applying the measures: <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.structural_infiltration
                + ' ACH</i></td></tr>';
        +'</i></td></tr>';
    }
    else if (project[scenario].measures.ventilation.draught_proofing_measures != undefined) {
        changed = true;
        out += '<tr><td>The original Infiltration due to dweling construction was calculated \n\
                based on air tightness test with q50 = <i>' + project.master.ventilation.air_permeability_value
                + ' cubic metres per hour per square metre of envelope area</i>. \n\
                After applying <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.name
                + '</i>,  q50 = <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.q50
                + '</i></td></tr>';
        out += '<tr><td>The structural infiltration due to dwelling construction was <i>'
                + project[scenario].measures.ventilation.draught_proofing_measures.original_structural_infiltration
                + ' ACH</i>, after applying the measures: <i>' + project[scenario].measures.ventilation.draught_proofing_measures.measure.structural_infiltration
                + ' ACH</i></td></tr>';
        +'</i></td></tr>';
    }
    if (project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.intentional_vents_and_flues != undefined) {
        changed = true;
        for (z in project[scenario].measures.ventilation.intentional_vents_and_flues) {
            var IVF = project[scenario].measures.ventilation.intentional_vents_and_flues[z];
            out += '<tr><td>A new <i>' + IVF.measure.name + ' (' + IVF.measure.ventilation_rate + ' m<sup>3</sup>/h)</i> has been added to <i>'
                    + IVF.measure.location + '</i> </td></tr>';
        }
    }
    if (project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined) {
        for (z in project[scenario].measures.ventilation.intentional_vents_and_flues_measures) {
            var IVF = project[scenario].measures.ventilation.intentional_vents_and_flues_measures[z];
            out += '<tr><td>The <i>' + IVF.original.name + ' (' + IVF.original.ventilation_rate
                    + ' m<sup>3</sup>/h)</i> in <i>' + IVF.original.location
                    + '</i> has been replaced with <i>' + IVF.measure.name + ' (' + IVF.measure.ventilation_rate
                    + ' m<sup>3</sup>/h)</i></td></tr>';
        }
    }

    var properties_to_check = [
        ['Structural infiltration', 'ventilation.infiltration_rate_incorp_shelter_factor']
    ];
    var changes = comparePropertiesInArray(scenario, properties_to_check);
    if (changes.changed === true) {
        changed = true;
        out += changes.html;
    }

    return {html: out, changed: changed};
}

function compareClothesDryingFacilities(scenario) {
    var out = "";
    var changed = false;
    // Check if any has been deleted
    project.master.ventilation.CDF.forEach(function (facility_in_master, key) {
        var found = false;
        project[scenario].ventilation.CDF.forEach(function (facility_in_scenario, key) {
            if (facility_in_master.id === facility_in_scenario.id && facility_in_master.tag === facility_in_scenario.tag)
                found = true;
        });
        if (found === false) {
            changed = true;
            out += '<tr><td><i>' + facility_in_master.name + '</i> has been removed</td></tr>';
        }

    });
    // Check if any has been added
    if (project[scenario].measures.ventilation != undefined
            && project[scenario].measures.ventilation.clothes_drying_facilities != undefined) {
        for (z in project[scenario].measures.ventilation.clothes_drying_facilities) {
            changed = true;
            out += '<tr><td>A new <i>' + project[scenario].measures.ventilation.clothes_drying_facilities[z].measure.name + '</i> has been added</td></tr>';
        }
    }

    return {html: out, changed: changed};
}

function compareFabric(scenario) {
    var out = "";
    var changed = false;
    if (project[scenario].fabric.measures != undefined && Object.keys(project[scenario].fabric.measures).length > 0) {
        changed = true;
        for (z in project[scenario].fabric.measures) {
            var element = project[scenario].fabric.measures[z];

            out += "<tr><td>" + element.original_element.name + "<br><i>Area: " + element.original_element.area
                    + "m<sup>2</sup>, U-value " + element.original_element.uvalue + ":, k-value: "
                    + element.original_element.kvalue;
            if (element.original_element.type == "Window" || element.original_element.type == "window"
                    || element.original_element.type == "Door" || element.original_element.type == "Roof_light")
                out += 'g: ' + element.original_element.g + ', gL: ' + element.original_element.gL + ', ff:' + element.original_element.ff;
            out += '</i></td>';
            out += "<td style='padding-left:3px;padding-right:5px'>" + (element.original_element.uvalue * element.original_element.area).toFixed(2) + " W/K</td>";

            out += "<td>" + element.measure.name + "<br><i>Area: " + element.measure.area
                    + "m<sup>2</sup>, U-value " + element.measure.uvalue + ":, k-value: "
                    + element.measure.kvalue;
            if (element.measure.type == "Window" || element.measure.type == "window"
                    || element.measure.type == "Door" || element.measure.type == "Roof_light")
                out += 'g: ' + element.measure.g + ', gL: ' + element.measure.gL + ', ff:' + element.measure.ff;
            out += '</i></td>';
            out += "<td style='padding-left:3px;padding-right:5px'>" + (element.measure.uvalue * element.measure.area).toFixed(2) + " W/K</td>";

            var saving = (element.original_element.uvalue * element.original_element.area) - (element.measure.uvalue * element.measure.area);
            out += "<td>";
            if (saving > 0)
                out += "<span style='color:#00aa00'>-";
            if (saving < 0)
                out += "<span style='color:#aa0000'>+";
            out += (saving).toFixed(2) + " W/K</span></td>";
            out += "</tr>";
        }
    }

    return {html: out, changed: changed};
}

function compareHeating(scenario) {
    var out = "";
    var changed = false;

    // Hot water demand
    var properties_to_check = [
        ["Designed water use is not more than 125 litres per person per day", 'water_heating.low_water_use_design'],
        ['Do you know how much energy you use for water heating?', 'water_heating.override_annual_energy_content'],
        ['Annual average hot water usage', 'water_heating.Vd_average'],
        ['Annual energy content', 'water_heating.annual_energy_content']
    ];
    var DWU = comparePropertiesInArray(scenario, properties_to_check);
    if (DWU.changed === true) {
        changed = true;
        out += DWU.html;
    }

    // Check if any water usage has been deleted
    project.master.water_heating.water_usage.forEach(function (wu_in_master, key) {
        var found = false;
        project[scenario].water_heating.water_usage.forEach(function (wu_in_scenario, key) {
            if (wu_in_master.id === wu_in_scenario.id && wu_in_master.tag === wu_in_scenario.tag)
                found = true;
        });
        if (found === false) {
            changed = true;
            out += '<tr><td><i>' + wu_in_master.name + '</i> has been removed</td></tr>';
        }
    });

    // Check if any water usage has been added
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.water_usage != undefined
            && Object.keys(project[scenario].measures.water_heating.water_usage).length > 0) {
        changed = true;
        for (var key in project[scenario].measures.water_heating.water_usage)
            out += '<tr><td>A new <i>' + project[scenario].measures.water_heating.water_usage[key].measure.name + '</i> has been added</td></tr>';
    }

    // Space heating demand
    var properties_to_check = [
        ['Living area', 'temperature.living_area'],
        ['Target temperature', 'temperature.target'],
        ['Heating off for the whole summer', 'space_heating.heating_off_summer']
    ];
    var SHD = comparePropertiesInArray(scenario, properties_to_check);
    if (SHD.changed === true) {
        changed = true;
        out += SHD.html;
    }

    // Heating systems
    if (project[scenario].measures.heating_systems != undefined
            && Object.keys(project[scenario].measures.heating_systems).length > 0) {
        changed = true;
        for (id in project[scenario].measures.heating_systems) {
            var heating_system = project[scenario].measures.heating_systems[id];
            if (heating_system.original != 'empty')
                out += '<tr><td><i>' + heating_system.original.name + '</i> has been replaced with <i>' + heating_system.measure.name + '</i></td></tr>';
            else
                out += '<tr><td>A new heating system has been added: <i>' + heating_system.measure.name + '</i></td></tr>';
        }
    }

    //Heating systems deleted and change on their parameters
    /*project.master.heating_systems.forEach(function (hs_in_master, index) {
     var hs_in_scenario = getHeatingSystemById(hs_in_master.id, scenario);
     for (var parameter in hs_in_master) {
     if (hs_in_master[parameter] != hs_in_scenario[parameter]) {
     changed = true;
     out += '<tr><td>The <i>' + parameter + '</i> of <i>' + hs_in_master.name + '</i> has changed from <i>'
     + hs_in_master[parameter] + '</i> to <i>' + hs_in_scenario[parameter] + '</i> </td></tr>';
     }
     }
     });*/

    // Space heating system controls
    if (project[scenario].measures.space_heating_control_type != undefined
            && Object.keys(project[scenario].measures.space_heating_control_type).length > 0) {
        changed = true;
        for (var id in project[scenario].measures.space_heating_control_type) {
            var heating_system_control = project[scenario].measures.space_heating_control_type[id];
            out += '<tr><td>The control of <i>' + getHeatingSystemById(id, scenario).name + '</i> has been replaced with <i>' + heating_system_control.measure.name + '</i></td></tr>';
        }
    }

    //Hot water systems
    var properties_to_check = [
        ['Include solar hot water?', 'water_heating.solar_water_heating']
    ];
    var SHW = comparePropertiesInArray(scenario, properties_to_check);
    if (SHW.changed === true) {
        changed = true;
        out += SHW.html;
    }

    // Check if the hot water storage control type has changed 
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.hot_water_control_type != undefined) {
        changed = true;
        out += '<tr><td>The hot water storage control type has changed from <i>'
                + project[scenario].measures.water_heating.hot_water_control_type.original
                + '</i> to <i>' + project[scenario].measures.water_heating.hot_water_control_type.measure.control_type
                + '</i></td></tr>';
    }

    // Check if the primary pipework insulation has changed 
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.pipework_insulation != undefined) {
        changed = true;
        out += '<tr><td>The primary circuit pipework insulation has changed from <i>'
                + project[scenario].measures.water_heating.pipework_insulation.original
                + '</i> to <i>' + project[scenario].measures.water_heating.pipework_insulation.measure.pipework_insulation
                + '</i></td></tr>';
    }

    // Storage type
    if (project[scenario].measures.water_heating != undefined
            && project[scenario].measures.water_heating.storage_type_measures != undefined) {
        changed = true;
        out += '<tr><td>The type of storage has changed from <i>'
                + project[scenario].measures.water_heating.storage_type_measures.original.name
                + '</i> to <i>' + project[scenario].measures.water_heating.storage_type_measures.measure.name
                + '</i></td></tr>';
    }

    return {html: out, changed: changed};
}

function compareEnergyRequirements(scenario) {
    var out = "";
    var changed = false;

    var ER_list = ['appliances', 'cooking', 'fans_and_pumps', 'lighting', 'space_heating', 'waterheating'];
    var ER_names = ['appliances', 'cooking', 'fans and pumps', 'lighting', 'space heating', 'water heating'];
    ER_list.forEach(function (ER, index) {
        if (project.master.energy_requirements[ER] != undefined && project.master.energy_requirements[ER].quantity
                != project[scenario].energy_requirements[ER].quantity) {
            changed = true;
            out += '<tr><td>The demand for <i>' + ER_names[index] + '</i> has changed from <i>'
                    + project.master.energy_requirements[ER].quantity.toFixed(2) + '</i> kWh/year to <i>'
                    + project[scenario].energy_requirements[ER].quantity.toFixed(2) + '</i> kWh/year</td></tr>';
        }
    });
    if (project.master.generation.total_generation != project[scenario].generation.total_generation) {
        changed = true;
        out += '<tr><td>The total generation has changed from <i>'
                + project.master.generation.total_generation.toFixed(2) + '</i> kWh/year to <i>'
                + project[scenario].generation.total_generation.toFixed(2) + '</i> kWh/year</td></tr>';
    }

    return {html: out, changed: changed};
}

function compareFuelRequirements(scenario) {
    var out = "";
    var changed = false;

    for (var fuel in project.master.fuel_totals) {
        if (project[scenario].fuel_totals[fuel] == undefined) {
            changed = true;
            out += '<tr><td style="padding-right:10px">' + fuel + '</td><td style="padding-right:10px"><i>Quantity: ' + project.master.fuel_totals[fuel].quantity.toFixed(2)
                    + ' kWh, CO<sub>2</sub>: ' + project.master.fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project.master.fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project.master.fuel_totals[fuel].annualcost.toFixed(2)
                    + '</i></td><td style="padding-right:10px" style="padding-right:10px"><i>Quantity: 0 kWh, CO<sub>2</sub>: 0 kg, Primary energy: 0 kWh, \n\
                        Annual cost: £0</i></td><td style="padding-right:10px">100%</td><td>100%</td></tr>';
        }
        else if (project.master.fuel_totals[fuel].quantity != project[scenario].fuel_totals[fuel].quantity) {
            changed = true;
            out += '<tr><td style="padding-right:10px">' + fuel + '</td><td style="padding-right:10px"><i>Quantity: ' + project.master.fuel_totals[fuel].quantity.toFixed(2)
                    + ' kWh, CO<sub>2</sub>: ' + project.master.fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project.master.fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project.master.fuel_totals[fuel].annualcost.toFixed(2)
                    + '</i></td><td style="padding-right:10px"><i>Quantity: ' + project[scenario].fuel_totals[fuel].quantity.toFixed(2)
                    + ' kWh, CO<sub>2</sub>: ' + project[scenario].fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project[scenario].fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project[scenario].fuel_totals[fuel].annualcost.toFixed(2)
                    + '</i></td><td style="padding-right:10px">' + (100 * (project.master.fuel_totals[fuel].quantity - project[scenario].fuel_totals[fuel].quantity) / project.master.fuel_totals[fuel].quantity).toFixed(2)
                    + '%</td><td>' + (100 * (project.master.fuel_totals[fuel].annualcost - project[scenario].fuel_totals[fuel].annualcost) / project.master.fuel_totals[fuel].annualcost).toFixed(2)
                    + '%</td></tr>';
        }
    }
    for (var fuel in project[scenario].fuel_totals) {
        if (project.master.fuel_totals[fuel] == undefined) {
            changed = true;
            out += '<tr><td style="padding-right:10px">' + fuel + '</td><td style="padding-right:10px"><i>Quantity: 0 kWh, \n\
                    CO<sub>2</sub>: 0 kg, Primary energy: 0 kWh, Annual cost: £0</i></td><td style="padding-right:10px"><i>Quantity: '
                    + project[scenario].fuel_totals[fuel].quantity.toFixed(2)
                    + ' kWh, CO<sub>2</sub>: ' + project[scenario].fuel_totals[fuel].annualco2.toFixed(2)
                    + ' kg, Primary energy: ' + project[scenario].fuel_totals[fuel].primaryenergy.toFixed(2)
                    + ' kWh, Annual cost: £' + project[scenario].fuel_totals[fuel].annualcost.toFixed(2)
                    + '</i></td><td style="padding-right:10px">0%</td><td>0%</td></tr>';
        }
    }

    if (changed === true)
        out = '<tr><td></td><td>Before</td><td>After</td><td>Energy savings</td><td>Cost saving</td></tr>' + out;
    // out+='<tr><td></td></tr>';

    return {html: out, changed: changed};
}

function getHeatingSystemById(id, scenario) {
    for (var index in project[scenario].heating_systems) {
        if (id == project[scenario].heating_systems[index].id)
            return project[scenario].heating_systems[index];
    }
    return false;
}