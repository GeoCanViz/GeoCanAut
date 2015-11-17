/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Datagrid view model widget
 */
(function() {
    'use strict';
    define(['jquery-private',
            'knockout',
            'gcaut-i18n',
            'gcaut-func',
            'gcaut-gisservinfo'
    ], function($aut, ko, i18n, gcautFunc, gisServInfo) {
        var initialize,
            clean,
            vm;

        initialize = function(elem, map, controls) {

            // data model
            var datagridViewModel = function(elem, map, controls) {
                var _self = this,
                    lenControls = controls.length,
                    grid = map.grid,
                    seachType = gcautFunc.getListCB(i18n.getDict('%boollist')),
                    fieldType = gcautFunc.getListCB(i18n.getDict('%datagrid-fieldtypelist')),
                    valueType = gcautFunc.getListCB(i18n.getDict('%datagrid-fieldvaluelist'));

                // tooltip
                _self.tpAddLayer = i18n.getDict('%datagrid-tpaddlayer');

                // label
                _self.lblRemove = i18n.getDict('%remove');
                _self.lblEnable = i18n.getDict('%datagrid-enable');
                _self.lblExpand = i18n.getDict('%expand');
                _self.lblLayerSelect = i18n.getDict('%datagrid-layerselect');
                _self.lblTitle = i18n.getDict('%datagrid-title');
                _self.lblIndex = i18n.getDict('%datagrid-index');
                _self.lblSearchAll = i18n.getDict('%datagrid-searchall');
                _self.lblFieldEnable = i18n.getDict('%datagrid-fieldenable');
                _self.lblFieldWidth = i18n.getDict('%datagrid-fieldwidth');
                _self.lblFieldData = i18n.getDict('%datagrid-fielddata');
                _self.lblFieldAlias = i18n.getDict('%datagrid-fieldalias');
                _self.lblFieldType = i18n.getDict('%datagrid-fieldtype');
                _self.lblFieldValue = i18n.getDict('%datagrid-fieldvalue');
                _self.lblFieldSearch = i18n.getDict('%datagrid-fieldsearch');
                _self.lblLink = i18n.getDict('%datagrid-link');
                _self.lblLinkRel = i18n.getDict('%datagrid-linkrel');
                _self.lblLinkTitle = i18n.getDict('%datagrid-linktitle');
                _self.lblLinkSubTitle = i18n.getDict('%datagrid-linksubtitle');
                _self.lblPopup = i18n.getDict('%datagrid-popup');
                _self.lblSetIndex = i18n.getDict('%datagrid-setindextitle');
                _self.lblExpandAll = i18n.getDict('%expandall');
                _self.lblCollapseAll = i18n.getDict('%collapseall');
                _self.lblExpandCollapseAllB =  ko.observable(_self.lblExpandAll);
                _self.lblExpandCollapseAllL =  ko.observable(_self.lblExpandAll);
                _self.tpExpandCollapse = i18n.getDict('%tpexpcollall');
                _self.lblDescription = i18n.getDict('%datagrid-fielddesc');

                // enable and expand
                _self.isEnable = ko.observable(map.enable);
                _self.isExpand = ko.observable(map.expand);

                // select layer
                _self.layerList = ko.observableArray([]);
                _self.selectLayer = ko.observable();

                // layers
                _self.layers = ko.observableArray(map.layers);

                // fields
                _self.fieldType = fieldType;
                _self.valueType = valueType;
                _self.selectType = ko.observable(_self.fieldType[0]);
                _self.selectValue = ko.observable(_self.valueType[0]);

                // popup for index
                _self.isDynamicServOpen = ko.observable(false);
                _self.indexValue = ko.observable(0).extend({ numeric: { precision: 0 } });

                // functions to create observable on layers
                ko.utils.arrayForEach(_self.layers(), function(item) {
                    var field, link, infoType,
                        layerInfo = item.layerinfo,
                        fields = item.fields.reverse(),
                        links = item.linktable,
                        linksFields = links.fields,
                        popups = item.popups,
                        hover = item.hover,
                        lenFields = fields.length,
                        lenLinks = links.fields.length;

                    // layerinfo
                    item.layerinfo.uniqueid = ko.observable(layerInfo.id);
                    item.layerinfo.type = ko.observable(layerInfo.type);
                    item.layerinfo.index = ko.observable(layerInfo.index).extend({ numeric: { precision: 0 } });

                    // remove the original id attribute. it is replaced by uniqueid
                    delete item.layerinfo['id'];

                    // title
                    item.title = ko.observable(item.title);

                    // search all table
                    item.globalsearch = ko.observable(item.globalsearch);

                    // fields
                    item.fields = ko.observableArray([]);
                    while (lenFields--) {
                        field = fields[lenFields];
                        field.enable = ko.observable(field.enable);
                        field.title = ko.observable(field.title);
                        field.width = ko.observable(field.width);
                        field.data = ko.observable(field.data);
                        field.dataalias = ko.observable(field.dataalias);
                        field.searchable = ko.observable(field.searchable);
                        if (typeof field.description !== 'undefined') {
                            field.description = ko.observable(field.description);
                        } else {
                            field.description = ko.observable('');
                        }
                        infoType = field.fieldtype;
                        field.fieldtype = {} // clean field type from attributes
                        field.fieldtype.type = ko.observable(_self.fieldType[infoType.type - 1]);
                        field.fieldtype.value = ko.observable(_self.valueType[infoType.value - 1]);
                        item.fields.push(field);
                    }

                    // linktable
                    item.linktable.enable = ko.observable(links.enable);
                    item.linktable.relationshipid = ko.observable(links.relationshipid).extend({ numeric: { precision: 0 } });
                    item.linktable.title = ko.observable(links.title);
                    item.linktable.subtitle = ko.observable(links.subtitle);

                    // link fields
                    item.linktable.fields = ko.observableArray([]);
                    while (lenLinks--) {
                        link = linksFields[lenLinks];
                        link.enable = ko.observable(link.enable);
                        link.title = ko.observable(link.title);
                        link.data = ko.observable(link.data);
                        item.linktable.fields.push(link);
                    }

                    // popups
                    item.popups.enable = ko.observable(popups.enable);
                    item.popups.layeralias = ko.observable(popups.layeralias);

                    // hover
                    item.hover.enable = ko.observable(hover.enable);
                    item.hover.hoverfield = ko.observable(hover.hoverfield);
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

                _self.dialogIndexCancel = function() {
                    _self.isDynamicServOpen(false);
                    _self.indexValue(0);
                };

                _self.dialogIndexOk = function() {
                    _self.addLayer(_self.indexValue());
                    _self.dialogIndexCancel();
                };

                _self.checkLayer = function() {
                    var type, layer,
                        id = _self.selectLayer().id,
                        layers = gcautFunc.getElemValueVM('map', 'layers'),
                        len = layers.length;

                    // get url and type from array of layer
                    while (len--) {
                        layer = layers[len];

                        if (id === layer.id) {
                            type = layer.type;
                        }
                    }

                    // if layer is type 4 (dynamic service), ask forthe index
                    if (type === 4) {
                        _self.isDynamicServOpen(true);
                    } else {
                        _self.addLayer();
                    }
                };

                _self.addLayer = function(ind) {
                    var $accLayers, $accLayersF, $accLayersL,
                        url, type, layer, index,
                        jsonLayer,
                        layerInfo, linkTable, popUps, hoverInfo,
                        fieldInfo, field, fields, lenFields,
                        item = { },
                        id = _self.selectLayer().id,
                        layers = gcautFunc.getElemValueVM('map', 'layers'),
                        len = layers.length;

                    // set index
                    if (typeof ind !== 'undefined') {
                        index = ind;
                    } else {
                        index = 0;
                    }

                    // get url and type from array of layer
                    while (len--) {
                        layer = layers[len];

                        if (id === layer.id) {
                            type = layer.type;
                            url = layer.url;
                            if (type === 4) {
                                url = layer.url + '/' + index;
                            }
                        }
                    }

                    // get info from the service
                    jsonLayer = $aut.parseJSON(gisServInfo.getRestServiceInformation(url).responseText);

                    // layerinfo
                    layerInfo = { };
                    layerInfo.uniqueid = ko.observable(id);
                    layerInfo.type = ko.observable(type);
                    layerInfo.index = ko.observable(index).extend({ numeric: { precision: 0 } });
                    item.layerinfo = layerInfo;

                    // title
                    item.title = ko.observable(jsonLayer.name);

                    // search all table
                    item.globalsearch = ko.observable(false);

                    // fields
                    item.fields = ko.observableArray([]);
                    fields = jsonLayer.fields.reverse();
                    lenFields = fields.length;
                    while (lenFields--) {
                        fieldInfo = fields[lenFields];
                        field = { };
                        field.enable = ko.observable(false);
                        field.title = ko.observable(fieldInfo.alias);
                        field.width = ko.observable('');
                        field.data = ko.observable(fieldInfo.name);
                        field.dataalias = ko.observable(fieldInfo.alias);
                        field.searchable = ko.observable(false);
                        field.description = ko.observable('');
                        field.fieldtype = { };
                        field.fieldtype.type = ko.observable(_self.fieldType[0]);
                        field.fieldtype.value = ko.observable(_self.valueType[0]);
                        item.fields.push(field);
                    }

                    // linktable
                    linkTable = { };
                    linkTable.enable = ko.observable(false);
                    linkTable.relationshipid = ko.observable(0).extend({ numeric: { precision: 0 } });
                    linkTable.title = ko.observable('');
                    linkTable.subtitle = ko.observable('');

                    // link fields
                    linkTable.fields = ko.observableArray([]);
                    item.linktable = linkTable;

                    // popups
                    popUps = { };
                    popUps.enable = ko.observable(false);
                    popUps.layeralias = ko.observable(jsonLayer.name);
                    item.popups = popUps;

                    // hover
                    hoverInfo = { };
                    hoverInfo.enable = ko.observable(false);
                    hoverInfo.hoverfield = ko.observable('');
                    item.hover = hoverInfo;

                    // push new layers to array
                    _self.layers.push(item);

                    // refresh ui
                    $accLayers = $aut('.dgLayers');
                    $accLayersF = $aut('.dgLayersFields');
                    $accLayersL = $aut('.dgLayersLinks');
                    $accLayers.accordion('refresh');
                    $accLayersF.accordion('refresh');
                    $accLayersL.accordion('refresh');
                };

                _self.addPX = function(event, ui) {
                    event.width(parseInt(event.width(), 10) + 'px');
                };

                // when the remove layer icon is click, remove the layer from the array
                _self.removeLayer = function(parent, item) {
                    _self.removeItem(parent, _self.layers, item);
                };

                _self.removeItem = function(parent, array, item) {
                    var len = parent.length - 1;

                    if (len === 0) {
                        array.remove(item);
                    } else {
                        parent[0].items.remove(item);
                    }
                };

                // this function is called each time layers in map vm is modified
                _self.updateLayers = function(value) {
                    var item,
                        valArr = [],
                        len = value.length;

                    // reset list
                    _self.layerList([]);

                    // loop trought layers and populate list
                    while (len--) {
                        item = value[len];
                        valArr.push({ id: item.id, val: item.label });
                    }
                    _self.layerList(valArr);

                    // select the first layer
                    _self.selectLayer(_self.layerList()[0]);
                };

                _self.updateOrder = function(event) {
                    // reorder fields array after sort
                    var layer, oriFields, field, lenFields, uiField,
                        layers = _self.layers(),
                        $elems = $aut(event.target),
                        id = $elems.attr('id').replace('fields', ''),
                        fields = $elems.find('li'),
                        len = fields.length,
                        lenLayers = layers.length,
                        tmpFields = [];

                    // find fields from the layer
                    while (lenLayers--) {
                        layer = layers[lenLayers];
                        if (layer.layerinfo.uniqueid() === id) {
                            oriFields = layer.fields();
                            break;
                        }
                    }

                    // order fields
                    while (len--) {
                        uiField = fields[len];

                        lenFields = fields.length;
                        while (lenFields--) {
                            field = oriFields[lenFields];
                            if (field.data() === $aut(uiField).find('#txt_tblFieldData')[0].value) {
                                tmpFields.push(field);
                            }
                        }
                    }

                    _self.layers()[lenLayers].fields(tmpFields.reverse());
                };

                _self.expandAll = function() {
                    var action = _self.lblExpandCollapseAll() === _self.lblExpandAll ? 'show' : 'hide',
                        items = $aut('.dgLayersFields');

                    gcautFunc.expandAll(items, action);

                    if (action === 'show') {
                        _self.lblExpandCollapseAll(_self.lblCollapseAll);
                    } else {
                        _self.lblExpandCollapseAll(_self.lblExpandAll);
                    }
                };

                _self.write = function() {
                    var value, fields,
                        lenLayers = _self.layers().length;

                    // reorder fields before writting
                    while (lenLayers--) {
                        _self.layers()[lenLayers].fields(_self.layers()[lenLayers].fields().reverse());
                    }

                    // remove value from the field value list
                    fields = JSON.stringify(ko.toJS(_self.layers())).replace(/{"id":/g, '').replace(/,"val":"String"}/g, '').replace(/,"val":"Number"}/g, '').replace(/,"val":"Date"}/g, ',"informat": 1,"outformat": 1').replace(/,"val":"Select"}/g, '')
                                                                    .replace(/,"val":"Texte"}/g, '').replace(/,"val":"Nombre"}/g, '').replace(/,"val":"Sélection"}/g, '');

                    // remove value from field type list
                    fields = fields.replace(/{"id":/g, '').replace(/,"val":"Field"}/g, '').replace(/,"val":"Key URL"}/g, '').replace(/,"val":"URL"}/g, '').replace(/,"val":"Field URL"}/g, '').replace(/,"val":"Field Key URL"}/g, '')
                                    .replace(/,"val":"Champ"}/g, '').replace(/,"val":"Clé URI"}/g, '').replace(/,"val":"URI"}/g, '').replace(/,"val":"Champ URI"}/g, '').replace(/,"val":"Champ clé URI"}/g, '');

                    // we renamed id to uniqueid in layer info to be not replace when we replace values for fieldtype. Put bac id
                    fields = fields.replace(/{"uniqueid":/g, '{"id":');
                    fields = fields.replace(/"uniqueid":/g, '"id":'); // if the file has been loaded

                    value = '"datagrid": {' +
                                '"enable": ' + _self.isEnable() +
                                ',"expand": ' + _self.isExpand() +
                                ',"layers": ' + fields +
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

            vm = new datagridViewModel(elem, map, controls);
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
