
function carboncoopreport_initUI() {



	console.log(project);

	// Fabric Energy Chart



	var FabricEnergy = new BarChart({
		chartTitle: 'Fabric Energy',
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
				low: 20,
				high: 50,
				color: 'rgb(254,204,204)'
			},
		],
		data: [
			{label: 'UK Average', value: 140},
			{label: '2000 B Regs Average', value: 56},
			{label: 'Your home now', value: 0},
			{label: 'Your 2050 home', value: 0},
			{label: '2016 B Regs Average', value: 45}
		]
	});

	FabricEnergy.draw('barchart-2');

	// Primary Energy Use Chart

	// var AnotherChart = new BarChart({
	// 	yAxisLabel: 'kWh/m2.year',
	// 	fontSize: 22,
	// 	chartLow: -129,
	// 	chartHigh: 619,
	// 	division: 80,
	// 	width: 1200,
	// 	chartHeight: 600,
	// 	barWidth: 110,
	// 	barGutter: 80,
	// 	defaultBarColor: 'rgb(231,37,57)',
	// 	barColors: {
	// 		'Space heating': 'rgb(65,168,198)',
	// 		'Pumps, fans, etc.': 'rgb(24,86,62)',
	// 		'Cooking': 'rgb(147,162,147)',
	// 		'Gas (total from bills)': 'rgb(236,102,79)',
	// 		'Solid fuel (total from bills)': 'rgb(246,167,7)',
	// 		'Total primary energy': 'rgb(241,138,157)',
	// 		'Water heating': 'rgb(82,41,57)',
	// 		'Lighting': 'rgb(10,175,154)'
	// 	},
	// 	targets: [
	// 		{
	// 			target: 0,
	// 			color: 'rgb(0,0,0)'
	// 		}
	// 	],
	// 	data: [
	// 		{label: 'UK Average', value: [
	// 				{value: 200, label: 'Gas (total from bills)'},
	// 				{value: 120, label: 'Space heating'},
	// 				{value: 65, label: 'Total primary energy'},
	// 				{value: 30, label: 'Solid fuel (total from bills)'}
	// 		]},
	// 		{label: '2000 B Regs Average', value: 60},
	// 		{label: 'Your home now', value: 180},
	// 		{label: 'UK Average', value: [
	// 				{value: -50, label: 'Gas (total from bills)'},
	// 				{value: 120, label: 'Space heating'},
	// 				{value: 65, label: 'Cooking'},
	// 				{value: 30, label: 'Solid fuel (total from bills)'}
	// 		]},
	// 		{label: '2016 B Regs Average', value: 40}
	// 	]
	// });

	var AnotherChart = new BarChart({
		chartTitle: 'Primary Energy Use',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartLow: -1,
		chartHigh: 439,
		division: 30,
		width: 1200,
		chartHeight: 600,
		barWidth: 110,
		barGutter: 60,
		defaultBarColor: 'rgb(231,37,57)',
		data: [
			{label: 'UK Average', value: 377},
			{label: 'Your home now (model)', value: 0},
			{label: 'Your home now (bills)', value: 0},
			{label: 'Your 2050 home (gross)', value: 0},
			{label: 'Your 2050 home (net)', value: 0},
			{label: 'Carbon Coop 2050 target', value: 124}
		]
	});

	AnotherChart.draw('barchart-3');

	// Carbon Dioxide Emissions Chart

	var YetAnotherChart = new BarChart({
		chartTitle: 'Carbon Dioxide Emissions',
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartLow: -1,
		chartHigh: 134,
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
			{label: 'Your home now (model)', value: 0},
			{label: 'Your home now (bills)', value: 0},
			{label: 'Your 2050 home', value: 0},
			{label: '2016 B Regs', value: 12},
			{label: 'Carbon Coop 2050 Target', value: 16}
		]
	});

	YetAnotherChart.draw('barchart-4');

}