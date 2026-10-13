
async function loadSharedHeader() {
  const container = document.querySelector("#shared-header");

  if (!container) return;

  try {
    const response = await fetch("/shared/shared.html");

    if (!response.ok) {
      throw new Error("Could not load the shared header.");
    }

    container.innerHTML = await response.text();

    // Highlight the current page in the navigation.
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    container.querySelectorAll(".site-nav a").forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").pop();

      if (linkPage === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });
  } catch (error) {
    console.error("Header loading failed:", error);
    container.textContent = "Navigation could not be loaded.";
  }
}

loadSharedHeader();

