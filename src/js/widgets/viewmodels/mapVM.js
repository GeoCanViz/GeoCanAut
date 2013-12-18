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
			'gcaut-i18n'
	], function($aut, ko, i18n) {
		var initialize,
			clean,
			vm;
		
		initialize = function(elem, map) {
			
			// data model				
			var projheaderViewModel = function(elem, map) {
				var _self = this,
					pathNew = locationPath + 'gcaut/images/projNew.png',
					size = map.size;

				// images path
				_self.imgNew = pathNew;
				
				// tooltip
				_self.tpNew = i18n.getDict('%projheader-tpnewmap');
				
				// label
				_self.lblMapSize = i18n.getDict('%size');
				_self.lblMapHeight = i18n.getDict('%height') + ': ';
				_self.lblMapWidth = i18n.getDict('%width') + ': ';
				_self.lblAddLayer = i18n.getDict('%map-addlayer');
				
				// input
				_self.mapHeightValue = ko.observable(size.height);
				_self.mapWidthValue = ko.observable(size.width);
				_self.layers = ko.observableArray(map.map.layers);
			
				// clean the view model
				clean(ko);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};
				
				_self.bind = function() {
					clean(ko);
					ko.applyBindings(_self, elem);
				};
				
				_self.addLayer = function() {
					_self.layers.push({ id: 'New at ' + new Date() });
				};
 
				_self.removeLayer = function() {
					_self.layers.remove(this);
				};
    
				_self.init();
			};

			vm = new projheaderViewModel(elem, map);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};
		
		clean = function(ko) {
			// clean (each tab) and remove node in foreach array binding
			ko.cleanNode(document.getElementById('generalMap'));
			document.getElementById('layers').innerHTML = '';
		};
		
		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
