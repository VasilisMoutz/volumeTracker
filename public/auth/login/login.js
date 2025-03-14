const strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z]).{8,}$");
const errorElements = [];

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = {};

  if (errorElements.length) {
    errorElements.forEach((el) => {
      el.classList.add('hidden');
    })
    errorElements.length = 0;
  }

  formData.forEach((value, key) => {

    let validValue = true;

    // No Input
    if (!value) {
      errorElements.push(document.querySelector(`[data-${key}="required"]`));
      validValue = false;
    }

    // Invalid Password
    if (key === 'password' && value) {
      if (!strongPassword.test(value)) {
        errorElements.push(document.querySelector(`[data-${key}="format"]`))
        validValue = false;
      }
    }

    if (validValue) {
      data[key] = value;
    }

  })

  if (errorElements.length) {
    errorElements.forEach((el) => {
      el.classList.remove('hidden');
    })
    // Do not procceed to http request
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
      window.location.replace(window.location.href = '/');
    } else { 
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});