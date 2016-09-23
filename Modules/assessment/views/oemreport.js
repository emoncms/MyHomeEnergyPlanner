function oemreport_initUI() {

    console.log(project);

    var graphdata = [
        [0,project[scenario].space_heating_demand_m2,""]
    ];
    graph.width = 300;
    graph.height = 500;
    //graph.ymax = 200;
    graph.ytick = 15;
    graph.yaxislabel = "Space Heating kWh/m2.year";
    graph.targets = [
        {name:"Passivhaus newbuild (15 kWh/m2.year)", target: 15},
        {name:"Passivhaus retrofit (25 kWh/m2.year)", target: 25}
    ];
    graph.draw("myhome01",[graphdata]);  
    
    
    var graphdata = [
        [0,project[scenario].primary_energy_use_m2,""]
    ];
    graph.width = 300;
    graph.height = 500;
    //graph.ymax = 200;
    graph.ytick = 20;
    graph.yaxislabel = "Primary Energy kWh/m2.year";
    graph.targets = [
        {name:"Primary Energy (120 kWh/m2.year)", target: 120}
    ];
    graph.draw("myhome02",[graphdata]);
    
    
    var graphdata = [
        [0,project[scenario].kgco2perm2,""]
    ];
    graph.width = 300;
    graph.height = 500;
    //graph.ymax = 200;
    graph.ytick = 20;
    graph.yaxislabel = "Carbon Emissions kgCO2/m2";
    graph.targets = [
        {name:"Carbon (17 kgCO2/m2)", target: 17}
    ];
    graph.draw("myhome03",[graphdata]);
    
    
    var graphdata = [
        [0,project[scenario].energy_use,""]
    ];
    graph.width = 300;
    graph.height = 500;
    //graph.ymax = 200;
    graph.ytick = 300;
    graph.yaxislabel = "Total Energy kWh";
    graph.targets = [
        {name:"2015 Average Energy Use 16800 kWh", target: 16800},
        {name:"Target Energy Use 5700 kWh", target: 5700}
    ];
    graph.draw("myhome04",[graphdata]);
    
    
    var graphdata = [
        [0,project[scenario].kwhdpp,""]
    ];
    graph.width = 300;
    graph.height = 500;
    //graph.ymax = 200;
    graph.ytick = 300;
    graph.yaxislabel = "Total Energy kWh/d per person";
    graph.targets = [
        {name:"Average 20 kWh/d/pp", target: 19.7},
        {name:"Target 6.8 kWh/d/pp", target: 6.8}
    ];
    graph.draw("myhome05",[graphdata]); 
}
