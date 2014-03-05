/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Header view model widget
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
			var headerViewModel = function(elem, map) {
				var _self = this,
					title = map.title,
					print = map.print,
					printType = gcautFunc.getListCB(i18n.getDict('%header-printtypelist'));

				// label
				_self.lblMapTitle = i18n.getDict('%header-mapname');
				_self.lblMapAlt = i18n.getDict('%header-mapname');
				_self.lblEnbTools = i18n.getDict('%header-lblbutton');
				_self.lblTools = i18n.getDict('%header-tools');
				_self.lblPrint = i18n.getDict('%header-print');
				_self.lblPrintType = i18n.getDict('%header-printtype');
				_self.lblInset = i18n.getDict('%header-inset');
				_self.lblFulscreen = i18n.getDict('%header-fullscreen');
				_self.lblSelectItem = i18n.getDict('%selectItem');

				// title
				_self.mapTitleValue = ko.observable(title.value);
				_self.mapAltValue = ko.observable(title.alttext);
				
				// tools
				_self.isTools = ko.observable(map.tools);
				
				// insets
				_self.isInset = ko.observable(map.inset);
				
				// full screen
				_self.isFullscreen = ko.observable(map.fullscreen);

				// print
				_self.isPrint = ko.observable(print.enable);
				_self.printType = printType;
				_self.selectPrint = ko.observable(_self.printType[print.type - 1]);

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
						print = -1;

					// check if value are undefined
					if (_self.selectPrint() !== undefined) {
						print = _self.selectPrint().id;
					}
					
					value = '"header": {' +
								'"title": {' +
									'"value": "' + _self.mapTitleValue() +'",' +
									'"alttext": "' + _self.mapAltValue() + '",' +
									'"justify": "center"' +
								'},' +
								'"tools": ' + _self.isTools() + ',' +
								'"print": {' +
									'"enable": ' +  _self.isPrint() +
									',"type": ' + print +
								'},' +
								'"fullscreen": ' + _self.isFullscreen() +
								',"inset": ' + _self.isInset() +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new headerViewModel(elem, map);
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
