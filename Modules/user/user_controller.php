<?php

/*
    All Emoncms code is released under the GNU Affero General Public License.
    See COPYRIGHT.txt and LICENSE.txt.

    ---------------------------------------------------------------------
    Emoncms - open source energy visualisation
    Part of the OpenEnergyMonitor project:
    http://openenergymonitor.org

*/

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

function user_controller()
{
    global $user, $path, $session, $route;

    $result = false;

    // Load html,css,js pages to the client
    if ($route->format == 'html')
    {
        if ($route->action == 'login' && !$session['read']) $result = view("Modules/user/login_block.php", array());
        if ($route->action == 'view' && $session['write']) $result = view("Modules/user/profile/profile.php", array());
        if ($route->action == 'logout' && $session['read']) {$user->logout(); header('Location: '.$path);}
    }

    // JSON API
    if ($route->format == 'json')
    {
        // Core session
        if ($route->action == 'login' && !$session['read']) $result = $user->login(post('username'),post('password'),post('rememberme'));
        if ($route->action == 'logout' && $session['read']) $user->logout();
        
        // Get and set - user by profile client
        if ($route->action == 'get' && $session['write']) $result = $user->get($session['userid']);
        if ($route->action == 'timezone' && $session['read']) $result = $user->get_timezone($session['userid']);
    }

    return array('content'=>$result, 'fullwidth'=>true);
}
