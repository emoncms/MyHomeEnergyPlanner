<?php
  global $path, $session;
  $d = $path."Modules/assessment/";
?>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/openbem-r3.js"></script>

<div id="left-pane">

    <div class="side-block" style="padding-top:30px">

        <h3>Welcome <?php echo $session['username']; ?>!</h3>
        <br>
        <button id="create-new-step1" class="btn btn-info" style="width:87%">Create new assessment</button>
        
        <div id="new-project-input" style="display:none">
            <p><b>Add new assessment:</b></p>
            <p>
                <span class="muted">Project name</span>
                <br><input id="project-name-input" type="text" style="width:82%" />
            </p>
            <p>
                <span class="muted">Project description</span>
                <br><input id="project-description-input" type="text" style="width:82%" />
            </p>
            <button id="create-new-step2" class="btn btn-info" style="width:87%">Create</button>
        </div>
    
    </div>
    
</div>
     
<div id="right-pane">
    <div id="bound">
        <hr>
        <h3>Assessments</h3>
        <hr>
        <br>
        <table class="table">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Author</th>
          <th>Status</th>
          <th>Modified</th>
          <th style="width:40px"></th>
          <th style="width:30px"></th>
        </tr>
        
        <tbody id="projects"></tbody>

        </table>
        
        <div id="noprojects" class="alert alert-warning" style="display:none">No projects have been created yet, click create new project to get started</div>
    </div>
</div>

<div id="myModal" class="modal hide" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="myModalLabel"><?php echo _('WARNING deleting a project is permanent'); ?></h3>
    </div>
    <div class="modal-body">
        <p><?php echo _('Are you sure you want to delete this project?'); ?></p>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true"><?php echo _('Cancel'); ?></button>
        <button id="confirmdelete" class="btn btn-primary"><?php echo _('Delete permanently'); ?></button>
    </div>
</div>

<script>

var path = "<?php echo $path; ?>";
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var now = (new Date()).getTime() * 0.001;

var projects = openbem.getlist();

draw_projects();

$("#create-new-step1").click(function(){
    $("#create-new-step1").hide();
    $("#new-project-input").show();
});

$("#create-new-step2").click(function(){
    
    var name = $("#project-name-input").val();
    var description = $("#project-description-input").val();
    
    if (name=="") {
        alert("Please enter a project name");
    } else {
        //projectid = projects.length;
        var project = openbem.create(name,description);
        
        if (project) {
            projects.push(project);
            draw_projects();
        }

        $("#create-new-step1").show();
        $("#new-project-input").hide();
        $("#noprojects").hide();
        
        $("#project-name-input").val("");
        $("#project-description-input").val("");
    } 
});

$("#projects").on('click','.delete-project', function() {
    var projectid = $(this).attr('projectid');
    var z = $(this).attr('z');
    
    $('#myModal').modal('show');
    $('#myModal').attr('the_id',projectid);
    $('#myModal').attr('the_row',z);
});

$("#confirmdelete").click(function()
{
    var projectid = $('#myModal').attr('the_id');
    var z = $('#myModal').attr('the_row');

    if (openbem.delete(projectid))
    {
        projects.splice(z,1);
        draw_projects();
    }
    
    $('#myModal').modal('hide');
});

$("#projects").on('change','.project-status', function() {
    var projectid = $(this).attr('projectid');
    var z = $(this).attr('z');
    var status = $(this).val();
    openbem.set_status(projectid,status);
    projects[z].status = status;
    draw_projects();
});

function draw_projects()
{
    var status_options = ["Complete","In progress","Test"];
    
    var out = "";
    for (s in status_options) {
        out += "<tr><th>"+status_options[s]+"</th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
        for (z in projects)
        {
            if (status_options[s] == projects[z].status) {
                out += "<tr>";
                out += "<td>"+projects[z].name+"</td>";
                out += "<td style='font-style:italic; color:#888'>"+projects[z].description+"</td>";
                out += "<td>"+projects[z].author+"</td>";

                var color = "";
                if (projects[z].status == "Complete") color = " alert-success";
                if (projects[z].status == "In progress") color = " alert-info";
                if (projects[z].status == "Test") color = " alert-error";

                out += "<td><select class='project-status"+color+"' z="+z+" projectid="+projects[z].id+">";
                for (o in status_options) {
                    var selected = "";
                    if (projects[z].status == status_options[o]) 
                        selected = " selected"
                    out += "<option "+selected+">"+status_options[o]+"</option>";
                }
                out += "</select></td>";

                var t = new Date();
                var d = new Date(projects[z].mdate*1000);

                if (t.getYear()==d.getYear()) {
                var mins = d.getMinutes();
                if (mins<10) mins = "0"+mins;
                    out += "<td>"+d.getHours()+":"+mins+" "+d.getDate()+" "+months[d.getMonth()]+"</td>";
                } else {
                    out += "<td>"+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+"</td>";
                }


                out += '<td><a href="'+path+'assessment/view?id='+projects[z].id+'"><span class="label label-info">Open <i class="icon-folder-open icon-white"></i></span></a></td>';
                out += '<td><span class="delete-project" projectid='+projects[z].id+' z='+z+' style="cursor:pointer"><span class="label label-important"><i class="icon-trash icon-white"></i></span></td>';
                out += "</tr>";
            }
        }
    }

    $("#projects").html(out);

    if (projects.length==0) $("#noprojects").show();
}

</script>
