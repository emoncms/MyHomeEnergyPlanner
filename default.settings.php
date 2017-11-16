<?php
    // Insert user id's of admin users here
    $assessment_admin_users = array(1);

    $app_title = "OpenEnergyMonitor";
    $app_description = "Open Source Home Energy Assessment";
    $app_color = "#0699fa";
    $reports = array(
        array('docname'=>"oemreport", 'fullname'=>"OEM Report")
    );
    /*

    Database connection settings

    */

    $username = "username";
    $password = "password";
    $server   = "localhost";
    $database = "database";

    $redis_enabled = true;

    // To enable / disable password reset set to either true / false
    // default value of " _ENABLE_PASSWORD_RESET_ " required for .deb only
    // uncomment 1 of the 2 following lines & comment out the 3rd line.
    // $enable_password_reset = true;
    // $enable_password_reset = false;
    $enable_password_reset = false;

    /*

    Default router settings - in absence of stated path

    */

    // Default controller and action if none are specified and user is anonymous
    $default_controller = "user";
    $default_action = "login";

    // Default controller and action if none are specified and user is logged in
    $default_controller_auth = "assessment";
    $default_action_auth = "list";
    
    // Public profile functionality
    // $public_profile_enabled = TRUE;
    // $public_profile_controller = "dashboard";
    // $public_profile_action = "view";
    
    /*

    Other

    */

    // Theme location
    $theme = "basic";

    // Error processing
    $display_errors = true;

    // Allow user register in emoncms
    $allowusersregister = false;

    // Bolt down MyHomeEnergyPlanner install if used in conjunction with seperate emoncms installation    
    $allowuseredit = false;
    $admin_enable_userlist = false;
    
    // Enable remember me feature - needs more testing
    $enable_rememberme = true;

    // Skip database setup test - set to false once database has been setup.
    $dbtest = false;

    // Log4PHP configuration
    $log4php_configPath = 'logconfig.xml';
    
    // MyHomeEnergyPlanner
    $allow_image_upload = false;
