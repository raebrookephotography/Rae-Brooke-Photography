document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("shared-sticky-nav");

  if (!container) {
    console.error("Sticky navigation container not found.");
    return;
  }

  try {
    const navUrl = new URL("/Views/Shared/sticky-nav.html", window.location.origin);
    const response = await fetch(navUrl);

    if (!response.ok) {
      throw new Error(`Navigation HTML returned ${response.status}`);
    }

    container.innerHTML = await response.text();

    // Treat the root URL and index.html as the homepage.
    const pathname = window.location.pathname.replace(/\/+$/, "");
    const isHomePage =
      pathname === "" ||
      pathname === "/" ||
      pathname === "/index.html";

    const currentPage = isHomePage
      ? "home"
      : pathname.split("/").pop().replace(/\.html$/, "");

    container.querySelectorAll(".sticky-links a").forEach(link => {
      if (link.dataset.page === currentPage) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

  } catch (error) {
    console.error("Unable to load sticky navigation:", error);
  }
});
