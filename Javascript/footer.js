async function loadSharedFooter() {
  const container = document.querySelector("#shared-footer");

  if (!container || container.dataset.loading === "true" ||
      container.dataset.loaded === "true") {
    return;
  }

  container.dataset.loading = "true";

  try {
    const response = await fetch("/Views/Shared/footer.html");

    if (!response.ok) {
      throw new Error("Could not load the shared footer.");
    }

    container.innerHTML = await response.text();

    // Highlight the current page in the navigation.
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    container.querySelectorAll(".site-nav a").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href) return;

      const linkPage = href.split("#")[0].split("/").pop();

      if (linkPage === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });

    container.dataset.loaded = "true";

  } catch (error) {
    console.error("Footer loading failed:", error);
    container.textContent = "Navigation could not be loaded.";
  } finally {
    delete container.dataset.loading;
  }
}

// Run whether the script loads before or after DOMContentLoaded.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSharedFooter, {
    once: true
  });
} else {
  loadSharedFooter();
}
