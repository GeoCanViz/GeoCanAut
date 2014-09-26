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
			vm;

		initialize = function(elem, map) {

			// data model
			var navViewModel = function(elem, map) {
				var _self = this,
					geoloc = map.geolocation,
					scalebar = map.scalebar,
					scale = map.scaledisplay,
					overview = map.overview,
					position = map.position,
					scalebarType = gcautFunc.getListCB(i18n.getDict('%nav-scalebarlist')),
					scaleType = gcautFunc.getListCB(i18n.getDict('%nav-scalelist')),
					overType = gcautFunc.getListCBCust([2,4], i18n.getDict('%nav-overtypelist')),
					pathZoom = locationPath + 'gcaut/images/navFullExtent.png',
					pathGeoloc = locationPath + 'gcaut/images/navGeoloc.png',
					pathPosition = locationPath + 'gcaut/images/navPosition.png';

				// images path
				_self.imgZoom = pathZoom;
				_self.imgGeoloc = pathGeoloc;
				_self.imgPosition = pathPosition;

				// label
				_self.lblEnable = i18n.getDict('%nav-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblZoom = i18n.getDict('%nav-zoom');
				_self.lblGeoloc = i18n.getDict('%nav-geoloc');
				_self.lblScalebar = i18n.getDict('%nav-scalebar');
				_self.lblScalebarUnit = i18n.getDict('%nav-scalebarunit');
				_self.lblScale = i18n.getDict('%nav-scale');
				_self.lblScaleFormat = i18n.getDict('%nav-scaleformat');
				_self.lblOver = i18n.getDict('%nav-over');
				_self.lblOverUrl = i18n.getDict('%nav-overurl');
				_self.lblOverType = i18n.getDict('%nav-overtype');
				_self.lblPosition = i18n.getDict('%nav-position');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// zoom to full extent
				_self.isZoom = ko.observable(map.zoom);

				// zoom to geolocation
				_self.isGeoloc = ko.observable(geoloc.enable);

				// scalebar
				_self.isScalebar = ko.observable(scalebar.enable);
				_self.scalebarType = scalebarType;
				_self.selectScalebar = ko.observable(_self.scalebarType[scalebar.unit - 1]);

				// scale
				_self.isScale = ko.observable(scale.enable);
				_self.scaleType = scaleType;
				_self.selectScale = ko.observable(_self.scaleType[scale.format - 1]);

				// overview
				_self.isOver = ko.observable(overview.enable);
				_self.urlOver = ko.observable(overview.url);
				_self.overType = overType;
				
				// the overview type id is not sequential so we need to use a if then else
				if (overview.type === 2) {
					_self.selectOver = ko.observable(_self.overType[overview.type - 2]);
				} else {
					_self.selectOver = ko.observable(_self.overType[overview.type - 3]);
				}

				// position
				_self.isPosition = ko.observable(position.enable);

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
					var value,
						mapwkid = gcautFunc.getElemValueVM('map', 'selectMapSR');

					value = '"toolbarnav": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"mapwkid": ' + mapwkid.id +
								',"zoom": ' + _self.isZoom() +
								',"geolocation": {' +
									'"enable": ' + _self.isGeoloc() +
									',"type": -1' +
								'},' +
								'"scalebar": {' +
									'"enable": ' + _self.isScalebar() +
									',"unit": ' + _self.selectScalebar().id +
								'},' +
								'"scaledisplay": {' +
									'"enable": ' + _self.isScale() +
									',"format": ' + _self.selectScale().id +
								'},' +
								'"overview": {' +
									'"enable": ' + _self.isOver() +
									',"url": "' + _self.urlOver() + '"' +
									',"type": ' + _self.selectOver().id +
								'},' +
								'"position": {' +
									'"enable": ' + _self.isPosition() +
								'}' +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new navViewModel(elem, map);
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
