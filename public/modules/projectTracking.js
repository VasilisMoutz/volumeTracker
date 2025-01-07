const frequencyCounter = `
      <div class="flex items-center text-6xl mt-5">
        <button 
          id="decrease"
          class="bg-secondary-100 hover:bg-primary-100 transition w-32 h-32 flex justify-center items-center">
          <p class="text-7xl mb-4">-</p>
        </button>
        <div class="w-32 h-32 flex justify-center items-center">
          <p id="count"></p>
        </div>
        <button 
          id="increase"
          class="bg-secondary-100 hover:bg-primary-100 transition w-32 h-32 flex justify-center items-center">
          +
        </button>
      </div>
    `;

function generateHtml(data) {
  const type = data.type == 'duration' ? 'hours' : 'sessions';
  let counterHtml;
  let buttonText;
  
  if (type === 'sessions') {
    counterHtml = frequencyCounter;
    buttonText = 'Add Sessions';
  }

  return `
    <div class="relative">
      <header
        style="background-image: url(${data.image})"
        class="h-64 w-full bg-cover bg-center bg-no-repeat opacity-50">
      </header>
      <div class="absolute top-0 pt-10 pl-10">
        <h1 class="text-5xl font-bold">${data.name}</h1>
        <p class="text-lg">Total ${data.totalVol} ${type} Tracked</p>
      </div>
    </div>
    <div>
      <div class="flex items-center justify-center pt-16 flex-col">
          <h2 class="text-2xl">Today's ${type}</h2>
          ${counterHtml}
      </div>
      <div class="flex justify-center">
        <button 
          id="submitVolume"
          class="w-[384px] py-[20px] bg-gradient-to-r from-violet-500 to-fuchsia-500 
          rounded text-center self-center mt-4">
          ${buttonText}
        </button>
      </div>
    </div>
  `
}

export const getProjectTrackingHtml = function(data){
  return generateHtml(data)
}

export const projectTrackingJS = function(data) { 
  const countDom = document.getElementById('count');
  const submitBtn = document.getElementById('submitVolume');
  let count = 0;
  countDom.innerHTML = count;
 
  if (data.type == 'frequency') {
    const increaseBtn = document.getElementById('increase');
    const decreaseBtn = document.getElementById('decrease');    
  
    increaseBtn.addEventListener('click', () => {
      count++;
      countDom.innerHTML = count;
    })

    decreaseBtn.addEventListener('click', () => {
      count--;
      count = count < 0 ? 0 : count;
      countDom.innerHTML = count;
    })
  }

  submitBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/projects/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          projectId: data.id,
          volume: count
        })
      })
    } catch (err) {
      console.log(err);
    }
  })
}