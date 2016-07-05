function initMap() {
    var mapDiv = document.getElementById('map'),
        geocoder = new google.maps.Geocoder(),
        addresses = document.getElementById("clubAddresses").innerHTML;

    var map = new google.maps.Map(mapDiv, {
        center: { lat: 53.479796, lng: -1.546300 },
        zoom: 6
    });

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

function getClubAddresses() {
    
}
