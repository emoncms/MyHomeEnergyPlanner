<?php
global $path;
$d = $path . "Modules/assessment/";

$projectid = (int) $_GET['id'];

global $reports;
?>        

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/openbem-r4.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-helper-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/ui-openbem-r3.js"></script>

<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/library-r5.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/datasets-r4.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/model-r5.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/model/appliancesPHPP-r1.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>graph-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/targetbar-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/vectormath-r3.js"></script>
<script language="javascript" type="text/javascript" src="<?php echo $d; ?>js/arrow-r3.js"></script>

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
</style>

<link rel="stylesheet" href="<?php echo $d; ?>carbon.css">
<script type="text/javascript" src="<?php echo $d; ?>data.js"></script>


<div id="openbem">
    <div id="left-pane">

        <div class="side-block">
            <h3>Project: <span id="project-title"></span> <a id="edit-project-name-and-description" href="#"><i class="icon-edit"></i></a></h3>
            <p style="font-size:14px">Description: <span id="project-description"></span></p>
            <p style="font-size:14px">Author: <span id="project-author"></span></p>
            <a class="house_graphic" style="margin-right:10px">Show house graphic</a>

        </div>

        <div id="scenario-menu-template" style="display:none">

            <div class="side-block scenario-block" scenario="template" style="cursor:pointer">

                <h3>title scenarioname (<span class="template_sap_rating"></span>)</h3>


                <div class="menu-content">
                    <div class="scenario-nav-heading">Core input</a></div>
                    <div class="scenario-nav"><a href="#template/context">Floors</a></div>
                    <div class="scenario-nav"><a href="#template/ventilation">Ventilation</a></div>
                    <div class="scenario-nav"><a href="#template/elements">Fabric</a></div>
                    <div class="scenario-nav"><a href="#template/system">Energy System</a></div>
                    <div class="scenario-nav"><a href="#template/LAC">Lighting, Appliances & Cooking</a></div>
                    <div class="scenario-nav-heading">Extended input</a></div>
                    <div class="scenario-nav"><a href="#template/householdquestionnaire">Household Questionnaire</a></div>
                    <div class="scenario-nav"><a href="#template/imagegallery">Image gallery</a></div>
                    <div class="scenario-nav"><a href="#template/currentenergy">Current Energy</a></div>
                    <div class="scenario-nav"><input type="checkbox" key="data.use_water_heating"/> <a href="#template/waterheating">Water Heating</a></div>
                    <div class="scenario-nav"><input type="checkbox" key="data.use_SHW"/> <a href="#template/solarhotwater">Solar Hot Water heating</a></div>
                    <div class="scenario-nav"><input type="checkbox" key="data.use_appliancePHPP"/> <a href="#template/appliancePHPP">Appliances PHPP calculation</a></div>
                    <div class="scenario-nav"><input type="checkbox" key="data.use_appliancelist"/> <a href="#template/appliancelist">Detailed Appliance List</a></div>
                    <div class="scenario-nav"><input type="checkbox" key="data.use_generation"/> <a href="#template/generation">Generation</a></div>
                    <div class="scenario-nav-heading">Reporting</a></div>
                    <div class="scenario-nav"><a href="#template/compare">Show difference</a></div>
                    <?php foreach ($reports as $report) { ?>
                        <div class="scenario-nav"><a href="#template/<?php echo $report['docname']; ?>"><?php echo $report['fullname']; ?></a></div>
                    <?php } ?>
                    <div class="scenario-nav"><a href="#template/export">Import/Export</a></div>
                    <div class="scenario-nav"><a href="#template/detail">Detailed view</a></div>
                    <div class="scenario-nav"><a href="#template/changelog">Session change log</a></div>
                    <br>
                    <!--<div class="scenario-nav delete-scenario">Delete scenario <i class="icon-trash"></i></div>-->

                </div>
            </div>

        </div>

        <div id="scenario-list"></div>

        <div id="create-new">
            Create new scenario
        </div>

        <div class="side-block" style="background:none">

            <div class="scenario-nav-heading">Documentation</a></div>
            <div class="scenario-nav"><a href="https://github.com/emoncms/openbem/blob/v3/docs/guide.md">User guide</a></div>
            <div class="scenario-nav"><a href="https://github.com/emoncms/openbem/blob/v3/docs/ElementLibrary.md">Element Library</a></div>
            <div class="scenario-nav"><a href="https://github.com/openenergymonitor/documentation/tree/master/BuildingBlocks/BuildingEnergyModelling">Building Energy Modelling</a></div>
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

</body>
</html>                                		


<script>

    var changelog = "";
    var selected_library = -1;
    var selected_library_tag = "Wall";

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


    var mastermenu = $("#scenario-menu-template").html();
    for (s in project) {
        var tmp = mastermenu.replace(/template/g, s);
        tmp = tmp.replace("title", s.charAt(0).toUpperCase() + s.slice(1));
        var name = "";
        if (project[s].scenario_name != undefined)
            name = project[s].scenario_name;
        tmp = tmp.replace("scenarioname", ": " + name.charAt(0).toUpperCase() + name.slice(1));
        $("#scenario-list").append(tmp);
    }
    $(".menu-content").hide();
    $(".scenario-block[scenario=master]").find(".menu-content").show();



    var keys = {};

    for (s in project) {
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

    if (project[scenario] == undefined)
        scenario = 'master';
    data = project[scenario];

    load_view("#content", page);
    InitUI();
    UpdateUI(data);
    draw_openbem_graphics();

    $(window).on('hashchange', function () {
        var tmp = (window.location.hash).substring(1).split('/');
        page = tmp[1]; //scenario = tmp[0];

        data = project[scenario];

        load_view("#content", page);
        InitUI();
        UpdateUI(data);
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

    $("#openbem").on("change", '[key]', function () {
        var key = $(this).attr('key');
        var val = $(this).val();
        var input_type = $(this).attr('type');
        if (input_type == 'checkbox')
            val = $(this)[0].checked;
        if (input_type == 'textarea')
            val = $(this).html();

        if (!isNaN(val) && val != "")
            val *= 1;
        var lastval = varset(key, val);

        $("#openbem").trigger("onKeyChange", {key: key, value: val});
        update();

        console.log(key + " changed from " + lastval + " to " + val);
        changelog += key + " changed from " + lastval + " to " + val + "<br>";
    });

    $("#openbem").on('click', ".scenario-block", function () {
        var s = $(this).attr('scenario');
        if (s != scenario) {
            scenario = s;
            $(".menu-content").hide();
            $(this).find(".menu-content").show();

            data = project[scenario];
            load_view("#content", page);
            InitUI();
            UpdateUI(data);
            draw_openbem_graphics();
        }
    });

    $("#create-new").click(function () {

        var n = 0;
        for (z in project)
            n++;
        var s = "scenario" + n;

        project[s] = JSON.parse(JSON.stringify(project.master));

        var tmp = mastermenu.replace(/template/g, s);
        tmp = tmp.replace("title", s.charAt(0).toUpperCase() + s.slice(1));

        $(".menu-content").hide();
        $("#scenario-list").append(tmp);

        scenario = s;
        update();
    });

    $("#openbem").on('click', ".delete-scenario", function () {
        var s = $(this).parent().parent().attr('scenario');

        if (s != "master")
            delete project[s];
        scenario = "master";
        $(".scenario-block[scenario=" + s + "]").hide();

        update();
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

    $("#openbem").on('click', '[key="data.use_appliancePHPP"]', function () {
        if (data.use_appliancePHPP === 1)
            data.use_appliancelist = false;
        update();
    });
    $("#openbem").on('click', '[key="data.use_appliancelist"]', function () {
        if (data.use_appliancelist === 1)
            data.use_appliancePHPP = false;
        update();
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
