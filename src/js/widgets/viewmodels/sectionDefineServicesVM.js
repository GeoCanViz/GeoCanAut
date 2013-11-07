/*
 *
 * GeoCanAut authoring tool for GeoCanViz / Outil de création pour GéoCanViz
 * https://github.com/GeoCanViz/GeoCanAut/blob/master/License.txt
 *
 */

(function() {
    'use strict';
    define([
        'jquery',
        'jqueryui',
        'knockout',
        'gcaut-i18n',
        'gcaut-addServiceV',
        'gcaut-showMessageV'
    ], function($, jqui, ko, i18n, as, msg) {
        var initialize;
        
          document.getElementById('file1').addEventListener('change', handleFileSelect, false);
          //document.getElementById('inProjectName').addEventListener('change', handleFileSelect, false);
          document.getElementById('inProjectName').addEventListener('change', updateFileName, false);

        function updateFileName() {
          // Only process json files.
          var name = $("#inProjectName").val();
          var ext = name.substring( name.indexOf(".")+1 );
          if (ext !== "json" ) {
              msg.initialize("Must be a JSON file");
          }
        }

        function handleFileSelect(evt) {
            var files = evt.target.files; // FileList object
        
            // Loop through the FileList.
            for (var i = 0, f; f = files[i]; i++) {
            
              // Only process json files.
              if (!f.type.match('application/json')) {
                continue;
              }
            
              var reader = new FileReader();
            
              // Closure to capture the file information.
              reader.onload = readFile(f);
              // Read in the JSON file as a data text.
              reader.readAsText(f);
            }
        }

        function readFile(theFile) {
            return function(e) {
                $("#inProjectName").val(theFile.name);
                var data = JSON.parse(e.target.result);
                //alert(theFile.name);
                //alert("Show I read JSON file. Value of mousecoord=" + data.icanmap.controls.mousecoord);
                msg.initialize("Show I read JSON file. Value of mousecoord=" + data.icanmap.controls.mousecoord);


// Do something with the data here...
                
            };
        }

        $( "#divSelectService" ).dialog({
            autoOpen: false,
            closeText: i18n.getDict('%close'),
            modal: true,
            title: i18n.getDict('%selectservice2'),
            width: 400,
            show: {
                effect: "fade",
                duration: 700
            },
            hide: {
                effect: "fade",
                duration: 500
            },
            buttons: [
                {
                    text: "Ok",
                    title: "Ok",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                },
                {
                    text: i18n.getDict('%cancel'),
                    title: i18n.getDict('%cancel'),
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });

    
        var ServiceType = function(type){
            this.type = type;
        };
    
        var Server = function(name, url){
            this.name = name;
            this.url = url;
        };
        
        var Layer = function(name,url,type){
            this.name = name;
            this.url = url;
            this.type = type;
        };
        
        function showSection(sectionno) {
            switch(sectionno){
                case 0:
                    $("#secDefineServices").fadeIn( "slow" );
                    $("#gcvPrevious").removeClass('gcvbutton gcvbutton135 gcvbuttonImage gcvgrey gcvHeight40 gcvShow');
                    $("#gcvPrevious").addClass('gcvHidden');
                    $("#gcvNext").removeClass('gcvHidden');
                    $("#gcvNext").addClass('gcvbutton gcvbutton135 gcvbuttonImage gcvgrey gcvHeight40 gcvShow');
                    break;
                case 1:
                    $("#secArrangeServices").fadeIn( "slow" );
                    $("#gcvPrevious").removeClass('gcvHidden');
                    $("#gcvPrevious").addClass('gcvbutton gcvbutton135 gcvbuttonImage gcvgrey gcvHeight40 gcvShow');
                    $("#gcvNext").removeClass('gcvHidden');
                    $("#gcvNext").addClass('gcvbutton gcvbutton135 gcvbuttonImage gcvgrey gcvHeight40 gcvShow');
                    break;
                    
                // On last section, hide the Next button
            }
        }
        
        function hideSection(sectionno) {
            switch(sectionno){
                case 0:
                    $("#secDefineServices").hide();
                    break;
                case 1:
                    $("#secArrangeServices").hide();
                    break;
                    
                // On last section, hide the Next button
            }
        }
        
        function getServerServices(url){
            alert("i am getting services for server "+url);
            var services = ["service1","service2","service3"];
    //        // http://s-bsc-geoappint.nrn.nrcan.gc.ca/ArcGIS/rest/services?f=pjson
            return services;
        }
        
        initialize = function($section) {

            // data model               
            var sectionDefineServicesVM = function() {
                var _self = this;
                // Get language specific strings
                _self.addsecserv = i18n.getDict('%addsecserv');
                _self.arrangeservices = i18n.getDict('%arrangeservices');
                _self.arrangeservicestext = i18n.getDict('%arrangeservicestext');
                _self.availservices = i18n.getDict('%availservices');
                _self.availlayers = i18n.getDict('%availlayers');
                _self.definemap = i18n.getDict('%definemap') + " #x";
                _self.layer = i18n.getDict('%layer');
                _self.nameconfig = i18n.getDict('%nameconfig');
                _self.nextstep = i18n.getDict('%nextstep');
                _self.open = i18n.getDict('%open');
                _self.openconfig = i18n.getDict('%openconfig');
                _self.orspecify = i18n.getDict('%orspecify');
                _self.picklist = i18n.getDict('%picklist');
                _self.pickprilist = i18n.getDict('%pickprilist');
                _self.pickseclist = i18n.getDict('%pickseclist');
                _self.previousstep = i18n.getDict('%previousstep');
                _self.priservice = i18n.getDict('%pri-serv');
                _self.proceed = i18n.getDict('%proceed');
                _self.projectname = i18n.getDict('%projectname');
                _self.save = i18n.getDict('%save');
                _self.saveconfig = i18n.getDict('%saveconfig');
                _self.secservice = i18n.getDict('%sec-serv');
                _self.selectlayer = i18n.getDict('%selectlayer');
                _self.selectserver = i18n.getDict('%selectserver');
                _self.selectservice = i18n.getDict('%selectservice');
                _self.selecttype = i18n.getDict('%selecttype');
                _self.server = i18n.getDict('%server');
                _self.servicetype = i18n.getDict('%servicetype');
                _self.serviceurl = i18n.getDict('%serviceurl');
                _self.title = i18n.getDict('%title');
                _self.verify = i18n.getDict('%verify');
                
                var currentSection = 0;
                var secServiceCount = 0;

                var type1 = new ServiceType('Dynamic');
                var type2 = new ServiceType('Tiled');
                var type3 = new ServiceType('WMS');
                var type4 = new ServiceType('WMTS');
                _self.serviceTypes = ko.observableArray([type1, type2, type3, type4]);

                var server1 = new Server("Internal ArcGIS Server Base Maps","http://s-bsc-gisint1.nrn.nrcan.gc.ca/ArcGIS/rest/services/BaseMaps?f=pjson");
                var server2 = new Server("External ArcGIS Server Base Maps","http://s-bsc-gisext1.nrcan.gc.ca/ArcGIS/rest/services/BaseMaps?f=pjson");
                _self.servers = ko.observableArray([server1, server2]);
                _self.selectedServer = ko.observable();
                _self.services = ko.observableArray([]);
                _self.selectedService = ko.observable();
                _self.layers = ko.observableArray([]);
                _self.selectedLayer = ko.observable();
                
                //_self.services = ["service1","service2","service3"];
                _self.services = [];
                // Get the list of services for the selected server
//                var theurl = _self.selectedServer().url;
//                var services = getServerServices(theurl);
//                _self.services = ko.computed(function (){
//                        var services = [];
//                        var theurl = _self.selectedServer().url;
//                        if (!_self.selectedServer()) return [];
//                        return getServerServices(theurl);
//                        $.ajax({
//                            url: theurl,
//                            data: ko.toJSON(),
//                            datatype: "json",
//                            contentType: "application/json charset=utf-8",
//                            success: function(data) {
//                                alert("here");
//                            }
//                        });
//                        return services = ["service1","service2","service3"];
//                    }
//                );

                        // http://s-bsc-geoappint.nrn.nrcan.gc.ca/ArcGIS/rest/services/BaseMaps?f=pjson
//                        $.ajax({
//                            url: "http://s-bsc-geoappint.nrn.nrcan.gc.ca/ArcGIS/rest/services?f=pjson",
//                            data: ko.toJSON(),
//                            datatype: "json",
//                            contentType: "application/json charset=utf-8",
//                            success: function(data) {
//                                alert("here");
//                            }
//                        });
                
                // Get the list of services for the selected server
                _self.layers = ko.computed(function() {
                        var layers = [];
                        if (!_self.selectedService()) {return layers;}
                        //return getServiceLayers(selectedServer().url, selectedService);
//                        layers = new Layers(theurl);
//                        $.ajax({
//                            url: theurl,
//                            data: ko.toJSON(),
//                            datatype: "json",
//                            contentType: "application/json charset=utf-8",
//                            success: function(data) {
//                                alert("here");
//                            }
//                        });
                        layers = ["layer1","layer2","layer3"];
                        return layers;
                    }
                );
                
//                _self.updateFileName = function() {
//                  // Only process json files.
//                  if ($("#inProjectName").val().indexOf(".json") === -1 ) {
//                      msg.initialize("Must be a JSON file");
//                  }
//                }
               
               _self.openConfigFile = function() {
                   $("#inProjectName").val("");
                   $("#file1").click();
               };
               
               _self.saveConfigFile = function() {
                   var thefile = $("#inProjectName").val();
                   if ($("#inProjectName").val() === "") {
                       //alert("You must supply a file name");supplyfilename
                       msg.initialize(i18n.getDict('%supplyfilename'));
                   } else {
                       // Save the file
                       //alert("Saving...");
                       msg.initialize("Saving the configuration file...");
                   }
               };
                
                _self.getService = function() {
                    $( "#divSelectService" ).dialog( "open" );
                    //psfl.initialize();
                };
                
                _self.addSecService = function() {
                    secServiceCount = secServiceCount + 1;
                    as.initialize(secServiceCount);
                    
                };
                
                _self.showPreviousSection = function() {
                    // Hide current section
                    hideSection(currentSection);
                    // Show next section
                    currentSection = currentSection - 1;
                    showSection(currentSection);
                };
                
                _self.showNextSection = function() {
                    // Hide current section
                    hideSection(currentSection);
                    // Show next section
                    currentSection = currentSection + 1;
                    showSection(currentSection);
                };

                _self.init = function() {
                    return { controlsDescendantBindings: true };
                };
                
                _self.init();
            };
            ko.applyBindings(new sectionDefineServicesVM($section)); // This makes Knockout work
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);
