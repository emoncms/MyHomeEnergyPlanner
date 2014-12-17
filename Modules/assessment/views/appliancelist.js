$("#add-item").click(function(){
    var size = data.appliancelist.list.length;
    var name = "Item "+(size+1);
    data.appliancelist.list.push({name: name, power: 0, hours: 0, energy: 0});
    add_appliance(size);

    update();
});

function add_appliance(z)
{
    $("#appliancelist").append($("#template").html());
    $("#appliancelist [key='data.appliancelist.list.z.name']").attr('key','data.appliancelist.list.'+z+'.name');
    $("#appliancelist [key='data.appliancelist.list.z.power']").attr('key','data.appliancelist.list.'+z+'.power');
    $("#appliancelist [key='data.appliancelist.list.z.hours']").attr('key','data.appliancelist.list.'+z+'.hours');
    $("#appliancelist [key='data.appliancelist.list.z.energy']").attr('key','data.appliancelist.list.'+z+'.energy');
}
    

function appliancelist_initUI() {
    for (z in data.appliancelist.list) add_appliance(z);
}
