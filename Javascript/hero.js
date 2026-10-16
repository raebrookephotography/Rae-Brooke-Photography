async function loadSharedHero() {
  const container = document.getElementById("shared-hero");

  if (!container || container.dataset.loading === "true" ||
      container.dataset.loaded === "true") {
    return;
  }

  container.dataset.loading = "true";

  try {
    const settings = { ...container.dataset };

    const response = await fetch("/Views/Shared/hero.html");

    if (!response.ok) {
      throw new Error("Could not load the shared hero.");
    }

    container.innerHTML = await response.text();

    const image = container.querySelector(".hero-image");
    const heading = container.querySelector(".hero-content h1");
    const subtitle = container.querySelector(".hero-subtitle");
    const button = container.querySelector(".hero-button");
    const scroll = container.querySelector(".hero-scroll");

    if (!image || !heading || !subtitle || !button || !scroll) {
      throw new Error("Required hero elements are missing.");
    }

    image.src = settings.image || "";
    image.alt = settings.alt || "";
    image.fetchPriority = "high";

    container.querySelector(".eyebrow").textContent =
      settings.eyebrow || "";

    // Preserve line breaks and allow trusted HTML such as <em>.
    heading.replaceChildren();

    (settings.title || "").split("|").forEach((line, index) => {
      if (index > 0) {
        heading.appendChild(document.createElement("br"));
      }

      const template = document.createElement("template");
      template.innerHTML = line;
      heading.appendChild(template.content);
    });

    // Allow emphasis in the subtitle.
    subtitle.innerHTML = settings.subtitle || "";

    button.href = settings.buttonUrl || "#";
    container.querySelector(".hero-button-text").textContent =
      settings.buttonText || "";

    scroll.href = settings.scrollTarget || "#about";
    scroll.setAttribute(
      "aria-label",
      settings.scrollLabel || "Scroll to discover more"
    );

    // Initialize the header after its placeholder exists.
    await loadSharedHeader();

    container.dataset.loaded = "true";

  } catch (error) {
    console.error("Hero loading failed:", error);
  } finally {
    delete container.dataset.loading;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSharedHero, {
    once: true
  });
} else {
  loadSharedHero();
}
