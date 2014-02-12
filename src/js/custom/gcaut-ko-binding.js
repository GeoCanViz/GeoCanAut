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

	// http://knockoutjs.com/documentation/extenders.html
	ko.extenders.numeric = function(target, precision) {
		// create a writeable computed observable to intercept writes to our observable
		var result = ko.computed({
		read: target,  // always return the original observables value
		write: function(newValue) {
			var current = target(),
			roundingMultiplier = Math.pow(10, precision),
			newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue),
			valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

			// only write if it changed
			if (valueToWrite !== current) {
				target(valueToWrite);
			} else {
				// if the rounded value is the same, but a different value was written, force a notification for the current field
				if (newValue !== current) {
					target.notifySubscribers(valueToWrite);
				}
			}
		}
		}).extend({ notify: 'always' });

		// initialize with current value to make sure it is rounded appropriately
		result(target());

		// return the new computed observable
		return result;
	};

	// http://jsfiddle.net/7bRVH/214/
	ko.bindingHandlers.autocomplete = {
		init: function (element, params) {
			$aut(element).autocomplete(params());
		},
		update: function (element, params) {
			$aut(element).autocomplete('option', 'source', params().source.availServ());
		}
	};

	ko.bindingHandlers.accordion = {
		init: function (element, params) {
			$aut(element).accordion();
		},
		update: function (element, params) {
			$aut(element).accordion('refresh');
		}
	};

	});
}).call(this);