function compare_initUI() {

  var out = "";

  var changes = [
  
    ["Region",'region'],
    ["Altitude",'altitude'],
    ["use_custom_occupancy",'use_custom_occupancy'],
    ["custom_occupancy",'custom_occupancy'],

    ["Number of chimney's",'ventilation.number_of_chimneys'],
    ["Number of open flue's",'ventilation.number_of_openflues'],
    ["Number of intermittent fans",'ventilation.number_of_intermittentfans'],
    ["Number of passive vents",'ventilation.number_of_passivevents'],
    ["Number of flueless gas fires",'ventilation.number_of_fluelessgasfires'],
    
    ["Dwelling construction",'ventilation.dwelling_construction'],
    ["Suspended wooden floor",'ventilation.suspended_wooden_floor'],
    ["Draught lobby",'ventilation.draught_lobby'],
    ["Percentage draught proofed",'ventilation.percentage_draught_proofed'],
    
    ["Air permeability test",'ventilation.air_permeability_test'],
    ["Air permeability value",'ventilation.air_permeability_value'],
    
    ["Number of sides sheltered",'ventilation.number_of_sides_sheltered'],
    ["Ventilation type",'ventilation.ventilation_type'],
    ["System air change rate",'ventilation.system_air_change_rate'],
    ["Balanced heat recovery efficiency",'ventilation.balanced_heat_recovery_efficiency'],
    
    ["<b>Lighting, Appliances & Cooking:</b> enabled",'use_LAC'],
    ["<b>Lighting, Appliances & Cooking:</b> Number of low energy light fittings",'LAC.LLE'],
    ["<b>Lighting, Appliances & Cooking:</b> Number of light fittings",'LAC.L'],
    
    ["<b>Lighting, Appliances & Cooking:</b> reduced internal heat gains",'LAC.reduced_internal_heat_gains'],
    
    
    ["<b>Water Heating:</b> Low water use design","water_heating.low_water_use_design"],
    ["<b>Water Heating:</b> Instantaneous hotwater","water_heating.instantaneous_hotwater"],
    ["<b>Water Heating:</b> Solar water heating","water_heating.solar_water_heating"],
    ["<b>Water Heating:</b> Pipework insulated fraction","water_heating.pipework_insulated_fraction"],
    ["<b>Water Heating:</b> Declared loss factor known","water_heating.declared_loss_factor_known"],
    ["<b>Water Heating:</b> Manufacturer loss factor","water_heating.manufacturer_loss_factor"],
    ["<b>Water Heating:</b> Storage Volume","water_heating.storage_volume"],
    ["<b>Water Heating:</b> temperature_factor_a","water_heating.temperature_factor_a"],
    ["<b>Water Heating:</b> loss_factor_b","water_heating.loss_factor_b"],
    ["<b>Water Heating:</b> volume_factor_b","water_heating.volume_factor_b"],
    ["<b>Water Heating:</b> temperature_factor_b","water_heating.temperature_factor_b"],
    ["<b>Water Heating:</b> community_heating","water_heating.community_heating"],
    ["<b>Water Heating:</b> hot_water_store_in_dwelling","water_heating.hot_water_store_in_dwelling"],
    ["<b>Water Heating:</b> Contains dedicated solar storage or WWHRS","water_heating.contains_dedicated_solar_storage_or_WWHRS"],
    ["<b>Water Heating:</b> hot_water_control_type","water_heating.hot_water_control_type"],
    
    
    ["<b>Solar Hot Water:</b> Aperture area of solar collector","SHW.A"],
    ["<b>Solar Hot Water:</b> Zero-loss collector efficiency, η0","SHW.n0"],
    ["<b>Solar Hot Water:</b> Collector linear heat loss coefficient, a1","SHW.a1"],
    ["<b>Solar Hot Water:</b> Collector 2nd order heat loss coefficient, a2","SHW.a2"],
    ["<b>Solar Hot Water:</b> Collector Orientation","SHW.orientation"],
    ["<b>Solar Hot Water:</b> Collector Inclination","SHW.inclination"],
    ["<b>Solar Hot Water:</b> Overshading factor","SHW.overshading"],
    ["<b>Solar Hot Water:</b> Dedicated solar storage volume, Vs, (litres)","SHW.Vs"],
    ["<b>Solar Hot Water:</b> Total volume of combined cylinder (litres)","SHW.combined_cylinder_volume"],
    
    ["<b>Heating system:</b> Responsiveness","temperature.responsiveness"],
    ["<b>Heating system:</b> Control type","temperature.control_type"],

    ["Target living area temperature","temperature.target"],
    ["Living area","temperature.living_area"],
    
    ["<b>Custom model:</b> Use utilisation factor for gains","space_heating.use_utilfactor_forgains"]
    

  ];
  
  out += "<table class='table table-striped'>";
  
  for (z in changes)
  {
    var keystr = changes[z][1];
    var description = changes[z][0];
    
    var keys = keystr.split(".");
    
    var subA = project.master;
    var subB = project[scenario];
    
    for (z in keys)
    {
      if (subA!=undefined) {
        subA = subA[keys[z]];
      }

      if (subB!=undefined) {
        subB = subB[keys[z]];
      }
    }
    
    var valA = subA;
    var valB = subB; 
    
    if (valA!=valB) {
      out += "<tr><td>"+description+" changed from "+valA+" to "+valB+"</td></tr>";
    }
  }
  
  out += "</table>";
  
  
  // Changes to elements
  var listA = project.master.fabric.elements;
  var listB = project[scenario].fabric.elements;
  
  var elements_html = "";
  
  for (z in listA)
  {
        if (listB[z]==undefined)
        {
            elements_html += "<tr><td>Element: <b>'"+z+"'</b> in scenario A has been deleted</td></tr>";
        }
  }
  
  for (z in listB)
  {
        if (listA[z]==undefined)
        {
            elements_html += "<tr><td>New Element: <b>'"+z+"'</b> added to scenario B</td></tr>";
        }
        else
        {
            
            if (JSON.stringify(listA[z]) != JSON.stringify(listB[z]))
            {
                elements_html += "<tr><td><b>"+listA[z].name+":</b><br><i>";
                for (x in listA[z])
                {
                    if (x=='description') elements_html += listA[z][x]+", ";
                    if (x=='area') elements_html += "Area: "+listA[z][x].toFixed(1)+"m<sup>2</sup>, ";
                    if (x=='uvalue') elements_html += "U-value: "+listA[z][x]+", ";
                    if (x=='kvalue') elements_html += "k-value: "+listA[z][x];
                    if (x=='g') elements_html += "g: "+listA[z][x]+", ";
                    if (x=='gL') elements_html += "gL: "+listA[z][x]+", ";
                    if (x=='ff') elements_html += "Frame factor: "+listA[z][x];
                }
                elements_html += "</i></td>";
                
                elements_html += "<td>"+(listA[z].uvalue*listA[z].area).toFixed(1)+" W/K</td>";
                
                elements_html += "<td><b>"+listB[z].name+":</b><br><i>";
                for (x in listB[z])
                {
                    if (x=='description') elements_html += listA[z][x]+", ";
                    if (x=='area') elements_html += "Area: "+listA[z][x].toFixed(1)+"m<sup>2</sup>, ";
                    if (x=='uvalue') elements_html += "U-value: "+listB[z][x]+", ";
                    if (x=='kvalue') elements_html += "k-value: "+listB[z][x];
                    if (x=='g') elements_html += "g: "+listB[z][x]+", ";
                    if (x=='gL') elements_html += "gL: "+listB[z][x]+", ";
                    if (x=='ff') elements_html += "Frame factor: "+listB[z][x];
                }
                elements_html += "</i></td>";
                
                elements_html += "<td>"+(listB[z].uvalue*listB[z].area).toFixed(1)+" W/K</td>";
                
                var saving = (listA[z].uvalue*listA[z].area) - (listB[z].uvalue*listB[z].area);
                
                elements_html += "<td>";
                if (saving>0) elements_html +="<span style='color:#00aa00'>-";
                if (saving<0) elements_html +="<span style='color:#aa0000'>+";
                elements_html += (saving).toFixed(1)+" W/K</span></td>";
                
                elements_html += "</tr>";
            }
        }
  }
  
  if (elements_html!="") {
    out += "<hr><h3>Building Elements</h3><hr>";
    out += "<p>Changes to Floor's, Wall's, Windows and Roof elements</p>";
    out += "<table class='table table-striped'>";
    out += "<tr><th>Before</th><th>W/K</th><th>After</th><th>W/K</th><th>Change</th></tr>";
    out += elements_html;
    out += "</table>";
  }
  
  
  out += "<hr><h3>Energy Requirements</h3><hr>";
  
  // Changes to elements
  var listA = project.master.energy_requirements;
  var listB = project[scenario].energy_requirements;
  console.log(listA);
  console.log(listB);
  out += "<table class='table table-striped'>";
 
  for (z in listA)
  {
        if (listB[z]==undefined)
        {
                out += "<tr><td>";
                
                out += "<b>"+listA[z].name+": </b>";
                out += listA[z].quantity.toFixed(0)+" kWh";
                out += "</td><td><b>Deleted in scenario B</b></td><td></td></tr>";
        }
  }
   
    for (z in listB)
    {
        if (listA[z]==undefined)
        {
            out += "<tr><td><b>New to scenario B</b></td><td>";

            out += "<b>"+listB[z].name+": </b>";
            out += listB[z].quantity.toFixed(0)+" kWh <b>(New)</b>";

            out += "</td><td></td></tr>";
        }
        else
        {
            if (JSON.stringify(project.master.energy_systems[z]) != JSON.stringify(project[scenario].energy_systems[z]))
            {   
                out += "<tr><td>";

                out += "<b>"+listA[z].name+": </b>";
                out += listA[z].quantity.toFixed(0)+" kWh<br>";
                out += "  Supplied by:<br>";
                
                for (i in project.master.energy_systems[z])
                {
                    out += "  - Type: "+project.master.energy_systems[z][i].system+", ";
                    out += "Fraction: "+(project.master.energy_systems[z][i].fraction*100).toFixed(0)+"%, ";
                    out += "Efficiency: "+(project.master.energy_systems[z][i].efficiency*100).toFixed(0)+"%";
                    out += "<br>";
                }

                out += "</td><td>";

                out += "<b>"+listB[z].name+": </b>";
                out += listB[z].quantity.toFixed(0)+" kWh<br>";
                out += "  Supplied by:<br>";
                
                for (i in project[scenario].energy_systems[z])
                {
                    out += "  - Type: "+project[scenario].energy_systems[z][i].system+", ";
                    out += "Fraction: "+(project[scenario].energy_systems[z][i].fraction*100).toFixed(0)+"%, ";
                    out += "Efficiency: "+(project[scenario].energy_systems[z][i].efficiency*100).toFixed(0)+"%";
                    out += "<br>";
                }

                out += "</td><td></td></tr>";
            }
            
        }
    }
  
  // out += "</table>";
  out += "<tr><td><hr><h3>Fuel costs</h3><hr></td><td></td><td></td></tr>";
  // out += "<h3>Fuel costs</h3>";
  
  // Changes to elements
  var listA = project.master.fuel_totals;
  var listB = project[scenario].fuel_totals;
  
  //out += "<table class='table table-striped'>";
  
  for (z in listA)
  {
        if (listB[z]==undefined)
        {
                out += "<tr><td>";
                
                out += "<b>"+z+": </b><br>";
                out += "Fuel quantity: "+listA[z].quantity.toFixed(0)+" kWh<br>";
                out += "Fuel cost: £"+listA[z].fuelcost.toFixed(2)+"<br>";
                out += "Annual cost: £"+listA[z].annualcost.toFixed(0)+"<br>";
                
                out += "</td><td><br><b>Deleted in scenario B</b></td></tr>";
        }
  }
  
  for (z in listB)
  {
        if (listA[z]==undefined)
        {
                out += "<tr><td><br><b>New to scenario B</b></td><td>";
                
                out += "<b>"+z+": </b><br>";
                out += "Fuel quantity: "+listB[z].quantity.toFixed(0)+" kWh<br>";
                out += "Fuel cost: £"+listB[z].fuelcost.toFixed(2)+"<br>";
                out += "Annual cost: £"+listB[z].annualcost.toFixed(0)+"<br>";
                
                out += "</td></tr>";
        }
        else
        {
            
            if (JSON.stringify(listA[z]) != JSON.stringify(listB[z]))
            {   
                out += "<tr><td>";
                
                out += "<b>"+z+": </b><br>";
                out += "Fuel quantity: "+listA[z].quantity.toFixed(0)+" kWh<br>";
                out += "Fuel cost: £"+listA[z].fuelcost.toFixed(2)+"<br>";
                out += "Annual cost: £"+listA[z].annualcost.toFixed(0)+"<br>";
                
                out += "</td><td>";
                
                out += "<b>"+z+": </b><br>";
                out += "Fuel quantity: "+listB[z].quantity.toFixed(0)+" kWh<br>";
                out += "Fuel cost: £"+listB[z].fuelcost.toFixed(2)+"<br>";
                out += "Annual cost: £"+listB[z].annualcost.toFixed(0)+"<br>";
                
                out += "</td>";
                
                out += "<td><br>";
                
                out += (100*(listA[z].quantity-listB[z].quantity)/listA[z].quantity).toFixed(0)+"% Energy saving<br><br>";
                
                out += (100*(listA[z].annualcost-listB[z].annualcost)/listA[z].annualcost).toFixed(0)+"% Cost saving<br>";
                
                out += "</td></tr>";
            }
        }
    }

    out += "<tr><td><hr><h3>Totals</h3><hr></td><td></td><td></td></tr>";

    out += "<tr>";
    out += "<td><b>Total Annual Cost:</b><br>";
    out += "£"+project.master.total_cost.toFixed(0)+"</td>";
    out += "<td><b>Total Annual Cost:</b><br>"
    out += "£"+project[scenario].total_cost.toFixed(0)+"</td>";
    out += "<td></td>";
    out += "</tr>";
    

    out += "<tr>";
    out += "<td><b>SAP Rating:</b><br>";
    out += ""+project.master.SAP.rating.toFixed(0)+"</td>";
    out += "<td><b>SAP Rating:</b><br>"
    out += ""+project[scenario].SAP.rating.toFixed(0)+"</td>";

    var sapinc = (project[scenario].SAP.rating-project.master.SAP.rating);

    if (sapinc>0) out +="<td><br><span style='color:#00aa00'>+";
    if (sapinc<0) out +="<td><br><span style='color:#aa0000'>";
    out += sapinc.toFixed(0)+"</span></td>";
    
    out += "</tr>";

    out += "</table>";
    

    $("#compare").html(out);
    
};
