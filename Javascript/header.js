/* =========================================
   RAE BROOKE PHOTOGRAPHY
   SHARED HEADER + DROPDOWN MENU
========================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("shared-header");

  if (!container) {
    return;
  }

  try {
    const response = await fetch("/header.html");

    if (!response.ok) {
      throw new Error(
        `Unable to load header.html: ${response.status}`
      );
    }

    const html = await response.text();

    container.innerHTML = html;

    const toggle = container.querySelector(".hero-menu-toggle");
    const dropdown = container.querySelector(".hero-dropdown");

    if (!toggle || !dropdown) {
      console.error("The hero menu button or dropdown was not found.");
      return;
    }

    /* Open and close the dropdown */

    function openMenu() {
      dropdown.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu(returnFocus = false) {
      dropdown.hidden = true;
      toggle.setAttribute("aria-expanded", "false");

      if (returnFocus) {
        toggle.focus();
      }
    }

    function menuIsOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    toggle.addEventListener("click", () => {
      if (menuIsOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Close after selecting a page */

    dropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    /* Close when clicking anywhere outside the menu */

    document.addEventListener("click", (event) => {
      if (
        menuIsOpen() &&
        !container.contains(event.target)
      ) {
        closeMenu();
      }
    });

    /* Close the menu with Escape */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuIsOpen()) {
        closeMenu(true);
      }
    });

    /* Close when the browser window is resized */

    window.addEventListener("resize", () => {
      if (menuIsOpen()) {
        closeMenu();
      }
    });

  } catch (error) {
    console.error("Error loading the shared header:", error);
  }
});
