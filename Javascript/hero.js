document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("shared-hero");

  if (!container) return;

  try {
    const response = await fetch("/Views/Shared/hero.html");

    if (!response.ok) {
      throw new Error("Could not load the shared hero.");
    }

    const html = await response.text();
    container.innerHTML = html;

    // Read this page's hero settings
    const settings = container.dataset;
    const hero = container.querySelector(".hero");

    const image = container.querySelector(".hero-image");
    image.src = settings.image;
    image.alt = settings.alt || "";
    image.fetchPriority = "high";

    container.querySelector(".eyebrow").textContent =
      settings.eyebrow || "";

    // Use | to specify line breaks in the heading
    const heading = container.querySelector(".hero-content h1");

    heading.replaceChildren();

    (settings.title || "").split("|").forEach((line, index) => {
      if (index > 0) {
        heading.appendChild(document.createElement("br"));
      }
    
      const template = document.createElement("template");
      template.innerHTML = line;
      heading.appendChild(template.content);
    });

    container.querySelector(".hero-subtitle").innerHTML =
      settings.subtitle || "";

    const button = container.querySelector(".hero-button");
    button.href = settings.buttonUrl || "#";
    container.querySelector(".hero-button-text").textContent =
      settings.buttonText || "";

    const scroll = container.querySelector(".hero-scroll");
    scroll.href = settings.scrollTarget || "#about";
    scroll.setAttribute(
      "aria-label",
      settings.scrollLabel || "Scroll to discover more"
    );

    // Load the shared header only after its placeholder exists.
    // This avoids a race with the asynchronous hero fetch.
    const headerScript = document.createElement("script");
    headerScript.src = "/Javascript/header.js";
    document.body.appendChild(headerScript);

  } catch (error) {
    console.error("Hero loading failed:", error);
  }
});
