
function carboncoopreport_initUI() {

	console.log(project[scenario].floors);

	$(".home-image").attr("src", project[scenario].household.houseimage);


	// Heat Balance Example

	var HeatBalance = new BarChart({
		chartTitle: 'Energy Demand',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		width: 1200,
		chartHeight: 600,
		barWidth: 110,
		division: 'auto',
		barGutter: 120,
		barDivisionType: 'group',
		defaultBarColor: 'rgb(231,37,57)',
		barColors: {
			'Gains': 'rgb(230,39,58)',
			'Losses': 'rgb(64,169,199)',
		},
		data: [
			{label: project[scenario].floors[0].name, value: [
					{value: 200, label: "Gains"},
					{value: 200, label: "Losses"},
			]},
			{label: project[scenario].floors[1].name, value: [
					{value: 150, label: 'Gains'},
					{value: 150, label: 'Losses'},
			]},
			{label: project[scenario].floors[2].name, value: [
					{value: 100, label: 'Gains'},
					{value: 100, label: 'Losses'},
			]},
			{label: 'Scenario 4', value: [
					{value: 50, label: 'Gains'},
					{value: 50, variance: 30, label: 'Losses'},
			]},
		]
	});

	HeatBalance.draw('heat-balance');

	// Space Heating Demand

	var SpaceHeatingDemand = new BarChart({
		chartTitle: 'Space Heating Demand',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartLow: -1,
		chartHigh: 169,
		division: 10,
		width: 1200,
		chartHeight: 600,
		barWidth: 110,
		barGutter: 80,
		defaultBarColor: 'rgb(231,37,57)',
		ranges: [
			{
				low: 30,
				high: 70,
				color: 'rgb(254,204,204)'
			},
		],
		data: [
			{label: 'UK Average', value: 140},
			{label: '2000 B Regs Average', value: 56},
			{label: 'Your home now', value: 0},
			{label: 'Your 2050 home', value: 0},
		]
	});

	// uncommenting this breaks top graphic
	// SpaceHeatingDemand.draw('space-heating-demand');


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
					{value: 600, label: 'Wood'},
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


	// Carbon Dioxide Emissions Chart


	var CarbonDioxideEmissions = new BarChart({
		chartTitle: 'Carbon Dioxide Emissions',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartHigh: 120,
		division: 15,
		width: 1200,
		chartHeight: 600,
		barWidth: 110,
		barGutter: 120,
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


	// Carbon Dioxide Emissions Chart Per Person

	var CarbonDioxideEmissionsPerPerson = new BarChart({
		chartTitle: 'Carbon Dioxide Emissions Per Person',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartHigh: 120,
		division: 15,
		width: 1200,
		chartHeight: 600,
		barWidth: 110,
		barGutter: 120,
		defaultBarColor: 'rgb(157,213,203)',
		defaultVarianceColor: 'rgb(231,37,57)',
		barColors: {
			'Space heating': 'rgb(157,213,203)',
			'Pumps, fans, etc.': 'rgb(24,86,62)',
			'Cooking': 'rgb(40,153,139)',
		},
		data: [
			{label: 'UK Average', value: 50},
			{label: 'Your home now (model)', value: (project['master'].annualco2 / project[scenario].occupancy)}, 
			{label: 'Your home now (bills)', value: (project['master'].annualco2 / project[scenario].occupancy)},
			{label: 'Your home (small changes)', value: (project['scenario1'].annualco2 / project[scenario].occupancy)},
			{label: 'Your 2050 home', value: (project['scenario3'].annualco2 / project[scenario].occupancy)},
		]
	});

	CarbonDioxideEmissionsPerPerson.draw('carbon-dioxide-emissions-per-person');


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

	// $("#space-heating-demand").css({
	// 	"background": "white",
	// 	"width": "100%"
	// });
	// var height = 60;
	// var width = 1000;
	// var spaceHeatingDemandMax = 1000;
	// var spaceHeatingDemand = 400;
	// var spaceHeatingDemandRetrofit = 100;
	// var spaceHeatingDemandUKAverage = 800;

	// // map the raw values to values usable on the graph
	// spaceHeatingDemand = width * (spaceHeatingDemand / spaceHeatingDemandMax);
	// spaceHeatingDemandRetrofit = width * (spaceHeatingDemandRetrofit / spaceHeatingDemandMax);
	// spaceHeatingDemandUKAverage = width * (spaceHeatingDemandUKAverage / spaceHeatingDemandMax);

	// var ctx = document.getElementById("space-heating-demand").getContext("2d");
	// ctx.fillStyle = 'rgb(217, 58, 71)';
	// ctx.fillRect(0,0,spaceHeatingDemand, height);

	// ctx.setLineDash([2,2]);
	// ctx.strokeStyle = 'white';
	// ctx.beginPath();
	// ctx.moveTo(spaceHeatingDemandRetrofit, 0);
	// ctx.lineTo(spaceHeatingDemandRetrofit, height);
	// ctx.stroke();

	// ctx.strokeStyle = 'black';
	// ctx.beginPath();
	// ctx.moveTo(spaceHeatingDemandUKAverage, 0);
	// ctx.lineTo(spaceHeatingDemandUKAverage, height);
	// ctx.stroke();

	 var options = {
        name: "Space heating demand",
        value: Math.round(data.fabric_energy_efficiency),
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
        units: "kWh/day",
        targets: {
            "70% heating saving": 8.6,
            "UK Average": 19.6
        }
    };
    targetbarCarboncoop("energy-use-per-person", options);





    // Figure 5
	 var options = {
        name: "Space heating demand Master",
        value: Math.round(project["master"].fabric_energy_efficiency),
        units: "kWh/m2",
        targets: {
            //"Passivhaus": 15,
            "Passivhaus retrofit": 25,
            "UK Average": 145
        }
    };
    targetbarCarboncoop("space-heating-demand-1", options);

    	 var options = {
        name: "Space heating demand Master",
        value: Math.round(project["scenario1"].fabric_energy_efficiency),
        units: "kWh/m2",
        targets: {
            //"Passivhaus": 15,
            "Passivhaus retrofit": 25,
            "UK Average": 145
        }
    };
    targetbarCarboncoop("space-heating-demand-2", options);

    	 var options = {
        name: "Space heating demand Master",
        value: Math.round(project["scenario2"].fabric_energy_efficiency),
        units: "kWh/m2",
        targets: {
            //"Passivhaus": 15,
            "Passivhaus retrofit": 25,
            "UK Average": 145
        }
    };
    targetbarCarboncoop("space-heating-demand-3", options);

    	 var options = {
        name: "Space heating demand Master",
        value: Math.round(project["scenario3"].fabric_energy_efficiency),
        units: "kWh/m2",
        targets: {
            //"Passivhaus": 15,
            "Passivhaus retrofit": 25,
            "UK Average": 145
        }
    };
    targetbarCarboncoop("space-heating-demand-4", options);

}