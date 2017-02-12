<?php
global $path;
$d = $path . "Modules/assessment/";

$projectid = (int) $_GET['id'];

global $reports;
?>        

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/openbem-r4.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-helper-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-openbem-r3.js"></script>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/library-r6.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/datasets-r4.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/model-r8.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/appliancesCarbonCoop-r1.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>graph-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/targetbar-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/vectormath-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/arrow-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/library-helper/library-helper-r1.js"></script>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/canvas-barchart/barchart.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/targetbar-carboncoop.js"></script>
<link rel="stylesheet" href="<?php echo $d; ?>js/magnific-popup/magnific-popup.css">
<script src="<?php echo $d; ?>js/magnific-popup/jquery.magnific-popup.min.js"></script>

<style>
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

    #create-new {
        cursor:pointer;
    }

    #create-new:hover {
        background-color:rgb(220,220,220);
    }
</style>

<link rel="stylesheet" href="<?php echo $d; ?>carbon.css">
<script type="text/javascript" src="<?php echo $d; ?>data.js"></script>


<div id="openbem">
    <div id="left-pane">
        <div class="side-block-2">
            <div style="background-color:rgba(215, 210, 201, 0.9); color:#897A67; padding:10px;"><b>Project: <span id="project-title"></span> <a id="edit-project-name-and-description" href="#"><i class="icon-edit"></i></a></b></div>
            <div style="padding:10px">

                <p style="font-size:14px">Description: <span id="project-description"></span></p>
                <p style="font-size:14px">Author: <span id="project-author"></span></p>
                <a class="house_graphic" style="margin-right:10px">Show house graphic</a>
                <br><br>

                <div class="scenario-nav-heading">Project</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/compare">MHEP Report</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/householdquestionnaire">Household Questionnaire</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/currentenergy">Current Energy</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/export">Import/Export</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/imagegallery">Image gallery</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/librariesmanager">Libraries manager</a></div>
            </div>
        </div>

        <div id="scenario-menu-template" style="display:none">

            <div class="side-block-2 scenario-block" scenario="template" style="cursor:pointer">

                <div style="background-color:rgba(215, 210, 201, 0.9); color:#897A67; padding:10px;"><b>title<span style="float:right">scenarioname (<span class="template_sap_rating"></span>)</span></b></div>

                <div class="menu-content">
                    <div style="padding:10px">
                        <div class="scenario-nav" style="float:right"><span class="lock">Lock</span></div>
                        <div class="scenario-nav-heading">Core input</div>
                        <div class="scenario-nav"><a href="#template/context">Basic Dwelling Data</a></div>
                        <div class="scenario-nav"><a href="#template/ventilation">Ventilation and Infiltration</a></div>
                        <div class="scenario-nav"><a href="#template/elements">Fabric</a></div>
                        <div class="scenario-nav"><a href="#template/LAC">Lighting, Appliances & Cooking</a></div>
                        <div class="scenario-nav"><a href="#template/heating">Heating</a></div>                        
                        <div class="scenario-nav"><a href="#template/fuel_requirements">Fuel requirements</a></div>                        
                        <div class="scenario-nav-heading">Extended input</a></div>
                        <div class="scenario-nav"><input type="checkbox" key="data.use_SHW"/> <a href="#template/solarhotwater">Solar Hot Water heating</a></div>
                        <div class="scenario-nav"><input type="checkbox" key="data.use_generation"/> <a href="#template/generation">Generation</a></div>
                        <div class="scenario-nav-heading">Other</a></div>
                        <!--<div class="scenario-nav"><a href="#template/compare">Show difference</a></div>
                        <div class="scenario-nav"><a href="#template/detail">Detailed view</a></div>-->
                        <div class="scenario-nav"><a href="#template/worksheets">SAP worksheets</a></div>
                        <!--<div class="scenario-nav"><a href="#template/changelog">Session change log</a></div>-->
                        <br>
                        <div class="scenario-nav delete-scenario-launch">Delete scenario <i class="icon-trash"></i></div>
                    </div>

                </div>
            </div>

        </div>

        <div id="scenario-list"></div>

        <div id="create-new">
            Create new scenario
        </div>

        <div class="side-block" style="background:none">

            <div class="scenario-nav-heading">Documentation</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://github.com/emoncms/openbem/blob/v3/docs/guide.md">User guide (out of date)</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://github.com/emoncms/openbem/blob/v3/docs/ElementLibrary.md">A Fabric elements Library</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/readme">Learn: Building Energy Modelling</a></div>
        </div>
    </div>

    <div id="right-pane">



        <div id="topgraphic"></div>


        <div id="bound">
            <div id="content"></div>
        </div>
    </div>
</div>

<div id="modal-edit-project-name-and-description" class="modal modal-sm hide" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3>Edit project name and description</h3>
    </div>
    <div class="modal-body">
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
        <button id="assessment-update-name-and-description" class="btn btn-primary">Done</button>
    </div>
</div>

<div id="modal-error-submitting-data" class="modal alert-danger hide" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <h3>You have been logged out!</h3>
    </div>
    <div class="modal-body">
        <p>The last change hasn't been saved.</p>
        <p>You will be redirected to the login page.</p>
    </div>
    <div class="modal-footer">
        <button id="modal-error-submitting-data-done" class="btn btn-danger">Done</button>
    </div>
</div>

<div id="modal-delete-scenario" class="modal alert-danger hide" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <h3>Delete scenario</h3>
    </div>
    <div class="modal-body">
        Are you sure you want to delete this scenario?
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true"><?php echo _('Cancel'); ?></button>
        <button id="delete-scenario-confirm" class="btn btn-primary"><?php echo _('Delete'); ?></button>
    </div>
</div>


<div id="modal-create-scenario" class="modal modal-sm hide" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3>Select from the list below the scenario you want to duplicate</h3>
    </div>
    <div class="modal-body">
        <select id="select-scenario"></select>        
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
        <button id="modal-create-scenario-done" class="btn btn-primary">Done</button>
    </div>
</div>

<div id="modal-scenario-locked" class="modal alert-warning hide" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <h3>This scenario is locked!</h3>
    </div>
    <div class="modal-body">
        <p>You cannot modify it.</p>
    </div>
    <div class="modal-footer">
        <p data-dismiss="modal" aria-hidden="true" class="btn btn-warning">Ok</p>
    </div>
</div>

</body>
</html>                                		


<script>

    var changelog = "";
    var selected_library = -1;
    var selected_library_tag = "Wall";
    var printmode = false;

    $("#openbem").css("background-color", "#eee");

    var path = "<?php echo $path; ?>";
    var jspath = path + "Modules/assessment/";

    //var c=document.getElementById("rating");
    //var ctx=c.getContext("2d");

    load_view("#topgraphic", 'topgraphic');

    var projectid = <?php echo $projectid; ?>;
    var p = openbem.get(projectid);

    $("#project-title").html(p.name);
    $("#project-description").html(p.description);
    $("#project-author").html(p.author);

    if (p.data == false || p.data == null)
        p.data = {'master': {}};
    var project = p.data;

    // Side Menus
    var mastermenu = $("#scenario-menu-template").html();
    for (s in project) {
        var tmp = mastermenu.replace(/template/g, s);
        tmp = tmp.replace("title", s.charAt(0).toUpperCase() + s.slice(1));
        var name = "";
        if (project[s].scenario_name != undefined)
            name = project[s].scenario_name;
        tmp = tmp.replace("scenarioname", " " + name.charAt(0).toUpperCase() + name.slice(1));
        $("#scenario-list").append(tmp);
    }
    $(".menu-content").hide();
    $(".scenario-block[scenario=master]").find(".delete-scenario-launch").hide();
    $(".scenario-block[scenario=master]").find(".menu-content").show();

    var keys = {};

    run_backwards_compatibility();

    for (s in project) {
        // QUESTION: do you really want to do calc.run twice here?
        project[s] = calc.run(calc.run(project[s]));
        $("." + s + "_sap_rating").html(project[s].SAP.rating.toFixed(0));
    }

    var tmp = (window.location.hash).substring(1).split('/');
    var page = tmp[1];
    var scenario = tmp[0];
    if (!scenario)
        scenario = "master";
    if (!page)
        page = "context";

    $(".menu-content").hide();
    $('[scenario="' + scenario + '"]').find(".menu-content").show();

    if (project[scenario] == undefined)
        scenario = 'master';
    data = project[scenario];

    if (data.measures == undefined)
        data.measures = {};

    load_view("#content", page);
    InitUI();
    UpdateUI(data);
    draw_openbem_graphics();

    // Lock/unlock
    if (page != "librariesmanager" && page != 'imagegallery' && page != 'export' && page != 'householdquestionnaire' && page != 'currentenergy') {
        $('#content button').addClass('if-not-locked');
        $('#content i').addClass('if-not-locked');
    }
    if (project[scenario].locked != undefined && project[scenario].locked == true)
        $('.if-not-locked').hide();
    else
        $('.if-not-locked').show();

    // Show lock in scenario
    for (s in project) {
        if (project[s].locked == undefined)
            project[s].locked = false;

        if (project[s].locked == false)
            $(".scenario-block[scenario=" + s + "]").find(".lock").html('Lock');
        else
            $(".scenario-block[scenario=" + s + "]").find(".lock").html('<i class="icon-lock"></i> Unlock');
    }

    // Disable measures if master
    show_hide_if_master();

    $("#openbem").on('click', '.lock', function () {
        if (data.locked == false) {
            data.locked = true;
            $(".scenario-block[scenario=" + scenario + "]").find(".lock").html('<i class="icon-lock"></i> Unlock');
            $('.if-not-locked').hide();
        }
        else {
            data.locked = false;
            $(".scenario-block[scenario=" + scenario + "]").find(".lock").html('Lock');
            $('.if-not-locked').show();
        }

        // Disable measures if master
        show_hide_if_master();

        update();
    });


    $(window).on('hashchange', function () {
        var tmp = (window.location.hash).substring(1).split('/');
        page = tmp[1]; //scenario = tmp[0];
        scenario = tmp[0];

        if (!scenario)
            scenario = "master";
        if (!page)
            page = "context";

        if (project[scenario] == undefined)
            scenario = 'master';

        data = project[scenario];

        // Update the type of the libraries we are using
        /*if (typeof library_helper != "undefined") {
         if (page == "system")
         library_helper.type = 'systems';
         else
         library_helper.type = page;
         }*/

        // Render page
        load_view("#content", page);
        InitUI();
        UpdateUI(data);
        draw_openbem_graphics();

        // Add lock functionality to buttons and icons
        if (page != "librariesmanager" && page != 'imagegallery' && page != 'export' && page != 'householdquestionnaire' && page != 'currentenergy') {
            $('#content button').addClass('if-not-locked');
            $('#content i').addClass('if-not-locked');
        }

        // Disable measures if master
        show_hide_if_master();

        if (data.locked)
            $('.if-not-locked').hide();
        else
            $('.if-not-locked').show();

        // Disable measures if master
        show_hide_if_master();

    });

    function update()
    {
        console.log("updating");
        project[scenario] = calc.run(project[scenario]);
        data = project[scenario];

        UpdateUI(data);
        draw_openbem_graphics();

        $("." + scenario + "_sap_rating").html(project[scenario].SAP.rating.toFixed(0));

        openbem.set(projectid, project, function (result) {
            alertifnotlogged(result);
        });
    }

    function show_hide_if_master()
    {
        if (scenario == 'master')
            $('#content .if-not-master').hide();
        else {
            $('#content .if-master').hide();
            $('#content .disabled-if-not-master').attr('disabled', 'true');
        }
    }

    function run_backwards_compatibility() {
        // NOthing to do tight now       
    }

    $("#openbem").on("change", '[key]', function () {
        if (data.locked == true && page != "librariesmanager" && page != 'imagegallery' && page != 'export' && page != 'householdquestionnaire' && page != 'currentenergy')
            $('#modal-scenario-locked').modal('show');
        else {
            var key = $(this).attr('key');
            var val = $(this).val();
            var input_type = $(this).attr('type');
            if (input_type == 'checkbox')
                val = $(this)[0].checked;
            if (input_type == 'textarea')
                val = $(this).html();

            if (!isNaN(val) && val != "")
                val *= 1;

            if (key == 'data.use_SHW')
                data.water_heating.solar_water_heating = !data.use_SHW; // I don't know why but only works properly coping the negative

            var lastval = varset(key, val);

            $("#openbem").trigger("onKeyChange", {key: key, value: val});

            console.log(key + " changed from " + lastval + " to " + val);
            changelog += key + " changed from " + lastval + " to " + val + "<br>";
        }
        update();
    });

    $("#openbem").on('click', ".scenario-block", function () {
        var s = $(this).attr('scenario');
        //  if (s != scenario) {
        window.location = '#' + s + '/' + page;
        $(".menu-content").hide();
        $(this).find(".menu-content").show();
        /*
         data = project[scenario];
         load_view("#content", page);
         InitUI();
         UpdateUI(data);
         draw_openbem_graphics();
         */
        // }
    });

    $('#openbem').on('click', '.project-menu-item', function () {
        $('.scenario-block[scenario=master]').click();
        $('.menu-content').hide();
    });

    $("#openbem").on('click', "#create-new", function () {
        // Reset select
        $('#select-scenario').html("");

        // Fill up the select
        for (z in project)
            $('#select-scenario').append("<option value='" + z + "'>" + z + "</option>");

        $('#modal-create-scenario').modal('show');
    });

    $("#modal-create-scenario").on('click', '#modal-create-scenario-done', function () {
        var n = 0;
        for (z in project)
            n++;
        var s = "scenario" + n;

        project[s] = JSON.parse(JSON.stringify(project[$('#select-scenario').val()]));

        // dont make a copy of the following properties
        project[s].household = {};
        project[s].imagegallery = [];
        project[s].currentenergy = {};
        project[s].fabric.measures = {};
        project[s].measures = {};

        // Ensure new scenario is unlocked
        project[s].locked = false;

        var tmp = mastermenu.replace(/template/g, s);
        tmp = tmp.replace("title", s.charAt(0).toUpperCase() + s.slice(1));

        $(".menu-content").hide();
        $("#scenario-list").append(tmp);
        $('#modal-create-scenario').modal('hide');

        scenario = s;
        update();
        $('div [scenario="' + s + '"]').click();
    });

    $("#openbem").on('click', ".delete-scenario-launch", function () {
        var s = $(this).parent().parent().parent().attr('scenario');
        if (s != "master") {
            $("#modal-delete-scenario").modal("show");
            $("#modal-delete-scenario").attr("scenario", s);
        }
    });

    $("#delete-scenario-confirm").click(function () {
        var s = $("#modal-delete-scenario").attr('scenario');

        if (s != "master")
            delete project[s];
        $(".scenario-block[scenario=" + s + "]").hide();

        scenario = "master";
        $(".scenario-block[scenario=master]").find(".menu-content").click();

        update();
        $("#modal-delete-scenario").modal("hide");
    });


    $("#edit-project-name-and-description").on('click', function () {
        $("#project-name-input").val(p.name);
        $("#project-description-input").val(p.description);
        $("#modal-edit-project-name-and-description").modal("show");
    });
    $('#assessment-update-name-and-description').on('click', function () {
        p.name = $("#project-name-input").val();
        p.description = $('#project-description-input').val();
        $("#project-title").html(p.name);
        $("#project-description").html(p.description);
        $("#modal-edit-project-name-and-description").modal("hide");
        openbem.set_name_and_description(projectid, p.name, p.description);
    });
    $("#modal-error-submitting-data-done").on('click', function () {
        location.reload();
    });



    //-------------------------------------------------------------------

    $(".house_graphic").click(function () {
        if ($(".house_graphic").html() == "Show house graphic") {
            $("#topgraphic").show();
            $("#rating").hide();
            $(".house_graphic").html("Hide house graphic");
        } else {
            $("#topgraphic").hide();
            $("#rating").show();
            $(".house_graphic").html("Show house graphic");
        }
    }
    );
    $("#topgraphic").show();
    $("#rating").hide();
    $(".house_graphic").html("Hide house graphic");

    $(window).resize(function () {
        draw_openbem_graphics();
    });

</script>
