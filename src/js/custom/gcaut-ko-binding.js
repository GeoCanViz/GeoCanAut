/*
 *
 * GeoCanAut viewer / Visionneuse GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * hold custom Knockout binding
 */
(function() {
	'use strict';
	define(['jquery-private',
			'knockout',
			'jqueryui'
	], function($aut, ko, slider) {
    
    ko.bindingHandlers.tooltip = {
		init: function(element, valueAccessor) {
			var local = ko.utils.unwrapObservable(valueAccessor()),
				options = {},
				$element = $(element);
					
			ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
			ko.utils.extend(options, local);
				
			$element.attr('title', options.content);
			$element.tooltip(options);
					
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
					$element.tooltip('destroy');
				});
			},
			options: {
				show: {
					effect: 'slideDown',
					delay: 2000
				},
				hide: {
					effect: 'slideUp',
					delay: 100
				},
				position: {
					my: 'right+30 top+5'
				},
				tooltipClass: 'gcviz-tooltip',
				trigger: 'hover, focus'
			}
	};
  
	ko.bindingHandlers.callbacks = {
		init: function(element, valueAccessor, allBindings, viewModel) {
                        // var mapid = viewModel.mapid,
                                // vm = vmArray[mapid].header;
                        // vm.isFullscreen.subscribe(manageFullscreen);
//                         
                        function manageFullscreen(fullscreen) {
                                if (fullscreen) {
                                        viewModel.enterFullscreen(vm.widthSection, vm.heightSection);
                                } else {
                                        viewModel.exitFullscreen();
                                }
                        }
                },
                
		update: function(element, valueAccessor, allBindings, viewModel) {
			// get function name to call from the binding
			var func = valueAccessor().func,
				keyType = valueAccessor().keyType;

			// ko.utils.registerEventHandler(element, keyType, function(event) {
				// if (viewModel[func](event.which, event.shiftKey, event.type)) {
					// event.preventDefault();
					// return false;
				// }
// 
				// return true;
			// });
		}         
	};
	});
}).call(this);