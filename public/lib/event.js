function initMap() {
    var mapDiv = document.getElementById('map'),
        geocoder = new google.maps.Geocoder(),
        address = document.getElementById("address").innerHTML;

    var map = new google.maps.Map(mapDiv, {
        center: { lat: 50.798985, lng: -1.098352 },
        zoom: 15
    });

    //console.log(address);
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function showHideMap() {
    var mapDiv = document.getElementById('map'),
        button = document.getElementById('showHideButton');

    if (mapDiv.style.display = 'none') {
        mapDiv.style.display = 'block';
        button.style.display = 'none';
        initMap();
    } else {
        mapDiv.style.display = 'none';
        button.innerHTML = "Show Map"
    }
}

function postResult () {
    var userID = document.getElementById("userSelection").value,
        resultTime = document.getElementById("time").value,
        eventID = window.location.pathname.split("/"),
        result = {
            type: "post result",
            userID: userID,
            resultTime: resultTime,
            eventID: eventID[2]
        },
        xhr = new XMLHttpRequest();

    xhr.open("POST", JSON.stringify(result), true);
    xhr.send();
}