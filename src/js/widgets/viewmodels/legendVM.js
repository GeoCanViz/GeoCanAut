/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Legend view model widget
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
			createItem,
			addArray,
			vm;

		initialize = function(elem, map, controls) {

			// data model
			var legendViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					visibilityType = gcautFunc.getListCB(i18n.getDict('%legend-visibilitytypelist')),
					pathOpen = locationPath + 'gcaut/images/legendOpen.png';

				// images path
				_self.imgOpen = pathOpen;
				
				// label
				_self.lblReset = i18n.getDict('%reset');
				_self.lblRemove = i18n.getDict('%remove');
				_self.lblEnable = i18n.getDict('%legend-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblItemExpand = i18n.getDict('%legend-expand');
				_self.lblLabel = i18n.getDict('%legend-label');
				_self.lblMeta = i18n.getDict('%legend-metadata');
				_self.lblMetaUrl = i18n.getDict('%legend-metaurl');
				_self.lblMetaText = i18n.getDict('%legend-metatext');
				_self.lblOpacity = i18n.getDict('%legend-opacity');
				_self.lblOpacityMin = i18n.getDict('%minimum');
				_self.lblOpacityMax = i18n.getDict('%maximum');
				_self.lblVisibility = i18n.getDict('%legend-visibility');
				_self.lblVisibilityState = i18n.getDict('%legend-visibilitystate');
				_self.lblVisibilityType = i18n.getDict('%legend-visibilitytype');
				_self.lblVisibilityRadio = i18n.getDict('%legend-visibilityradioid');
				_self.lblDisplayChild = i18n.getDict('%legend-displaychild');
				_self.lblCustomImage = i18n.getDict('%legend-customimage');
				_self.lblCustomImageUrl = i18n.getDict('%legend-customimageurl');
				_self.lblCustomImageText = i18n.getDict('%legend-customimagetext');
				_self.lblSectBases = i18n.getDict('%legend-sectbases');
				_self.lblSectLayers = i18n.getDict('%legend-sectlayers');

				// tooltip
				_self.tpRefresh = i18n.getDict('%projheader-tpnewmap');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// visibility
				_self.visibilityType = visibilityType;

				// global opacity value to update children
				_self.opacityValue = false;

				// legend layers and bases
				_self.holderLayers = map.items;
				_self.legendLayers = ko.observableArray(map.items);
				_self.holderBases = map.basemaps;
				_self.legendBases = ko.observableArray(map.basemaps);

				// functions to create observable from the legend items
				_self.updateInitState = function(value, element) {
					if (!value) {
						element(true);
					}
				};

				_self.updateCustom = function(value, element) {
					if (value) {
						element(false);
					}
				};

				_self.updateOpacity = function(value, element) {
					_self.opacityValue = value;
					_self.updateOpacityChild(element, value);
				};

				_self.updateOpacityChild = function(item) {
					ko.utils.arrayForEach(item, function(item) {
						if (_self.opacityValue) {
							item.opacity.enable(false);
							item.opacity.canenable(false);
						} else {
							item.opacity.canenable(true);
						}
						_self.updateOpacityChild(item.items());
					});
				};

				createItem = function(item) {
					var label = item.label,
						metadata = item.metadata,
						opacity = item.opacity,
						visibility = item.visibility,
						customimage = item.customimage,
						opacityGlobal = opacity.enable;

					item.expand = ko.observable(item.expand);
					item.fullid = ko.observable(item.fullid);
					item.last = ko.observable(item.last);
					item.id = ko.observable(item.id);
					item.displayfields = ko.observable(item.displayfields),
					item.label.value = ko.observable(label.value);
					item.label.alttext = ko.observable(label.alttext);
					item.metadata.enable = ko.observable(metadata.enable);
					item.metadata.value = ko.observable(metadata.value);
					item.metadata.alttext = ko.observable(metadata.alttext);
					item.opacity.enable = ko.observable(opacity.enable);
					item.opacity.canenable = ko.observable(_self.opacityValue);
					item.opacity.min = ko.observable(opacity.min).extend({ numeric: 2 });
					item.opacity.max = ko.observable(opacity.max).extend({ numeric: 2 });
					item.visibility.enable = ko.observable(visibility.enable);
					item.visibility.initstate = ko.observable(visibility.initstate);
					item.visibility.type = ko.observable(_self.visibilityType[visibility.type - 1]);
					item.visibility.radioid = ko.observable(visibility.radioid).extend({ numeric: 0 });
					item.displaychild = ko.observable(item.displaychild);
					item.customimage.enable = ko.observable(customimage.enable);
					item.customimage.url = ko.observable(customimage.url);
					item.customimage.alttext = ko.observable(customimage.alttext);
					item.items = ko.observableArray(item.items);

					// subscribe to change on visibility.enable because if it is false
					// visibility.initstate should be true
					item.visibility.enable.subscribe(function() {
						_self.updateInitState(item.visibility.enable(), item.visibility.initstate);
					});

					// subscribe to change on displaychils because if it is true
					// customimage.enable should be false
					item.displaychild.subscribe(function() {
						_self.updateCustom(item.displaychild(), item.customimage.enable);
					});

					// subscribe to change on opacity.enable because if it is true
					// opacity.enable of every child should be false
					item.opacity.enable.subscribe(function() {
						_self.updateOpacity(item.opacity.enable(), item.items());
					});

					// disable opacity checkbox for child if parent is true
					if (opacityGlobal) {
						_self.opacityValue = false;
					}

					return item;
				};

				_self.createArray = function(item) {
					ko.utils.arrayForEach(item.items(), function(item) {
						item = createItem(item);
						_self.createArray(item);
					});
				};

				ko.utils.arrayForEach(_self.legendLayers(), function(item) {
					_self.opacityValue = true;
					item = createItem(item);
					_self.createArray(item);
				});
				
				ko.utils.arrayForEach(_self.legendBases(), function(item) {
					_self.opacityValue = true;
					item = createItem(item);
					_self.createArray(item);
				});

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					// refresh ui and bind the update event
					setTimeout(function() {
						// workaround to solve holderBases array to be empty when we delete element in bases. If reset it run once
						// before, only legendBases get empty (not holderBases)
						var bases = _self.resetArray(_self.holderBases),
							$accBases = $aut('.legendSortBases'),
							$accLayers = $aut('.legendSortLayers');
							
						bases()[0] = _self.holderBases[0];
						_self.legendBases(bases());
						
						$accBases.accordion('refresh');
						$accBases.on('sortupdate', gcautFunc.debounce(function(event) {
																		_self.sortArray($accBases); 
																	}, 1000, false));
						$accLayers.accordion('refresh');
						$accLayers.on('sortupdate', gcautFunc.debounce(function(event) {
																		_self.sortArray($aut('.legendSortLayers-lvl1'));
																	}, 1000, false));
					}, 1000);

					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.reset = function() {
					var bases = _self.resetArray(_self.holderBases),
						layers = _self.resetArray(_self.holderLayers);
					
					// reset bases and layers
					_self.legendBases(bases());
					_self.legendLayers(layers());

					// refresh ui
					$aut('.legendSortBases').accordion('refresh');
					$aut('.legendSortLayers').accordion('refresh');
				};

				_self.resetArray = function(list) {
					var arr, id, fullid, lensplit, last,
						value = list,
						split = [],
						items = ko.observableArray(),
						len = value.length - 1,
						i = 0, j = 0;

					while (i <= len) {
						if (typeof value[i].id === 'function') {
							id = value[i].id().replace(' / ', ' - ');
						} else {
							id = value[i].id.replace(' / ', ' - ');
						}
						fullid = id;
						split = id.split('/');
						lensplit = split.length - 1;
						j = 0;

						// check if the item already exist. If not create a new one and
						// if it exsit return the reference.
						last = (lensplit === 0) ? true : false;
						arr = _self.unique(items, split[0], fullid, last);
						j++;

						while (j <= lensplit) {
							last = (j === lensplit) ? true : false;
							arr = _self.unique(arr.items, split[j], fullid, last);
							j++;
						}

						i++;
					}
					
					return items;
				};
				
				_self.updateLayers = function(value) {
					_self.holderLayers = value;
				};
				
				_self.updateBases = function(value) {
					_self.holderBases = value;
				};

				_self.unique = function(items, value, fullid, last) {
					var item,
						len = items().length;

					while (len--) {
						item = items()[len];

						if (item.id() === value) {
							// the item exist, return the reference
							return item;
						}
					}

					// the item does not exist so create a new one
					items.push(addArray(value, fullid, last));
					return items()[items().length - 1];
				};

				addArray = function(value, fullid, last) {
					var item;

					item = { expand : ko.observable(false),
								fullid: ko.observable(fullid),
								last: ko.observable(last),
								id: ko.observable(value),
								displayfields: ko.observable(false),
								label: {
									value: ko.observable(value),
									alttext: ko.observable(value)
								},
								metadata: {
									enable: ko.observable(false),
									value: ko.observable(),
									alttext: ko.observable()
								},
								opacity: {
									enable: ko.observable(false),
									canenable: ko.observable(true),
									min: ko.observable(0).extend({ numeric: 2 }),
									max: ko.observable(100).extend({ numeric: 2 })
								},
								visibility: {
									enable: ko.observable(true),
									initstate: ko.observable(false),
									type: ko.observable(_self.visibilityType[0]),
									radioid: ko.observable().extend({ numeric: 0 })
								},
								displaychild: ko.observable(true),
								customimage: {
									enable: ko.observable(false),
									url: ko.observable(),
									alttext: ko.observable()
								},
								items: ko.observableArray()
							};

					// subscribe to change on visibility.enable because if it is false
					// visibility.initstate should be true
					item.visibility.enable.subscribe(function() {
						_self.updateInitState(item.visibility.enable(), item.visibility.initstate);
					});

					// subscribe to change on displaychils because if it is true
					// customimage.enable should be false
					item.displaychild.subscribe(function() {
						_self.updateCustom(item.displaychild(), item.customimage.enable);
					});

					// subscribe to change on opacity.enable because if it is true
					// opacity.enable of every child should be false
					item.opacity.enable.subscribe(function() {
						_self.updateOpacity(item.opacity.enable(), item.items());
					});

					return item;
				};

				// when the remove layer icon is click, remove the base from the array
				_self.removeBase = function(parent, item) {
					_self.removeItem(parent, _self.legendBases, item);

					// refresh ui
					$aut('.legendSortBases').accordion('refresh');
				};

				// when the remove layer icon is click, remove the layer from the array
				_self.removeLayer = function(parent, item) {
					_self.removeItem(parent, _self.legendLayers, item);

					// refresh ui
					$aut('.legendSortLayers').accordion('refresh');
				};
				
				_self.removeItem = function(parent, array, item) {
					var father, son,
						len = parent.length - 1,
						i = 0;

					if (len === 0) {
						array.remove(item);
					} else {
						parent[0].items.remove(item);

						// remove parent if no child exist
						while (i < len) {
							son = parent[i];

							if (i + 1 === len) {
								father = parent[i + 1].array;
							} else {
								father = parent[i + 1].items;
							}

							_self.existChild(son, father);
							i++;
						}
					}
				};
				
				_self.existChild = function(item, parent) {
					if (item.items().length === 0) {
						parent.remove(item);
					}
				};
				
				_self.sortArray = function(item) {
					var tree,
						values;
					
					// get the tree from html accordion structure
					tree = _self.getArrayRec($aut(item));
					
					// flattened versions of the items
					// http://jsfiddle.net/rniemeyer/VHEYK/
					_self.flatItems = ko.computed(function() {
						var result = [],
							len;
						_self.addChildren(_self.legendLayers(), result);
						
						// remove child items
						len = result.length;
						while (len--) {
							result[len].items([]);
						}
						
						return result;
					});
					
					// update the legendLayers or legendBases
					values = _self.updateArrayRec(tree, _self.flatItems(), []);
				};
				
				// to be called recursively to flatten the array
			    _self.addChildren = function(array, result) {
			        array = ko.utils.unwrapObservable(array);
			        if (array) {
			            for (var i = 0, j = array.length; i < j; i++) {
			                result.push(array[i]);
			                _self.addChildren(array[i].items, result);
			            }        
			        }
			    };
				
				// get item from flatten array
				_self.getObject = function(items, label) {
					var item,
						len = items.length;
					
					while (len--) {
						item = items[len];
						if (label === item.label.value()) {
							return item;
						}
					}
				};
				
				// to be called recursively to create the tree of label from html
				_self.getArrayRec = function(item) {
					var child,
						label,
						labels = [],
						children = $aut(item).children(),
						len = children.length;
					
					while (len--) {
						child = $aut(children[len]);
						label = { label: $aut(child.find('h3').find('span')[1]).text() };
						label.labels = _self.getArrayRec(child.children('div').children('ul'));
						labels.push(label);
					}
					
					return labels;
				};
				
				_self.updateArrayRec = function(tree, array, values) {
					var item,
						val,
						label,
						i = 0,
						len = tree.length;
					
					while (len--) {
						item = tree[len];
						values.push(_self.getObject(array, item.label));
						_self.updateArrayRec2(item.labels, array, values[i].items);
						i++;
					}
					
					return values;
				};
				
				_self.updateArrayRec2 = function(tree, array, values) {
					var item,
						val,
						label,
						i = 0,
						len = tree.length;
					
					while (len--) {
						item = tree[len];
						
						if (item.labels.length === 0) {
							values.push(_self.getObject(array, item.label));
						} else {
							values().push(_self.getObject(array, item.label));
							_self.updateArrayRec2(item.labels, array, values()[i].items);
						}
						i++;
					}
					
					return values;
				};

				_self.openCloseAll = function(data, event) {
					var id = $aut(event.target.parentElement.parentElement).attr('id'),
						$node = $aut(event.target.parentElement.parentElement.parentElement),
						$masterHead = $node.find('#' + id),
						$masterBody = $node.find('#' + id.replace('header', 'panel')),
						$head = $masterBody.find('li > h3'),
						$body = $masterBody.find('li > div');
					

					if ($masterHead.hasClass('ui-accordion-header-active')) {
						// close
						$masterHead.removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({ 'aria-selected': 'false', 'tabindex': '-1' });
						$masterHead.find('.ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
						$masterBody.removeClass('ui-accordion-content-active').attr({ 'aria-expanded': 'false', 'aria-hidden': 'true' }).hide();
						$head.removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({ 'aria-selected': 'false', 'tabindex': '-1' });
						$head.find('.ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
						$body.removeClass('ui-accordion-content-active').attr({ 'aria-expanded': 'false', 'aria-hidden': 'true' }).hide();
					} else {
						// open
						$masterHead.removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({ 'aria-selected': 'true', 'tabindex': '0' });
						$masterHead.find('.ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
						$masterBody.addClass('ui-accordion-content-active').attr({ 'aria-expanded': 'true', 'aria-hidden': 'false' }).show();
						$head.removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({ 'aria-selected': 'true', 'tabindex': '0' });
						$head.find('.ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
						$body.addClass('ui-accordion-content-active').attr({ 'aria-expanded': 'true', 'aria-hidden': 'false' }).show();
					}
					
					event.preventDefault();
				};
				
				_self.write = function() {
					var value,
						basesItems,
						layersItems;

					// remove value from the visibility type list
					basesItems = JSON.stringify(ko.toJS(_self.legendBases)).replace(/{"id":/g, '').replace(/,"val":"radio"}/g, '').replace(/,"val":"case"}/g, '');
					layersItems = JSON.stringify(ko.toJS(_self.legendLayers)).replace(/{"id":/g, '').replace(/,"val":"radio"}/g, '').replace(/,"val":"case"}/g, '');

					// remove canenable from opacity because it is an internal value
					basesItems = basesItems.replace(/,"canenable":false/g, '').replace(/,"canenable":true/g, '');
					layersItems = layersItems.replace(/,"canenable":false/g, '').replace(/,"canenable":true/g, '');

					value = '"toolbarlegend": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"basemaps": ' + basesItems +
								',"items": ' + layersItems +
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

			vm = new legendViewModel(elem, map, controls);
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
