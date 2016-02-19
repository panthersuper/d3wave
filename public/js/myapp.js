//////////////////////////////////////////////////////////////////////
//my functions
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getRange(obj, sindex, eindex) {
    //get the items within the range of that object
    var count = 0;
    var objnew = [];

    for (k in obj) {

        if (sindex <= count && eindex > count)
            objnew.push(obj[k]);

        count++;
    }

    return objnew;

}

function getItem(obj, index) {
    //get the items within the range of that object
    var count = 0;

    for (k in obj) {

        if (count == index)
            return obj[k]

        count++;
    }
    return null;
}

Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


///////////////////////////////////////////////////////////////////////////
//for map
L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImdQMzI4WjgifQ.d-Uyr7NBjrJVz9z82uk5Xg';

var map = L.mapbox.map('map', 'mapbox.light', {
        zoomControl: false,
        attributionControl: false,
        Control: true,
        maxZoom: 13,
        minZoom: 0
    })
    .setView([39.643007, -97.294347], 3);

d3.select(".leaflet-control-container").remove();


////////////////////////////////////////////////////////////////////////////
//for circle viz
var loc0 = [37.877563, -122.262726]; //berkeley
var loc1 = [42.360375, -71.095337]; //cambridge

var circlesvg = d3.select("#circlesvg");
circlesvg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "rgba(230,230,230,0.95)");

var width = $("#circlesvg").width();
var height = $("#circlesvg").height();
var r = width > height ? height / 2 - 20 : width / 2 - 20;

var circle = circlesvg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", r)
    .attr("fill", "rgba(0,0,0,0)")
    .attr("stroke-width", "5")
    .attr("stroke", "white");

var circlesm = circlesvg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", r * 0.9)
    .attr("fill", "rgba(0,0,0,0)")
    .attr("stroke-width", "2")
    .attr("stroke", "white");

var center = circlesvg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", 10)
    .attr("fill", "white");

var movingball = circlesvg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", 3)
    .attr("stroke", "none");

var myangle = null;

$.getJSON("http://ip-api.com/json/" + userip, function(data) {
    // Variable to hold request
    var request;
    if (request) {
        request.abort();
    }

    var lat = data["lat"];
    var lng = data["lon"];
    var dis1 = getDistanceFromLatLonInKm(lat, lng, loc0[0], loc0[1]);
    var dis2 = getDistanceFromLatLonInKm(lat, lng, loc1[0], loc1[1]);

    if (dis1 < 500) { //posting from cali
        console.log("HI, CALI");
        myangle = (loc1[0] - lat) / (loc1[1] - lng);

        var thisloop = function() {
            var deltax = r * Math.cos(myangle) * 0.95;
            var deltay = -r * Math.sin(myangle) * 0.95;

            movingball
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("r", 3)
                .attr("fill", "rgba(223, 134, 17, 0.7)")
                .transition()
                .attr("fill", "rgba(223, 134, 17, 0.7)")
                .attr("cx", (width / 2 + deltax))
                .attr("cy", (height / 2 + deltay))
                .attr("r", 10)
                .duration(1000)
                .each("end", thisloop); // this is 1s
        }
    } else if (dis2 < 500) { //posting from Mass
        console.log("HI, MASS");
        myangle = (loc0[0] - lat) / (loc0[1] - lng);
        myangle = Math.atan(myangle);
        myangle = myangle + Math.PI;

        var thisloop = function() {
            var deltax = r * Math.cos(myangle) * 0.95;
            var deltay = -r * Math.sin(myangle) * 0.95;

            movingball
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("r", 3)
                .attr("fill", "rgba(42, 157, 101, 0.7)")
                .transition()
                .attr("fill", "rgba(42, 157, 101, 0.7)")
                .attr("cx", (width / 2 + deltax))
                .attr("cy", (height / 2 + deltay))
                .attr("r", 10)
                .duration(1000)
                .each("end", thisloop); // this is 1s
        }
    }



    thisloop();



});



////////////////////////////////////////////
//updating historical messages
var myDataRef = new Firebase('https://popping-fire-5989.firebaseio.com/messages');
var count = 0;
myDataRef.on("child_added", function(snap) {
    count++;
    data = snap.val();
    //console.log(count, data);


    var unix_timestamp = data.timestamp;
    var date = new Date(unix_timestamp);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    var day = "0" + date.getDate();
    var month = "0" + date.getMonth();
    var year = date.getFullYear();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + " | " + (+month.substr(-2) + 1) + "/" + day.substr(-2) + "/" + year;


    var lat = data.lat;
    var lng = data.lng;
    var dis1 = getDistanceFromLatLonInKm(lat, lng, loc0[0], loc0[1]);
    var dis2 = getDistanceFromLatLonInKm(lat, lng, loc1[0], loc1[1]);
    var subclass;

    if (dis1 < 500) { //posting from cali
        if (data.mood == 2) subclass = "calgreat";
        if (data.mood == 1) subclass = "calgood";
        if (data.mood == 0) subclass = "calmid";
        if (data.mood == -1) subclass = "callow";
        if (data.mood == -2) subclass = "calsad";



        $(".messages").prepend(
            '<div class = "message messagecal ' + subclass + '"><div class = "time">' + formattedTime + '</div><div class="content"><p>' + data.txt + "|" + data.mood + '</p></div></div>');


    } else if (dis2 < 500) { //posting from Mass
        if (data.mood == 2) subclass = "masgreat";
        if (data.mood == 1) subclass = "masgood";
        if (data.mood == 0) subclass = "masmid";
        if (data.mood == -1) subclass = "maslow";
        if (data.mood == -2) subclass = "massad";

        $(".messages").prepend(
            '<div class = "message messagemas ' + subclass + '"><div class = "time">' + formattedTime + '</div><div class="content"><p>' + data.txt + "|" + data.mood + '</p></div></div>');
    }


});


/////////////////////////////////////////////
//drawing recent 7 checkins
var localH = $("#recentsvg").height();
var recentsvg = d3.select("#recentsvg");
recentsvg.append("path").attr("class","xmark")
    .attr("stroke", "rgb(200,200,200)")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("d", "M 0 " + localH / 2 + " L " + width + " " + localH / 2);


myDataRef.on("value", function(snapshot) {
    var dataset = snapshot.val();

    var datacal = [];
    var databos = [];

    for (i in dataset) {
        var data = dataset[i];


        var lat = data.lat;
        var lng = data.lng;
        var dis1 = getDistanceFromLatLonInKm(lat, lng, loc0[0], loc0[1]);
        var dis2 = getDistanceFromLatLonInKm(lat, lng, loc1[0], loc1[1]);

        if (dis1 < 500) { //posting from cali
            datacal.push(data);

        } else if (dis2 < 500) { //posting from Mass
            databos.push(data);
        }

    }


    //var rangedata = getRange(dataset, Object.size(dataset) - 7, Object.size(dataset));
    datacal = getRange(datacal, Object.size(datacal) - 7, Object.size(datacal));
    databos = getRange(databos, Object.size(databos) - 7, Object.size(databos));


    var enddate = new Date();
    var startdatecal = new Date(getItem(datacal, 0).timestamp);
    var startdatebos = new Date(getItem(databos, 0).timestamp);
    var startdate = startdatebos.getTime() < startdatecal.getTime() ? startdatecal : startdatebos;


    var x = d3.time.scale()
        .domain([startdate, enddate])
        .range([10, width - 10]);

    var timerange = enddate.getTime() - startdate.getTime();


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom").tickFormat(d3.time.format("%I%p|%a")).ticks(7);



    d3.select(".domain").remove();

    d3.selectAll(".graph").remove();
    d3.selectAll(".axis").remove();


    drawDatalst(datacal, "rgba(223, 134, 17, 0.7)");
    drawDatalst(databos, "rgba(42, 157, 101, 0.7)");


    function drawDatalst(rangedata, color) {


        var pathd = "M "
        var count = 0;

        for (i in rangedata) {
            var data = rangedata[i];

            var unix_timestamp = data.timestamp;

            recentsvg.append("circle").attr("class", "graph")
                .attr("txt", data.txt)
                .attr("time", unix_timestamp)
                .attr("cx", x(unix_timestamp))
                .attr("cy", (localH / 2 - 25 * (+data.mood)))
                .attr("r", 7)
                .attr("fill", color)
                .on("click", function() {
                        $(".timeline_important>div>p").text(d3.select(this).attr("txt"));

                        var date = new Date(+d3.select(this).attr("time"));
                        // Hours part from the timestamp
                        var hours = date.getHours();
                        // Minutes part from the timestamp
                        var minutes = "0" + date.getMinutes();
                        // Seconds part from the timestamp
                        var seconds = "0" + date.getSeconds();
                        var day = "0" + date.getDate();
                        var month = "0" + date.getMonth();
                        var year = date.getFullYear();

                        // Will display time in 10:30:23 format
                        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + " | " + (+month.substr(-2) + 1) + "/" + day.substr(-2) + "/" + year;



                        $(".timeline_important>p").text(formattedTime);

                    }

                );

            if (count != 0) pathd += "L "

            pathd += (x(unix_timestamp)).toString() + " ";
            pathd += (localH / 2 - 25 * (+data.mood)).toString();



            count++;
        }

        recentsvg.insert("path", ":first-child").attr("class", "graph")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("d", pathd);

    recentsvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + localH / 2 + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 3)
        .attr("x", 3)
        .style("text-anchor", "start")
        .style("color", "white");
    d3.select(".domain").remove();

    }

    var callast = getItem(datacal, Object.size(datacal) - 1);
    var boslast = getItem(databos, Object.size(databos) - 1);

    addmap(callast);
    addmap(boslast);

    function addmap(data) {
        var unix_timestamp = data.timestamp;
        var date = new Date(unix_timestamp);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
        var day = "0" + date.getDate();
        var month = "0" + date.getMonth();
        var year = date.getFullYear();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + " | " + (+month.substr(-2) + 1) + "/" + day.substr(-2) + "/" + year;


        var content = '<h2>Post Info<\/h2>' +
            '<p><strong>Time:</strong> ' + formattedTime + '<\/p>' +
            '<p><strong>Content:</strong> ' + data.txt + '<\/p>';

        var myIcon = L.divIcon({
            className: '',
            html: '<div class="marker"><img src="img/marker.png"/></div>',
            iconSize: [50, 50]
        });


        L.marker([data.lat, data.lng], {
            icon: myIcon
        }).bindPopup(content).addTo(map);

        L.marker([data.lat, data.lng], {
            icon: myIcon
        }).bindPopup(content).addTo(map);

        /*    L.marker([callast.lat, callast.lng], {
                icon: myIcon
            }).addTo(map);

            L.marker([boslast.lat, boslast.lng], {
                icon: myIcon
            }).addTo(map);*/

    }



}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});