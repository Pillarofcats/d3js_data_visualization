const urlCounty =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const urlEducation =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let dataCounty;
let dataEducation;
let dataStates;

const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const SVGBOX_HEIGHT = 600 - margin.top - margin.bottom;
const SVGBOX_WIDTH = 1000 - margin.left - margin.right;
const SVGLEGEND_HEIGHT = 600 - margin.top - margin.bottom;
const SVGLEGEND_WIDTH = 300 - margin.left - margin.right;

const legendLabel = "Percentage of Citizens with a Bachelors Degree";
const legendKeys = [
  "0% - 15%",
  "16% - 30%",
  "31% - 45%",
  "46% - 60%",
  "61% - 75%",
  "76% - 90%",
  "91% - 100%",
];
const legendColors = [
  "#d2fbd4",
  "#a5dbc2",
  "#7bbcb0",
  "#559c9e",
  "#3a7c89",
  "#235d72",
  "#123f5a",
];

//Tooltip
let tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "tooltip")
  .style("opacity", 0);

//Svg Box
let svgBox = d3
  .select("#svgBox")
  .append("svg")
  .attr("width", SVGBOX_WIDTH + margin.left + margin.right)
  .attr("height", SVGBOX_HEIGHT + margin.top + margin.bottom)
  .style("background-color", "white")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Svg Legend
let svgLegend = d3
  .select("#legend")
  .append("svg")
  .attr("width", SVGLEGEND_WIDTH + margin.left + margin.right)
  .attr("height", SVGLEGEND_HEIGHT + margin.top + margin.bottom)
  .style("background-color", "white")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Map Render
let mapRender = () => {
  
  svgBox
    .selectAll("path")
    .data(dataCounty)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (dataCountyItem) => {
      //storing geojson county object id data
      let id = dataCountyItem.id;
      //storing education data
      let county = dataEducation.find((item) => {
        return item.fips === id;
      });

      let percent = county.bachelorsOrHigher;
      //#d2fbd4,#a5dbc2,#7bbcb0,#559c9e,#3a7c89,#235d72,#123f5a
      if (percent <= 15) {
        return "#d2fbd4";
      } else if (percent <= 30) {
        return "#a5dbc2";
      } else if (percent <= 45) {
        return "#7bbcb0";
      } else if (percent <= 60) {
        return "#559c9e";
      } else if (percent <= 75) {
        return "#3a7c89";
      } else if (percent <= 90) {
        return "#235d72";
      } else {
        return "#123f5a";
      }
    })
    .attr("data-fips", (dataCountyItem) => {
      return dataCountyItem.id;
    })
    .attr("data-education", (dataCountyItem) => {
      let id = dataCountyItem.id;
      let county = dataEducation.find((item) => {
        return id === item.fips;
      });
      return county.bachelorsOrHigher;
    })
    .on("mouseover", function (d, i) {
      //Highlight selected bar
      // let selectTooltip = d3.select(this);
      //Tooltip Visible
      // tooltip.transition().style('visibility', 'visible');
      tooltip.transition().duration("50").style("opacity", "1");

      let id = d.id;
      let county = dataEducation.find((item) => {
        return item.fips === id;
      });

      let text = `Fip: ${county.fips}<br>
        Area: ${county.area_name}<br>
        State: ${county.state}<br>
        Degree: ${county.bachelorsOrHigher}%`;

      tooltip
        .html(text)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 15 + "px")
        .attr("data-education", county.bachelorsOrHigher);
    })
    .on("mouseout", function (d, i) {
      //De-Highlight selected bar
      // let selectTooltip = d3.select(this);
      //Tooltip Hidden
      tooltip.transition().duration("50").style("opacity", "0");
    });
  
  //Append State Borders to SVG Map
  svgBox
    .append('g')
    .selectAll("path")
    .data(dataStates)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "states")
    .style("stroke", '#002133')
    .attr("fill", "none")
    .attr("stroke-linejoin", "round");
  
};

//LEGEND RENDER
let legendRender = () => {
  let colorScale = d3.scaleOrdinal().domain(legendKeys).range(legendColors);
  let locationYRect = 230;
  let locationXRect = 60;
  let locationYText = 240;
  let locationXText = 130;
  let rectSize = 20;
  let distBetweenRect = 25;

  //CREATE COLOR RECTANGLES
  svgLegend
    .selectAll("rect")
    .data(legendKeys)
    .enter()
    .append("rect")
    .attr("x", locationXRect)
    .attr("y", (d, i) => locationYRect + i * distBetweenRect)
    .attr("width", rectSize)
    .attr("height", rectSize)
    .style("fill", (d) => colorScale(d));

  //CREATE KEY TEXT
  svgLegend
    .selectAll("text")
    .data(legendKeys)
    .enter()
    .append("text")
    .attr("x", locationXText)
    .attr("y", (d, i) => locationYText + i * distBetweenRect)
    .style("fill", "black")
    .text((d) => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  //LEGEND LABEL
  svgLegend
    .append("text")
    .attr("transform", "rotate(0)")
    .text(legendLabel)
    .attr("x", 0)
    .attr("y", 210)
    .style("font-size", "14px");
};

//GET JSON DATA (SERVER REQUEST)
d3.json(urlCounty).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
    //CONVERT TOPO JSON INTO GEOJSON AND SET dataCounty to features ARRAY
    dataCounty = topojson.feature(data, data.objects.counties).features;
    console.log(dataCounty);
    //CONVERT TOPJSON INTO GEOJSON AND SET dataState to features ARRAY
    dataStates = topojson.feature(data,data.objects.states).features;
    console.log(dataStates);
    
    d3.json(urlEducation).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        dataEducation = data;
        console.log(dataEducation);
        //MAP RENDER
        mapRender();
        //LEGEND RENDER
        legendRender();
      }
    });
  }
});
