/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: @gcaut.version@
 *
 */
var vmObject = {};      // Object the contains the ViewModels
(function() {
	'use strict';
	var mapsTotal,      // Total number of maps
        mapNum;         // Current map number

    define(['jquery',
        'knockout',
        'accessibletabs',
        'syncheight',
        'gcaut-headerV',
        'gcaut-defineMapContentV',
        'gcaut-i18n'],
    function($, ko, at, sh, header, defineMapContent, i18n) {
		var addMapEvent,
            deleteMapEvent,
            initialize,
            execConfig,
            openConfig,
            readConfig,
            restoreMapEvent,
            saveConfig;

		/*
         *  initialize the GCaut application
		 */
		initialize = function() {
			
            if (navigator.userAgent.indexOf("MSIE") !== -1) {
                var pos6 = navigator.userAgent.indexOf("MSIE 6.0");
                var pos7 = navigator.userAgent.indexOf("MSIE 7.0");
                var pos8 = navigator.userAgent.indexOf("MSIE 8.0");
                var pos9 = navigator.userAgent.indexOf("MSIE 9.0");
                if ((pos6 !== -1) || (pos7 !== -1) || (pos8 !== -1) || (pos9 !== -1)) {
                    alert("You are using IE 9 or less. Use a real browser!!!");
                }
            } else {
                // // Display the header
                // var $gcvMain = $('#gcvMain');
                // var html = '';
                // html  = '<div id="divHeader" class="gcvHeader">';
                // html += '  <div class="gcvMargLeft10"><h1 id="h1Title"><img src="distgcv/images/geocanaut.png" alt="GeoCanAut logo" class="gcvLogo gcvMargBottom0 gcvPlus10" />'+i18n.getDict('%titlestring')+'<img src="distgcv/images/geocanviz.gif" alt="GeoCanViz logo" class="gcvLogo gcvMargBottom0 gcvPlus10" /></h1></div>';
                // html += '</div>';
                // html += '<div id="divMapConfigs">';
                // html += '   <div id="0" class="gcviz" data-gcviz="templates/default.json"></div>';
                // html += '</div>';
                // html += '<div id="divMapSelection">';
                // html += '</div>';
                // // Define the buttons
                // html += '  <div class="gcvMargTop10">';
                // html += '    <span>';
                // html += '      <label id="lblMapNum">'+i18n.getDict('%definemap')+'</label>';
                // html += '      <select id="selMap">';
                // html += '        <option value="0">0</option>';
                // html += '      </select>';
                // html += '      <span id="spnAddMap" class="gcvMargLeft10 gcvMargTop10">';
                // html += '        <a href="#" id="aAddMap" onclick="JavaScript:addMapEvent();" title="'+i18n.getDict('%addmap')+'" class="gcvbutton">';
                // html += '          <img src="distgcv/images/add.png" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                // html += '          <span class="gcvimgText">'+i18n.getDict('%addmap')+'</span>';
                // html += '        </a>';
                // html += '      </span>';
                // html += '      <span id="spnDelMap" class="gcvMargLeft10 gcvMargTop10">';
                // html += '        <a href="#" id="aDelMap" onclick="JavaScript:deleteMapEvent(0);" title="'+i18n.getDict('%removemap')+'" class="gcvbutton">';
                // html += '          <img src="distgcv/images/delete.gif" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                // html += '          <span class="gcvimgText">'+i18n.getDict('%removemap')+'</span>';
                // html += '        </a>';
                // html += '      </span>';
                // html += '      <span id="spnResMap" class="gcvMargLeft10 gcvMargTop10 gcvHidden">';
                // html += '        <a href="#" id="aResMap" onclick="JavaScript:restoreMapEvent(0);" title="'+i18n.getDict('%restoremap')+'" class="gcvbutton">';
                // html += '          <img src="distgcv/images/undo.gif" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                // html += '          <span class="gcvimgText">'+i18n.getDict('%restoremap')+'</span>';
                // html += '        </a>';
                // html += '      </span>';
                // html += '    </span>';
                // html += '  </div>';
// 
                // $gcvMain.html(html);
                
                var maps = $('.gcviz');
                var mapElem;
                var len = maps.length;
                // initialize map number and total
                mapsTotal = len;
                mapNum = 0;
                
                // initialize header V/VM
                header.initialize(0);
                
                // Loop for all maps
                while (len--) {
                    mapElem = maps[len];
                    // read the config file
                    readConfig(mapElem);
                }
            }

		};

        /*
         *  read configuration file and start execution
         */
        readConfig = function(mapElem) {
                var mapid = mapElem.getAttribute('id');
                // create an empty map section
                var html = '';
                html  = '<section id="secMap'+mapid+'">';
                // Define the config file
                html += '  <div class="gcvMargTop10">';
                html += '    <div style="display:inline;">';
                html += '      <label for="lblProjectName" style="display:inline;">'+i18n.getDict('%projectname')+'</label>';
                html += '      <input id="inProjectName" class="gcvProjName" accept="text/js" title="'+i18n.getDict('%nameconfig')+'" value="'+i18n.getDict('%nameconfig')+'" style="display:inline;" />';
                html += '      <input type="file" id="file1" style="display:none" accept="text/json">';
                html += '    </div>';
                html += '    <a href="#" id="aOpenProject" onclick="Javascript:openConfig();" title="'+i18n.getDict('%openconfig')+'" class="gcvbutton" style="display:inline;">';
                html += '      <img src="distgcv/images/folder_find.png" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                html += '      <span class="gcvimgText">'+i18n.getDict('%openfile')+'</span>';
                html += '    </a>';
                html += '    <a href="#" id="aSaveProject" onclick="Javascript:saveConfig();" title="'+i18n.getDict('%saveconfig')+'" class="gcvbutton gcvMargLeft10" style="display:inline;">';
                html += '      <img src="distgcv/images/save.gif" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                html += '      <span class="gcvimgText">'+i18n.getDict('%save')+'</span>';
                html += '    </a>';
                html += '  </div>';
                // Add the tabs section
                html += '  <div id="divLvl1TabsMap' + mapid + '" class="tabs">';
                html += '   <div id="divLvl1TabMapDef' + mapid + '" class="tabbody">';
                html += '     <h2>'+i18n.getDict('%map')+'&nbsp;</h2>';
                html += '     <section id="secMapTab' + mapid + '">';
                html += '     </section>';
                html += '   </div>';
                html += '   <div id="divLvl1TabInsets' + mapid + '" class="tabbody">';
                html += '     <h2>'+i18n.getDict('%inset')+'&nbsp;</h2>';
                html += '     <section id="secInsetTab' + mapid + '">';
                html += '     </section>';
                html += '   </div>';
                html += '   <div id="divLvl1TabHeader' + mapid + '" class="tabbody">';
                html += '     <h2>'+i18n.getDict('%header')+'&nbsp;</h2>';
                html += '     <section id="secHeaderTab' + mapid + '">';
                html += '     </section>';
                html += '   </div>';
                html += '   <div id="divLvl1TabToolbars' + mapid + '" class="tabbody">';
                html += '     <h2>'+i18n.getDict('%toolbars')+'</h2>';
                html += '     <section id="secToolbarsTab' + mapid + '">';
                html += '     </section>';
                html += '   </div>';
                html += '   <div id="divLvl1TabFooter' + mapid + '" class="tabbody">';
                html += '     <h2>'+i18n.getDict('%footer')+'</h2>';
                html += '     <section id="secFooterTab' + mapid + '">';
                html += '     </section>';
                html += '   </div>';
                html += '  </div>';
                html += '</section>';
                // Add the html to the page
                var $gcvMain = $('#gcvMain');
                $gcvMain.append(html);
                // Initialize the tabs
                var myt = "#divLvl1TabsMap" + mapid;
                var thetabs = $(myt);
                thetabs.accessibleTabs();
                thetabs.accessibleTabs({
                    tabhead:'h2',
                    tabbody: '.tabbody',
                    fx:"fadeIn",
                    currentInfoText: ""
                });
                // ajax call to get the config file info
                $.support.cors = true; // force cross-site scripting for IE9
                $.ajax({
                        url: mapElem.getAttribute('data-gcviz'),
                        crossDomain: true,
                        dataType: 'json',
                        async: false,                                        
                        success: function(config) {
                                // add the id of the map
                                config.gcviz.mapframe.id = mapElem.getAttribute('id');
                                // Execute using config file
                                execConfig(mapElem, config.gcviz);
                                console.log('config file read');
                        },
                        error: function() {
                                console.log('error loading config file');
                        }
                }); // end ajax
        };
        
        /*
         * Add a map event
         */
//        addMapEvent = function() {
//            var $divMapConfigs = $('#divMapConfigs');
//            var $selMap = $('#selMap');
//            var html = '';
//            mapNum = mapNum + 1;
//            html = '   <div id="'+mapNum+'" class="gcviz" data-gcviz="templates/default.json"></div>';
//            $divMapConfigs.append(html);
//            html = '        <option value="'+mapNum+'" selected>'+mapNum+'</option>';
//            $selMap.append(html);
//            var mapElem = $('#'+mapNum);
//            readConfig(mapElem);
//        };
        
        /*
         * Delete a map event
         */
//        deleteMapEvent = function(id) {
            
//        };
        
        /*
         * Restore a map event
         */
//        restoreMapEvent = function(id) {
            
//        };
        
        /*
         * open a configuration file
         */
        openConfig = function() {
            
        };
        
        /*
         * save a configuration file
         */
        saveConfig = function() {
            
        };

        /*
         *  execute the configuration file
         */
        execConfig = function(mapElem, config) {
                var $mapSection,
                        $mapElem = $(mapElem),
                        mapid = config.mapframe.id
                 
                // create section around map. This way we can bind Knockout to the section
                $mapElem.wrap('<section id="sec' + mapid + '" class="gcviz-section" role="map">');
                $mapSection = $(document).find('#' + mapid);
                
                // extend the section with configuration file info
                $.extend($mapSection, config);
// 
                // // create map and add layers (save result in the mapArray)
                // mapArray[mapid] = map.initialize($mapSection);
                // mapArray[mapid].reverse();
                
                defineMapContent.initialize(mapid);
                
                // // add main toolbar and footer
                // vmArray[mapid] = {};
                // vmArray[mapid].tbmain = toolbarmain.initialize($mapSection);
                // vmArray[mapid].tbfoot = toolbarfoot.initialize($mapSection);
//                 
                // // add annotation toolbar
                // if (config.toolbaranno.enable) {
                        // toolbaranno.initialize($mapSection);
                // }
//                 
                // // add navigation toolbar
                // if (config.toolbarnav.enable) {
                        // toolbarnav.initialize($mapSection);
                // }
//                 
                // // add inset
                // if (config.insetframe.enable) {
                        // vmArray[mapid].insets = inset.initialize($mapSection);
                // }
//                                 
                // mapsNum += 1;
//                 
                // if (mapsNum === mapsTotal) {
                        // // if all maps are there, trigger the ready event
                        // $.event.trigger('gcviz-ready');
//                         
                        // // set the resize event
                        // window.onresize = func.debounce(function (evt) {
// 
                        // }, 500, false);
                // }
        };
		
		return {
//            addMapEvent: addMapEvent,
//            deleteMapEvent: deleteMapEvent,
//            restoreMapEvent: restoreMapEvent,
            initialize: initialize,
            openConfig: openConfig,
            saveConfig: saveConfig
		};
	});
}).call(this);