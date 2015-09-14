
function carboncoopreport_initUI() {



	console.log(project);




	var chart = new BarChart({
		chartTitle: 'Primary Energy Use',
		yAxisLabel: 'kWh/m2.year',
		font: 'Karla',
		fontSize: 28,
		chartLow: -100,
		chartHigh: 400,
		division: 100,
		width: 1200,
		chartHeight: 400,
		barWidth: 140,
		barGutter: 40,
		defaultBarColor: 'rgb(30,160,30)',
		ranges: [
			{
				low: 50,
				high: 150,
				color: 'rgb(254,204,204)'
			}
		],
		barColors: {
			'Space heating': 'rgb(65,168,198)',
			'Pumps, fans, etc.': 'rgb(24,86,62)',
			'Cooking': 'rgb(147,162,147)',
			'Gas (total from bills)': 'rgb(236,102,79)',
			'Solid fuel (total from bills)': 'rgb(246,167,7)',
			'Total primary energy': 'rgb(241,138,157)',
			'Water heating': 'rgb(82,41,57)',
			'Lighting': 'rgb(10,175,154)'
		},
		data: [
			{
				label: 'UK Average',
				value: [
					{value: 50, label: 'Gas (total from bills)'},
					{value: 80, label: 'Space heating'}
				]
			},
			{
				label: 'Label 1',
				value: [
					{value: 200, label: 'Gas (total from bills)'},
					{value: 120, label: 'Space heating'},
					{value: 65, label: 'Total primary energy'},
					{value: 30, label: 'Solid fuel (total from bills)'}
				]
			},
			{label: 'Your home now (model)', value: -80},
			{label: 'Carbon Coop 2050 target', value: 125}
		]
	});

	chart.draw('barchart');

	var otherchart = new BarChart({
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartLow: -1,
		chartHigh: 219,
		division: 20,
		width: 1200,
		chartHeight: 500,
		barWidth: 110,
		barGutter: 80,
		defaultBarColor: 'rgb(231,37,57)',
		ranges: [
			{
				low: 60,
				high: 100,
				color: 'rgb(254,204,204)'
			},
		],
		data: [
			{label: 'UK Average', value: 140},
			{label: '2000 B Regs Average', value: 60},
			{label: 'Your home now', value: 180},
			{label: 'Your 2050 home', value: 42},
			{label: '2016 B Regs Average', value: 40}
		]
	});

	otherchart.draw('barchart-2');


	var AnotherChart = new BarChart({
		yAxisLabel: 'kWh/m2.year',
		fontSize: 22,
		chartLow: -129,
		chartHigh: 619,
		division: 80,
		width: 1200,
		chartHeight: 600,
		barWidth: 110,
		barGutter: 80,
		defaultBarColor: 'rgb(231,37,57)',
		barColors: {
			'Space heating': 'rgb(65,168,198)',
			'Pumps, fans, etc.': 'rgb(24,86,62)',
			'Cooking': 'rgb(147,162,147)',
			'Gas (total from bills)': 'rgb(236,102,79)',
			'Solid fuel (total from bills)': 'rgb(246,167,7)',
			'Total primary energy': 'rgb(241,138,157)',
			'Water heating': 'rgb(82,41,57)',
			'Lighting': 'rgb(10,175,154)'
		},
		data: [
			{label: 'UK Average', value: [
					{value: 200, label: 'Gas (total from bills)'},
					{value: 120, label: 'Space heating'},
					{value: 65, label: 'Total primary energy'},
					{value: 30, label: 'Solid fuel (total from bills)'}
			]},
			{label: '2000 B Regs Average', value: 60},
			{label: 'Your home now', value: 180},
			{label: 'UK Average', value: [
					{value: -50, label: 'Gas (total from bills)'},
					{value: 120, label: 'Space heating'},
					{value: 65, label: 'Cooking'},
					{value: 30, label: 'Solid fuel (total from bills)'}
			]},
			{label: '2016 B Regs Average', value: 40}
		]
	});

	AnotherChart.draw('barchart-3');

}