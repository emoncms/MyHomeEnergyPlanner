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

    $username = "user";
    $password = "pass";
    $server   = "localhost";
    $database = "db";

    $redis_enabled = true;
    
    $feed_settings = array(
        'phpfiwa'=>array(
            'datadir'=>'/var/lib/phpfiwa/'
        ),
        'phpfina'=>array(
            'datadir'=>'/var/lib/phpfina/'
        ),
        'phptimeseries'=>array(
            'datadir'=>'/var/lib/phptimeseries/'
        )
    );

    // (OPTIONAL) Used by password reset feature
    $smtp_email_settings = array(
      'host'=>"",
      'username'=>"",
      'password'=>"",
      'from'=>array('' => '')
    );

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
    $public_profile_enabled = TRUE;
    $public_profile_controller = "dashboard";
    $public_profile_action = "view";
    
    /*

    Other

    */

    // Theme location
    $theme = "basic";

    // Error processing
    $display_errors = TRUE;

    // Allow user register in emoncms
    $allowusersregister = FALSE;

    // Enable remember me feature - needs more testing
    $enable_rememberme = TRUE;

    // Skip database setup test - set to false once database has been setup.
    $dbtest = TRUE;

    // Log4PHP configuration
    $log4php_configPath = 'logconfig.xml';

    // CSV export options for the number of decimal_places, decimal_place_separator and field_separator
    // The thousands separator is not used (specified as "nothing")
    // NOTE: don't make $csv_decimal_place_separator == $csv_field_separator
    // Adjust as appropriate for your location

    // number of decimal places
    $csv_decimal_places = 2;

    // decimal place separator
    $csv_decimal_place_separator = ".";

    // field separator
    $csv_field_separator = ",";
