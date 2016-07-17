require('whatwg-fetch'); // for fetch polyfill
var thematic = require('thematic');

// initialize the map
var map = new thematic.Thematic(document.getElementById('map'), {
	imagePath: 'build/images'
});

var dots = fetch('api/markers.json')
	.then(function(resp) { return resp.json(); })
	.then(thematic.converters.flatToGeoJSON); // convert the data from the flat dot format to geojson

// add the mapping module
map.addModule('alkos',
	new thematic.modules.Dot({
	    popupText: function(point) {
	        var props = point.properties;
	        var url = 'http://www.alko.fi' + props.url;
	        return '<a target="_blank" href="' + url + '">Alko ' + props.name + '</a><br>' + props.address + '<br>' + props.postalCode + ' ' + props.locality;
	    }
	}).setData(dots) // and set the data
);

var lmap = map.map;

lmap.locate({setView: true, maxZoom: 16});
function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.circleMarker(e.latlng, {
			stroke: false,
			fillColor: 'rgba(0, 150, 200, 1)',
			fillOpacity: 0.8
		}).addTo(lmap);

    L.circle(e.latlng, radius, {
			weight: 1,
			color: 'rgba(0, 0, 255, 0.5)'
		}).addTo(lmap);
}

lmap.on('locationfound', onLocationFound);
