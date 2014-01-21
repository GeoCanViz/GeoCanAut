/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * GIS service functions
 * http://resources.esri.com/help/9.3/arcgisserver/apis/javascript/ve/help/Getting%20Started/DiscoverMapServices.htm
 */
/* global esri: false */
(function () {
	'use strict';
	define(['jquery-private',
			'gcaut-i18n'
			], function($aut, i18n) {
	
		var getResourceInfo,
		restRequest,
			servicesText,
			folderCount = 0,
			totalFolders = 0,
			folders = null;
		
		getResourceInfo = function(url) {
			var agisve_services = new ESRI.ArcGIS.VE.ArcGISLayerFactory();
			agisve_services.GetResourceInfo(url, showResourceInfo);
		};
		
		function showResourceInfo(sender, data) {
			var resourceInfo = (data!=null) ? data : sender;            
			addServicesInfo(resourceInfo.services);
		
			folders = resourceInfo.folders;
			totalFolders = folders.length; 
			folderCount = 0;
		
			if (totalFolders>0) {
				var url = serviceUrl + "/" + folders[0];
				restRequest(url, getFolderInfo);  
			} else {
				showAll(); 
			}       
		};
        
		function getFolderInfo(sender, data) {
			if (data==null) data = sender;
			addServicesInfo(data.services);

			folderCount++;
			if (folderCount<totalFolders) {
				var url = serviceUrl + "/" + folders[folderCount]; 
				restRequest(url, getFolderInfo);   
            } else {
				showAll(); 
			}  
		};

		function addServicesInfo(serviceArray) {
			for (var i=0;i<serviceArray.length;i++) { 
				var service = serviceArray[i];
				if (service.type=="MapServer") {
					servicesText += "<b>" + service.name + "</b> (" + service.type + ")<br/> URL: "  + serviceUrl + "/" + service.name + "<br />";
				}
            }
		};
        
        restRequest = function(url, callback) {
            var request = new ESRI.ArcGIS.VE.RestRequest();
            request.Send(url, callback);
            return false;   
        };
        
		return {
			getResourceInfo: getResourceInfo,
			restRequest: restRequest
		};
	});
}());
