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
    
        if ($route->action == 'list' && $session['write']) $result = $assessment->get_list($session['userid']);
        if ($route->action == 'create' && $session['write']) $result = $assessment->create($session['userid'],get('name'),get('description'));
        if ($route->action == 'delete' && $session['write']) $result = $assessment->delete($session['userid'],get('id'));

        if ($route->action == 'get' && $session['write']) $result = $assessment->get($session['userid'],get('id'));
        
        if ($route->action == 'setdata' && $session['write'])
        {
            $data = null;
            if (isset($_POST['data'])) $data = $_POST['data'];
            if (!isset($_POST['data']) && isset($_GET['data'])) $data = $_GET['data'];
            if ($data && $data!=null) $result = $assessment->set_data($session['userid'],post('id'),$data);
        }
    }

    return array('content'=>$result, 'fullwidth'=>true);
}
