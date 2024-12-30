import { dashboardHtml } from "/static/modules/dashboard.js";
import { createProjectHtml } from "/static/modules/createProject.js";
import { trackTimeHtml } from "/static/modules/trackTime.js"

const content = document.getElementById("content");
const navLinks = document.querySelectorAll("button");
const initialState = content.innerHTML;
let contentHTML;

history.replaceState(initialState, "", document.location.href);

initialLoad();

document.addEventListener("click", async (event) => {

  const clickedItem = event.target.getAttribute("data");

  switch (clickedItem) {
    case 'dashboard':
      event.preventDefault()
      addClickedStyles(event);
      contentHTML = dashboardHtml;
      history.pushState(contentHTML, "", '/');
      break;
    case 'create-project':
      event.preventDefault()
      addClickedStyles(event);
      contentHTML = trackTimeHtml;
      history.pushState(contentHTML, "", clickedItem);
      break;
    case 'track-time':
      event.preventDefault()
      addClickedStyles(event);
      contentHTML = createProjectHtml;
      history.pushState(contentHTML, "", clickedItem);
      break;
  }
  content.innerHTML = contentHTML;
})

window.addEventListener("popstate", (event) => {
  if (event.state) {
    contentHTML = event.state;

    if (contentHTML) {
      content.innerHTML = contentHTML;
    }
  }
});

function addClickedStyles(event) {

  event.target.setAttribute('active', 'true')

  navLinks.forEach(element => {
    if (element.getAttribute('active') === 'true'){
      if (element !== event.target) {
        element.classList.remove('border-l-4');
        element.classList.remove('bg-primary-200');
        element.classList.remove('ml-4');
        element.setAttribute('active', 'false');
      } else {
        element.classList.add('border-l-4');
        element.classList.add('bg-primary-200');
        element.classList.add('ml-4');
      }
    }  
  });
}

function initialLoad() {
  contentHTML = dashboardHtml;
  history.pushState(contentHTML, "", '/');
  content.innerHTML = contentHTML;
}





