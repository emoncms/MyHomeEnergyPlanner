<?php

$schema['assessment'] = array(
    'id' => array('type' => 'int(11)', 'Null'=>'NO', 'Key'=>'PRI', 'Extra'=>'auto_increment'),
    'name' => array('type' => 'text'),
    'description' => array('type' => 'text'),
    'userid' => array('type' => 'int(11)'),
    'author' => array('type' => 'varchar(30)'),
    'mdate' => array('type' => 'int(11)'),
    'status' => array('type' => 'text'),
    'data' => array('type' => 'text')
);

$schema['assessment_access'] = array(
    'admin' => array('type' => 'int(11)', 'default'=>0),
    'userid' => array('type' => 'int(11)')
);
