import { getProjects } from "./helpers.js";
import { noProjectsYetHtml, noProjectsYetJs } from "./noProjectsYet.js";

const projectsFetched = await getProjects();
const projectsExist = projectsFetched.length;
const cacheKey = "projects";

const header = `
  <div class="flex items-center mt-10 ml-5 lg:m-10 justify-between flex-auto gap-4">
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-[50px] lg:items-center">
      <h2 class="text-xl font-bold">Track Time</h2>
      <div class="bg-secondary-100">
        <input 
          id="searchBar" 
          type="text" 
          placeholder="Search for..."
          class="w-full lg:w-[352px] h-[42px] border border-secondary-400 rounded p-3">
      </div>
    </div>
  </div>
`

const projectsContainer = `
  <div 
    class="flex flex-wrap gap-4 p-5 lg:p-10"
    id="projects-container">
  </div>
`

const output = projectsExist ? header + projectsContainer : noProjectsYetHtml;

export const trackTimeHtml = output;

export const trackJs = async function(useCached) {

  if (projectsExist) {
    // check if a user made an update to the projects volume fetch new data
    const projects = useCached ? projectsFetched : await getProjects();
    showProjects(projects);
  } else {
    noProjectsYetJs('track');
    return;
  }
  
  function showProjects(projects){
    const mainContainer = document.getElementById('projects-container');

    // Creating the cards
    for (const project of projects) {
      let projectCard = `
        <div
          data-name="${project.name}"
          data-id="${project.id}"
          class="card w-full max-w-[320px] cursor-pointer group">
          <div class="w-full overflow-hidden rounded-tl-2xl rounded-tr-2xl">
            <img 
              class="object-cover h-56 w-full 
              transition duration-300 group-hover:scale-110"
              src="${project.image}" 
              alt="${project.name} image">
          </div>
          <div 
            class="h-24 lg:h-32 w-full rounded-2xl bg-white text-primary-200
            relative bottom-5 flex items-center justify-center">
              <h3 class="text-2xl">${project.name}<h3>
          <div>
        </div>
      `
      mainContainer.innerHTML += projectCard;
    }


    // Add event listener to all cards
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
      const projectId = card.getAttribute('data-id');
      const projectData = projects.find((project) => project.id === projectId)
      card.addEventListener('click', () => {
        const event = new CustomEvent("card-clicked", {detail: projectData})
        document.dispatchEvent(event);
      })
    }

    // Add event listener to searchBar
    document.getElementById('searchBar').addEventListener("input", (event) => {
      const searchText = event.target.value;
      searchProjects(searchText);
    });

    // Search Function
    function searchProjects(text) {
      Array.from(mainContainer.children).forEach((item) => {
        const itemName = item.getAttribute("data-name").toLocaleLowerCase();
        if (!itemName.includes(text.toLocaleLowerCase())) {
          item.classList.add('hidden')
        } else {
          item.classList.remove('hidden')
        }
      });
    }

    // Cache the whole thing
    sessionStorage.setItem(cacheKey, "value");
  }
};

