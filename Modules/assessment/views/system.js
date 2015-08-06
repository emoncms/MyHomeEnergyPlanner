$("#openbem").on("click",'.add-system', function(){
    var system = $(this).attr('system');
    var eid = $(this).attr('eid');
    data.energy_systems[eid].push({system: system, fraction:1.0});
    $("#modal-system-library").modal("hide");
    update();
});

$("#openbem").on("click",'.save-system', function(){

    var system = $(".edit-system-tag").val();
    data.systemlibrary[system] = {
        name: $(".edit-system-name").val(),
        efficiency: $(".edit-system-efficiency").val(),
        winter: $(".edit-system-winter").val(),
        summer: $(".edit-system-summer").val(),
        fuel: $(".edit-system-fuel").val(),
    
    };
    $("#modal-system-library").modal("hide");
    update();
});

$("#openbem").on("click",'.edit-system', function(){
    var system = $(this).attr('system');
    
    $(".edit-system-tag").val(system);
    $(".edit-system-name").val(data.systemlibrary[system].name);
    $(".edit-system-efficiency").val(data.systemlibrary[system].efficiency);
    $(".edit-system-winter").val(data.systemlibrary[system].winter);
    $(".edit-system-summer").val(data.systemlibrary[system].summer);
    $(".edit-system-fuel").val(data.systemlibrary[system].fuel);
    
    $("#modal-system-library-table-view").hide();
    $("#modal-system-library-editnew-view").show();
    
    $(".save-system").show();
});

$("#openbem").on("click",'.create-system', function(){
    console.log("create system");
    $(".edit-system-tag").val("");
    $(".edit-system-name").val("");
    $(".edit-system-efficiency").val("1.0");
    $(".edit-system-winter").val("1.0");
    $(".edit-system-summer").val("1.0");
    $(".edit-system-fuel").val("electric");
    
    $("#modal-system-library-table-view").hide();
    $("#modal-system-library-editnew-view").show();
    
    $(".save-system").show();
});
    
$("#openbem").on("click",'.modal-add-system', function(){
    var eid = $(this).attr('eid');
    
    var out = "";
    for (z in data.systemlibrary) {
        out += "<tr><td>"+data.systemlibrary[z].name+"<br>";
        out += "<span style='font-size:80%'>";
        out += "<b>Efficiency:</b> "+Math.round(data.systemlibrary[z].efficiency*100)+"%, ";
        out += "<b>Winter:</b> "+Math.round(data.systemlibrary[z].winter*100)+"%, ";
        out += "<b>Summer:</b> "+Math.round(data.systemlibrary[z].summer*100)+"%, ";
        out += "<b>Fuel:</b> "+data.systemlibrary[z].fuel;
        out += "</span></td>";
        
        out += "<td></td>";
        out += "<td style='text-align:right'>";
        out += "<button eid='"+eid+"' system='"+z+"' class='btn edit-system'>Edit</button>";
        out += "<button eid='"+eid+"' system='"+z+"' class='btn add-system'>Use</button>";
        out += "</td>";
        out += "</tr>";
    }
    $("#system-library-table").html(out);
    
    $("#modal-system-library-table-view").show();
    $("#modal-system-library-editnew-view").hide();
    $("#modal-system-library").modal("show");
    $(".save-system").hide();
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
});

function add_energy_system(z,x)
{
    $("#energyrequirements").append($("#suppliedby-template").html());
    var prefixA = "#energyrequirements [key='data.energy_systems.template.x";
    var prefixB = 'data.energy_systems.'+z+'.'+x;
    $(prefixA+".system']").attr('key',prefixB+'.system');
    $(prefixA+".name']").attr('key',prefixB+'.name');
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
    //var out = "";
    //for (z in datasets.energysystems) out += "<option value='"+z+"'>"+datasets.energysystems[z].name+"</option>";
    //$(".heating_system_selector").html(out);
}

