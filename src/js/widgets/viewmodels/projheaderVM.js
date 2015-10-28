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
            'gcaut-vm-datagrid',
            'gcaut-vm-legend',
            'gcaut-vm-draw',
            'gcaut-vm-nav',
            'gcaut-vm-data',
            'gcaut-vm-extract',
            'gcaut-vm-order'
    ], function($aut, ko, generateFile, i18n, binding, gcautFunc, mapVM, headerVM, footerVM, datagridVM, legendVM, drawVM, navVM, dataVM, extractVM, toolsOrderVM) {
        var initialize,
            loadFile,
            setFocus,
            vm;

        initialize = function(elem, config) {

            // data model
            var projheaderViewModel = function(config) {
                var _self = this,
                    fileName = '',
                    pathTemplate = locationPath + 'gcaut/config/gcviz-default.json';

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

                // tabs
                _self.tabMap = i18n.getDict('%projheader-map');
                _self.tabHeader = i18n.getDict('%projheader-header');
                _self.tabTools = i18n.getDict('%projheader-tools');
                _self.tabFooter = i18n.getDict('%projheader-footer');
                _self.tabLegend = i18n.getDict('%projheader-legend');
                _self.tabDraw = i18n.getDict('%projheader-draw');
                _self.tabNavigation = i18n.getDict('%projheader-navigation');
                _self.tabDatatable = i18n.getDict('%projheader-datatable');
                _self.tabData = i18n.getDict('%projheader-data');

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

                // import dialog window
                _self.lblImportTitle = i18n.getDict('%projheader-importfile');
                _self.lblImportText =  ko.observable();
                _self.isImportDialogOpen = ko.observable();

                // save dialog window
                _self.isSaveDialogOpen = ko.observable();
                _self.saveName = ko.observable();
                _self.lblSaveTitle = i18n.getDict('%projheader-savefiletitle');
                _self.lblSaveText =  i18n.getDict('%projheader-savefile');

                _self.dialogImportOk = function() {
                    _self.lblImportText('');
                    _self.isImportDialogOpen(false);
                };

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
                        reader.onload = loadFile(file.name.replace('.json', ''));
                        reader.readAsText(file);
                    }

                    // clear the selected file
                    document.getElementById('fileDialogOpen').value = '';
                };

                loadFile = function(name) {
                    fileName = name;
                    return function(e) {
                        var config,
                            len;

                        try {
                            len = vm.maps.length;
                            config = JSON.parse(e.target.result);
                            _self.initMap(config, fileName + ' - ' + _self.mapLabel + (_self.maps.length + 1));
                        } catch(error) {
                            _self.lblImportText(_self.txtConfigErr + ': ' + error);
                            _self.isImportDialogOpen(true);
                            console.log(_self.txtConfigErr + ': ' + error);

                            // reset index and focus
                            if (vm.maps.length > 0 && len !== vm.maps.length) {
                                vm.maps.pop();
                                _self.resetIndex();
                                setFocus(vm.maps[vm.maps.length - 1].map.focusMapHeight);
                            }
                        }
                    };
                };

                _self.newMap = function() {
                    // read the file then launch the process
                    _self.readConfig(pathTemplate);
                };

                _self.deleteMap = function() {
                    // removes map from dropdown and array and add item to restore array
                    var items = _self.mapsIDValue(),
                        id = parseInt(items[items.length - 1], 10) - 1,
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
                    _self.isSaveDialogOpen(true);
                };

                _self.dialogSaveCancel = function() {
                    _self.isSaveDialogOpen(false);
                };

                _self.dialogSaveOk = function() {
                     // get the active map id
                    var items = _self.mapsIDValue().split(' '),
                        id = parseInt(items[items.length - 1], 10) - 1,
                        vm = _self.maps[id],
                        content = '{"gcviz": {';

                    // loop trought viewmodels and get info to write
                    Object.keys(vm).forEach(function(key) {
                        if (key !== 'label') {
                            content += vm[key].write();
                            content += ',';
                        }
                    });

                    // add inset frame (TODO: remove when insets will be enable)
                    content += '"insetframe": {"enable": false},';

                    // add custom widget section and close brackets
                    content += '"customwidgets": []';
                    content += '}}';

                    // generate the iframe then call the php. Then remove the iframe
                    // http://tutorialzine.com/2011/05/generating-files-javascript-php/
                    $aut.generateFile({
                        filename    : _self.saveName() + '.json',
                        content        : content,
                        script        : config.urldownload
                    });

                    _self.saveName('');
                    _self.isSaveDialogOpen(false);

                    setTimeout(function() { $aut('#gcaut-download').remove(); }, 3000, false);
                };

                _self.resetIndex = function() {
                    var i, id, labels, label,
                        len = _self.maps.length,
                        lenAll = _self.maps.length;

                    _self.mapsID([]);
                    for (i = 0; i < len; i++) {
                        id = i + 1;
                        labels = _self.maps[i].label.split(' - ');
                        if (labels.length === 1) {
                            label = '';
                        } else {
                            label = labels[0] + ' - ' ;
                        }
                        _self.mapsID.push(label + _self.mapLabel + id);
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
                            _self.initMap(config, _self.mapLabel + (_self.maps.length + 1));
                        },
                        error: function() {
                            _self.lblImportText(_self.txtConfigErr + ': ' + url);
                            _self.isImportDialogOpen(true);
                            console.log(_self.txtConfigErr + ': ' + url);
                        }
                    }); // end ajax
                };

                _self.initMap = function(config, mapVal) {
                    var vm = {},
                        gcviz = config.gcviz;

                    // create the master view model (launch every view model one after the other)
                    try {
                    vm.label = mapVal;
                    vm.map = mapVM.initialize(document.getElementById('map'), gcviz.mapframe);
                    vm.header = headerVM.initialize(document.getElementById('headerMap'), gcviz.header, [{ value: vm.map.mapWidthValue, func: 'updateTitle' }]);
                    vm.footer = footerVM.initialize(document.getElementById('footerMap'), gcviz.footer, [{ value: vm.map.selectMapSR, func: 'updateSR' }]);
                    vm.datagrid = datagridVM.initialize(document.getElementById('datagridMap'), gcviz.datagrid, [{ value: vm.map.layers, func: 'updateLayers' }]);
                    vm.legend = legendVM.initialize(document.getElementById('legendMap'), gcviz.toolbarlegend,
                                                    [{ value: vm.map.layers, func: 'updateLayers' },
                                                    { value: vm.map.bases, func: 'updateBases' }]);
                    vm.draw = drawVM.initialize(document.getElementById('drawMap'), gcviz.toolbardraw);
                    vm.navigation = navVM.initialize(document.getElementById('navigationMap'), gcviz.toolbarnav);
                    vm.data = dataVM.initialize(document.getElementById('dataMap'), gcviz.toolbardata);
                    vm.extract = extractVM.initialize(document.getElementById('extractMap'), gcviz.toolbarextract, [{ value: vm.map.layers, func: 'updateGrid' }]);
                    setFocus(vm.map.focusMapHeight);

                    // push the vm to array, update the dropdown list and select the new item
                    _self.maps.push(vm);
                    _self.mapsID.push(mapVal);
                    _self.mapsIDValue(mapVal);
                    _self.mapsLabel(' ' + _self.txtOf + ' ' + _self.mapsID().length + ' ' + _self.txtMaps);
                    console.log(_self.txtConfig);

                    // set vm object in custom function to be access by other view model
                    gcautFunc.setVM(vm);

                    // setup the order toolbars tabs
                    toolsOrderVM.initialize(document.getElementById('toolsOrder'));
                    } catch(error) {
                        _self.maps.push(vm);
                        throw(error);
                    }
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
                        var items = item.split(' '),
                            id = parseInt(items[items.length - 1], 10) - 1,
                            vm = _self.maps[id],
                            $tabs = $aut('#gcauttabs');

                        // clean the bindings then reapply the view model values for each vm
                        if (typeof vm !== 'undefined') {
                            Object.keys(vm).forEach(function(key) {
                                if (key !== 'label') {
                                    vm[key].bind();
                            }
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
