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
			'gcaut-i18n',
			'gcaut-ko',
			'gcaut-vm-map',
			'gcaut-vm-header',
			'gcaut-vm-footer'
	], function($aut, ko, i18n, binding, mapVM, headerVM, footerVM) {
		var initialize,
			readConfig,
			vm;

		initialize = function(elem) {

			// data model
			var projheaderViewModel = function(elem) {
				var _self = this,
					pathNew = locationPath + 'gcaut/images/projNew.png',
					pathOpen = locationPath + 'gcaut/images/projOpen.png',
					pathDelete = locationPath + 'gcaut/images/projDelete.gif',
					pathRestore = locationPath + 'gcaut/images/projRestore.gif',
					pathSave = locationPath + 'gcaut/images/projSave.png';

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
				_self.mapLabel = i18n.getDict('%map') + ': ';
				_self.mapsLabel = ko.observable(' ' + i18n.getDict('%of') + ' ' + i18n.getDict('%map') + '(s)');

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

					// work around for Firefox because we cant trigger the input if it is inside the button
					// We need it inside the button to have our css
					if (window.browser === 'Firefox') {
						$('#openFileDialog').click(function(e) {
						    $(document.getElementById('fileDialogFF')).click();
						});
					}

					return { controlsDescendantBindings: true };
				};

				_self.openMap = function() {
					var files = event.target.files,
						len = files.length,
						file, reader;

					// loop through the FileList.
					while (len--) {
						file = files[len];
						reader = new FileReader();

						// Closure to capture the file information and launch the process
						reader.onerror = function(event) {
							console.log(i18n.getDict('%msg-configerr'));
						};

						reader.onload = (function(theFile) {
								return function(e) {
									try{
								        var config = JSON.parse(e.target.result);
										_self.initMap(config, config.gcaut.name);
								    }catch(e){
								        console.log(i18n.getDict('%msg-configerr'));
								    }
        					};
      					})(file);
      					reader.readAsText(file);
					}
				};

				_self.newMap = function() {
					// read the file then launch the process
					_self.readConfig(locationPath + 'src/js/templates/default.json');
				};

				_self.deleteMap = function() {
					// removes map from dropdown and array and add item to restore array
					var id = _self.mapsIDValue() - 1,
						item = _self.maps.splice(id, 1);
					_self.mapsRestore.push(item[0]);

					// reset index
					_self.resetIndex();
				};

				_self.restoreMap = function() {
					// push back to maps array
					var len = _self.mapsRestore.length;

					while(len--) {
						_self.maps.push(_self.mapsRestore.shift());
					}

					// reset index
					_self.resetIndex();
				};

				_self.saveMap = function() {

					// get the active map id
					var id = _self.mapsIDValue() - 1,
						vm = _self.maps[id],
						uri = 'data:text/json;charset=utf-8,',
						content = '{"gcaut": {"name": "sample1.json"},"gcviz": {',
						downloadLink;

					// loop trought viewmodels and get info to write
					Object.keys(vm).forEach(function(key) {
					    content += vm[key].write();
					    content += ',';
					});

					// remove last comma, add the close brackets and add to uri
					content = content.substring(0, content.length - 1);
					content += '}}';
					uri += content;

					// create a download link to get the file then delete it
					downloadLink = document.createElement('a');
					downloadLink.href = uri;
					downloadLink.download = 'data.json';
					document.body.appendChild(downloadLink);
					downloadLink.click();
					document.body.removeChild(downloadLink);
				};

				_self.resetIndex = function() {
					var len = _self.maps.length,
						lenAll = _self.maps.length;

					_self.mapsID([]);
					while(len--) {
						_self.mapsID.push(lenAll - len);
					}
					_self.mapsIDValue(lenAll);
					_self.mapsLabel(' ' + i18n.getDict('%of') + ' ' + _self.mapsID().length + ' ' + i18n.getDict('%map') + '(s)');
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
							_self.initMap(config, 'default template');
						},
						error: function() {
							console.log(i18n.getDict('%msg-configerr') + ': ' + url);
						}
					}); // end ajax
				};

				_self.initMap = function(config, url) {
					var id = _self.maps.length + 1,
						vm = {},
						gcviz = config.gcviz;

					// create the master view model (launch every view model one after the other)
					vm.map = mapVM.initialize(document.getElementById('map'), gcviz.mapframe);
					vm.header = headerVM.initialize(document.getElementById('headerMap'), gcviz.header);
					vm.footer = footerVM.initialize(document.getElementById('footerMap'), gcviz.footer);

					// push the vm to array, update the dropdown list and select the new item
					_self.maps.push(vm);
					_self.mapsID.push(id);
					_self.mapsIDValue(id);
					_self.mapsLabel(' ' + i18n.getDict('%of') + ' ' + _self.mapsID().length + ' ' + i18n.getDict('%map') + '(s)');
					console.log(i18n.getDict('%msg-configread') + ': ' + url);
				};

				/*
				 * this function is fired when map dropdown list value changed
				 */
				_self.mapsIDValue.subscribe(function(id) {
					var vm = _self.maps[id - 1],
						$tabs = $aut('#gcauttabs');

					// clean the bindings then reapply the view model values for each vm
					if (typeof vm !== 'undefined') {
						Object.keys(vm).forEach(function(key) {
							vm[key].bind();
						});
					}

					// show or hide tabs
					if (_self.mapsID().length === 0) {
						$tabs.addClass('gcaut-invisible');
					} else {
						$tabs.removeClass('gcaut-invisible');
					}
				});

				_self.init();
			};

			vm = new projheaderViewModel(elem);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
		};

		return {
			initialize: initialize
		};
	});
}).call(this);
