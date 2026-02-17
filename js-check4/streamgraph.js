const drawStreamGraph = (data) => {
  // Generate the streamgraph here

  // Get all unique years
  const years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
  
  // Transform data for each year
  const transformedData = [];
  years.forEach(year => {
    const yearObj = { year: year };
    
    // Filter data for this year
    const yearData = data.filter(d => d.year === year);
    
    // Sum up gross revenue by genre
    const genreGross = {};
    yearData.forEach(d => {
      const genre = d.genre.toLowerCase();
      genreGross[genre] = d.gross;
    });
    
    // Add genre gross to yearObj
    for (let genre in genreGross) {
      yearObj[genre] = genreGross[genre];
    }
    
    transformedData.push(yearObj);
  });


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  const svg = d3.select("#streamgraph")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const stackGenerator = d3.stack()
  .keys(formatsInfo.map(f => f.id))
  .order(d3.stackOrderDescending)
  .offset(d3.stackOffsetSilhouette);

  const annotatedData = stackGenerator(transformedData);

  const minLowerBoundaries = [];  
const maxUpperBoundaries = []; 

annotatedData.forEach(series => {                     
  minLowerBoundaries.push(d3.min(series, d => d[0]));  
  maxUpperBoundaries.push(d3.max(series, d => d[1])); 
});                                                  

const minDomain = d3.min(minLowerBoundaries);  
const maxDomain = d3.max(maxUpperBoundaries); 

const yScale = d3.scaleLinear()
  .domain([minDomain, maxDomain])  
  .range([innerHeight, 0])
  .nice();

  const areaGenerator = d3.area()
    .x(d => xScale(d.data.year) + xScale.bandwidth() / 2)
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveCatmullRom);

  innerChart
    .append("g")
    .attr("class", "areas-container")
    .selectAll("path")
    .data(annotatedData)
    .join("path")
    .attr("d", areaGenerator)
    .attr("fill", d => colorScale(d.key));


  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
    .call(leftAxis)
    .style("font-size", "12px");

  const bottomAxis = d3.axisBottom(xScale)  
  .tickValues(d3.range(1995, 2020, 5))   
  .tickSizeOuter(0);                    

innerChart                                              
  .append("g")                                        
    .attr("transform", `translate(0, ${innerHeight})`) 
    .call(bottomAxis);

  const leftAxisLabel = svg
    .append("text")
    .attr("dominant-baseline", "hanging");

  leftAxisLabel
    .append("tspan")
    .text("Total revenue");

  leftAxisLabel
    .append("tspan")
    .text("(million USD)")
    .attr("dx", 5)
    .attr("fill-opacity", 0.7);

  leftAxisLabel
    .append("tspan")
    .text("Adjusted for inflation")
    .attr("x", 0)
    .attr("dy", 20)
    .attr("fill-opacity", 0.7)
    .style("font-size", "14px");

};