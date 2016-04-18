


// SVG drawing area

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");


// Initialize data
//loadData();

// FIFA world cup
var bizData = [];
var lifeData = [];
var selectedYearArray = [];


// Load data simultaneously
queue()
    .defer(d3.csv, "data/Doing_Business.csv")
    .defer(d3.csv, "data/Net_migration.csv")
    .defer(d3.csv, "data/Corruption.csv")
    .defer(d3.csv, "data/Life_expectancy.csv")
    .await(loadData);

// Assign the loaded data values to local storage variables
function loadData(error, data1, data2, data3, data4) {
    if (error) console.log(error);
    else {
        // Doing Business data
        data1.forEach(function (d) {
            d.Calendar_Year = formatDate.parse(d.Calendar_Year);
            d.Overall_DTF = +d.Overall_DTF;
            d.SB = +d.SB;
            d.DwCP = +d.DwCP;
            d.RP = +d.RP;
            d.GE = +d.GE;
            d.GC = +d.GC;
            d.PMI = +d.PMI;
            d.PT = +d.PT;
            d.TaB = +d.TaB;
            d.EC = +d.EC;
            d.RI = +d.RI;
        });
        DBData = data1;

        // Migration data
        data2.forEach(function (d) {
            d.CY2007 = +d.CY2007;
            d.CY2012 = +d.CY2012;
        });
        MigrationData = data2;

        // Corruption data
        data3.forEach(function (d) {
            d.CY2012 =+d.CY2012;
            d.CY2013 =+d.CY2013;
            d.CY2014 =+d.CY2014;
            d.CY2015 =+d.CY2015;
            d.Transparency_Rank =+d.Transparency_Rank;
        });
        CorruptionData = data3;

        // Life Expectancy data
        data4.forEach(function (d) {
            d.CY2003 =+d.CY2003;
            d.CY2004 =+d.CY2004;
            d.CY2005 =+d.CY2005;
            d.CY2006 =+d.CY2006;
            d.CY2007 =+d.CY2007;
            d.CY2008 =+d.CY2008;
            d.CY2009 =+d.CY2009;
            d.CY2010 =+d.CY2010;
            d.CY2011 =+d.CY2011;
            d.CY2012 =+d.CY2012;
            d.CY2013 =+d.CY2013;
            d.CY2014 =+d.CY2014;
        });
        LifeExpectancyData = data4;

        bizData = d3.nest()
            .key(function(d) { return d.Calendar_Year; })
            .entries(DBData);

        lifeData = d3.nest()
            .key(function(d) { return d.Country_Code; })
            .entries(LifeExpectancyData);

        // Draw the visualization for the first time
        populateDatepicker();
        updateYearArray();
        updateNewVisualization();
    }
}


function populateDatepicker() {
    // Fill up the dropdown lists with years that are available for both Ease of Doing Business AND the filterMetric

    var filterMetric = d3.select("#dataFilter").property("value");

    var formatToYear = d3.time.format("%Y");

    var yearDropdown = document.getElementById("metricYear");

    // This will create a dropdown with 2003-2014
    for(var i = 2003; i < 2015; i++) {
        var opt = new Date("01-01-"+i);
        var el = document.createElement("option");
        el.textContent = formatToYear(opt);
        el.value = opt;
        yearDropdown.appendChild(el);
    }

}


function updateYearArray() {
    // We're going to make an easy-to-access array with the combined X and Y data from
    // EoDB and the filterMetric the user chose

    var filterMetric = d3.select("#dataFilter").property("value");

    // Grab the year they picked from the filterMetric date dropdown
    var bizDate = d3.select("#metricYear").property("value");

    selectedYearArray = [];

    // First, we create an array of just the EoDB data from the selected year
    for(var i=0; i<bizData.length; i++) {
        if (bizData[i]['key'] == bizDate) {
            for (var j=0; j<bizData[i]['values'].length; j++) {
                selectedYearArray.push(bizData[i]['values'][j]);
            }
        }
    }

    // Then, we create a new array, sorted by country code
    nestedEoDB = d3.nest()
        .key(function(d) { return d.Country_Code; })
        .entries(selectedYearArray);


    // Finally, we can go through the selected metric and (if there is data that year), add it to the relevant countries

    var formatToYear = d3.time.format("%Y");
    searchYear = "CY" + formatToYear(new Date(bizDate));
    console.log("Searching for year: " + searchYear);

    for (i=0; i<nestedEoDB.length; i++) {
        var deleteMe = true;
        for (j=0; j<lifeData.length; j++) {
            if (nestedEoDB[i]['key'] == lifeData[j]['key']) {
                if (lifeData[j]['values'][0][searchYear] != 0) {
                    deleteMe = false;
                    //console.log(lifeData[j]['key'] + ": " + lifeData[j]['values'][0][searchYear])
                    nestedEoDB[i]['values'][0][filterMetric] = lifeData[j]['values'][0][searchYear];
                }
            }
        }
        // FRASER RETURN TO THIS TO CLEAN UP
        //if (deleteMe = true) {
        //    // If there is no match, remove this element from the array
        //    nestedEoDB[i].pop();
        //}
    }

    // Now we've got a new array, that has combined metrics!

    updateNewVisualization();

}


function updateNewVisualization() {

    var filteredData = selectedYearArray;
    var filterMetric = d3.select("#dataFilter").property("value");

    var selectedOption = d3.select("#dataFilter").property("value");

    var max_DTF = d3.max(selectedYearArray, function(d) {return d.Overall_DTF;	});
    var max_life_expectancy = d3.max(selectedYearArray, function(d) {return d[filterMetric];	});

    console.log("Max DTF value: " + max_DTF);
    console.log("Max life expectancy: " + max_life_expectancy);

    /* Render the scales based on the new data */
    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, max_DTF]);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, max_life_expectancy]);

    ///* Render the axes based on the new data */
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    /* Render the tips based on the new data */
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>" + d.Economy + "</strong> <span style='color:red'>" + d.Overall_DTF + ", " + d[filterMetric] + "</span>";
        })

    svg.call(tip);

    /* Add the two axes */
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    svg.selectAll(".y.axis")
        .call(yAxis);

    svg.selectAll(".x.axis")
        .call(xAxis);

    var circle = svg.selectAll("circle")
        .data(selectedYearArray);


    circle.enter()
        .append("circle")
        .style("fill", "gray")
        .style("stroke", "black")
        .attr("r", 2.5)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    circle.exit()
        .remove();

    circle
        .transition()
        .duration(1500)
        .attr("cx", function(d) {return x(d.Overall_DTF);})
        .attr("cy", function(d) {return y(d[filterMetric]);})
        .attr("r", 3);

}