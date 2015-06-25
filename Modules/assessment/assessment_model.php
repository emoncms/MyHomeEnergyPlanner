<?php

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

// id, metadata, data


class Assessment
{
    private $mysqli;

    public function __construct($mysqli)
    {
        $this->mysqli = $mysqli;
        $this->tablename = "assessment";
        $this->accesstable ="assessment_access";
    }
    
    public function admin($userid)
    {
        $userid = (int) $userid;
        
        // check if userid is an admin user or can only view own account
        // $result = $this->mysqli->query("SELECT admin FROM ".$this->accesstable." WHERE `userid`='$userid'");
        // $row = $result->fetch_array();
        // if ($row && isset($row['admin']) && $row['admin']==1) return true;
        
        global $assessment_admin_users;
        if (in_array($userid,$assessment_admin_users)) return true;
        return false;
    }
    
    public function get_list($userid)
    {
        $userid = (int) $userid;

        $limit_to_user = ""; if (!$this->admin($userid)) $limit_to_user = " WHERE `userid`='$userid'";
        $result = $this->mysqli->query("SELECT id,name,description,userid,author,mdate,status FROM ".$this->tablename.$limit_to_user);
        
        $projects = array();
        while($row = $result->fetch_object()) $projects[] = $row;
        return $projects;
    }
    
    public function create($userid,$name,$description)
    {
        $userid = (int) $userid;
        $name = preg_replace('/[^\w\s-.",:{}\[\]]/','',$name);
        $description = preg_replace('/[^\w\s-.",:{}\[\]]/','',$description);
        
        $result = $this->mysqli->query("SELECT username FROM users WHERE `id`='$userid'");
        $row = $result->fetch_object();
        $author = $row->username;
        
        $mdate = time();
        $status = "In progress";

        // Dont save if json_decode fails

        $data = false;
        $result = $this->mysqli->query("INSERT INTO ".$this->tablename." (`name`,`description`,`userid`,`status`,`author`,`mdate`,`data`) VALUES ('$name','$description','$userid','$status','$author','$mdate','$data')");
        $id = $this->mysqli->insert_id;

        
        $project = array(
            'id'=>$id,
            'name'=>$name,
            'description'=>$description,
            'userid'=>$userid,
            'author'=>$author,
            'mdate'=>$mdate
        );
        
        return $project;
    }
    
    public function delete($userid,$id)
    {
        $id = (int) $id;
        $userid = (int) $userid;
        
        $limit_to_user = ""; 
        if (!$this->admin($userid)) $limit_to_user = " WHERE `userid`='$userid'";
        
        $result = $this->mysqli->query("DELETE FROM ".$this->tablename." WHERE `id` = '$id'");
        return array("Deleted");
    }
    
    public function get($userid,$id)
    {
        $id = (int) $id;
        $userid = (int) $userid;
        
        $limit_to_user = ""; 
        if (!$this->admin($userid)) $limit_to_user = " WHERE `userid`='$userid'";
        
        $result = $this->mysqli->query("SELECT * FROM ".$this->tablename." WHERE `id` = '$id'");
        $row = $result->fetch_object();
        
        $row->data = json_decode($row->data);
        return $row;
    }
    
    public function set_status($userid,$id,$status)
    {
        $id = (int) $id;
        $userid = (int) $userid;
        $status = preg_replace('/[^\w\s]/','',$status);
        
        $limit_to_user = ""; 
        if (!$this->admin($userid)) $limit_to_user = " AND `userid`='$userid'";
        print $id;
        $stmt = $this->mysqli->prepare("UPDATE ".$this->tablename." SET `status` = ? WHERE `id` = ?".$limit_to_user);
        $stmt->bind_param("si", $status, $id);
        $stmt->execute();
        
        if ($this->mysqli->affected_rows==1) return true; else return false;
    }
    
    public function set_data($userid,$id,$data)
    {
        $id = (int) $id;
        $userid = (int) $userid;
        
        $limit_to_user = ""; 
        if (!$this->admin($userid)) $limit_to_user = " AND `userid`='$userid'";
        
        $data = preg_replace('/[^\w\s-.",:{}\[\]]/','',$data);
        $data = json_decode($data);
        
        $mdate = time();

        // Dont save if json_decode fails
        if ($data!=null) {

            $data = json_encode($data);
          
            $stmt = $this->mysqli->prepare("UPDATE ".$this->tablename." SET `data` = ?, `mdate` = ? WHERE `id` = ?".$limit_to_user);
            $stmt->bind_param("ssi", $data, $mdate, $id);
            $stmt->execute();

            if ($this->mysqli->affected_rows==1) return true; else return false;
        }
        else {
          return false;
        }
    }
}
