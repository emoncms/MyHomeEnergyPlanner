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

class User
{

    private $mysqli;
    private $rememberme;
    private $enable_rememberme = false;
    private $redis;
    private $log;

    public function __construct($mysqli,$redis,$rememberme)
    {
        //copy the settings value, otherwise the enable_rememberme will always be false.
        global $enable_rememberme;
        $this->enable_rememberme = $enable_rememberme;

        $this->mysqli = $mysqli;
        $this->rememberme = $rememberme;

        $this->redis = $redis;
        $this->log = new EmonLogger(__FILE__);
    }

    //---------------------------------------------------------------------------------------
    // Core session methods
    //---------------------------------------------------------------------------------------

    public function apikey_session($apikey_in)
    {
        $apikey_in = $this->mysqli->real_escape_string($apikey_in);
        $session = array();

        //----------------------------------------------------
        // Check for apikey login
        //----------------------------------------------------
        if($this->redis && $this->redis->exists("writeapikey:$apikey_in"))
        {
            $session['userid'] = $this->redis->get("writeapikey:$apikey_in");
            $session['read'] = 1;
            $session['write'] = 1;
            $session['admin'] = 0;
            $session['editmode'] = TRUE;
            $session['lang'] = "en";
        }
        else
        {
            $result = $this->mysqli->query("SELECT id FROM users WHERE apikey_write='$apikey_in'");
            if ($result->num_rows == 1)
            {
                $row = $result->fetch_array();
                if ($row['id'] != 0)
                {
                    //session_regenerate_id();
                    $session['userid'] = $row['id'];
                    $session['read'] = 1;
                    $session['write'] = 1;
                    $session['admin'] = 0;
                    $session['editmode'] = TRUE;
                    $session['lang'] = "en";

                    if ($this->redis) $this->redis->set("writeapikey:$apikey_in",$row['id']);
                }
            }
            else
            {
            $result = $this->mysqli->query("SELECT id FROM users WHERE apikey_read='$apikey_in'");
            if ($result->num_rows == 1)
            {
                $row = $result->fetch_array();
                if ($row['id'] != 0)
                {
                    //session_regenerate_id();
                    $session['userid'] = $row['id'];
                    $session['read'] = 1;
                    $session['write'] = 0;
                    $session['admin'] = 0;
                    $session['editmode'] = TRUE;
                    $session['lang'] = "en";
                }
            }
            }
        }

        //----------------------------------------------------
        return $session;
    }

    public function emon_session_start()
    {
        session_start();

        if ($this->enable_rememberme)
        {
            // if php session exists
            if (!empty($_SESSION['userid'])) {
                // if rememberme emoncms cookie exists but is not valid then
                // a valid cookie is a cookie who's userid, token and persistant token match a record in the db
                if(!empty($_COOKIE[$this->rememberme->getCookieName()]) && !$this->rememberme->cookieIsValid($_SESSION['userid'])) {
                $this->logout();
                }
            }
            else
            {

                $loginresult = $this->rememberme->login();
                if ($loginresult)
                {
                // Remember me login
                $_SESSION['userid'] = $loginresult;
                $_SESSION['read'] = 1;
                $_SESSION['write'] = 1;
                // There is a chance that an attacker has stolen the login token, so we store
                // the fact that the user was logged in via RememberMe (instead of login form)
                $_SESSION['cookielogin'] = true;
                }
                else
                {
                if($this->rememberme->loginTokenWasInvalid()) {
                    // Stolen
                }
                }
            }
        }

        if (isset($_SESSION['admin'])) $session['admin'] = $_SESSION['admin']; else $session['admin'] = 0;
        if (isset($_SESSION['read'])) $session['read'] = $_SESSION['read']; else $session['read'] = 0;
        if (isset($_SESSION['write'])) $session['write'] = $_SESSION['write']; else $session['write'] = 0;
        if (isset($_SESSION['userid'])) $session['userid'] = $_SESSION['userid']; else $session['userid'] = 0;
        if (isset($_SESSION['lang'])) $session['lang'] = $_SESSION['lang']; else $session['lang'] = '';
        if (isset($_SESSION['username'])) $session['username'] = $_SESSION['username']; else $session['username'] = '';
        if (isset($_SESSION['cookielogin'])) $session['cookielogin'] = $_SESSION['cookielogin']; else $session['cookielogin'] = 0;

        return $session;
    }
    
    public function login($username, $password, $remembermecheck)
    {
        $remembermecheck = (int) $remembermecheck;

        if (!$username || !$password) return array('success'=>false, 'message'=>_("Username or password empty"));

        // filter out all except for alphanumeric white space and dash
        //if (!ctype_alnum($username))
        $username_out = preg_replace('/[^\p{N}\p{L}_\s-]/u','',$username);

        if ($username_out!=$username) return array('success'=>false, 'message'=>_("Username must only contain a-z 0-9 dash and underscore, if you created an account before this rule was in place enter your username without the non a-z 0-9 dash underscore characters to login and feel free to change your username on the profile page."));

        $username = $this->mysqli->real_escape_string($username);
        //$password = $this->mysqli->real_escape_string($password);

        $result = $this->mysqli->query("SELECT id,password,admin,salt,language FROM users WHERE username = '$username'");

        if ($result->num_rows < 1) return array('success'=>false, 'message'=>_("Username does not exist"));

        $userData = $result->fetch_object();
        $hash = hash('sha256', $userData->salt . hash('sha256', $password));

        if ($hash != $userData->password)
        {
            return array('success'=>false, 'message'=>_("Incorrect password, if your sure its correct try clearing your browser cache"));
        }
        else
        {
            session_regenerate_id();
            $_SESSION['userid'] = $userData->id;
            $_SESSION['username'] = $username;
            $_SESSION['read'] = 1;
            $_SESSION['write'] = 1;
            $_SESSION['admin'] = $userData->admin;
            $_SESSION['lang'] = $userData->language;
            $_SESSION['editmode'] = TRUE;

            if ($this->enable_rememberme) {
                if ($remembermecheck==true) {
                    $this->rememberme->createCookie($userData->id);
                } else {
                    $this->rememberme->clearCookie();
                }
            }

            return array('success'=>true, 'message'=>_("Login successful"));
        }
    }

    public function logout()
    {
        if ($this->enable_rememberme) $this->rememberme->clearCookie(true);
        $_SESSION['userid'] = 0;
        $_SESSION['read'] = 0;
        $_SESSION['write'] = 0;
        $_SESSION['admin'] = 0;
        session_regenerate_id(true);
        session_destroy();
    }

    //---------------------------------------------------------------------------------------
    // Get by userid methods
    //---------------------------------------------------------------------------------------

    public function get_username($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT username FROM users WHERE id = '$userid';");
        $row = $result->fetch_array();
        return $row['username'];
    }

    public function get_apikey_read($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT `apikey_read` FROM users WHERE `id`='$userid'");
        $row = $result->fetch_object();
        return $row->apikey_read;
    }

    public function get_apikey_write($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT `apikey_write` FROM users WHERE `id`='$userid'");
        $row = $result->fetch_object();
        return $row->apikey_write;
    }

    public function get_lang($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT lang FROM users WHERE id = '$userid';");
        $row = $result->fetch_array();
        return $row['lang'];
    }

    public function get_timezone($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT timezone FROM users WHERE id = '$userid';");
        $row = $result->fetch_object();
        return intval($row->timezone);
    }

    public function get_salt($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT salt FROM users WHERE id = '$userid'");
        $row = $result->fetch_object();
        return $row->salt;
    }

    //---------------------------------------------------------------------------------------
    // Get by other paramater methods
    //---------------------------------------------------------------------------------------
    public function get_id($username)
    {
        if (!ctype_alnum($username)) return false;

        $result = $this->mysqli->query("SELECT id FROM users WHERE username = '$username';");
        $row = $result->fetch_array();
        return $row['id'];
    }

    public function get_name($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT username FROM users WHERE id=$userid");
        $data = $result->fetch_object();
        return $data->username;
    }
    
    public function get($userid)
    {
        $userid = intval($userid);
        $result = $this->mysqli->query("SELECT id,username,email,gravatar,name,location,timezone,language,bio,apikey_write,apikey_read FROM users WHERE id=$userid");
        $data = $result->fetch_object();
        return $data;
    }
}
