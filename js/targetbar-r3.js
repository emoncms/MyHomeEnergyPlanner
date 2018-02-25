function targetbar(element, options)
{
    var width = $("#"+element).width();
    var height = $("#"+element).height();
    
    $("#"+element).html("<div style='padding-bottom:5px; font-size:16px; color:rgba(99,86,71,0.8);'>"+options.name+": <b style='float:right'>"+options.value+" "+options.units+"</b></div>");
    var titleheight = $("#"+element+" div").height();
    var barheight = height - titleheight - 5;    
    $("#"+element).append('<canvas id="'+element+'-canvas" width="'+width+'" height="'+barheight+'"></canvas>');

    var c = document.getElementById(element+"-canvas");  
    var ctx = c.getContext("2d");
    
    ctx.fillStyle = "rgba(99,86,71,0.2)";
    ctx.strokeStyle = "rgba(99,86,71,0.8)";
    ctx.fillRect(1,1,width-2,barheight-2);
    ctx.strokeRect(1,1,width-2,barheight-2);
    
    var maxval = options.value;
    for (z in options.targets) {
        if (options.targets[z]>maxval) maxval = options.targets[z];
    }
    maxval *= 1.2; // Always 20% larger than max target or value
    
    var xscale = width / maxval;
    /*
    ctx.font="12px Ubuntu";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(99,86,71,0.8)";
    ctx.fillText(options.name,1,10);

    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(99,86,71,0.8)";
    ctx.fillText(options.value+" "+options.units,width,10);        
    */
    ctx.font="10px Ubuntu";
    ctx.setLineDash([4, 4]);
    
    for (z in options.targets) {
        xpos = options.targets[z] * xscale;
        
        ctx.strokeStyle = "rgba(99,86,71,0.8)";
        ctx.beginPath();
        ctx.moveTo(xpos,1);
        ctx.lineTo(xpos,barheight-1);
        ctx.stroke();
        
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(99,86,71,0.8)";
        ctx.fillText(options.targets[z]+" "+options.units,xpos+5,barheight-18);
        ctx.fillStyle = "rgba(99,86,71,1.0)";
        ctx.fillText(z,xpos+5,barheight-8);
    }
    
    ctx.fillStyle = "rgba(99,86,71,0.2)";
    ctx.fillRect(1,1,(options.value*xscale)-2,barheight-2);
}
