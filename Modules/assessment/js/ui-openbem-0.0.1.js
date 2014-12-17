function draw_openbem_graphics()
{
    var width = $("#bound").width();
    $("#house").attr("width",width);

    var canvas = document.getElementById("house");
    var ctx = canvas.getContext("2d");

    mid = width/2;
    bottom = 320;

    ctx.fillStyle = "rgba(99,86,71,0.8)";
    ctx.fillRect(mid+100,bottom-135,10,110);  // Right side
    ctx.fillRect(mid-110,bottom-95,10,30);    // House mid left

    // House bottom
    x = mid;
    y = bottom;
    ctx.beginPath();
        ctx.moveTo(x-0,y-0);
        x += 100; ctx.lineTo(x,y);
        y -= 25; ctx.lineTo(x,y);
        x += 10; ctx.lineTo(x,y);
        y += 35; ctx.lineTo(x,y);
        x -= 220; ctx.lineTo(x,y);
        y -= 35; ctx.lineTo(x,y);
        x += 10; ctx.lineTo(x,y);
        y += 25; ctx.lineTo(x,y);
    ctx.closePath();
    ctx.fill();

    // House roof
    x = mid - 110;
    y = bottom - 125;
    ctx.beginPath();

        x += 10; y -= 20;
        ctx.moveTo(x,y);

        y += 10; ctx.lineTo(x,y);
        x -= 10; ctx.lineTo(x,y);

        y -= 10; ctx.lineTo(x,y);
        x -= 10; ctx.lineTo(x,y);
        y -= 5; ctx.lineTo(x,y);

        x += (100+20);
        y -= Math.tan(2*Math.PI*((35)/360))*120;
        ctx.lineTo(x,y);

        x += (100+20);
        y += Math.tan(2*Math.PI*((35)/360))*120;
        ctx.lineTo(x,y);

        y += 5; ctx.lineTo(x,y);
        x -= 10; ctx.lineTo(x,y);
        y += 10; ctx.lineTo(x,y);

        x -= 10; ctx.lineTo(x,y);
        y -= 10; ctx.lineTo(x,y);

        x -= (100);
        y -= Math.tan(2*Math.PI*((35)/360))*100;
        ctx.lineTo(x,y);
      
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(99,86,71,0.3)";
    ctx.fillRect(mid - 109,bottom - 65,8,40);     // Window bottom
    ctx.fillRect(mid - 109,bottom - 135,8,40);    // Window top

    // Arrows
    ctx.fillStyle = "rgba(99,86,71,0.8)";
    draw_arrow(ctx,mid-140,bottom-110,2*Math.PI*(180/360),data.fabric.total_window_WK*100,0.625);
    draw_arrow(ctx,mid-140,bottom-20,2*Math.PI*(180/360),data.ventilation.average_WK*100,0.625);
    draw_arrow(ctx,mid+140,bottom-80,2*Math.PI*(0/360),data.fabric.total_wall_WK*100,0.625);
    draw_arrow(ctx,mid+70,bottom-210,2*Math.PI*(-55/360),data.fabric.total_roof_WK*100,0.625);
    draw_arrow(ctx,mid,bottom+30,2*Math.PI*(90/360),data.fabric.total_floor_WK*100,0.625);

    $("#house-floor").css({"position":"absolute","top": (bottom+8) + "px","left": (mid+35) + "px"});
    $("#house-ventilation").css({"position":"absolute","top": bottom + "px","left": (mid - 220) + "px"});
    $("#house-windows").css({"position":"absolute","top": (bottom-200) + "px","left": (mid - 220) + "px"});
    $("#house-walls").css({"position":"absolute","top": (bottom-200) + "px","left": (mid + 140) + "px"});
    $("#house-roof").css({"position":"absolute","top": (bottom-280) + "px","left": (mid + 110) + "px"});

    // Energy
    var colors = ["#009a44","#2dca73","#b8f351","#f5ec00","#ffac4d","#fd8130","#fd001a"];

    x=0; y=80; maxbarwidth=0.25*width; step=0.025*width; align='left'; spacing=8; barheight=30;

    for (var i=0; i<7; i++) {
        ctx.fillStyle = colors[i];
        var barwidth = maxbarwidth-(7-i)*step;
        if (align=='left') ctx.fillRect(x,y,barwidth,barheight);
        if (align=='right') ctx.fillRect(x-barwidth,y,barwidth,barheight);
        y += barheight + spacing;
    }

    // Carbon
    var colors = ["#6cdafb","#20b8ea","#039cd8","#0079c2","#bbbcbe","#a1a0a5","#818085"];

    x=width; y=80; align='right';

    for (var i=0; i<7; i++) {
        ctx.fillStyle = colors[i];
        var barwidth = maxbarwidth-(7-i)*step;
        if (align=='left') ctx.fillRect(x,y,barwidth,barheight);
        if (align=='right') ctx.fillRect(x-barwidth,y,barwidth,barheight);
        y += barheight + spacing;
    }

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
