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

$("#create-element").click(function() {
    //
    $("#myModalcreateelement").modal('show');
    $('#myModal').modal('hide');
});

$("#create-element-type").change(function(){
   var type = $(this).val();
   if (type == "Window") {
       $(".create-element-window-options").show();
   } else {
       $(".create-element-window-options").hide();
   }
});

$("#create-element-save").click(function() {

    var type = $("#create-element-type").val();
    var tag = $("#create-element-tag").val();
    
    //if (element_library[tag]==undefined) {
        element_library[tag] = {};
        
        element_library[tag].name = $("#create-element-name").val();
        element_library[tag].source = $("#create-element-source").val();
        element_library[tag].uvalue = $("#create-element-uvalue").val();
        element_library[tag].kvalue = $("#create-element-kvalue").val();
        
        if (type=="Window") element_library[tag].g = $("#create-element-g").val();
        if (type=="Window") element_library[tag].gL = $("#create-element-gL").val();
        if (type=="Window") element_library[tag].ff = $("#create-element-ff").val();
        
        element_library[tag].tags = [type],
        element_library[tag].criteria = $("#create-element-criteria").val().split(",");
        
        $.ajax({type: "POST", url: path+"assessment/savelibrary.json", data:"id="+selected_library+"&data="+JSON.stringify(element_library), success: function(result){
            console.log("save library result: "+result);
        }});
        
        $("#myModalcreateelement").modal('hide');
    //} else {
    //    alert("Element or measure already exists");
    //}
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
    
    loadlibrarylist(function(){
        loadlibrary(selected_library,function(){});
    });
}

//-----------------------------------------------------------------------------------------------
// Element library
//-----------------------------------------------------------------------------------------------

function loadlibrarylist(callback) {
    var mylibraries = [];
    
    $.ajax({ url: path+"assessment/listlibrary.json", datatype:"json", success: function(result){
        mylibraries = result;
        
        var standardlibcreated = false;
        for (z in mylibraries) {
            if (mylibraries[z].name=="StandardLibrary") standardlibcreated = true;
        }
        
        if (!standardlibcreated) 
        {
            $.ajax({ url: path+"assessment/newlibrary.json", data: "name=StandardLibrary", datatype:"json", async:false, success: function(result){
                selected_library = result;
                element_library = standard_element_library;
                mylibraries[0] = {id:selected_library, name:"StandardLibrary"};
                $.ajax({type: "POST", url: path+"assessment/savelibrary.json", data:"id="+selected_library+"&data="+JSON.stringify(element_library), success: function(result){
                    console.log("save library result: "+result);
                }});
            }});
        }
        
        selected_library = mylibraries[0].id;
        
        var out = "";
        for (z in mylibraries) {
            out += "<option value="+mylibraries[z].id+">"+mylibraries[z].name+"</option>";
        }
        
        out += "<option value=-1 class='newlibraryoption' style='background-color:#eee'>Create new</option>";
        $("#library-select").html(out);
        $("#library-select").val(selected_library);
        
        callback();
    }});
}

function loadlibrary(id,callback) {
    element_library = {};
    // selected_library = id
    // try loading the library from the database
    $.ajax({ url: path+"assessment/loadlibrary.json", data: "id="+id, datatype:"json", success: function(result){
        element_library = result;
        // check if library is empty
        var num = 0; for (z in element_library) num++;
        // if empty load standard library
        // if (num==0) element_library = standard_element_library;
        callback();
    }});
}

$("#openbem").on("click",'.add-element-from-lib', function() {
    var tag = $(this).attr("tags");
    draw_library(tag);
});

function draw_library(tag)
{
    var out = "";
    for (z in element_library){
        if (element_library[z].tags.indexOf(tag)!=-1) {
            out += "<tr class='librow' lib='"+z+"' type='"+tag+"'>";
            out += "<td>"+z+"</td>";
            
            out += "<td>"+element_library[z].name;
            out += "<br><span style='font-size:13px'><b>Source:</b> "+element_library[z].source+"</span>";
            if (element_library[z].criteria.length) 
                out += "<br><span style='font-size:13px'><b>Measure criteria:</b> "+element_library[z].criteria.join(", ")+"</span>";
            out += "</td>";
            
            out += "<td style='width:200px; font-size:13px'>";
                out += "<b>U-value:</b> "+element_library[z].uvalue+" W/K.m2";
                out += "<br><b>k-value:</b> "+element_library[z].kvalue+" kJ/K.m2";
                if (element_library[z].tags[0]=="Window") {
                    out += "<br><b>g:</b> "+element_library[z].g+", ";
                    out += "<b>gL:</b> "+element_library[z].gL+", ";
                    out += "<b>ff:</b> "+element_library[z].ff;
                }
            out += "</td>";
            
            out += "<td style='width:120px' >";
                out += "<i style='cursor:pointer' class='icon-pencil edit-element' lib='"+z+"' type='"+tag+"'></i>";
                // out += "<i class='icon-trash' style='margin-left:20px'></i>";
                out += "<button class='add-element btn' style='margin-left:20px' lib='"+z+"' type='"+tag+"'>use</button</i>";
            out += "</td>";
            out += "</tr>";
        }
    }
    $("#element_library").html(out);
    $('#myModal').modal('show');

}

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
            // out += "<td>"+element_library[z].criteria.join(",")+"</td>";
            out += "</tr>";
        }
    }
    $("#element_library").html(out);
    $('#myModal').modal('show');
});

$("#openbem").on("click",'.apply-measure', function() {
    var lib = $(this).attr('lib');
    var row = $(this).attr('row');
    
    if (lib!=undefined) {
        for (z in element_library[lib]) data.fabric.elements[row][z] = element_library[lib][z];
        data.fabric.elements[row].lib = lib;
    }
    
    update();
    $('#myModal').modal('hide');
});

$("#openbem").on("click",".edit-element",function() {
    var lib = $(this).attr('lib');
    var type = element_library[lib].tags[0];
    
    $("#create-element-tag").val(lib);
    $("#create-element-name").val(element_library[lib].name);
    $("#create-element-source").val(element_library[lib].source);
    $("#create-element-uvalue").val(element_library[lib].uvalue);
    $("#create-element-kvalue").val(element_library[lib].kvalue);
    $("#create-element-criteria").val(element_library[lib].criteria.join(","));
    
    $("#create-element-type").val(type);
    if (type=="Window") {
        $("#create-element-g").val(element_library[lib].g);
        $("#create-element-gL").val(element_library[lib].gL);
        $("#create-element-ff").val(element_library[lib].ff);
        $(".create-element-window-options").show();
    }
    
    $("#myModalcreateelement").modal('show');
    $('#myModal').modal('hide');
});


$("#openbem").on("click",".newlibraryoption",function() {
    $(".library-select-view").hide();
    $(".new-library-view").show();
});

$("#openbem").on("click","#newlibrary",function() {
    var name = $("#newlibrary-name").val();
    console.log("newlibrary:"+name);
    $.ajax({ url: path+"assessment/newlibrary.json", data: "name="+name, datatype:"json", success: function(result){
        console.log("result: "+result);
        loadlibrarylist();
        $(".library-select-view").show();
        $(".new-library-view").hide();
    }});
});

$("#library-select").change(function(){
    var id = $(this).val() * 1.0;
    if (id!=-1) {
        console.log(id);
        selected_library = id;
        loadlibrary(id,function(){
            draw_library("Wall");
        });
    }
});
$("#openbem").on("click","#cancelnewlibrary",function() {
    $(".library-select-view").show();
    $(".new-library-view").hide();
});

$("#open-share-library").click(function(){
    $("#modal-share-library").modal('show');
    $('#myModal').modal('hide');
    
    $.ajax({ url: path+"assessment/getsharedlibrary.json", data: "id="+selected_library, success: function(shared){
        var out = "";
        for (var i in shared) {
            // if (myusername!=shared[i].username) 
            out += "<tr><td>"+shared[i].username+"</td></tr>";
        }
        if (out=="") out = "<tr><td>This library is currently private</td></tr>";
        $("#shared-with-table").html(out);
    }});
});

$("#share-library").click(function() {
    var username = $("#sharename").val();
    if (selected_library!=-1) {
        $.ajax({ 
            url: path+"assessment/sharelibrary.json", 
            data: "id="+selected_library+"&name="+username, 
            success: function(data){
            
            $.ajax({ url: path+"assessment/getsharedlibrary.json", data: "id="+selected_library, success: function(shared){
                var out = "";
                for (var i in shared) {
                    // if (myusername!=shared[i].username) 
                    out += "<tr><td>"+shared[i].username+"</td></tr>";
                }
                if (out=="") out = "<tr><td>This library is currently private</td></tr>";
                $("#shared-with-table").html(out);
            }});
            
        }});
    }
});
