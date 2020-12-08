# Assessment module version changelog
Given a version number MAJOR.MINOR.PATCH:

- MAJOR version MUST be incremented if any backwards incompatible changes are introduced. It MAY include minor and patch level changes. 
- MINOR version MUST be incremented if new, backwards compatible functionality is introduced to the public API. It MUST be incremented if any public API functionality is marked as deprecated. It MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes.
- PATCH version MUST be incremented if only backwards compatible bug fixes are introduced. A bug fix is defined as an internal change that fixes incorrect behaviour.

## Version 1.1.2 

 - Fix bug in invalid regular expresion after upgrading php
 - Fix total cost of measure in summary table showing cost per unit
 - Images directory creation when cloning repository
 - CI with Travis
 - Test suite and tests
 - Added delete_all_from_user() to model
 - Issue 401: Sections 13a, 13b, 13c of report not displaying properly
 - Issue 33: assessments with a "Complete status" are locked
 - Issue 185: added notes_for_developers.md
 - Cleanup of unused files
 - Issue 102: form that could populate the ‘householdquestionnaire’ in advance of the visit
 - Added tests

## Version 1.1.1 

 - Removed commented text
 - Issue 284: modals can be dragged around
 - Issue 389: revert to master in fabric not working
 - Removed backwards compatibility and old comments from view.php
 - Tidy up view.php
 - Fetch report from query string ni a more sensible way
 - Load google fonts with https
 - Only accessible reports (that match the organization name) are displayed in the menu
 - Issue 252: added picture notes
 - Issues 119 and 323: 'Measured applied" added everywhere where a measure has been applied
 - Fixed bug: when adding a new heating system as a measure the id of the heating system was wrong
 - Fixed bug: MHEP report breaking when there was a water storage in master but there wasn't in the scenario
 - Removed wrong information about how the comparison tables are built
 - Remove measure.space_heating as it is not longer used (who knows from when)
 - Issue 119: measures tables added to MHEP report
 - Fabric Energy Efficiency added to comparison tables MHEP report
 - Issue 357: Take 'Commentary' off Householder Questionnaire Page
 - Issue 354: added total loss per type of fabric element to bottom of tables
 - Issue 396: fixed bug when parent scenario has been deleted then the tool crashes because it can't check if it has to show the * that says that parent scenario has changed
 - Fixed error shown in console in fabric view when data.measures object doesn't exist
 - Fixed bug when trying to initialize 'revert to original' when there is no create_from scenario
 - Fixed bug global variable scenario was always set to last scenario.I guess this was introduced in 'Tidy up view.php'
 - Issue 394: bulk measure cost recalculated when reverting a fabric element to original
 - Issue 351: Display the cost of an applied measure on line for that element in the tool dialogue
 - Issue 301: Bulk delete of images in gallery
 - Issue 188: ability top delete a fuel for fans and pumps in Fuel requirements
 - Issue 256: added scenario's overviews of commentary view
 - Removed targetbar-carboncoop.js


## Version 1.1.0 

 - Issue 384: assessment data object encrypted in database
 - Issue 382: clarification about the use of area instead of netarea for the cost os a wall measure
 - Issue 371: values for each drop down option displayed (openFUVC)
 - Revert to master not displayed when scenario is locked
 - Issue 375: menu doesn't collapse when applying measure anymore
 - Issue 270: added link to flood zone and flood resiliance to context page
 - Issue  381: administration menu item added to Theme
 - Issue 373: measures cost figure removed from onscreen report pages (not printed)
 - Issue 347: Create a new graph in the report that shows 'Fabric Energy Efficiency' rather than 'Space Heating Demand'.
 - Issue 339: Fixed: detailed list (LAC) mad behaviour: changing any of the inputs was adding an extra item to the list
 - Issue 309: inputs for length, heigh, area, perimeter in fabric elements changed from type text to number
 - Issue 288: text and arrows on the sides are lighter for clarity in terms of which text goes with which arrow
 - Issue 285: moving fabric elements up and donw in the list
 - Delete user hook for deleting user data

## Version 1.0.0 (2018-06-08)
Despite MHEP has being fully functional for some years now I am calling it, at this stage, version 1.0.0 because we need a starting point.
Recently MHEP was added to emoncms.org as an extra module. This has made the need of versioning more relevant as sometimes some backwards-incompatible functinality is added. Because we don't want to make anybody's work harder we now have versions :)