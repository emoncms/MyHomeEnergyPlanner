<?php

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

function assessment_controller() {
    global $session, $route, $mysqli, $fullwidth;
    global $MHEP_image_gallery; // Should be set in settings.php to allow image gallery functionality
    $fullwidth = true;

    /* --------------------------------------------------------------------------
      // Backwards compatibility:
      // During development, i am finding many situations when we need to do something
      // make what is implemented compatible with the previous version. This section
      // is here fot his pourpose and will be deleted when the final realease is made
      //---------------------------------------------------------------------------- */
    /* if (!isset($_SESSION['backwards_comp'])) { // We only run when we start the session
      $_SESSION['backwards_comp'] = true;
      }
     */

    /* $libresult = $mysqli->query("SELECT `id`, `data` FROM `element_library` WHERE `type`='elements_measures'");
      foreach ($libresult as $row) {
      $data = json_decode($row['data']);
      foreach ($data as $element) {
      $element->min_cost = 100;
      }
      $req = $mysqli->prepare("UPDATE `element_library` SET `data`=? WHERE `id`=?");
      $data = json_encode($data);
      $req->bind_param('si', $data, $row['id']);
      $req->execute();
      } */
    //require "Modules/assessment/assessment_model.php";
    //$assessment = new Assessment($mysqli);
    //$assessment->edit_item_in_all_libraries('elements', 'DRD04', 'uvalue', 2.6);


    /* $libresult = $mysqli->query("SELECT id,data FROM assessment");
      $i = 0;
      foreach ($libresult as $row) {
      $data = json_decode($row['data']);
      $fuel = "7-Hour tariff - High Rate";
      $data->master->fuels->$fuel->standingcharge = 79;
      $fuel = "10-hour tariff - High Rate";
      $data->master->fuels->$fuel->standingcharge = 77;
      $req = $mysqli->prepare("UPDATE `assessment` SET `data`=? WHERE `id`=?");
      $data = json_encode($data);
      $req->bind_param('si', $data, $row['id']);
      $req->execute();
      } */

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

    require_once "Modules/assessment/assessment_model.php";
    $assessment = new Assessment($mysqli);
// -------------------------------------------------------------------------    
// Session is authenticated so we run the action
// -------------------------------------------------------------------------
    $result = false;
    if ($route->format == 'html') {
        if ($route->action == "view" && $session['write']) {
            $locked = $assessment->completed(get('id'));
            $reports = $assessment->accesible_reports($session['userid']);
            $openBEM_version = $assessment->get_openBEM_version($session['userid'], get('id'));
            $result = view("Modules/assessment/view.php", array('reports' => $reports, 'locked' => $locked, "openBEM_version" => $openBEM_version));
        }

        if ($route->action == "list" && $session['write'])
            $result = view("Modules/assessment/projects.php", array());
    }

    if ($route->format == 'json') {

        require_once "Modules/assessment/organisation_model.php";
        $organisation = new Organisation($mysqli);

// -------------------------------------------------------------------------------------------------------------
// Create assessment
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'create' && $session['write']) {
            $result = $assessment->create($session['userid'], get('name'), get('description'), get('openBEM_version'));

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
            }
            else {
                $result = $assessment->get_list($session['userid']);
            }
        }

        if ($route->action == 'delete' && $session['write'])
            $result = $assessment->delete($session['userid'], get('id'));
        if ($route->action == 'deleteallfromuser' && $session['write'])
            $result = $assessment->delete_all_from_user($session['userid']);
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
        if ($route->action == 'setopenBEMversion' && $session['write']) {
            $openBEM_version = prop('openBEM_version');
            $result = $assessment->set_openBEM_version($session['userid'], prop('id'), $openBEM_version);
        }

// -------------------------------------------------------------------------------------------------------------
// Assessment data
// -------------------------------------------------------------------------------------------------------------        

        if ($route->action == 'setdata' && $session['write']) {
            if (!$assessment->completed(post('id'))) {
                $data = null;
                if (isset($_POST['data']))
                    $data = $_POST['data'];
                if (!isset($_POST['data']) && isset($_GET['data']))
                    $data = $_GET['data'];
                if ($data && $data != null)
                    $result = $assessment->set_data($session['userid'], post('id'), $data);
            }
            else
                $result = "Assessment locked";
        }

        if ($route->action == 'setnameanddescription' && $session['write']) {
            if (!$assessment->completed(post('id'))) {
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
            else
                $result = "Assessment locked";
        }

// -------------------------------------------------------------------------------------------------------------
// Organisation
// -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'neworganisation' && $session['write'] && isset($_GET['orgname'])) {
            $orgname = $_GET['orgname'];
            $orgid = $organisation->create($orgname, $session['userid']);
            if ($orgid) {
                $result = array("success" => true, "myorganisations" => $organisation->get_organisations($session['userid']));
            }
            else {
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
        if ($route->action == 'listlibrary' && $session['write'])
            $result = $assessment->listlibrary($session['userid']);

        if ($route->action == 'newlibrary' && $session['write'])
            $result = $assessment->newlibrary($session['userid'], get('name'), get('type'));

        if ($route->action == 'copylibrary' && $session['write'])
            $result = $assessment->copylibrary($session['userid'], get('name'), get('type'), get('id'));
        if ($route->action == 'savelibrary' && $session['write'] && isset($_POST['data'])) {
            $result = $assessment->savelibrary($session['userid'], post('id'), $_POST['data']);
        }
        if ($route->action == 'additemtolibrary' && $session['write']) {
            $result = $assessment->additemtolibrary($session['userid'], post('library_id'), $_POST["item"], $_POST['tag']);
        }

        if ($route->action == 'edititeminlibrary' && $session['write']) {
            $result = $assessment->edititeminlibrary($session['userid'], post('library_id'), $_POST["item"], $_POST['tag']);
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
        if ($MHEP_image_gallery === true) {
            if ($route->action == 'uploadimages' && $session['write']) {
                if (!$assessment->completed(post('id')))
                    $result = $assessment->saveimages($session['userid'], post('id'), $_FILES);
                else
                    $result = "Assessment locked";
            }

            if ($route->action == 'deleteimage' && $session['write']) {
                if (!$assessment->completed(post('id')))
                    $result = $assessment->deleteimage($session['userid'], post('id'), post('filename'));
                else
                    $result = "Assessment locked";
            }
        }


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
