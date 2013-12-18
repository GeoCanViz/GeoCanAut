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
  
	});
}).call(this);