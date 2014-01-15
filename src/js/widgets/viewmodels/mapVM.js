/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 *  Project header view model widget
 */
/* global locationPath: false */
(function() {
	'use strict';
	define(['jquery-private',
			'knockout',
			'jqueryui',
			'gcaut-i18n',
			'gcviz-gismap'
	], function($aut, ko, jqUI, i18n, gisM) {
		var initialize,
			clean,
			vm;
		
		initialize = function(elem, map) {
			
			// data model				
			var mapViewModel = function(elem, map) {
				var _self = this,
					pathNew = locationPath + 'gcaut/images/projNew.png',
					size = map.size,
					sr = [3944, 3978, 4326],
					layerType = ['WMS', 'WMTS', 'esriREST', 'dynamic'],
					map = map.map,
					$layer = $aut('#map_addlayer'),
					isCall = false;

				// images path
				_self.imgNew = pathNew;
				
				// tooltip
				_self.tpNew = i18n.getDict('%projheader-tpnewmap');
				
				// class
				_self.hidden = ko.observable('.gcaut-hidden');
				
				// label
				_self.lblMapSize = i18n.getDict('%size');
				_self.lblMapHeight = i18n.getDict('%height') + ': ';
				_self.lblMapWidth = i18n.getDict('%width') + ': ';
				_self.lblAddLayer = i18n.getDict('%map-addlayer');
				_self.lblMapSR = i18n.getDict('%map-spatialref');
				_self.lblSelectItem = i18n.getDict('%selectItem');
				_self.lblLayerType = i18n.getDict('%map-layertype');
				_self.lblLayerURL = i18n.getDict('%map-layerurl');
				
				// input
				_self.mapHeightValue = ko.observable(size.height);
				_self.mapWidthValue = ko.observable(size.width);
				_self.layers = ko.observableArray(map.layers);
				_self.mapSR = sr;
				_self.layerURL = ko.observable();
				_self.layerType = layerType;
				_self.selectMapSR = ko.observable(map.sr);
				_self.selectLayerType = ko.observable();
				_self.isValid = ko.observable(true);
				
				// clean the view model
				clean(ko);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};
				
				_self.bind = function() {
					clean(ko);
					$aut('#layers').empty(); // remove layers from DOM
					ko.applyBindings(_self, elem);
				};
				
				_self.selectLayer = function() {
					// set add layer window
					$layer.dialog({
						autoOpen: false,
						modal: true,
						resizable: false,
						draggable: false,
						show: 'fade',
						hide: 'fade',
						closeOnEscape: true,
						title: _self.lblAddLayer,
						width: 600,
						close: function() { },
							buttons: [{
								id: 'btnLayerOK',
								text: 'Ok',
								click: function() {
									var $message = $aut('#layerMessage');
									
									_self.layers.push({ id: _self.selectLayerType() + ' ' + _self.layerURL() });
									_self.layerURL('');
									$message.text('');
									$message.removeClass('gcaut-message-error');
									$message.removeClass('gcaut-message');
									_self.isValid(true);
									_self.hidden('.gcaut-hidden');
									$aut(this).dialog('destroy');
								}
							}, {
								id: 'btnLayerCancel',
								text: 'Cancel',
								click: function() {
									var $message = $aut('#layerMessage');
									
									_self.layerURL('');
									$message.text('');
									$message.removeClass('gcaut-message-error');
									$message.removeClass('gcaut-message');
									_self.isValid(true);
									_self.hidden('.gcaut-hidden');
									$aut(this).dialog('destroy');
								}
							}] 
						});
				
					$layer.dialog('open');
					_self.hidden('');
					$aut('#btnLayerOK').attr('disabled', true);
				};
				
				_self.validateLayer = function() {
					// this function is fired twice (because of input text). Check if it is the first time
					//http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBCT3978/MapServer
					
					if (!isCall) {
						var a = gisM.validateLayer('layerMessage', _self.selectLayerType(), _self.layerURL(), _self.isValid);
						isCall = true;
					} else {
						isCall = false;
					}
				};

				_self.write = function() {
					var value = '"mapframe": {' +
									'"size": {' +
										'"height": ' + 400 + ',' +
										'"width": ' + 800 +
									'},' +
									'"extent": {' +
										'"xmin": ' + 0.0 + ',' +
										'"ymin": ' + 0.0 + ',' +
										'"xmax": ' + 0.0 + ',' +
										'"ymax": ' + 0.0 +
									'},' +
									'"map": {' +
										'"sr": {' +
											'"wkid": ' + 3978 +
										'},' +
										'"extent": {' +
											'"xmin": ' + 0.0 + ',' +
											'"ymin": ' + 0.0 + ',' +
											'"xmax": ' + 0.0 + ',' +
											'"ymax": ' + 0.0 +
										'},' +
										'"lods": [],' +
										'"resolution": {' +
											'"min": ' + 0 + ',' +
											'"max": ' + 0 +
										'},' +
										'"link": ' + false + ',' +
										'"layers": [{' +
											'"id": "first",' +
											'"type": "tiled",' +
											'"url": "http.first"' +
										'}]'+
									'}' +
								'}';
					
					return value;
				};
 
				_self.removeLayer = function() {
					_self.layers.remove(this);
				};
    
				_self.init();
			};

			vm = new mapViewModel(elem, map);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};
		
		clean = function(ko) {
			// clean (each tab) and remove node in foreach array binding
			ko.cleanNode(document.getElementById('generalMap'));
			//document.getElementById('layers').innerHTML = '';
		};
		
		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
