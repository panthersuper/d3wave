$(function() {

	$("#menu").click(function() {
		$(".submenu").toggleClass("toggleShow");
	});
	$(".submenu").click(function() {
		$(".submenu").toggleClass("toggleShow");
	});
	$("#smap").click(function() {
		$("#circlesvg").fadeOut(300);
		$("#arrow").fadeOut(300);

		$(".txt").fadeOut(300);
	});
	$("#scircle").click(function() {
		$("#circlesvg").fadeIn(300);
		$("#arrow").fadeIn(300);
		$(".txt").fadeOut(300);
	});

	$("#stxt").click(function() {
		$(".txt").fadeIn(300);
	});

	$("#submit").click(function() {
				console.log("sub");

				var message = $("#input").val();
				if (message.length > 0) {
					$("#input").val("");
					var thistime = new Date().getTime();
					var thismood = $("#mood").text();
					if (thismood == "Great") thismood = 2;
					else if (thismood == "Good") thismood = 1;
					else if (thismood == "Mid") thismood = 0;
					else if (thismood == "Low") thismood = -1;
					else if (thismood == "Worst") thismood = -2;




					$.getJSON("http://ip-api.com/json/" + userip, function(data) {
							// Variable to hold request
							var request;
							if (request) {
								request.abort();
							}

							var time = new Date()
							var region = data["regionName"];
							var city = data["city"];
							var lat = data["lat"];
							var lng = data["lon"];

						var myDataRef = new Firebase('https://popping-fire-5989.firebaseio.com/messages'); myDataRef.push({
							timestamp: thistime,
							txt: message,
							mood: thismood,
							ip: userip,
							location: city+","+region,
							lat:lat,
							lng:lng
						});

					});

					}

				});

	$("#mood").click(function() {
		console.log("33333");
		$("#expandmood").toggleClass("toggleShow");

	});

	$("#expandmood p").click(function() {

		$("#mood").text($(this).text());
		$("#expandmood").toggleClass("toggleShow");

	});

});