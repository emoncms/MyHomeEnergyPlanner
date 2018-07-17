<?php

/*
  All Emoncms code is released under the GNU Affero General Public License.
  See COPYRIGHT.txt and LICENSE.txt.

  ---------------------------------------------------------------------
  Emoncms - open source energy visualisation
  Part of the OpenEnergyMonitor project:
  http://openenergymonitor.org

  Group module has been developed by Carbon Co-op
  https://carbon.coop/
 
 */

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

function assessment_on_delete_user($args) {
    global $mysqli;
    $userid = (int) $args['userid'];

    // We cannot use prepared statements as we need the table to ba a paremeter
    $result = "";
    if ($result1 = $mysqli->query("SELECT * FROM assessment WHERE `userid`='$userid'")) {
        if ($result1->num_rows > 0) {
            $result .= "- $result1->num_rows MHEP assesments\n";
            if ($args['mode'] == "permanentdelete")
                $mysqli->query("DELETE FROM assessment WHERE `userid`='$userid'");
        }
    }
    if ($result1 = $mysqli->query("SELECT * FROM assessment_access WHERE `userid`='$userid'")) {
        if ($result1->num_rows > 0) {
            $result .= "- access to $result1->num_rows MHEP assessments \n";
            if ($args['mode'] == "permanentdelete")
                $mysqli->query("DELETE FROM assessment_access WHERE `userid`='$userid'");
        }
    }
    if ($result1 = $mysqli->query("SELECT * FROM element_library WHERE `userid`='$userid'")) {
        if ($result1->num_rows > 0) {
            $result .= "- $result1->num_rows MHEP libraries\n";
            if ($args['mode'] == "permanentdelete")
                $mysqli->query("DELETE FROM element_library WHERE `userid`='$userid'");
        }
    }
    if ($result1 = $mysqli->query("SELECT * FROM element_library_access WHERE `userid`='$userid'")) {
        if ($result1->num_rows > 0) {
            $result .= "- access to $result1->num_rows MHEP libraries\n";
            if ($args['mode'] == "permanentdelete")
                $mysqli->query("DELETE FROM element_library_access WHERE `userid`='$userid'");
        }
    }
    if ($result1 = $mysqli->query("SELECT * FROM organisation_membership WHERE `userid`='$userid'")) {
        if ($result1->num_rows > 0) {
            $result .= "- membership from $result1->num_rows MHEP organizations\n";
            if ($args['mode'] == "permanentdelete")
                $mysqli->query("DELETE FROM organisation_membership WHERE `userid`='$userid'");
        }
    }
    return $result;
}

?>
