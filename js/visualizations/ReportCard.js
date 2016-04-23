/**
 * Created by akulap on 4/15/2016.
 */

//set up graph in same style as original example but empty
//var graph = {"nodes" : [], "links" : []};
var graph = {"nodes" : [], "links" : []};
var DoingBiz = [];
var le_corruption_nm = [];

var data;

//var dbdata;

var sankeychart;


// Start application by loading the data

// Load data simultaneously
queue()
    .defer(d3.csv, "data/DoingBusiness.csv")
    .defer(d3.csv, "data/le_corruption_nm.csv")
    .await(loadData);


// Assign the loaded data values to local storage variables
function loadData(error, data1, data2) {
    if (error) console.log(error);
    else {
        var ranking = d3.select("#ranking-type").property("value");
        var year = d3.select("#year").property("value");

        data1.forEach(function (d, i) {
            //console.log(d);
            var item = {
                source: d.Indicator,
                ccode: d.CCODE,
                inddesc: d.IndicatorDescription,
                dbyear: d.DBYEAR,
                year: +d.CAL_YEAR,
                target: d.Economy,
                values: +d.value
            };
            DoingBiz.push(item);

            if ((d.CCODE == ranking) && (d.CAL_YEAR == year)) {
                graph.nodes.push({"name": d.Indicator});
                graph.nodes.push({"name": d.Economy});
                graph.links.push({
                    source: DoingBiz[i].source,
                    target: DoingBiz[i].target,
                    value: DoingBiz[i].values
                });
            }
        });

        data2.forEach(function (d, i) {
            var item = {countryname: d.country_name,ccode: d.country_code,year: +d.year, trans_rank: d.trans_rank, life_expectancy: d.life_expectancy,net_migration: +d.net_migration};
            le_corruption_nm.push(item);

        });

    }
    createVis();
};


function createVis() {
    // TO-DO: Instantiate visualization objects here
    //console.log(graph);
    sankeychart = new SankeyAreaChart("chart-area", graph);
    //timeline = new Timeline("timeline",allData.years)

}

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

SankeyAreaChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

SankeyAreaChart.prototype.initVis = function(){
    var vis = this;

    //vis.units = "Score";
    vis.units = "";

    vis.odb = "Overall Doing Business score:";

    vis.margin = {top: 80, right: 0, bottom: 60, left: 60};
    vis.width = 600 - vis.margin.left - vis.margin.right;
    vis.height = 600 - vis.margin.top - vis.margin.bottom;

    vis.formatNumber = d3.format(",.0f"),    // zero decimal places
        vis.format = function(d) {
            //     if (d <= 100)  {
            return vis.formatNumber(d) + " " + vis.units;
            //     }
        },
        vis.color = d3.scale.category20();

// append the svg canvas to the page
    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //vis.lsvg = vis.svg.append("g");
    //vis.nsvg = vis.svg.append("g");

// Set the sankey diagram properties
    vis.sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([vis.width, vis.height]);

    vis.path = vis.sankey.link();

    //console.log(vis.path);

    // TO-DO: (Filter, aggregate, modify data)
    vis.wrangleData();
    d3.select("#ranking-type").on("change", function(){
        vis.wrangleData();
    });

    d3.select("#year").on("change", function(){
        vis.wrangleData();
    });

}


/*
 * Data wrangling
 */

SankeyAreaChart.prototype.wrangleData = function(){
    var vis = this;
    vis.ranking = d3.select("#ranking-type").property("value");
    vis.yearsel = d3.select("#year").property("value");

    var newLinks = [];
    var newNodes = [];
    DoingBiz.forEach(function(p, i) {
        if (p.ccode == vis.ranking && p.year == vis.yearsel && p.values >0 && p.source != 'DTF') {
            newLinks.push({
                source: p.inddesc,
                target: p.target,
                value: p.values
            });

            newNodes.push({"name": p.inddesc});
            newNodes.push({"name": p.target});
        }
        else if (p.ccode == vis.ranking && p.year == vis.yearsel && p.source == 'DTF') {
            vis.titledtf = p.values;
            vis.countryname = p.target;
        }
    });
    graph.links = newLinks;
    graph.nodes = newNodes;

    // return only the distinct / unique nodes
    graph.nodes = d3.keys(d3.nest()
        .key(function (d) { return d.name; })
        .map(graph.nodes));

    // loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });

    //now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graph.nodes.forEach(function (d, i) {
        graph.nodes[i] = { "name": d };
    });

    vis.sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    vis.newDetails = [];
    vis.newDetails.push({
        trans_rank: 'Not Available',
        life_expectancy: 'Not Available',
        net_migration: 'Not Available'
    });

    le_corruption_nm.forEach(function(p, i) {
        if (p.ccode == vis.ranking && p.year == vis.yearsel) {
            vis.newDetails = [];
            vis.newDetails.push({
                trans_rank: p.trans_rank,
                life_expectancy: vis.format(p.life_expectancy),
                net_migration: p.net_migration
            });
        }
    });

    //console.log(vis.newDetails);
    vis.updateVis();

}

SankeyAreaChart.prototype.updateVis = function(){
    var vis = this;

    // Sankey title
    var titlelbl = vis.svg.selectAll(".title")
        .data(graph.nodes);

    titlelbl.enter().append("text")
        .attr("class","title");

    titlelbl.attr("x", 0)
        .attr("y", -20)
        .attr("dy", "-.71em")
        .attr("text-anchor", "start")
        .text("Ease of Doing business score for "+ vis.countryname + " in the year "+ vis.yearsel + " is " + vis.titledtf );

    titlelbl.exit().remove();

// Netmigration value
    var netmigration = vis.svg.selectAll(".detail")
        .data(vis.newDetails);

    netmigration.enter().append("text")
        .attr("class","detail");

    netmigration.attr("x", 350)
        .attr("y", 400)
        .attr("dy", "-.71em")
        .attr("text-anchor", "start")
        .text(function(d) {
            return "Net Migration: "+ d.net_migration; });

    netmigration.exit().remove();


// Life expectancy value
    var life_expectancy = vis.svg.selectAll(".lexp")
        .data(vis.newDetails);

    life_expectancy.enter().append("text")
        .attr("class","lexp");

    life_expectancy.attr("x", 350)
        .attr("y", 420)
        .attr("dy", "-.71em")
        .attr("text-anchor", "start")
        .text(function(d) {
            return "Life Expectancy: " + d.life_expectancy; });

    life_expectancy.exit().remove();

    // Life expectancy value
    var corruption = vis.svg.selectAll(".corr")
        .data(vis.newDetails);

    corruption.enter().append("text")
        .attr("class","corr");

    corruption.attr("x", 350)
        .attr("y", 440)
        .attr("dy", "-.71em")
        .attr("text-anchor", "start")
        .text(function(d) {
            return "Transparency Rank: "+ d.trans_rank; });

    corruption.exit().remove();


// add in the links
    var link = vis.svg.selectAll(".link")
        .data(graph.links);

    link.enter().append("path")
        .attr("class", "link");
//update
    link.attr("d", vis.path)
        .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });


    /*
     // add the link titles
     link.enter().append("title")
     .attr("class","lnktitle");

     link.text(function (d) {
     return d.source.name + " → " +
     d.target.name + "\n" + vis.format(d.value);
     });
     */
    /*
     var linklbl = vis.svg.selectAll(".lnklbl")
     .data(graph.links);

     linklbl.enter().append("title")
     .attr("class", "lnklbl");

     linklbl.attr("x", 450)
     .attr("y", function (d) {
     return d.y + d.dy/2;
     })
     .text(function (d) {
     return d.source.name + " → " +
     d.target.name + "\n" + vis.format(d.value);
     });

     linklbl.exit().remove();
     */


//remove
    link.exit().remove();

// add in the nodes
    var node = vis.svg.selectAll(".node")
        .data(graph.nodes);

// add the rectangles for the nodes
    node.enter().append("rect")
        .attr("class", "node");

    node.attr("height", function (d) {
            return d.dy;
        })
        .attr("width", vis.sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = vis.color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

// add title to nodes
    // add in the nodes
    var nodetxt = vis.svg.selectAll(".nodetxt")
        .data(graph.nodes);

    nodetxt.enter().append("text")
        .attr("class", "nodetxt");
    /*
     nodetxt
     .attr("transform", function (d) {
     return "translate(" + d.x + "," + d.y + ")";
     })
     .text(function (d) {
     return d.name + "\n" + vis.format(d.value);
     });
     */
    nodetxt.attr("x", 450)
        .attr("y", function (d) {
            return d.y + d.dy/2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
            if (d.value <=100){
                return d.name+ ": " + vis.format(d.value);
            }
            else {
                return d.name
            }
        })
        .filter(function (d) {
            return d.x < vis.width / 2;
        })
        .attr("x", 6 + vis.sankey.nodeWidth())
        .attr("text-anchor", "start");

    nodetxt.exit().remove();
    //showEdition(vis.newDetails);

    // Show details for a specific FIFA World Cup
    function showEdition(d){
        //imgarea.html('<img src="img/' + d.image + '" width="100%" height="100%">');

        var strHTML = '<table id="report-card" class="table">';
        strHTML += '<col width="10px"/><col width="20px"/>';
        strHTML += '<tr><th colspan="2">' + d.countryname + '</th></tr>';
        strHTML += '<tr><td>Country</td><td>' + d.countryname + ' </td></tr>';
        strHTML += '<tr><td>Life Expectancy</td><td>' + d.life_expectancy + '</td></tr>';
        strHTML += '<tr><td>Net Migration</td><td>' + d.net_migration + '</td></tr>';
        strHTML += '<tr><td>Transparency Rank</td><td>' + d.trans_rank + '</td></tr>';
        vis.svg.html(strHTML);
    }


}
