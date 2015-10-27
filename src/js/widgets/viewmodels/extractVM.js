/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Extract view model widget
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

        initialize = function(elem, map, controls) {

            // data model
            var extractViewModel = function(elem, map, controls) {
                var _self = this,
                    lenControls = controls.length,
                    grid = map.grid,
                    queryType = gcautFunc.getListCB(i18n.getDict('%extract-qlist'));

                // tooltip
                _self.tpOpenClose = i18n.getDict('%openclose');
                _self.tpAddQuery = i18n.getDict('%extract-linkqadd');
                _self.tpAddLink = i18n.getDict('%extract-linkadd');

                // label
                _self.lblEnable = i18n.getDict('%extract-enable');
                _self.lblExpand = i18n.getDict('%expand');
                _self.lblRemove = i18n.getDict('%remove');
                _self.lblGrid = i18n.getDict('%extract-grid');
                _self.lblGridSelect = i18n.getDict('%extract-gridselect');
                _self.lblTitle = i18n.getDict('%extract-linktitle');
                _self.lblSubtitle = i18n.getDict('%extract-linksubtitle');
                _self.lblScale = i18n.getDict('%extract-linkscale');
                _self.lblURL = i18n.getDict('%extract-linkurl');
                _self.lblParam = i18n.getDict('%extract-linkqparam');
                _self.lblLabel = i18n.getDict('%extract-linkqlabel');
                _self.lblType = i18n.getDict('%extract-linkqtype');
                _self.lblDefault = i18n.getDict('%default');

                // enable and expand
                _self.isEnable = ko.observable(map.enable);
                _self.isExpand = ko.observable(map.expand);

                // toolbar position
                _self.pos = ko.observable(map.pos);

                // grid layer
                _self.isGrid = ko.observable(grid.enable);
                _self.gridId = ko.observable(grid.id);
                _self.gridList = ko.observableArray([]);
                _self.selectGrid = ko.observable();

                // links
                _self.links = ko.observableArray(map.items);

                // query type
                _self.queryType = queryType;
                _self.selectQuery = ko.observable(_self.queryType[1]);

                // functions to create observable on links
                ko.utils.arrayForEach(_self.links(), function(item) {
                    var query,
                        queries = item.query.reverse(),
                        len = queries.length;

                    // title and subtitle
                    item.title = ko.observable(item.title);
                    item.subtitle = ko.observable(item.subtitle);

                    // scale
                    item.scale = ko.observable(item.scale).extend({ numeric: { precision: 0 } });

                    // url
                    item.url = ko.observable(item.url);

                    // queries
                    item.query = ko.observableArray([]);
                    while (len--) {
                        query = queries[len];
                        query.type = ko.observable(_self.queryType[query.type - 1]);
                        query.param = ko.observable(query.param);
                        query.label = ko.observable(query.label);
                        item.query.push(query);
                    }
                });

                // clean the view model
                clean(ko, elem);

                _self.init = function() {
                    return { controlsDescendantBindings: true };
                };

                _self.bind = function() {
                    clean(ko, elem);
                    ko.applyBindings(_self, elem);
                };

                // this function is called each time layers in map vm is modified
                _self.updateGrid = function(value) {
                    var item,
                        loop = 0,
                        index = 0,
                        gridId = _self.gridId(),
                        valArr = [],
                        len = value.length;

                    // reset list
                    _self.gridList([]);

                    // loop trought layers and populate list
                    while (len--) {
                        item = value[len];
                        valArr.push({ id: item.id, val: item.label });

                        if (gridId === item.id) {
                            index = loop;
                        }
                        loop++;
                    }
                    _self.gridList(valArr);

                    // select the right layer
                    _self.selectGrid(_self.gridList()[index]);
                };

                _self.setGridId = function() {
                    var item = _self.selectGrid();

                    if (typeof item !== 'undefined') {
                        _self.gridId(item.id);
                    }
                };

                _self.addQuery = function(data) {
                    var item = { type: ko.observable(_self.queryType[1]),
                                param: ko.observable(''),
                                label: ko.observable('') };
                    data.query.push(item);

                    // refresh ui
                    $aut('.gccaut-links').accordion('refresh');
                };

                _self.addLink = function() {
                    var item = { };

                    // title and subtitle
                    item.title = ko.observable(_self.lblDefault);
                    item.subtitle = ko.observable('');

                    // scale
                    item.scale = ko.observable(0).extend({ numeric: { precision: 0 } });

                    // url
                    item.url = ko.observable('');

                    // empty array of queries
                    item.query = ko.observableArray([]);

                    // add to array
                    _self.links.push(item);

                    // refresh ui
                    $aut('.gccaut-links').accordion('refresh');
                };

                // when the remove link icon is click, remove the link from the array
                _self.removeLink = function(parent, item) {
                    _self.removeItem(parent, _self.links, item);
                };

                _self.removeItem = function(parent, array, item) {
                    var len = parent.length - 1;

                    if (len === 0) {
                        array.remove(item);
                    } else {
                        parent[0].items.remove(item);
                    }
                };

                _self.write = function() {
                    var value,
                        links,
                        id = 0;

                    // remove value from the visibility type list
                    links = JSON.stringify(ko.toJS(_self.links())).replace(/{"id":/g, '').replace(/,"val":"Extent"}/g, '').replace(/,"val":"NTS"}/g, '').replace(/,"val":"SNRC"}/g, '').replace(/,"val":"Étendue"}/g, '');

                    // check if we should set id
                    if (_self.isGrid()) {
                        id = _self.selectGrid().id;
                    }

                    value = '"toolbarextract": {' +
                                '"enable": ' + _self.isEnable() +
                                ',"expand": ' + _self.isExpand() +
                                ',"pos": ' + _self.pos() +
                                ',"grid": {' +
                                    '"enable": ' + _self.isGrid() +
                                    ',"id": "' + id + '"' +
                                '},' +
                                '"items":' + links +
                            '}';

                    return value;
                };

                // object from other view model to be able to subscribe to change event with a custom
                // binding
                while (lenControls--) {
                    controls[lenControls].value.subscribe(_self[controls[lenControls].func], _self);
                }

                _self.init();
            };

            vm = new extractViewModel(elem, map, controls);
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
