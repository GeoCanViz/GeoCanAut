/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: v0.0.1-development Build: 2014-03-31- 10:11 AM
 *
 */
(function(){var f,a,b=window.location.toString(),e,g="en-min";if((b.search(/_f\.htm/)>-1)||(b.search(/-fra\./)>-1)||(b.search(/-fr\./)>-1)||(b.search(/lang=fra/)>-1)||(b.search(/lang=fr/)>-1)){g="fr-min"}else{if((b.search(/_e\.htm/)>-1)||(b.search(/-eng\./)>-1)||(b.search(/-en\./)>-1)||(b.search(/lang=eng/)>-1)||(b.search(/lang=en/)>-1)){g="en-min"}else{console.log("language not set, English by default")}}f=document.getElementsByTagName("meta"),a=f.length;while(a--){if(f[a].getAttribute("property")==="location"){e=f[a].getAttribute("content")}}if(typeof e==="undefined"){var c=b.search("GeoCanAut");if(c!==-1){e=b.substring(0,b.search("GeoCanAut"))+"GeoCanAut/"}else{if(g==="fr-min"){console.log('Définir le meta paramètre "location" ou mettre le site web dans un répertoire nommé "GeoCanAut"')}else{console.log('Define "location" meta paramter or put web site in a folder called "GeoCanAut"')}}}var d={init:function(){window.browser=this.searchString(this.dataBrowser)||"unknown";window.browserversion=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"unknown"},searchString:function(m){var j,l,k=m.length,h=0;while(k--){j=m[h].string;l=m[h].prop;this.versionSearchString=m[h].versionSearch||m[h].identity;if(j){if(j.indexOf(m[h].subString)!==-1){return m[h].identity}}else{if(l){return m[h].identity}}h++}},searchVersion:function(i){var h=i.indexOf(this.versionSearchString);if(h===-1){return}else{return parseFloat(i.substring(h+this.versionSearchString.length+1))}},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}]};d.init();if(window.browser!=="Explorer"&&window.browser!=="Firefox"&&window.browser!=="Chrome"&&window.browser!=="Safari"){if(g==="en-min"){alert("Browser not suported: needs to be Chrome, Firefox, Safari or Explorer. You will be redirected to Google home page")}else{alert("Navigateur non supporté: le navigateur doit être Chrome, Firefox, Safari ou Explorer. Vous serez redirigé vers la page d'acceuil de Google")}window.location="http://www.google.com/"}else{if(window.browser==="Explorer"&&window.browserversion<=8){if(g==="en-min"){alert("Browser not suported: Explorer needs to be version 9 and higher. Vous serez redirigé vers la page d'acceuil de Google")}else{alert("Navigateur non supporté: Explorer doit être version 9 ou plus. Vous serez redirigé vers la page d'acceuil de Google")}window.location="http://www.google.com/"}}define.amd.jQuery=true;require({async:true,parseOnLoad:false,packages:[{name:"jquery",location:e+"gcaut/dependencies",main:"jquery.min"},{name:"knockout",location:e+"gcaut/dependencies",main:"knockout.min"},{name:"jqueryui",location:e+"gcaut/dependencies",main:"jqueryui.min"},{name:"genfile",location:e+"gcaut/dependencies",main:"generatefile.min"},{name:"gcaut",location:e+"gcaut",main:"gcaut-min"},{name:"gcaut-i18n",location:e+"gcaut/js",main:g},{name:"gcaut-ko",location:e+"gcaut/js/custom",main:"gcaut-ko-binding-min"},{name:"gcaut-func",location:e+"gcaut/js/custom",main:"gcaut-functions-min"},{name:"gcaut-esri",location:e+"gcaut/js/formats",main:"gcaut-esri-min"},{name:"gcaut-gismap",location:e+"gcaut/js/gistasks",main:"gisMapUtility-min"},{name:"gcaut-gisservinfo",location:e+"gcaut/js/gistasks",main:"gisServiceInfo-min"},{name:"gcaut-vm-projheader",location:e+"gcaut/js/viewmodels",main:"projheaderVM-min"},{name:"gcaut-vm-map",location:e+"gcaut/js/viewmodels",main:"mapVM-min"},{name:"gcaut-vm-header",location:e+"gcaut/js/viewmodels",main:"headerVM-min"},{name:"gcaut-vm-footer",location:e+"gcaut/js/viewmodels",main:"footerVM-min"},{name:"gcaut-vm-legend",location:e+"gcaut/js/viewmodels",main:"legendVM-min"},{name:"gcaut-vm-nav",location:e+"gcaut/js/viewmodels",main:"navigationVM-min"},{name:"gcaut-vm-draw",location:e+"gcaut/js/viewmodels",main:"drawVM-min"}]});define("jquery-private",["jquery"],function(i){var h=i.noConflict(true);window.jQuery=!(window.jQuery)?window.$=i:window.jQuery;return h});require(["jquery-private","gcaut"],function(i,h){return i(document).ready(function(){return h.initialize()})})}).call(this);