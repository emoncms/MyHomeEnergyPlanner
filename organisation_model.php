<?php

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

// - create organisation
// - add member to organisation
// - get organisations that a user is a member of
// - get members for an organisation that user is a member of

// An assessment belongs to a user. But could be shared with another user or with an organisation.
// - two tables:
//      - organisation_assessments
//      - 

// In the UI you have organisation view, user view: 
// organisation assessments, assessments shared with organisation


// assessment model has userid as ownership
// to share an assessment
// assessment id -> userid -> write/read

// get assessment list:
// : select from assessment where userid = 

// or from ownership table?
// select from assessment_ownership where userid = ...
// 

class Organisation
{
    private $mysqli;

    public function __construct($mysqli)
    {
        $this->mysqli = $mysqli;
    }
 
    public function create($orgname,$userid)
    {
        $userid = (int) $userid;

        $result = $this->mysqli->query("SELECT * FROM organisations WHERE `name`='$orgname'");
        if ($result->num_rows==1) return false;   // entry already exists
        
        $this->mysqli->query("INSERT INTO organisations (`name`) VALUES ('$orgname')");
        $orgid = $this->mysqli->insert_id;
        
        $this->add_member($orgid,$userid);
        
        return $orgid;
    }
    
    public function add_member($orgid,$userid)
    {
        $orgid = (int) $orgid;
        $userid = (int) $userid;
        
        $result = $this->mysqli->query("SELECT * FROM organisation_membership WHERE `orgid`='$orgid' AND `userid`='$userid'");
        if ($result->num_rows==1) return false;   // entry already exists
        
        $this->mysqli->query("INSERT INTO organisation_membership (`orgid`,`userid`) VALUES ('$orgid','$userid')");
        
        return true;
    }
    
    // Return a list of organisations that a user is a member of
    public function get_organisations($userid)
    {
        $userid = (int) $userid;
        
        $result = $this->mysqli->query("SELECT orgid FROM organisation_membership WHERE `userid`='$userid'");
        $organisations = array();
        while($row = $result->fetch_object())
        {
            $orgid = "".$row->orgid;
            $orgresult = $this->mysqli->query("SELECT * FROM organisations WHERE `id`='$orgid'");
            $orgrow = $orgresult->fetch_object();
            // return full organisation details here
            
            $resnumassessments = $this->mysqli->query("SELECT * FROM assessment_access WHERE `orgid`='$orgid'");
            $numassessments = $resnumassessments->num_rows;
            
            $organisations[$orgid] = array(
                "orgid"=>$orgid,
                "name"=>$orgrow->name,
                "assessments"=>$numassessments,
                "members"=>array()
            );
            
            $members = array();
            $member_result = $this->mysqli->query("SELECT * FROM organisation_membership WHERE `orgid`='$orgid'");
            while($member_row = $member_result->fetch_object())
            {
                global $user;
                $username = $user->get_name($member_row->userid);
                $members[] = array("userid"=>$member_row->userid, "name"=>$username, "lastactive"=>"?");
            }
            $organisations[$orgid]['members'] = $members;
        }
        return $organisations;
    }
    
    // to share an assessment with an organisation we need another table that records
    // organisation id, assessment id.
    
    // what about shared with users?
    // and how to share libraries.
}
