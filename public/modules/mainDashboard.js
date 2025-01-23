import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { secondsConverter } from "./converters.js";
import { monthsConverter } from "./converters.js";

export const mainDashboardHtml = `
  <div class="flex mt-20 ml-10">
    <div class="bg-secondary-100 rounded-2xl">
      <div class="pl-[50px] pt-[30px]">
        <div class="flex items-center gap-[6px] text-neutral-200">
          <span>
            <img 
              class="icon w-4" 
              src="static/images/clock.svg" 
              alt="puzzle icon">
          </span>
          <p>Total volume over time</p>
        </div>
        <p id="totalVolume" class="text-2xl pt-[10px]"></p>
      </div>
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

  // TODO : CREATE THE SELECTION BUTTON FOR YEARS IF MORE THAT ONE.
  //        EACH YEAR WOULD RESULT IN DIFFERENT CHART AND DATA

  // Fetch projects Data
  const projects = await getProjects();
  const data = createChartData(projects);
  document.getElementById('chart').append(createChartTest(data[2025]))
  document.getElementById('totalVolume').append(getTotalVolume(projects))
  getVolumePercentage(projects)

  function getTotalVolume(projects){
    let totalVolume = 0;

    projects.forEach(project => {
      const total = project.volume.total;
      const volumeEntry = project.type === 'duration' ? secondsConverter(total).hours : total;
      totalVolume += volumeEntry;
    })

    return totalVolume;
  }

  function getVolumePercentage(projects){
    const data = createChartData(projects)
    const testData = data[2025]

    // Find first entry
    let firstEntry = 0;
    
    console.log(testData)
  }

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

          // A D D  T H I S  : && !(currentYear === year && key > currentMonth) )
          if (Number.isInteger(Number(key)) ) {
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

    if (data.length === 1) {
      svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .style("fill", "#00baf3")
      .attr("r", 4)
      .attr("cx", (d) => x(d.month))
      .attr("cy", (d) => y(d.volume));
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