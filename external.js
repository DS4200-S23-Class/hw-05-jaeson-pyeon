// Define the Size of the SVG Container
const width = 500;
const height = 500;
const margin = {left: 50, right: 50, top: 50, bottom: 50};
const circle_height = height - margin.top - margin.bottom;
const circle_width = width - margin.left - margin.right;

// Create the SVG Container
const svg = d3.select("#scatterplot")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", 'plot');

 // Define X and Y Scales to Map Data to SVG Container
  const xScale = d3.scaleLinear()
    .domain([1, 9])
    .range([0, circle_width]);

  const yScale = d3.scaleLinear()
    .domain([1, 9])
    .range([circle_height, 0]);

// Define Function to Update Last Clicked Point
function updateLastClickedText(clickedCircle) {
  const x = Math.round((+clickedCircle.attr("cx").replace(margin.left, "")) / xScale(1));
  const y = Math.round((+clickedCircle.attr("cy").replace(margin.top, "")) / yScale(1));
  const lastClicked = d3.select("#last-click");
   lastClicked.text("Last Point Clicked: (" + x.toFixed(0) + ", " + y.toFixed(0) + ")");
}


// Load Data from CSV File and Add Points to SVG Container
d3.csv("data/scatter-data.csv").then(function(data) {

  // Add Points to SVG Container
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", (d) => {return "(" + d.x + "," + d.y + ")"})
    .attr("cx", (d) => xScale(+d.x) + margin.left)
    .attr("cy", (d) => yScale(+d.y) + margin.top)
    .attr("r", 6)
  
  svg.append("g")
    .attr('transform', 'translate(' + margin.left + "," + (margin.top + circle_height) + ')')
    .call(d3.axisBottom(xScale))
  
  svg.append("g")
    .attr('transform', 'translate(' + margin.left + "," + margin.top + ')')
    .call(d3.axisLeft(yScale))
  
  // Add Mouse Enter Event Listener to Add Highlighted Class to Circle
  svg.selectAll("circle")
    .on("mouseenter", function() {
      d3.select(this).classed("highlighted", true);
    })

  // Add Mouse Enter Event Listener to Remove Highlighted Class to Circle
    .on("mouseleave", function() {
      d3.select(this).classed("highlighted", false);
    })

  // Add Click Event Listener to Each Point
    .on("click", function() {
    const clickedCircle = d3.select(this);
    updateLastClickedText(clickedCircle);
    clickedCircle.classed("clicked", !clickedCircle.classed("clicked"));
    });
});

// Add Function to Handle Events when Button Clicked
function buttonClick() {
  const xInput = d3.select("#X");
  const yInput = d3.select("#Y");
  
  // Get X and Y Values from Input Fields
  const x = +xInput.property("value");
  const y = +yInput.property("value");

  // Confirm that Only Coordinates 1-9 are Inputted
  if (x < 1 || x > 9 || y < 1 || y > 9) {
    return;
  }

  // Create New Circle Element for the Coordinates Inputted
  svg.append("circle")
    .attr("cx", xScale(x) + margin.left)
    .attr("cy", yScale(y) + margin.top)
    .attr("r", 6)
  
    // Add Mouse Enter Event Listener to Add Highlighted Class to Circle
    .on("mouseenter", function() {
      d3.select(this).classed("highlighted", true);
    })

    // Add Mouse Enter Event Listener to Remove Highlighted Class to Circle
    .on("mouseleave", function() {
      d3.select(this).classed("highlighted", false);
    })

    // Add Click Event Listener to the New Point
      .on("click", function() {
    const clickedCircle = d3.select(this);
    updateLastClickedText(clickedCircle);
    clickedCircle.classed("clicked", !clickedCircle.classed("clicked"));
    });
}

// Define the Size of the SVG Container for the Bar Chart
const barWidth = 500;
const barHeight = 500;
const barMargin = {left: 50, right: 50, top: 50, bottom: 50};
const barInnerWidth = barWidth - barMargin.left - barMargin.right;
const barInnerHeight = barHeight - barMargin.top - barMargin.bottom;

const svg2 = d3.select("#bargraph")
          .append("svg")
            .attr("height", barHeight)
            .attr("width", barWidth)
            .attr("class", "frame");

// Load Data from CSV File and Add Points to SVG Container
d3.csv("data/bar-data.csv").then((data) => {
  console.log(data)

    // Scaling X and Y Values from CSV File
    const x1 = d3.max(data, (d, i) => { return parseInt(d.category); });
    const y1 = d3.max(data, (d) => { return parseInt(d.amount); });

    const xScale = d3.scaleBand()
            .domain(["A", "B", "C", "D", "E", "F", "G"])
            .range([0, barInnerWidth])

    const yScale = d3.scaleLinear()
            .domain([0,100])
            .range([barInnerHeight, 0])

    // Plot Points from CSV 
    svg2.selectAll("bars")  
        .data(data) 
        .enter()       
        .append("rect")  
          .attr("x", (d) => { return (xScale(d.category) + barMargin.left + 10); }) 
          .attr("y", (d) => { return (yScale(d.amount) + barMargin.top); }) 
          .attr("width", 40)
          .attr("height", (d) => {return barInnerHeight - yScale(d.amount)})
          .attr("class", "bar")
          .style("fill", "black");

    svg2.append("g")
          .attr("transform", "translate(" + barMargin.left+ "," + (barInnerHeight + barMargin.top) + ")")
          .call(d3.axisBottom(xScale).ticks(10));

    svg2.append("g")
          .attr("transform", "translate(" + barMargin.left + "," + (barMargin.top) + ")")
          .call(d3.axisLeft(yScale).ticks(10));


   // Adding Tooltip
   const tooltip = d3.select("#bargraph")
                       .append("div")
                         .attr("class", "tooltip")
                         .style("opacity", 0); 

    // Highlight and Tooltip Use When Mouse Hover
    function mouseover(event, d) {
      d3.select(this).style("fill", "pink");
      tooltip.style("opacity", 1); 
   
    }

   // Highlight and Tooltip Use When Mouse Move
    function mousemove(event, d) {
      // Position Tooltip on Page and Produce Value
      tooltip.html("Category: " + d.category + "<br>Amount: " + d.amount)
              .style("left", (event.pageX + 10) + "px")                                                
              .style("top", (event.pageY - 10) + "px"); 

    }

    // Remove Highlight and Tooltip Use When Mouse Leave
    function mouseleave(event, d) {
      d3.select(this).style("fill", "black");
      tooltip.style("opacity", 0); 
    } 

    // Add Event Functions to Bar Plot
    svg2.selectAll(".bar")
          .on("mouseover", mouseover) 
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);    

})



