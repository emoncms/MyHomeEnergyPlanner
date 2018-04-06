# MyHomeEnergyPlanner
My Home Energy Planner - Open Source home energy assessment software based on emoncms framework + openbem

    cd /var/www/emoncms/Modules
    git clone -b module https://github.com/emoncms/MyHomeEnergyPlanner.git assessment
   
Setup default open library:
    
    sudo ln -s /var/www/mhep/Modules/assessment/library/master.json /var/lib/mhep/1.json
    
Then run in browser:

    http://localhost/mhep/assessment/setuplibraries
