async function loadSharedHero() {
  const container = document.getElementById("shared-hero");

  if (
    !container ||
    container.dataset.loading === "true" ||
    container.dataset.loaded === "true"
  ) {
    return;
  }

  container.dataset.loading = "true";

  try {
    // Save this page's custom hero settings before inserting the template.
    const settings = { ...container.dataset };

    const response = await fetch("/Views/Shared/hero.html");

    if (!response.ok) {
      throw new Error(
        `Could not load shared hero: ${response.status}`
      );
    }

    const html = await response.text();

    container.innerHTML = html;

    const image = container.querySelector(".hero-image");
    const eyebrow = container.querySelector(".eyebrow");
    const heading = container.querySelector(".hero-content h1");
    const subtitle = container.querySelector(".hero-subtitle");
    const button = container.querySelector(".hero-button");
    const buttonText = container.querySelector(".hero-button-text");
    const scroll = container.querySelector(".hero-scroll");

    if (
      !image ||
      !eyebrow ||
      !heading ||
      !subtitle ||
      !button ||
      !buttonText ||
      !scroll
    ) {
      throw new Error(
        "One or more required hero elements are missing from hero.html."
      );
    }

    /* =====================================
       HERO IMAGE
    ===================================== */

    image.src = settings.image || "";
    image.alt = settings.alt || "";
    image.fetchPriority = "high";

    /* =====================================
       EYEBROW
    ===================================== */

    eyebrow.textContent = settings.eyebrow || "";

    /* =====================================
       HEADING
       Use | for line breaks.
       Supports trusted HTML such as <em>.
    ===================================== */

    heading.replaceChildren();

    (settings.title || "").split("|").forEach((line, index) => {
      if (index > 0) {
        heading.appendChild(document.createElement("br"));
      }

      const template = document.createElement("template");
      template.innerHTML = line;

      heading.appendChild(template.content);
    });

    /* =====================================
       SUBTITLE
       Supports trusted HTML such as <em>.
    ===================================== */

    subtitle.innerHTML = settings.subtitle || "";

    /* =====================================
       CALL-TO-ACTION BUTTON
    ===================================== */

    button.href = settings.buttonUrl || "#";
    buttonText.textContent = settings.buttonText || "";

    /* =====================================
       SCROLL LINK
    ===================================== */

    scroll.href = settings.scrollTarget || "#about";

    scroll.setAttribute(
      "aria-label",
      settings.scrollLabel || "Scroll to discover more"
    );

    /* =====================================
       LOAD SHARED HEADER
    ===================================== */

    if (typeof loadSharedHeader !== "function") {
      throw new Error(
        "loadSharedHeader() is unavailable. Check that header.js loads before hero.js."
      );
    }

    await loadSharedHeader();

    container.dataset.loaded = "true";

  } catch (error) {
    console.error("Hero loading failed:", error);
  } finally {
    delete container.dataset.loading;
  }
}

/* =========================================
   INITIALIZE HERO
========================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSharedHero, {
    once: true
  });
} else {
  loadSharedHero();
}
