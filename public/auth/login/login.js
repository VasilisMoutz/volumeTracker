const strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z]).{8,}$");
const errorMessges = [document.querySelector(`[data-passwordFormat]`)];

errorMessges.push()

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = {};

  let formOk;

  formData.forEach((value, key) => {
    formOk = true;

    if (!value) {
      formOk = false;
      requiredNotify.push(key)
    } else {
      requiredNotify.pop(key)
    }

    if (key === 'password') {

      const passwordOk = strongPassword.test(value)
      if (!passwordOk && value) {
        document.querySelector(`[data-passwordFormat]`).classList.remove('hidden');
        formOk = false;
      }
    }
    data[key] = value;
  })

  requiredNotify.forEach((field) => {
    document.querySelector(`[data-${field}Required]`).classList.remove('hidden');
  })

  if (!formOk) {
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const result = await response.json();
      window.location.replace(window.location.href = '/');
    } else { 
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});