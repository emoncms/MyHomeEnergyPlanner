$("#openbem").on("click",'.add-element-from-lib', function() {
    var tag = $(this).attr("tags");
    var out = "";
    for (z in element_library){
        if (element_library[z].tags.indexOf(tag)!=-1) {
            out += "<tr class='librow add-element' lib='"+z+"' type='"+tag+"'>";
            out += "<td>"+z+"</td>";
            out += "<td>"+element_library[z].name+"</td>";
            out += "<td>"+element_library[z].source+"</td>";
            out += "<td>"+element_library[z].uvalue+" W/K.m2</td>";
            out += "<td>"+element_library[z].kvalue+" kJ/K.m2</td>";
            out += "</tr>";
        }
    }
    $("#element_library").html(out);
    $('#myModal').modal('show');
});

$("#openbem").on("click",'.add-element', function() {
    
    var lib = $(this).attr("lib");
    var type = $(this).attr("type").toLowerCase();
    
    // Create default element
    var element = {type:type,name:type,lib:lib,l:0,h:0,area:0,uvalue:0,kvalue:0,wk:0};
    
    // If library is defined replace defaults with parameters from library
    if (lib!=undefined) {
        for (z in element_library[lib]) element[z] = element_library[lib][z];
    }
    
    if (type=="window") {
        element.orientation = 3;
        element.overshading = 2;
    }
    
    data.fabric.elements.push(element);
    
    var newelementid = data.fabric.elements.length - 1;
    if (type=="wall") add_element("#elements",newelementid);
    if (type=="roof") add_element("#roofs",newelementid);
    if (type=="floor") add_element("#floors",newelementid);
    if (type=="window") add_window(newelementid);
    
    update();
    
    if (type!="window" && type!="floor") {
        for (z in data.fabric.elements) {
            if (data.fabric.elements[z].type=="window") {
                $("#windows [key='data.fabric.elements."+z+".subtractfrom']").append("<option value='"+newelementid+"'>"+data.fabric.elements[newelementid].name+"</option>");
            }
        }
    }
    
    $('#myModal').modal('hide');
});

$("#openbem").on("click",'.delete-element', function(){
    var row = $(this).attr('row');
    $(this).closest('tr').remove();
    data.fabric.elements.splice(row,1);
    elements_initUI();
    update();
});


$("#openbem").on("click",'.apply-measure-list', function() {
    var row = $(this).attr('row');
    var element = data.fabric.elements[row];
    
    var out = "";
    for (z in element_library){
        if (element_library[z].criteria.indexOf(element.lib)!=-1) {
            out += "<tr class='librow apply-measure' lib='"+z+"' row='"+row+"'>";
            out += "<td>"+z+"</td>";
            out += "<td>"+element_library[z].name+"</td>";
            out += "<td>"+element_library[z].source+"</td>";
            out += "<td>"+element_library[z].uvalue+" W/K.m2</td>";
            out += "<td>"+element_library[z].kvalue+" kJ/K.m2</td>";
            out += "</tr>";
        }
    }
    $("#measures_library").html(out);
    $('#myModal-measures').modal('show');
});

$("#openbem").on("click",'.apply-measure', function() {
    var lib = $(this).attr('lib');
    var row = $(this).attr('row');
    
    if (lib!=undefined) {
        for (z in element_library[lib]) data.fabric.elements[row][z] = element_library[lib][z];
        data.fabric.elements[row].lib = lib;
    }
    
    update();
    
    $('#myModal-measures').modal('hide');
});



function add_element(id,z)
{
    $(id).append($("#element-template").html());
    $(id+" [key='data.fabric.elements.template.type']").attr('key','data.fabric.elements.'+z+'.type');
    $(id+" [key='data.fabric.elements.template.name']").attr('key','data.fabric.elements.'+z+'.name');
    $(id+" [key='data.fabric.elements.template.lib']").attr('key','data.fabric.elements.'+z+'.lib');
    $(id+" [key='data.fabric.elements.template.l']").attr('key','data.fabric.elements.'+z+'.l');
    $(id+" [key='data.fabric.elements.template.h']").attr('key','data.fabric.elements.'+z+'.h');
    $(id+" [key='data.fabric.elements.template.area']").attr('key','data.fabric.elements.'+z+'.area');
    $(id+" [key='data.fabric.elements.template.windowarea']").attr('key','data.fabric.elements.'+z+'.windowarea');
    $(id+" [key='data.fabric.elements.template.netarea']").attr('key','data.fabric.elements.'+z+'.netarea');
    $(id+" [key='data.fabric.elements.template.uvalue']").attr('key','data.fabric.elements.'+z+'.uvalue');
    $(id+" [key='data.fabric.elements.template.kvalue']").attr('key','data.fabric.elements.'+z+'.kvalue');
    $(id+" [key='data.fabric.elements.template.wk']").attr('key','data.fabric.elements.'+z+'.wk');
    
    $(id+" [row='template']").attr('row',z);  
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
        if (data.fabric.elements[i].type!='window' && data.fabric.elements[i].type!='floor') subtractfromhtml += "<option value='"+i+"'>"+data.fabric.elements[i].name+"</option>";
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
            add_element("#elements",z);
        } else if (data.fabric.elements[z].type=='floor') {
            add_element("#floors",z);
        } else if (data.fabric.elements[z].type=='roof') {
            add_element("#roofs",z);
        } else if (data.fabric.elements[z].type=='window') {
            add_window(z);
        }
    }
}
