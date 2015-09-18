
function carboncoopreport_initUI() {

	console.log(project);


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
			{label: 'Scenario 1', value: [
					{value: 200, label: 'Gains'},
					{value: 300, label: 'Losses'},
			]},
			{label: 'Scenario 2', value: [
					{value: 400, label: 'Gains'},
					{value: 100, label: 'Losses'},
			]},
			{label: 'Scenario 3', value: [
					{value: 500, label: 'Gains'},
					{value: 250, label: 'Losses'},
			]},
			{label: 'Scenario 4', value: [
					{value: 376, label: 'Gains'},
					{value: 287, label: 'Losses'},
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

	SpaceHeatingDemand.draw('space-heating-demand');


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
					{value: 2000, label: 'Gas'},
					{value: 600, label: 'Wood'},
					{value: 605, label: 'Solar'},
					{value: 300, label: 'Solid fuel'}
			]},
			{label: '2000 B Regs Average', value: 60},
			{label: 'Your home now', value: project[scenario].primary_energy_use_m2},
			{label: 'UK Average', value: [
					{value: 2000, label: 'Gas'},
					{value: 1200, label: 'Wood'},
					{value: 750, label: 'Solar'},
					{value: 300, label: 'Solid fuel'}
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
			{label: 'Your home now (model)', value: project[scenario].kgco2perm2},
			{label: 'Your home now (bills)', value: 0},
			{label: 'Your 2050 home', value: 0},
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
		barColors: {
			'Space heating': 'rgb(157,213,203)',
			'Pumps, fans, etc.': 'rgb(24,86,62)',
			'Cooking': 'rgb(40,153,139)',
		},
		targets: [
			{
				label: 65 / project[scenario].occupancy + 'kwH/m2.year',
				target: ( 65 / project[scenario].occupancy ),
				color: 'rgb(231,37,57)'
			},
			{
				label: 105 / project[scenario].occupancy + 'kwH/m2.year',
				target: ( 105 / project[scenario].occupancy ),
				color: 'rgb(231,37,57)'
			},
		],
		data: [
			{label: 'UK Average', value: 50},
			{label: 'Your home now (model)', value: (project[scenario].kgco2perm2 / project[scenario].occupancy)},
			{label: 'Your home now (bills)', value: 0},
			{label: 'Your 2050 home', value: 0},
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
			{label: 'UK Average', value: 1400},
			{label: '2000 B Regs Average', value: 1900},
			{label: 'Your home now', value: project[scenario].net_cost},
			{label: 'Your 2050 home', value: 0},
		]
	});

	EstimatedEnergyCosts.draw('estimated-energy-cost-comparison');

}