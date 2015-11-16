
function carboncoopreport_initUI() {

	console.log(project);

	WebFontConfig = {
	    google: { families: [ 'Karla:400,400italic,700:latin' ] }
	  };
	  (function() {
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
	// $(window).load(function(){
	WebFontConfig.active = function(){



		// $(".home-image").attr("src", project[scenario].household.houseimage);
		$(".home-image").attr("src", path + "Modules/assessment/images/" + projectid + "/" + data.featuredimage);



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

		if (typeof household['7b_carbon'] != "undefined"){
	    	priorities.carbon = {
	    		title: "Save carbon",
	    		order: household['7b_carbon']
	    	}
	    }

	    if (typeof household['7b_money'] != "undefined"){
	    	priorities.money = {
	    		title: "Save money",
	    		order: household['7b_money'],
	    	}
	    }

	    if (typeof household['7b_comfort'] != "undefined"){
	    	priorities.comfort = {
	    		title: "Improve comfort",
	    		order: household['7b_comfort'],
	    	}
	    }

	    if (typeof household['7b_airquality'] != "undefined"){
	    	priorities.airquality = {
				title: "Improve indoor air quality",
	    		order: household['7b_airquality']
	    	}
	    }

	    if (typeof household['7b_modernisation'] != "undefined"){
	    	priorities.modernisation = {
	    		title: "General modernisation",
	    		order: household['7b_modernisation'],
	    	}
	    }

	    if (typeof household['7b_health'] != "undefined"){
	    	priorities.health = {
	    		title: "Improve health",
	    		order: household['7b_health'],
	    	}
	    }

	    var sortedPriorities = [];
	    for (var priority in priorities){
			sortedPriorities.push([priority, priorities[priority]['order'], priorities[priority]['title']])
	    }
		sortedPriorities.sort(function(a, b) {return parseInt(a[1]) - parseInt(b[1])})

	    for (var i = 0 ; i < sortedPriorities.length ; i++){
	    	$("#retrofit-priorities").append("<li>"+sortedPriorities[i][1] + ". " + sortedPriorities[i][2]+"</li>");
	    }
	    

		/* Figure 2: Performance Summary
	    // Quick overview/summary - Benchmarking Bar Charts. Need to ensure that all scenarios displayed, not just one as on current graph.
	    // Space Heating Demand (kWh/m2.a)
	    // Primary Energy Demand (kWh/m2.a)
	    // CO2 emission rate (kgCO2/m2.a)
	    // CO2 emission rate - per person (kgCO2/m2.a)
	    */

	    var values = [];
		for (var i = 0 ; i < scenarios.length ; i++){
			if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].fabric_energy_efficiency != "undefined"){
				values[i] =  Math.round(project[scenarios[i]].fabric_energy_efficiency);
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
		    // project["master"]
	        units: "kWh/m2.a",
	        targets: {
	            "Target Range (lower bound)": 20,
	            "Target Range (upper bound)": 70
	        }
	    };
	    targetbarCarboncoop("space-heating-demand", options);

        // ---------------------------------------------------------------------------------
        var values = [];
    	for (var i = 0 ; i < scenarios.length ; i++){
    		if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].primary_energy_use_m2 != "undefined"){
    			values[i] =  Math.round(project[scenarios[i]].primary_energy_use_m2);
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
    	for (var i = 0 ; i < scenarios.length ; i++){
    		if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].kgco2perm2 != "undefined"){
    			values[i] =  Math.round(project[scenarios[i]].kgco2perm2);
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

	    $(".key-square--master").css("background",    colors[0]);
	    $(".key-square--scenario1").css("background", colors[1]);
	    $(".key-square--scenario2").css("background", colors[2]);
	    $(".key-square--scenario3").css("background", colors[3]);



	    /* Figure 3: How does my home lose heat?
	    // TODO: Show house graphic with heat loss for the four scenarios.
	    */

	    function heatlossData(scenario){
	    	if (typeof project[scenario] != "undefined" && typeof project[scenario].fabric != "undefined"){
		    	return {
				    floorwk: Math.round(project[scenario].fabric.total_floor_WK),
				    ventilationwk: Math.round(project[scenario].ventilation.average_WK),
				    windowswk: Math.round(project[scenario].fabric.total_window_WK),
				    wallswk: Math.round(project[scenario].fabric.total_wall_WK),
				    roofwk: Math.round(project[scenario].fabric.total_roof_WK),
				    thermalbridgewk: Math.round(project[scenario].fabric.thermal_bridging_heat_loss),
				    totalwk: project[scenario].fabric.total_floor_WK + project[scenario].ventilation.average_WK + project[scenario].fabric.total_window_WK + project[scenario].fabric.total_wall_WK + project[scenario].fabric.total_roof_WK + project[scenario].fabric.thermal_bridging_heat_loss	
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

	    $("body").on("click", ".js-house-heatloss-diagram-picker span", function(e){
			var scenario = $(this).data("scenario");
			$(".js-house-heatloss-diagram-picker span").removeClass("selected");
			$(this).addClass("selected");
			$(".js-house-heatloss-diagrams-wrapper .centered-house").css({
				"display": "none"
			});
			$("div[data-scenario-diagram='"+scenario+"']").css("display", "block");
	    });

	    
	    heatlossDataMaster = heatlossData("master");
		heatlossDataScenario1 = heatlossData("scenario1");
		heatlossDataScenario2 = heatlossData("scenario2");
		heatlossDataScenario3 = heatlossData("scenario3");

	    if (printmode != true){
	    	$("#house-heatloss-diagram-scenario1, #house-heatloss-diagram-scenario2, #house-heatloss-diagram-scenario3").css({
	    		"display": "none"
	    	});
	    }

	    function calculateRedShade(value, calibrateMax){
	    	var calibrateMax = 292;
	    	return "rgba(255,0,0, "+ (value / calibrateMax) + ")";
	    }

	    function generateHouseMarkup(heatlossData){

	    	var red = "rgba()"
	    	var html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="500" viewBox="0 0 469 337" preserveAspectRatio="xMinYMin" xml:space="preserve">\
	    					<image x="0" y="0" width="469" height="337" xlink:href="../Modules/assessment/views/house-carboncoop-v3.svg"/>\
							<g transform="translate(105,30)">\
					           	<path id="thermal-bridging" fill="'+calculateRedShade(heatlossData.thermalbridgewk)+'" d="M229.9,113.1c2.4,0,4.4,2,4.4,4.4l0.1,28.6c0,5.9,4.8,10.6,10.6,10.6\
										c5.8,0,10.6-4.8,10.6-10.6l0.1-28.6c0-2.4,2-4.4,4.4-4.4c2.4,0,4.4,2,4.4,4.4l0.1,28.6c0,5.9,4.8,10.6,10.6,10.6\
										s10.6-4.8,10.6-10.6l0.1-11.8c0-2.4,1.9-4.4,4.3-4.4v0h7.6v2.9l11.3-5.6c0.3-0.1,0.3-0.6,0-0.7l-11.3-5.6v2.9h-7.5v0\
										c-5.8,0-10.6,4.8-10.6,10.6l-0.1,11.8c0,2.4-2,4.4-4.4,4.4s-4.4-2-4.4-4.4l-0.1-28.6c0-5.8-4.7-10.6-10.6-10.6v0c0,0,0,0,0,0\
										c0,0,0,0,0,0v0c-5.8,0-10.6,4.8-10.6,10.6l-0.1,28.6c0,2.4-2,4.4-4.4,4.4c-2.4,0-4.4-2-4.4-4.4l-0.1-28.6c0-5.8-4.7-10.6-10.6-10.6\
										v0c0,0,0,0,0,0s0,0,0,0v0L229.9,113.1z"/>\
								<path id="roof" fill="'+calculateRedShade(heatlossData.roofwk)+'" d="M172.8,38.8c1.4-2,4.2-2.4,6.2-1l23.3,16.5c4.8,3.4,11.4,2.3,14.8-2.5s2.3-11.4-2.5-14.8\
										l-23.2-16.7c-2-1.4-2.4-4.2-1-6.2c1.4-2,4.2-2.4,6.2-1L220,29.7c4.8,3.4,11.4,2.3,14.8-2.5s2.3-11.4-2.5-14.8l-9.5-7\
										c-2-1.4-2.4-4.1-1.1-6.1l0,0l4.4-6.2l2.4,1.7l1.9-12.4c0.1-0.3-0.3-0.6-0.6-0.4l-11.1,5.9l2.4,1.7l-4.4,6.1l0,0\
										c-3.4,4.8-2.3,11.4,2.5,14.8l9.5,7c2,1.4,2.5,4.2,1,6.2c-1.4,2-4.2,2.4-6.2,1L200.2,8.1c-4.7-3.4-11.4-2.3-14.8,2.4l0,0\
										c0,0,0,0,0,0c0,0,0,0,0,0l0,0c-3.4,4.8-2.3,11.4,2.5,14.8l23.2,16.7c2,1.4,2.5,4.2,1,6.2c-1.4,2-4.2,2.4-6.2,1l-23.3-16.5\
										c-4.7-3.4-11.4-2.3-14.8,2.4l0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0L172.8,38.8z"/>\
								<path id="walls" fill="'+calculateRedShade(heatlossData.wallswk)+'" d="M229.9,193.3c2.4,0,4.4,2,4.4,4.4l0.1,28.6c0,5.9,4.8,10.6,10.6,10.6\
										c5.8,0,10.6-4.8,10.6-10.6l0.1-28.6c0-2.4,2-4.4,4.4-4.4c2.4,0,4.4,2,4.4,4.4l0.1,28.6c0,5.9,4.8,10.6,10.6,10.6\
										s10.6-4.8,10.6-10.6l0.1-11.8c0-2.4,1.9-4.4,4.3-4.4v0h7.6v2.9l11.3-5.6c0.3-0.1,0.3-0.6,0-0.7L298,201v2.9h-7.5v0\
										c-5.8,0-10.6,4.8-10.6,10.6l-0.1,11.8c0,2.4-2,4.4-4.4,4.4s-4.4-2-4.4-4.4l-0.1-28.6c0-5.8-4.7-10.6-10.6-10.6v0c0,0,0,0,0,0\
										c0,0,0,0,0,0v0c-5.8,0-10.6,4.8-10.6,10.6l-0.1,28.6c0,2.4-2,4.4-4.4,4.4c-2.4,0-4.4-2-4.4-4.4l-0.1-28.6c0-5.8-4.7-10.6-10.6-10.6\
										v0c0,0,0,0,0,0s0,0,0,0v0L229.9,193.3z"/>\
								<path id="windows" fill="'+calculateRedShade(heatlossData.windowswk)+'" d="M11.5,113.1c-2.4,0-4.4,2-4.4,4.4l-0.1,28.6c0,5.9-4.8,10.6-10.6,10.6s-10.6-4.8-10.6-10.6\
										l-0.1-28.6c0-2.4-2-4.4-4.4-4.4c-2.4,0-4.4,2-4.4,4.4l-0.1,28.6c0,5.9-4.8,10.6-10.6,10.6s-10.6-4.8-10.6-10.6l-0.1-11.8\
										c0-2.4-1.9-4.4-4.3-4.4v0h-7.6v2.9l-11.3-5.6c-0.3-0.1-0.3-0.6,0-0.7l11.3-5.6v2.9h7.5v0c5.8,0,10.6,4.8,10.6,10.6l0.1,11.8\
										c0,2.4,2,4.4,4.4,4.4c2.4,0,4.4-2,4.4-4.4l0.1-28.6c0-5.8,4.7-10.6,10.6-10.6v0c0,0,0,0,0,0c0,0,0,0,0,0v0\
										c5.8,0,10.6,4.8,10.6,10.6l0.1,28.6c0,2.4,2,4.4,4.4,4.4s4.4-2,4.4-4.4l0.1-28.6c0-5.8,4.7-10.6,10.6-10.6v0c0,0,0,0,0,0\
										c0,0,0,0,0,0v0L11.5,113.1z"/>\
								<path id="ventilation" fill="'+calculateRedShade(heatlossData.ventilationwk)+'" d="M11.5,193.3c-2.4,0-4.4,2-4.4,4.4l-0.1,28.6c0,5.9-4.8,10.6-10.6,10.6s-10.6-4.8-10.6-10.6\
										l-0.1-28.6c0-2.4-2-4.4-4.4-4.4c-2.4,0-4.4,2-4.4,4.4l-0.1,28.6c0,5.9-4.8,10.6-10.6,10.6s-10.6-4.8-10.6-10.6l-0.1-11.8\
										c0-2.4-1.9-4.4-4.3-4.4v0h-7.6v2.9l-11.3-5.6c-0.3-0.1-0.3-0.6,0-0.7l11.3-5.6v2.9h7.5v0c5.8,0,10.6,4.8,10.6,10.6l0.1,11.8\
										c0,2.4,2,4.4,4.4,4.4c2.4,0,4.4-2,4.4-4.4l0.1-28.6c0-5.8,4.7-10.6,10.6-10.6v0c0,0,0,0,0,0c0,0,0,0,0,0v0\
										c5.8,0,10.6,4.8,10.6,10.6l0.1,28.6c0,2.4,2,4.4,4.4,4.4s4.4-2,4.4-4.4l0.1-28.6c0-5.8,4.7-10.6,10.6-10.6v0c0,0,0,0,0,0\
										c0,0,0,0,0,0v0L11.5,193.3z"/>\
								<path id="floor" fill="'+calculateRedShade(heatlossData.floorwk)+'" d="M129.5,240.7c0,2.4-2,4.4-4.4,4.4l-9.6,0.1c-5.9,0-10.6,4.8-10.6,10.6\
										c0,5.8,4.8,10.6,10.6,10.6l7.8,0.1c2.4,0,4.4,1.9,4.4,4.3h0v7.6h-2.9l5.6,11.3c0.1,0.3,0.6,0.3,0.7,0l5.6-11.3h-2.9V271h0\
										c0-5.8-4.8-10.6-10.6-10.6l-7.8-0.1c-2.4,0-4.4-2-4.4-4.4s2-4.4,4.4-4.4l9.6-0.1c5.8,0,10.6-4.7,10.6-10.6h0c0,0,0,0,0,0s0,0,0,0h0\
										L129.5,240.7z"/>\
							</g>\
				            <g style="font-size:12px; fill:rgba(99,86,71,0.8)">\
				                <text x="160" y="300" style="font-weight:bold">Floor</text>\
				                <text id="house-floorwk" x="160" y="315">'+heatlossData.floorwk+' W/K</text>\
				                <text x="350" y="50" style="font-weight:bold">Roof</text>\
				                <text id="house-roofwk" x="350" y="65">'+heatlossData.roofwk+' W/K</text>\
				                <text x="360" y="110" style="font-weight:bold">Thermal Bridging</text>\
				                <text id="house-thermalbridging" x="360" y="125">'+heatlossData.thermalbridgewk+' W/K</text>\
				                <text x="400" y="205" style="font-weight:bold">Walls</text>\
				                <text id="house-wallswk" x="400" y="220">'+heatlossData.wallswk+' W/K</text>\
				                <text x="70" y="205" style="font-weight:bold;" text-anchor="end">Ventilation</text>\
				                <text id="house-ventilationwk" x="70" y="220" text-anchor="end">'+heatlossData.ventilationwk+' W/K</text>\
				                <text x="70" y="110" style="font-weight:bold;" text-anchor="end">Windows</text>\
				                <text id="house-windowswk" x="70" y="125" text-anchor="end">'+heatlossData.windowswk+' W/K</text>\
				                <text x="500" y="400" style="font-weight:bold;" text-anchor="middle">TOTAL</text>\
				                <text id="house-totalwk" x="500" y="435" text-anchor="middle">'+heatlossData.total+' W/K</text>\
				            </g>\
				        </svg>';
			return html;
	    }

	    $("#house-heatloss-diagram-master").html($(generateHouseMarkup(heatlossDataMaster)));
	    $("#house-heatloss-diagram-scenario1").html($(generateHouseMarkup(heatlossDataScenario1)));
	    $("#house-heatloss-diagram-scenario2").html($(generateHouseMarkup(heatlossDataScenario2)));
	    $("#house-heatloss-diagram-scenario3").html($(generateHouseMarkup(heatlossDataScenario3)));


	    /* Figure 4: Your home’s heat balance
	    // Heat transfer per year by element. The gains and losses here need to balance. 
	    // data.annual_losses_kWh_m2 appears to be empty, so there are currently no negative stacks on this chart
	    */

        var values = [];
    	for (var i = 0 ; i < scenarios.length ; i++){
    		if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].kwhdpp != "undefined"){
    			values[i] =  Math.round(project[scenarios[i]].kwhdpp.toFixed(1));
    		} else {
    			values[i] = 0;
    		}
    	}

    	var dataFig4 = [];
    	// var dataFig4 = [{
    	// 	label: 'Your Home Now'
    	// },{
    	// 	label: 'Scenario 1'
    	// },{
    	// 	label: 'Scenario 2'
    	// },{
    	// 	label: 'Scenario 3'
    	// }];

    	if (typeof project['master'] != "undefined" && typeof project["master"].annual_useful_gains_kWh_m2 != "undefined"){
    		dataFig4.push({
    			label: 'Your Home Now',
    			value: [
					{value: project["master"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
					{value: project["master"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
					{value: project["master"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
				]
    		});
    	}

    	if (typeof project['scenario1'] != "undefined" && typeof project["scenario1"].annual_useful_gains_kWh_m2 != "undefined"){
    		dataFig4.push({
    			label: 'Scenario 1',
    			value: [
					{value: project["scenario1"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
					{value: project["scenario1"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
					{value: project["scenario1"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
				]
    		});
    	}

    	if (typeof project['scenario2'] != "undefined" && typeof project["scenario2"].annual_useful_gains_kWh_m2 != "undefined"){
    		dataFig4.push({
    			label: 'Scenario 2',
    			value: [
					{value: project["scenario2"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
					{value: project["scenario2"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
					{value: project["scenario2"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
				]
    		});
    	}

    	if (typeof project['scenario3'] != "undefined" && typeof project["scenario3"].annual_useful_gains_kWh_m2 != "undefined"){
    		dataFig4.push({
    			label: 'Scenario 3',
    			value: [
					{value: project["scenario3"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
					{value: project["scenario3"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
					{value: project["scenario3"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
				]
    		});
    	}

		var EnergyDemand = new BarChart({
			chartTitle: 'Heat Balance',
			yAxisLabel: 'kWh/m2.year',
			fontSize: 22,
			width: 1200,
			chartHeight: 600,
			division: 'auto',
			barWidth: 110,
			barGutter: 120,
			division: 100,
			font: "Karla",
			defaultBarColor: 'rgb(231,37,57)',
			barColors: {
				'Internal': 'rgb(24,86,62)',
				'Solar': 'rgb(240,212,156)',
				'Space heating': 'rgb(236,102,79)',
				// 'Solid fuel': 'rgb(246,167,7)',
			},
			data: dataFig4,
		});

		EnergyDemand.draw('heat-balance');


		/* Figure 5: Space Heating Demand
		// 
		*/

	    var values = [];
		for (var i = 0 ; i < scenarios.length ; i++){
			if (typeof project[scenarios[i]] != "undefined" && project[scenarios[i]].fabric_energy_efficiency != "undefined"){
				values[i] =  Math.round(project[scenarios[i]].fabric_energy_efficiency);
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
			barGutter: 60,
			defaultBarColor: 'rgb(157,213,203)',
			// barColors: {
			// 	'Space heating': 'rgb(157,213,203)',
			// 	'Pumps, fans, etc.': 'rgb(24,86,62)',
			// 	'Cooking': 'rgb(40,153,139)',
			// },
			targets: [
				{
					label: '30 kWh/m2.a',
					target: 30,
					color: 'rgb(231,37,57)'
				},
				{
					label: '70 kWh/m2.a',
					target: 70,
					color: 'rgb(231,37,57)'
				},
				{
					label: 'UK Average 140 kWh/m2.a',
					target: 140,
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

		function getEnergyDemandData(){
			var data = {};
			for (var i = 0 ; i < scenarios.length ; i++){
				data[scenarios[i]] = [];
				if (typeof project[scenarios[i]] !== "undefined"){
					if (typeof project[scenarios[i]].fuel_totals !== "undefined"){
						if (typeof project[scenarios[i]].fuel_totals['gas'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].fuel_totals['gas'].quantity, label: 'Gas'});
						}
						if (typeof project[scenarios[i]].fuel_totals['electric'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].fuel_totals['electric'].quantity, label: 'Electric'});
						}
						if (typeof project[scenarios[i]].fuel_totals['wood'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].fuel_totals['wood'].quantity, label: 'Wood'});
						}
					}
				}

			}

			return data;	
		}

		var energyDemandData = getEnergyDemandData();

		var EnergyDemand = new BarChart({
			chartTitle: 'Energy Demand',
			yAxisLabel: 'kWh/m2.year',
			fontSize: 22,
			font: "Karla",
			width: 1200,
			chartHeight: 600,
			division: 'auto',
			barWidth: 110,
			barGutter: 120,
			defaultBarColor: 'rgb(231,37,57)',
			barColors: {
				'Gas': 'rgb(236,102,79)',
				'Electric': 'rgb(240,212,156)',
				'Wood': 'rgb(24,86,62)',
			},
			data: [
				{label: 'Your Home Now', value: energyDemandData.master},
				{label: 'Scenario 1', value: energyDemandData.scenario1},
				{label: 'Scenario 2', value: energyDemandData.scenario2},
				{label: 'Scenario 3', value: energyDemandData.scenario3},
			]
		});

		EnergyDemand.draw('energy-demand');

		/* Figure 7:
		//
		*/

		function getPrimaryEnergyUseData(){
			var data = {};
			for (var i = 0 ; i < scenarios.length ; i++){
				data[scenarios[i]] = [];
				if (typeof project[scenarios[i]] !== "undefined"){
					if (typeof project[scenarios[i]].energy_requirements !== "undefined"){
						if (typeof project[scenarios[i]].energy_requirements['lighting'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['lighting'].quantity, label: 'Lighting'});
						}

						if (typeof project[scenarios[i]].energy_requirements['appliances'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['appliances'].quantity, label: 'Appliances'});
						}

						if (typeof project[scenarios[i]].energy_requirements['cooking'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['cooking'].quantity, label: 'Cooking'});
						}

						if (typeof project[scenarios[i]].energy_requirements['waterheating'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['waterheating'].quantity, label: 'Water Heating'});
						}

						if (typeof project[scenarios[i]].energy_requirements['space_heating'] !== "undefined"){
							data[scenarios[i]].push({value: project[scenarios[i]].energy_requirements['space_heating'].quantity, label: 'Space Heating'});
						}

					}
				}
			}

			return data;	
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
			barGutter: 120,
			defaultBarColor: 'rgb(231,37,57)',
			barColors: {
				'Lighting': 'rgb(236,102,79)',
				'Appliances': 'rgb(240,212,156)',
				'Cooking': 'rgb(24,86,62)',
				'Water Heating': 'rgb(157,213,203)',
				'Space Heating' : 'rgb(231,37,57)',
			},
			data: [
				{label: 'Your Home Now', value: primaryEnergyUseData.master},
				{label: 'Scenario 1', value: primaryEnergyUseData.scenario1},
				{label: 'Scenario 2', value: primaryEnergyUseData.scenario2},
				{label: 'Scenario 3', value: primaryEnergyUseData.scenario3},
			]
		});

		primaryEneryUse.draw('primary-energy-use');


		/* Figure 8: Carbon dioxide emissions in kgCO2/m2.a
		//
		*/

		var carbonDioxideEmissionsData = [{label: 'UK Average', value: 100}];
		if (typeof project["master"] !== "undefined" && typeof project["master"].kgco2perm2 !== "undefined"){
			carbonDioxideEmissionsData.push({label: "Master", value: project["master"].kgco2perm2});
		}
		if (typeof project["scenario1"] !== "undefined" && typeof project["scenario1"].kgco2perm2 !== "undefined"){
			carbonDioxideEmissionsData.push({label: "Scenario 1", value: project["scenario1"].kgco2perm2});
		}
		if (typeof project["scenario2"] !== "undefined" && typeof project["scenario2"].kgco2perm2 !== "undefined"){
			carbonDioxideEmissionsData.push({label: "Scenario 2", value: project["scenario2"].kgco2perm2});
		}
		if (typeof project["scenario3"] !== "undefined" && typeof project["scenario3"].kgco2perm2 !== "undefined"){
			carbonDioxideEmissionsData.push({label: "Scenario 3", value: project["scenario3"].kgco2perm2});
		}

		var CarbonDioxideEmissions = new BarChart({
			chartTitle: 'Carbon Dioxide Emissions',
			yAxisLabel: 'kWh/m2.year',
			fontSize: 22,
			font: "Karla",
			division: 'auto',
			width: 1200,
			chartHeight: 600,
			barWidth: 110,
			barGutter: 60,
			defaultBarColor: 'rgb(157,213,203)',
			barColors: {
				'Space heating': 'rgb(157,213,203)',
				'Pumps, fans, etc.': 'rgb(24,86,62)',
				'Cooking': 'rgb(40,153,139)',
			},
			targets: [
				{
					label: '65kwH/m2.year',
					target: 65,
					color: 'rgb(231,37,57)'
				},
				{
					label: '105kwH/m2.year',
					target: 110,
					color: 'rgb(231,37,57)'
				},
			],
			data: carbonDioxideEmissionsData,
		});

		CarbonDioxideEmissions.draw('carbon-dioxide-emissions');


		/* Figure 9: Bar chart showing carbon dioxide emissions rate (kgCO2/person.a)
		//
		*/

		var carbonDioxideEmissionsPerPersonData = [];
		if (typeof project["master"] != "undefined" && typeof project["master"].annualco2 !== "undefined" && typeof project["master"].occupancy !== "undefined"){
			carbonDioxideEmissionsPerPersonData.push({label: "Master", value: project["master"].annualco2 / project["master"].occupancy});
		}
		if (typeof project["scenario1"] != "undefined" && typeof project["scenario1"].annualco2 !== "undefined" && typeof project["scenario1"].occupancy !== "undefined"){
			carbonDioxideEmissionsPerPersonData.push({label: "Scenario 1", value: project["scenario1"].annualco2 / project["scenario1"].occupancy});
		}
		if (typeof project["scenario2"] != "undefined" && typeof project["scenario2"].annualco2 !== "undefined" && typeof project["scenario2"].occupancy !== "undefined"){
			carbonDioxideEmissionsPerPersonData.push({label: "Scenario 2", value: project["scenario2"].annualco2 / project["scenario2"].occupancy});
		}
		if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"].annualco2 !== "undefined" && typeof project["scenario3"].occupancy !== "undefined"){
			carbonDioxideEmissionsPerPersonData.push({label: "Scenario 3", value: project["scenario3"].annualco2 / project["scenario3"].occupancy});
		}

		var CarbonDioxideEmissionsPerPerson = new BarChart({
			chartTitle: 'Carbon Dioxide Emissions Per Person',
			yAxisLabel: 'kWh/m2.year',
			fontSize: 22,
			font: "Karla",
			division: 1000,
			width: 1200,
			chartHeight: 600,
			barWidth: 110,
			barGutter: 120,
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
		if (typeof project["master"] != "undefined" && typeof project["master"].net_cost !== "undefined"){
			estimatedEnergyCostsData.push({label: "Master", value: project["master"].net_cost});
		}
		if (typeof project["scenario1"] != "undefined" && typeof project["scenario1"].net_cost !== "undefined"){
			estimatedEnergyCostsData.push({label: "Scenario 1", value: project["scenario1"].net_cost});
		}
		if (typeof project["scenario2"] != "undefined" && typeof project["scenario2"].net_cost !== "undefined"){
			estimatedEnergyCostsData.push({label: "Scenario 2", value: project["scenario2"].net_cost});
		}
		if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"].net_cost !== "undefined"){
			estimatedEnergyCostsData.push({label: "Scenario 3", value: project["scenario3"].net_cost});
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
			barGutter: 120,
			defaultBarColor: 'rgb(231,37,57)',
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

		function compare(num1, num2){
			if (num1 > num2){
				return "Lower";
			} else if (num1 < num2){
				return "Higher";
			} else {
				return "N/A";
			}
		}

		// time format is "11:30" or "15:00" etc
		function getTimeDifference(time1, time2){
			if (time1 == null || time2 == null){
				return false;
			}
			// thanks to http://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
			var time1Array = time1.split(":");
			var time2Array = time2.split(":");
			// use a constant date (e.g. 2000-01-01) and the desired time to initialize two dates

			var date1 = new Date(2000, 0, 1,  time1Array[0], time1Array[1]); 
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
		$(".js-unheated-rooms-comparison").html(compare(0,data.household["3a_habitable_not_heated_rooms"]));
		$(".js-appliance-energy-use").html(Math.round(data.LAC.EA));
		$(".js-appliance-energy-use-comparison").html(compare(3880, Math.round(data.LAC.EA)));
		

		/* Figure 12: SAP chart
		//
		*/

		function calculateSapRatingFromScore(score){

			if (!score){
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
			if (scoreFlooredToNearestTen < 30){
				scoreFlooredToNearestTen = 30;
			}

			return sapRatings[scoreFlooredToNearestTen];

		}


		if (typeof project["master"] != "undefined" && typeof project["master"]["SAP"] !== "undefined"){
			var sapNow = Math.round(project["master"]["SAP"]["rating"]);
		} else {
			var sapNow = false;
		}

		if (typeof project["scenario3"] != "undefined" && typeof project["scenario3"]["SAP"] !== "undefined"){
			var sap2050 = Math.round(project["scenario3"]["SAP"]["rating"]);
		} else {
			var sap2050 = false;
		}

		var sapAverage = 59;
		// var sap2050 = Math.round(project["scenario3"]["SAP"]["rating"]);

		$(".js-sap-score-now").html(sapNow);
		$(".js-sap-rating-now").html(calculateSapRatingFromScore(sapNow));
		$(".js-sap-score-2050").html(sap2050);
		$(".js-sap-rating-2050").html(calculateSapRatingFromScore(sap2050));
		$(".js-sap-score-average").html(sapAverage);
		$(".js-sap-rating-average").html(calculateSapRatingFromScore(sapAverage));


		/* Figure 13: Comfort Tables.
		//	
		*/
		function createComforTable(options, tableID, chosenValue){

			for (var i = options.length-1 ;i >= 0 ; i--){
				
				if (options[i].title == chosenValue){
					var background = options[i].color;
				} else {
					var background = 'transparent';
				}
				$("#" + tableID + " .extreme-left").after($("<td class='comfort-table-option "+ i+ "'  style='background:"+background+"'></td>"));
			}

		}

		var red = "rgb(228, 27, 58)";
		var green = "rgb(149, 211, 95)";

		// Temperature in Winter
		var options = [
			{
				title: "Too cold",
				color: red,
			},{
				title: "Just right",
				color: green,
			},{
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
			},{
				title: "Just right",
				color: green,
			},{
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
			},{
				title: "Just right",
				color: green,
			},{
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
			},{
				title: "Just right",
				color: green,
			},{
				title: "Too stuffy",
				color: red
			}
		];

		createComforTable(options, "comfort-table-summer-air", data.household["6a_airquality_summer"]);

		var options = [
			{
				title: "Too little",
				color: red,
			},{
				title: "Just right",
				color: green,
			},{
				title: "Too much",
				color: red
			}
		];

		createComforTable(options, "comfort-table-daylight-amount", data.household["6b_daylightamount"]);

		var options = [
			{
				title: "Too little",
				color: red,
			},{
				title: "Just right",
				color: green,
			},{
				title: "Too much",
				color: red
			}
		];

		createComforTable(options, "comfort-table-artificial-light-amount", data.household["6b_artificallightamount"]);



		/* Figure 14: Humidity Data
		// No JS needed currently
		*/

		/* Figure 15: Temperature Data
		// No JS needed currently
		*/

		/* Figure 16: You also told us...
		// No JS needed currently
		*/


		

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

		

		function populateMeasuresTable(scenario, tableSelector, summaryTableSelector){
			for (var measureID in project[scenario].fabric.measures){
				var measure = project[scenario].fabric.measures[measureID];
				var html = "<tr>";
				var row = $('<tr></tr>');
				for (var i = 0 ; i < measuresTableColumns.length ; i++){
					var cell = $('<td></td>');
					cell.html(measure.measure[measuresTableColumns[i]]);
					row.append(cell);
				}
				$(tableSelector).append(row);

				addRowToSummaryTable(summaryTableSelector, measure.measure.name, measure.measure.description, measure.measure.benefits, measure.measure.cost, measure.measure.who_by, measure.measure.disruption);
			}
		}

		function initialiseMeasuresTable(tableSelector){
			var html =  '<tr>\
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

		function createMeasuresTable(scenario, tableSelector, summaryTableSelector){
			initialiseMeasuresTable(tableSelector);		
			initiliaseMeasuresSummaryTable(summaryTableSelector);		
			populateMeasuresTable(scenario, tableSelector, summaryTableSelector);	
		}

		function initiliaseMeasuresSummaryTable(summaryTableSelector){
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


		function addRowToSummaryTable(tableSelector, name, description, benefits, cost, who_by, disruption){
			var html = '<tr><td class="highlighted-col">' + name + '</td>';
			html +=	'<td><div class="text-width-limiter">' + description + '</div>';
			html += '</td>';
			html +=	'<td>' + benefits + '</td>';
			html +=	'<td class="cost">' + cost + '</td>';
			html +=	'<td>' + who_by + '</td>';
			html +=	'<td>' + disruption + '</td>';
			html += '</tr>';

			$(tableSelector + " tbody").append($(html));
		}



		if (typeof project["scenario1"] != "undefined"){
			$("#output-scenario1-name").html(project["scenario1"]["scenario_name"]);
			createMeasuresTable("scenario1", "#scenario1-measures", ".js-measures1-summary");
		}
		if (typeof project["scenario2"] != "undefined"){
			$("#output-scenario2-name").html(project["scenario2"]["scenario_name"]);
			createMeasuresTable("scenario2", "#scenario2-measures", ".js-measures2-summary");
		}
		if (typeof project["scenario3"] != "undefined"){
			$("#output-scenario3-name").html(project["scenario3"]["scenario_name"]);
			createMeasuresTable("scenario3", "#scenario3-measures", ".js-measures3-summary");
		}


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




		//if (printmode)



	    // Figure 5
		 // var options = {
	  //       name: "Space heating demand Master",
	  //       value: Math.round(project["master"].fabric_energy_efficiency),
	  //       units: "kWh/m2",
	  //       targets: {
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
	};
}