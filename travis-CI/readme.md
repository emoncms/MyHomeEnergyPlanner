# MyHomeEnergyPlanner Continuous Integration

CI has been implemented with Travis. The github app has been added to the emoncms/myhomeenergyplanner repository

The building is happening in travis-ci.com

The Travis build:
- installs apache server
- installs swiftmailer
- installs emoncms
- sets up a database
- creates emonCMS settings.php (beware no SMTP set up)
- installs Carbon Co-op theme
- installs MHEP
- sets up testing suite
- runs tests:
    - create first emonCMS user and login
    - MHEP tests

Tests are only run in Firefox (ToDo Chrome)