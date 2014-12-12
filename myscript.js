 
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
                for (i = 0; i < points.length; i++) {
                    trackCoordinates.push(new google.maps.LatLng(points[i].getAttribute("lat"), points[i].getAttribute("lon")));
                }
                
                var mapOptions = {
                    zoom: 11,
                    center: new google.maps.LatLng(points[0].getAttribute("lat"), points[0].getAttribute("lon")),
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    streetViewControl: false
                };

                var map = new google.maps.Map(document.getElementById('myMap'), mapOptions);

                var route = new google.maps.Polyline({
                    path: trackCoordinates,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                route.setMap(map);
                
                var startM = new google.maps.Marker({
                    position: trackCoordinates[0],
                    title: "Start",
                    map: map
                });
                
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
