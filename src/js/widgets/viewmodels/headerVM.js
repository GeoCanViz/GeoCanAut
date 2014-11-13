/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Header view model widget
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
			var headerViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					side = map.side,
					title = map.title,
					tools = map.tools,
					about = map.about,
					print = map.print,
					sideType = gcautFunc.getListCB(i18n.getDict('%header-sidelist')),
					toolsType = gcautFunc.getListCB(i18n.getDict('%header-toolsexpandlist')),
					aboutType = gcautFunc.getListCB(i18n.getDict('%header-abouttypelist')),
					printType = gcautFunc.getListCB(i18n.getDict('%header-printtypelist'));

				// label
				_self.lblMapTitle = i18n.getDict('%header-mapname');
				_self.lblMapTitleAlt = i18n.getDict('%header-mapnamealt');
				_self.lblHeaderSide = i18n.getDict('%header-side');
				_self.lblEnbTools = i18n.getDict('%header-lblbutton');
				_self.lblTools = i18n.getDict('%header-tools');
				_self.lblToolsExpand = i18n.getDict('%header-toolsexpand');
				_self.lblAbout = i18n.getDict('%header-about');
				_self.lblAboutType = i18n.getDict('%header-abouttype');
				_self.lblAboutValue = i18n.getDict('%header-aboutvalue');
				_self.lblPrint = i18n.getDict('%header-print');
				_self.lblPrintType = i18n.getDict('%header-printtype');
				_self.lblInset = i18n.getDict('%header-inset');
				_self.lblFulscreen = i18n.getDict('%header-fullscreen');
				_self.lblTitleChar = i18n.getDict('%header-msgtitle');
				_self.lblMenu = i18n.getDict('%header-menu');

				// header side
				_self.sideType = sideType;
				_self.selectHeaderSide = ko.observable(_self.sideType[side - 1]);

				// title
				_self.mapTitleValue = ko.observable(title.value);
				_self.mapAltValue = ko.observable(title.alttext);
				_self.mapTitleWidth = ko.observable();
				_self.mapTitleCount = ko.computed(function() {
					return (_self.mapTitleWidth() - _self.mapTitleValue().length) + _self.lblTitleChar;
				});

				// tools
				_self.isTools = ko.observable(tools.enable);
				_self.toolsExpand = toolsType;
				_self.selectTools = ko.observable(_self.toolsExpand[tools.expand - 1]);

				// insets and link
				_self.isInset = ko.observable(false);
				_self.isLink = ko.observable(map.link);

				// full screen
				_self.isFullscreen = ko.observable(map.fullscreen);

				// about
				_self.isAbout = ko.observable(about.enable);
				_self.aboutType = aboutType;
				_self.selectAbout = ko.observable(_self.aboutType[about.type - 1]);
				_self.aboutValue = ko.observable(about.value);

				// print
				_self.isPrint = ko.observable(print.enable);
				_self.printType = printType;
				_self.selectPrint = ko.observable(_self.printType[print.type - 1]);

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					// wait until all vm are set
					setTimeout(function() {
						_self.mapTitleWidth((gcautFunc.getElemValueVM('map', 'mapWidthValue') - 325) / 5);
					}, 500);
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.updateTitle = function(value) {
					_self.mapTitleWidth((value - 325) / 5);
				};

				_self.write = function() {
					var value;

					// get inset and link info from other vm
					// TODO set inset when insetVM will be created. In mean time hardcode
					_self.isLink(gcautFunc.getElemValueVM('map', 'isLink'));

					value = '"header": {' +
								'"side": ' + _self.selectHeaderSide().id +
								',"title": {' +
									'"value": "' + _self.mapTitleValue() +'",' +
									'"alttext": "' + _self.mapAltValue() + '"' +
								'},' +
								'"tools": {' +
									'"enable": ' + _self.isTools() +
									',"expand": ' + _self.selectAbout().id +
								'},' +
								'"link": ' + _self.isLink() +
								',"inset": ' + _self.isInset() +
								',"about": {' +
									'"enable": ' +  _self.isAbout() +
									',"type": ' + _self.selectAbout().id +
									',"value": "' + _self.aboutValue() + '"' +
								'},' +
								'"print": {' +
									'"enable": ' +  _self.isPrint() +
									',"type": ' + _self.selectPrint().id +
								'},' +
								'"fullscreen": ' + _self.isFullscreen() +
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

			vm = new headerViewModel(elem, map, controls);
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
