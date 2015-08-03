function currentenergy_initUI() {

    var E = data.currentenergy.energyitems;
    console.log(E);
    var out = "";
    var lastgroup = "";
    for (z in E)
    {
        if (E[z].selected==0) {
            if (E[z].group!=lastgroup) out += "<optgroup label='"+E[z].group+"'>";
            lastgroup = E[z].group;
            out += "<option value='"+z+"'>"+E[z].name+"</option>";
        }
    }
    $("#energyitem_select").html(out);
    
    var out = "";
    for (z in E)
    {
        if (E[z].selected==1)
        { 
            out += "<tr>";
            out += "<td>"+E[z].name;
            if (E[z].note!="") out += "<br><i style='font-size:12px'>"+E[z].note+"</i>";
            out += "</td>";
            out += "<td><input type='text' style='width:60px' key='data.currentenergy.energyitems."+z+".quantity' /> "+E[z].units+"</td>";
            if (E[z].mpg!=undefined) {
                out += "<td><input type='text' style='width:60px' key='data.currentenergy.energyitems."+z+".mpg' /> mpg</td>";
            } else {
                out += "<td></td>";
            }
            out += "<td><span type='text' key='data.currentenergy.energyitems."+z+".kwhd' dp=1/> kWh/d</td>";
            out += "<td><span type='text' key='data.currentenergy.energyitems."+z+".annual_co2' dp=0/> kg</td>";
            out += "<td><input type='text' style='width:50px' key='data.currentenergy.energyitems."+z+".unitcost' dp=2 /> £/"+E[z].units+"</td>";
            out += "<td><input type='text' style='width:50px' key='data.currentenergy.energyitems."+z+".standingcharge' dp=2 /></td>";
            out += "<td>£<span type='text' key='data.currentenergy.energyitems."+z+".annual_cost' dp=2/></td>";
            out += "<td><i class='currentenergy-deleteitem icon-trash' tag='"+z+"'></i></td></tr>";
        }
    
    }
    $("#currentenergy_energyitems").html(out);
}

$("#add_energyitem").click(function(){
    var tag = $("#energyitem_select").val();
    console.log(tag);
    data.currentenergy.energyitems[tag].selected = 1;
    currentenergy_initUI();
    update();
});

$("#currentenergy_energyitems").on("click",".currentenergy-deleteitem",function() {
    var tag = $(this).attr("tag");
    data.currentenergy.energyitems[tag].selected = 0;
    data.currentenergy.energyitems[tag].quantity = 0;
    currentenergy_initUI();
    update();
});
