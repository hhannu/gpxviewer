 
window.onload = function(event) {
    document.getElementById('gpxFile').addEventListener('change', handleFile, false);    
};

function handleFile(files) {
    var file = files.target.files[0];
    var reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onloadend = function(f) {
        if(f.target.readyState == FileReader.DONE) { 
            
            var trackCoordinates = [];
            if(window.DOMParser) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(reader.result, "text/xml");
                var points = xmlDoc.getElementsByTagName("trkpt");
                var bounds = new google.maps.LatLngBounds();
                
                // get all trackpoints from gpx file
                for (i = 0; i < points.length; i++) {
                    var trackPoint = new google.maps.LatLng(points[i].getAttribute("lat"), points[i].getAttribute("lon"));
                    trackCoordinates.push(trackPoint);
                    bounds.extend(trackPoint);
                }
                                
                // options for map
                var mapOptions = {
                    zoom: 0,
                    center: bounds.getCenter(),
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    streetViewControl: false,
                    noClear: false
                };

                // the map
                var map = new google.maps.Map(document.getElementById('myMap'), mapOptions);

                // line to be drawn on map
                var route = new google.maps.Polyline({
                    path: trackCoordinates,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                // draw route, center map and adjust zoom
                route.setMap(map);
                map.fitBounds(bounds);
                
                // marker for start position
                var startM = new google.maps.Marker({
                    position: trackCoordinates[0],
                    title: "Start",
                    map: map
                });
                
                // marker for end position
                var stopM = new google.maps.Marker({
                    position: trackCoordinates[trackCoordinates.length - 1],
                    title: "Start",
                    map: map
                });
                
                document.getElementById("info").innerHTML =  "";
            }            
        }
    };
    
    reader.readAsText(file);
}

function errorHandler(file) {
    document.getElementById("info").innerHTML =  "Error while reading file: " + file.target.error.code;
}
