export const createProjectHtml = `
  <div class="flex justify-center text-neutral-500">
    <div class="mt-20">
      <h1 class="text-xl tracking-wide text-center">Create New Project</h1>
      <form 
        enctype="multipart/form-data"
        id="projectForm"
        class="bg-secondary-100 mt-6 border border-secondary-400 rounded-2xl w-[650px]">
        <div class="px-9 flex flex-col">
          <div class="py-10 flex justify-between">
            <div class="flex items-center gap-2">
              <img class="w-5" src="static/images/project.svg" alt="project icon">
              <label class="text-lg">Project Name</label>
            </div>
            <input 
              name="projectName"
              class="bg-secondary-100 p-[14px] border border-secondary-400 rounded w-[365px]"
              type="text" 
              placeholder="Project"/>
          </div>
          <div class="py-10 flex justify-between">
            <div class="flex items-center gap-2">
              <img class="w-5" src="static/images/trophy.svg" alt="project icon">
              <label class="text-lg">Tracking Type</label>
            </div>
            <fieldset class="flex w-[365px] gap-5">
              
              <div>
                <input 
                  class="hidden peer"
                  type="radio" 
                  id="duration" 
                  name="projectType" 
                  value="duration" 
                  checked />
                <label 
                  for="duration"
                  class="peer-checked:bg-primary-100 
                    border border-secondary-400  px-10 py-5 cursor-pointer">
                    Duration
                 </label>
              </div>
              <div>
                <input 
                  class="hidden peer"
                  type="radio" 
                  id="frequency" 
                  name="projectType" 
                  value="frequency"/>
                <label 
                  class="peer-checked:bg-primary-100 
                  border border-secondary-400  px-10 py-5 cursor-pointer"
                  for="frequency">
                    Frequency
                  </label>
              </div>
            </fieldset>
          </div>
          <div class="h-[1px] w-full bg-secondary-400"></div>
            <div class="py-10 flex justify-between">
              <div class="flex items-center gap-2">
                <img class="w-5" src="static/images/img.svg" alt="Photo icon">
                <label class="text-lg">Photo</label>
              </div>
              <input 
                type="file" 
                name="projectImage" 
                accept="image/png, image/jpeg" />
          </div>
          <button 
            type="submit"
            class="w-[240px] py-[14px] bg-gradient-to-r from-violet-500 to-fuchsia-500 
                  rounded text-center self-center mb-8">
            Create Project
          </button>
        </div>
      </form>
    </div>
  </div>
`

export const createProjectJs = function() {
  document.getElementById('projectForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/project/create', {
        method: 'POST',
        body: formData
      })
  
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else { 
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  })
}