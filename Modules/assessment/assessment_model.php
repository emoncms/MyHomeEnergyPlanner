<?php

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

// id, metadata, data


class Assessment {

    private $mysqli;

    public function __construct($mysqli) {
        $this->mysqli = $mysqli;
        $this->tablename = "assessment";
        $this->accesstable = "assessment_access";
    }

    public function has_access($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        // Check if user has direct or shared access
        $result = $this->mysqli->query("SELECT * FROM assessment_access WHERE `userid`='$userid' AND `id`='$id'");
        if ($result->num_rows == 1)
            return true;

        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM assessment_access WHERE `orgid`='$orgid' AND `id`='$id'");
            if ($result2->num_rows == 1)
                return true;
        }
    }

    public function get_org_list($orgid) {
        $orgid = (int) $orgid;

        $result = $this->mysqli->query("SELECT * FROM assessment_access WHERE `orgid`='$orgid'");

        $projects = array();
        while ($row = $result->fetch_object()) {
            $id = $row->id;
            $assessment_result = $this->mysqli->query("SELECT id,name,description,userid,author,mdate,status FROM " . $this->tablename . " WHERE `id`='$id'");
            $row = $assessment_result->fetch_object();
            $projects[] = $row;
        }
        return $projects;
    }

    public function get_list($userid) {
        $userid = (int) $userid;

        $result = $this->mysqli->query("SELECT * FROM assessment_access WHERE `userid`='$userid'");

        $projects = array();
        while ($row = $result->fetch_object()) {
            $id = $row->id;
            $assessment_result = $this->mysqli->query("SELECT id,name,description,userid,author,mdate,status FROM " . $this->tablename . " WHERE `id`='$id'");
            $row = $assessment_result->fetch_object();
            $projects[] = $row;
        }
        return $projects;
    }

    public function create($userid, $name, $description) {
        $userid = (int) $userid;
        $name = preg_replace('/[^\w\s-.",:{}\[\]]/', '', $name);
        $description = preg_replace('/[^\w\s-.",:{}\[\]]/', '', $description);

        $result = $this->mysqli->query("SELECT username FROM users WHERE `id`='$userid'");
        $row = $result->fetch_object();
        $author = $row->username;

        $mdate = time();
        $status = "In progress";

        // Dont save if json_decode fails

        $data = false;
        $result = $this->mysqli->query("INSERT INTO " . $this->tablename . " (`name`,`description`,`userid`,`status`,`author`,`mdate`,`data`) VALUES ('$name','$description','$userid','$status','$author','$mdate','$data')");
        $id = $this->mysqli->insert_id;


        $project = array(
            'id' => $id,
            'name' => $name,
            'description' => $description,
            'status' => $status,
            'userid' => $userid,
            'author' => $author,
            'mdate' => $mdate
        );

        $this->access($id, $userid, 1);

        return $project;
    }

    public function delete($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        if (!$this->has_access($userid, $id))
            return false;

        $result = $this->mysqli->query("DELETE FROM " . $this->tablename . " WHERE `id` = '$id'");
        $result = $this->mysqli->query("DELETE FROM assessment_access WHERE `id` = '$id'");
        return array("Deleted");
    }

    public function get($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        if (!$this->has_access($userid, $id))
            return false;

        $result = $this->mysqli->query("SELECT * FROM " . $this->tablename . " WHERE `id` = '$id'");
        $row = $result->fetch_object();

        $row->data = json_decode($row->data);
        return $row;
    }

    public function set_status($userid, $id, $status) {
        $id = (int) $id;
        $userid = (int) $userid;
        $status = preg_replace('/[^\w\s]/', '', $status);
        if (!$this->has_access($userid, $id))
            return false;

        $stmt = $this->mysqli->prepare("UPDATE " . $this->tablename . " SET `status` = ? WHERE `id` = ?");
        $stmt->bind_param("si", $status, $id);
        $stmt->execute();

        if ($this->mysqli->affected_rows == 1)
            return true;
        else
            return false;
    }

    public function set_data($userid, $id, $data) {
        $id = (int) $id;
        $userid = (int) $userid;
        if (!$this->has_access($userid, $id))
            return false;

        $data = preg_replace('/[^\w\s-.",:{}\[\]]/', '', $data);
        $data = json_decode($data);

        $mdate = time();

        // Dont save if json_decode fails
        if ($data != null) {

            $data = json_encode($data);

            $stmt = $this->mysqli->prepare("UPDATE " . $this->tablename . " SET `data` = ?, `mdate` = ? WHERE `id` = ?");
            $stmt->bind_param("ssi", $data, $mdate, $id);
            $stmt->execute();

            if ($this->mysqli->affected_rows == 1)
                return true;
            else
                return false;
        }
        else {
            return false;
        }
    }

    public function set_name_and_description($userid, $id, $name, $description) {
        $id = (int) $id;
        $userid = (int) $userid;
        if (!$this->has_access($userid, $id))
            return false;

        $name = preg_replace('/[^\w\s-.",:{}\[\]]/', '', $name);
        $description = preg_replace('/[^\w\s-.",:{}\[\]]/', '', $description);

        $mdate = time();
        
        $stmt = $this->mysqli->prepare("UPDATE " . $this->tablename . " SET `name` = ?, `description` = ?,`mdate` = ? WHERE `id` = ?");
        $stmt->bind_param("sssi", $name, $description, $mdate, $id);
        $stmt->execute();

        if ($this->mysqli->affected_rows == 1)
            return true;
        else
            return false;
    }

    public function access($id, $userid, $write) {
        $id = (int) $id;
        $userid = (int) $userid;
        $write = (int) $write;
        $result = $this->mysqli->query("INSERT INTO assessment_access SET `id` = '$id', `userid` = '$userid', `orgid` = '0', `write` = '$write'");
    }

    public function org_access($id, $orgid, $write) {
        $id = (int) $id;
        $orgid = (int) $orgid;
        $write = (int) $write;
        $result = $this->mysqli->query("INSERT INTO assessment_access SET `id` = '$id', `userid` = '0', `orgid` = '$orgid', `write` = '$write'");
    }

    public function share($userid, $id, $username) {
        $id = (int) $id;
        $userid = (int) $userid;
        $username = preg_replace('/[^\w\s]/', '', $username);

        if (!$this->has_access($userid, $id))
            return false;

        global $user;

        // 1. Check if user exists
        $userid = $user->get_id($username);
        if ($userid == false) {
            $result = $this->mysqli->query("SELECT * FROM organisations WHERE `name`='$username'");
            if ($result->num_rows == 1) {
                $row = $result->fetch_object();
                $orgid = $row->id;

                $result = $this->mysqli->query("SELECT * FROM assessment_access WHERE `id` = '$id' AND `orgid`='$orgid'");
                if ($result->num_rows == 1)
                    return "Already shared";

                $this->org_access($id, $orgid, 1);
                return "Assessment shared";
            }
        } else {
            // 2. Check if already shared with user
            $result = $this->mysqli->query("SELECT * FROM assessment_access WHERE `id` = '$id' AND `userid`='$userid'");
            if ($result->num_rows == 1)
                return "Already shared";

            // 3. Register share
            $this->access($id, $userid, 1);
            return "Assessment shared";
        }
    }

    public function getshared($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        if (!$this->has_access($userid, $id))
            return false;

        $result = $this->mysqli->query("SELECT * FROM assessment_access WHERE `id` = '$id'");
        $users = array();
        while ($row = $result->fetch_object()) {
            global $user;
            if ($row->userid != 0)
                $username = $user->get_name($row->userid);
            if ($row->orgid != 0) {
                $orgid = $row->orgid;
                $orgresult = $this->mysqli->query("SELECT * FROM organisations WHERE `id`='$orgid'");
                $orgrow = $orgresult->fetch_object();
                $username = $orgrow->name;
            }
            $users[] = array('orgid' => $row->orgid, 'userid' => $row->userid, 'username' => $username);
        }
        return $users;
    }

    // ------------------------------------------------------------------------------------------------
    // LIBRARY
    // ------------------------------------------------------------------------------------------------
    // Show library that belongs to organisation in organisation view
    //
    // Show library that belongs to user in user view
    //
    // Allow creation of element from any library that user has access to with dropdown menu to select
    // personal library or organisational library
    // $result = $this->mysqli->query("SELECT * FROM library_access WHERE `userid`='$userid' AND `id`='$id'");

    public function listlibrary($userid) {
        $userid = (int) $userid;
        $result = $this->mysqli->query("SELECT id FROM element_library_access WHERE `userid`='$userid'");

        $loadedlibs = array();

        $libraries = array();
        while ($row = $result->fetch_object()) {
            $id = $row->id;
            $libresult = $this->mysqli->query("SELECT id,name FROM element_library WHERE `id`='$id'");
            $librow = $libresult->fetch_object();
            if (!in_array($id, $loadedlibs))
                $libraries[] = $librow;
            $loadedlibs[] = $id;
        }

        // Load organisation libraries
        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");   // get list of org that user belongs to
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM element_library_access WHERE `orgid`='$orgid'");     // get list of libraries that belong to org
            while ($row2 = $result2->fetch_object()) {
                $id = $row2->id;
                $libresult = $this->mysqli->query("SELECT id,name FROM element_library WHERE `id`='$id'");      // get library id and name
                $librow = $libresult->fetch_object();
                if (!in_array($id, $loadedlibs))
                    $libraries[] = $librow;
                $loadedlibs[] = $id;
            }
        }

        return $libraries;
    }

    public function loadlibrary($userid, $id) {
        $userid = (int) $userid;
        $id = (int) $id;
        if (!$this->has_access_library($userid, $id))
            return false;

        $result = $this->mysqli->query("SELECT * FROM element_library WHERE `id`='$id'");

        if ($result->num_rows == 1) {
            $row = $result->fetch_object();
            return json_decode($row->data);
        } else {
            return new stdClass();
        }
    }

    public function newlibrary($userid, $name) {
        $userid = (int) $userid;
        $name = preg_replace('/[^\w\s]/', '', $name);

        $result = $this->mysqli->query("INSERT INTO element_library (`userid`,`name`,`data`) VALUES ('$userid','$name','{}')");
        $id = $this->mysqli->insert_id;

        $result = $this->mysqli->query("INSERT INTO element_library_access (`id`,`userid`,`orgid`) VALUES ('$id','$userid','0')");
        return $id;
    }

    public function savelibrary($userid, $id, $data) {
        $userid = (int) $userid;
        $id = (int) $id;
        if (!$this->has_access_library($userid, $id))
            return false;

        $data = json_encode(json_decode($data));
        $data = $this->mysqli->real_escape_string($data);
        $data = preg_replace('/[^\w\s-.",:{}\[\]]/', '', $data);

        // $result = $this->mysqli->query("SELECT * FROM element_library WHERE `userid`='$userid' AND ");
        // if ($result->num_rows==0)
        //     $result = $this->mysqli->query("INSERT INTO element_library (`userid`) VALUES ('$userid')");

        $req = $this->mysqli->prepare("UPDATE element_library SET `data` = ? WHERE `userid` = ? AND `id`= ?");
        $req->bind_param("sii", $data, $userid, $id);
        $req->execute();

        return true;
    }

    public function has_access_library($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        // Check if user has direct or shared access
        $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `userid`='$userid' AND `id`='$id'");
        if ($result->num_rows == 1)
            return true;

        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM element_library_access WHERE `orgid`='$orgid' AND `id`='$id'");
            if ($result2->num_rows == 1)
                return true;
        }
    }

    public function sharelibrary($userid, $id, $username) {
        global $user;
        $id = (int) $id;
        $userid = (int) $userid;
        $username = preg_replace('/[^\w\s]/', '', $username);

        if (!$this->has_access_library($userid, $id))
            return false;

        // 1. Check if user exists
        $userid = $user->get_id($username);

        if ($userid == false) {
            $result = $this->mysqli->query("SELECT * FROM organisations WHERE `name`='$username'");
            if ($result->num_rows == 1) {
                $row = $result->fetch_object();
                $orgid = $row->id;

                $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `id` = '$id' AND `orgid`='$orgid'");
                if ($result->num_rows == 1)
                    return "Already shared";

                // $this->org_access($id,$orgid,1);
                $this->mysqli->query("INSERT INTO element_library_access SET `id` = '$id', `userid` = '0', `orgid` = '$orgid', `write` = '1'");
                return "Assessment shared";
            }
        } else {
            // 2. Check if already shared with user
            $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `id` = '$id' AND `userid`='$userid'");
            if ($result->num_rows == 1)
                return "Already shared";

            // 3. Register share
            $this->mysqli->query("INSERT INTO element_library_access SET `id` = '$id', `userid` = '$userid', `orgid` = '0', `write` = '1'");
            return "Assessment shared";
        }
    }

    // Get shared

    public function getsharedlibrary($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        if (!$this->has_access_library($userid, $id))
            return false;

        $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `id` = '$id'");
        $users = array();
        while ($row = $result->fetch_object()) {
            global $user;
            if ($row->userid != 0)
                $username = $user->get_name($row->userid);
            if ($row->orgid != 0) {
                $orgid = $row->orgid;
                $orgresult = $this->mysqli->query("SELECT * FROM organisations WHERE `id`='$orgid'");
                $orgrow = $orgresult->fetch_object();
                $username = $orgrow->name;
            }
            $users[] = array('orgid' => $row->orgid, 'userid' => $row->userid, 'username' => $username);
        }
        return $users;
    }

}
