// Initializes the page with a default plot
function init() {

    d3.json("samples.json").then((bbdata) => {
        console.log(bbdata);

        var names = bbdata.names;
        var optionselected = names[0];

        getbbdata(optionselected)

    });
};
init();

// This function is called when a dropdown menu item is selected
function dropdown() {

    d3.json("samples.json").then((bbdata) => {
        var names = bbdata.names;
        console.log(bbdata);
        var dropdownoptions = d3.select("#selDataset");
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
        var filtereddata = bbdata.samples.filter(row => row.id === optionselected);
        console.log(filtereddata)
        var values = filtereddata[0].sample_values;
        var OTU_ids = filtereddata[0].otu_ids;
        var OTU_labels = filtereddata[0].otu_labels;
    
        var optionselected2 = values.map((value, index) => {
            return {
                values: value,
                OTU_ids: OTU_ids[index],
                OTU_labels: OTU_labels[index]
            }
        });
        console.log(optionselected2);
    
        var sorted_values = optionselected2.sort((a, b) => b.values - a.values);
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
        var bubble_values = optionselected2.map(d => d.values);
        var bubble_OTU_ids = optionselected2.map(d => d.OTU_ids);
        var bubble_OTU_labels = optionselected2.map(d => d.OTU_labels);
    
        var bubble_trace = {
            x: bubble_OTU_ids,
            y: bubble_values,
            text: bubble_OTU_labels,
            mode: "markers",
            marker: {
                color: bubble_OTU_ids,
                size: bubble_values
                }
            };
    
        var bubble_data = [bubble_trace];
    
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

