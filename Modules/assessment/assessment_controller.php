<?php

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

function assessment_controller() {
    global $session, $route, $mysqli;

    /* --------------------------------------------------------------------------
      // Backwards compatibility:
      // During development, i am finding many situations when we need to do something
      // make what is implemented compatible with the previous version. This section
      // is here fot his pourpose and will be deleted when the final realease is made
      //---------------------------------------------------------------------------- */
    if (!isset($_SESSION['backwards_comp'])) { // We only run when we start the session
        $_SESSION['backwards_comp'] = true;

// Rename standard libraries to include users name (important to identify libraries after sharing
        $libresult = $mysqli->query("SELECT id,name,userid FROM element_library");
        foreach ($libresult as $row) {
            if ($row['name'] === "StandardLibrary") {
                $user_name = $mysqli->query("SELECT username FROM users WHERE id = " . $row['userid']);
                $user_name = $user_name->fetch_object();
                $user_name = $user_name->username;
                $req = $mysqli->prepare('UPDATE element_library SET `name` = ? WHERE `id` = ?  ');
                $new_name = "StandardLibrary - " . $user_name;
                $req->bind_param("si", $new_name, $row['id']);
                $req->execute();
            }
        }


// Add "type" to element library table in database (if it doesn't exist), and for all the libraries set the type to elements (this were the original type so we can be sure that at the moment of adding the column all the libraries are type "element"
        $columns_in_table = $mysqli->query("DESCRIBE element_library");
        $field_found = false;
        foreach ($columns_in_table as $column) {
            if ($column['Field'] === 'type')
                $field_found = true;
        }
        if ($field_found === false)
            $mysqli->query("ALTER TABLE  `element_library` ADD  `type` VARCHAR( 255 ) NOT NULL DEFAULT  'elements' AFTER  `name`");

// Grant all the users write permissions for their own library
        $libresult = $mysqli->query("SELECT * FROM `element_library`");
        foreach ($libresult as $row) {
            $req = $mysqli->prepare("UPDATE `element_library_access` SET `write`='1' WHERE `userid`=? AND `id`=?");
            $req->bind_param('ii', $row['userid'], $row['id']);
            $req->execute();
        }

// Add fans_and_pumps and keep hot facility for combi boilers to systems in existing libraries
        $libresult = $mysqli->query("SELECT * FROM `element_library`WHERE `type`='systems'");
        foreach ($libresult as $row) {
            $library = json_decode($row['data']);
            $update_needed = false;
            foreach ($library as $system_key => $system) {
                if (!isset($system->combi_keep_hot)) {
                    $update_needed = true;
                    $system->combi_keep_hot = 0;
                    switch ($system_key) {
                        case 'gasboiler':
                        case 'heatpump':
                        case 'woodbatch':
                        case 'woodpellet':
                            $system->fans_and_pumps = 45;
                            break;
                        case 'oilboiler':
                            $system->fans_and_pumps = 100;
                            break;
                        default:
                            $system->fans_and_pumps = 0;
                            break;
                    }
                }
            }
            if ($update_needed === true) {
                $req = $mysqli->prepare("UPDATE `element_library` SET `data`=? WHERE `id`=?");
                $library = json_encode($library);
                $req->bind_param('si', $library, $row['id']);
                $req->execute();
            }
        }
// Add fans_and_pumps and keep hot facility of comi boilers to systems in existing energy_systems in scenarios
        $assesment_result = $mysqli->query("SELECT * FROM `assessment`");
        foreach ($assesment_result as $row) {
            $scenarios = json_decode($row['data']);
            $gsd = is_array($scenarios);
            $update_needed = false;
            ini_set('display_errors', 0);
            foreach ($scenarios as $scenario) {
                foreach ($scenario->energy_systems as $energy_system) {
                    foreach ($energy_system as $system_key => $system) {
                        if (!isset($system->combi_keep_hot)) {
                            $update_needed = true;
                            $system->combi_keep_hot = 0;
                            switch ($system_key) {
                                case 'gasboiler':
                                case 'heatpump':
                                case 'woodbatch':
                                case 'woodpellet':
                                    $system->fans_and_pumps = 45;
                                    break;
                                case 'oilboiler':
                                    $system->fans_and_pumps = 100;
                                    break;
                                default:
                                    $system->fans_and_pumps = 0;
                                    break;
                            }
                        }
                    }
                }
            }
            ini_set('display_errors', 1);
            if ($update_needed === true) {
                $req = $mysqli->prepare("UPDATE `assessment` SET `data`=? WHERE `id`=?");
                $scenarios = json_encode($scenarios);
                $req->bind_param('si', $scenarios, $row['id']);
                $req->execute();
            }
        }

// Add party walls to users elements libraries, and if it is already there check theat the type (tags[0]) has the first letter upper case
        $libresult = $mysqli->query("SELECT id,data FROM element_library WHERE `type` = 'elements'");
        foreach ($libresult as $row) {
            $data = json_decode($row['data']);
            $iuy = 0;
            if (!isset($data->PW1) || $data->PW1->tags[0] == 'party_wall') {
                $data->PW1 = (object) array(
                            'name' => "Solid (including structurally insulated panel)",
                            'source' => "SAP2012, table 3.6, p.20",
                            'uvalue' => 0,
                            'kvalue' => 140,
                            'tags' => ["Party_wall"],
                            'criteria' => [],
                            'description' => '--',
                            'performance' => '--',
                            'benefits' => '--',
                            'cost' => 0,
                            'who_by' => '--',
                            'disruption' => '--',
                            'associated_work' => '--',
                            'key_risks' => '--',
                            'notes' => '--',
                            'maintenance' => '--'
                );
                $data->PW2 = (object) array(
                            'name' => "Unfilled cavity with no effective edge sealing)",
                            'source' => "SAP2012, table 3.6, p.20",
                            'uvalue' => 0.5,
                            'kvalue' => 140,
                            'tags' => ["Party_wall"],
                            'criteria' => [],
                            'description' => 'Unfilled cavity with no effective edge sealing))',
                            'performance' => '--',
                            'benefits' => '--',
                            'cost' => 0,
                            'who_by' => '--',
                            'disruption' => '--',
                            'associated_work' => '--',
                            'key_risks' => '--',
                            'notes' => '--',
                            'maintenance' => '--'
                );
                $data->PW3 = (object) array(
                            'name' => "Unfilled cavity with effective sealing around all exposed edges and in line with insulation layers in abutting elements",
                            'source' => "SAP2012, table 3.6, p.20",
                            'uvalue' => 0.2,
                            'kvalue' => 140,
                            'tags' => ["Party_wall"],
                            'criteria' => [],
                            'description' => 'Unfilled cavity with effective sealing around all exposed edges and in line with insulation layers in abutting elements',
                            'performance' => '--',
                            'benefits' => '--',
                            'cost' => 0,
                            'who_by' => '--',
                            'disruption' => '--',
                            'associated_work' => '--',
                            'key_risks' => '--',
                            'notes' => '--',
                            'maintenance' => '--'
                );
                $data->PW4 = (object) array(
                            'name' => "Fully filled cavity with effective sealing at all exposed edges and in line with insulation layers in abutting elements",
                            'source' => "SAP2012, table 3.6, p.20",
                            'uvalue' => 0,
                            'kvalue' => 140,
                            'tags' => ["Party_wall"],
                            'criteria' => [],
                            'description' => 'Fully filled cavity with effective sealing at all exposed edges and in line with insulation layers in abutting elements',
                            'performance' => '--',
                            'benefits' => '--',
                            'cost' => 0,
                            'who_by' => '--',
                            'disruption' => '--',
                            'associated_work' => '--',
                            'key_risks' => '--',
                            'notes' => '--',
                            'maintenance' => '--'
                );
                $data = json_encode($data);
                $req = $mysqli->prepare('UPDATE element_library SET `data` = ? WHERE `id` = ?  ');
                $req->bind_param("si", $data, $row['id']);
                $req->execute();
            }
        }

// Add 'location' to the elements in existing libraries
        $libresult = $mysqli->query("SELECT id,data FROM element_library WHERE `type` = 'elements'");
        foreach ($libresult as $row) {
            $update_needed = false;
            $library = json_decode($row['data']);
            foreach ($library as $item) {
                if (!isset($item->location)) {
                    $update_needed = true;
                    $item->location = '';
                }
            }
            if ($update_needed === true) {
                $req = $mysqli->prepare("UPDATE `element_library` SET `data`=? WHERE `id`=?");
                $library = json_encode($library);
                $req->bind_param('si', $library, $row['id']);
                $req->execute();
            }
        }

// Add 'EWI' to the wall elements in existing elements_measures libraries
        $libresult = $mysqli->query("SELECT id,data FROM element_library WHERE `type` = 'elements_measures'");
        foreach ($libresult as $row) {
            $library = json_decode($row['data']);
            foreach ($library as $item) {
                if ($item->tags[0] == 'Wall' && $item->name == "External Wall Insulation 160-200mm")
                    $item->EWI = true;
                elseif ($item->tags[0] == 'Wall' && $item->name == "Solid brick wall. ")
                    $item->EWI = false;
            }
            $req = $mysqli->prepare("UPDATE `element_library` SET `data`=? WHERE `id`=?");
            $library = json_encode($library);
            $req->bind_param('si', $library, $row['id']);
            $req->execute();
        }

// Add a Door and a Roof light to users elements libraries
        $libresult = $mysqli->query("SELECT id,data FROM element_library WHERE `type` = 'elements'");
        foreach ($libresult as $row) {
            $data = json_decode($row['data']);
            if (!isset($data->DR1)) {
                $data->DR1 = (object) array(
                            'name' => "Timber door",
                            'source' => "GEM",
                            'uvalue' => 2.8,
                            'kvalue' => 1,
                            'g' => 0.76,
                            'gl' => 0.8,
                            'ff' => 0.4,
                            'tags' => ["Door"],
                            'criteria' => [],
                            'description' => 'Timber door top light',
                            'performance' => '--',
                            'benefits' => '--',
                            'cost' => 0,
                            'who_by' => '--',
                            'disruption' => '--',
                            'associated_work' => '--',
                            'key_risks' => '--',
                            'notes' => '--',
                            'maintenance' => '--'
                );
                $data->RL1 = (object) array(
                            'name' => "12mm Velux",
                            'source' => "GEM",
                            'uvalue' => 3.4,
                            'kvalue' => 1,
                            'g' => 0.76,
                            'gl' => 0.8,
                            'ff' => 0.7,
                            'tags' => ["Roof_light"],
                            'criteria' => [],
                            'description' => '12mm Velux',
                            'performance' => '--',
                            'benefits' => '--',
                            'cost' => 0,
                            'who_by' => '--',
                            'disruption' => '--',
                            'associated_work' => '--',
                            'key_risks' => '--',
                            'notes' => '--',
                            'maintenance' => '--'
                );
                $data = json_encode($data);
                $req = $mysqli->prepare('UPDATE element_library SET `data` = ? WHERE `id` = ?  ');
                $req->bind_param("si", $data, $row['id']);
                $req->execute();
            }
        }
    }

    /* End backwards compatibility section */


// -------------------------------------------------------------------------
// Check if session has been authenticated, if not redirect to login page (html) 
// or send back "false" (json)
// -------------------------------------------------------------------------
    if (!$session['read']) {
        if ($route->format == 'html')
            $result = view("Modules/user/login_block.php", array());
        else
            $result = "Not logged";
        return array('content' => $result);
    }

// -------------------------------------------------------------------------    
// Session is authenticated so we run the action
// -------------------------------------------------------------------------
    $result = false;
    if ($route->format == 'html') {
        if ($route->action == "view" && $session['write'])
            $result = view("Modules/assessment/view.php", array());
        if ($route->action == "print" && $session['write'])
            $result = view("Modules/assessment/print.php", array());

        if ($route->action == "list" && $session['write'])
            $result = view("Modules/assessment/projects.php", array());
    }

    if ($route->format == 'json') {

        require "Modules/assessment/assessment_model.php";
        $assessment = new Assessment($mysqli);

        require "Modules/assessment/organisation_model.php";
        $organisation = new Organisation($mysqli);

// -------------------------------------------------------------------------------------------------------------
// Create assessment
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'create' && $session['write']) {
            $result = $assessment->create($session['userid'], get('name'), get('description'));

            if (isset($_GET['org'])) {
                $orgid = (int) $_GET['org'];
                $assessment->org_access($result['id'], $orgid, 1);
            }
        }

// -------------------------------------------------------------------------------------------------------------
// List assessments
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'list' && $session['write']) {
            if (isset($_GET['orgid'])) {
                $orgid = $_GET['orgid'];
                $result = $assessment->get_org_list($orgid);
            } else {
                $result = $assessment->get_list($session['userid']);
            }
        }

        if ($route->action == 'delete' && $session['write'])
            $result = $assessment->delete($session['userid'], get('id'));
        if ($route->action == 'share' && $session['write'])
            $result = $assessment->share($session['userid'], get('id'), get('username'));
        if ($route->action == 'getshared' && $session['write'])
            $result = $assessment->getshared($session['userid'], get('id'));
        if ($route->action == 'get' && $session['write'])
            $result = $assessment->get($session['userid'], get('id'));

        if ($route->action == 'setstatus' && $session['write']) {
            if (isset($_GET['status'])) {
                $status = $_GET['status'];
                $result = $assessment->set_status($session['userid'], get('id'), $status);
            }
        }

        if ($route->action == 'setdata' && $session['write']) {
            $data = null;
            if (isset($_POST['data']))
                $data = $_POST['data'];
            if (!isset($_POST['data']) && isset($_GET['data']))
                $data = $_GET['data'];
            if ($data && $data != null)
                $result = $assessment->set_data($session['userid'], post('id'), $data);
        }

        if ($route->action == 'setnameanddescription' && $session['write']) {
            $name = null;
            if (isset($_POST['name']))
                $name = $_POST['name'];
            if (!isset($_POST['name']) && isset($_GET['name']))
                $name = $_GET['name'];

            $description = null;
            if (isset($_POST['description']))
                $description = $_POST['description'];
            if (!isset($_POST['description']) && isset($_GET['description']))
                $description = $_GET['description'];

            if ($name && $name != null && $description && $description != null)
                $result = $assessment->set_name_and_description($session['userid'], post('id'), $name, $description);
        }

// -------------------------------------------------------------------------------------------------------------
// Organisation
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'neworganisation' && $session['write'] && isset($_GET['orgname'])) {
            $orgname = $_GET['orgname'];
            $orgid = $organisation->create($orgname, $session['userid']);
            if ($orgid) {
                $result = array("success" => true, "myorganisations" => $organisation->get_organisations($session['userid']));
            } else {
                $result = array("success" => false, "message" => 'Organisation "' . $orgname . '" already exists!');
            }
        }

        if ($route->action == 'getorganisations' && $session['write']) {
            $result = $organisation->get_organisations($session['userid']);
        }

        if ($route->action == "organisationaddmember" && $session['write']) {
            $orgid = (int) $_GET['orgid'];
            $username = $_GET['membername'];
            global $user;
            if ($userid = $user->get_id($username)) {
                if ($organisation->add_member($orgid, $userid)) {
                    $result = array("success" => true, 'userid' => $userid, 'name' => $username, 'lastactive' => "?");
                } else {
                    $result = array("success" => false, "message" => 'Sorry, user "' . $username . '" is already a member');
                }
            } else {
                $result = array("success" => false, "message" => 'Sorry, user "' . $username . '" does not exist!?');
            }
        }

        if ($route->action == 'listlibrary' && $session['write'])
            $result = $assessment->listlibrary($session['userid']);

        if ($route->action == 'newlibrary' && $session['write'])
            $result = $assessment->newlibrary($session['userid'], get('name'), get('type'));

        if ($route->action == 'copylibrary' && $session['write'])
            $result = $assessment->copylibrary($session['userid'], get('name'), get('type'), get('id'));

// -------------------------------------------------------------------------------------------------------------
// Library
// -------------------------------------------------------------------------------------------------------------        
        if ($route->action == 'savelibrary' && $session['write'] && isset($_POST['data'])) {
            $result = $assessment->savelibrary($session['userid'], post('id'), $_POST['data']);
        }
        if ($route->action == 'additemtolibrary' && $session['write']) {
            $result = $assessment->additemtolibrary($session['userid'], post('library_id'), $_POST['item'], $_POST['tag']);
        }
        if ($route->action == 'loadlibrary' && $session['write'])
            $result = $assessment->loadlibrary($session['userid'], get('id'));

        if ($route->action == 'loaduserlibraries' && $session['write'])
            $result = $assessment->loaduserlibraries($session['userid']);

        if ($route->action == 'sharelibrary' && $session['write'])
            $result = $assessment->sharelibrary($session['userid'], get('id'), get('name'), get('write_permissions'));

        if ($route->action == 'getsharedlibrary' && $session['write'])
            $result = $assessment->getsharedlibrary($session['userid'], get('id'));

        if ($route->action == 'getuserpermissions' && $session['write'])
            $result = $assessment->getuserpermissions($session['userid']);

        if ($route->action == 'removeuserfromsharedlibrary' && $session['write'])
            $result = $assessment->removeuserfromsharedlibrary($session['userid'], get('library_id'), get('user_to_remove'));

        if ($route->action == 'setlibraryname' && $session['write'])
            $result = $assessment->setlibraryname($session['userid'], get('library_id'), get('new_library_name'));

        if ($route->action == 'deletelibrary' && $session['write'])
            $result = $assessment->deletelibrary($session['userid'], get('library_id'));

        if ($route->action == 'deletelibraryitem' && $session['write'])
            $result = $assessment->deletelibraryitem($session['userid'], get('library_id'), get('tag'));
// -------------------------------------------------------------------------------------------------------------
// Image gallery
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'uploadimages' && $session['write'])
            $result = $assessment->saveimages($session['userid'], post('id'), $_FILES);

        if ($route->action == 'deleteimage' && $session['write'])
            $result = $assessment->deleteimage($session['userid'], post('id'), post('filename'));


// Upgrade (temporary)    
        /*
          if ($route->action == "upgrade" && $session['admin'])
          {
          $result = $mysqli->query("SELECT id, userid, author FROM assessment");
          $out = array();
          while ($row = $result->fetch_object()) {
          $out[] = $row;
          $assessment->access($row->id,$row->userid,1);
          }
          $result = $out;
          }
         */
    }

    return array('content' => $result, 'fullwidth' => true);
}
