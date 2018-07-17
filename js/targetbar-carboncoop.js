function targetbarCarboncoop(element, options)
{
    var width = $("#" + element).width();
    var height = $("#" + element).height();

    // $("#"+element).html("<div style='padding-bottom:5px; font-size:16px; color:rgba(99,86,71,0.8);'>"+options.name+": <b style='float:right'>"+options.value+" "+options.units+"</b></div>");
    $("#" + element).html("<div style='padding-bottom:5px; font-size:18px; color:rgba(99,86,71,0.8);'>" + options.name + "</div>");
    var titleheight = $("#" + element + " div").height();
    var barheight = height - titleheight - 5;
    var barheight = 25 * options.values.length;
    $("#" + element).append('<canvas id="' + element + '-canvas" width="' + width + '" height="' + barheight + '" style="max-width:100%"></canvas>');

    var c = document.getElementById(element + "-canvas");
    var ctx = c.getContext("2d");


    var maxval = options.value;
    for (z in options.targets) {
        if (options.targets[z] > maxval)
            maxval = options.targets[z];
    }
    maxval *= 1.2; // Always 20% larger than max target or value

    var xscale = width / maxval;
    var colors = options.colors;

    ctx.fillStyle = "white";
    ctx.fillRect(1, 1, width - 2, barheight - 2);


    if (typeof options["values"] != "undefined") {
        var subBarHeightFraction = 1 / options["values"].length;
        for (var i = 0; i < options["values"].length; i++) {
            ctx.fillStyle = colors[i];
            var y = 1 + subBarHeightFraction * barheight * i;
            ctx.fillRect(1, y, (options.values[i] * xscale) - 2, subBarHeightFraction * barheight);
            ctx.font = "13px Arial";
            ctx.fillStyle = "rgba(99,86,71,1.0)";
            ctx.fillText(options.values[i] + " " + options.units, 4, y + 16);
        }
    } else {
        ctx.fillStyle = "rgb(217, 58, 71)";
        ctx.fillRect(1, 1, (options.value * xscale) - 2, barheight - 2);
    }
    ctx.font = "14px Arial";
    ctx.setLineDash([4, 4]);

    var i = 60;
    var index = 0;
    for (z in options.targets) {
        //  if (index == 2)
        //    i = 30;
        xpos = options.targets[z] * xscale;

        ctx.strokeStyle = "rgba(99,86,71,0.8)";
        ctx.beginPath();
        ctx.moveTo(xpos, 1);
        ctx.lineTo(xpos, barheight - 1);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(99,86,71,1.0)";
        ctx.fillText(z + ':', xpos + 5, barheight - 70);
        ctx.fillText(options.targets[z] + " " + options.units, xpos + 15, barheight - 54);
        i = i - 60;
        index++;
    }

    // draw target range
    if (typeof options.targetRange != "undefined") {
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(options.targetRange[0] * xscale, 1, xscale * (options.targetRange[1] - options.targetRange[0]), barheight);
    }

    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(99,86,71,0.8)";
    ctx.strokeRect(1, 1, width - 2, barheight - 2);
    ctx.font = "5px Ubuntu";

}