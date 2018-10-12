
## My Home Energy Planner

[![Build Status](https://travis-ci.org/emoncms/emoncms.svg?branch=master)](https://travis-ci.org/emoncms/MyHomeEnergyPlanner)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9b4778924dfb4e76b3d1ebcbae5b3579)](https://www.codacy.com/app/emoncms/MyHomeEnergyPlanner?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=emoncms/MyHomeEnergyPlanner&amp;utm_campaign=Badge_Grade)

Open source home energy assessment based on emoncms and emoncms module openbem:

see original: [https://github.com/emoncms/openbem](https://github.com/emoncms/openbem)

### Getting to Zero Carbon
    
Achieving zero carbon is often a two step process, first power down - reduction in energy demand through efficiency, and second powering up the remaining energy demand with sustainable energy.
    
If we look at how energy is used in the UK we find: Space heating (in all buildings) accounts for 20% of total primary energy or 29% of end use energy. Building services (space heating, water heating, lighting & appliances and cooking) make up 30% of total primary energy or 44% of end use energy. (2012 data)

Low energy building technology: highly insulated, air-tight buildings can deliver space heating energy savings of up to 50-90% while simultaneously increasing our comfort.

[OpenEnergyMonitor: Sustainable Energy](https://learn.openenergymonitor.org/sustainable-energy/energy/introduction)

    
My Home Energy Planner is an open source energy assessment tool to help you explore how you can achieve this level of performance improvement in your own home.
    
The model used is based on the 2012 version of SAP (Standard Assessment Procedure for UK EPC's (Energy Performance Certificate's)) developed by the Building Research Establishment for which the full specification can be downloaded from BRE here: [SAP-2012_9-92.pdf](http://www.bre.co.uk/filelibrary/SAP/2012/SAP-2012_9-92.pdf)
    
### Open Source
    
The source code for My Home Energy Planner is available under GPL. You can download and install My Home Energy Planner on your own server, you can look at and peer-review the model calculations, understand how it works, modify and improve it.

### Linux install

My Home Energy Planner requires a Apache2, Mysql, PHP (LAMP) server, the installation procedure is much the same as emoncms as it is based on the emoncms framework.

My Home Energy Planner - Open Source home energy assessment software based on emoncms framework + openbem

    cd /var/www/emoncms/Modules
    git clone -b development https://github.com/emoncms/MyHomeEnergyPlanner.git assessment

My Home Energy Planner uses [openFUVC](http://openflooruvaluecalculator.carbon.coop/) to help assessors calculate floor u-values. This has been added as git submodule, you also need to clone it

    cd /var/www/emoncms/Modules/assessment
    git submodule init
    git submodule update

Also you may need to change the ownership and permissions for the _images_ directory:

	chown :www-data images
	chmod 774 images

### emonCMS settings
The following variables can be added to setting.php

 - $MHEP_image_gallery = true; // If true then the image gallery will be available
 - $MHEP_key = "a 32 byte key"; // If set MHEP will encrypt the assessment data in the database . Command to generate it (32 bytes = 256 bits): openssl rand -hex 32
