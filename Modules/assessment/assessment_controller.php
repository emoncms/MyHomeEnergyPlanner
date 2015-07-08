<?php

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

function assessment_controller()
{
    global $session, $route, $mysqli;
    
    $result = false;
    
    if (!isset($session['read'])) 
        return array('content'=>$result);

    if ($route->format == 'html') {
        if ($route->action == "view" && $session['write'])
            $result = view("Modules/assessment/view.php",array());
            
        if ($route->action == "list" && $session['write'])
            $result = view("Modules/assessment/projects.php",array());
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
            $result = $assessment->create($session['userid'],get('name'),get('description'));
            
            if (isset($_GET['org'])) {
                $orgid = (int) $_GET['org'];
                $assessment->org_access($result['id'],$orgid,1);
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
        
        if ($route->action == 'delete' && $session['write']) $result = $assessment->delete($session['userid'],get('id'));
        if ($route->action == 'share' && $session['write']) $result = $assessment->share(get('id'),get('username'));
        if ($route->action == 'getshared' && $session['write']) $result = $assessment->getshared(get('id'));
        if ($route->action == 'get' && $session['write']) $result = $assessment->get($session['userid'],get('id'));
        
        if ($route->action == 'setstatus' && $session['write']) {
            if (isset($_GET['status'])) {
                $status = $_GET['status'];
                $result = $assessment->set_status($session['userid'],get('id'),$status);
            }
        }
        
        if ($route->action == 'setdata' && $session['write']) {
            $data = null;
            if (isset($_POST['data'])) $data = $_POST['data'];
            if (!isset($_POST['data']) && isset($_GET['data'])) $data = $_GET['data'];
            if ($data && $data!=null) $result = $assessment->set_data($session['userid'],post('id'),$data);
        }

        // -------------------------------------------------------------------------------------------------------------
        // Organisation
        // -------------------------------------------------------------------------------------------------------------
        if ($route->action == 'neworganisation' && $session['write'] && isset($_GET['orgname'])) {
            $orgname = $_GET['orgname'];
            $orgid = $organisation->create($orgname,$session['userid']);
            if ($orgid) {
                $result = array("success"=>true, "myorganisations"=>$organisation->get_organisations($session['userid']));
            } else {
                $result = array("success"=>false, "message"=>'Organisation "'.$orgname.'" already exists!');
            }  
        }

        if ($route->action == 'getorganisations' && $session['write']) {
            $result = $organisation->get_organisations($session['userid']);
        }
        
        if ($route->action == "organisationaddmember" && $session['write']) 
        {
            $orgid = (int) $_GET['orgid'];
            $username = $_GET['membername'];
            global $user;
            if ($userid = $user->get_id($username)) {
                if ($organisation->add_member($orgid,$userid)) {
                    $result = array("success"=>true, 'userid'=>$userid, 'name'=>$username, 'lastactive'=>"?");
                } else {
                    $result = array("success"=>false, "message"=>'Sorry, user "'.$username.'" is already a member');
                }
            } else {
                $result = array("success"=>false, "message"=>'Sorry, user "'.$username.'" does not exist!?');
            }
        }
        
        // Save library
        if ($route->action == 'savelibrary' && $session['write'] && isset($_POST['data'])) {
            $library = $_POST['data'];
            $result = $assessment->savelibrary($session['userid'],$library);
        }
        
        // Load library
        if ($route->action == 'loadlibrary' && $session['write']) {
            $result = $assessment->loadlibrary($session['userid']);
        }
        
    }

    return array('content'=>$result, 'fullwidth'=>true);
}
