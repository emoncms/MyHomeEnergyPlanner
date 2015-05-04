<!doctype html>
<?php
  /*
  All Emoncms code is released under the GNU Affero General Public License.
  See COPYRIGHT.txt and LICENSE.txt.

  ---------------------------------------------------------------------
  Emoncms - open source energy visualisation
  Part of the OpenEnergyMonitor project:
  http://openenergymonitor.org
  */

  global $path,$emoncms_version,$app_title,$app_description,$app_color;
?>
    
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo $app_description; ?></title>
        <link href='http://fonts.googleapis.com/css?family=Ubuntu:300' rel='stylesheet' type='text/css'>

        <!-- Thanks to Baptiste Gaultier for the emoncms dial icon http://bit.ly/zXgScz -->
        <link rel="shortcut icon" href="<?php echo $path; ?>Theme/favicon.png" />
        <!-- APPLE TWEAKS - thanks to Paul Dreed -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <link rel="apple-touch-startup-image" href="<?php echo $path; ?>Theme/ios_load.png">
        <link rel="apple-touch-icon" href="<?php echo $path; ?>Theme/logo_normal.png">
        <link href="<?php echo $path; ?>Lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <link href="<?php echo $path; ?>Lib/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">
        <link href="<?php echo $path; ?>Lib/bootstrap-datetimepicker-0.0.11/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
        <link href="<?php echo $path; ?>Theme/style.css" rel="stylesheet">
        <script type="text/javascript" src="<?php echo $path; ?>Lib/jquery-1.9.0.min.js"></script>

        <style>
            :root {
                --app-color: <?php echo $app_color;?>;
            }
            
            .cc {
                color: var(--app-color);
                font-weight: bold;
                padding-right:20px;
                
            }

            .title {
                padding: 10px 30px;
                color:#888;
                float:left;
            }
        </style>

    </head>

    <body>
        <div id="wrap">
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <!--<div class="container">-->
                  <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <img src="<?php echo $path; ?>Theme/favicon.png" style="width:28px;"/>
                    </button>
                    
                    <div class="title"><span class="cc"><?php echo $app_title; ?></span> <?php echo $app_description; ?></div>
                    
                    <div class="nav-collapse collapse">
                    
                      <?php if (!isset($runmenu)) $runmenu = '';
                            echo $mainmenu.$runmenu;
                      ?>
                    </div>
                <!--</div>-->
            </div>
        </div>

        <div id="topspacer"></div>

        <?php if (isset($submenu) && ($submenu)) { ?>
          <div id="submenu">
              <div class="container">
                  <?php echo $submenu; ?>
              </div>
          </div><br>
        <?php } ?>

        <?php
          if (!isset($fullwidth)) $fullwidth = false;
          if (!$fullwidth) {
        ?>

        <div class="container">
            <?php echo $content; ?>
        </div>

        <?php } else { ?>
            <?php echo $content; ?>
        <?php } ?>


        <div style="clear:both; height:60px;"></div>
        </div>

        <div id="footer">
            <?php echo _('Powered by '); ?>
            <a href="http://openenergymonitor.org">openenergymonitor.org</a>
            <span> | v<?php echo $emoncms_version; ?></span>
        </div>

        <script src="<?php echo $path; ?>Lib/bootstrap/js/bootstrap.js"></script>

    </body>

</html>
