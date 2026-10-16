/* =========================================
   RAE BROOKE PHOTOGRAPHY
   SHARED HEADER + DROPDOWN MENU
========================================= */

async function loadSharedHeader() {
  const container = document.getElementById("shared-header");

  if (!container || container.dataset.loaded === "true") {
    return;
  }

  try {
    const response = await fetch("/Views/Shared/header.html");

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
      throw new Error(
        "The hero menu button or dropdown was not found."
      );
    }

    // Mark the header as loaded after successful initialization.
    container.dataset.loaded = "true";

    /* =====================================
       OPEN AND CLOSE THE DROPDOWN
    ===================================== */

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

    /* =====================================
       CLOSE AFTER SELECTING A PAGE
    ===================================== */

    dropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    /* =====================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================== */

    document.addEventListener("click", (event) => {
      if (
        menuIsOpen() &&
        !container.contains(event.target)
      ) {
        closeMenu();
      }
    });

    /* =====================================
       CLOSE WITH ESCAPE
    ===================================== */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuIsOpen()) {
        closeMenu(true);
      }
    });

    /* =====================================
       CLOSE ON WINDOW RESIZE
    ===================================== */

    window.addEventListener("resize", () => {
      if (menuIsOpen()) {
        closeMenu();
      }
    });

  } catch (error) {
    console.error("Error loading the shared header:", error);
  }
}

/* =========================================
   INITIALIZE WHENEVER THE SCRIPT LOADS
========================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSharedHeader, {
    once: true
  });
} else {
  loadSharedHeader();
}
