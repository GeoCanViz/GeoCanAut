(function() {define([], function () {"use strict";var getDict,dict={"%all":"Tous","%lang-code":"fr","%lang-eng":"French","%lang-fra":"franç̤ais","%map":"Carte","%of":"de","%size":"Grandeur","%height":"Hauteur","%width":"Largeur","%minimum":"Minimum","%maximum":"Maximum","%selectItem":"Sélectionner un item...","%expand":"Ouvrir l'outil par défault","%remove":"Supprimer","%refresh":"Rafraîchir","%reset":"Réinitialiser","%msg-configread":"Fichier de configuration lu","%msg-configerr":"Erreur fichier de configuration","%projheader-title":"Création du fichier de configuration","%projheader-newlabel":"Créer ou ouvrir un fichier de configuration","%projheader-savelabel":"Sauvegarder la carte courante","%projheader-tpsavemap":"Sauvegarder la carte dans un fichier local","%projheader-tpnewmap":"Créer une nouvelle carte","%projheader-tpopenmap":"Ouvrir une carte existante","%projheader-tpdeletemap":"Supprimer la carte sélectionnée","%projheader-tprestoremap":"Restorer les cartes","%map-wms":"http://wms.ess-ws.nrcan.gc.ca/wms/toporama_fr?","%map-wmts":"undefined","%map-cacherest":"http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBCT3978/MapServer","%map-dynamicrest":"http://geoappext.nrcan.gc.ca/arcgis/rest/services/GSCC/Geochronology/MapServer;http://maps.ottawa.ca/ArcGIS/rest/services/CyclingMap/MapServer;http://apps.geomatics.gov.nt.ca/arcgis/rest/services/GNWT/BiologicEcologic_LCC/MapServer","%map-link":"Carte liée","%map-lods":"Niveau de détails","%map-level":"Niveau ","%map-resolution":"Résolution","%map-basemap":"Ajouter une carte de base","%map-spatialref":"Référence spatiale ","%map-urlGeomServer":"URL du serveur de géometrie ","%map-setextent":"Définir l'étendue","%map-extentmax":"Étendue maximale","%map-extentinit":"Étendue initiale","%map-extentminx":"Minimum X","%map-extentminy":"Minimum Y","%map-extentmaxx":"Maximum X","%map-extentmaxy":"Maximum Y","%map-layertype":"Selectionner le type de couverture ","%map-layerurl":"Entrer le URI ","%map-layersuccess":"La couverture est valide! ","%map-layererror":"La couverture n'est pas valide!","%map-scale":"Échelle","%map-addlayer":"Ajouter une couverture","%map-sr":"2294 - ATS77 / MTM Nouvelle-écosse zone 4;2295 - ATS77 / MTM Nouvelle-écosse zone 5;3395 - WGS84 / Mondiale de Mercator;3400 - NAD83 / Alberta 10-TM (Forêt);3401 - NAD83 / Alberta 10-TM (Ressource);3857 - RNCan;3978 - RNCan;4269 - NAD83;4326 - WGS84 (World Geodesic Datum);26707 - NAD27 / UTM zone 7N;26708 - NAD27 / UTM zone 8N;26709 - NAD27 / UTM zone 9N;26710 - NAD27 / UTM zone 10N;26711 - NAD27 / UTM zone 11N;26712 - NAD27 / UTM zone 12N;26713 - NAD27 / UTM zone 13N;26714 - NAD27 / UTM zone 14N;26715 - NAD27 / UTM zone 15N;26716 - NAD27 / UTM zone 16N;26717 - NAD27 / UTM zone 17N;26718 - NAD27 / UTM zone 18N;26719 - NAD27 / UTM zone 19N;26720 - NAD27 / UTM zone 20N;26721 - NAD27 / UTM zone 21N;26722 - NAD27 / UTM zone 22N;26907 - NAD83 / UTM zone 7N;26908 - NAD83 / UTM zone 8N;26909 - NAD83 / UTM zone 9N;26910 - NAD83 / UTM zone 10N;26911 - NAD83 / UTM zone 11N;26912 - NAD83 / UTM zone 12N;26913 - NAD83 / UTM zone 13N;26914 - NAD83 / UTM zone 14N;26915 - NAD83 / UTM zone 15N;26916 - NAD83 / UTM zone 16N;26917 - NAD83 / UTM zone 17N;26918 - NAD83 / UTM zone 18N;26919 - NAD83 / UTM zone 19N;26920 - NAD83 / UTM zone 20N;26921 - NAD83 / UTM zone 21N;26922 - NAD83 / UTM zone 22N;32181 - NAD83 / MTM zone 1;32182 - NAD83 / MTM zone 2;32183 - NAD83 / MTM zone 3;32184 - NAD83 / MTM zone 4;32185 - NAD83 / MTM zone 5;32186 - NAD83 / MTM zone 6;32187 - NAD83 / MTM zone 7;32188 - NAD83 / MTM zone 8;32189 - NAD83 / MTM zone 9;32190 - NAD83 / MTM zone 10;32191 - NAD83 / MTM zone 11;32192 - NAD83 / MTM zone 12;32193 - NAD83 / MTM zone 13;32194 - NAD83 / MTM zone 14;32195 - NAD83 / MTM zone 15;32196 - NAD83 / MTM zone 16;32197 - NAD83 / MTM zone 17;32198 - NAD83 / Lambert Québec;41001 - WGS84 / Simple Mercator;42101 - LCC;42304 - LCC / Atlas du Canada;53016 - Gall stéréographique sphérique;54003 - cylindrique mondiale de Miller;54004 - mondiale de Mercator;54008 - sinusoïdale mondiale;54009 - mondiale de Mollweide;54016 - Gall stéréographique mondiale;54030 - mondiale de Robinson;102008 - projection nord-américaine d'Albers;102009 - conique conforme de Lambert nord-américaine;102016 - Équidistante azimutale polaire;102017 - azimutale Équivalente de Lambert polaire;102018 - polaire stéréographique;102184 - NAD83 / Alberta 10-TM (Forêt) (ESRI);102185 - NAD83 / Alberta 10-TM (Ressource) (ESRI);900913 - Google Mercator sphérique","%header-mapname":"Nom de la carte","%header-lblbutton":"Activer les boutons de l'en-tête","%header-tools":"Outils ","%header-about":"A propos ","%header-abouttype":"Type du a propos ","%header-abouttypelist":"Texte;PDF","%header-aboutvalue":"Valeur du a propos ","%header-print":"Imprimer ","%header-printtype":"Type d'impression","%header-printtypelist":"Simple;Avancé","%header-inset":"Afficher les insertions ","%header-fullscreen":"Mode plein écran  ","%footer-arrow":"Flèche du nord ","%footer-arrowSR":"Référence spatiale en entrée","%footer-mouse":"Coordonnées de la souris ","%footer-mouseSR":"Référence spatiale en sortie","%draw-enable":"Afficher la barre d'outil dessiner ","%draw-line":"Dessiner lignes","%draw-text":"Dessiner du texte","%draw-measure":"Mesurer","%draw-measuretype":"Type de mesure","%draw-measuretypelist":"longueur;surface;complet","%draw-measureunit":"Unitées de mesure ","%draw-measureunitlist":"km;mille ","%draw-file":"Importer et exporter des fichiers","%nav-enable":"Afficher la barre d'outil navigation","%nav-zoom":"Zoom à l'étendue maximale ","%nav-geoloc":"Zoom selon la géolocalisation ","%nav-scalebar":"Afficher la barre d'échelle ","%nav-scalebarunit":"Unitées de la barre d'échelle","%nav-scalebarlist":"km;mille ","%nav-scale":"Afficher l'échelle ","%nav-scaleformat":"Format de l'échelle ","%nav-scalelist":"Standard","%nav-over":"Afficher la carte généralle ","%nav-urlover":"Entrer le URI ","%legend-enable":"Afficher la barre d'outil légende ","%legend-expand":"Ouvrir par défault","%legend-label":"Étiquette ","%legend-metadata":"Activer les métadonnées  ","%legend-metaurl":"URI ","%legend-metatext":"Texte ","%legend-opacity":"Activer l'opacité ","%legend-visibility":"Activer la visibilité ","%legend-visibilitystate":"Visible par défault ","%legend-visibilitytype":"Type ","%legend-visibilitytypelist":"case;radio","%legend-visibilityradioid":"Id du groupe radio ","%legend-displaychild":"Afficher les enfants ","%legend-customimage":"Image personnalisée ","%legend-customimageurl":"URI ","%legend-customimagetext":"Texte alternatif ",}; getDict = function(val) {return dict[val];};return {getDict: getDict};});}).call(this);