import { secondsConverter } from "./converters.js";

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

const durationCounter = `
      <input 
        id="timerInput"
        class="font-mono bg-transparent text-3xl w-[160px] 
              text-right caret-white outline-none p-2"
        inputmode="numeric" 
        placeholder="00:00:00">
`

function generateHtml(data) {

  const type = data.type == 'duration' ? 'hours' : 'sessions';
  let counterHtml;
  let buttonText;
  let volume;
  
  if (type === 'sessions') {
    counterHtml = frequencyCounter;
    buttonText = 'Add Sessions';
    volume = data.volume.total;
  }

  if (type === 'hours') {
    counterHtml = durationCounter;
    buttonText = 'Add duration';
    volume = secondsConverter(data.volume.total);
    volume = volume.hours;
  }

  return `
    <div class="relative">
      <header
        style="background-image: url(${data.image})"
        class="h-64 w-full bg-cover bg-center bg-no-repeat opacity-50">
      </header>
      <div class="absolute top-0 pt-10 pl-10">
        <h1 class="text-5xl font-bold">${data.name}</h1>
        <p class="text-lg">Total ${volume} ${type} Tracked</p>
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
  return generateHtml(data);
}

export const projectTrackingJS = function(data) { 
  const submitBtn = document.getElementById('submitVolume');
  let volume;

  if (data.type == 'frequency') {
    const countDom = document.getElementById('count');
    const increaseBtn = document.getElementById('increase');
    const decreaseBtn = document.getElementById('decrease');   

    volume = 0;
    countDom.innerHTML = volume; 
  
    increaseBtn.addEventListener('click', () => {
      volume++;
      countDom.innerHTML = volume;
    })

    decreaseBtn.addEventListener('click', () => {
      volume--;
      volume = volume < 0 ? 0 : volume;
      countDom.innerHTML = volume;
    })
  }


  if (data.type == 'duration') {
    const timerInput = document.getElementById('timerInput');
    let seconds;
    let minutes;
    let hours;
    let secondsDigit1 = '0';
    let secondsDigit2 = '0';
    let minutesDigit1 = '0';
    let minutesDigit2 = '0';
    let hoursDigit1 = '0';
    let hoursDigit2 = '0';

    timerInput.addEventListener('keydown', (event) => {
      event.preventDefault()

      if (event.key === 'Backspace') {
        removeInput();
      } else if (Number.isNaN(Number.parseInt(event.key))) {
        return;
      } else {
        addInput()
      }

      hours = hoursDigit2 + hoursDigit1;
      minutes = minutesDigit2 +  minutesDigit1;
      seconds = secondsDigit2 + secondsDigit1;

      volume = `${hours}:${minutes}:${seconds}`;

      timerInput.value = volume;
      
      function removeInput() {
        secondsDigit1 = secondsDigit2;
        secondsDigit2 = minutesDigit1;
        minutesDigit1 = minutesDigit2;
        minutesDigit2 = hoursDigit1;
        hoursDigit1 = hoursDigit2;
        hoursDigit2 = '0';
      }

      function addInput() {
        hoursDigit2 = hoursDigit1;
        hoursDigit1 =  minutesDigit2;
        minutesDigit2 = minutesDigit1;
        minutesDigit1 = secondsDigit2;
        secondsDigit2 = secondsDigit1
        secondsDigit1 = event.key;
      }
    })
    
  }

  submitBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/projects/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          projectId: data.id,
          volume: volume
        })
      })
      if (response.statusText === 'No token found') {
        location.reload();
      }
      if (response.ok) {
        document.getElementById('trackTime').click();
      }
    } catch (err) {
      console.log(err);
    }
  })
}