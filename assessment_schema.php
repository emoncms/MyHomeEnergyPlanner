<?php

$schema['assessment'] = array(
    'id' => array('type' => 'int(11)', 'Null'=>'NO', 'Key'=>'PRI', 'Extra'=>'auto_increment'),
    'name' => array('type' => 'text'),
    'description' => array('type' => 'text'),
    'userid' => array('type' => 'int(11)'),
    'author' => array('type' => 'varchar(30)'),
    'mdate' => array('type' => 'int(11)'),
    'status' => array('type' => 'text'),
    'data' => array('type' => 'mediumtext')
);

$schema['assessment_access'] = array(
    'id' => array('type' => 'int(11)'),
    'userid' => array('type' => 'int(11)'),
    'orgid' => array('type' => 'int(11)'),
    'write' => array('type' => 'int(11)')
);

$schema['organisations'] = array(
    'id' => array('type' => 'int(11)', 'Null'=>'NO', 'Key'=>'PRI', 'Extra'=>'auto_increment'),
    'name' => array('type' => 'text')
);

$schema['organisation_membership'] = array(
    'orgid' => array('type' => 'int(11)'),
    'userid' => array('type' => 'int(11)')
);

$schema['mhep_library'] = array(
    'id' => array('type' => 'int(11)', 'Null'=>'NO', 'Key'=>'PRI', 'Extra'=>'auto_increment'),
    'name' => array('type' => 'text')
);

$schema['mhep_library_access'] = array(
    'id' => array('type' => 'int(11)'),
    'userid' => array('type' => 'int(11)'),
    'orgid' => array('type' => 'int(11)'),
    'write' => array('type' => 'int(11)'),
    'public'=> array('type' => 'int(11)')
);


