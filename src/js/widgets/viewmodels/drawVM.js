/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Draw view model widget
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
			vm;

		initialize = function(elem, map) {

			// data model
			var drawViewModel = function(elem, map) {
				var _self = this,
					line = map.drawline,
					text = map.drawtext,
					measureline = map.measureline,
					measurearea = map.measurearea,
					file = map.importexport,
					measureUnit = gcautFunc.getListCB(i18n.getDict('%draw-measureunitlist')),
					pathLine = locationPath + 'gcaut/images/drawDraw.png',
					pathText = locationPath + 'gcaut/images/drawText.png',
					pathMeasureL = locationPath + 'gcaut/images/drawMeasureL.png',
					pathMeasureA = locationPath + 'gcaut/images/drawMeasureA.png',
					pathImportExport = locationPath + 'gcaut/images/drawImport.png;' +locationPath + 'gcaut/images/drawExport.png';

				// images path
				_self.imgLine = pathLine;
				_self.imgText = pathText;
				_self.imgMeasureL = pathMeasureL;
				_self.imgMeasureA = pathMeasureA;
				_self.imgImportExport = pathImportExport;

				// label
				_self.lblEnable = i18n.getDict('%draw-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblLine = i18n.getDict('%draw-line');
				_self.lblText = i18n.getDict('%draw-text');
				_self.lblMeasureL = i18n.getDict('%draw-measureline');
				_self.lblMeasureA = i18n.getDict('%draw-measurearea');
				_self.lblMeasureUnit = i18n.getDict('%draw-measureunit');
				_self.lblFile = i18n.getDict('%draw-file');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// line
				_self.isLine = ko.observable(line.enable);

				// text
				_self.isText = ko.observable(text.enable);

				// measure
				_self.isMeasureL = ko.observable(measureline.enable);
				_self.isMeasureA = ko.observable(measurearea.enable);
				_self.measureUnitL = ko.observable(measureline.unit);
				_self.measureUnitA = ko.observable(measurearea.unit);
				_self.measureUnit = measureUnit;
				_self.selectMeasureUnitL = ko.observable(_self.measureUnit[measureline.unit - 1]);
				_self.selectMeasureUnitA = ko.observable(_self.measureUnit[measurearea.unit - 1]);

				// import/export file
				_self.isFile = ko.observable(file.enable);

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.write = function() {
					var value;

					value = '"toolbardraw": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"drawline": {' +
									'"enable": ' + _self.isLine() +
								'},' +
								'"drawtext": {' +
									'"enable": ' + _self.isText() +
								'},' +
								'"measureline": {' +
									'"enable": ' + _self.isMeasureL() +
									',"unit": ' + _self.selectMeasureUnitL().id +
								'},' +
								'"measurearea": {' +
									'"enable": ' + _self.isMeasureA() +
									',"unit": ' + _self.selectMeasureUnitA().id +
								'},' +
								'"importexport": {' +
									'"enable": ' + _self.isFile() +
								'}' +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new drawViewModel(elem, map);
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
