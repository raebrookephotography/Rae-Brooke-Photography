document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("shared-sticky-nav");

  if (!container) {
    console.error('Missing element: #shared-sticky-nav');
    return;
  }

  try {
    const response = await fetch("/Views/Shared/sticky-nav.html");

    if (!response.ok) {
      throw new Error(`Navigation request failed: ${response.status}`);
    }

    container.innerHTML = await response.text();

    // Identify the current page.
    const path = window.location.pathname;

    const filename = path.split("/").filter(Boolean).pop() || "index";
    const page = filename.replace(/\.html$/, "");
    const pageName = page === "index" ? "home" : page;

    // Highlight the current navigation link.
    container.querySelectorAll(".sticky-links a").forEach(link => {
      if (link.dataset.page === pageName) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

  } catch (error) {
    console.error("Unable to load sticky navigation:", error);
  }
});
