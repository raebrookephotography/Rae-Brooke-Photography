document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("shared-sticky-nav");

  if (!container) return;

  try {
    const response = await fetch("/HTML/sticky-nav.html");

    if (!response.ok) {
      throw new Error(`Failed to load navigation: ${response.status}`);
    }

    container.innerHTML = await response.text();

    // Highlight the current page.
    const currentPage = window.location.pathname
      .split("/")
      .pop()
      .replace(/\.html$/, "") || "index";

    const pageName = currentPage === "index" ? "home" : currentPage;

    const currentLink = container.querySelector(
      `[data-page="${pageName}"]`
    );

    if (currentLink) {
      currentLink.setAttribute("aria-current", "page");
    }

  } catch (error) {
    console.error("Unable to load the shared navigation:", error);
  }
});
