import secondsConverter from "./secondsConverter.js";

const header = `
  <div class="flex items-center p-10 justify-between flex-auto gap-4">
    <div class="flex gap-[50px] items-center">
      <h2 class="text-xl font-bold">Dashboard</h2>
      <div class="bg-secondary-100">
        <input 
          id="searchBar" 
          type="text" 
          placeholder="Search for..."
          class="w-[352px] h-[42px] border border-secondary-400 rounded p-3">
      </div>
    </div>
  </div>
`
const main = `
  <div id="chunks" class="flex gap-5 ml-10 mb-10">
    <button
      id="daily"
      data-chunk="daily"
      data-active="true"
      class="w-20 bg-primary-100 hover:bg-white hover:text-primary-200 py-1.5 rounded-lg transition">
        Today
    </button>
    <button 
      data-chunk="weekly"
      data-active="false"
      class="w-20 bg-primary-100 hover:bg-white hover:text-primary-200 py-1.5 rounded-lg transition">
        Week
    </button>
    <button 
      data-chunk="monthly"
      data-active="false"
      class="w-20 bg-primary-100 hover:bg-white hover:text-primary-200 py-1.5 rounded-lg transition">
        Month
    </button>
    <button 
      data-chunk="yearly"
      data-active="false"
      class="w-20 bg-primary-100 hover:bg-white hover:text-primary-200 py-1.5 rounded-lg transition">
        Year
    </button>
    <button 
      data-chunk="total"
      data-active="false"
      class="w-20 bg-primary-100 hover:bg-white hover:text-primary-200 py-1.5 rounded-lg transition">
        Total
    </button>
  </div>
  <div 
    class="flex flex-wrap gap-10 justify-center pb-10"
    id="projects-container">
  </div>
`

const volume = `
  
`

export const dashboardJs = async function() {
  const projects = await getProjects();
  const mainContainer = document.getElementById('projects-container');
  const chunks = document.getElementById('chunks').querySelectorAll('button');
  const defaultButton = document.getElementById('daily');

  for (const chunk of chunks) {
    chunk.addEventListener('click', (event) => {

      // Update dashboard
      const chunkClicked = event.target.getAttribute('data-chunk');
      updateChunk(chunkClicked);

      // Update buttons
      for (const button of chunks) {
        if (event.target === button) {
          event.target.setAttribute('data-active', 'true')
          button.classList.add('bg-white');
          button.classList.add('text-primary-200');
        } 
        else {
          if (button.getAttribute('data-active') === 'true') {
            button.setAttribute('data-active', 'false')
            button.classList.remove('bg-white');
            button.classList.remove('text-primary-200');
          }
        }
      }
    })
  }

  defaultButton.click();

//   <div>
//   <img 
//     class="object-cover h-56 w-full rounded-tl-2xl rounded-tr-2xl"
//     src="${project.image}" 
//     alt="${project.name} image">
// </div>

  function updateChunk(chunk) {
      mainContainer.innerHTML = ''
      let projectsToDisplay = findProjects(chunk);
      for (const project of projectsToDisplay) {
        let projectCard = `
            <div class="w-[420px] h-96 relative">
              <div
                style="background-image: url(${project.image})"
                class="h-full w-full bg-cover bg-center bg-no-repeat opacity-50 rounded-2xl">
              </div>
              <div class="absolute top-0 w-full h-full text-center">
                <div class="flex justify-center h-1/2 items-end">
                  <h3 class="text-5xl">${project.name}<h3>
                </div>
                <div class="pb-5 flex h-1/2 items-end justify-center w-full">
                  ${volumeHtml(project, chunk)}
                </div>
              </div>
            </div>
          `
          mainContainer.innerHTML += projectCard;
      }
  }

  function volumeHtml(project, chunk) {
    const volumeType = project.type === 'duration' ? 'Duration' : 'Sessions';
    let volume

    if (volumeType === 'Duration') {
      const duration = secondsConverter(project.volume[chunk]);
      volume = `
        <div class="grid grid-cols-2 gap-3">
          <div class="text-xl drop-shadow-whiteGlow tracking-widest">HOURS</div>
          <div class="text-xl drop-shadow-whiteGlow tracking-widest">MINUTES</div>
          <div class="text-2xl drop-shadow-whiteGlow">${duration.hours}</div>
          <div class="text-2xl drop-shadow-whiteGlow">${duration.minutes}</div>
        </div>
      `
    }
    else {
      volume = `
        <div>
          <p class="text-xl drop-shadow-whiteGlow mb-4 tracking-widest">SESSIONS</p>
          <p class="text-2xl drop-shadow-whiteGlow">${project.volume[chunk]}</p>
        </div>
      `
    }

    return `
      <div>
          ${volume}
        </div>
      </div>
    `
  }


  function findProjects(chunk) {
    return projects.filter((project) => {
      return project.volume[chunk] !== 0;
    })
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
};


export const dashboardHtml = header + main;

