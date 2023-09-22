const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Init function for the dropdown dashboard
function init() {
  // Fetch the JSON data and console log it
   d3.json(url).then(data => {
    dropdown = d3.select("#selDataset");
    data.names.forEach(name => {
    dropdown.append("option").text(name).property('value', name);
   });
  // Initialize the dashboard with first data points
   optionChanged(data.names[0], data);
  });
}

function optionChanged(selectOne, data) {
  d3.json(url).then(data => {
    const oneData = data.samples.find(sample =>
      sample.id === selectOne);
    const metadata = data.metadata.find(metadata =>
      metadata.id.toString() === selectOne);
      
      // update demographics
      updateDemographicInfo(metadata);
      // create bar chart
      barPlot(oneData);
      // create bubble chart
      bubblePlot(oneData);
  });
}

// Define a function for the bar plot
function barPlot(data){
    
  let otuIds = data.otu_ids;
  let otuLabels = data.otu_labels;
  let sampleValues = data.sample_values;
// Create the horizontal bar chart for a drop down menu to display the top 10 OTUs
  let trace1 = {
    type: "bar",
    x: sampleValues.slice(0,10).reverse(),
    y: otuIds.slice(0,10).map(id => `OTU:${id}`).reverse(),
    text: otuLabels.slice(0,10).reverse(),
    orientation: "h"
  };
  // Store the data under a variable
  let dataBar = [trace1];

  let layoutBar = {
    title: "Top 10 OTUs",
    xaxis: {title: "OTU Values"},
    yaxis: {title: "OTU IDs"},
    width: 600
  };
  Plotly.newPlot("bar", dataBar, layoutBar);
}

// Define a function for the bubble plot
function bubblePlot(data){

  let otuIds = data.otu_ids;
  let otuLabels = data.otu_labels;
  let sampleValues = data.sample_values;
// Create the bubble chart that displays each sample
let trace2 = {
  x: otuIds,
  y: sampleValues,
  text: otuLabels,
  // sampleValues for the marker size
  mode: "markers",
  marker: {
    size: sampleValues,
    // otu_ids for marker colors
    color: otuIds,
    colorscale: "Earth"
  },
};
// store the data under a variable
let dataBubble = [trace2];

let layoutBubble = {
  title: "OTU Bubble Plot",
  xaxis: {title: "OTU IDs"},
  yaxis: {title: "OTU Values"}
};

Plotly.newPlot("bubble", dataBubble, layoutBubble);
}

// function to update the demographic info panel
function updateDemographicInfo(metadata) {
    const metadataPanel = d3.select('#sample-metadata');
    metadataPanel.html(''); //this clears out previous data table
    // iterate through metadata and display key-value pairs
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append('p').text(`${key}:${value}`);
    });
}

init();


