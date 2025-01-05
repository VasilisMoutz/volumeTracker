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
    <div class="relative">
      <button id="periodsBtn" class="bg-primary-100 w-[84px] h-[30px] rounded-lg text-xs">Sort by</button>
      <div 
        id="timePeriods" 
        class="hidden flex flex-col absolute bg-secondary-100 w-full text-xs rounded-lg mt-2">
        <a class="hover:bg-white hover:text-primary-200 text-center w-full py-3 rounded" href="#">Today</a>
        <a class="hover:bg-white hover:text-primary-200 text-center w-full py-3 rounded" href="#">Week</a>
        <a class="hover:bg-white hover:text-primary-200 text-center w-full py-3 rounded" href="#">Month</a>
        <a class="hover:bg-white hover:text-primary-200 text-center w-full py-3 rounded" href="#">Year</a>
      </div>
    </div>
  </div>
`

const main = `
  <div 
    class="flex flex-wrap gap-4 justify-center"
    id="projects-container">
  </div>
`

export const dashboardJs = async function() {
  const timePeriods = document.getElementById('timePeriods');
  const periodsBtn = document.getElementById('periodsBtn');
  const projects = await getProjects();
  const mainContainer = document.getElementById('projects-container');

  for(const project of projects) {
    let projectCard = `
      <div class="w-[320px]">
        <div>
          <img 
            class="object-cover h-56 w-full rounded-tl-2xl rounded-tr-2xl"
            src="${project.image}" 
            alt="${project.name} image">
        </div>
        <div 
          class="h-56 w-full rounded-tl-2xl rounded-tr-2xl 
          relative bottom-5 bg-secondary-100 block">
          <div class="pt-10 px-5">
            <h3>${project.name}<h3>
          </div>
        <div>
      </div>
    `
    mainContainer.innerHTML += projectCard;
  }

  periodsBtn.addEventListener('click', () => {
      timePeriods.classList.toggle('hidden');
    })

  async function getProjects() {
    try {
      const response = await fetch('/api/project/get', {method: 'GET'});
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
