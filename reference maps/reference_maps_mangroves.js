// ==================================================
// PLEASE SCROLL DOWN TO "CODE SNIPPET TO PASTE"
// TO PASTE THE CODE SNIPPET IN THE WORKFLOW SCRIPT:
// Step_02_Collect_and_Export_Samples in the 
// appropriate place
//===================================================
// Mangroves map to IOLN legend conversion
//===================================================
//  mangroves → 19  : 1.1  #04381d

// Link to GEE dataset:
// https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_MANGROVE_FORESTS

// IOLN legend;
// https://docs.google.com/spreadsheets/d/1-ELti0qcoLRzAOXtN0EcaEfWp1Ab-8bOEB2Vt97S1sk/edit?usp=drive_link

// The IOLN colour hex coding:
// https://docs.google.com/spreadsheets/d/1_NHsBEo8A0f-iBi7f3vTig9rG788as_H/edit?gid=1970145936#gid=1970145936

// ================================================

//===================================================
// 1. Identify region and geometry
//===================================================

// Path to the regions shapefile. *Asset for India's 7 bio-geographical zones, No changes required*
var regions_asset = 'projects/mapbiomas-india/assets/ioln_classification_regions';

// Region ID to filter classification regions. 
// * 0 is the demo region. Update and replace it by id of your region*
// This would make sense for the coast with region_id = 2
var region_id = 2; 

// ========================
// Load Regions
var regions = ee.FeatureCollection(regions_asset);
var selected_region = regions.filter(ee.Filter.eq('region_id', region_id));
var geometry = selected_region.geometry();
Map.centerObject(geometry);

// Sets center and zoom level for the 12-class maps
Map.setOptions('SATELLITE');

//===================================================
// 2. CODE SNIPPET TO PASTE
//===================================================

var dataset = ee.ImageCollection('LANDSAT/MANGROVE_FORESTS');
var mangrovesVis = {
  min: 0,
  max: 1.0,
  palette: ['#04381d'],
};

// Visualisation of the map 
Map.addLayer(dataset, mangrovesVis, 'Mangroves');

//===================================================



