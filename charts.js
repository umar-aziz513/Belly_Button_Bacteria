function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    //console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
      var samples = data.samples
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
      var samplesarray = samples.filter(samples_element => samples_element.id == sample)[0]

      console.log(samplesarray);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata
      var metadataarray = metadata.filter(metadata_element => metadata_element.id == sample)[0]
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = samplesarray.otu_ids
      var otu_labels = samplesarray.otu_labels
      var sample_values = samplesarray.sample_values
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
      var wash_frequency = parseFloat(metadataarray.wfreq)
      


    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    var sorted_sample_values = sample_values.sort((a,b) => a-b).reverse().slice(0,10)
    


        // so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.map(otu_ids_changestring => `otu_ids${otu_ids_changestring}`

    )

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [ { 
      y: yticks,
      x: sorted_sample_values.reverse(), 
      type: "bar",
      orientation: "h"
    }

    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = { title: "Top 10 Bacteria Cultures Found",
    
  };

 

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubleLayout = { title: "Bacteria Cultures Per Sample"
    
  };
  var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids
     
    }
  }];
   

    
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeChart = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_frequency,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    
    
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeChart, layout);
  });
}
