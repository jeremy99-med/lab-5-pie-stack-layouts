const drawDonutCharts = (data) => {
  // Generate the donut charts here
  const svg = d3.select("#donut")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const donutContainers = svg
    .append("g")
    .attr("transform", `translate(${margin.left},                  
      ${margin.top})`);
  
  const leftAxisLabel = svg
    .append("text")
    .attr("dominant-baseline", "hanging");

  leftAxisLabel
    .append("tspan")
    .text("Gross Revenue by Genre")
    .attr("y", margin.top - 10)
    .style("font-size", "16px")
    .style("font-weight", 500);


  const years = [1997, 2005, 2013];
  
  const formats = data.columns.filter(format => format !== "year");

  years.forEach(year => {

    const donutContainer = donutContainers
      .append("g")
      .attr("transform", `translate(${xScale(year)}, ${innerHeight / 2})`);
    // Filter data for the specific year
    const yearData = data.filter(d => d.year === year);
    
    // Create an object to store gross revenue by genre
    const genreGross = {};
    
    // Loop through each row and sum up gross revenue by genre
    yearData.forEach(d => {
      const genre = d.genre.toLowerCase();
      genreGross[genre] = d.gross;
    });
    
    // Convert to array format for pie chart
    const formattedData = [];
    for (let genre in genreGross) {
      formattedData.push({
        format: genre,
        sales: genreGross[genre]
      });
    }
    
    console.log(formattedData);

    const pieGenerator = d3.pie()
      .value(d => d.sales);
    const annotatedData = pieGenerator(formattedData);

    const arcGenerator = d3.arc()
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .innerRadius(60)
      .outerRadius(100)
      .padAngle(0.02)
      .cornerRadius(3);

    const arcs = donutContainer
      .selectAll(`.arc-${year}`)
      .data(annotatedData)
      .join("g")
      .attr("class", `arc-${year}`);

    //Colors
    arcs
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", d => colorScale(d.data.format));

    //Text
    arcs
      .append("text")
      .text(d => {
        d["percentage"] = (d.endAngle - d.startAngle)
          / (2 * Math.PI);
        return d3.format(".0%")(d.percentage);
      })
      .attr("x", d => {
        d["centroid"] = arcGenerator
          .startAngle(d.startAngle)
          .endAngle(d.endAngle)
          .centroid();
        return d.centroid[0];
      })
      .attr("y", d => d.centroid[1])
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#f6fafc")
      .attr("fill-opacity", d => d.percentage
        < 0.05 ? 0 : 1)
      .style("font-size", "16px")
      .style("font-weight", 500);


      donutContainer
        .append("text")
          .text(year)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "24px")
          .style("font-weight", 500);
      
        
  });
  
  


};