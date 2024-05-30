// Hoang Nguyen
// U12840485

function main() {       
    
    d3.csv('mock_stock_data.csv').then(
        function(data) {
            // Extract each company's data
            var appleData= data.filter(function(d) {return d.Stock === "Apple" })
            var googleData= data.filter(function(d) {return d.Stock === "Google" })
            
            var stockNames = ['Apple', 'Google']        
            // Make a  stock select dropdown
            var stockSelect = d3.select("#stockSelect");
            stockNames.forEach(function(name){
                stockSelect.append("option").text(name).attr("value", name)
            });
            
            // Initial chart with the Apple stock            
            updateChart(appleData, 'Apple')
            
            // Update chart when changing a different stock
            document.getElementById('stockSelect').addEventListener('change', event=> {
                const stockName =  document.getElementById('stockSelect').value;

                if (stockName === 'Apple'){                    
                    updateChart(appleData, stockName)
                } else if (stockName === 'Google'){
                    updateChart(googleData, stockName)
                }
            })

            // Create a function to make interactive bar chart based on the filtered data
            function updateChart(filteredData, company) {
                // Remove SVG
                d3.select("body").select("svg").remove();   

                // Create SVG
                var svgWidth = 600, svgHeight = 600;
                var margin = 200, width = svgWidth - margin, height = svgHeight - margin 
                
                var svg = d3.select('body').append('svg')
                                            .attr('width', svgWidth)
                                            .attr('height', svgHeight)
                
                var xScale = d3.scaleBand().range([0, width]).padding(0.4)
                var yScale = d3.scaleLinear().range([height, 0])

                var g = svg.append('g').attr('transform', 'translate(100, 100)')
                
                xScale.domain(filteredData.map(function(d){return d.Date}))
                yScale.domain([0, d3.max(filteredData, function(d){return d.Price})])

                // Create title
                svg.append('text')
                    .attr('transform', 'translate(100, 0)')
                    .attr('x', 50).attr('y', 50)
                    .attr('font-size', '24px ')
                    .text(`${company} Stock Price Overtime`)
            
                // Create x-axis
                g.append('g').attr('transform', `translate(0, ${height})`)
                        .call(d3.axisBottom(xScale))
                // Create y-axis and label
                g.append('g').call(d3.axisLeft(yScale).tickFormat(function(d){return `$${d}`}).ticks(10))
                            .append('text').attr('transform', 'rotate(-90)')
                            .attr('x',-150).attr('dy','-5em').attr('text-anchor','end')
                            .attr('stroke','black')
                            .text('Stock Price in USD')
    
                // Create bars
                g.selectAll('.bar')
                    .data(filteredData)
                    .enter().append('rect')
                    .attr('class','bar')
                    // .on('mouseover', onMouseOver) 
                    // .on('mouseout', onMouseOut)
                    .attr('x', function(d){ return xScale(d.Date)})
                    .attr('y', function(d){ return yScale(d.Price)})
                    .attr("width", xScale.bandwidth())
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(500)
                    .delay(function(d,i){return i * 50})
                    .attr('height', function(d){return height - yScale(d.Price)})
                
            }            
        }
    )
}