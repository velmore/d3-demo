//* Tory Elmore, Fall 2019
// GEOG 575 Lab 2 
// d3 demo: Alaska's Largest Cities bubble graph */
 
//execute script when window is loaded
window.onload = function(){

    //SVG dimension variables
    var w = 900, h = 500;
    
    var container = d3.select("body") //get the <body> element from the DOM
        .append("svg") //put a new svg in the body
        .attr("width", w) //assign the width 
        .attr("height", h) //assign the height
        .attr("class", "container") //always assign a class (as the block name) for styling and future selection
        .style("background-color", "rgba(0,0,0,0.2)"); //only put a semicolon at the end of the block!
    
    //innerRect block
    var innerRect = container.append("rect")
        .datum(400) //a single value is a DATUM
        .attr("width", function(d){ //rectangle width
            return d * 2; //400 * 2 = 800
        })
        .attr("height", function(d){ //rectangle height
            return d; //400
        })
        .attr("class", "innerRect") //class name
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color
    
   // create population data array
    var cityPop = [
        { 
            city: 'Anchorage',
            population: 297832
        },
        {
            city: 'Fairbanks',
            population: 33645
        },
        {
            city: 'Juneau',
            population: 32063
        },
        {
            city: 'Wasilla',
            population: 11161
        }
    ];
    
    //find the minimum value of the array
    var minPop = d3.min(cityPop, function(d){
        return d.population;
    });

    //find the maximum value of the array
    var maxPop = d3.max(cityPop, function(d){
        return d.population;
    });
    
        //color scale generator 
    var color = d3.scaleLinear()
        .range([
            "#58cced",  
            "#072f5f"
        ])
        .domain([
            minPop, 
            maxPop
        ]);

    //scale for circles center y coordinate
    var y = d3.scaleLinear()
        .range([450, 50]) //was 440, 95: changed to fit circles and labels vertically 
        .domain([0, 350000]); //was minPop, maxPop: changed to fit circles and labels vertically 
    
    var x = d3.scaleLinear()  //create the scale
        .range([90, 850]) //output min and max: changed to fit circles and labels horizontally
        .domain([0, 3.5]); //input min and max: changed to fit circles and labels horizontally 

    //circles class block: creates an empty selection and then populates with circles representing each city
    var circles = container.selectAll(".circles") //create an empty selection
        .data(cityPop) //here we feed in an array
        .enter() 
        .append("circle") //creates the circles in the HTML
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;//assigns the city name from the array
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.01;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d, i){
            //use the scale generator with the index to place each circle horizontally
            return x(i);
        })
        .attr("cy", function(d){
            return y(d.population);//use the scale generator with the population to place each circle vertically 
        })
        .style("fill", function(d, i){ //add a fill based on the color scale generator
            return color(d.population);
        })
        .style("stroke", "#000"); //black circle stroke
    
     var yAxis = d3.axisLeft(y) //create a left-aligned axis variable from the population data
        .scale(y);

    //create axis g element and add axis
    var axis = container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);
    
    var title = container.append("text")//creates a title text variable aligned at the top center of the graph
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 30)
        .text("Alaska's Largest Cities");
    
    var labels = container.selectAll(".labels")//creates label text variable calling data from the cityPop array
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchor", "left")
        .attr("y", function(d){
            //vertical position centered on each circle
            return y(d.population) - 3;
        });

    //first line of label, the city name 
    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .text(function(d){
            return d.city;
        });

        //create format generator for , in population numbers
    var format = d3.format(",");

    //second line of label, the city population 
    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", function(d,i){
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .attr("dy", "15") //vertical offset from line 1
        .text(function(d){
            return "Pop. " + format(d.population); //use format generator to format numbers
        });
    
};