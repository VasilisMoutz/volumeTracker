import { createProjectHtml, createProjectJs } from "/static/modules/createProject.js";
import { trackTimeHtml, trackJs } from "/static/modules/trackTime.js"
import { getProjectTrackingHtml, projectTrackingJS } from "./modules/projectTracking.js";
import { mainDashboardHtml, mainDashboardJs } from "./modules/mainDashboard.js";

const content = document.getElementById("content");
const navLinks = document.querySelectorAll("button");
const account = document.getElementById("NameFirstLatter");
const fullName = document.getElementById("FullName");
const initialState = content.innerHTML;
const buttons = document.querySelectorAll('button');
const dashboardBtn = document.getElementById('dashboard-btn');
let contentHTML;
const pages = ['Create New Project', 'TRACK VOLUME']

initialLoad();

document.addEventListener('card-clicked', (event) => {
  loadProjectTracking(event.detail)
});


// Add event listeners to the nav buttons
buttons.forEach(button => {
  button.addEventListener("click", async (event) => {
    const buttonType = event.target.getAttribute("data");
    switch (buttonType) {
      case 'dashboard':
        handleNavClick(event, mainDashboardHtml, '/');
        mainDashboardJs();
        break;
      case 'create-project':
        handleNavClick(event, createProjectHtml,  buttonType);
        createProjectJs();
        break;
      case 'track-time':
        const useCache = event.isTrusted;
        handleNavClick(event, trackTimeHtml,  buttonType);
        trackJs(useCache);
        break;
    }
  })
})

// handle user goes back
window.addEventListener("popstate", (event) => {
  if (event.state) {
    contentHTML = event.state;
    if (contentHTML) {
      pages.forEach(page => {
        if (contentHTML.includes(page)) {
            dashboardBtn.click();
          }
        });
      }
    }
});

function handleNavClick(event, html, url) {
  event.preventDefault()
  addClickedStyles(event);
  content.innerHTML = html;
  history.pushState(html, "", url)
}

function addClickedStyles(event) {
  event.target.setAttribute('active', 'true')
  navLinks.forEach(element => {
    if (element.getAttribute('active') === 'true'){
      if (element !== event.target) {
        element.classList.remove('md:border-l-4');
        element.classList.remove('md:bg-primary-200');
        element.classList.remove('md:ml-4');
        element.classList.remove('md:text-white');
        element.classList.remove('bg-primary-300');
        element.setAttribute('active', 'false');
      } else {
        element.classList.add('md:border-l-4');
        element.classList.add('md:bg-primary-200');
        element.classList.add('md:ml-4');
        element.classList.add('md:text-white')
        element.classList.add('bg-primary-300')
      }
    }  
  });
}

function initialLoad() {
  history.replaceState(initialState, "", document.location.href);
  const allcookies = document.cookie;
  let pairs = allcookies.split(";");
  const cookieName = 'userDetails='
  let userDetails

  pairs.forEach(element => {
    let cookie = decodeURIComponent(element);
   
    if (cookie.startsWith(cookieName)) {
      userDetails = JSON.parse(cookie.substring(cookieName.length))
    }
  });

  fullName.innerHTML = userDetails.firstname + ' ' + userDetails.lastname;
  account.innerHTML = userDetails.firstname[0];
  content.innerHTML = mainDashboardHtml;
  mainDashboardJs();
}

function loadProjectTracking(data) {
  // Generate the html and load it
  content.innerHTML = getProjectTrackingHtml(data)
  projectTrackingJS(data);
}

