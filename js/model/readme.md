# OpenBEM

An Open source Building Energy Model based on SAP.

## Current development by 

- Coder: Carlos Alonso-Gabizon from [Carbon Co-op](http://carbon.coop/)
- Consultant: Marianne Heaslip from [Urbed](http://urbed.coop/)
- Project manager: Jonathan Atkinson from [Carbon Co-op](http://carbon.coop/) 

## Big thanks to:

- Trystan Lea from [OpenEnergyMonitor](https://openenergymonitor.org/), original developer 
- Helen Grimshaw from [Urbed](http://urbed.coop/), consultant 
- Gervase Mangwana [Waxwing Energy](https://uk.linkedin.com/in/gervasecooke), asessor

## What is OpenBEM

As stated above OpenBEM is an Open source Building Energy Model. The calculations follow the SAP2012 worksheets workflow. SAP is known because its inconsistencies and misleading assumptions. Because of them, OpenBEM implementation differs from SAP in all those situations where we thought it could be improved. A list of differences can be found below.

OpenBEM has been developed as part of a bigger project to help households design the retrofit works for their houses: [MyHomeEnergyPlanner](https://github.com/emoncms/MyHomeEnergyPlanner/). But OpenBEM itself is a stand alone tool that can easily be used in other projects. As an example [Carbon Co-op](http://carbon.coop/) and [Urbed](http://urbed.coop/) have developed another tool based on OpenBEM to quickly and easily assess the energy performance and emissions of houses in Salford area: [MyHomeEnergySaldford](http://myhomeenergysalford.carbon.coop/). An extremely simple Javascript use of the model is shown in the [index.html](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/index.html) file included in the model directory.

## Who is it for

OpenBEM is aimed for everybody with interest in the effect that buildings have on the environment. From students to modellers and software developers OpenBEM is free to use, share and modify. 

## License

OpenBEM is released under a GPL license, this means that any modifications you do and that you put in the public domain need to remain under the same GPL license. You can still use OpenBEM for your own profit [as we, the developers, do](http://carbon.coop/content/household-energy-assessment)  . 

If you use OpenBEM, we would appreciate you letting us know. No matter if it is for profit or not. If you use it, you are part of our commmunity and your experiences will help making OpenBEM better and making our, your and every user's work better. This is the power of Open Source.

## Bussiness Models based on Open Source

We are very interested in Business Models and how open source can be used for making money at the same time as being a contribution for a better and fairer society. We encourage people to think of ways to make a living with OpenBEM or any other opensource product. Let us learn from you and share you experience with us. 

OpenBEM and [MyHomeEnergyPlanner](https://github.com/emoncms/MyHomeEnergyPlanner/) are "our" open source codes and our Business Model based on Open Source is a social franchise to deliver home energy assessment, more about this to come soon.

## Differences with SAP2012

Here we show a list of differences between OpenBEM and SAP2012. Being humble, there must be more. SAP is a monster difficult to implement (even more when you are an assessor following the worksheets). We say this because we have probably missed the awkward footnote that tells the assessor to reduce the g-value for a window due to dirt (joke).

 - [calc.occupancy](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L158): SAP calculates occupancy from total floor area, we allow input of custom occupancy
 - [calc.fabric](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L234): According to SAP2012 (p,26 note2) *a solar access factor of 1.0 [...] should be used for roof lights*, but we think that is not right (see [issue 237](https://github.com/emoncms/MyHomeEnergyPlanner/issues/237 )
 - [calc.ventilation](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L461): ventilation loses in SAP is calculated from the loses due to infiltration and ventilation system (see calculation 25m in worksheets). OpenBEM keeps those loses separated and calls them: ventilation loses (due to ventilation system) and infiltratioon loses (due to the building)
 - [calc.ventilation](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L461): despite SAP doesn't make a difference between ventilation and infiltration loses, the loses due to Extract Ventilation Points (intermittent fans and passive vents) is in the part of the formula that corresponds with "infiltration". OpenBEM considers them to be loses due to the ventilation system. See [issue 177](https://github.com/emoncms/MyHomeEnergyPlanner/issues/177)
 - [calc.ventilation](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L461): SAP has a magnificient mistake when calculating the Infiltration Rate if a pressurisation test has been carried out. Formula 18 in worksheet adds q50 (m<sup>3</sup>/hm<sup>2</sup> of envelope area) with ACH (air changes per hour). In the case of using q50 we first convert it from m<sup>3</sup>/hm<sup>2</sup> of envelope area to ACH and then calculate the infiltration rate (ACH) 
 - [calc.ventilation](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L461): SAP only considers 4 type of ventilation systems:
   - a: Balanced mechanical ventilation with heat recovery (MVHR)
   - b: Balanced mechanical ventilation without heat recovery (MV)
   - c: Whole house extract ventilation or positive input ventilation from outside
   - d: Natural ventilation or whole house positive input ventilation from loft
 - But OpenBEM considers:
   - NV: natural ventilation (type 'd' in SAP)
   - IE: Intermittent Extract Ventilations (type 'd' in SAP)
   - PS: Passive Stack (type 'd' in SAP)
   - DEV: Decentralised continous mechanical extract ventilation (type 'c' in SAP)
   - MEV: Centralised Mechanical Continuous Extract Ventilation (type 'c' in SAP)
   - MV: Balanced Mechanical Ventilations without heat recovery (type 'b' in SAP)
   - MVHR: Balanced mechanical ventilation with heat recovery (type 'a' in SAP)
 - SAP defines fixed values for ventilation rates of Extract Ventilation Points, these can be changed in OpenBEM to their actual specification
 - In SAP, the energy requirements for Intermittent Extract Ventilations (type 'd' in SAP) are 0, OpenBEM adds 28kWh/year per Extract Ventilation Point (BREDEM)
 - [calc.temperature](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L708): SAP assumes specific periods with heating off in week or weekend days (table 9). OpenBEM allows the user to define the number and length of the periods
 - SAP doesn't take into account the energy used for appliances and cooking for the calculations of total cost, primary energy and CO<sub>2</sub> emissions. OpenBEM does
 - When using SAP calculation for LAC: 
   - The energy requirements for cooking are calculated from the CO<sub>2</sub> emissions applying a emission factor of 0.519 (we just assume cooking is done with electricity. 
 - OpenBEM has *energy_efficient_appliances* as input. When set to true: reduced internal heat gains are assumed (as per SAP) and also a coefficient of 0.9 is applied in the calculation of the annual energy used for appliances
 - OpenBEM allows to calculate energy requirements, gains and CO<sub>2</sub> for LAC inputing a detailed list of items with info about the power they use, efficiency and time of use. This method can be more accurate than SAP
 - OpenBEM allows to calculate energy requirements, gains and CO<sub>2</sub> for Appliances and Cooking using items from a Carbon Co-op library. This method can be more accurate than SAP
 - OpenBEM allows to override the SAP calculation for annual energy content of hot water



## How to use OpenBEM

The approach when developing OpenBEM was to split SAP worksheets into different modules, each of them implementing a specific calculation for the building model. OpenBEM can be run as a whole or each module can be run on its own. For example, a researcher wanting to understand the effect on solar gains of different type of glazing may want to only run the [*fabric*](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L234) module with just windows as inputs and forget about the rest of the house.

OpenBEM is a Javascript Object and each module is a function. A data object is passed to the model (or module). The inputs are properties of that data object. The model (or module) will return the same data object with new extra properties (the outputs). To understand it see the very simple example _index.html_ 

##Model inputs vs. module inputs
As with every model, the user needs to specify the inputs to it. Then the model processes them and generates some outputs. 

The inputs required to fully run the model are specified in [model-dataIn-examples.js](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-dataIn-examples.js). We have tried to make that file as clear as possible so that the user knows the meaning and format of those inputs. In case of doubt the user will have to check the model itself or give us a shout.

When running the whole model the different modules [are call in order](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L38)]. The inputs to each module can have a different origin:

- Inputs provided by the user
- Inputs provided by the model itsel: they are outputs of a module run before the current one

For example, the inputs to the [*fabric*](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L234) module are :

- data.fabric.elements
- data.fabric.thermal_bridging_yvalue
- data.fabric.global_TMP
- data.fabric.global_TMP_value
- data.TFA

When running the whole model the first four inputs required by the [*fabric*](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L234) module are provided by the user (as you can see in [model-dataIn-examples.js](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-dataIn-examples.js)  but the last one (data.TFA) is provided by the model itself because it is an output of the [*floors*](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L129) module which was run before the [*fabric*](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L234) one.

It is very important to be aware of this two types of inputs when running modules on their own as the user will have to provide all of them.

To help users we have documented each module specifying:

- User inputs: the ones that the user always have to provide (when running the whole model or just a module). A better definition of them is given in [model-dataIn-examples.js](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-dataIn-examples.js)
- Inputs from the model itself: the ones that the user will have to provide too when running a module on its own. They are listed but not very much information is given.

##Global outputs vs Module variable
The outputs of the model are called *Global outputs* and can be found in the documentation for each module. They are considered so because they represent values that we belief are the most relevant ones. But each module generates plenty more information that can be of great use for the user, they are middle steps in the process of the calculations.

Take for example, the [*fabric*](https://github.com/emoncms/MyHomeEnergyPlanner/blob/development/Modules/assessment/js/model/model-r10.js#L234) module. Some of its *global outputs* are:

- data.TMP: thermal mass paremeter
- data.losses_WK.fabric: loses through the fabric elements
- data.gains_W.solar: solar gains

While some of its *module variables* are:

- data.fabric.total_external_area: the exposed are of the building
- data.fabric.total_floor_WK: looses through floor
- data.fabric.total_floor_area
- data.fabric.total_thermal_capacity
 
The *module variables* can still be seen as module outputs as they can be used in a user interface or can give valid informatin to a researcher.

