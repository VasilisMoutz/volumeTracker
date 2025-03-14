export const noProjectsYetHtml = `
    <div class="flex justify-center flex-col items-center w-full">
    <img
      id="noProjectImg"
      class="w-full max-w-[400px]">
    <h3 class="text-lg md:text-2xl tracking-wider">No projects found...</h3>
    <button 
      id="createProject"
      class="border border-primary-100 p-3 md:p-4 mt-6 text-primary-100 tracking-widest rounded-xl
            hover:bg-primary-100 hover:text-white transition text-sm md:text-lg">
      Create your first project
    </button>
  </div>
`

export function noProjectsYetJs(source) {
  const noProjectImg = document.getElementById('noProjectImg');

  switch(source) {
    case 'main-dash': 
      noProjectImg.src = "../images/noProjectsYet.svg"
    case 'track':
      noProjectImg.src = "../images/noProjectsYet.svg"
  }
}
