<?php
  global $path, $session;
  $d = $path."Modules/assessment/";
?>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/openbem-0.0.1.js"></script>

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
          <th></th>
          <th></th>
        </tr>
        
        <tbody id="projects"></tbody>

        </table>
        
        <div id="noprojects" class="alert alert-warning" style="display:none">No projects have been created yet, click create new project to get started</div>
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
    if (openbem.delete(projectid))
    {
        projects.splice(z,1);
        draw_projects();
    }
});

function draw_projects()
{
    var out = "";
    for (z in projects)
    {
      out += "<tr>";
      out += "<td>"+projects[z].name+"</td>";
      out += "<td>"+projects[z].description+"</td>";
      out += "<td>"+projects[z].author+"</td>";
      out += "<td><select><option>In Progress</option></select></td>";
      
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
      out += '<td><span class="delete-project" projectid='+projects[z].id+' z='+z+' style="cursor:pointer">Delete</span></td>';
      out += "</tr>";
    }

    $("#projects").html(out);

    if (projects.length==0) $("#noprojects").show();
}

</script>
