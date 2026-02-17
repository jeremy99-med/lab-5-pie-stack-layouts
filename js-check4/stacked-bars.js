const drawStackedBars = (data) => {
  // Generate the stacked bar chart here

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
  const svg = d3.select("#bars")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const stackGenerator = d3.stack()
  .keys(formatsInfo.map(f => f.id))
  .order(d3.stackOrderDescending)
  .offset(d3.stackOffsetExpand);

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
  
  annotatedData.forEach(series => {  

    innerChart
      .selectAll(`.bar-${series.key}`)           
      .data(series)                               
      .join("rect")                             
        .attr("class", d => `bar-${series.key}`) 
        .attr("x", d => xScale(d.data.year))             
        .attr("y", d => yScale(d[1]))                    
        .attr("width", xScale.bandwidth())                  
        .attr("height", d => yScale(d[0]) - yScale(d[1])) 
        .attr("fill", colorScale(series.key));       


});

const bottomAxis = d3.axisBottom(xScale)  
  .tickValues(d3.range(1995, 2020, 5))   
  .tickSizeOuter(0);                    

innerChart                                              
  .append("g")                                        
    .attr("transform", `translate(0, ${innerHeight})`) 
    .call(bottomAxis);                                 

const leftAxis = d3.axisLeft(yScale);  
innerChart                            
  .append("g")                        
    .call(leftAxis);
  
  


};