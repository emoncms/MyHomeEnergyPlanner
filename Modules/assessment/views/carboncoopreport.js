
function carboncoopreport_initUI() {

	console.log(project);

	$(".home-image").attr("src", project[scenario].household.houseimage);




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




    /* Figure 4: Your home’s heat balance
    // Heat transfer per year by element. The gains and losses here need to balance.
    // Trystan is working on separating the data out so we can show it on a stacked bar chart.
    // TODO: Stacked bar charts don't appear to be working properly with negative values
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
		defaultBarColor: 'rgb(231,37,57)',
		barColors: {
			'Wood': 'rgb(24,86,62)',
			'Solar': 'rgb(240,212,156)',
			'Gas': 'rgb(236,102,79)',
			'Solid fuel': 'rgb(246,167,7)',
		},
		data: [
			{label: 'UK Average', value: [
					{value: -200, variance: 5, label: 'Gas'},
					{value: -400, label: 'Wood'},
					{value: 300, label: 'Solar'},
					{value: 300, variance: 10, label: 'Solid fuel'}
			]},
			{label: '2000 B Regs Average', variance: 30, value: 60},
			// {label: 'Your home now', variance: 30, value: project[scenario].primary_energy_use_m2},
			{label: 'Your home now', variance: 30, value: 100},
			{label: 'UK Average', value: [
					{value: -100, variance: 5, label: 'Gas'},
					{value: -100, variance: 5, label: 'Wood'},
					{value: 150, variance: 5, label: 'Solar'},
					{value: 50, variance: 5, label: 'Solid fuel'}
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

	/* Figure 6: TODO Trystan working on data for stacks
	//
	*/

	/* Figure 7: TODO Trystan working on data for stacks
	//
	*/

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

	/* Figure 11: Your home compared with the average home.
	// Main SAP assumptions  vs actual condition comparison - table stating 'higher' or 'lower'.
	// Would be useful to have total hours of heating (currently only given times heating is on - see question 3a)
	// Where is data for number of rooms not heated? Appliance Q?

	*/

	/* Figure 12: TODO
	//
	*/

	/* Figure 13: Comfort Tables
	//
	*/


	// Energy Demand

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
			'Wood': 'rgb(24,86,62)',
			'Solar': 'rgb(240,212,156)',
			'Gas': 'rgb(236,102,79)',
			'Solid fuel': 'rgb(246,167,7)',
		},
		data: [
			{label: 'UK Average', value: [
					{value: 2000, variance: 5, label: 'Gas'},
					{value: -600, label: 'Wood'},
					{value: 605, label: 'Solar'},
					{value: 300, variance: 10, label: 'Solid fuel'}
			]},
			{label: '2000 B Regs Average', variance: 30, value: 60},
			{label: 'Your home now', variance: 30, value: project[scenario].primary_energy_use_m2},
			{label: 'UK Average', value: [
					{value: 2000, variance: 5, label: 'Gas'},
					{value: 1200, variance: 5, label: 'Wood'},
					{value: 750, variance: 5, label: 'Solar'},
					{value: 300, variance: 5, label: 'Solid fuel'}
			]},
		]
	});

	EnergyDemand.draw('energy-demand');







	// Estimate Energy Costs Comparison 

	var EstimatedEnergyCosts = new BarChart({
		chartTitle: 'Estimate Energy Costs Comparison',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartLow: 0,
		division: 200,
		width: 1200,
		chartHeight: 600,
		barGutter: 120,
		defaultBarColor: 'rgb(231,37,57)',
		ranges: [
			{
				low: 600,
				high: 1000,
				color: 'rgb(254,204,204)'
			},
		],
		data: [
			{label: 'UK Average', value: 1400, variance: 30},
			{label: '2000 B Regs Average', value: 1900, variance: 30},
			{label: 'Your home now', value: project[scenario].net_cost, variance: 30},
			{label: 'Your 2050 home', value: 0, variance: 30},
		]
	});

	// uncommenting this breaks top graphi
	// EstimatedEnergyCosts.draw('estimated-energy-cost-comparison');


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