$(document).ready(function(){
    
    // https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
	// Past 30 days significant earthquakes
    var earthquakesUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

    var clat = 0;
    var clon = 0;
    var mapZoom = 2;

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
	}
	
	loadData();

	var marker = new ol.Feature({
		type: 'geoMarker',
		geometry: new ol.geom.Point([0, 0]),
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

    function mercX(lon) {
        lon = lon * (180 / Math.PI);
        var a = (128 / Math.PI) * Math.pow(2, mapZoom);
        var b = lon + Math.PI;
        return a * b;
    }

    function mercY(lat) {
        lat = lat * (180 / Math.PI);
        var a = (128 / Math.PI) * Math.pow(2, mapZoom);
        var b = Math.tan(Math.PI / 4 + lat / 2);
        var c = Math.PI - Math.log(b);
        return a * c;
    }

    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }), vectorLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([clat, clon]),
            zoom: mapZoom
        })
    });
});
