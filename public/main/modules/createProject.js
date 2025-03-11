export const createProjectHtml = `
  <h2 class="text-xl font-bold tracking-wide mt-10 ml-5 lg:text-center">New Project</h2>
  <div class="flex justify-center text-neutral-500">
      <form 
        enctype="multipart/form-data"
        id="projectForm"
        class="bg-secondary-100 mt-6 rounded-2xl w-full ml-2 mr-10 max-w-[350px] lg:max-w-[650px]">
        <div class="px-6 md:px-9 flex flex-col">
          <div class="pt-10 pb-5 lg:py-10 flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between">
            <div class="flex items-center gap-2">
              <img class="w-4 lg:w-5" src="../images/project.svg" alt="project icon">
              <label class="text-sm lg:text-lg">Project Name</label>
            </div>
            <input 
              name="projectName"
              class="p-3 text-sm lg:p-[14px] bg-primary-200 rounded w-full lg:w-[365px]"
              type="text" 
              placeholder="Project"/>
          </div>
          <div class="py-5 lg:py-10 flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between">
            <div class="flex items-center gap-2">
              <img class="w-4 lg:w-5" src="../images/trophy.svg" alt="project icon">
              <label class="text-sm lg:text-lg">Tracking Type</label>
            </div>
            <fieldset class="flex w-full lg:w-[365px] gap-2 md:gap-5">
              
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
                  class="peer-checked:bg-primary-100 text-xs tracking-widest lg:text-md rounded-md
                    border border-secondary-400 py-3 lg:py-4 cursor-pointer w-[110px] lg:w-[140px] flex justify-center">
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
                  class="peer-checked:bg-primary-100 text-xs tracking-widest lg:text-md rounded-md
                  border border-secondary-400 py-3 lg:py-4 cursor-pointer w-[110px] lg:w-[140px] flex justify-center"
                  for="frequency">
                    Frequency
                  </label>
              </div>
            </fieldset>
          </div>
        
          <div class="py-5 lg:py-10 flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between">
            <div class="flex items-center gap-2">
              <img class="w-4 lg:w-5" src="../images/img.svg" alt="Photo icon">
              <label class="text-sm lg:text-lg">Photo</label>
            </div>
            <div class="flex w-full lg:w-[365px]">
              <label>
                <input 
                  id="projectImage"
                  type="file" 
                  name="projectImage" 
                  accept="image/png, image/jpeg"
                  class="text-xs text-grey-500 w-full
                  file:mr-2 md:file:mr-5 file:py-2 file:px-3 lg:file:px-6
                  file:rounded-full file:border-0
                  file:text-xs lg:file-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:cursor-pointer hover:file:bg-amber-50
                  hover:file:text-amber-700
                "/>
              </label>
            </div>
          </div>

          <button 
            type="submit"
            class="mt-8 lg:mt-0 w-full lg:w-[240px] py-3 lg:py-[14px] bg-gradient-to-r from-violet-500 to-fuchsia-500 
                  rounded text-center self-center mb-8">
            Create Project
          </button>
        </div>
      </form>
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
        document.getElementById('trackTime').click()
      }
      else if (response.statusText === 'No token found') {
        location.reload();
      } 
      else { 
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  })
}