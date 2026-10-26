/* =========================================
   RAE BROOKE PHOTOGRAPHY
   SHARED HEADER + DROPDOWN MENU
========================================= */

async function loadSharedHeader() {
  const container = document.querySelector("#shared-header");

  if (!container) {
    console.error(
      "Shared header placeholder not found."
    );
    return;
  }

  if (
    container.dataset.loading === "true" ||
    container.dataset.loaded === "true"
  ) {
    return;
  }

  container.dataset.loading = "true";

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
        "The header menu button or dropdown was not found in header.html."
      );
    }

    /* =====================================
       OPEN AND CLOSE MENU
    ===================================== */

    function menuIsOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    
function openMenu() {
  dropdown.hidden = false;
  toggle.setAttribute("aria-expanded", "true");

  if (window.matchMedia("(max-width: 600px)").matches) {
    document.body.style.overflow = "hidden";
    document.body.classList.add("mobile-menu-open");
  }
}

function closeMenu(returnFocus = false) {
  dropdown.hidden = true;
  toggle.setAttribute("aria-expanded", "false");

  document.body.style.overflow = "";
  document.body.classList.remove("mobile-menu-open");

  if (returnFocus) {
    toggle.focus();
  }
}

    toggle.addEventListener("click", () => {
      if (menuIsOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* =====================================
       CLOSE AFTER NAVIGATION
    ===================================== */

    dropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    /* =====================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================== */

    document.addEventListener("click", (event) => {
      if (menuIsOpen() && !container.contains(event.target)) {
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

    container.dataset.loaded = "true";

  } catch (error) {
    console.error("Error loading shared header:", error);
  } finally {
    delete container.dataset.loading;
  }
}

