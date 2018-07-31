# My Home Energy Planner - Notes for developers

## An emonCMS module
My Home Energy Planner is an emonCMS module. Some information on [how to develop for emonCMS](https://github.com/openenergymonitor/learn/tree/master/view/electricity-monitoring/emoncms-internals).

## Directories and files
 - module.json: used by emoncCMS. Stores the name of the module and version.
 - projects.php: loads the page after logging. It shows the organisations the user belongs to and his/her assessments
 - view.php: shows an assessment, sets global variables and loads the specific view from the URL hash. To understand how MHEP works you must read this file
 - style.css: main css file
 - Views: directory where all the "views" live. MHEP views are the pages you can load like fabric, ventilation, image gallery, etc. See _Working with views_ below
 - reports: directory where all the reports available live
 - images: directory where the assessment images are stored. Inside there is a directory named with the id of each assessment and its images
 - js: directory where we keep all the extra javascript needed to make MHEP work. What you need to know:
    - library-helper: directory. Extensively used in MHEP to manage the libraries and their elements from creating libraries, sharing them with other users, create new elements in a library, add them to an assessment, etc. I am not very proud of it as it's very difficult to undertand and use, sorry! One day we'll get rid of it and completely remake it
    - model: directory where openBEM lives. This takes all the inputs from MHEP and do all the calculations and send the results back to MHEP. You will find help on how to use it in the same directory
    - openFUVC: Open Floor Uvalue Calculator. This is a git submodule that does the u-value calculation for floors, how did you guess? You can find  inline help on how to use it (but you don't really need to)
    - arrow-rX.js: draws the arrows of the house picture at the top of the assessment page
    - library-rX.js: the handcoded library of elements used in MHEP. This is the default library created for users
    - openbem-rX.js: AJAX calls used in MHEP
    - targetbar-rX: draws the horizontal bars graph next to the house at the top of an assessment page
    - ui-helper-rX.js: functions used in MHEP
    - ui-openbem-rX.js: draws the house at the top of the assessment page

## Javascript global variables in an assessment
The following variables can be used in your views javascript:
 - p: object that holds all the data for the assessment like author, name, status and scenarios data
 - project: object that has as properties all the scenarios in the assessment. And for each scenario, all its data
 - scenario :string, scenario currently displayed
 - page: current view loaded, if showing a view
 - report: current report loaded, if showing a report
 - datasets: available as part of openBEM, datasets from SAP2012 and more like monthly average temperature, fuel costs and emissions, etc
 - path: absolute path to emonCMS
 - js-path: absolute path to MHEP module
 - projectid
 - data: object that holds all the data for the current scenario. Using `data` is the same than using `project[scenario]`. You will see it everywhere

## Working with views
Every view must have the 2 following functions:
 - viewname_initUI(): called when the view is loaded for the first time
 - viewname_UpdateUI(): called every time the update function is called (see _The update() function_ below)
Quite often these two function overlap and one gets called from the other.

## The update() function
Defined in view.php. It fetches all the inputs in the view and the rest of the scenario data and runs it through the model. Once the result of the calculations are sent back it calls the viewname_UpdateUI() function so that the view can be updated with the results.
It also sends all the assessment data to the server to save it in the database.

## How to use the key attribute in an html tag
MHEP is a kind of framework in which inputs/selects/texts tags with the key attribute will call the update function when they change.
Also they and any other tag with the key attribute will be automatically updated if its source data changes.
Trying to make it more understandable:
 - We are in the "Basic dwelling data" page (context view)
 - In the view you can find `<input type="text" key="data.altitude" style="width:60px">`
 - When we load the view, that input will automatically be filled with the value in `data.altitude`, remember this is equivalent to `project[current_scencario].altitude`
 - When we manually change the value of the input, `data.altitude` will change and the update function will be called (triggering the model calculation and saving the assessment in the database).

## Working with reports
MHEP provides a default report with:
 - A summary of the results for all the scenarios
 - Comparisons between every scenario and the master scenario
 - Summary of measure in every scenario

Developers can make their own reports and place them in the reports directory. MHEP, when loading a report, sets the following global variables that you can use in your report:
 - scenarios_comparison = {};
 - scenarios_measures_summary = {};
 - scenarios_measures_complete = {}

In order to access your own reports there is a naming convention that you need to follow:
 - MHEP will check the user is in an organisation which name matches with the report directory name, .html and .js files names.
 - Before comparing names all non alphanumeric characters will be removed from the organization name and made it lowercase.

Example: a user that is in an organisation called "Carbon Co-op" or "Carbon Coop" or "carbon coop" will have access to a report in the directory "carboncoop"


## Adding new inputs to the data object
Before passing the data to the model and saving it to the database, the update() function  calls another function (extract_inputdata() in openbem-rX.js). This function fetches the inputs we want and leaving behind the data that we don't need: the results of previous calculations (these are calculated every time so no need to save them).
If the model changes or you want to keep some new data (like the number of steps in the staircase, which is not needed for the model but you may want to ask the household and save) you need to add it to extract_inputdata().

