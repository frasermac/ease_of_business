##Project name:##
BizViz

##Description:##
This website provides a tool for exploring business climate around the world, as well as discovering any potential relationship patterns between ease of doing business, and corruption perception, international migration or life expectancy data.

##Browser requirements:##
Please use Google Chrome for viewing the project, as not all functionality is available in other browsers.

##Location:##
[http://frasermac.github.io/ease_of_business/](http://frasermac.github.io/ease_of_business/)

##Process book:##
/data/Process_book.pdf

##Screencast video:##
_Click to watch_

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/T1EsLqJkTSE/0.jpg)](https://youtu.be/T1EsLqJkTSE)

##Features:##
_Country selection_
- Country can be selected (1) from drop-down menu and (2) by clicking on the map. Selected country is highlighted on the map with a green border, and details for the country are displayed on the right from the map.

_Year selection_
- Years can be selected for the displayed metric (shows on map and the scatter plot below the map), and separately - for the country details on the right from the map. Years are selected in respective drop-down.

_Metric selection_
- Map and the scatter plot support changing of the displayed metric (for the map) and comparator metric (for the scatter plot; doing business data is always basic data set for scatter plot). Metric can be selected in the drop-down menu, and selection will affect both - map and the scatter plot - simultaneously.

_Choropleth_
- Choropleth supports displaying of all 4 metrics (doing business, net migration, corruption perception, and life expectancy), as well as allows used to select displayed year.

_Sankey diagram_
- Sankey diagram provides details on how the overall score of ease of doing business in composed in each country. Additionally, country’s results on net migration, life expectancy and corruption perception are displayed in the text box. The country and the year can be selected by user. 

_Scatter plot_
- The basic (primary) data for the scatter plot is score on ease of doing business. To start scatter plot, the comparator (secondary) metric should be selected from the drop-down menu. This metric can be changed at any time. Displayed year of data can be also selected from the drop-down “Metric Year”.

##Raw files (downloadable zip archive):##
[https://github.com/frasermac/ease_of_business](https://github.com/frasermac/ease_of_business)

##File structure:##
- index.html : web page with the project
- /css : stylesheets
- /data : data sets and objects supporting visualizations
- /img : country flags
- /js : javascript files

_Libraries:_
- /js/bootstrap.min.js
- /js/d3.min.js
- /js/d3.tip.js
- /js/jquery.min.js
- /js/jquery.min.map
- /js/queue.v1.min.js
- /js/topojson.js

_Created javascripts:_
- /js/Choropleth.js - script for choropleth (map)
- /js/main.js - primary script, with global variables, data upload, etc.
- /js/ReportCard.js - script binding choropleth (map) with sankey diagram (country details)
- /js/sankey.js - script for sankey diagram (country details)
- /js/ScatterPlot.js - script for scatter plot
- /js/text.js - script adding/updating text in index.html

_Support files for visualizations:_
- /data/world-110m.json - topojson for choropleth (map); source:[https://gist.github.com/mbostock/4090846](https://gist.github.com/mbostock/4090846) (license: gpl-3.0)
- /data/countries.json - list of countries with ISO 3166-1 Alpha 3 codes (3-letter country codes) used to bind topojson ligatures with country data; source:[https://d3-geomap.github.io/map/choropleth/world/](https://d3-geomap.github.io/map/choropleth/world/) (copyright by Ramiro Gómez)
- /data/worldflag_alpha2_alpha3.csv - list of countries with codes, used for flags in sankey diagram (country details graph); source:[https://github.com/stefangabos/world_countries](https://github.com/stefangabos/world_countries) (copyright by Stefan Gabos)
- /img - images of countries’ flags; source:[https://github.com/stefangabos/world_countries](https://github.com/stefangabos/world_countries) (copyright by Stefan Gabos)

_Data sets:_
- /data/Corruption.csv - data on corruption perception index; source:[transparency.org](http://transparency.org/) 
- /data/Doing_Business.csv - raw data on ease of doing business; source:[doingbusiness.org](http://doingbusiness.org/) 
- /data/DoingBusiness.csv - formatted data on ease of doing business
- /data/le_corruption_nm.csv - integrated data on life expectancy, corruption perception and net migration
- /data/Life_expectancy.csv - data on life expectancy; source:[wdi.worldbank.org](http://wdi.worldbank.org/) 
- /data/Net_migration - data on net migration; source:[data.worldbank.org](http://data.worldbank.org/) 

##Authors:##
- Fraser Macdonald
- Nadiia Novik
- Prabhu Akula
