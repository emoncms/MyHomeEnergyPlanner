<?php
global $path;
$d = $path . "Modules/assessment/";

$projectid = (int) $_GET['id'];

global $reports;
?>        

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/openbem-r4.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-helper-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-openbem-r3.js"></script>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/library-r6.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/datasets-r5.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/model-r9.js"></script>
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
            <div style="background-color:rgba(215, 210, 201, 0.9); color:#897A67; padding:10px;width"><b>Project: <span id="project-title"></span> <a id="edit-project-name-and-description" href="#"><i class="icon-edit"></i></a></b></div>
            <div style="padding:10px">

                <p style="font-size:14px">Description: <span id="project-description"></span></p>
                <p style="font-size:14px">Author: <span id="project-author"></span></p>
                <a class="house_graphic" style="margin-right:10px">Show house graphic</a>
                <br><br>

                <div class="scenario-nav-heading">Project input</div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/householdquestionnaire">Household Questionnaire</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/currentenergy">Current Energy</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/imagegallery">Image gallery</a></div>
                <div class="scenario-nav-heading">Other</div>
                <div class="scenario-nav"><a class="project-menu-item" class="link-to-report" href="#master/carboncoopreport/org=CarbonCoop">Carbon Coop Report</a></div>
                <div class="scenario-nav"><a class="project-menu-item" class="link-to-report" href="#master/carboncoopreport/org=CAfS">CAfS Report</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/compare">MHEP Report</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/export">Import/Export</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/librariesmanager">Libraries manager</a></div>
                <div class="scenario-nav"><a class="project-menu-item" href="#master/fuelsmanager">Fuels manager</a></div>
            </div>
        </div>

        <div id="scenario-menu-template" style="display:none">

            <div class="side-block-2 scenario-block" scenario="template" style="cursor:pointer">

                <div style="background-color:rgba(215, 210, 201, 0.9); color:#897A67; padding:10px;height:40px"><b>title<span style="float:right">scenarioname<br /><span class="template_scenario_emissions"></span> kgCO<sub>2</sub>/m<sup>2</sup></span><br /><span class="template_scenario_created_from" style='float:left'></span></b></div>

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
            <div class="scenario-nav"><a target='_blank' href="https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/MyHomeEnergyPlanner">User guide</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/ElementLibrary">A Fabric elements Library</a></div>
            <div class="scenario-nav"><a target='_blank' href="https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/readme">Building Energy Modelling</a></div>
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
    //var org_report = ''; //

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

    var historical = []; // used for the undo functionality
    var historical_index; // pointer for the historical array, pointing the current version of project
    historical.unshift(JSON.stringify(project));
    historical_index = 0;
    $('ul.nav.pull-right').prepend('<li id="redo"><a><img src="' + path + 'Modules/assessment/img-assets/redo.gif" title="Redo" style="width:14px" /></a></li>');
    $('ul.nav.pull-right').prepend('<li id="undo"><a><img src="' + path + 'Modules/assessment/img-assets/undo.gif" title="Undo" style="width:14px" / > </a></li > ');
    refresh_undo_redo_buttons();

    $(".menu-content").hide();
    $(".scenario-block[scenario=master]").find(".delete-scenario-launch").hide();
    $(".scenario-block[scenario=master]").find(".menu-content").show();

    var keys = {};

    run_backwards_compatibility();

    // Ensure all the scenarios have the same fuels
    if (project.master.fuels == undefined)
        project.master.fuels = JSON.parse(JSON.stringify(datasets.fuels));
    ;
    for (scenario in project)
        project[scenario].fuels = project.master.fuels;

    for (s in project) {
        // QUESTION: do you really want to do calc.run twice here?
        project[s] = calc.run(calc.run(project[s]));
        $("." + s + "_scenario_emissions").html(project[s].kgco2perm2.toFixed(0));
    }

    // Side Menus
    add_scenarios_to_menu();

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

    function update(undo_redo = false)
    {
        console.log("updating");

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
        draw_openbem_graphics();

        $("." + scenario + "_scenario_emissions").html(project[scenario].kgco2perm2.toFixed(0));
        
        add_scenarios_to_menu();

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
        // March 2017 -Added with Issue 220: 'Current Energy' fuel energy cost and carbon discrepancies
        if (project['master'] != undefined && project['master'].currentenergy != undefined) {
            var data_rb = project['master'];
            if (data_rb.currentenergy.use_by_fuel == undefined)
                data_rb.currentenergy.use_by_fuel = {};
            if (typeof data_rb.currentenergy.energyitems != 'undefined') {
                console.log('Running Current Energy backwards compatibility ');
                for (var energy_item in data_rb.currentenergy.energyitems) {
                    var item = data_rb.currentenergy.energyitems[energy_item];
                    if (item.selected === 1) {
                        if (item.group == 'Electric') {
                            if (data_rb.currentenergy.use_by_fuel['Standard Tariff'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Standard Tariff'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Standard Tariff'].annual_use += item.quantity;
                        }
                        else if (item.name == 'Electricity (Economy 7 night rate)') {
                            if (data_rb.currentenergy.use_by_fuel['7 Hour tariff - Low Rate'] == undefined)
                                data_rb.currentenergy.use_by_fuel['7 Hour tariff - Low Rate'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['7 Hour tariff - Low Rate'].annual_use += item.quantity;
                        }
                        else if (item.name == 'Electricity (Economy 7 day rate)') {
                            if (data_rb.currentenergy.use_by_fuel['7-Hour tariff - High Rate'] == undefined)
                                data_rb.currentenergy.use_by_fuel['7-Hour tariff - High Rate'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['7-Hour tariff - High Rate'].annual_use += item.quantity;
                        }
                        else if (item.name == 'Mains gas in kWh') {
                            if (data_rb.currentenergy.use_by_fuel['Mains Gas'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Mains Gas'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Mains Gas'].annual_use += item.quantity;
                        }
                        else if (item.name == 'Mains gas') {
                            if (data_rb.currentenergy.use_by_fuel['Mains Gas'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Mains Gas'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Mains Gas'].annual_use += 9.8 * item.quantity;
                        }
                        else if (item.name == 'Wood Logs') {
                            if (data_rb.currentenergy.use_by_fuel['Wood Logs'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Wood Logs'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Wood Logs'].annual_use += 1380 * item.quantity;
                        }
                        else if (item.name == 'Wood Pellets') {
                            if (data_rb.currentenergy.use_by_fuel['Wood Pellets secondary heating/ in bags'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Wood Pellets secondary heating/ in bags'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Wood Pellets (secondary heating/ in bags)'].annual_use += 4800 * item.quantity;
                        }
                        else if (item.name == 'Oil') {
                            if (data_rb.currentenergy.use_by_fuel['Heating Oil'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Heating Oil'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Heating Oil'].annual_use += 10.27 * item.quantity;
                        }
                        else if (item.name == 'LPG') {
                            if (data_rb.currentenergy.use_by_fuel['Bulk LPG'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Bulk LPG'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Bulk LPG'].annual_use += item.quantity;
                        }
                        else if (item.name == 'Bottled gas') {
                            if (data_rb.currentenergy.use_by_fuel['Bottled LPG'] == undefined)
                                data_rb.currentenergy.use_by_fuel['Bottled LPG'] = {annual_use: 0, annual_co2: 0, primaryenergy: 0, annualcost: 0};
                            data_rb.currentenergy.use_by_fuel['Bottled LPG'].annual_use += 13.9 * item.quantity;
                        }
                    }
                }
                delete data_rb.currentenergy.energyitems;
            }
        }
        // 9 June 2017 fix problems in Dom's assessment (very very old)
        for (scenario in project) {
            if (project[scenario].fabric != undefined) {
                for (e in project[scenario].fabric.elements) {
                    if (project[scenario].fabric.elements[e].type == 'window')
                        project[scenario].fabric.elements[e].type = 'Window';
                    if (project[scenario].fabric.elements[e].type == 'door')
                        project[scenario].fabric.elements[e].type = 'Door';
                    if (project[scenario].fabric.elements[e].type == 'wall')
                        project[scenario].fabric.elements[e].type = 'Wall';
                    if (project[scenario].fabric.elements[e].type == 'roof')
                        project[scenario].fabric.elements[e].type = 'Roof';
                    if (project[scenario].fabric.elements[e].type == 'floor')
                        project[scenario].fabric.elements[e].type = 'Floor';
                }
            }
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
                if (project[s].creation_hash != undefined) {
                    var original_scenario = JSON.parse(JSON.stringify(project[project[s].created_from]));
                    original_scenario.locked = false;
                    hash_original = generate_hash(JSON.stringify(original_scenario));
                    if (project[s].creation_hash != generate_hash(JSON.stringify(original_scenario))){
                        $("." + s + "_scenario_created_from").html("(From " + project[s].created_from + '*)');
                    $("." + s + "_scenario_created_from").attr('title', 'The original scenario has changed since the creation of Scenario ' + s.split('scenario')[1]);
                    }
                }
            }
        }
        $('div [scenario="' + scenario + '"]').click();
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

    // Scenarios menu interactions
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
        project[s].created_from = $('#select-scenario').val();

        //sort project alphabetically
        temp_project = {};
        Object.keys(project)
                .sort()
                .forEach(function (v, i) {
                    temp_project[v] = project[v];
                });
        project = JSON.parse(JSON.stringify(temp_project));



        /*var mastermenu = $("#scenario-menu-template").html();
         var tmp = mastermenu.replace(/template/g, s);
         tmp = tmp.replace("title", s.charAt(0).toUpperCase() + s.slice(1));*/

        $(".menu-content").hide();
        add_scenarios_to_menu();
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
        openbem.set_name_and_description(projectid, p.name, p.description);
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
    ;


    //-----
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
    }
    );

</script>
