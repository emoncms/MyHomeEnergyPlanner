$("#openbem").on("click",'.add-system', function(){
    var z = $(this).attr('eid');
    data.energy_systems[z].push({system: "electric", fraction:1.0, efficiency:1.0});
    update();
});

$("#openbem").on("click",'.delete-system', function(){
    var sid = $(this).attr('sid');
    var eid = $(this).attr('eid');
    data.energy_systems[eid].splice(sid,1);
    update();
});

function system_UpdateUI()
{
    $("#energyrequirements").html("");
    for (z in data.energy_requirements)
    {
        $("#energyrequirements").append($("#energyrequirement-template").html());
        $("#energyrequirements [key='data.energy_requirements.template.name']").attr('key','data.energy_requirements.'+z+'.name');
        $("#energyrequirements [key='data.energy_requirements.template.quantity']").attr('key','data.energy_requirements.'+z+'.quantity');
        $("#energyrequirements [eid=template]").attr('eid',z);
        for (x in data.energy_systems[z]) add_energy_system(z,x);
    }

    $("#fuel_totals").html("");
    for (z in data.fuel_totals)
    {
        $("#fuel_totals").append($("#fuel_totals_template").html());
        $("#fuel_totals [key='data.fuel_totals.z.name']").attr('key','data.fuel_totals.'+z+'.name');
        $("#fuel_totals [key='data.fuel_totals.z.quantity']").attr('key','data.fuel_totals.'+z+'.quantity');
        $("#fuel_totals [key='data.fuel_totals.z.primaryenergy']").attr('key','data.fuel_totals.'+z+'.primaryenergy');
        $("#fuel_totals [key='data.fuel_totals.z.annualco2']").attr('key','data.fuel_totals.'+z+'.annualco2');
        
        $("#fuel_totals [key='data.fuel_totals.z.annualcost']").attr('key','data.fuel_totals.'+z+'.annualcost');
        $("#fuel_totals [key='data.fuels.f.standingcharge']").attr('key','data.fuels.'+z+'.standingcharge');
        
        $("#fuel_totals [key='data.fuels.f.fuelcost']").attr('key','data.fuels.'+z+'.fuelcost');
        $("#fuel_totals [key='data.fuels.f.primaryenergyfactor']").attr('key','data.fuels.'+z+'.primaryenergyfactor');
        $("#fuel_totals [key='data.fuels.f.co2factor']").attr('key','data.fuels.'+z+'.co2factor');
    }
}

// Automatically load efficiency for heating system when heating system is changed
$("#openbem").on("change",'.heating_system_selector', function(){
    var system = $(this).val();
    var x = $(this).attr("x");
    var z = $(this).attr("z");
    data.energy_systems[z][x].efficiency = datasets.energysystems[system].efficiency;
});

function add_energy_system(z,x)
{
    $("#energyrequirements").append($("#suppliedby-template").html());
    var prefixA = "#energyrequirements [key='data.energy_systems.template.x";
    var prefixB = 'data.energy_systems.'+z+'.'+x;
    $(prefixA+".system']").attr('key',prefixB+'.system');
    $(prefixA+".description']").attr('key',prefixB+'.description');
    $(prefixA+".fraction']").attr('key',prefixB+'.fraction');
    $(prefixA+".demand']").attr('key',prefixB+'.demand');
    $(prefixA+".efficiency']").attr('key',prefixB+'.efficiency');
    $(prefixA+".fuelinput']").attr('key',prefixB+'.fuelinput');
    
    $("#energyrequirements [eid='eid']").attr('eid',z); 
    $("#energyrequirements [sid='sid']").attr('sid',x); 
    
    $("#energyrequirements [z='tmp']").attr('z',z);
    $("#energyrequirements [x='tmp']").attr('x',x);
}

function system_initUI()
{
    var out = "";
    for (z in datasets.energysystems) out += "<option value='"+z+"'>"+datasets.energysystems[z].name+"</option>";
    $(".heating_system_selector").html(out);
}

