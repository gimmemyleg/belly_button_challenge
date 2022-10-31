

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let data = d3.json(url).then((data)=>{
    let ptName = data.names;
    let samplesName = data.samples;
    let otu_Ids = data.otu_ids;
    let otu_Labels = data.otu_labels;
    let metadata = data.metadata;
    console.log(ptName)
    console.log(samplesName)
    console.log(otu_Ids)
    console.log(otu_Labels)
    console.log(metadata);
});

function namefilter(){
    let dropdownMenu = d3.select("#selDataset");
    let data = d3.json(url).then((data)=>{
        let ptName = data.names;
        ptName.forEach((sample)=>{
            dropdownMenu 
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    }
    )
};

namefilter();

function optionChanged(sampleID){
    buildchart(sampleID)
};

function buildchart(sampleID){
    d3.json(url).then((data)=>{ 
        let sample = data.samples;
        let metadata = data.metadata;
        var results = sample.filter(sampleobject => sampleobject.id == sampleID);
        let personinfo = metadata.filter(infoobject => infoobject.id == sampleID);

        result = results[0];
        let otuIDs = result.otu_ids;
        let otuLabels = result.otu_labels;
        let samplevalues = result.sample_values;

        demographicInfo = personinfo[0];
        let ID = demographicInfo.id;
        let ethnicity = demographicInfo.ethnicity;
        let gender = demographicInfo.gender;
        let age = demographicInfo.age;
        let location = demographicInfo.location;
        let bbtype = demographicInfo.bbtype;
        let wfreq = demographicInfo.wfreq; 

        console.log(otuIDs);
        console.log(otuLabels);
        console.log(samplevalues);
        console.log(ID);

        let top10values = samplevalues.slice(0,10);
        let top10IDs = otuIDs.slice(0,10);
        console.log(top10values);
        console.log(top10IDs);

        d3.select(".panel-body").html("");

        Object.entries(demographicInfo).forEach(([key,value])=> {
            d3.select(".panel-body").append("h6").text(`${key}: ${value}`)
        });


        let x = top10values;
        
        let plotdata1 = [{
            x: top10values,
            y: top10IDs.map(labels=>`otuID:${labels}`),
            type : "bar",
            orientation: "h"
          }];
        let layout = {
            height:600,
            width: 1000
          };

        let plotdata2 =[{
            x:otuIDs,
            y:samplevalues,
            text:otuLabels,
            mode : "markers",
            marker: {
                color: otuIDs,
                size: samplevalues,
                colorscale:'Earth'
            }
        }];

        Plotly.newPlot("bar", plotdata1, layout);
        Plotly.newPlot("bubble", plotdata2, layout);
    });
};
