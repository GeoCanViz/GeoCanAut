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
			'genfile',
			'gcaut-i18n',
			'gcaut-ko',
			'gcaut-func',
			'gcaut-vm-map',
			'gcaut-vm-header',
			'gcaut-vm-footer',
			'gcaut-vm-legend',
			'gcaut-vm-draw',
			'gcaut-vm-nav',
			'gcaut-vm-data'
	], function($aut, ko, generateFile, i18n, binding, gcautFunc, mapVM, headerVM, footerVM, legendVM, drawVM, navVM, dataVM) {
		var initialize,
			loadFile,
			setFocus,
			vm;

		initialize = function(elem, config) {

			// data model
			var projheaderViewModel = function(config) {
				var _self = this,
					pathNew = locationPath + 'gcaut/images/projNew.png',
					pathOpen = locationPath + 'gcaut/images/projOpen.png',
					pathDelete = locationPath + 'gcaut/images/projDelete.gif',
					pathRestore = locationPath + 'gcaut/images/projRestore.gif',
					pathSave = locationPath + 'gcaut/images/projSave.png',
					pathTemplate = locationPath + 'gcaut/config/gcviz-default.json';

				// images path
				_self.imgNew = pathNew;
				_self.imgOpen = pathOpen;
				_self.imgDelete = pathDelete;
				_self.imgRestore = pathRestore;
				_self.imgSave = pathSave;

				// set label
				_self.headerLabel = i18n.getDict('%projheader-title');
				_self.newLabel = i18n.getDict('%projheader-newlabel');
				_self.saveLabel = i18n.getDict('%projheader-savelabel');
				_self.mapLabel = i18n.getDict('%map') + ' ';
				_self.mapsLabel = ko.observable(' ' + i18n.getDict('%of') + ' ' + i18n.getDict('%map') + '(s)');

				// text
				_self.txtOf = i18n.getDict('%of');
				_self.txtMaps = i18n.getDict('%map') + '(s)';
				_self.txtConfig = i18n.getDict('%msg-configread') + ': ';
				_self.txtConfigErr = i18n.getDict('%msg-configerr');

				// tooltip
				_self.tpNew = i18n.getDict('%projheader-tpnewmap');
				_self.tpSave = i18n.getDict('%projheader-tpsavemap');
				_self.tpOpen = i18n.getDict('%projheader-tpopenmap');
				_self.tpDelete = i18n.getDict('%projheader-tpdeletemap');
				_self.tpRestore = i18n.getDict('%projheader-tprestoremap');

				// map array
				_self.maps = [];
				_self.mapsRestore = [];
				_self.mapsID = ko.observableArray([]);
				_self.mapsIDValue = ko.observable();

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.launchDialog = function() {
					// launch the dialog. We cant put the dialog in the button because
					// Firefox will not launch the window. To be able to open the window,
					// we mimic the click
					$aut(document.getElementById('fileDialogOpen'))[0].click();
				};

				_self.openMap = function(vm, event) {
					var file, reader,
						files = event.target.files,
						len = files.length;

					// loop through the FileList.
					while (len--) {
						file = files[len];
						reader = new FileReader();

						// closure to capture the file information and launch the process
						reader.onload = loadFile();
						reader.readAsText(file);
					}

					// clear the selected file
					document.getElementById('fileDialogOpen').value = '';
				};

				loadFile = function() {
					return function(e) {
						var config;

						try {
							config = JSON.parse(e.target.result);
							_self.initMap(config);
						} catch(error) {
							console.log(_self.txtConfigErr + ': ' + error);
						}
					};
				};

				_self.newMap = function() {
					// read the file then launch the process
					_self.readConfig(pathTemplate);
				};

				_self.deleteMap = function() {
					// removes map from dropdown and array and add item to restore array
					var id = parseInt(_self.mapsIDValue().split(' ')[1], 10) - 1,
						item = _self.maps.splice(id, 1),
						maps = vm.maps;

					_self.mapsRestore.push(item[0]);

					// reset index and focus
					_self.resetIndex();
					setFocus(maps[maps.length - 1].map.focusMapHeight);
				};

				_self.restoreMap = function() {
					// push back to maps array
					var len = _self.mapsRestore.length,
						maps = vm.maps;

					while (len--) {
						_self.maps.push(_self.mapsRestore.shift());
					}

					// reset index and set focus
					_self.resetIndex();
					setFocus(maps[maps.length - 1].map.focusMapHeight);
				};

				_self.saveMap = function() {
					// get the active map id
					var id = _self.mapsIDValue(),
						vm = _self.maps[parseInt(id.split(' ')[1], 10) - 1],
						content = '{"gcviz": {';

					// loop trought viewmodels and get info to write
					Object.keys(vm).forEach(function(key) {
						content += vm[key].write();
						content += ',';
					});

					// add inset frame (TODO: remove when insets will be enable)
					content += '"insetframe": {"enable": false},';

					// add custom widget section and close brackets
					content += '"customwidgets": []';
					content += '}}';

					// generate the iframe then call the php. Then remove the iframe
					// http://tutorialzine.com/2011/05/generating-files-javascript-php/
					$aut.generateFile({
						filename	: id + '.json',
						content		: content,
						script		: config.phpdownload
					});

					setTimeout(function() { $aut('#gcaut-download').remove(); }, 3000, false);
				};

				_self.resetIndex = function() {
					var id,
						len = _self.maps.length,
						lenAll = _self.maps.length;

					_self.mapsID([]);
					while (len--) {
						id = lenAll - len;
						_self.mapsID.push(_self.mapLabel + id);
					}
					_self.mapsIDValue(_self.mapLabel + lenAll);
					_self.mapsLabel(' ' + _self.txtOf + ' ' + _self.mapsID().length + ' ' + _self.txtMaps);
				};

				/*
				*  read configuration file and start execution
				*/
				_self.readConfig = function(url) {
					// ajax call to get the config file info
					$aut.support.cors = true; // force cross-site scripting for IE9
					$aut.ajax({
						url: url,
						crossDomain: true,
						dataType: 'json',
						async: false,
						success: function(config) {
							_self.initMap(config);
						},
						error: function() {
							console.log(_self.txtConfigErr + ': ' + url);
						}
					}); // end ajax
				};

				_self.initMap = function(config) {
					var vm = {},
						id = _self.maps.length + 1,
						mapVal = _self.mapLabel + id,
						gcviz = config.gcviz;

					// create the master view model (launch every view model one after the other)
					vm.map = mapVM.initialize(document.getElementById('map'), gcviz.mapframe);
					vm.header = headerVM.initialize(document.getElementById('headerMap'), gcviz.header, [{ value: vm.map.mapWidthValue, func: 'updateTitle' }]);
					vm.footer = footerVM.initialize(document.getElementById('footerMap'), gcviz.footer, [{ value: vm.map.selectMapSR, func: 'updateSR' }]);
					vm.legend = legendVM.initialize(document.getElementById('legendMap'), gcviz.toolbarlegend,
													[{ value: vm.map.layers, func: 'updateLayers' },
													{ value: vm.map.bases, func: 'updateBases' }]);
					vm.draw = drawVM.initialize(document.getElementById('drawMap'), gcviz.toolbardraw);
					vm.navigation = navVM.initialize(document.getElementById('navigationMap'), gcviz.toolbarnav);
					vm.data = dataVM.initialize(document.getElementById('dataMap'), gcviz.toolbardata);

					setFocus(vm.map.focusMapHeight);

					// push the vm to array, update the dropdown list and select the new item
					_self.maps.push(vm);
					_self.mapsID.push(mapVal);
					_self.mapsIDValue(mapVal);
					_self.mapsLabel(' ' + _self.txtOf + ' ' + _self.mapsID().length + ' ' + _self.txtMaps);
					console.log(_self.txtConfig);

					// set vm object in custom function to be access by other view model
					gcautFunc.setVM(vm);
				};

				setFocus = function(elem) {
					// select map tab to be active (will refresh the accordions controls)
					// use $ instead of $aut because they use jQueryUI dependency
					$aut('#gcauttabs').tabs('option', 'active', 0);
					$aut('#gcautmaptabs').tabs('option', 'active', 0);

					// make sure the resolution accordion is close. if not in a timeout it won't
					// work properly
					setTimeout( function() { $aut('#gcaut-lods').accordion('option', 'active', false); }, 0);

					// we force to select the map height because even if we set the value in the viewmodel
					// it is not focus on the first map.
					// we set it in a timeout, if not, it will not work
					setTimeout(function() { elem(true); }, 0);
				};

				/*
				* this function is fired when map dropdown list value changed
				*/
				_self.mapsIDValue.subscribe(function(item) {

					if (typeof item !== 'undefined') {
						var id = parseInt(item.split(' ')[1], 10) - 1,
							vm = _self.maps[id],
							$tabs = $aut('#gcauttabs');

						// clean the bindings then reapply the view model values for each vm
						if (typeof vm !== 'undefined') {
							Object.keys(vm).forEach(function(key) {
								vm[key].bind();
							});
						}

						// set vm object in custom function to be access by other view model and set focus
						gcautFunc.setVM(vm);
						setFocus(vm.map.focusMapHeight);

						// show or hide tabs
						if (_self.mapsID().length === 0) {
							$tabs.tabs('option', { collapsible: true, active: false, disabled: true });
						} else if (_self.mapsID().length === 1) {
							$tabs.tabs('option', { collapsible: false, disabled: false, active: 0 });
						}
					}
				});

				_self.init();
			};

			vm = new projheaderViewModel(config);
			ko.applyBindings(vm, elem); // this makes Knockout get to work
		};

		return {
			initialize: initialize
		};
	});
}).call(this);
