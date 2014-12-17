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
        <title><?php $app_title; ?></title>
        <link href='http://fonts.googleapis.com/css?family=Ubuntu:300' rel='stylesheet' type='text/css'>
        <link href="<?php echo $path; ?>Theme/style.css" rel="stylesheet">
        
        <style>
        :root {
            --app-color: <?php echo $app_color;?>;
        }
        </style>
        
        <script type="text/javascript" src="<?php echo $path; ?>Lib/jquery-1.9.0.min.js"></script>
    </head>

    <body>
        <div id="wrap">
        
        <div class="navbar">   
        <div style="float:left">
            <div class="title"><span class="cc"><?php echo $app_title; ?></span> <?php echo $app_description; ?></div>
        </div>
          <?php if (!isset($runmenu)) $runmenu = '';
                echo $mainmenu.$runmenu;
          ?>
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
    </body>

</html>
