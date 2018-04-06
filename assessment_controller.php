<?php

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

function assessment_controller() {
    global $session, $route, $mysqli, $fullwidth;
    $fullwidth = true;
    
    // Default route format
    $route->format = 'json';

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
    if ($route->action == "view") {
        $route->format = 'html';
        $result = view("Modules/assessment/view.php", array());
    } else if ($route->action == "print") {
        $route->format = 'html';
        $result = view("Modules/assessment/print.php", array());
    } else if ($route->action == "projects") {
        $route->format = 'html';
        $result = view("Modules/assessment/projects.php", array());
    }

    if ($route->format == 'json') {

        require_once "Modules/assessment/assessment_model.php";
        $assessment = new Assessment($mysqli);

        require_once "Modules/assessment/organisation_model.php";
        $organisation = new Organisation($mysqli);

// -------------------------------------------------------------------------------------------------------------
// Create assessment
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'create') {
            $result = $assessment->create($session['userid'], get('name'), get('description'));

            if (isset($_GET['org'])) {
                $orgid = (int) $_GET['org'];
                $assessment->org_access($result['id'], $orgid, 1);
            }
        }

// -------------------------------------------------------------------------------------------------------------
// List assessments
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'list') {
            if (isset($_GET['orgid'])) {
                $orgid = $_GET['orgid'];
                $result = $assessment->get_org_list($orgid);
            }
            else {
                $result = $assessment->get_list($session['userid']);
            }
        }

        if ($route->action == 'delete')
            $result = $assessment->delete($session['userid'], get('id'));
        if ($route->action == 'share')
            $result = $assessment->share($session['userid'], get('id'), get('username'));
        if ($route->action == 'getshared')
            $result = $assessment->getshared($session['userid'], get('id'));
        if ($route->action == 'get')
            $result = $assessment->get($session['userid'], get('id'));

        if ($route->action == 'setstatus') {
            if (isset($_GET['status'])) {
                $status = $_GET['status'];
                $result = $assessment->set_status($session['userid'], get('id'), $status);
            }
        }

        if ($route->action == 'setdata') {
            $data = null;
            if (isset($_POST['data']))
                $data = $_POST['data'];
            if (!isset($_POST['data']) && isset($_GET['data']))
                $data = $_GET['data'];
            if ($data && $data != null)
                $result = $assessment->set_data($session['userid'], post('id'), $data);
        }

        if ($route->action == 'setnameanddescription') {
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
        if ($route->action == 'neworganisation' && isset($_GET['orgname'])) {
            $orgname = $_GET['orgname'];
            $orgid = $organisation->create($orgname, $session['userid']);
            if ($orgid) {
                $result = array("success" => true, "myorganisations" => $organisation->get_organisations($session['userid']));
            }
            else {
                $result = array("success" => false, "message" => 'Organisation "' . $orgname . '" already exists!');
            }
        }

        if ($route->action == 'getorganisations') {
            $result = $organisation->get_organisations($session['userid']);
        }

        if ($route->action == "organisationaddmember") {
            $orgid = (int) $_GET['orgid'];
            $username = $_GET['membername'];
            global $user;
            if ($userid = $user->get_id($username)) {
                if ($organisation->add_member($orgid, $userid)) {
                    $result = array("success" => true, 'userid' => $userid, 'name' => $username, 'lastactive' => "?");
                }
                else {
                    $result = array("success" => false, "message" => 'Sorry, user "' . $username . '" is already a member');
                }
            }
            else {
                $result = array("success" => false, "message" => 'Sorry, user "' . $username . '" does not exist!?');
            }
        }

// -------------------------------------------------------------------------------------------------------------
// Library
// -------------------------------------------------------------------------------------------------------------  
        if ($session['write']) {
              
            if ($route->action == 'listlibrary')
                $result = $assessment->listlibrary($session['userid']);

            else if ($route->action == 'newlibrary')
                $result = $assessment->newlibrary($session['userid'], get('name'));

            else if ($route->action == 'copylibrary')
                $result = $assessment->copylibrary($session['userid'], get('name'), get('id'), get('linked'));
                
            else if ($route->action == 'savelibrary' && isset($_POST['data']))
                $result = $assessment->savelibrary($session['userid'], post('id'), $_POST['data']);
                
            else if ($route->action == 'loadlibrary')
                $result = $assessment->loadlibrary($session['userid'], get('id'));

            else if ($route->action == 'loaduserlibraries')
                $result = $assessment->loaduserlibraries($session['userid']);

            else if ($route->action == 'sharelibrary')
                $result = $assessment->sharelibrary($session['userid'], get('id'), get('name'), get('write_permissions'));

            else if ($route->action == 'getsharedlibrary')
                $result = $assessment->getsharedlibrary($session['userid'], get('id'));

            else if ($route->action == 'getuserpermissions')
                $result = $assessment->getuserpermissions($session['userid']);

            else if ($route->action == 'removeuserfromsharedlibrary')
                $result = $assessment->removeuserfromsharedlibrary($session['userid'], get('library_id'), get('user_to_remove'));

            else if ($route->action == 'setlibraryname')
                $result = $assessment->setlibraryname($session['userid'], get('library_id'), get('new_library_name'));

            else if ($route->action == 'deletelibrary')
                $result = $assessment->deletelibrary($session['userid'], get('library_id'));

            else if ($route->action == 'setuplibraries') { 
                $route->format = "text";
                $name = "master";
                $result = $mysqli->query("SELECT COUNT(*) FROM mhep_library");
                $row = $result->fetch_row();
                if ($row[0]==0) {
                    if ($result = $mysqli->query("INSERT INTO mhep_library (`name`) VALUES ('$name')")) {
                        $id = $mysqli->insert_id;
                        $mysqli->query("INSERT INTO mhep_library_access (`id`,`userid`,`orgid`,`write`,`public`) VALUES ('$id','0','0','0','1')");
                        $result = $id;
                    }
                } else {
                    $result = "libraries already setup";
                }
            }
        }
        
        
        
// -------------------------------------------------------------------------------------------------------------
// Image gallery
// -------------------------------------------------------------------------------------------------------------
        // if ($route->action == 'uploadimages')
        // $result = $assessment->saveimages($session['userid'], post('id'), $_FILES);

        // if ($route->action == 'deleteimage')
        // $result = $assessment->deleteimage($session['userid'], post('id'), post('filename'));


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
