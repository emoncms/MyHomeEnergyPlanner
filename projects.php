<?php
defined('EMONCMS_EXEC') or die('Restricted access');
global $path, $session, $app_color,$app_title,$app_description;
$d = $path . "Modules/assessment/";
?>

<link href='https://fonts.googleapis.com/css?family=Ubuntu:300' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="<?php echo $d; ?>style.css">

<style>
    :root {
        --app-color: <?php echo $app_color;?>;
    }
    
    .cc {
        color: var(--app-color);
        font-weight: bold;
        padding-right:20px;
        
    }

    .title {
        padding: 10px 30px;
        color:#888;
        float:left;
    }
    
    .recent-activity-item {
        padding:5px;
        border-bottom: 1px solid #ccc;
    }
    .modal-backdrop
    {
        opacity:0.3 !important;
    }

    body .modal {
        /* new custom width */
        width: 560px;
        /* must be half of the width, minus scrollbar on the left (30px) */
        margin-left: -280px;
    }
</style>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/mhep-helper.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/library-r6.js"></script>

<div id="wrapper">

    <div id="organisation" class="main-block" style="display:none">
        <button id="back-myview" style="float:right; margin-top:5px; margin-right:5px" class="btn">Home</button>
        <div style="background-color:rgba(215, 210, 201, 0.9); color:#897A67; padding:10px;">

            <b>Organisation:</b>
            <span id="organisation-name"></span>
        </div>

        <div style="padding:10px">
            <b>Members:</b><br>
            <div id="organisationmembers"></div>
            <br>
            <div class="input-append">
                <input id="organisation-add-member-name" type="text" style="width:180px" />
                <button id="organisation-add-member" class="btn">Add member</button>
            </div>
        </div>
    </div>

    <div class="main-block">
        <div style="background-color:rgba(215, 210, 201, 0.9); color:#897A67; padding:10px;"><b>My Organisations</b></div>
        <div style="padding:10px">
            <div id="myorganisations"></div>
            <br>
            <div class="input-append">
                <input id="organisation-create-name" type="text" style="width:135px" />
                <button id="organisation-create" class="btn">Create organisation</button>
            </div>
        </div>
    </div>
</div>

<div id="wrapper" class="assessments">
    <div style="padding-right:10px">
        <div class="main-block">
            <button id="new-assessment" style="float:right; margin-top:5px; margin-right:5px" class="btn">New</button>
            <div style="background-color:rgba(215, 210, 201, 0.9); color:#897A67; padding:10px;"><b><span id="assessments-title"></span></b></div>
            <div style="padding:20px">
                <br>
                <table class="table">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Author</th>
                        <th>Status <i class="icon-question-sign" title="Completed assessments are locked"></i></th>
                        <th>Modified</th>
                        <th style="width:40px"></th>
                        <th style="width:30px"></th>
                        <th style="width:30px"></th>
                    </tr>

                    <tbody id="projects"></tbody>

                </table>

                <div id="noprojects" class="alert alert-warning" style="display:none">No projects have been created yet, click create new project to get started</div>
            </div>
        </div>
    </div>
</div>

<div id="modal-assessment-create" class="modal hide" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3>Create new assessment</h3>
    </div>
    <div class="modal-body">
        <p><b>Add new assessment:</b></p>
        <p>
            <span class="muted">Project name</span>
            <br><input id="project-name-input" type="text" style="width:82%" />
        </p>
        <p>
            <span class="muted">Project description</span>
            <br><input id="project-description-input" type="text" style="width:82%" />
        </p>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
        <button id="assessment-create" class="btn btn-primary">Create</button>
    </div>
</div>

<div id="myModal" class="modal hide" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="true">
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

<div id="modal-share-project" class="modal hide" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="myModalLabel">Share assessment: </h3>
    </div>
    <div class="modal-body">

        <p>Shared with:</p>
        <table class="table" id="shared-with-table">
        </table>

        <p>Enter user, or organisation name to share this assessment with:</p>
        <input id="sharename" type="text" style="width:420px"/>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
        <button id="share-project" class="btn btn-primary">Share</button>
    </div>
</div>

<script>

    var viewmode = "personal";
    var orgid = 0;
    var myusername = "<?php echo $session['username']; ?>";
    $(".username").html(myusername);
    var path = "<?php echo $path; ?>";
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var now = (new Date()).getTime() * 0.001;
// -----------------------------------------------------------------------------------
// 1) Load project lists
// -----------------------------------------------------------------------------------

    var projects = [];
    $.ajax({url: path + "assessment/list.json", success: function (result) {
            projects = result;
            draw_projects("#projects", projects);
            $("#assessments-title").html("My Assessments");
        }});
// -----------------------------------------------------------------------------------
// Check that the user at least one library of each type and if not create it from the default one
// Check that all the elements in the default library are in the user's Standard library, copy over the ones that are not (kind of getting in sync)
// -----------------------------------------------------------------------------------
    var libraries = {};
    $.ajax({url: path + "assessment/loaduserlibraries.json", async: true, datatype: "json", success: function (user_libraries) {
            // Check that the user at least one library of each type and if not create it from the default one
            var user_has_the_library = false;
            for (library_type in standard_library) {
                user_has_the_library = false;
                for (library_index in user_libraries) {
                    if (user_libraries[library_index].type == library_type)
                        user_has_the_library = true;
                }
                if (user_has_the_library == false) {
                    var library_name = "StandardLibrary - " + myusername;
                    $.ajax({url: path + "assessment/newlibrary.json", data: "name=" + library_name + '&type=' + library_type, datatype: "json", async: false, success: function (result) {
                            var library_id = result;
                            var library_string = JSON.stringify(standard_library[library_type]);
                            library_string = library_string.replace(/&/g, 'and');
                            $.ajax({type: "POST", url: path + "assessment/savelibrary.json", data: "id=" + library_id + "&data=" + library_string, success: function (result) {
                                    console.log("Library: " + library_type + ' - ' + result);
                                }});
                        }});
                }
            }
            // Check that all the elements in the default library are in the user's Standard library, copy over the ones that are not (kind of getting in sync)
            for (library_type in standard_library) {
                for (library_index in user_libraries) {
                    var library_changed = false;
                    if (user_libraries[library_index].type == library_type && user_libraries[library_index].name == "StandardLibrary - " + myusername) {
                        var user_library = JSON.parse(user_libraries[library_index].data);
                        for (item in standard_library[library_type]) {
                            item = item.replace(/[^\w\s-+.",:{}\/'\[\]\\]/g, ''); // we apply the same validation than in the server
                            if (user_library[item] == undefined) {
                                user_library[item] = standard_library[library_type][item];
                                library_changed = true;
                            }
                        }
                    }
                    if (library_changed === true) {
                        var library_string = JSON.stringify(user_library);
                        library_string = library_string.replace(/&/g, 'and');
                        $.ajax({type: "POST", url: path + "assessment/savelibrary.json", data: "id=" + user_libraries[library_index].id + "&data=" + library_string, success: function (result) {
                                console.log("Library: " + library_type + ' - ' + result);
                            }});
                    }
                }
            }
        }
    });
// -----------------------------------------------------------------------------------
// Create new assessment
// -----------------------------------------------------------------------------------

    $("#new-assessment").click(function () {
        $("#modal-assessment-create").modal("show");
    });
    $("#assessment-create").click(function () {

        var name = $("#project-name-input").val();
        var description = $("#project-description-input").val();
        if (name == "") {
            alert("Please enter a project name");
        } else {
            var callback = function (project) {
                    projects.push(project);
                    draw_projects("#projects", projects);
                    $("#noprojects").hide();
                };
            if (viewmode == "organisation" && orgid != 0)
                mhep_helper.create(name, description, orgid, callback);
            else 
                mhep_helper.create(name, description, null, callback);
            /*var orgselector = "";
            if (viewmode == "organisation" && orgid != 0)
                orgselector += "&org=" + orgid;
            $.ajax({
                url: path + "assessment/create.json",
                data: "name=" + name + "&description=" + description + orgselector,
                success: function (project) {
                    projects.push(project);
                    draw_projects("#projects", projects);
                    $("#noprojects").hide();
                }
            });*/
            $("#project-name-input").val("");
            $("#project-description-input").val("");
            $("#modal-assessment-create").modal("hide");
        }
    });
// -----------------------------------------------------------------------------------
// Delete assessment
// -----------------------------------------------------------------------------------

    $(".assessments").on('click', '.delete-project', function () {
        var projectid = $(this).attr('projectid');
        var z = $(this).attr('z');
        $('#myModal').modal('show');
        $('#myModal').attr('the_id', projectid);
        $('#myModal').attr('the_row', z);
    });
    $("#confirmdelete").click(function () {
        var projectid = $('#myModal').attr('the_id');
        var z = $('#myModal').attr('the_row');
        if (mhep_helper.delete(projectid)) {
            projects.splice(z, 1);
            draw_projects("#projects", projects);
        }

        $('#myModal').modal('hide');
    });
// -----------------------------------------------------------------------------------
// Share assessment
// -----------------------------------------------------------------------------------

    $(".assessments").on('click', '.share-project-openmodal', function () {
        var projectid = $(this).attr('projectid');
        var z = $(this).attr('z');
        $.ajax({url: path + "assessment/getshared.json", data: "id=" + projectid, success: function (shared) {
                var out = "";
                for (var i in shared) {
                    if (myusername != shared[i].username)
                        out += "<tr><td>" + shared[i].username + "</td></tr>";
                }
                if (out == "")
                    out = "<tr><td>This assessment is currently private</td></tr>";
                $("#shared-with-table").html(out);
            }});
        $('#modal-share-project').modal('show');
        $('#modal-share-project').attr('the_id', projectid);
        $('#modal-share-project').attr('the_row', z);
        console.log("Share project " + projectid);
    });
    $("#share-project").click(function () {
        var username = $("#sharename").val();
        var projectid = $('#modal-share-project').attr('the_id');
        $.ajax({url: path + "assessment/share.json", data: "id=" + projectid + "&username=" + username, success: function (data) {
                console.log(data);
                $.ajax({url: path + "assessment/getshared.json", data: "id=" + projectid, success: function (shared) {
                        var out = "";
                        for (var i in shared) {
                            if (myusername != shared[i].username)
                                out += "<tr><td>" + shared[i].username + "</td></tr>";
                        }
                        if (out == "")
                            out = "<tr><td>This assessment is currently private</td></tr>";
                        $("#shared-with-table").html(out);
                    }});
            }});
    });
// -----------------------------------------------------------------------------------
// Change assessment status
// -----------------------------------------------------------------------------------

    $(".assessments").on('change', '.project-status', function () {
        var projectid = $(this).attr('projectid');
        var z = $(this).attr('z');
        var status = $(this).val();
        mhep_helper.set_status(projectid, status);
        projects[z].status = status;
        draw_projects("#projects", projects);
    });
// -----------------------------------------------------------------------------------
// Draw assessment list
// -----------------------------------------------------------------------------------

    function draw_projects(element, projects)
    {
        var status_options = ["Complete", "In progress", "Test"];
        var out = "";
        for (s in status_options) {
            // out += "<tr><th>"+status_options[s]+"</th><th></th><th></th><th></th><th></th><th></th><th></th></tr>";
            for (z in projects)
            {
                if (status_options[s] == projects[z].status) {
                    out += "<tr>";
                    out += "<td>" + projects[z].name + "</td>";
                    out += "<td style='font-style:italic; color:#888'>" + projects[z].description + "</td>";
                    out += "<td>" + projects[z].author + "</td>";
                    var color = "";
                    if (projects[z].status == "Complete")
                        color = " alert-success";
                    if (projects[z].status == "In progress")
                        color = " alert-info";
                    if (projects[z].status == "Test")
                        color = " alert-error";
                    out += "<td><select class='project-status" + color + "' z=" + z + " projectid=" + projects[z].id + ">";
                    for (o in status_options) {
                        var selected = "";
                        if (projects[z].status == status_options[o])
                            selected = " selected"
                        out += "<option " + selected + ">" + status_options[o] + "</option>";
                    }
                    out += "</select></td>";
                    var t = new Date();
                    var d = new Date(projects[z].mdate * 1000);
                    if (t.getYear() == d.getYear()) {
                        var mins = d.getMinutes();
                        if (mins < 10)
                            mins = "0" + mins;
                        out += "<td>" + d.getHours() + ":" + mins + " " + d.getDate() + " " + months[d.getMonth()] + "</td>";
                    } else {
                        out += "<td>" + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + "</td>";
                    }


                    out += '<td><a id="open-project-' + projects[z].id + '" href="' + path + 'assessment/view?id=' + projects[z].id + '"><span class="label label-info">Open <i class="icon-folder-open icon-white"></i></span></a></td>';
                    out += '<td><span class="share-project-openmodal" projectid=' + projects[z].id + ' z=' + z + ' style="cursor:pointer"><span class="label label-info"><i class="icon-share icon-white"></i></span></td>';
                    out += '<td><span class="delete-project" projectid=' + projects[z].id + ' z=' + z + ' style="cursor:pointer"><span class="label label-important"><i class="icon-trash icon-white"></i></span></td>';
                    out += "</tr>";
                }
            }
        }

        $(element).html(out);
        if (projects.length == 0)
            $("#noprojects").show();
        else
            $("#noprojects").hide();
    }



// ----------------------------------------------------------------------------
// ORGANISATIONS
// ----------------------------------------------------------------------------
    var myorganisations = {};
    $.ajax({url: path + "assessment/getorganisations.json", success: function (result) {
            myorganisations = result;
            draw_organisation_list();
            //draw_organisation(8);
        }});
// -----------------------------------------------------------------------------------
// Create organisation
// -----------------------------------------------------------------------------------

    $("#organisation-create").click(function () {
        var orgname = $("#organisation-create-name").val();
        if (orgname == "") {
            alert("Organisation name missing");
        } else {
            $.ajax({url: path + "assessment/neworganisation.json", data: "orgname=" + orgname, success: function (result) {
                    if (result.success) {
                        myorganisations = result.myorganisations;
                        draw_organisation_list();
                    } else {
                        alert(result.message);
                    }
                }});
        }
    });
    $("#organisation-add-member").click(function () {
        var membername = $("#organisation-add-member-name").val();
        if (membername == "") {
            alert("Member name missing");
        } else {
            $.ajax({url: path + "assessment/organisationaddmember.json", data: "orgid=" + orgid + "&membername=" + membername, success: function (result) {
                    if (result.success) {
                        myorganisations[orgid].members.push(result);
                        draw_organisation(orgid);
                    } else {
                        alert(result.message);
                    }
                }});
        }
    });
    $("body").on("click", ".org-item", function () {
        orgid = $(this).attr("orgid");
        draw_organisation(orgid);
        $("#organisation").show();
        viewmode = "organisation";
        $.ajax({url: path + "assessment/list.json", data: "orgid=" + orgid, success: function (result) {
                projects = result;
                draw_projects("#projects", projects);
                $("#assessments-title").html(myorganisations[orgid].name + " Assessments");
                $("#myview").hide();
            }});
    });
    function draw_organisation_list() {
        var out = "";
        for (var z in myorganisations) {
            out += "<div class='org-item recent-activity-item' style='cursor:pointer' orgid=" + myorganisations[z].orgid + " >";
            out += "<b>" + myorganisations[z].name + "</b><br>" + myorganisations[z].assessments + " Assessments";
            out += "</div>";
        }
        $("#myorganisations").html(out);
    }

    function draw_organisation(orgid) {
        var out = "";
        $("#organisation-name").html(myorganisations[orgid].name);
        var members = myorganisations[orgid].members;
        for (var z in members) {
            out += "<div class='recent-activity-item' style='height:40px'>";
            out += "<img src='<?php echo $path; ?>Modules/assessment/img-assets/defaultuser.png' style='height:40px; float:left; padding-right:5px'/ >";
            out += "<b>" + members[z].name + "</b><br>Last active: " + members[z].lastactive;
            out += "</div>";
        }
        $("#organisationmembers").html(out);
    }

    $("#back-myview").click(function () {
        var viewmode = "personal";
        var orgid = 0;
        $("#organisation").hide();
        $.ajax({url: path + "assessment/list.json", success: function (result) {
                projects = result;
                draw_projects("#projects", projects);
                $("#assessments-title").html("My Assessments");
                $("#myview").show();
            }});
    });
    
    
// -------------------------------------------------------
// Other
// -------------------------------------------------------
  $('#modal-assessment-create').on('keypress', function (e) {
        if (e.which == 13) {
            $('#assessment-create').click();
        }
    });

</script>
