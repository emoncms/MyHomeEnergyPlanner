function draw_openbem_graphics()
{
    var floorwk = data.fabric.total_floor_WK;
    var ventilationwk = data.ventilation.average_WK;
    var windowswk = data.fabric.total_window_WK;
    var wallswk = data.fabric.total_wall_WK;
    var roofwk = data.fabric.total_roof_WK;
    var thermalbridgewk = data.fabric.thermal_bridging_heat_loss;
    
    var totalwk = floorwk + ventilationwk + windowswk + wallswk + roofwk + thermalbridgewk;
    
    var uscale = 30;

    var s1 = Math.sqrt(floorwk / uscale);
    var s2 = Math.sqrt(ventilationwk / uscale);
    var s3 = Math.sqrt(windowswk / uscale);
    var s4 = Math.sqrt(wallswk / uscale);
    var s5 = Math.sqrt(roofwk / uscale);
    var s6 = Math.sqrt(thermalbridgewk / uscale);
    
    $("#house-floor").attr("transform","translate(460,620) rotate(90) scale("+s1+")");
    $("#house-ventilation").attr("transform","translate(260,535) rotate(180) scale("+s2+")");
    $("#house-windows").attr("transform","translate(260,345) rotate(180) scale("+s3+")");
    $("#house-walls").attr("transform","translate(730,535) rotate(0) scale("+s4+")");
    $("#house-roof").attr("transform","translate(630,175) rotate(-55) scale("+s5+")");
    $("#house-thermalbridge").attr("transform","translate(730,345) rotate(0) scale("+s6+")");
    
    $("#house-floorwk").html(Math.round(floorwk)+" W/K");
    $("#house-ventilationwk").html(Math.round(ventilationwk)+" W/K");
    $("#house-windowswk").html(Math.round(windowswk)+" W/K");
    $("#house-wallswk").html(Math.round(wallswk)+" W/K");
    $("#house-roofwk").html(Math.round(roofwk)+" W/K");
    $("#house-thermalbridgewk").html(Math.round(thermalbridgewk)+" W/K");
    $("#house-totalwk").html(Math.round(totalwk)+" W/K");
    
    var targetbarwidth = $("#targetbars").width();
    
    $("#spaceheating").css("width",targetbarwidth);
    $("#primaryenergy").css("width",targetbarwidth);
    $("#co2").css("width",targetbarwidth);
    $("#perperson").css("width",targetbarwidth);

    var targetbarheight =60;// 0.13 * targetbarwidth;
    if (targetbarheight<60) targetbarheight = 60;
    $("#spaceheating").css("height",targetbarheight);
    $("#primaryenergy").css("height",targetbarheight);
    $("#co2").css("height",targetbarheight);
    $("#perperson").css("height",targetbarheight); 
   
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Space heating demand",
        value: Math.round(data.fabric_energy_efficiency),
        units: "kWh/m2",
        targets: {
            //"Passivhaus": 15,
            "Passivhaus retrofit": 25,
            "UK Average": 145
        }
    };
    targetbar("spaceheating", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Primary energy demand",
        value: Math.round(data.primary_energy_use_m2),
        units: "kWh/m2",
        targets: {
            "Passivhaus": 120,
            "UK Average": 350
        }
    };
    targetbar("primaryenergy", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "CO2 Emission rate",
        value: Math.round(data.kgco2perm2),
        units: "kgCO2/m2",
        targets: {
            "80% by 2050": 17,
            "UK Average": 85
        }
    };
    targetbar("co2", options);
    // ---------------------------------------------------------------------------------
    var options = {
        name: "Per person energy use",
        value: data.kwhdpp.toFixed(1),
        units: "kWh/day",
        targets: {
            "70% heating saving": 8.6,
            "UK Average": 19.6
        }
    };
    targetbar("perperson", options);
}

  function draw_rating(ctx)
  {
    
    var sap_rating = data.SAP.rating.toFixed(0);
    var kwhm2 = "?";
    var letter = "";
    var color = 0;
    var kwhd = 0;
    var kwhdpp = 0;
    
    var band = 0;
    for (z in datasets.ratings)
    {
        if (sap_rating>=datasets.ratings[z].start && sap_rating<=datasets.ratings[z].end) 
        {
            band = z; 
            break;
        }
    }
    
    color = datasets.ratings[band].color;
    letter = datasets.ratings[band].letter;
    
    ctx.clearRect(0,0,269,350);
    
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.fillRect(0,0,269,350);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(0,0,269,350);
    ctx.strokeRect(0,0,269,350);
        
    var mid = 269 / 2;
    
    ctx.beginPath();
    ctx.arc(mid, mid, 100, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.font = "bold 22px arial";
    ctx.fillText("SAP",mid,90);  
    ctx.font = "bold 92px arial";
    ctx.fillText(sap_rating,mid,mid+30);
    ctx.font = "bold 22px arial";
    ctx.fillText(letter+" RATING",mid,mid+60);    
    ctx.font = "bold 32px arial";
    ctx.fillText(kwhm2,mid,280);    
    ctx.font = "bold 18px arial";
    ctx.fillText("DAILY: "+kwhd,mid,308);
    ctx.font = "bold 18px arial";
    ctx.fillText("PER PERSON: "+kwhdpp,mid,336);
  }
