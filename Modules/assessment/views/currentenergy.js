function currentenergy_initUI() {

    var E = data.currentenergy.energyitems;

    var out = "";
    for (z in E)
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
        out += "</tr>";
    
    }
    $("#currentenergy_energyitems").html(out);

}
