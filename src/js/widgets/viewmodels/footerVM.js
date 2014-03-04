/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Footer view model widget
 */
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

		initialize = function(elem, map) {

			// data model
			var footerViewModel = function(elem, map) {
				var _self = this,
					arrow = map.northarrow,
					mouse = map.mousecoords,
					srType = gcautFunc.getSrType(i18n.getDict('%map-sr'));

				// label
				_self.lblUrlGeomServer = i18n.getDict('%footer-urlGeomServer');
				_self.lblEnbArrow = i18n.getDict('%footer-arrow');
				_self.lblArrowSR = i18n.getDict('%footer-arrowSR');
				_self.lblEnbMouse = i18n.getDict('%footer-mouse');
				_self.lblMouseSR = i18n.getDict('%footer-mouseSR');
				_self.lblSelectItem = i18n.getDict('%selectItem');

				// input
				_self.urlGeomServer = ko.observable(map.urlgeomserv);
				_self.isArrow = ko.observable(arrow.enable);
				_self.isMouse = ko.observable(mouse.enable);

				// arrow and mouse SR
				_self.arrowSR = srType;
				_self.mouseSR = srType;
				_self.selectArrowSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, arrow.inwkid)]);
				_self.selectMouseSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, mouse.outwkid)]);

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.write = function() {
					var value,
						inwkid = -1,
						outwkid = -1;
					
					// check if value are undefined
					if (_self.selectArrowSR() !== undefined) {
						inwkid = _self.selectArrowSR().id;
					}
					
					if (_self.selectMouseSR() !== undefined) {
						outwkid = _self.selectMouseSR().id;
					}
					
					value = '"footer": {' +
								'"urlgeomserv": "' + _self.urlGeomServer() + '",' +
								'"northarrow": {' +
									'"enable": ' + _self.isArrow() +
									',"inwkid": ' + inwkid +
								'},' +
								'"mousecoords": {' +
									'"enable": ' + _self.isMouse() +
									',"outwkid": ' + outwkid +
								'},' +
								'"datatable": {' +
									'"direction": "in"' +
								'}' +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new footerViewModel(elem, map);
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
