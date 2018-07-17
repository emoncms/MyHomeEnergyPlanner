$("#add-floor").click(function(){
    var size = Object.size(data.floors);
    if (size==0) name = "Ground Floor";
    if (size==1) name = "1st Floor";
    if (size==2) name = "2nd Floor";
    if (size==3) name = "3rd Floor";
    if (size>3) name = size+"th Floor";
    data.floors.push({name: name, area: 0, height: 0, volume: 0});
    add_floor(data.floors.length-1);
    update();
});

$("#openbem").on("click",'.delete-floor', function(){
    var row = $(this).attr('row');
    $(this).closest('tr').remove();
    data.floors.splice(row,1);
    update();
});

function add_floor(z)
{
    $("#floors").append($("#template").html());
    $("#floors [key='data.floors.template.name']").attr('key','data.floors.'+z+'.name');
    $("#floors [key='data.floors.template.area']").attr('key','data.floors.'+z+'.area');
    $("#floors [key='data.floors.template.height']").attr('key','data.floors.'+z+'.height');
    $("#floors [key='data.floors.template.volume']").attr('key','data.floors.'+z+'.volume');
    $("#floors [row='template']").attr('row',z); 
}

function context_initUI()
{
    for (z in data.floors) {
        add_floor(z);
    }
}

$('#openbem').on('click','#find-post-code', function(){
    $('#postcode').val('');
   $('#regions-by-postcode').html('');
   $('#region-postcodes-ok').prop('disabled',true);
   $('#region-postcodes-modal').modal('show');
});

$('#openbem').on('change keyup','#region-postcodes-modal #postcode', function(){
   var postcode = $(this).val();
   $('#regions-by-postcode').html('');
   datasets.table_U6_region_from_postcode.forEach(function(element){
       if (element[0].indexOf(postcode.toUpperCase()) == 0) // element[0] is the postcod
           $('#regions-by-postcode').append('<p style="padding-left:15px"><input type="radio" name="region" value="'+element[1]+'"> ' + element[0] +' - ' + datasets.regions[element[1]]+'</p>');// element[1] is the region index
   });
});

$('#openbem').on('click','#region-postcodes-modal input[name=region]', function(){
    $('#region-postcodes-ok').prop('disabled',false);
});

$('#openbem').on('click','#region-postcodes-modal #region-postcodes-ok', function(){
    $('#region-postcodes-modal').modal('hide');
    var region = $('#region-postcodes-modal input[name=region]:checked').val();
    $('select[key="data.region"]').val(region).change();  
});
