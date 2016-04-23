/**
 * Created on 4/16/16.
 */
var width = 550,
    height = 310;

var map;

// --> CREATE SVG DRAWING AREA
var svg = d3.select("#choropleth").append("svg")
    .attr("id","choropleth_map")
    .attr("width", width)
    .attr("height", height);

// Initialize projection(mercator)
var projection = d3.geo.mercator()
    .translate([width/2,height/2+60])
    .scale([80]);

// Initialize path based on projection
var path = d3.geo.path()
    .projection(projection);

// Initialize scale for colors in map
var color = d3.scale.quantize()
    .range(["#fef0d9","#fdcc8a","#fc8d59","#d7301f"])
    .domain([100,0]);

// Initialize legend data
var legend;

var legend_data_colors = [
    color.domain()[0],
    (((1.5 * color.domain()[0]) + (0.5 * color.domain()[1])) / 2),
    ((color.domain()[0] + color.domain()[1]) / 2),
    (((0.5 * color.domain()[0]) + (1.5 * color.domain()[1])) / 2)
];

var legend_data_labels = [
    color.domain()[0],
    (((1.5 * color.domain()[0]) + (0.5 * color.domain()[1])) / 2),
    ((color.domain()[0] + color.domain()[1]) / 2),
    (((0.5 * color.domain()[0]) + (1.5 * color.domain()[1])) / 2),
    color.domain()[1]
];

// Load map
// TODO NEED TOPOJSON WITH COUNTRY CODES
d3.json("data/countries.json", function(error, data1) {
    map = topojson.feature(data1, data1.objects.units).features;
    //console.log("MAP: ",map);
});

function drawChoropleth(data) {
    //console.log(data);

    // Draw map
    var countries = d3.select("#choropleth_map");

    countries.selectAll("path")
        .data(map)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "country");

    // Initialize tooltip and define pop-up text
    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        //console.log(d.id); // ISSUE
    });

    // Set actions: show on hover; then remove
    // Fraser / Nadia .. come back to this to re-activate tooltips!
    //countries
    //    .on('mouseover', tip.show)
    //    .on('mouseout', tip.hide);

    svg.call(tip);
    updateChoropleth();
}

function updateChoropleth(){

    // Update data for the legend
    legend_data_colors = 0;
    legend_data_colors = [
        color.domain()[0],
        (((1.5 * color.domain()[0]) + (0.5 * color.domain()[1])) / 2),
        ((color.domain()[0] + color.domain()[1]) / 2),
        (((0.5 * color.domain()[0]) + (1.5 * color.domain()[1])) / 2)
    ];

    legend_data_labels = 0;
    legend_data_labels = [
        color.domain()[0],
        (((1.5 * color.domain()[0]) + (0.5 * color.domain()[1])) / 2),
        ((color.domain()[0] + color.domain()[1]) / 2),
        (((0.5 * color.domain()[0]) + (1.5 * color.domain()[1])) / 2),
        color.domain()[1]
    ];

    // Fill country color based on value of selected criterion
    d3.selectAll(".country")
        .transition()
        .duration(1000)
        .attr("fill", function (d) {
            var value;
            var result = "silver";
            for (i=0;i<DBData.length; i++) {
                if (DBData[i].Country_Code == d.id) {
                    if ((DBData[i].Calendar_Year - year) == 0) {
                        value = DBData[i].Overall_DTF;
                        result = color(value);
                    }

                }
            }
            return result;
        });
}