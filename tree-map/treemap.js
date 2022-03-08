
const kickstartDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';

const margin = {top: 0, bottom: 0, left: 0, right: 0};

const colorPalette = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#C9CBA3', '#E26D5C', '#723D46', '#472D30', '#8ECAE6', '#219EBC', '#023047', '#FFB703', '#FB8500', '#1A1423', '#372549', '#774C60', '#B75D69', '#EACDC2'];

const svgTreemapHeight = 600 - margin.top - margin.bottom;
const svgTreemapWidth = 1000 - margin.left - margin.right;

const svgLegendHeight = 600 - margin.top - margin.bottom;
const svgLegendWidth = 200 - margin.left - margin.right;

let dataKickstart;

let svgTreemap = d3
  .select('#treemap')
  .append('svg')
  .attr('height', svgTreemapHeight + margin.left + margin.right)
  .attr('width', svgTreemapWidth + margin.top + margin.bottom)
  .style('background-color', 'white')
  .append('g')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //TOOLTIP
let tooltip = d3
  .select("#treemap")
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "tooltip")
  .style("opacity", 0);

let renderTreemap = () => {
  //colors: EF476F, FFD166, 06D6A0, 118AB2, 073B4C
  //more colors: 8ECAE6, 219EBC, 023047, FFB703, FB8500
  // C9CBA3, FFE1A8, E26D5C, 723D46, 472D30
  //1A1423, 372549, 774C60, B75D69, EACDC2

  //Hierarchy structure to be passed into treemap function, makeTreemap
  let hierarchy = d3.hierarchy(/*data object*/dataKickstart,/*what node children are stored in*/ (childrenNode) => {
    return childrenNode.children;
  }).sum((childrenNode) => {
    return childrenNode.value;
  }).sort((childNode1, childNode2) => {
    //Largest value will be put first, descending
    return childNode2.value - childNode1.value;
  });
  //Defining the makeTreemap functions using d3.treemap()
  let makeTreemap = d3.treemap().size([1000,600]);
  //Calling the makeTreemao function we made passing the hierarchy to it
  makeTreemap(hierarchy);
  //Sets coordinates on the node leaves (object properties)
  let kickstartLeaves = hierarchy.leaves();
  console.log(kickstartLeaves);
  //For each array item in kickstartLeaves variable, create a group item 'g'
  let nodeBlock = svgTreemap.selectAll('g')
            .data(kickstartLeaves)
            .enter()
            .append('g')
            .attr('transform', (treeObj) => {
              return 'translate(' + treeObj.x0 + ', ' + treeObj.y0 + ')';
            });

  //Append each nodeBlock with a rectangle and fill colors
  nodeBlock.append('rect')
            .attr('class', 'tile')
            .attr('fill', (treeObj) => {
              let categories = treeObj.data.category;
              
              if (categories == 'Product Design') {
                return colorPalette[0];
              }
              if (categories == 'Tabletop Games' ) {
                return colorPalette[1];
              }
              if (categories == 'Gaming Hardware') {
                return colorPalette[2];
              }
              if (categories == 'Video Games') {
                return colorPalette[3];
              }
              if (categories == 'Sound' ) {
                return colorPalette[4];
              }
              if (categories == 'Television') {
                return colorPalette[5];
              }
              if (categories == 'Narrative Film' ) {
                return colorPalette[6];
              }
              if (categories == 'Web' ) {
                return colorPalette[7];
              }
              if (categories == 'Hardware' ) {
                return colorPalette[8];
              }
              if (categories == 'Games') {
                return colorPalette[9];
              }
              if (categories == '3D Printing') {
                return colorPalette[10];
              }
              if (categories == 'Technology') {
                return colorPalette[11];
              }
              if (categories == 'Wearables') {
                return colorPalette[12];
              }
              if (categories == 'Sculpture') {
                return colorPalette[13];
              }
              if (categories == 'Apparel') {
                return colorPalette[14];
              }
              if (categories == 'Food') {
                return colorPalette[15];
              }
              if (categories == 'Art') {
                return colorPalette[16];
              }
              if (categories == 'Gadgets') {
                return colorPalette[17];
              }
              if (categories == 'Drinks') {
                return colorPalette[18];
              }
            })
            .attr('data-name', (treeObj) => {
              console.log(treeObj.data.name);
              return treeObj.data.name;
            })
            .attr('data-category', (treeObj) => {
              return treeObj.data.category;
            })
            .attr('data-value', (treeObj) => {
              return treeObj.data.value;
            })
            .attr('width', (treeObj) => {
              return treeObj.x1 - treeObj.x0;
            })
            .attr('height', (treeObj) => {
              return treeObj.y1 - treeObj.y0;
            })
            .on("mouseover", function (treeObj, i) {
      //Highlight selected bar
      // let selectTooltip = d3.select(this);
      //Tooltip Visible
      // tooltip.transition().style('visibility', 'visible');
      tooltip.transition().duration("50").style("opacity", "1");

      let text = `Name: ${treeObj.data.name}<br>
        Category: ${treeObj.data.category}<br>
        Value: ${treeObj.data.value}<br>`;

      tooltip
        .html(text)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 15 + "px")
        .attr("data-value", treeObj.data.value);
    })
    .on("mouseout", function (treeObj, i) {
      //De-Highlight selected bar
      // let selectTooltip = d3.select(this);
      //Tooltip Hidden
      tooltip.transition().duration("50").style("opacity", "0");
    });

    

    // nodeBlock
    // .append('text')
    // .selectAll('tspan')
    // .data(function (d) {
    //   return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    // })
    // .enter()
    // .append('tspan')
    // .attr('x', 4)
    // .attr('y', function (d, i) {
    //   return 13 + i * 13;
    // })
    // .text(function (d) {
    //   return d;
    // });

  nodeBlock.append('text')
    .text((treeObj) => {
      return '+';
      // treeObj.data.name
    })
    .attr('x', 10 )
    .attr('y', 20)
    .attr('fill', 'white');

  let colorPaletteScale = d3
    .scaleOrdinal()
    .domain(dataKickstart)
    .range(colorPalette);

  let legendKeys = dataKickstart.children.map((categories) => {
    return categories.name;
  })
  console.log(legendKeys);

  //CREATE LEGEND SVG
  let svgLegend = d3
  .select('#legend')
  .append('svg')
  .attr('height', svgLegendHeight + margin.left + margin.right)
  .attr('width', svgLegendWidth + margin.top + margin.bottom)
  .style('background-color', 'whitesmoke');

  //ADD g GROUP ELEMENT
  svgLegend
  .selectAll('g')
  .data(dataKickstart.children)
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //ADD RECT ELEMENT
  svgLegend
  .selectAll('g')
  .data(dataKickstart.children)
  .append('rect')
  .attr('class','legend-item')
  .attr('x', (d,i) => 30)
  .attr('y', (d,i) => 20 + i*30 )
  .attr('width', 20)
  .attr('height', 20)
  .style('fill', (d,i) => colorPaletteScale(i));

//ADD TEXT ELEMENT
  svgLegend
  .selectAll('g')
  .append('text')
  .attr('x', (d,i) => 60)
  .attr('y', (d,i) => 35 + i*30)
  .text((d,i) => {
    return legendKeys[i]; 
  });



};

//GET DATA
d3.json(kickstartDataURL).then((data, error) => {
  if(error) {
    console.log(error);
  }
  else {
    console.log(data);
    dataKickstart = data;
    renderTreemap();
  }
});

