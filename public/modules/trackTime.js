const header = `
  <div class="flex items-center p-10 justify-between flex-auto gap-4">
    <div class="flex gap-[50px] items-center">
      <h2 class="text-xl font-bold">Track Time</h2>
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
  <div 
    class="flex flex-wrap gap-4 p-10"
    id="projects-container">
  </div>
`

export const trackJs = async function() {
  const projects = await getProjects();
  const mainContainer = document.getElementById('projects-container');
  const projectNames = [];
  const searchBar = document.getElementById('searchBar').addEventListener("input", (event) => {
    const searchText = event.target.value;
    searchProjects(searchText);
  });

  // Creating the cards
  for (const project of projects) {
    let projectCard = `
      <div
        data-name="${project.name}"
        data-id="${project.id}"
        class="card w-[320px] cursor-pointer group">
        <div class="w-full overflow-hidden rounded-tl-2xl rounded-tr-2xl">
          <img 
            class="object-cover h-56 w-full 
            transition duration-300 group-hover:scale-110"
            src="${project.image}" 
            alt="${project.name} image">
        </div>
        <div 
          class="h-32 w-full rounded-2xl bg-white text-primary-200
          relative bottom-5 flex items-center justify-center">
            <h3 class="text-2xl">${project.name}<h3>
        <div>
      </div>
    `
    mainContainer.innerHTML += projectCard;
    projectNames.push(project.name);
  }

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



  // Fetch all projects
  async function getProjects() {
    try {
      const response = await fetch('/api/projects/get', {method: 'GET'});
      if (response.ok) {
        const result = await response.json();
        return result;
      }
      else if (response.statusText === 'No token found') {
        location.reload();
      }
      else { 
        console.error('Error:', response.statusText);
      }
    } catch (err) {
      console.log(err);
    }
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
};

export const trackTimeHtml = header + main;

export const projectHtml = ''