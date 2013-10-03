/*
 *
 * GeoCanViz viewer / Visionneuse GéoCanViz
 * gcviz.github.io/gcviz/License-eng.txt / gcviz.github.io/gcviz/Licence-fra.txt
 *
 * Map view model widget
 */
(function() {
	'use strict';
	define([
		'jquery',
		'dojo/dom',
		'dojo/dom-style',

		'knockout',
		'gcviz-gismap',
		'gcviz-gisgeo'
	], function($, dom, domStyle, ko, gisM, gisGeo) {
		var initialize;

		initialize = function($mapElem) {
			var map = [];

			// data model				
			var mapViewModel = function($mapElem) {
				var _self = this,
					config = $mapElem.mapframe,
					myMap;
				
				_self.errorHandler = function(error) {
					console.log('error map view model: ', error);
				};
		
				_self.init = function() {
					var len = config.map.length,
						mapid = $mapElem.mapframe.id;
					
					while (len--) {
						var configMap = config.map[len],
							lenLayers = configMap.layers.length,
							layers = configMap.layers,
							$map = $('#' + mapid + '_' + len);
						
						// create map	
						myMap = gisM.createMap(mapid + '_' + len, configMap);
						
						// add layers
						layers = layers.reverse()
						while (lenLayers--) {
							var layer = layers[lenLayers];
							gisM.addLayer(myMap, layer.type, layer.url);
						}
						
						// set events (mouseover mouseout focusin focusout)
						$map.on('mouseenter mouseleave focusin focusout', function(e){
							var type = e.type,
								$this = $(this);
							if (type === 'mouseenter' || type === 'focusin') {
								this.focus();
							} else if (type === 'mouseleave' || type === 'focusout') {
								this.blur();
							}
						});
						
						// set class and remove cursor for container
						$map.addClass('gcviz-map');
						$('#' + mapid + '_' + len + '_container').css('cursor', '');
						
						// enable scroll wheel
						myMap.enableScrollWheelZoom();
						
						map.push(myMap);
					}

					return { controlsDescendantBindings: true };
				};

				_self.init();
			};
			ko.applyBindings(new mapViewModel($mapElem), $mapElem[0]); // This makes Knockout get to work
			
			return map;
		};
		
		return {
			initialize: initialize
		};
	});
}).call(this);
