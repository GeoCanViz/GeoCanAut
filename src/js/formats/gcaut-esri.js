/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * ESRI cached and dynamic format related functions
 */
(function () {
	'use strict';
	define(['knockout',
			'gcaut-func'
	], function(ko, gcautFunc) {
		var readInfo,
			getSublayer,
			getIndex;

		readInfo = function(sender, _self, urlObject, type, category) {
			var item, itemName, itemId,
				layer,
				layers = [],
				len = sender.layers.length - 1,
				index = -1,
				sendLayers = sender.layers,
				initExt = sender.initialExtent,
				fullExt = sender.fullExtent,
				url = urlObject,
				lods, lenlods;

			while (index !== len) {
				// set attribute the get sublayers
				layer = {};
				item = sendLayers[index + 1];
				itemName = item.name;
				itemId = item.id;
				layer.name = itemName;
				layer.fullname = itemName;
				layer.url = url + '/' + itemId;
				layer.id = itemId;
				layer.scale = { min: ko.observable(item.minScale).extend({ numeric: { precision: 0 } }),
								max: ko.observable(item.maxScale).extend({ numeric: { precision: 0 } }) };
				layer.isChecked = ko.observable(false);
				layer.isUse = ko.observable(false);
				layer.beforebase = ko.observable(false);
				layer.usecluster = ko.observable(false);
				layer.cluster = { enable: ko.observable(false),
								distance: ko.observable(50).extend({ numeric: { precision: 0 } }),
								label: ko.observable(false),
								symbol: ko.observable(false),
								maxsizeprop: ko.observable(50).extend({ numeric: { precision: 0 } }),
								maxdataprop: ko.observable(1000).extend({ numeric: { precision: 0 } }) };
				layer.type = type;
				layer.servLayers = getSublayer(item, sendLayers, [], url, layer.fullname, _self, type);

				// knockout checkbox and label binding
				layer.isChecked = ko.observable(false);
				layer.isUse = ko.observable(false);

				// get index of the next group
				if (layer.servLayers.length > 0) {
					index = getIndex(layer.servLayers, 0);
				} else {
					index = layer.id;
				}

				layers.push(layer);
			}

			// update knockout array
			_self.servLayers([]);
			_self.servLayers(layers);

			// update base layer info
			if (category === 'base') {
				_self.selectMapSR(
				_self.srType[gcautFunc.getSrTypeIndex(
				_self.srType,
				sender.spatialReference.wkid)]);

				// if lods is present add the info
				if (typeof sender.tileInfo !== 'undefined') {
					lods = sender.tileInfo.lods;
					lenlods = lods.length;

					while (lenlods--) {
						lods[lenlods].isChecked = ko.observable(true);
					}
					_self.lods(lods);
				}

				_self.maxExtentMinX(fullExt.xmin);
				_self.maxExtentMinY(fullExt.ymin);
				_self.maxExtentMaxX(fullExt.xmax);
				_self.maxExtentMaxY(fullExt.ymax);
				_self.initExtentMinX(initExt.xmin);
				_self.initExtentMinY(initExt.ymin);
				_self.initExtentMaxX(initExt.xmax);
				_self.initExtentMaxY(initExt.ymax);
			}
		};

		getSublayer = function(parent, sendLayers, layers, url, fullname, _self, type) {
			var sublayer = {},
				subLayerIds,
				child,
				childName, childId,
				len;

			// if there is sublayers add them
			subLayerIds = parent.subLayerIds;
			if (subLayerIds !== null) {
				len = subLayerIds.length;
				while (len--) {
					sublayer = {};
					sublayer.servLayers = [];

					// add the child info and push to array
					child = sendLayers[subLayerIds[len]];
					childName = child.name;
					childId = child.id;
					sublayer.name = childName;
					sublayer.fullname = fullname + '***' + childName;
					sublayer.url = url + '/' + childId;
					sublayer.id = childId;
					sublayer.beforebase = ko.observable(false);
					sublayer.scale = { min: child.minScale, max: child.maxScale};
					sublayer.usecluster = ko.observable(false);
					sublayer.cluster = { enable: ko.observable(false),
								distance: ko.observable(50).extend({ numeric: { precision: 0 } }),
								label: ko.observable(false),
								symbol: ko.observable(false),
								maxsizeprop: ko.observable(50).extend({ numeric: { precision: 0 } }),
								maxdataprop: ko.observable(1000).extend({ numeric: { precision: 0 } })
							};
					sublayer.isChecked = ko.observable(false);
					sublayer.isUse = ko.observable(false);
					sublayer.type = type;
					layers.push(sublayer);

					// call the same function to know if there is child within the child sublayers array to add to
					getSublayer(child,
							sendLayers,
							layers[layers.length - 1].servLayers,
							url,
							sublayer.fullname,
							_self,
							type);
				}
			}

			return layers;
		};

		getIndex = function(arr, id) {
			var val,
				len,
				layers;

			if (arr.length > 0) {
				len = arr.length;
				while (len--) {
					layers = arr[len].servLayers;
					if (layers.length > 0) {
						val = getIndex(layers, id);
						id = (val > id) ? val : id;
					} else {
						val = arr[len].id;
						id = (val > id) ? val : id;
					}
				}
			}

			return id;
		};

		return {
			readInfo: readInfo
		};
	});
}());
