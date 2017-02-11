$("#import-data").click(function(){
    project = JSON.parse($("#import-export").val());
    
    update();
    openbem.set(projectid,project, function (result) {
            alertifnotlogged(result);
    });
});

$("#input-data").click(function(){
    var project_inputdata = {};
    for (var scenario in project) {
        project_inputdata[scenario] = openbem.extract_inputdata(project[scenario])
    }
    
    $("#import-export").html(JSON.stringify(project_inputdata, null, 4));
    $('textarea').height($('textarea').prop('scrollHeight'));
});

$("#all-data").click(function(){
    $("#import-export").html(JSON.stringify(project, null, 4));
    $('textarea').height($('textarea').prop('scrollHeight'));
});

function export_initUI()
{
    var project_inputdata = {};
    for (var scenario in project) {
        project_inputdata[scenario] = openbem.extract_inputdata(project[scenario])
    }

    $("#import-export").html(JSON.stringify(project_inputdata, null, 4));
    $('textarea').height($('textarea').prop('scrollHeight'));
}

