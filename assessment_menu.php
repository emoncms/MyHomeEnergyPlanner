<?php

    $domain = "messages";

    $menu_left[] = array(
        'id'=>"assessment_menu",
        'name'=>"MyHomeEnergyPlanner", 
        'path'=>"assessment/list" , 
        'session'=>"write", 
        'order' => 0,
        'icon'=>'icon-home icon-white',
        'hideinactive'=>1
    );
    
    $menu_left[] = array(
        'id'=>"assessment_menu",
        'name'=>"MyHomeEnergyPlanner", 
        'path'=>"assessment/view" , 
        'session'=>"write", 
        'order' => 0,
        'icon'=>'icon-home icon-white',
        'hideinactive'=>1
    );

    $menu_dropdown[] = array(
        'id'=>"assessment_menu_extras",
        'name'=>"MyHomeEnergyPlanner", 
        'path'=>"assessment/list" , 
        'session'=>"write", 
        'order' => 0,
        'icon'=>'icon-home'
    );
    
    

