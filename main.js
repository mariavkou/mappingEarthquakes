$(document).ready(function(){
    
    // https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
	// Past 30 days significant earthquakes
    var earthquakesUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

    var clat = 0;
    var clon = 0;
    var mapZoom = 2;

    //(lon, lat) EPSG:4326 WGS 84 --> (x, y) EPSG:3857 WGS 84/Pseudo-Mercator
    function merc(lon, lat) {
 		if (Math.abs(lon) <= 180 && Math.abs(lat) < 90) {    
      		num = lon * 0.017453292519943295
         	x = 6378137.0 * num 
        	a = lat * 0.017453292519943295
       		y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
			return [x, y];
		} else {
			console.log('Error in the tranformation of the coordinates');
		}
	}

    function loadJSON(file, callback) {   
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
	}

	function loadData() {
		loadJSON(earthquakesUrl, gotData, 'jsonp');
	}

	function gotData(data) {
		data = JSON.parse(data);
		console.log(data);
        console.log(data['features']);
        var features = data['features'];
        for (feature in features) {
            console.log(features[feature]);
            //console.log(features[feature]['geometry']);
        }
        testPoint = features[0]['geometry']['coordinates'];
        console.log(testPoint);
	}
	
	loadData();
    console.log(merc(121.4737, 31.2304));

	var marker = new ol.Feature({
		type: 'geoMarker',
		geometry: new ol.geom.Point([13522390.43, 3662707.26]),// Shanghai (lon, lat): 121.4737, 31.2304 https://epsg.io/transform
		name: 'Null Island',
		population: 4000,
		rainfall: 500
	});
	var styles = {
		'geoMarker': new ol.style.Style({
			image: new ol.style.Circle({
				radius: 7,
				snapToPixel: false,
				fill: new ol.style.Fill({color: 'black'}),
				stroke:new ol.style.Stroke({
					color: 'white', width: 2
				})
			})
		})
	};
	var vectorSource = new ol.source.Vector({
		features: [marker]
	});
	var vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }), vectorLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([clon, clat]),
            zoom: mapZoom
        })
    });
});
