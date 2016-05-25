console.log('debug carboncoopreport.js');

function carboncoopreport_initUI() {

// console.log(project);

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

    // 	if (typeof project[scenarioName].fabric_energy_efficiency === "undefined"){
    // 		project[scenarioName].fabric_energy_efficiency = 0;
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
            if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].fabric_energy_efficiency != "undefined") {
                values[i] = Math.round(project[scenarios[i]].fabric_energy_efficiency);
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
            value: Math.round(data.fabric_energy_efficiency),
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
                    ventilationwk: Math.round(project[scenario].ventilation.average_WK),
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
				<polygon id="wall" transform="translate(330,242) scale(' + sWalls + ')" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>\
				<polygon id="thermal-bridging" transform="translate(330,144) scale(' + sThermal + ')" fill="#F0533C" points="22.9,-9.1 0,-9.1 0,9.1 22.9,9.1 22.9,17.9 40.6,0 22.9,-17.9 "/>\
				<polygon id="floor" transform="translate(213,278) scale(' + sFloor + ')" fill="#F0533C" points="9.1,22.9 9.1,0 -9.1,0 -9.1,22.9 -17.9,22.9 0,40.6 17.9,22.9 "/>\
				<text transform="matrix(1 0 0 1 191.0084 172.7823)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="14">TOTAL </tspan><tspan x="-5.4" y="16.8" fill="#F0533C" font-size="14">' + heatlossData.totalwk + ' W/K</tspan></text>\
				<text transform="matrix(1 0 0 1 328.5163 95)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Thermal Bridging</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.thermalbridgewk + ' W/K</tspan></text>\
				<text transform="matrix(1 0 0 1 230.624 21.1785)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Roof</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.roofwk + ' W/K</tspan></text>\
				<text transform="matrix(1 0 0 1 330.5875 283.9302)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Walls</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.wallswk + ' W/K</tspan></text>\
				<text transform="matrix(1 0 0 1 53.3572 283.9302)"><tspan x="0" y="0" fill="#F0533C" font-family="Karla-Bold" font-size="11">Ventilation</tspan><tspan x="0" y="12" fill="#F0533C" font-size="11">' + heatlossData.ventilationwk + ' W/K</tspan></text>\
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
        if (typeof project['master'] != "undefined" && typeof project["master"].annual_useful_gains_kWh_m2 != "undefined") {
            dataFig4.push({
                label: 'Your Home Now',
                value: [
                    {value: project["master"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                    {value: project["master"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                    {value: project["master"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                    {value: -project["master"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                    {value: -project["master"].annual_losses_kWh_m2["ventilation"], label: 'Ventilation'},
                ]
            });
        }

        if (typeof project['scenario1'] != "undefined" && typeof project["scenario1"].annual_useful_gains_kWh_m2 != "undefined") {
            dataFig4.push({
                label: 'Scenario 1',
                value: [
                    {value: project["scenario1"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                    {value: project["scenario1"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                    {value: project["scenario1"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                    {value: -project["scenario1"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                    {value: -project["scenario1"].annual_losses_kWh_m2["ventilation"], label: 'Ventilation'},
                ]
            });
        }

        if (typeof project['scenario2'] != "undefined" && typeof project["scenario2"].annual_useful_gains_kWh_m2 != "undefined") {
            dataFig4.push({
                label: 'Scenario 2',
                value: [
                    {value: project["scenario2"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                    {value: project["scenario2"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                    {value: project["scenario2"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                    {value: -project["scenario2"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                    {value: -project["scenario2"].annual_losses_kWh_m2["ventilation"], label: 'Ventilation'},
                ]
            });
        }

        if (typeof project['scenario3'] != "undefined" && typeof project["scenario3"].annual_useful_gains_kWh_m2 != "undefined") {
            dataFig4.push({
                label: 'Scenario 3',
                value: [
                    {value: project["scenario3"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
                    {value: project["scenario3"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
                    {value: project["scenario3"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
                    {value: -project["scenario3"].annual_losses_kWh_m2["fabric"], label: 'Fabric'},
                    {value: -project["scenario3"].annual_losses_kWh_m2["ventilation"], label: 'Ventilation'},
                ]
            });
        }

        var EnergyDemand = new BarChart({
            chartTitle: 'Heat Balance',
            yAxisLabel: 'kWh/m2.year',
            fontSize: 22,
            width: 1200,
            chartHeight: 600,
            division: 50,
            barWidth: 110,
            barGutter: 120,
            chartHigh: 400,
            chartLow: -400,
            font: "Karla",
            defaultBarColor: 'rgb(231,37,57)',
            barColors: {
                'Internal': 'rgb(24,86,62)',
                'Solar': 'rgb(240,212,156)',
                'Space heating': 'rgb(236,102,79)',
                'Fabric': 'rgb(246,167,7)',
                'Ventilation': 'rgb(157, 213, 203)',
            },
            data: dataFig4,
        });
        EnergyDemand.draw('heat-balance');
        /* Figure 5: Space Heating Demand
         // 
         */

        var values = [];
        for (var i = 0; i < scenarios.length; i++) {
            if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].fabric_energy_efficiency != "undefined") {
                values[i] = Math.round(project[scenarios[i]].fabric_energy_efficiency);
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
        SpaceHeatingDemand.draw('fig-5-space-heating-demand');
        /* Figure 6: Energy Demand
         //
         */

        function getEnergyDemandData() {
            var data = {};
            for (var i = 0; i < scenarios.length; i++) {
                data[scenarios[i]] = [];
                if (typeof project[scenarios[i]] !== "undefined") {
                    if (typeof project[scenarios[i]].fuel_totals !== "undefined") {
                        if (typeof project[scenarios[i]].fuel_totals['gas'] !== "undefined") {
                            data[scenarios[i]].push({value: project[scenarios[i]].fuel_totals['gas'].quantity, label: 'Gas', variance: project[scenarios[i]].fuel_totals['gas'].quantity * 0.3});
                        }
                        if (typeof project[scenarios[i]].fuel_totals['electric'] !== "undefined") {
                            data[scenarios[i]].push({value: project[scenarios[i]].fuel_totals['electric'].quantity, label: 'Electric', variance: project[scenarios[i]].fuel_totals['electric'].quantity * 0.3});
                        }
                        // other fuel types
                        var otherTotal = 0;
                        for (var fuelType in project[scenarios[i]].fuel_totals) {
                            if (fuelType != "gas" && fuelType != "electric") {
                                otherTotal += project[scenarios[i]].fuel_totals[fuelType].quantity;
                            }
                        }
                        data[scenarios[i]].push({value: otherTotal, label: 'Other', variance: otherTotal * 0.3});
                    }
                }

            }

            data.bills = [
                {
                    value: project['master'].currentenergy.energyitems["gas-kwh"].annual_kwh,
                    label: 'Gas',
                },
                {
                    value: project['master'].currentenergy.energyitems.electric.annual_kwh,
                    label: 'Electric',
                },
                {
                    value: project['master'].currentenergy.primaryenergy_annual_kwh - project['master'].currentenergy.energyitems.electric.annual_kwh - project['master'].currentenergy.energyitems["gas-kwh"].annual_kwh,
                    label: "Other"
                }
            ]

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
        EnergyDemand.draw('energy-demand');
        /* Figure 7:
         //
         */

        function getPrimaryEnergyUseData() {
            var primaryEnergyUseData = {};
            for (var i = 0; i < scenarios.length; i++) {
                primaryEnergyUseData[scenarios[i]] = [];
                if (typeof project[scenarios[i]] !== "undefined") {
                    if (typeof project[scenarios[i]].energy_requirements !== "undefined") {
                        if (typeof project[scenarios[i]].energy_requirements['lighting'] !== "undefined") {
                            primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['lighting'].quantity / data.TFA, label: 'Lighting'});
                        }

                        if (typeof project[scenarios[i]].energy_requirements['appliances'] !== "undefined") {
                            primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['appliances'].quantity / data.TFA, label: 'Appliances'});
                        }

                        if (typeof project[scenarios[i]].energy_requirements['cooking'] !== "undefined") {
                            primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['cooking'].quantity / data.TFA, label: 'Cooking'});
                        }

                        if (typeof project[scenarios[i]].energy_requirements['waterheating'] !== "undefined") {
                            primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['waterheating'].quantity / data.TFA, label: 'Water Heating'});
                        }

                        if (typeof project[scenarios[i]].energy_requirements['space_heating'] !== "undefined") {
                            primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['space_heating'].quantity / data.TFA, label: 'Space Heating'});
                        }

                        if (typeof project[scenarios[i]].energy_requirements['fans_and_pumps'] !== "undefined") {
                            primaryEnergyUseData[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['fans_and_pumps'].quantity / data.TFA, label: 'Fans and Pumps'});
                        }

                    }
                }
            }

            primaryEnergyUseData.bills = [
                {
                    value: data.currentenergy.primaryenergy_annual_kwhm2,
                    label: "Total"
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
            chartHigh: 400,
            division: 'auto',
            barWidth: 110,
            barGutter: 80,
            defaultBarColor: 'rgb(231,37,57)',
            barColors: {
                'Lighting': 'rgb(236,102,79)',
                'Appliances': 'rgb(240,212,156)',
                'Cooking': 'rgb(24,86,62)',
                'Water Heating': 'rgb(157,213,203)',
                'Space Heating': 'rgb(231,37,57)',
                'Fans and Pumps': 'rgb(246, 167, 7)',
                'Total': 'rgb(131, 51, 47)',
            },
            data: [
                {label: 'Your Home Now', value: primaryEnergyUseData.master},
                {label: 'Bills data', value: primaryEnergyUseData.bills},
                {label: 'Scenario 1', value: primaryEnergyUseData.scenario1},
                {label: 'Scenario 2', value: primaryEnergyUseData.scenario2},
                {label: 'Scenario 3', value: primaryEnergyUseData.scenario3},
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
            chartHigh: 100,
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
        CarbonDioxideEmissions.draw('carbon-dioxide-emissions');
        /* Figure 9: Bar chart showing carbon dioxide emissions rate (kgCO2/person.a)
         //
         */

        var carbonDioxideEmissionsPerPersonData = [];
        if (typeof project["master"] != "undefined" && typeof project["master"].annualco2 !== "undefined" && typeof project["master"].occupancy !== "undefined") {
            carbonDioxideEmissionsPerPersonData.push({label: "Your home now", value: project["master"].annualco2 / project["master"].occupancy});
        }

        carbonDioxideEmissionsPerPersonData.push({label: "Bills data", value: project["master"].TFA * project["master"].currentenergy.total_co2m2 / project["scenario1"].occupancy});
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
            yAxisLabel: 'kgCO2/year',
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
        CarbonDioxideEmissionsPerPerson.draw('carbon-dioxide-emissions-per-person');
        /* Figure 10: Estimated Energy cost comparison 
         // Bar chart showing annual fuel cost. Waiting on Trystan for data
         */

        var estimatedEnergyCostsData = [];
        if (typeof project["master"] != "undefined" && typeof project["master"].net_cost !== "undefined") {
            estimatedEnergyCostsData.push({label: "Your home now", value: project["master"].net_cost, variance: project["master"].net_cost * 0.3});
        }

        estimatedEnergyCostsData.push({label: "Bills data", value: project["master"].currentenergy.total_cost, variance: project["master"].currentenergy.total_cost * 0.3});
        if (typeof project["scenario1"] != "undefined" && typeof project["scenario1"].net_cost !== "undefined") {
            estimatedEnergyCostsData.push({label: "Scenario 1", value: project["scenario1"].net_cost, variance: project["scenario1"].net_cost * 0.3});
        }
        if (typeof project["scenario2"] != "undefined" && typeof project["scenario2"].net_cost !== "undefined") {
            estimatedEnergyCostsData.push({label: "Scenario 2", value: project["scenario2"].net_cost, variance: project["scenario2"].net_cost * 0.3});
        }
        if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"].net_cost !== "undefined") {
            estimatedEnergyCostsData.push({label: "Scenario 3", value: project["scenario3"].net_cost, variance: project["scenario3"].net_cost * 0.3});
        }

        var EstimatedEnergyCosts = new BarChart({
            chartTitle: 'Estimate Energy Costs (Net) Comparison',
            yAxisLabel: '£/year',
            fontSize: 22,
            font: "Karla",
            chartLow: 0,
            division: 'auto',
            width: 1200,
            chartHeight: 600,
            barGutter: 80,
            defaultBarColor: 'rgb(157,213,203)',
            data: estimatedEnergyCostsData
        });
        EstimatedEnergyCosts.draw('estimated-energy-cost-comparison');
        /* Figure 11: Your home compared with the average home.
         // Main SAP assumptions  vs actual condition comparison - table stating 'higher' or 'lower'.
         // Would be useful to have total hours of heating (currently only given times heating is on - see question 3a)
         // Where is data for number of rooms not heated? Appliance Q?
         */

        $(".js-occupancy-comparison").html(compare(2.9, data.occupancy));
        var normalDayHeatingHours = getTimeDifference(data.household["3a_heatinghours_normal_on1"], data.household["3a_heatinghours_normal_off1"]);
        var altDayHeatingHours = getTimeDifference(data.household["3a_heatinghours_normal_on2"], data.household["3a_heatinghours_normal_off2"]);
        var totalHeatingHours = normalDayHeatingHours + altDayHeatingHours;
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
        $(".js-unheated-rooms-comparison").html(compare(0, data.household["3a_habitable_not_heated_rooms"]));
        $(".js-appliance-energy-use").html(Math.round(data.LAC.EA));
        $(".js-appliance-energy-use-comparison").html(compare(3880, Math.round(data.LAC.EA)));
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

            for (var i = options.length - 1; i >= 0; i--) {

                if (options[i].title == chosenValue) {
                    var background = options[i].color;
                } else {
                    var background = 'transparent';
                }
                $("#" + tableID + " .extreme-left").after($("<td class='comfort-table-option " + i + "'  style='background:" + background + "'></td>"));
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
        createComforTable(options, "comfort-table-winter-temp", data.household["6a_temperature_winter"]);
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
        createComforTable(options, "comfort-table-winter-air", data.household["6a_airquality_winter"]);
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
        createComforTable(options, "comfort-table-summer-temp", data.household["6a_temperature_summer"]);
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
        createComforTable(options, "comfort-table-summer-air", data.household["6a_airquality_summer"]);
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
        createComforTable(options, "comfort-table-daylight-amount", data.household["6b_daylightamount"]);
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
        createComforTable(options, "comfort-table-artificial-light-amount", data.household["6b_artificallightamount"]);
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
            "performance_units",
            "benefits",
            "cost",
            "cost_units",
            "who_by_quantity",
            "who_by_total",
            "who_by",
            "disruption",
            "associated_work",
            "notes",
        ];
        function populateMeasuresTable(scenario, tableSelector, summaryTableSelector) {
            if (project[scenario].fabric.measures != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].fabric.measures, tableSelector, summaryTableSelector);
            if (project[scenario].measures.energy_systems != undefined)
                addListOfMeasuresByIdToSummaryTable(project[scenario].measures.energy_systems, tableSelector, summaryTableSelector);
            if (project[scenario].measures.ventilation != undefined) {
                if (project[scenario].measures.ventilation.extract_ventilation_points != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.extract_ventilation_points, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.intentional_vents_and_flues_measures != undefined)
                    addListOfMeasuresByIdToSummaryTable(project[scenario].measures.ventilation.intentional_vents_and_flues_measures, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.draught_proofing_measures != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.ventilation.draught_proofing_measures, tableSelector, summaryTableSelector);
                if (project[scenario].measures.ventilation.ventilation_systems_measures != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.ventilation.ventilation_systems_measures, tableSelector, summaryTableSelector);
            }
            if (project[scenario].measures.water_heating != undefined) {
                //if (project[scenario].measures.water_heating.water_usage != undefined)
                //   addListOfMeasuresByIdToSummaryTable(project[scenario].measures.water_heating.water_usage, tableSelector, summaryTableSelector);
                if (project[scenario].measures.water_heating.storage_type != undefined)
                    addMeasureToSummaryTable(project[scenario].measures.water_heating.storage_type, tableSelector, summaryTableSelector);

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
            addRowToSummaryTable(summaryTableSelector, measure.measure.name, measure.measure.description, measure.measure.benefits, measure.measure.cost, measure.measure.who_by, measure.measure.disruption);
        }

        function initialiseMeasuresTable(tableSelector) {
            var html = '<tr>\
            <th class="tg-yw4l" rowspan="2">Measure</th>\
						    <th class="tg-yw4l" rowspan="2">Description</th>\
            <th class="tg-yw4l" colspan="2">Performance Target</th>\
        <th class="tg-yw4l" rowspan="2">Benefits (in order)</th>\
            <th class="tg-yw4l" colspan="4">How Much?</th>\
						    <th class="tg-yw4l" rowspan="2">Who by?</th>\
						    <th class="tg-yw4l" rowspan="2">Dirt and disruption?</th>\
						    <th class="tg-yw4l" rowspan="2">Associated work?</th>\
						    <th class="tg-yw4l" rowspan="2">Special and other considerations</th>\
						  </tr>\
						  <tr>\
						    <td class="th">Value</td>\
						    <td class="th">Unit</td>\
						    <td class="th">Rate</td>\
						    <td class="th">Unit</td>\
						    <td class="th">Quantity</td>\
						    <td class="th">Total</td>\
						  </tr>';
            return $(tableSelector).append(html);
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
            return $(summaryTableSelector).append(html);
        }


        function addRowToSummaryTable(tableSelector, name, description, benefits, cost, who_by, disruption) {
            var html = '<tr><td class="highlighted-col">' + name + '</td>';
            html += '<td><div class="text-width-limiter">' + description + '</div>';
            html += '</td>';
            html += '<td>' + benefits + '</td>';
            html += '<td class="cost">' + cost + '</td>';
            html += '<td>' + who_by + '</td>';
            html += '<td>' + disruption + '</td>';
            html += '</tr>';
            $(tableSelector + " tbody").append($(html));
        }

        console.log('here');
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
        //       value: Math.round(project["master"].fabric_energy_efficiency),
        //       units: "kWh/m2",     //       targets: {
        //           //"Passivhaus": 15,
        //           "Passivhaus retrofit": 25,
        //           "UK Average": 145
        //       }
        //   };
        //   targetbarCarboncoop("space-heating-demand-1", options);

        //   	 var options = {
        //       name: "Space heating demand Master",
        //       value: Math.round(project["scenario1"].fabric_energy_efficiency),
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
        //       value: Math.round(project["scenario2"].fabric_energy_efficiency),
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
        //       value: Math.round(project["scenario3"].fabric_energy_efficiency),
        //       units: "kWh/m2",
        //       targets: {
        //           //"Passivhaus": 15,
        //           "Passivhaus retrofit": 25,
        //           "UK Average": 145
        //       }
        //   };
        //   targetbarCarboncoop("space-heating-demand-4", options);
    }
    ;
}

function compareCarbonCoop(scenario, outputElement) {

    var out = "";
    var changes = [
        ["Region", 'region'],
        ["Altitude", 'altitude'],
        ["use_custom_occupancy", 'use_custom_occupancy'],
        ["custom_occupancy", 'custom_occupancy'],
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
    out += "<table class='table table-striped'>";
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
            out += "<tr><td>" + description + " changed from " + valA + " to " + valB + "</td></tr>";
        }
    }

    out += "</table>";
    // Changes to elements
    var listA = project.master.fabric.elements;
    console.log(scenario);
    var listB = project[scenario].fabric.elements;
    var elements_html = "";
    for (z in listA)
    {
        if (listB[z] == undefined)
        {
            elements_html += "<tr><td>Element: <b>'" + z + "'</b> in scenario A has been deleted</td></tr>";
        }
    }

    for (z in listB)
    {
        if (listA[z] == undefined)
        {
            elements_html += "<tr><td>New Element: <b>'" + z + "'</b> added to scenario B</td></tr>";
        }
        else
        {

            if (JSON.stringify(listA[z]) != JSON.stringify(listB[z]))
            {
                elements_html += "<tr><td><b>" + listA[z].name + ":</b><br><i>";
                for (x in listA[z])
                {
                    if (x == 'description')
                        elements_html += listA[z][x] + ", ";
                    if (x == 'area')
                        elements_html += "Area: " + listA[z][x].toFixed(1) + "m<sup>2</sup>, ";
                    if (x == 'uvalue')
                        elements_html += "U-value: " + listA[z][x] + ", ";
                    if (x == 'kvalue')
                        elements_html += "k-value: " + listA[z][x];
                    if (x == 'g')
                        elements_html += "g: " + listA[z][x] + ", ";
                    if (x == 'gL')
                        elements_html += "gL: " + listA[z][x] + ", ";
                    if (x == 'ff')
                        elements_html += "Frame factor: " + listA[z][x];
                }
                elements_html += "</i></td>";
                elements_html += "<td>" + (listA[z].uvalue * listA[z].area).toFixed(1) + " W/K</td>";
                elements_html += "<td><b>" + listB[z].name + ":</b><br><i>";
                for (x in listB[z])
                {
                    if (x == 'description')
                        elements_html += listA[z][x] + ", ";
                    if (x == 'area')
                        elements_html += "Area: " + listA[z][x].toFixed(1) + "m<sup>2</sup>, ";
                    if (x == 'uvalue')
                        elements_html += "U-value: " + listB[z][x] + ", ";
                    if (x == 'kvalue')
                        elements_html += "k-value: " + listB[z][x];
                    if (x == 'g')
                        elements_html += "g: " + listB[z][x] + ", ";
                    if (x == 'gL')
                        elements_html += "gL: " + listB[z][x] + ", ";
                    if (x == 'ff')
                        elements_html += "Frame factor: " + listB[z][x];
                }
                elements_html += "</i></td>";
                elements_html += "<td>" + (listB[z].uvalue * listB[z].area).toFixed(1) + " W/K</td>";
                var saving = (listA[z].uvalue * listA[z].area) - (listB[z].uvalue * listB[z].area);
                elements_html += "<td>";
                if (saving > 0)
                    elements_html += "<span style='color:#00aa00'>-";
                if (saving < 0)
                    elements_html += "<span style='color:#aa0000'>+";
                elements_html += (saving).toFixed(1) + " W/K</span></td>";
                elements_html += "</tr>";
            }
        }
    }

    if (elements_html != "") {
        out += "<hr><h3>Building Elements</h3><hr>";
        out += "<p>Changes to Floor's, Wall's, Windows and Roof elements</p>";
        out += "<table class='table table-striped'>";
        out += "<tr><th>Before</th><th>W/K</th><th>After</th><th>W/K</th><th>Change</th></tr>";
        out += elements_html;
        out += "</table>";
    }


    out += "<hr><h3>Energy Requirements</h3><hr>";
    // Changes to elements
    var listA = project.master.energy_requirements;
    var listB = project[scenario].energy_requirements;
    console.log(listA);
    console.log(listB);
    out += "<table class='table table-striped'>";
    for (z in listA)
    {
        if (listB[z] == undefined)
        {
            out += "<tr><td>";
            out += "<b>" + listA[z].name + ": </b>";
            out += listA[z].quantity.toFixed(0) + " kWh";
            out += "</td><td><b>Deleted in scenario B</b></td><td></td></tr>";
        }
    }

    for (z in listB)
    {
        if (listA[z] == undefined)
        {
            out += "<tr><td><b>New to scenario B</b></td><td>";
            out += "<b>" + listB[z].name + ": </b>";
            out += listB[z].quantity.toFixed(0) + " kWh <b>(New)</b>";
            out += "</td><td></td></tr>";
        }
        else
        {
            if (JSON.stringify(project.master.energy_systems[z]) != JSON.stringify(project[scenario].energy_systems[z]))
            {
                out += "<tr><td>";
                out += "<b>" + listA[z].name + ": </b>";
                out += listA[z].quantity.toFixed(0) + " kWh<br>";
                out += "  Supplied by:<br>";
                for (i in project.master.energy_systems[z])
                {
                    out += "  - Type: " + project.master.energy_systems[z][i].system + ", ";
                    out += "Fraction: " + (project.master.energy_systems[z][i].fraction * 100).toFixed(0) + "%, ";
                    out += "Efficiency: " + (project.master.energy_systems[z][i].efficiency * 100).toFixed(0) + "%";
                    out += "<br>";
                }

                out += "</td><td>";
                out += "<b>" + listB[z].name + ": </b>";
                out += listB[z].quantity.toFixed(0) + " kWh<br>";
                out += "  Supplied by:<br>";
                for (i in project[scenario].energy_systems[z])
                {
                    out += "  - Type: " + project[scenario].energy_systems[z][i].system + ", ";
                    out += "Fraction: " + (project[scenario].energy_systems[z][i].fraction * 100).toFixed(0) + "%, ";
                    out += "Efficiency: " + (project[scenario].energy_systems[z][i].efficiency * 100).toFixed(0) + "%";
                    out += "<br>";
                }

                out += "</td><td></td></tr>";
            }

        }
    }

    // out += "</table>";
    out += "<tr><td><hr><h3>Fuel costs</h3><hr></td><td></td><td></td></tr>";
    // out += "<h3>Fuel costs</h3>";

    // Changes to elements
    var listA = project.master.fuel_totals;
    var listB = project[scenario].fuel_totals;
    //out += "<table class='table table-striped'>";

    for (z in listA)
    {
        if (listB[z] == undefined)
        {
            out += "<tr><td>";
            out += "<b>" + z + ": </b><br>";
            out += "Fuel quantity: " + listA[z].quantity.toFixed(0) + " kWh<br>";
            out += "Fuel cost: £" + listA[z].fuelcost.toFixed(2) + "<br>";
            out += "Annual cost: £" + listA[z].annualcost.toFixed(0) + "<br>";
            out += "</td><td><br><b>Deleted in scenario B</b></td></tr>";
        }
    }

    for (z in listB)
    {
        if (listA[z] == undefined)
        {
            out += "<tr><td><br><b>New to scenario B</b></td><td>";
            out += "<b>" + z + ": </b><br>";
            out += "Fuel quantity: " + listB[z].quantity.toFixed(0) + " kWh<br>";
            out += "Fuel cost: £" + listB[z].fuelcost.toFixed(2) + "<br>";
            out += "Annual cost: £" + listB[z].annualcost.toFixed(0) + "<br>";
            out += "</td></tr>";
        }
        else
        {

            if (JSON.stringify(listA[z]) != JSON.stringify(listB[z]))
            {
                out += "<tr><td>";
                out += "<b>" + z + ": </b><br>";
                out += "Fuel quantity: " + listA[z].quantity.toFixed(0) + " kWh<br>";
                out += "Fuel cost: £" + listA[z].fuelcost.toFixed(2) + "<br>";
                out += "Annual cost: £" + listA[z].annualcost.toFixed(0) + "<br>";
                out += "</td><td>";
                out += "<b>" + z + ": </b><br>";
                out += "Fuel quantity: " + listB[z].quantity.toFixed(0) + " kWh<br>";
                out += "Fuel cost: £" + listB[z].fuelcost.toFixed(2) + "<br>";
                out += "Annual cost: £" + listB[z].annualcost.toFixed(0) + "<br>";
                out += "</td>";
                out += "<td><br>";
                out += (100 * (listA[z].quantity - listB[z].quantity) / listA[z].quantity).toFixed(0) + "% Energy saving<br><br>";
                out += (100 * (listA[z].annualcost - listB[z].annualcost) / listA[z].annualcost).toFixed(0) + "% Cost saving<br>";
                out += "</td></tr>";
            }
        }
    }

    out += "<tr><td><hr><h3>Totals</h3><hr></td><td></td><td></td></tr>";
    out += "<tr>";
    out += "<td><b>Total Annual Cost:</b><br>";
    out += "£" + project.master.total_cost.toFixed(0) + "</td>";
    out += "<td><b>Total Annual Cost:</b><br>"
    out += "£" + project[scenario].total_cost.toFixed(0) + "</td>";
    out += "<td></td>";
    out += "</tr>";
    out += "<tr>";
    out += "<td><b>SAP Rating:</b><br>";
    out += "" + project.master.SAP.rating.toFixed(0) + "</td>";
    out += "<td><b>SAP Rating:</b><br>"
    out += "" + project[scenario].SAP.rating.toFixed(0) + "</td>";
    var sapinc = (project[scenario].SAP.rating - project.master.SAP.rating);
    if (sapinc > 0)
        out += "<td><br><span style='color:#00aa00'>+";
    if (sapinc < 0)
        out += "<td><br><span style='color:#aa0000'>";
    out += sapinc.toFixed(0) + "</span></td>";
    out += "</tr>";
    out += "</table>";
    $(outputElement).html(out);
}
;
