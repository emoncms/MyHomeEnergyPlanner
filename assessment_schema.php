<?php

$schema['assessment'] = array(
    'id' => array('type' => 'int(11)', 'Null'=>'NO', 'Key'=>'PRI', 'Extra'=>'auto_increment'),
    'name' => array('type' => 'text'),
    'description' => array('type' => 'text'),
    'userid' => array('type' => 'int(11)'),
    'author' => array('type' => 'varchar(30)'),
    'initialisation_vector'=>array('type' => 'binary(16)'),
    'mdate' => array('type' => 'int(11)'),
    'status' => array('type' => 'text'),
    'openBEM_version' => array('type' => 'text'),
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

$schema['element_library'] = array(
    'id' => array('type' => 'int(11)', 'Null'=>'NO', 'Key'=>'PRI', 'Extra'=>'auto_increment'),
    'userid' => array('type' => 'int(11)'),
    'name' => array('type' => 'text'),
    'type' => array('type' => 'text'),
    'data' => array('type' => 'MEDIUMTEXT')
);

$schema['element_library_access'] = array(
    'id' => array('type' => 'int(11)'),
    'userid' => array('type' => 'int(11)'),
    'orgid' => array('type' => 'int(11)'),
    'write' => array('type' => 'int(11)')
);


