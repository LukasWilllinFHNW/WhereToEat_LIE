/**
 * Created by Lukas Willin, Emil Sturzenegger, Irina Terribilini
 *
 * This file will hold functionality that is used
 * and affects the 'where'-aspect of the site
 */

console.log("Loaded where.js");

/**
 * Initialisiert neue Map.
 *
 * @returns {google.maps.Map} Ein Map Objekt
 */
function initializeMap() {
    setCurrentPosition();

    //These properties are absolutely necessary
    var mapOptions = {center: getCurrentPosition(), zoom: 15};

    // Ensure that the element with the ID = where-screen has a height
    // Otherwise, the card is not visible.
    var map = new google.maps.Map(document.getElementById('where-screen'), mapOptions);

    return map;
}

/**
 * Gets the current position and deploys it in the local storage of the browser
 */
function setCurrentPosition() {
    window.navigator.geolocation.getCurrentPosition(
        function(position){
            var pos = JSON.stringify({
                lat:position.coords.latitude,
                lng:position.coords.longitude
            });

            window.localStorage.setItem("currentPosition", pos);
        },function() {
            handleNoGeolocation(true);
        });
}

/**
 * @return JSON object for the current position stored in local storage
 */
function getCurrentPosition() {
    return JSON.parse(window.localStorage.getItem("currentPosition"));
}

/**
 * Handler um Gelocation Probleme abzuhandeln.
 *
 * @param errorFlag True für Service Problem und false für unterstützungs Problem
 */
function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) console.log("Geolocation service failed.");
    else console.log("Your browser doesn't support geolocation.");

    map.setCenter("Brugg");
}

/**
 * Setzt alle Markers auf eine neue Map.
 *
 * @param tags Array von Suchbegriffen als Strings
 * @param radius ein Integer Wert
 */

function setMarkers(tags, radius) {
    // Creates a new maps-object

    var map = initializeMap();
    var here = getCurrentPosition();

    // Deletes entries in the list of places
    deletePlacesList();

    tags.forEach(function(tag) {
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: here,
            radius: radius,
            types: ['restaurant', 'bar', 'bakery', 'cafe', 'meal_delivery', 'meal_takeaway'],
            keyword: tag
        }, function(places, status) {
            if(status === google.maps.places.PlacesServiceStatus.OK
                && status != google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
                // Sets the marker on the map
                for (var i = 0; i < places.length; i++) {
                    createMarker(places[i], map);
                }
                listPlaces(places, map);

            } else {
                // TODO: Nichts gefunden
            }
        });
    });
}

/**
 * Erstellt ein einzelnes Marker Objekt.
 *
 * @param place
 * @param map
 */
function createMarker(place, map) {

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    var myLocationMarker = new google.maps.Marker({
        map: map,
        position: getCurrentPosition(),
        title: 'Mein Standort'
    });

    var website = place.website;
    if (website == undefined)
        website = '#';

    var contentString = '<div id="content">'+
                        '<h3>'+place.name+'</h3>'+
                        '<div id="bodyContent">'+
                        '<p></p>'+
                        '<p id="infoLink"><a href="'+website+'">Gehe zur Webseite</a></p>'+
                        '</div>'+
                        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker, myLocationMarker);

    });
}

$('#bodyContent').on('click', function() {
    pageChange('Who');
})

initializeMap();







