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
	], function($aut, ko) {

    ko.bindingHandlers.tooltip = {
		init: function(element, valueAccessor) {
			var options = {},
				local = ko.utils.unwrapObservable(valueAccessor()),
				$element = $aut(element);

			ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
			ko.utils.extend(options, local);

			$element.attr('title', options.content);
			$element.tooltip(options);

			//handle disposal (if KO removes by the template binding)
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

	// http://stackoverflow.com/questions/12856112/using-knockout-js-with-jquery-ui-sliders
	ko.bindingHandlers.uiSlider = {
		init: function (element, valueAccessor, allBindingsAccessor) {
			var options = allBindingsAccessor().sliderOptions || {},
				$element = $aut(element);

			$element.slider(options);
			ko.utils.registerEventHandler(element, 'slidechange', function (event, ui) {
				var observable = valueAccessor();

				if (options.range) {
					valueAccessor()[0](ui.values[0]);
					valueAccessor()[1](ui.values[1]);
				} else {
					observable()[0](ui.value);
				}
			});

			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				$element.slider('destroy');
			});

			ko.utils.registerEventHandler(element, 'slide', function (event, ui) {
				var observable = valueAccessor();

				if (options.range) {
					valueAccessor()[0](ui.values[0]);
					valueAccessor()[1](ui.values[1]);
				} else {
					observable()[0](ui.value);
				}
			});
		},
		update: function (element, valueAccessor, allBindingsAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor()),
				$element = $aut(element);

			if (isNaN(value)) {
				value = 0;
			}

			$element.slider('value', value);
			$element.slider('option', allBindingsAccessor().sliderOptions);
		}
	};

	// http://jsfiddle.net/7bRVH/214/
	ko.bindingHandlers.uiAutocomplete = {
		init: function (element, valueAccessor) {
			var options = valueAccessor() || {},
				$element = $aut(element);

			$element.autocomplete(options);

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$element.autocomplete('destroy');
			});
		},
		update: function (element, valueAccessor) {
			var options = valueAccessor() || {};
			$aut(element).autocomplete('option', 'source', options.source);
		}
	};

	ko.bindingHandlers.uiSortable = {
		init: function(element, valueAccessor) {
			var options = valueAccessor() || {},
				$refresh = $aut('#' + options.refresh),
				update = options.update,
				$element = $aut(element);

			$element.sortable(options);
			$element.disableSelection();

			if (typeof $refresh !== 'undefined') {
				$refresh.focus(function() {
					$element.sortable('refresh');
				});
			}

			if (typeof update !== 'undefined') {
				$element.on('sortupdate', update);
			}

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$element.sortable('destroy');
			});
		},
		update: function(element, valueAccessor) {
			var options = valueAccessor() || {};
			$aut(element).sortable('destroy').sortable(options);
		}
	};

	ko.bindingHandlers.uiAccordion = {
		init: function(element, valueAccessor) {
			var options = valueAccessor() || {},
				$refresh = $aut('#' + options.refresh),
				$element = $aut(element);

			if (typeof options.sortable !== 'undefined') {
				$element.accordion(options).sortable(options.sortable);
			} else {
				$element.accordion(options);
			}

			if (typeof $refresh !== 'undefined') {
				$refresh.focus(function() {
					if (typeof $element !== 'undefined') {
						if ($element.hasClass('ui-accordion')) {
							$element.accordion('refresh');
						}
					}
				});
			}

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$element.accordion('destroy');
			});
		},
		update: function(element, valueAccessor) {
			var options = valueAccessor() || {},
				$element = $aut(element);

			if (typeof options.sortable !== 'undefined') {
				$element.accordion('destroy').accordion(options).sortable(options.sortable);
			} else {
				$element.accordion('destroy').accordion(options);
			}
		}
	};

	ko.bindingHandlers.uiDialog = {
		init: function(element, valueAccessor, allBindings, viewModel) {
			var customFunc,
				local = ko.utils.unwrapObservable(valueAccessor()),
				options = {},
				$element = $aut(element);

			ko.utils.extend(options, ko.bindingHandlers.uiDialog.options);
			ko.utils.extend(options, local);

			// if function are provided for ok and/or cancel, update
			if (typeof options.ok !== 'undefined') {
				options.buttons[0].click = options.ok;
			}
			if (typeof options.cancel !== 'undefined') {
				options.buttons[1].click = options.cancel;
			}

			$element.dialog(options);

			customFunc = function(value) {
				$element.dialog(value ? 'open' : 'close');
			};

			viewModel[local.openDialog].subscribe(customFunc);

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$element.dialog('destroy');
			});
		},
		options: {
			autoOpen: false,
			modal: true,
			resizable: false,
			draggable: false,
			show: 'fade',
			hide: 'fade',
			closeOnEscape: true,
			close: function() { },
			buttons: [{
				text: 'Ok',
				click: function() {
					$aut(this).dialog('close');
				}
				}, {
				text: 'Cancel',
				click: function() {
					$aut(this).dialog('close');
				}
			}]
		}
	};

	//custom binding handler to add image to a label
	ko.bindingHandlers.imgLabel = {
		init: function(element, valueAccessor) {
			var array,
				len,
				options = valueAccessor() || {};

			// add text
			$aut(element).text(options.text);

			// add a simgle image if img is provided
			// add multiple images if imgs is provided
			if (options.img) {
				$aut(element).prepend('<img class="gcaut-img-lbl" src="' + options.img + '"></img>');
			} else if (options.imgs) {
				array = options.imgs.split(';');
				len = array.length;

				while (len--) {
					$aut(element).prepend('<img class="gcaut-img-lbl" src="' + array[len] + '"></img>');
				}
			}
		}
	};

	});
}).call(this);
