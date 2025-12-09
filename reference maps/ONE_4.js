// ==================================================
// PLEASE SCROLL DOWN TO "CODE SNIPPET TO PASTE"
// TO PASTE THE CODE SNIPPET IN THE WORKFLOW SCRIPT:
// Step_02_Collect_and_Export_Samples in the 
// appropriate place
//===================================================
// ONE map to IOLN legend conversion
//===================================================
//  1: agri_hiBiomass → 369 : 3.2. Perenial Agro-forestry (36) 
//                           + 3.3 Forest Plantation (9)  
//                           = 369 - #ad6d8f (created color)
//  2: agri_loBiomass → 19  : 3.1. Annual & Seasonal Agricultural Crops - #C27BA0
//  3: bare           → 25  : 4.5. Other (Bare earth, rocky areas -#db4d4f
//  4: built          → 24  : 4.1. Built up (urban, linear infra) - #d4271e
//  5: dune           → 23  : 4.3. Sand dunes - #ffa07a
//  6: forest         → 0   : not considered - masked
//  7: ravine         → 13  : 2. 5. Other H&S (Ravines and other H&S) - #ffffff,
//  8: saline         → 13  : 2. 5. Other H&S (Ravines and other H&S) - #ffffff,
//  9: savanna_open   → 12  : 2.1. Grassland - #d6bc74 - (NOTE: semi-arid and maybe peninsular montane only)
// 10: savanna_shrub  → 66  : 2.3 Scrubs - #a89358
// 11: savanna_woodland → 0: not considered - masked
// 12: water_wetland  →  0  : 'not considered - masked

// ONEs original legend:
// https://github.com/openlandcover

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
// *0 is the demo region. Update and replace it by id of your region*
var region_id = 0; 

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
// Load original ONE map
var indiaONE = ee.Image("projects/ee-open-natural-ecosystems/assets/publish/onesWith7Classes/landcover_hier")
                .select(['l2LabelNum']);

// Remap values
var fromList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var toList   = [369, 19, 25, 24, 23, 0, 13, 13, 12, 66, 0, 0];

var paletteRemap = [
  '#ad6d8f', '#C27BA0', '#db4d4f', "#d4271e", "#ffa07a",
  "#3D3D3D", "#ffffff", "#ffffff", "#d6bc74", "#a89358",
  "#3D3D3D", '#3D3D3D'
];

// Create remapped band
var OneRemap = indiaONE.remap({
  from: fromList,
  to: toList,
  defaultValue: 0
}).rename('iolnLegend');

// Visualization index (1–12)
var visIndex = indiaONE.rename('visIndex');

// Combine both bands
var imageToMap = visIndex.addBands(OneRemap);

var mask = OneRemap.neq(0);
var imageMasked = imageToMap.updateMask(mask);

// Add masked layer
Map.addLayer(
  imageMasked.clip(geometry),
  {bands: ['visIndex'], min: 1, max: 12, palette: paletteRemap},
  'Remapped ONE map', 0
);

//==========END OF CODE SNIPPET TO PASTE IN WORKFLOW====================

// =======================================================
// 2. * OPTIONAL: Add legend for the remapped map
// =======================================================
var legendDict = {
  '2.1 Grassland (12)': '#d6bc74',
  '2.3 Scrubs (66)': '#a89358',
  '2.5. Other H&S (13)': '#ffffff',
  '3.1 Annual & Seasonal Crops (19)': '#C27BA0',
  '3.2 + 3.3 Agro-forestry / Forest Plantation (369)': '#ad6d8f',
  '4.1 Built-up (24)': '#d4271e',
  '4.3 Sand dunes (23)': '#ffa07a',
  '4.5 Bare earth, rocky areas (25)': '#db4d4f',  
};

// Create legend
// Set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

// Create legend title
var legendTitle = ui.Label({
  value: 'ONE map in IOLN legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});

// Add the title to the panel
legend.add(legendTitle);


// Add legend to map
Map.add(legend);

// Function to add each legend row
function makeRow(color, label) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  var description = ui.Label({
    value: label,
    style: { margin: '0 0 4px 6px' }
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
}

// Add each dictionary entry to legend
Object.keys(legendDict).forEach(function(label) {
  var color = legendDict[label];
  legend.add(makeRow(color, label));
});

// =======================================================
// 3. * OPTIONAL : Visualisation of the original data *
// Code obtained from:
// https://code.earthengine.google.co.in/02585ca79a284e0be81441c24f8653a7
// ================================================
// Please uncomment these lines in order to see the original data visualised

// // Original mapping:
// var one12Class = {bands:['l2LabelNum'], min:1, max:12, palette: [
//     "purple", "lightpink", "beige", "red", "khaki", "darkgreen", 
//     "fuchsia", "lightsteelblue", "yellow", "goldenrod", "greenyellow", "black"
//     ]};
// Map.addLayer(indiaONE, one12Class, "Original ONEs", false); 

// //No legend added for the original map as it is not really needed


