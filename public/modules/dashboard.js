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

export const dashboardJs = function() {

  const timePeriods = document.getElementById('timePeriods');
  const periodsBtn = document.getElementById('periodsBtn');

  periodsBtn.addEventListener('click', () => {
      timePeriods.classList.toggle('hidden');
    })
};

export const dashboardHtml = header;
