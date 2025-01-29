import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { secondsConverter, monthsConverter  } from "./converters.js";
export const mainDashboardHtml = `
  <div class="m-10">
    <div class="mb-10 w-full flex justify-between">
      <h2 class="text-xl font-bold tracking-wide">Analytics</h2>
      <div class="relative">
        <button 
          id="selectedYear"
          class="w-[92px] h-8 flex items-center justify-center gap-1 text-sm tracking-widest
              bg-gradient-to-r from-[#C139F3] to-[#7E24FB] rounded">
          <span id="selectedYearText">2025</span>
          <span>
            <img 
              class="icon w-3" 
              src="static/images/arrow-down.svg" 
              alt="arrow down icon">
          </span>
        </button>

        <div 
          id="yearsButtons"
          class="flex flex-col absolute pt-4 gap-1 max-h-0 overflow-hidden transition-all ease-in-out">
        </div>

      </div>
    </div>
    <div class="flex">
      <div class="bg-secondary-100 rounded-2xl">
        <div class="px-[50px] pt-[30px]">
          <div class="flex justify-between text-neutral-200">
            <div class="flex items-center gap-[6px]">
              <span>
                <img 
                  class="icon w-4" 
                  src="static/images/clock.svg" 
                  alt="clock icon">
              </span>
              <p>Total volume over time</p>
            </div>
            <div 
              class="py-2 bg-[#0A1330] px-6 text-xs tracking-widest rounded-md flex gap-2">
              <img 
                class="icon w-4" 
                src="static/images/calendar.svg" 
                alt="clock icon">
              <span id="chartYear"></span>
            </div>
          </div>
      
          <div class="flex items-center pt-[10px] gap-2 text-[10px]">
            <div id="totalVolume" class="text-2xl"></div>
            <div 
              id="increase"
              class="w-15 h-[18px] border border-[#0C534A] bg-[#0A3942] rounded-sm gap-[1px] px-1 flex items-center hidden">
              <p 
                id="increasePercentage"
                class="text-[#17CA74] flex">
              </p>
              <img 
                class="icon w-2" 
                src="static/images/green-arrow-up.svg" 
                alt="arrow up icon">
            </div>
            <div 
              id="decrease"
              class="h-[18px] border border-[#602D47] bg-[#3A2341] rounded-sm gap-[1px] px-1 flex items-center hidden">
              <p 
                id="decreasePercentage"
                class="text-[#FF5966] flex">
              </p>
              <img 
                class="icon w-2" 
                src="static/images/red-arrow-down.svg" 
                alt="arrow down icon">
            </div>
          </div>

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
  </div>
`
export const mainDashboardJs = async function () {

  const date = new Date();
  const projects = await getProjects();
  const data = formatPageData(projects);
  const chart = document.getElementById('chart');
  const totalVolume = document.getElementById('totalVolume');
  const increase = document.getElementById('increasePercentage');
  const decrease = document.getElementById('decreasePercentage');
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // Create Year Buttons
  createYearButtons(data);
  loadCharts(2025);

  function createYearButtons(data) {
    const yearsButtons = document.getElementById('yearsButtons');
    const selectedYear = document.getElementById('selectedYear');
    const selectedYearText = document.getElementById('selectedYearText');

    const years = []
    for (const [key, value] of Object.entries(data)) {
      years.push(Number(key))
    }
  
    years.sort((b, a) => {
      return a - b;
    })

    let buttonsHtml = ''
    years.forEach((year) => {

      let button = `
        <button 
          data-year="${year}"
          class="w-[92px] border border-[#C93CFE] rounded min-h-8
                hover:bg-white hover:text-primary-200 hover:border-none text-sm tracking-widest">
        ${year}
        </button>
      `

      buttonsHtml += button;
    })
  
    // Add to the DOM
    yearsButtons.innerHTML = buttonsHtml;

    // then Event listeners
    yearsButtons.childNodes.forEach((button) => {
      button.addEventListener('click', (e) => {
        const year = Number.parseInt(e.target.getAttribute('data-year'));
        selectedYearText.innerText = year;
        toggleDropdown()
        loadCharts(year);
      })
    })
    
    selectedYear.addEventListener('click', () => {
     toggleDropdown()
    })

    function toggleDropdown() {
      yearsButtons.classList.toggle('max-h-0');
      yearsButtons.classList.toggle('max-h-40');
      yearsButtons.classList.toggle('duration-700');
    }
  }
  

  function loadCharts(year) {
    const yearlyData = data[year];
    chart.replaceChildren(createChart(yearlyData));
    totalVolume.replaceChildren(getTotalVolume(yearlyData))
    setVolumePercentage(year, yearlyData);
    document.getElementById('chartYear').innerText = year
  }

  function getTotalVolume(yearlyData){
    let totalVolume = 0;

    yearlyData.forEach(month => {
      totalVolume += month.volume;
    })

    return totalVolume;
  }

  function setVolumePercentage(year, yearlyData){

    let firstEntry= 0;
    let lastEntry = 0;
    
    for (let i = 0; i < yearlyData.length; i++) {
      if (yearlyData[i].volume !== 0) {
        if (firstEntry !== 0 ) {
          lastEntry = yearlyData[i].volume;
        } else {
          firstEntry = yearlyData[i].volume;
        }
      }
    }

    // console.log('Current Year', currentYear);
    // console.log('clicked Year: ', year)
    // console.log('First Entry: ', firstEntry);
    // console.log('Last Entry: ', lastEntry);

    if (!firstEntry) {
      return;
    }

    if (year === currentYear) {
      console.log('test')
      lastEntry = yearlyData[currentMonth].volume;

      if (currentMonth === 0) { // January
        increasePercentage.innerText = '100' + '%';
        increase.parentElement.classList.remove('hidden');
        return;
      }
    }
  
    if (lastEntry < firstEntry) {
      decrease.innerText = '-' + calcPercentage(firstEntry, lastEntry) + '%';
      decrease.parentElement.classList.remove('hidden');
    }
    else if (lastEntry > firstEntry) {
      increase.innerText = calcPercentage(lastEntry, firstEntry) + '%';
      increase.parentElement.classList.remove('hidden');
    }


    function calcPercentage(upper, lower) {
      const difference = upper - lower;
      const average = (upper + lower) / 2;
      return ((difference / average) * 100).toFixed(1);
    }
  }

  // Make data in a yearly volume like format
  function formatPageData(projects) {
    const data = {}
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    // Create new object with projects data for the chart
    projects.forEach(project => {

      // Each year
      project.dateVolume.forEach(volume => {

        const year = volume.year;

        // initiate array for each year
        if (!data[year]) {
          data[year] = [];
        }

        // Each month
        for (const [key, value] of Object.entries(volume)) {
          if (Number.isInteger(Number(key)) && !(currentYear === year && key > currentMonth) ) {
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

  function createChart(data) {

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