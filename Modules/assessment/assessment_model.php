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

    public function has_write_access($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        // Check if user has direct or shared access
        $result = $this->mysqli->query("SELECT * FROM assessment_access WHERE `userid`='$userid' AND `id`='$id' AND `write` = '1'");
        if ($result->num_rows == 1)
            return true;

        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM assessment_access WHERE `orgid`='$orgid' AND `id`='$id' AND `write = '1'");
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

        $data = preg_replace('/[^\w\s-.",:{}\'\[\]\\\]/', '', $data);
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

        if (!$this->has_write_access($userid, $id))
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
            $libresult = $this->mysqli->query("SELECT id,name,type FROM element_library WHERE `id`='$id'");
            $librow = $libresult->fetch_object();
            if (!in_array($id, $loadedlibs))
                $libraries[] = json_encode(json_decode($librow));
            $loadedlibs[] = $id;
        }

        // Load organisation libraries
        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");   // get list of org that user belongs to
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM element_library_access WHERE `orgid`='$orgid'");     // get list of libraries that belong to org
            while ($row2 = $result2->fetch_object()) {
                $id = $row2->id;
                $libresult = $this->mysqli->query("SELECT id,name,type FROM element_library WHERE `id`='$id'");      // get library id and name
                $librow = $libresult->fetch_object();
                if (!in_array($id, $loadedlibs))
                    $libraries[] = json_encode(json_decode($librow));
                $loadedlibs[] = $id;
            }
        }

        return $libraries;
    }

    public function loaduserlibraries($userid) {
        $userid = (int) $userid;
        $result = $this->mysqli->query("SELECT id FROM element_library_access WHERE `userid`='$userid'");

        $loadedlibs = array();

        $libraries = array();
        while ($row = $result->fetch_object()) {
            $id = $row->id;
            $libresult = $this->mysqli->query("SELECT id,name,type,data FROM element_library WHERE `id`='$id'");
            $librow = $libresult->fetch_object();
            if (!in_array($id, $loadedlibs)) {
                $librow->data = json_encode(json_decode($librow->data));
                $libraries[] = $librow;
            }
            $loadedlibs[] = $id;
        }

        // Load organisation libraries
        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");   // get list of org that user belongs to
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM element_library_access WHERE `orgid`='$orgid'");     // get list of libraries that belong to org
            while ($row2 = $result2->fetch_object()) {
                $id = $row2->id;
                $libresult = $this->mysqli->query("SELECT id,name,type,data FROM element_library WHERE `id`='$id'");      // get library id and name
                $librow = $libresult->fetch_object();
                if (!in_array($id, $loadedlibs)) {
                    $librow->data = json_encode(json_decode($librow->data));
                    $libraries[] = $librow;
                }
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

    public function newlibrary($userid, $name, $type = 'elements') {
        $userid = (int) $userid;
        $name = preg_replace('/[^\w\s-]/', '', $name);
        $type = preg_replace('/[^\w\s-]/', '', $type);

        $result = $this->mysqli->query("SELECT * FROM element_library WHERE `name`='$name' AND `type`='$type'");
        if ($result->num_rows == 1) {
            return "Name already exists";
        }

        $result = $this->mysqli->query("INSERT INTO element_library (`userid`,`name`,`data`,`type`) VALUES ('$userid','$name','{}','$type')");
        $id = $this->mysqli->insert_id;

        $result = $this->mysqli->query("INSERT INTO element_library_access (`id`,`userid`,`orgid`,`write`) VALUES ('$id','$userid','0','1')");
        return $id;
    }

    public function copylibrary($userid, $name, $type = 'elements', $id) {
        $userid = (int) $userid;
        $name = preg_replace('/[^\w\s-]/', '', $name);
        $type = preg_replace('/[^\w\s-]/', '', $type);
        $id = (int) $id;

        if (!$this->has_access_library($userid, $id))
            return "You have not got access to that library";

        $result = $this->mysqli->query("SELECT * FROM element_library WHERE `name`='$name' AND `type`='$type'");
        if ($result->num_rows == 1) {
            return "Name already exists";
        }

        $result = $this->mysqli->query("SELECT * FROM element_library WHERE `id`='$id'");
        if ($result->num_rows == 1) {
            $row = $result->fetch_object();
        } else {
            return "Library not found";
        }

        $result = $this->mysqli->query("INSERT INTO element_library (`userid`,`name`,`data`,`type`) VALUES ('$userid','$name','$row->data','$type')");
        $id = $this->mysqli->insert_id;

        $result = $this->mysqli->query("INSERT INTO element_library_access (`id`,`userid`,`orgid`,`write`) VALUES ('$id','$userid','0','1')");
        return $id;
    }

    public function savelibrary($userid, $id, $data) {
        $userid = (int) $userid;
        $id = (int) $id;
        if (!$this->has_write_access_library($userid, $id))
            return false;

        $data = $this->escape_item($data);
        $data = json_decode($data);
        $data = json_encode($data);
        $data = $this->mysqli->real_escape_string($data);
        $result = $this->mysqli->query("UPDATE element_library SET `data`='$data' WHERE `userid` = '$userid' AND `id` = '$id'");
        return $result;
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

    public function has_write_access_library($userid, $id) {
        $id = (int) $id;
        $userid = (int) $userid;
        // Check if user has direct or shared access
        $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `userid`='$userid' AND `id`='$id' AND `write`='1'");
        if ($result->num_rows == 1)
            return true;

        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM element_library_access WHERE `orgid`='$orgid' AND `id`='$id' AND `write`='1'");
            if ($result2->num_rows == 1)
                return true;
        }
    }

    public function sharelibrary($userid, $id, $username, $write_permissions = false) {
        global $user;
        $id = (int) $id;
        $userid = (int) $userid;
        $username = preg_replace('/[^\w\s]/', '', $username);
        $write_permissions = $write_permissions === 'true' ? 1 : 0;

        if (!$this->has_write_access_library($userid, $id))
            return "You haven't got enough permissions";

        // 1. Check if user exists
        $userid = $user->get_id($username);

        if ($userid == false) {
            $result = $this->mysqli->query("SELECT * FROM organisations WHERE `name`='$username'");
            if ($result->num_rows == 1) {
                $row = $result->fetch_object();
                $orgid = $row->id;

                $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `id` = '$id' AND `orgid`='$orgid'");
                if ($result->num_rows == 1) {
                    // 1.1. Library already shared with this organisation, check if we have to update write permissions
                    $row = $result->fetch_object();
                    if ($row->write != $write_permissions) {
                        $result = $this->mysqli->query("UPDATE `element_library_access` SET `write`='$write_permissions' WHERE `id` = '$id' AND `orgid`='$orgid'");
                        return "Already shared, write permissions updated";
                    } else
                        return "Already shared";
                }

                // $this->org_access($id,$orgid,1);
                $this->mysqli->query("INSERT INTO element_library_access SET `id` = '$id', `userid` = '0', `orgid` = '$orgid', `write` = '$write_permissions'");
                return "Library shared";
            }
        } else {
            // 2. Check if already shared with user
            $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `id` = '$id' AND `userid`='$userid'");
            if ($result->num_rows == 1) {
                // 2.1. Library already shared with this user, check if we have to update write permissions
                $row = $result->fetch_object();
                if ($row->write != $write_permissions) {
                    $result = $this->mysqli->query("UPDATE `element_library_access` SET `write`='$write_permissions' WHERE `id` = '$id' AND `userid`='$userid'");
                    return "Already shared, write permissions updated";
                } else
                    return "Already shared";
            }

            // 3. Register share
            $this->mysqli->query("INSERT INTO element_library_access SET `id` = '$id', `userid` = '$userid', `orgid` = '0', `write` = '$write_permissions'");
            return "Library shared";
        }
        return 'User or organisation not found';
    }

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
            $users[] = array('orgid' => $row->orgid, 'userid' => $row->userid, 'username' => $username, 'write' => $row->write);
        }
        return $users;
    }

    public function getuserpermissions($userid) {
        $userid = (int) $userid;
        $user_permisions = array();

        $result = $this->mysqli->query("SELECT * FROM element_library_access WHERE `userid`='$userid'");
        while ($row = $result->fetch_object()) {
            $user_permisions[$row->id] = array('write' => $row->write);
        }

        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");
        while ($row = $result->fetch_object()) {
            $orgid = $row->orgid;
            $result2 = $this->mysqli->query("SELECT * FROM element_library_access WHERE `orgid`='$orgid'");
            while ($row = $result2->fetch_object()) {
                $user_permisions[$row->id] = array('write' => $row->write);
            }
        }

        return $user_permisions;
    }

    public function removeuserfromsharedlibrary($userid, $selected_library, $user_to_remove) {
        global $user;
        $userid = (int) $userid;
        $selected_library = (int) $selected_library;
        $user_to_remove = preg_replace('/[^\w\s]/', '', $user_to_remove);

        if (!$this->has_write_access_library($userid, $selected_library))
            return "You haven't got enough permissions";

        // 1. Check if user_to_remove is a user or an organisation
        $user_to_remove_id = $user->get_id($user_to_remove);

        if ($user_to_remove_id == false) {
            $result = $this->mysqli->query("SELECT * FROM organisations WHERE `name`='$user_to_remove'");
            if ($result->num_rows == 1) { //user_to_remove is an organisation                
                $row = $result->fetch_object();
                $orgid = $row->id;

                $result = $this->mysqli->query("DELETE FROM element_library_access WHERE `id` = '$selected_library' AND `orgid`='$orgid'");
                $result = $result == true ? 'Organisation removed' : 'Organisation could not be removed';
                return $result;
            }
        } else { // $user_to_remove is a user
            if ($userid == $user_to_remove_id)
                return "You cannot remove yourself";
            $result = $this->mysqli->query("DELETE FROM element_library_access WHERE `id` = '$selected_library' AND `userid`='$user_to_remove_id'");
            $result = $result == true ? 'User removed' : 'User could not be removed';
            return $result;
        }

        return 'User or organisation not found';
    }

    public function setlibraryname($userid, $library_id, $new_library_name) {
        $userid = (int) $userid;
        $library_id = (int) $library_id;
        $new_library_name = preg_replace('/[^\w\s]/', '', $new_library_name);

        if (!$this->has_write_access_library($userid, $library_id))
            return "You haven't got enough permissions";
        else {
            $result = $this->mysqli->query("UPDATE `element_library` SET `name`='$new_library_name' WHERE `id` = '$library_id'");
            return $result;
        }
    }

    public function deletelibrary($userid, $library_id) {
        $userid = (int) $userid;
        $library_id = (int) $library_id;

        if (!$this->has_write_access_library($userid, $library_id))
            return "You haven't got enough permissions";
        else {
            $result1 = $this->mysqli->query("DELETE FROM element_library WHERE `id` = '$library_id'");
            $result2 = $this->mysqli->query("DELETE FROM element_library_access WHERE `id` = '$library_id'");
            if ($result1 == 1 && $result2 == 1)
                return 1;
            else
                return 'There was a problem deleting the library from the database';
        }
    }

    public function deletelibraryitem($userid, $library_id, $tag) {
        $userid = (int) $userid;
        $library_id = (int) $library_id;
        $tag = preg_replace('/[^\w\s]/', '', $tag);
        if (!$this->has_write_access_library($userid, $library_id))
            return "You haven't got enough permissions";
        else {
            $result = $this->mysqli->query("SELECT * FROM element_library WHERE `id` = '$library_id'");
            $row = $result->fetch_object();
            $library = json_decode($row->data, true);
            if (!isset($library[$tag]))
                return "Tag could not be found in the library - tag: $tag";
            unset($library[$tag]);
            $library = json_encode($library);
            $result = $this->mysqli->query("UPDATE element_library SET `data`='$library' WHERE `id` = '$library_id'");
            return $result;
        }
    }

    public function additemtolibrary($userid, $library_id, $item, $tag) {
        $userid = (int) $userid;
        $library_id = (int) $library_id;
        //$item = preg_replace('/[^\w\s"\':\,{}]/', '', $item);
        //$item=  json_decode($item);//$item = json_encode(json_decode($item));
        $item = $this->escape_item($item);
        $item = json_decode($item);
        $tag = preg_replace('/[^\w\s]/', '', $tag);
        if (!$this->has_write_access_library($userid, $library_id)) {
            return "You haven't got enough permissions";
        } else {
            $result = $this->mysqli->query("SELECT * FROM element_library WHERE `id` = '$library_id'");
            $row = $result->fetch_object();
            $library = json_decode($row->data, true);
            $library[$tag] = $item;
            $library = json_encode($library);
            $library = $this->mysqli->real_escape_string($library);
            $result = $this->mysqli->query("UPDATE element_library SET `data`='$library' WHERE `id` = '$library_id'");
            return $result;
        }
    }

    public function edititeminlibrary($userid, $library_id, $item, $tag) {
        $result = $this->additemtolibrary($userid, $library_id, $item, $tag);
        return $result;
    }

    public function escape_item($item) {
        $item = preg_replace('/[^\w\s-+.",:{}\/\'\[\]\\\]/', '', $item);
        //$item = str_replace("'", "\\'", $item);
        return $item;
    }

// ------------------------------------------------------------------------------------------------
// IMAGE GALLERY
// ------------------------------------------------------------------------------------------------

    public function saveimages($userid, $id, $images) {

        // Check if user has access to this assesment      
        if (!$this->has_access($userid, $id))
            return "User has no access to the assesment";

        // Check if there is a already a directory for this assesment
        if (!is_dir(__DIR__ . "/images/" . $id)) {
            ini_set('display_errors', 0); // We don't display errors/warnings notification as it messes up the headers to be returned and the return text doesn't reach the client
            if (!mkdir(__DIR__ . "/images/" . $id))
                return "There has been a problem creating the directory for these images, check permissions!";
        }

        //Handle the image: check format, it is not empty, name of file is valid, file name not too long if it exists and move it
        $result = array();
        foreach ($images as $image) {
            $message = '';
            $allowedExts = array("gif", "jpeg", "jpg", "png");
            $temp = explode(".", $image["name"]);
            $extension = end($temp);
            $image_info = getimagesize($image["tmp_name"]);
            if ((($image["type"] != "image/gif") && ($image["type"] != "image/jpeg") && ($image["type"] != "image/jpg") && ($image["type"] != "image/pjpeg") && ($image["type"] != "image/x-png") && ($image["type"] != "image/png")) || !in_array($extension, $allowedExts))
                $message = "Invalid file";
            else if ($image_info["mime"] != $image["type"])
                $message = "The mime type of the file is not the one expected";
            else if ($image["error"] > 0)
                $message = "Error uploading file: " . $image["error"];
            else if ($image["size"] === 0)
                $message = "File is empty";
            else if (mb_strlen($image["name"], "UTF-8") > 225)
                $message = "File name too long";
            else if ($image["size"] > 1000000) // max file size 1 B
                $message = "File cannot be bigger than 1MB";
            else {
                $filename = $image["name"];
                if (preg_match("`^[-0-9A-Z_\.]+$`i", $image["name"]) === 0) { // File name not valid
                    $filename = preg_replace("([^-0-9A-Za-z_\.])", "_", $image["name"]);
                    $message = "File name has been modified  --  ";
                }
                if (file_exists(__DIR__ . "/images/" . $id . "/" . $filename)) {
                    $message = "File already exists";
                } else {
                    // Move file
                    ini_set('display_errors', 0); // We don't display errors/warnings notification as it messes up the headers to be returned and the return text doesn't reach the client
                    $move_result = move_uploaded_file($image["tmp_name"], __DIR__ . "/images/" . $id . "/" . $filename);
                    $message .= $move_result === true ? "Uploaded" : "File couldn't be moved in the server, check permissions!!" . $message;
                }
            }
            $result[$filename] = $message;
        }
        return $result;
    }

    public
            function deleteimage($userid, $projectid, $filename) {
        // Check if user has access to this assesment      
        if (!$this->has_access($userid, $projectid))
            return "User has no access to the assesment";
        $result = array();
        error_reporting(0); // We disable errors/warnings notification as it messes up the headers to be returned and the return text doesn't reach the client
        $message = unlink(__DIR__ . "/images/" . $projectid . "/" . $filename);
        $message = $message === true ? "Deleted" : "File couldn't be deleted";
        $to_return = array();
        $to_return[$filename] = $message;
        return $to_return;
    }

}
