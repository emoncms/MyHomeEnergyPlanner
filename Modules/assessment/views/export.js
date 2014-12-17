$("#import-data").click(function(){
    data = JSON.parse($("#import-export").val());
    project[scenario] = data;
    
    update();
    openbem.set(projectid,project);
});

$("#input-data").click(function(){
    var inputdata = openbem.extract_inputdata(data);
    $("#import-export").html(JSON.stringify(inputdata, null, 4));
    $('textarea').height($('textarea').prop('scrollHeight'));
});

$("#all-data").click(function(){
    $("#import-export").html(JSON.stringify(data, null, 4));
    $('textarea').height($('textarea').prop('scrollHeight'));
});

function export_initUI()
{
    var inputdata = openbem.extract_inputdata(data);
    $("#import-export").html(JSON.stringify(inputdata, null, 4));
    $('textarea').height($('textarea').prop('scrollHeight'));
}

