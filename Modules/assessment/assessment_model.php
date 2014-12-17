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
    }
    
    public function get_list()
    {
        $result = $this->mysqli->query("SELECT id,name,description,userid,author,mdate,status FROM ".$this->tablename);
        
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
        $result = $this->mysqli->query("INSERT INTO ".$this->tablename." (`name`,`description`,`userid`,`status`,`author`,`mdate`,`data`) VALUES ('$name','$description','$status','$userid','$author','$mdate','$data')");
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
    
    public function delete($id)
    {
        $id = (int) $id;
        $result = $this->mysqli->query("DELETE FROM ".$this->tablename." WHERE `id` = '$id'");
        return array("Deleted");
    }
    
    public function get($id)
    {
        $id = (int) $id;
        $result = $this->mysqli->query("SELECT * FROM ".$this->tablename." WHERE `id` = '$id'");
        $row = $result->fetch_object();
        
        $row->data = json_decode($row->data);
        return $row;
    }
    
    public function set_data($id,$data)
    {
        $id = (int) $id;
        $data = preg_replace('/[^\w\s-.",:{}\[\]]/','',$data);
        $data = json_decode($data);
        
        $mdate = time();

        // Dont save if json_decode fails
        if ($data!=null) {

            $data = json_encode($data);
          
            $stmt = $this->mysqli->prepare("UPDATE ".$this->tablename." SET `data` = ?, `mdate` = ? WHERE `id` = ?");
            $stmt->bind_param("ssi", $data, $mdate, $id);
            $stmt->execute();

            if ($this->mysqli->affected_rows==1) return true; else return false;
        }
        else {
          return false;
        }
    }
}
