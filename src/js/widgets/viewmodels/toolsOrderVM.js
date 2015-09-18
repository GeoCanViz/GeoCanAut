/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Toolbars order view model
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

		initialize = function(elem) {

			// data model
			var toolsOrderViewModel = function(elem) {
				var _self = this,
					position = 0;

				// toolbars name
				_self.lblData = i18n.getDict('%data-title');
				_self.lblDraw = i18n.getDict('%draw-title');
				_self.lblNav = i18n.getDict('%nav-title');
				_self.lblLegend = i18n.getDict('%legend-title');
				_self.lblExtract = i18n.getDict('%extract-title');
				_self.lblInfo = i18n.getDict('%toolsorder-info');
				
				// array to hold the toolbars
				_self.tools = ko.observableArray([]);

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					// subscribe to isEnable for every toolbars
					// subscribe to legend
					gcautFunc.subscribeTo('legend', 'isEnable', function(val) {
						if (val) {
							_self.addItem('legend', _self.lblLegend);
						} else {
							_self.removeItem('legend');
						}
					});

					// subscribe to draw
					gcautFunc.subscribeTo('draw', 'isEnable', function(val) {
						if (val) {
							_self.addItem('draw', _self.lblDraw);
						} else {
							_self.removeItem('draw');
						}
					});

					// subscribe to navigation
					gcautFunc.subscribeTo('navigation', 'isEnable', function(val) {
						if (val) {
							_self.addItem('navigation', _self.lblNav);
						} else {
							_self.removeItem('navigation');
						}
					});

					// subscribe to data
					gcautFunc.subscribeTo('data', 'isEnable', function(val) {
						if (val) {
							_self.addItem('data', _self.lblData);
						} else {
							_self.removeItem('data');
						}
					});

					// subscribe to extract
					gcautFunc.subscribeTo('extract', 'isEnable', function(val) {
						if (val) {
							_self.addItem('extract', _self.lblExtract);
						} else {
							_self.removeItem('extract');
						}
					});

					// subscribe is done after read. We  need to loop VM and check
					setTimeout(function() {
						_self.read('legend', _self.lblLegend);
						_self.read('draw', _self.lblDraw);
						_self.read('navigation', _self.lblNav);
						_self.read('data', _self.lblData);
						_self.read('extract', _self.lblExtract);
					}, 1000);
					
					return { controlsDescendantBindings: true };
				};

				_self.read = function(vm, label) {
					if (gcautFunc.getElemValueVM(vm, 'isEnable')) {
						_self.addItem(vm, label);
					}
				};

				_self.addItem = function(vm, label) {
					_self.tools.push({ label: label,
						vm: vm
					});
					gcautFunc.setElemValueVM(vm, 'pos', position);
					position++;
				};

				_self.removeItem = function(vm) {
					_self.tools.remove(function(item) {
						return item.vm === vm;
					});
					gcautFunc.setElemValueVM(vm, 'pos', -1);
					position--;
				};

				_self.update = function(event) {
					if (typeof event !== 'undefined') {
						// loop trough the array and update position
						var i, vm, name, len,
							toolbar = event.target.children,
							lenTool = toolbar.length,
							arr = _self.tools();
	
						while (lenTool--) {
							len = _self.tools().length;
							name = toolbar[lenTool].innerText;
	
							while (len--) {
								// update position
								if (name === arr[len].label) {
									vm = arr[len].vm;
									gcautFunc.setElemValueVM(vm, 'pos', lenTool);
								}
							}
						}
					}
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.init();
			};

			vm = new toolsOrderViewModel(elem);
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
