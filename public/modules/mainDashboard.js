import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { secondsConverter } from "./converters.js";
import { monthsConverter } from "./converters.js";

export const mainDashboardHtml = `
  <div class="flex mt-20 ml-10">
    <div class="bg-secondary-100 rounded-2xl">
      <div id="chart" class="flex"></div>
    </div>
    <div class="flex justify-center items-center mt-10 hidden">
        <div 
          id="overview" 
          class="flex flex-col justify-center items-center
          text-primary-200 bg-secondary-100 w-80 py-5">
          <span id="targetProject"></span>
          <span id="targetMonth"></span>
          <span id="targetVolume"></span>
        </div>
      </div> 
  </div>
`
export const mainDashboardJs = async function () {

  // Fetch projects Data
  const projects = await getProjects();
  const data = createChartData(projects);
  document.getElementById('chart').append(createChartTest(data[2025]))

  function createChartData(projects) {
    const data = {}

    // Create new object with projects data for the chart
    projects.forEach(project => {

      // Each year
      project.dateVolume.forEach(volume => {

        const year = volume.year;
        const date = new Date();
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth();

        // initiate array for each year
        if (!data[year]) {
          data[year] = [];
        }

        // Each month
        for (const [key, value] of Object.entries(volume)) {

          // A D D  T H I S  :  && !(currentYear === year && key > currentMonth)
          if (Number.isInteger(Number(key))) {
            const volumeEntry = project.type === 'duration' ? secondsConverter(value).hours : value;

            const entry = {
              month: key,
              volume: volumeEntry
            }
            
            if (data[year][key]) {
              data[year][key].volume += volumeEntry;
            }
            else {
              data[year][key] = entry;
            }
          }
        }
      })
    })

    return data;
  }

  function createChartTest(data) {
    console.log(data)

    // Graph Dimentions
    const width = 700;
    const height = 270;
    const marginTop = 30;
    const marginRight = 50;
    const marginBottom = 60;
    const marginLeft = 80;

    // SVG Container
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewbox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-mona");

    // Gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "lineGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(0, 123, 255, 0.5)");
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(0, 123, 255, 0)");   


    // Horizontal scale for months
    const x = d3.scaleLinear()
      .domain([0, 11])
      .range([marginLeft, width - marginRight])
    
    // Vertical scale for volume
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume)])
      .range([height - marginBottom, marginTop]);

    // Gradient Area
    const area = d3.area()
      .x((d) => x(d.month))
      .y0(height - marginBottom)
      .y1((d) => y(d.volume))
    
    svg.append("path")
      .datum(data)
      .attr("fill", "url(#lineGradient)")
      .attr("d", area);
    
    // Horizontal axis
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`) // Position it on the left side
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(0)) 
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .attr("dx", "-2em") 
      .style("color", '#a6b1d8');
    
    // bottom axis 
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) 
        .tickFormat(d => monthsConverter(d, 'short')) 
        .ticks(12)
        .tickSize(0))
      .call(g => g.select(".domain").remove())
      .selectAll("text")  
      .style("color", '#a6b1d8')
      .attr("dy", "2em");

      // Define the line
      const line = d3.line()
      .x(d => x(d.month))
      .y(d => y(d.volume));

      // Draw the line
      svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#00baf3") // Line color
      .attr("stroke-width", 2)
      .attr("d", line);

    return svg.node();
  }

  function createChart(data) {
  
    const width = 700;
    const height = 270;
    const marginTop = 30;
    const marginRight = 50;
    const marginBottom = 60;
    const marginLeft = 80;

    // Create Horizontal scale for months
    const x = d3.scaleLinear()
      .domain([0, 11])
      .range([marginLeft, width - marginRight])

    // Create Vertical scale for volume
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume)])
      .range([height - marginBottom, marginTop]);
    

    // Create scale for all the projects
    const projects = data.map(d => d.projectName)
    const color = d3.scaleOrdinal()
      .domain(projects)
      .range(d3.schemeCategory10);
    

    //Creating the SVG Container
    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewbox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-mona");


    // // Horizontal axis
    svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`) // Position it on the left side
    .call(d3.axisLeft(y)
      .ticks(5)
      .tickSize(0)) 
    .call(g => g.select(".domain").remove())
    .selectAll("text")
    .attr("dx", "-2em") 
    .style("color", '#a6b1d8'); 


    // bottom axis 
    svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
      .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) 
      .tickFormat(d => monthsConverter(d, 'short')) 
      .ticks(12)
      .tickSize(0))
    .call(g => g.select(".domain").remove())
    .selectAll("text")  
    .style("color", '#a6b1d8')
    .attr("dy", "2em");

    // Add a container for each series.
    const serie = svg.append("g")
      .selectAll()
      .data(d3.group(data, d => d.projectName))
      .join("g")

    // Draw the lines.
    serie.append("path")
    .attr("fill", "none")
    .attr("stroke", '#00baf3')
    .attr("stroke-width", 1.5)
    .attr("d", d => d3.line()
        .x(d => x(d.month))
        .y(d => y(d.volume))(d[1]));
      
    // When user clicks dot - overview data would appear
    const targetProject = document.getElementById('targetProject');
    const targetMonth = document.getElementById('targetMonth');
    const targetVolume = document.getElementById('targetVolume');
    function createOverview(projectName, month, volume) {
      targetProject.innerText = projectName;
      targetMonth.innerText = monthsConverter(month, 'long');
      targetVolume.innerText = volume;
    }
    return svg.node();
  }

  async function getProjects() {
    try {
      const response = await fetch('/api/projects/get', {method: 'GET'});
      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  } 
}