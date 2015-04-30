$("#openbem").on("click",'#add-element', function() {
    data.fabric.elements.push({type:'wall', name: 'Element', l:0, h:0, area: 0, uvalue: 0, wk: 0});
    var newelementid = data.fabric.elements.length - 1;
    add_element(newelementid);
    update();
    
    
    for (z in data.fabric.elements)
    {
        if (data.fabric.elements[z].type=="window")
        {
            $("#windows [key='data.fabric.elements."+z+".subtractfrom']").append("<option value='"+newelementid+"'>"+data.fabric.elements[newelementid].name+"</option>");
        }
    }
});

$("#openbem").on("click",'#add-roof', function() {
    data.fabric.elements.push({type:'roof', name: 'Element', l:0, h:0, area: 0, uvalue: 0, wk: 0});
    var newelementid = data.fabric.elements.length - 1;
    add_roof(newelementid);
    update();
    
    
    for (z in data.fabric.elements)
    {
        if (data.fabric.elements[z].type=="window")
        {
            $("#windows [key='data.fabric.elements."+z+".subtractfrom']").append("<option value='"+newelementid+"'>"+data.fabric.elements[newelementid].name+"</option>");
        }
    }
});

$("#openbem").on("click",'#add-floor', function() {
    data.fabric.elements.push({type:'floor', name: 'Element', l:0, h:0, area: 0, uvalue: 0, wk: 0});
    var newelementid = data.fabric.elements.length - 1;
    add_floor(newelementid);
    update();
    
    
    for (z in data.fabric.elements)
    {
        if (data.fabric.elements[z].type=="window")
        {
            $("#windows [key='data.fabric.elements."+z+".subtractfrom']").append("<option value='"+newelementid+"'>"+data.fabric.elements[newelementid].name+"</option>");
        }
    }
});

$("#openbem").on("click",'#add-window', function(){
    var size = Object.size(data.fabric.elements)+1;
    var name = "Window";
    data.fabric.elements.push({
        type:'window', 
        name: name,
        description: "",
        l:0,
        h:0,
        area: 0,
        uvalue: 0,
        wk: 0,
        orientation: 3,
        overshading: 2,
        g: 0.76,
        gL: 0.8,
        ff: 0.7
    });
    add_window(size-1);
    update();
});

$("#openbem").on("click",'.delete-element', function(){
    var row = $(this).attr('row');
    $(this).closest('tr').remove();
    data.fabric.elements.splice(row,1);
    elements_initUI();
    update();
});

$("#openbem").on("click",'.delete-floor', function(){
    var row = $(this).attr('row');
    $(this).closest('tr').remove();
    data.fabric.elements.splice(row,1);
    elements_initUI();
    update();
});

$("#openbem").on("click",'.delete-roof', function(){
    var row = $(this).attr('row');
    $(this).closest('tr').remove();
    data.fabric.elements.splice(row,1);
    elements_initUI();
    update();
});

function add_element(z)
{
    $("#elements").append($("#element-template").html());
    $("#elements [key='data.fabric.elements.template.type']").attr('key','data.fabric.elements.'+z+'.type');
    $("#elements [key='data.fabric.elements.template.name']").attr('key','data.fabric.elements.'+z+'.name');
    $("#elements [key='data.fabric.elements.template.l']").attr('key','data.fabric.elements.'+z+'.l');
    $("#elements [key='data.fabric.elements.template.h']").attr('key','data.fabric.elements.'+z+'.h');
    $("#elements [key='data.fabric.elements.template.area']").attr('key','data.fabric.elements.'+z+'.area');
    $("#elements [key='data.fabric.elements.template.windowarea']").attr('key','data.fabric.elements.'+z+'.windowarea');
    $("#elements [key='data.fabric.elements.template.netarea']").attr('key','data.fabric.elements.'+z+'.netarea');
    $("#elements [key='data.fabric.elements.template.uvalue']").attr('key','data.fabric.elements.'+z+'.uvalue');
    $("#elements [key='data.fabric.elements.template.kvalue']").attr('key','data.fabric.elements.'+z+'.kvalue');
    $("#elements [key='data.fabric.elements.template.wk']").attr('key','data.fabric.elements.'+z+'.wk');
    
    $("#elements [row='template']").attr('row',z);  
}

function add_floor(z)
{
    $("#floors").append($("#floor-template").html());
    $("#floors [key='data.fabric.elements.template.type']").attr('key','data.fabric.elements.'+z+'.type');
    $("#floors [key='data.fabric.elements.template.name']").attr('key','data.fabric.elements.'+z+'.name');
    $("#floors [key='data.fabric.elements.template.l']").attr('key','data.fabric.elements.'+z+'.l');
    $("#floors [key='data.fabric.elements.template.h']").attr('key','data.fabric.elements.'+z+'.h');
    $("#floors [key='data.fabric.elements.template.area']").attr('key','data.fabric.elements.'+z+'.area');
    $("#floors [key='data.fabric.elements.template.windowarea']").attr('key','data.fabric.elements.'+z+'.windowarea');
    $("#floors [key='data.fabric.elements.template.netarea']").attr('key','data.fabric.elements.'+z+'.netarea');
    $("#floors [key='data.fabric.elements.template.uvalue']").attr('key','data.fabric.elements.'+z+'.uvalue');
    $("#floors [key='data.fabric.elements.template.kvalue']").attr('key','data.fabric.elements.'+z+'.kvalue');
    $("#floors [key='data.fabric.elements.template.wk']").attr('key','data.fabric.elements.'+z+'.wk');
    
    $("#floors [row='template']").attr('row',z);  
}

function add_roof(z)
{
    $("#roofs").append($("#roof-template").html());
    $("#roofs [key='data.fabric.elements.template.type']").attr('key','data.fabric.elements.'+z+'.type');
    $("#roofs [key='data.fabric.elements.template.name']").attr('key','data.fabric.elements.'+z+'.name');
    $("#roofs [key='data.fabric.elements.template.l']").attr('key','data.fabric.elements.'+z+'.l');
    $("#roofs [key='data.fabric.elements.template.h']").attr('key','data.fabric.elements.'+z+'.h');
    $("#roofs [key='data.fabric.elements.template.area']").attr('key','data.fabric.elements.'+z+'.area');
    $("#roofs [key='data.fabric.elements.template.windowarea']").attr('key','data.fabric.elements.'+z+'.windowarea');
    $("#roofs [key='data.fabric.elements.template.netarea']").attr('key','data.fabric.elements.'+z+'.netarea');
    $("#roofs [key='data.fabric.elements.template.uvalue']").attr('key','data.fabric.elements.'+z+'.uvalue');
    $("#roofs [key='data.fabric.elements.template.kvalue']").attr('key','data.fabric.elements.'+z+'.kvalue');
    $("#roofs [key='data.fabric.elements.template.wk']").attr('key','data.fabric.elements.'+z+'.wk');
    
    $("#roofs [row='template']").attr('row',z);  
}

function add_window(z)
{
    $("#windows").append($("#window-template").html());
    $("#windows [key='data.fabric.elements.template.name']").attr('key','data.fabric.elements.'+z+'.name');
    $("#windows [key='data.fabric.elements.template.description']").attr('key','data.fabric.elements.'+z+'.description');
    $("#windows [key='data.fabric.elements.template.subtractfrom']").attr('key','data.fabric.elements.'+z+'.subtractfrom');
    $("#windows [key='data.fabric.elements.template.l']").attr('key','data.fabric.elements.'+z+'.l');
    $("#windows [key='data.fabric.elements.template.h']").attr('key','data.fabric.elements.'+z+'.h');
    $("#windows [key='data.fabric.elements.template.area']").attr('key','data.fabric.elements.'+z+'.area');
    $("#windows [key='data.fabric.elements.template.uvalue']").attr('key','data.fabric.elements.'+z+'.uvalue');
    
    $("#windows [key='data.fabric.elements.template.orientation']").attr('key','data.fabric.elements.'+z+'.orientation');
    $("#windows [key='data.fabric.elements.template.overshading']").attr('key','data.fabric.elements.'+z+'.overshading');
    
    $("#windows [key='data.fabric.elements.template.g']").attr('key','data.fabric.elements.'+z+'.g');
    $("#windows [key='data.fabric.elements.template.gL']").attr('key','data.fabric.elements.'+z+'.gL');
    $("#windows [key='data.fabric.elements.template.ff']").attr('key','data.fabric.elements.'+z+'.ff');
    $("#windows [key='data.fabric.elements.template.wk']").attr('key','data.fabric.elements.'+z+'.wk');
    $("#windows [key='data.fabric.elements.template.gain']").attr('key','data.fabric.elements.'+z+'.gain');
    
    $("#windows [row='template']").attr('row',z);
    
    var subtractfromhtml = "<option value='no' ></option>";
    for (i in data.fabric.elements) {
        if (data.fabric.elements[i].type!='window') subtractfromhtml += "<option value='"+i+"'>"+data.fabric.elements[i].name+"</option>";
    }
    $("#windows [key='data.fabric.elements."+z+".subtractfrom']").html(subtractfromhtml);
}

function elements_initUI()
{
    $("#elements").html("");
    $("#roofs").html("");
    $("#floors").html("");
    $("#windows").html("");
    // Initial addition of floors
    for (z in data.fabric.elements) {
        if (data.fabric.elements[z].type=='wall') {
            add_element(z);
        } else if (data.fabric.elements[z].type=='floor') {
            add_floor(z);
        } else if (data.fabric.elements[z].type=='roof') {
            add_roof(z);
        } else if (data.fabric.elements[z].type=='window') {
            add_window(z);
        }
    }
}
