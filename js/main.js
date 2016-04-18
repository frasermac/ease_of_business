// DATA variables - Will be used to the save the loaded CSV data
var DBData = [];
var MigrationData = [];
var CorruptionData = [];
var LifeExpectancyData = [];

// SELECTION variables (super-global)
var country = "AFG";
var year = 2015;
var metrics = "corruption";

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

        //test();

        // Call choropleth
        drawChoropleth(DBData);
    }
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
}
