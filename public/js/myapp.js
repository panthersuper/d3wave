window.welcome_view = function() {
    console.log("......");

    var lineNum = 100;
    var resolution = 100;

    var width = window.innerWidth;
    var height = window.innerHeight;

    var margin = 100;

    var xscale = d3.scale.linear()
        .domain([0, lineNum])
        .range([margin, width - margin]);

    var yscale = d3.scale.linear()
        .domain([0, resolution])
        .range([margin, height - margin]);

    var mysvg = d3.select("#mycanvas").style("width", width).style("height", height);

    var linegroup = mysvg.append("g").attr("class", "lines");

    for (var i = 0; i < lineNum; i++) {
        line(linegroup, width, height, xscale, yscale, margin, resolution, i);
    }


    mysvg.on("mousemove", function() {
        var pos = d3.mouse(this);
        d3.selectAll("circle")
            .filter(function() {
                var x = +d3.select(this).attr("cx");
                var y = +d3.select(this).attr("cy")
                return disSQ(x, y, pos[0], pos[1]) < 10000;
            })
            .attr("cx", function(){
                var x = +d3.select(this).attr("cx");
                var y = +d3.select(this).attr("cy")

                var dissq = disSQ(x, y, pos[0], pos[1]);

                var deltX = x-pos[0];
                var deltY = y-pos[1];


                var ratio = deltX/(Math.sqrt(dissq))*6000/(1+dissq);
                return x+ratio;
            })

            .attr("cy", function(){
                var x = +d3.select(this).attr("cx");
                var y = +d3.select(this).attr("cy")
                var dissq = disSQ(x, y, pos[0], pos[1]);

                var deltX = x-pos[0];
                var deltY = y-pos[1];


                var ratio = deltY/(Math.sqrt(dissq))*6000/(1+dissq);
                return y+ratio;
            });

        d3.selectAll("circle")
            .filter(function() {
                var id = +d3.select(this).attr("circleid");
                var x = +d3.select(this).attr("cx");
                var y = +d3.select(this).attr("cy");

                return disSQ(x, y, pos[0], pos[1]) >= 10000 
                        && (d3.select(this).attr("cx")!=d3.select(this).attr("ox")
                        || d3.select(this).attr("cy")!=d3.select(this).attr("oy"));

            })

            .attr("cx", function() {
                return d3.select(this).attr("ox")
            })
            .attr("cy", function() {
                return d3.select(this).attr("oy");
            });

    });

};


window.disSQ = function(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

window.array_2_d = function(ptlst) {
    var out = "";
    for (id in ptlst) {
        if (id > 0)
            out += "L " + ptlst[id][0] + " " + ptlst[id][1] + " ";
        else
            out += "M " + ptlst[id][0] + " " + ptlst[id][1] + " ";
    }

    return out;
}

window.line = function(group, width, height, xscale, yscale, margin, resolution, id) {

    var myptlst = [];
    for (var i = 0; i < resolution; i++) {
        myptlst.push([xscale(id), yscale(i)]);
    }
    /*    var myptlst = [
            [xscale(id), margin],
            [xscale(id), height-margin]
        ];*/


/*    group.append("path")
        .attr("d", array_2_d(myptlst))
        .attr("stroke-width", "1px")
        .attr("stroke", "white")
        .attr("lineid",id);

*/    myptlst.forEach(function(d, i) {
        group.append("circle")
            .attr("cx", d[0]).attr("ox", d[0])
            .attr("cy", d[1]).attr("oy", d[1])
            .attr("r", 1)
            .attr("fill", "white")
            .attr("circleid", i)
            .attr("columnid",id);

    });

}