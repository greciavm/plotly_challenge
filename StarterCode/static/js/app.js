// Initializes the page with a default plot
function init() {

    d3.json("samples.json").then((bbdata) => {
        console.log(bbdata);
 
    });
};

// This function is called when a dropdown menu item is selected
function dropdown() {

    d3.json("samples.json").then((bbdata) => {
        console.log(bbdata);
        var dropdownoptions = d3.select("#selDataset");
        var names = bbdata.names;
        var option;
        for (var i = 0; i < names.length; i++) {
            option = dropdownoptions.append("option").text(names[i]);
        }
    })
};

dropdown();

function optionChanged(optionselected) {
    getbbdata(optionselected)
    };
        
function getbbdata(optionselected) {
    
    // Grab values from the response json object to build the plots
    d3.json("samples.json").then((bbdata) => {
        console.log(bbdata);
        var optionselected = bbdata.samples.filter(row => row.id === optionselected);
        console.log(optionselected)
        var values = optionselected[0].sample_values;
        var OTU_ids = optionselected[0].otu_ids;
        var OTU_labels = optionselected[0].otu_labels;
    
        var optionselected = values.map((value, index) => {
            return {
                values: value,
                OTU_ids: OTU_ids[index],
                OTU_labels: OTU_labels[index]
            }
        });
        console.log(optionselected);
    
        var sorted_values = optionselected.sort((a, b) => b.values - a.values);
        var top_desc_values = sorted_values.slice(0, 10).reverse()
    
        //Bar Graph
        var top_values = top_desc_values.map(d => d.values);
        var top_OTU_ids = top_desc_values.map(d => `OTU ${d.OTU_ids}`);
        var top_OTU_labels = top_desc_values.map(d => d.OTU_labels);
    
        var bar_trace = {
            x: top_values,
            y: top_OTU_ids,
            text: top_OTU_labels,
            type: "bar",
            orientation: "h"
            };
    
        var bar_data = [bar_trace];
    
        Plotly.newPlot("bar", bar_data)
    
        //Bubble Chart
        var bubble_values = optionselected.map(d => d.values);
        var bubble_OTU_ids = optionselected.map(d => d.OTU_ids);
        var bubble_OTU_labels = optionselected.map(d => d.OTU_labels);
    
        var bubbletrace = {
            x: bubble_OTU_ids,
            y: bubble_values,
            text: bubble_OTU_labels,
            mode: "markers",
            marker: {
                color: bubble_OTU_ids,
                size: bubble_values
                }
            };
    
        var bubble_data = [bubbletrace];
    
        var bubble_layout = {
            title: "Bubble Chart",
            xaxis: { title: "OTUS ID" },
        };
    
        Plotly.newPlot("bubble", bubble_data, bubble_layout)
    
    
        //Demographic Info
        var demographic = bbdata.metadata;
        console.log(demographic);
    
        var demo_info = demographic.filter(row => row.id == optionselected)[0];
        console.log(demo_info);
    
        var panel_body = d3.select(".panel-body");
    
        panel_body.html("");
    
        Object.entries(demo_info).forEach(([k, v]) => {
            panel_body.append("p").text(`${k}:${v}`)
        });
    
    });

};

init();