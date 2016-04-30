// DATA variables - Will be used to the save the loaded CSV data
var DBData = [];
var MigrationData = [];
var CorruptionData = [];
var LifeExpectancyData = [];

// SELECTION variables (super-global)
var country = "AFG";
var year;
var metrics = "corruption";
var choroplethMetric = "db";
var migrationYear;
var countries;

//Global variable to store data
var DoingBiz = [];
//Global variable to store corruption data
var le_corruption_nm = [];
//Global variable to store world flag data
var flag_al2_3 = [];
//Global variable to store Sankey variable
var sankeychart;

// Load data simultaneously
queue()
    .defer(d3.csv, "data/Doing_Business.csv")
    .defer(d3.csv, "data/Net_migration.csv")
    .defer(d3.csv, "data/Corruption.csv")
    .defer(d3.csv, "data/Life_expectancy.csv")
    .defer(d3.csv, "data/DoingBusiness.csv")
    .defer(d3.csv, "data/le_corruption_nm.csv")
    .defer(d3.csv, "data/worldflag_alpha2_alpha3.csv")
    .await(loadData);

// Assign the loaded data values to local storage variables
function loadData(error, data1, data2, data3, data4, data5, data6, data7) {
    if (error) console.log(error);
    else {
        // Doing Business data
        data1.forEach(function (d) {
            d.Calendar_Year = +d.Calendar_Year;
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
            d.CY2007 = parseInt(d.CY2007);
            d.CY2012 = parseInt(d.CY2012);
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
            for (i=2003; i<2015; i++) {
                var j = "CY" + i;
                if (d[j] == 0)
                    d[j] = "undefined";
                else d[j] = +d[j];
            }
        });
        LifeExpectancyData = data4;

        data5.forEach(function (d, i) {
            //Convert data and store it in item variable
            var item = {
                source: d.Indicator,
                ccode: d.CCODE,
                inddesc: d.IndicatorDescription,
                dbyear: d.DBYEAR,
                year: +d.CAL_YEAR,
                target: d.Economy,
                values: +d.value
            };
            //Push data to Global variable
            DoingBiz.push(item);
        });

        //Get corruption data and store it in global variable
        data6.forEach(function (d, i) {
            var item = {countryname: d.country_name,ccode: d.country_code,year: +d.year, trans_rank: d.trans_rank, life_expectancy: d.life_expectancy,net_migration: +d.net_migration};
            le_corruption_nm.push(item);
        });
        //Get corruption data and store it in global variable
        data7.forEach(function (d, i) {
            var item = {country: d.country,alpha2: d.alpha2,alpha3: d.alpha3};
            flag_al2_3.push(item);
        });

        //test();

        drawReportCard(DBData,DoingBiz,le_corruption_nm,flag_al2_3);

        drawScatter(DBData, MigrationData, CorruptionData, LifeExpectancyData);

        // Call choropleth
        //drawChoropleth(DBData);

        updateDescriptionReportCard();
    }
}

function populateDatepicker() {
    // Fill up the dropdown lists with years that are available for both Ease of Doing Business AND the filterMetric

    var availableYears = [];
    var yearDropdown = document.getElementById("metricYear");

    // Clear out the old dropdown
    for(var k=yearDropdown.options.length-1; k>=0; k--) {
        yearDropdown.remove(k);
    }

    // Depending on the data source, update the second metric data and the available years
    switch(d3.select("#dataFilter").property("value")) {
        case "DoingBusinessData":
            availableYears = ["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014", "2015"];
            break;
        case "LifeExpectancyData":
            availableYears = ["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014"];
            break;
        case "CorruptionData":
            availableYears = ["2012","2013","2014","2015"];
            break;
        case "MigrationData":
            availableYears = ["2007","2012"];
            break;
    }

    var formatToYear = d3.time.format("%Y");

    // This will create a dropdown with years
    for(var i = 0; i < availableYears.length; i++) {
        var el = document.createElement("option");
        el.textContent = availableYears[i];
        var opt = new Date("01-01-"+availableYears[i]);
        el.value = opt;
        yearDropdown.appendChild(el);
    }

    if (d3.select("#dataFilter").property("value") == "DoingBusinessData") {
        // User selected doing biz (skip scatter plot generation)
        //console.log("User selected doing biz (skipping scatter plot generation)");
    } else {
        filterWorkingData();
    }

}

function prepGraphs() {
    populateDatepicker();
    updateSelection();
}

function migrationYearFunction() {
    // Define migration year to be used
    if (year > 2009 && year < 2015)
        migrationYear = 'CY2012';
    else if (year < 2010 && year > 2004)
        migrationYear = 'CY2007';
    else migrationYear = 0;
    return migrationYear;
}

// Test if something works :)
function test() {

    // Log data sets to console
    console.log("DB data: ", DBData);
    console.log("Migration data: ", MigrationData);
    console.log("Corruption data: ", CorruptionData);
    console.log("Life Expectancy data: ", LifeExpectancyData);

    // Doing Business data
    for(i=0; i<DBData.length; i++)
    {
            if (DBData[i].Country_Code == country && DBData[i].Calendar_Year == year)
                console.log("DB item:",DBData[i])
    }

    // Migration data
    for(i=0; i<MigrationData.length; i++)
    {
        if (MigrationData[i].Country_Code == country)
            console.log("Migration item:",MigrationData[i])
    }

    // Corruption data
    for(i=0; i<CorruptionData.length; i++)
    {
        if (CorruptionData[i].Country_Code == country)
            console.log("Corruption item:",CorruptionData[i])
    }

    // Life expectancy data
    for(i=0; i<LifeExpectancyData.length; i++)
    {
        if (LifeExpectancyData[i].Country_Code == country)
            console.log("Life expectancy item:",LifeExpectancyData[i])
    }

    // Life expectancy data
    for(i=0; i<LifeExpectancyData.length; i++)
    {
        if (LifeExpectancyData[i].CY2014 == 0)
            console.log("!!!Life expectancy item:",LifeExpectancyData[i])
    }
}

function yearSelected() {
    updateChoropleth();
    if (d3.select("#dataFilter").property("value") == "DoingBusinessData") {
        // User selected doing biz (skip scatter plot generation)
        //console.log("User selected doing biz (skipping scatter plot generation)");
    } else {
        filterWorkingData();
    }
}
