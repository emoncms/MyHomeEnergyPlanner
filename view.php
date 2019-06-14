<?php
global $path, $app_color, $app_title, $app_description, $MHEP_image_gallery;

$d = $path . "Modules/assessment/";
$projectid = (int) $_GET['id'];

if (is_null($args["openBEM_version"]))
    $openBEM_version = "10.1.0";  // first version of the model since we started recording it
else
    $openBEM_version = $args["openBEM_version"];
?>       

<!--<link href='http://fonts.googleapis.com/css?family=Ubuntu:300' rel='stylesheet' type='text/css'>-->
<link rel="stylesheet" href="<?php echo $d; ?>style.css">

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/mhep-helper.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-helper-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-mhep.js"></script>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/library-r6.js"></script>
<script language="javascript" type="text/javascript" src="https://cdn.jsdelivr.net/gh/carboncoop/openBEM@<?php echo $openBEM_version; ?>/datasets.js"></script>
<script language="javascript" type="text/javascript" src="https://cdn.jsdelivr.net/gh/carboncoop/openBEM@<?php echo $openBEM_version; ?>/openBEM.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/targetbar-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/arrow-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/library-helper/library-helper-r1.js"></script>

<!--<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/canvas-barchart/barchart.js"></script>-->
<link rel="stylesheet" href="<?php echo $d; ?>js/jquery-ui-1.12.1/jquery-ui.min.css">
<script src="<?php echo $d; ?>js/jquery-ui-1.12.1/jquery-ui.min.js"></script>

<!-- open floor uvalue calculator -->
<script type="text/javascript" src="<?php echo $d; ?>js/openFUVC/openFUVC.js"></script>
<script type="text/javascript" src="<?php echo $d; ?>js/openFUVC/openFUVC-ui-helper.js"></script>
<link rel="stylesheet" href='<?php echo $d; ?>js/openFUVC/openFUVC.css'>

<style>
    :root {
        --app-color: <?php echo $app_color; ?>;
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

<div id="openbem">
    <div id="sidebar">
        <div class="side-block">
            <div class="block-header">Project: <span id="project-title"></span> <a id="edit-project-name-and-description" href="#"><i class="icon-edit"></i></a></div>
            <div style="padding:10px">

                <p style="font-size:14px">Description: <span id="project-description"></span></p>
                <p style="font-size:14px">Author: <span id="project-author"></span></p>

                <div class="scenario-nav-heading">Project input</div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/householdquestionnaire">Household Questionnaire</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/commentary">Commentary</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/currentenergy">Current Energy</a></div>
                <?php if ($MHEP_image_gallery === true) { ?>
                    <div class="scenario-nav"><a class="project-menu-item" href="#master/imagegallery">Image gallery</a></div>
                <?php } ?>
                <div class="scenario-nav-heading">Other</div>
                <div id="links-to-reports"></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/compare">MHEP Report</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/export">Import/Export</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/librariesmanager">Libraries manager</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/fuelsmanager">Fuels manager</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/openBEM_version">openBEM version</a></div>
            </div>
        </div>

        <div id="scenario-menu-template" style="display:none">

            <div class="side-block scenario-block" scenario="template" style="cursor:pointer">

                <div class="block-header" style="height:40px">title<span style="float:right">scenarioname<br>(<span class="template_scenario_emissions"></span> <span style="font-size:12px">kgCO<sub>2</sub>/m<sup>2</sup></span>)</span><br /><span class="template_scenario_created_from" style='float:left'></span></div>

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
                        <div class="scenario-nav"><a href="#template/generation">Generation</a></div>
                        <div class="scenario-nav-heading">Extended input</a></div>
                        <div class="scenario-nav"><input type="checkbox" key="data.use_SHW"/> <a href="#template/solarhotwater">Solar Hot Water heating</a></div>
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

        <div class="side-block">
            <div id="create-new" class="block-header">
                Create new scenario
            </div>
        </div>

        <div style="background:none; padding:20px">

            <div class="scenario-nav-heading">Documentation</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/MyHomeEnergyPlanner">User guide</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/ElementLibrary">A Fabric elements Library</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/readme">Building Energy Modelling</a></div>
        </div>
    </div>

    <div id="wrapper">
        <div style="height:10px"></div>
        <div class="scenario-name"></div>
        <a class="house_graphic" style="margin:-30px 30px; float:right; cursor:pointer">Show house graphic</a>
        <div id="topgraphic" class="overview"></div>
        <div id="bound">
            <div id="content">
            </div>
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
<div id="modal-assessment-locked" class="modal alert-danger hide" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="true">
    <div class="modal-header">
        <h3>The assessment is locked!</h3>
    </div>
    <div class="modal-body">
        <p>Your changes won't be saved.</p>
        <p>To unlock the assessment change the status from "Complete" to "In progress".</p>
    </div>
    <div class="modal-footer">
        <button id="modal-assessment-locked-done" data-dismiss="modal" class="btn btn-danger">Done</button>
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
        <button type="button" class="btn" data-dismiss="modal" aria-hidden="true"><?php echo _('Cancel'); ?></button>
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

    //$('#openBem-model').load("https://cdn.jsdelivr.net/gh/carboncoop/openBEM@10.1.0/openBEM.js");
    /*$.holdReady(true);
     $.getScript("https://cdn.jsdelivr.net/gh/carboncoop/openBEM@10.1.0/openBEM.js", function () {
     $.holdReady(false);
     });*/

    //************
    // Variables
    //************
    var changelog = "";
    var selected_library = -1;
    var selected_library_tag = "Wall";
    var printmode = false;
    var report = undefined;
    var page = undefined;
    var locked = <?php echo json_encode($args['locked']); ?>;
    scenario = ""; //I put it here to be clear this is a global variable, it will be set later on from the hash in URL
    var data = {};

    var path = "<?php echo $path; ?>";
    var jspath = path + "Modules/assessment/";

    var keys = {};

    //*******************
    // Load top graphic
    //*******************
    load_view("#topgraphic", 'topgraphic');

    //*********************
    // Initialize project
    //********************
    var projectid = <?php echo $projectid; ?>;
    var p = mhep_helper.get(projectid);

    $("#project-title").html(p.name);
    $("#project-description").html(p.description);
    $("#project-author").html(p.author);

    if (p.data == false || p.data == null)
        p.data = {'master': {}};
    var project = p.data;

    //********************************
    // Initialize undo functionality
    //*******************************
    var historical = [];
    var historical_index; // pointer for the historical array, pointing the current version of project
    historical.unshift(JSON.stringify(project));
    historical_index = 0;
    $('ul.nav.pull-right').prepend('<li id="redo"><a><img src="' + path + 'Modules/assessment/img-assets/redo.gif" title="Redo" style="width:14px" /></a></li>');
    $('ul.nav.pull-right').prepend('<li id="undo"><a><img src="' + path + 'Modules/assessment/img-assets/undo.gif" title="Undo" style="width:14px" / > </a></li > ');
    refresh_undo_redo_buttons();

    //**************************
    // Initialize some menus
    //**************************
    $(".menu-content").hide();
    $(".scenario-block[scenario=master]").find(".delete-scenario-launch").hide();
    $(".scenario-block[scenario=master]").find(".menu-content").show();

    //*******************************************************************
    // Initialize fuels: ensure all the scenarios have the same fuels
    //*******************************************************************
    if (project.master.fuels == undefined)
        project.master.fuels = JSON.parse(JSON.stringify(datasets.fuels));

    for (s in project)
        project[s].fuels = project.master.fuels;

    //******************************
    // Calculate scenarios
    //******************************
    for (s in project) {
        project[s] = calc.run(project[s]);
        $("." + s + "_scenario_emissions").html(project[s].kgco2perm2.toFixed(0));
    }

    //**********************************************
    // Fetch from hash the view to load and load it
    //**********************************************
    load_page_from_hash();

    //************************
    // Side Menus
    //************************
    add_scenarios_to_menu();

    //***********************************
    // Add links to reports in the menu
    //***********************************
    add_reports_to_menu();

    //*****************
    // Top graphic
    //*****************
    $("#topgraphic").show();
    $("#rating").hide();
    $(".house_graphic").html("Hide house graphic");

    //****************
    // Sidebar
    //****************
    var max_wrapper_width = 1150;
    var sidebar_enabled = true;
    var sidebar_visible = true;
    $("#assessment_menu").parent().attr("href", "#");
    $("#assessment_menu").find("i").removeClass("icon-home");
    $("#assessment_menu").find("i").addClass("icon-list");
    sidebar_resize();

    //*********************
    // Assessment locked?
    //*********************
    if (locked === true) {
        setTimeout(function () {
            $('#modal-assessment-locked').modal('show');
        }, 1);
    }



    //**********
    // Events
    //**********
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

        update(false, false);
    });
    $("#openbem").on("change", '[key]', function () {
        if (data.locked == true && page != "librariesmanager" && page != 'imagegallery' && page != 'export' && page != 'householdquestionnaire' && page != 'currentenergy' && page != 'commentary')
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
        update(false, false);
    });
    $(window).on('hashchange', function () {
        load_page_from_hash();
    });
    $(".house_graphic").click(function () {
        if ($(".house_graphic").html() == "Show house graphic") {
            $(".overview").show();
            $("#rating").hide();
            $(".house_graphic").html("Hide house graphic");
        }
        else {
            $(".overview").hide();
            $("#rating").show();
            $(".house_graphic").html("Show house graphic");
        }
    });
    // Scenarios interactions
    $("#openbem").on('click', ".scenario-nav", function () {
        $(window).scrollTop(650);
    });
    $("#openbem").on('click', ".block-header", function () {

        var s = $(this).parent().attr('scenario');
        //  if (s != scenario) {
        window.location = '#' + s + '/' + page;

        var menu_content = $(this).parent().find(".menu-content");
        var visible = menu_content.is(":visible");
        $(".menu-content").hide();
        if (!visible)
            menu_content.show();

        $(window).scrollTop(0);
    });
    $('#openbem').on('click', '.project-menu-item', function () {
        $('.scenario-block[scenario=master]').click();
        $('.menu-content').hide();
        $(window).scrollTop(0);
    });
    // Scenarios management
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
        for (z in project) {
            var scenario_number = z.slice(8);
            if (z != 'master' && n != scenario_number) // if for a reason a scenario was deleted, when we create a new one it takes its position. Example: we have master, scenario1 and scenario2. We delete scenario1. We create a new one that becomes scenario1
                break;
            n++;
        }
        var s = "scenario" + n;
        project[s] = JSON.parse(JSON.stringify(project[$('#select-scenario').val()]));
        project[s].locked = false;
        project[s].creation_hash = generate_hash(JSON.stringify(project[s]));
        project[s].measures = {};
        project[s].fabric.measures = {};
        project[s].fabric.elements.forEach(function (element) {
            if (element.cost_total != undefined)
                delete element.cost_total;
        });
        project[s].created_from = $('#select-scenario').val();

        //sort project alphabetically
        temp_project = {};
        Object.keys(project)
                .sort()
                .forEach(function (v, i) {
                    temp_project[v] = project[v];
                });
        project = JSON.parse(JSON.stringify(temp_project));

        $(".menu-content").hide();
        add_scenarios_to_menu();
        $('#modal-create-scenario').modal('hide');

        scenario = s;
        page = 'context';
        update();
        $(".scenario-block[scenario=" + s + "] .block-header").click();
        $(window).scrollTop(0);
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
        scenario = 'master';
        page = "context"

        update();
        $("#modal-delete-scenario").modal("hide");
        $(".scenario-block[scenario=master] .block-header").click();
        $(window).scrollTop(0);

    });
    // Project's name and description management
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
        mhep_helper.set_name_and_description(projectid, p.name, p.description);
    });
    $("#modal-error-submitting-data-done").on('click', function () {
        location.reload();
    });
    // Do/undo
    $('ul.nav.pull-right').on('click', '#undo', function () {
        if (historical_index < historical.length - 1) {
            historical_index++;
            project = JSON.parse(historical[historical_index]);
            update(true);
        }

        refresh_undo_redo_buttons();
    });
    $('ul.nav.pull-right').on('click', '#redo', function () {
        if (historical_index > 0) {
            historical_index--;
            project = JSON.parse(historical[historical_index]);
            update(true);
        }

        refresh_undo_redo_buttons();
    });
    // Side menu
    $(window).resize(function () {
        draw_openbem_graphics('#topgraphic');
        sidebar_resize();
    });
    $("#assessment_menu").parent().click(function () {
        if (sidebar_visible) {
            sidebar_enabled = false;
            hide_sidebar();
        }
        else {
            sidebar_enabled = true;
            show_sidebar();
        }
    });


    //*************
    // Functions
    //*************
    function update(undo_redo = false, reload_menu = false) {
        // We need to calculate the periods of heating off here because if we try to do it in household.js it happens after the update
        if (project.master.household != undefined) {
            for (var s in project) { // we ensure all the scenarios have the same household data and heating off periods
                project[s].household = project.master.household;
                project[s].temperature.hours_off.weekday = get_hours_off_weekday(project[s]);
                project[s].temperature.hours_off.weekend = get_hours_off_weekend(project[s]);
            }
        }

        project[scenario] = calc.run(project[scenario]);
        data = project[scenario];
        if (undo_redo === false) {
            historical.splice(0, historical_index); // reset the historical removing all the elements that were still there because of undoing
            historical.unshift(JSON.stringify(project));
            historical_index = 0;
            refresh_undo_redo_buttons();
        }

        UpdateUI(data);
        draw_openbem_graphics('#topgraphic');

        $("." + scenario + "_scenario_emissions").html(project[scenario].kgco2perm2.toFixed(0));

        mhep_helper.set(projectid, project, function (result) {
            alertifnotlogged(result);
            alert_if_assessment_locked(result);
        });
    }
    function show_hide_if_master() {
        if (scenario == 'master')
            $('#content .if-not-master').hide();
        else {
            $('#content .if-master').hide();
            $('#content .disabled-if-not-master').attr('disabled', 'true');
        }
    }
    function add_scenarios_to_menu() {
        $("#scenario-list").html('');
        var mastermenu = $("#scenario-menu-template").html();
        for (s in project) {
            var tmp = mastermenu.replace(/template/g, s);
            tmp = tmp.replace("title", s.charAt(0).toUpperCase() + s.slice(1));
            var name = "";
            if (project[s].scenario_name != undefined)
                name = project[s].scenario_name;
            tmp = tmp.replace("scenarioname", " " + String(name).charAt(0).toUpperCase() + String(name).slice(1));
            $("#scenario-list").append(tmp);
        }
        for (s in project) {
            //project[s] = calc.run(calc.run(project[s]));
            $("." + s + "_scenario_emissions").html(project[s].kgco2perm2.toFixed(0));
            if (s != 'master' && project[s].created_from != undefined) {
                $("." + s + "_scenario_created_from").html("(From " + project[s].created_from + ')');
                // Check if the original scenario has changed since the the creation of the current one
                if (project[project[s].created_from] == undefined) // If the parent scenario has been deleted
                    $("." + s + "_scenario_created_from").html("(From " + project[s].created_from + ' - deleted)');
                else if (project[s].creation_hash != undefined) {
                    var original_scenario = JSON.parse(JSON.stringify(project[project[s].created_from]));
                    original_scenario.locked = false;
                    hash_original = generate_hash(JSON.stringify(original_scenario));
                    if (project[s].creation_hash != generate_hash(JSON.stringify(original_scenario))) {
                        $("." + s + "_scenario_created_from").html("(From " + project[s].created_from + '*)');
                        $("." + s + "_scenario_created_from").attr('title', 'The original scenario has changed since the creation of Scenario ' + s.split('scenario')[1]);
                    }
                }
            }
        }
        $('div [scenario="' + scenario + '"]').click();
    }
    function add_reports_to_menu() {
        var reports = <?php echo json_encode($args['reports']); ?>;
        reports.forEach(function (report) {
            var html = '<div class="scenario-nav"> <a class="project-menu-item" class="link-to-report" href="#master/report/' + report.view + '">' + report.name + '</a></div>';
            $('#links-to-reports').append(html);
        })
    }
    function load_page_from_hash() {
        var tmp = (window.location.hash).substring(1).split('/');
        page = tmp[1];
        scenario = tmp[0];

        if (page == "report" && tmp[2] != undefined)
            report = tmp[2];
        else
            report = undefined;

        if (!scenario)
            scenario = "master";
        if (!page)
            page = "context";

        if (project[scenario] == undefined)
            scenario = 'master';

        data = project[scenario];

        // Render page
        if (page != 'report') {
            load_view("#content", page);
            $('#topgraphic').show();
        }
        else {
            // Load MHEP report and make the html available for the report we are loading
            scenarios_comparison = {};
            scenarios_measures_summary = {};
            scenarios_measures_complete = {}
            if (view_html['compare'] == undefined) {
                $.ajax({url: jspath + "views/compare.js", async: false, cache: false});
            }
            for (var s in project) {
                if (s != 'master') {
                    scenarios_comparison[s] = compareCarbonCoop(s);
                    scenarios_measures_summary[s] = getMeasuresSummaryTable(s);
                    scenarios_measures_complete[s] = getMeasuresCompleteTables(s);
                }
            }

            load_report("#content", report);
        }

        InitUI();
        UpdateUI(data);
        draw_openbem_graphics('#topgraphic');

        // Add lock functionality to buttons and icons
        if (page != "librariesmanager" && page != 'imagegallery' && page != 'export' && page != 'householdquestionnaire' && page != 'currentenergy' && page != 'commentary') {
            $('#content button').addClass('if-not-locked');
            $('#content i').addClass('if-not-locked');
            $('#content .revert-to-original').each(function () {
                if ($(this).css('display') != 'none')
                    $(this).addClass('if-not-locked');
            });
        }

        // Disable measures if master
        show_hide_if_master();

        if (data.locked)
            $('.if-not-locked').hide();
        else
            $('.if-not-locked').show();

        // Disable measures if master
        show_hide_if_master();

        // Make modals draggable
        $("#openbem .modal-header").css("cursor", "move");
        $("#openbem .modal").draggable({
            handle: ".modal-header"
        });
    }
    function refresh_undo_redo_buttons() {
        if (historical_index == historical.length - 1) {
            $('#undo').css('opacity', 0.1);
            $('#undo').css('cursor', 'default');
        }
        else {
            $('#undo').css('opacity', 1);
            $('#undo').css('cursor', 'pointer');
        }

        if (historical_index > 0) {
            $('#redo').css('opacity', 1);
            $('#redo').css('cursor', 'pointer');
        }
        else {
            $('#redo').css('opacity', 0.1);
            $('#redo').css('cursor', 'default');
        }
    }
    function generate_hash(string) {
        var hash = 0, i, chr;
        if (string.length === 0)
            return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    function sidebar_resize() {
        var width = $(window).width();
        var height = $(window).height();
        var nav = $(".navbar").height();
        $("#sidebar").height(height - nav);

        if (width < max_wrapper_width) {
            hide_sidebar()
        }
        else {
            if (sidebar_enabled)
                show_sidebar()
        }
    }
    function show_sidebar() {
        var width = $(window).width();
        sidebar_visible = true;
        $("#sidebar").css("left", "340px");
        if (width >= max_wrapper_width)
            $("#wrapper").css("padding-left", "330px");
        $("#wrapper").css("margin", "0");
        $("#sidenav-open").hide();
        $("#sidenav-close").hide();
    }
    function hide_sidebar() {
        sidebar_visible = false;
        $("#sidebar").css("left", "0");
        $("#wrapper").css("padding-left", "0");
        $("#wrapper").css("margin", "0 auto");
        $("#sidenav-open").show();
    }

</script>
