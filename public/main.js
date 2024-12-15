import { dashboardHtml } from "/modules/dashboard.js";
import { createProjectHtml } from "/modules/createProject.js";
import { trackTimeHtml } from "/modules/trackTime.js"

const content = document.getElementById('content');
const initialState = content.innerHTML;
let contentHTML;

history.replaceState(initialState, "", document.location.href);

document.addEventListener("click", async (event) => {
  const dashboard = event.target.getAttribute("data-dashboard");
  const project = event.target.getAttribute("data-create-project");
  const trackTime = event.target.getAttribute("data-track-time");

  if (dashboard) {
    event.preventDefault()
    contentHTML = dashboardHtml;
    history.pushState(contentHTML, "", dashboard);
  }

  if (trackTime){
    event.preventDefault()
    contentHTML = trackTimeHtml;
    history.pushState(contentHTML, "", trackTime);
  }

  if (project) {
    event.preventDefault()
    contentHTML = createProjectHtml;
    history.pushState(contentHTML, "", project);
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






