/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Footer view model widget
 */
/* global locationPath: false */
(function() {
    'use strict';
    define(['jquery-private',
			'knockout',
			'gcaut-i18n',
			'gcaut-func'
	], function($aut, ko, i18n, gcautFunc) {
		var initialize,
			clean,
			vm;

		initialize = function(elem, map, controls) {

			// data model
			var footerViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					arrow = map.northarrow,
					mouse = map.mousecoords,
					srType = gcautFunc.getSrType(i18n.getDict('%map-sr')),
					pathArrow = locationPath + 'gcaut/images/footNorthArrow.png';

				// images path
				_self.imgArrow = pathArrow;
				
				// label
				_self.lblEnbArrow = i18n.getDict('%footer-arrow');
				_self.lblArrowSR = i18n.getDict('%footer-arrowSR');
				_self.lblEnbMouse = i18n.getDict('%footer-mouse');
				_self.lblMouseSR = i18n.getDict('%footer-mouseSR');
				_self.lblSelectItem = i18n.getDict('%selectItem');

				// north arrow
				_self.isArrow = ko.observable(arrow.enable);
				_self.arrowSR = srType;
				_self.selectArrowSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, arrow.inwkid)]);
	
				// mouse coordinates
				_self.isMouse = ko.observable(mouse.enable);
				_self.mouseSR = srType;
				_self.selectMouseSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, mouse.outwkid)]);

				// mapSR object from map view model to be able tosubscribe to change event with a custom
				// binding
				while (lenControls--) {
					_self[controls[lenControls].id] = controls[lenControls].value;
				}

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.updateSR = function(value) {
					_self.selectArrowSR(srType[gcautFunc.getSrTypeIndex(srType, value.id)]);
				};
				
				_self.write = function() {
					var value,
						// get value from map viewmodel
						url = gcautFunc.getElemValueVM('map', 'urlGeomServer');
					
					value = '"footer": {' +
								'"urlgeomserv": "' + url + '",' +
								'"northarrow": {' +
									'"enable": ' + _self.isArrow() +
									',"inwkid": ' + _self.selectArrowSR().id +
								'},' +
								'"mousecoords": {' +
									'"enable": ' + _self.isMouse() +
									',"outwkid": ' + _self.selectMouseSR().id +
								'},' +
								'"datatable": {' +
									'"direction": "in"' +
								'}' +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new footerViewModel(elem, map, controls);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};

		clean = function(ko, elem) {
			ko.cleanNode(elem);
		};

		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
