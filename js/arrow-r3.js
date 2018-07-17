function draw_arrow(ctx,x,y,angle,size,proportion)
{
    var tail = {x:x, y:y};
    var l = Math.sqrt(size / proportion);
    var w = proportion * l;
  
    head = {x:tail.x+Math.cos(angle)*l, y:tail.y+Math.sin(angle)*l};
    
    var tailwidth = w / 2;
    var headwidth = w / 1.2;
    var headlength = 0.6;

    var tailheadvector = subtract(tail, head)
    var tailheadunitvector = unitvector(tailheadvector);

    var arrowback = scale(tailheadvector,headlength);

    ctx.beginPath();

    // tail side A
    ctx.moveTo(tail.x+tailheadunitvector.y*tailwidth,tail.y-tailheadunitvector.x*tailwidth);

    // tail side B
    ctx.lineTo(tail.x-tailheadunitvector.y*tailwidth,tail.y+tailheadunitvector.x*tailwidth);

    // head side B
    ctx.lineTo(tail.x+arrowback.x-tailheadunitvector.y*tailwidth,tail.y+arrowback.y+tailheadunitvector.x*tailwidth);
    ctx.lineTo(tail.x+arrowback.x-tailheadunitvector.y*headwidth,tail.y+arrowback.y+tailheadunitvector.x*headwidth);

    // Arrow head
    ctx.lineTo(head.x,head.y);

    // head side A
    ctx.lineTo(tail.x+arrowback.x+tailheadunitvector.y*headwidth,tail.y+arrowback.y-tailheadunitvector.x*headwidth);
    ctx.lineTo(tail.x+arrowback.x+tailheadunitvector.y*tailwidth,tail.y+arrowback.y-tailheadunitvector.x*tailwidth);

    ctx.closePath();
    ctx.fill();
    //ctx.stroke();
}
