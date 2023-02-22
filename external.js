// Define the Size of the SVG Container
const width = 500;
const height = 500;

// Create the SVG Container
const svg = d3.select("#scatterplot")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "scatterplot"); 

// Define Function to Update Last Clicked Point
function updateLastClickedText(x, y) {
  const lastClicked = d3.select("#last-click");
  lastClicked.text("Last Point Clicked: (" + x + ", " + y + ")");
}

// Define X and Y Scales to Map Data to SVG Container
const xScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, 10])
  .range([height, 0]);

// Load Data from CSV File and Add Points to SVG Container
d3.csv("data/scatter-data.csv").then(function(data) {
  // Add Points to SVG Container
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(+d.x))
    .attr("cy", d => yScale(+d.y))
    .attr("r", 7)
  
    // Add Mouse Enter Event Listener to Add Highlighted Class to Circle
    .on("mouseenter", function() {
      d3.select(this).classed("highlighted", true);
    })

    // Add Mouse Enter Event Listener to Remove Highlighted Class to Circle
    .on("mouseleave", function() {
      d3.select(this).classed("highlighted", false);
    })

    // Add Click Event Listener to Each Point
    .on("click", function(d) {
      updateLastClickedText(d.x, d.y);
      d3.select(this).classed("clicked", !d3.select(this).classed("clicked"));
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
    .attr("cx", xScale(x))
    .attr("cy", yScale(y))
    .attr("r", 7)
  
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
      updateLastClickedText(x, y);
      d3.select(this).classed("clicked", !d3.select(this).classed("clicked"));
    });
}

