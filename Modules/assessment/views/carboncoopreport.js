
function carboncoopreport_initUI() {

	console.log(project);

	// $(".home-image").attr("src", project[scenario].household.houseimage);
	$(".home-image").attr("src", path + "Modules/assessment/images/" + projectid + "/" + data.featuredimage);



	/* Figure 1: Retrofit Priorities
    //  Shows retrofit priorities - in order - identifying whether interested in retrofit for cost, comfort or carbon reasons etc.
    */

    var priorities = {};
    var household = project["master"].household;

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
    	$("#retrofit-priorities").append("<li>"+sortedPriorities[i][2]+"</li>");
    }
    

	/* Figure 2: Performance Summary
    // Quick overview/summary - Benchmarking Bar Charts. Need to ensure that all scenarios displayed, not just one as on current graph.
    // Space Heating Demand (kWh/m2.a)
    // Primary Energy Demand (kWh/m2.a)
    // CO2 emission rate (kgCO2/m2.a)
    // CO2 emission rate - per person (kgCO2/m2.a)
    */

	var options = {
        name: "Space heating demand",
        value: Math.round(data.fabric_energy_efficiency),
        values: [
	        Math.round(project["master"].fabric_energy_efficiency),
	        Math.round(project["scenario1"].fabric_energy_efficiency),
	        Math.round(project["scenario2"].fabric_energy_efficiency),
	        Math.round(project["scenario3"].fabric_energy_efficiency)
	    ],
	    // project["master"]
        units: "kWh/m2",
        targets: {
            //"Passivhaus": 15,
            "Passivhaus retrofit": 25,
            "UK Average": 145
        }
    };
    targetbarCarboncoop("space-heating-demand", options);

        // ---------------------------------------------------------------------------------
    var options = {
        name: "Primary energy demand",
        value: Math.round(data.primary_energy_use_m2),
        values: [
	        Math.round(project["master"].primary_energy_use_m2),
	        Math.round(project["scenario1"].primary_energy_use_m2),
	        Math.round(project["scenario2"].primary_energy_use_m2),
	        Math.round(project["scenario3"].primary_energy_use_m2)
	    ],
        units: "kWh/m2",
        targets: {
            "Passivhaus": 120,
            "UK Average": 350
        }
    };
    targetbarCarboncoop("primary-energy", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "CO2 Emission rate",
        value: Math.round(data.kgco2perm2),
        values: [
	        Math.round(project["master"].kgco2perm2),
	        Math.round(project["scenario1"].kgco2perm2),
	        Math.round(project["scenario2"].kgco2perm2),
	        Math.round(project["scenario3"].kgco2perm2)
	    ],
        units: "kgCO2/m2",
        targets: {
            "80% by 2050": 17,
            "UK Average": 85
        }
    };
    targetbarCarboncoop("co2-emission-rate", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Per person energy use",
        value: data.kwhdpp.toFixed(1),
        values: [
	        Math.round(project["master"].kwhdpp.toFixed(1)),
	        Math.round(project["scenario1"].kwhdpp.toFixed(1)),
	        Math.round(project["scenario2"].kwhdpp.toFixed(1)),
	        Math.round(project["scenario3"].kwhdpp.toFixed(1))
	    ],
        units: "kWh/day",
        targets: {
            "70% heating saving": 8.6,
            "UK Average": 19.6
        }
    };
    targetbarCarboncoop("energy-use-per-person", options);

    /* Figure 3: How does my home lose heat?
    // TODO: Show house graphic with heat loss for the four scenarios.
    */

    function heatlossData(scenario){
    	return {
		    floorwk: project[scenario].fabric.total_floor_WK,
		    ventilationwk: project[scenario].ventilation.average_WK,
		    windowswk: project[scenario].fabric.total_window_WK,
		    wallswk: project[scenario].fabric.total_wall_WK,
		    roofwk: project[scenario].fabric.total_roof_WK,
		    thermalbridgewk: project[scenario].fabric.thermal_bridging_heat_loss,
		    totalwk: project[scenario].fabric.total_floor_WK + project[scenario].ventilation.average_WK + project[scenario].fabric.total_window_WK + project[scenario].fabric.total_wall_WK + project[scenario].fabric.total_roof_WK + project[scenario].fabric.thermal_bridging_heat_loss	
    	}
    }

    $("body").on("click", ".js-house-heatloss-diagram-picker span", function(e){
		var scenario = $(this).data("scenario");
		console.log(scenario);
		$(".js-house-heatloss-diagrams-wrapper .centered-house").css({
			"display": "none"
		});
		$("div[data-scenario-diagram='"+scenario+"']").css("display", "block");
    });

    /* Master */
    heatlossDataMaster = heatlossData("master");
    // console.log(heatlossDataMaster);

    /* Scenario 1 */
	heatlossDataScenario1 = heatlossData("scenario1");

    if (printmode != true){
    	$("#house-heatloss-diagram-scenario1, #house-heatloss-diagram-scenario2, #house-heatloss-diagram-scenario3").css({
    		"display": "none"
    	});
    }


    /* Figure 4: Your home’s heat balance
    // Heat transfer per year by element. The gains and losses here need to balance.
    // Trystan is working on separating the data out so we can show it on a stacked bar chart.
    // TODO: Stacked bar charts don't appear to be working properly with negative values
    // data.annual_losses_kWh_m2 appears to be empty, so there are currently no negative stacks on this chart
    */

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
		defaultBarColor: 'rgb(231,37,57)',
		barColors: {
			'Internal': 'rgb(24,86,62)',
			'Solar': 'rgb(240,212,156)',
			'Space heating': 'rgb(236,102,79)',
			// 'Solid fuel': 'rgb(246,167,7)',
		},
		data: [
			{label: 'Your Home Now', value: [
				{value: project["master"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
				{value: project["master"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
				{value: project["master"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
			]},{label: 'Scenario 1', value: [
				{value: project["scenario1"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
				{value: project["scenario1"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
				{value: project["scenario1"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
			]},{label: 'Scenario 2', value: [
				{value: project["scenario2"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
				{value: project["scenario2"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
				{value: project["scenario2"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
			]},{label: 'Scenario 3', value: [
				{value: project["scenario3"].annual_useful_gains_kWh_m2["Internal"], label: 'Internal'},
				{value: project["scenario3"].annual_useful_gains_kWh_m2["Solar"], label: 'Solar'},
				{value: project["scenario3"].annual_useful_gains_kWh_m2["Space heating"], label: 'Space heating'},
			]},
		]
	});

	EnergyDemand.draw('heat-balance');


	/* Figure 5: Space Heating Demand
	// 
	*/

	var SpaceHeatingDemand = new BarChart({
		chartTitle: 'Carbon Dioxide Emissions',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		division: 15,
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
		],
		data: [
			{label: 'Your home now ', value: project["master"].fabric_energy_efficiency},
			{label: 'Your home now (small changes)', value: project["scenario1"].fabric_energy_efficiency},
			{label: 'Your home (moderate changes)', value: project["scenario2"].fabric_energy_efficiency},
			{label: 'Your 2050 home', value: project["scenario3"].fabric_energy_efficiency},
		]
	});

	SpaceHeatingDemand.draw('fig-5-space-heating-demand');

	/* Figure 6: Energy Demand
	//
	*/

	var EnergyDemand = new BarChart({
		chartTitle: 'Energy Demand',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
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
			{label: 'Your Home Now', value: [
				{value: project["master"].fuel_totals['gas'].quantity, label: 'Gas'},
				{value: project["master"].fuel_totals['electric'].quantity, label: 'Electric'},
				{value: project["master"].fuel_totals['wood'].quantity, label: 'Wood'},
			]},
			{label: 'Scenario 1', value: [
				{value: project["scenario1"].fuel_totals['gas'].quantity, label: 'Gas'},
				{value: project["scenario1"].fuel_totals['electric'].quantity, label: 'Electric'},
				{value: project["scenario1"].fuel_totals['wood'].quantity, label: 'Wood'},
			]},
			{label: 'Scenario 2', value: [
				{value: project["scenario2"].fuel_totals['gas'].quantity, label: 'Gas'},
				{value: project["scenario2"].fuel_totals['electric'].quantity, label: 'Electric'},
				{value: project["scenario2"].fuel_totals['wood'].quantity, label: 'Wood'},
			]},
			{label: 'Scenario 3', value: [
				{value: project["scenario3"].fuel_totals['gas'].quantity, label: 'Gas'},
				{value: project["scenario3"].fuel_totals['electric'].quantity, label: 'Electric'},
				{value: project["scenario3"].fuel_totals['wood'].quantity, label: 'Wood'},
			]},
		]
	});

	EnergyDemand.draw('energy-demand');

	/* Figure 7:
	//
	*/


	var primaryEneryUse = new BarChart({
		chartTitle: 'Primary Energy Use',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
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
			{label: 'Your Home Now', value: [
				{value: project["master"].energy_requirements['lighting'].quantity, label: 'Lighting'},
				{value: project["master"].energy_requirements['appliances'].quantity, label: 'Appliances'},
				{value: project["master"].energy_requirements['cooking'].quantity, label: 'Cooking'},
				{value: project["master"].energy_requirements['waterheating'].quantity, label: 'Water heating'},
				{value: project["master"].energy_requirements['space_heating'].quantity, label: 'Space heating'},
			]},
			{label: 'Scenario 1', value: [
				{value: project["scenario1"].energy_requirements['lighting'].quantity, label: 'Lighting'},
				{value: project["scenario1"].energy_requirements['appliances'].quantity, label: 'Appliances'},
				{value: project["scenario1"].energy_requirements['cooking'].quantity, label: 'Cooking'},
				{value: project["scenario1"].energy_requirements['waterheating'].quantity, label: 'Water heating'},
				{value: project["scenario1"].energy_requirements['space_heating'].quantity, label: 'Space heating'},
			]},
			{label: 'Scenario 2', value: [
				{value: project["scenario2"].energy_requirements['lighting'].quantity, label: 'Lighting'},
				{value: project["scenario2"].energy_requirements['appliances'].quantity, label: 'Appliances'},
				{value: project["scenario2"].energy_requirements['cooking'].quantity, label: 'Cooking'},
				{value: project["scenario2"].energy_requirements['waterheating'].quantity, label: 'Water heating'},
				{value: project["scenario2"].energy_requirements['space_heating'].quantity, label: 'Space heating'},
			]},
			{label: 'Scenario 3', value: [
				{value: project["scenario3"].energy_requirements['lighting'].quantity, label: 'Lighting'},
				{value: project["scenario3"].energy_requirements['appliances'].quantity, label: 'Appliances'},
				{value: project["scenario3"].energy_requirements['cooking'].quantity, label: 'Cooking'},
				{value: project["scenario3"].energy_requirements['waterheating'].quantity, label: 'Water heating'},
				{value: project["scenario3"].energy_requirements['space_heating'].quantity, label: 'Space heating'},
			]},
		]
	});

	primaryEneryUse.draw('primary-energy-use');


	/* Figure 8: Carbon dioxide emissions in kgCO2/m2.a
	//
	*/

	var CarbonDioxideEmissions = new BarChart({
		chartTitle: 'Carbon Dioxide Emissions',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		division: 15,
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
		data: [
			{label: 'UK Average', value: 100},
			{label: 'Your home now (model)', value: project["master"].kgco2perm2},
			{label: 'Your home now (bills)', value: project["master"].currentenergy.total_co2m2},
			{label: 'Your home (small changes)', value: project["scenario1"].kgco2perm2},
			{label: 'Your 2050 home', value: project["scenario3"].kgco2perm2},
		]
	});

	CarbonDioxideEmissions.draw('carbon-dioxide-emissions');


	/* Figure 9: Bar chart showing carbon dioxide emissions rate (kgCO2/person.a)
	//
	*/

	var CarbonDioxideEmissionsPerPerson = new BarChart({
		chartTitle: 'Carbon Dioxide Emissions Per Person',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		division: 1000,
		width: 1200,
		chartHeight: 600,
		barWidth: 110,
		barGutter: 60,
		defaultBarColor: 'rgb(157,213,203)',
		defaultVarianceColor: 'rgb(231,37,57)',
		// barColors: {
		// 	'Space heating': 'rgb(157,213,203)',
		// 	'Pumps, fans, etc.': 'rgb(24,86,62)',
		// 	'Cooking': 'rgb(40,153,139)',
		// },
		data: [
			// {label: 'UK Average', value: 50},
			{label: 'Your home now ', value:(project['master'].annualco2 / project["master"].occupancy)}, 
			{label: 'Your home (small changes)', value: (project['scenario1'].annualco2 / project["scenario1"].occupancy)},
			{label: 'Your home (medium changes)', value: (project['scenario2'].annualco2 / project['scenario2'].occupancy)},
			{label: 'Your 2050 home', value: (project['scenario3'].annualco2 / project['scenario3'].occupancy)},
		]
	});

	CarbonDioxideEmissionsPerPerson.draw('carbon-dioxide-emissions-per-person');


	/* Figure 10: Estimated Energy cost comparison 
	// Bar chart showing annual fuel cost. Waiting on Trystan for data
	*/

	var EstimatedEnergyCosts = new BarChart({
		chartTitle: 'Estimate Energy Costs (Net) Comparison',
		yAxisLabel: '£/year',
		fontSize: 22,
		chartLow: 0,
		division: 200,
		width: 1200,
		chartHeight: 600,
		barGutter: 120,
		defaultBarColor: 'rgb(231,37,57)',
		data: [
			{label: 'Your home now', value: project["master"].net_cost},
			{label: 'Your home (small changes)', value: project["scenario1"].net_cost},
			{label: 'Your home (medium changes)', value: project["scenario2"].net_cost},
			{label: 'Your 2050 home', value: project["scenario3"].net_cost},
		]
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
		} else {
			return "Higher";
		}
	}

	// time format is "11:30" or "15:00" etc
	function getTimeDifference(time1, time2){
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


	var sapNow = Math.round(project["master"]["SAP"]["rating"]);
	var sapAverage = 84;
	var sap2050 = Math.round(project["scenario3"]["SAP"]["rating"]);

	$("tr[data-sap-rating='"+calculateSapRatingFromScore(sapNow)+"'] .cell-sap-now").html(sapNow);
	$("tr[data-sap-rating='"+calculateSapRatingFromScore(sapAverage)+"'] .cell-sap-average").html(sapAverage);
	$("tr[data-sap-rating='"+calculateSapRatingFromScore(sap2050)+"'] .cell-sap-future").html(sap2050);


	/* Figure 13: Comfort Tables.
	// No JS needed currently
	*/

	/* Figure 14: Humidity Data
	// No JS needed currently
	*/

	/* Figure 15: Temperature Data
	// No JS needed currently
	*/

	/* Figure 16: You also told us...
	// No JS needed currently
	*/

	/* Code to get names of Scenarios for Section 2.1
	//
	*/

	$("#output-scenario1-name").html(project["scenario1"]["scenario_name"]);
	$("#output-scenario2-name").html(project["scenario2"]["scenario_name"]);
	$("#output-scenario3-name").html(project["scenario3"]["scenario_name"]);

	/* Figure 17: Scenario 1 Measures
	// Waiting on Trystan
	*/

	/* Figure 18: Scenario 2 Measures
	// Waiting on Trystan
	*/

	/* Figure 19: Scenario 3 Measures
	// Waiting on Trystan
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

}