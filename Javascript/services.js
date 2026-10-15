/* =========================================
   RAE BROOKE PHOTOGRAPHY
   SERVICES PAGE — PACKAGE SELECTOR
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const packageButtons = document.querySelectorAll(
    ".package-nav button[data-package]"
  );

  const packageTitle = document.getElementById("package-title");
  const packageIntro = document.getElementById("package-intro");
  const packageDescription = document.getElementById(
    "package-description"
  );
  const packageImage = document.getElementById("package-image");

  // Stop safely if the expected HTML elements are missing.
  if (
    !packageButtons.length ||
    !packageTitle ||
    !packageIntro ||
    !packageDescription ||
    !packageImage
  ) {
    return;
  }

  /* =========================================
     PACKAGE CONTENT
     Update these details with your final pricing
     and photography descriptions as needed.
  ========================================= */

  const packages = {
    portraits: {
      title: "Portraits",

      intro:
        "For this version of your life, exactly as it is right now.",

      paragraphs: [
        "It's 30 years from now. You're sitting on the couch with your person, scrolling through some cool holographic photo-viewing thing. You're looking at your dog side-eyeing the new baby, your three-year-old flashing that big, dopey grin, or the two of you lying in tall grass before your butts got saggy.",

        "You're remembering the fur babies when they were full of energy, the kids before they had kids of their own, and the two of you in this particular season of your life. That's why this version matters.",

        "We might wander through a downtown, spend an evening at the beach, or find a quiet place that feels like you. No stiff poses. Just the little moments worth keeping.",

        "Portrait sessions begin at $200."
      ],

      image:
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1100&q=85",

      imageAlt:
        "A couple sharing a romantic moment during a portrait session"
    },

    weddings: {
      title: "Weddings",

      intro:
        "For the big feelings, happy tears, and moments you'll want to relive forever.",

      paragraphs: [
        "Your wedding day is about more than the timeline, the flowers, or the perfect details. It's about the people you love, the promises you make, and the little moments that unfold when you're simply present with one another.",

        "From the quiet anticipation before the ceremony to the hugs, happy tears, laughter, and celebration afterward, my approach is to capture your day with care and intention.",

        "I'll help you feel comfortable in front of the camera while leaving room for the unexpected moments that make your wedding uniquely yours.",

        "Reach out for wedding package details and pricing."
      ],

      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85",

      imageAlt:
        "A couple celebrating their wedding day"
    },

    elopements: {
      title: "Intimate Weddings & Elopements",

      intro:
        "A meaningful celebration, centered on the two of you.",

      paragraphs: [
        "Maybe you're dreaming of exchanging vows somewhere quiet, surrounded by nature, or celebrating with just a handful of your favorite people. Your wedding doesn't have to look like anyone else's to be unforgettable.",

        "Intimate weddings and elopements leave room to slow down, take it all in, and focus on what matters most to you.",

        "Whether we're exploring a beautiful outdoor location, documenting a private ceremony, or finding meaningful moments between the big ones, I'll help preserve the feeling of your day.",

        "Reach out for intimate wedding and elopement package details and pricing."
      ],

      image:
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1100&q=85",

      imageAlt:
        "A couple celebrating an intimate wedding"
    }
  };

  /* =========================================
     DISPLAY SELECTED PACKAGE
  ========================================= */

  function showPackage(packageName) {
    const selectedPackage = packages[packageName];

    // Ignore invalid package names.
    if (!selectedPackage) {
      return;
    }

    // Update the selected package heading.
    packageTitle.textContent = selectedPackage.title;

    // Update the introductory sentence.
    packageIntro.textContent = selectedPackage.intro;

    // Replace the description paragraphs.
    packageDescription.replaceChildren();

    selectedPackage.paragraphs.forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText;
      packageDescription.appendChild(paragraph);
    });

    // Update the photograph and alternative text.
    packageImage.src = selectedPackage.image;
    packageImage.alt = selectedPackage.imageAlt;

    // Update selected button styling and accessibility state.
    packageButtons.forEach((button) => {
      const isSelected =
        button.dataset.package === packageName;

      button.classList.toggle("active", isSelected);
      button.setAttribute(
        "aria-pressed",
        String(isSelected)
      );
    });
  }

  /* =========================================
     PACKAGE BUTTON EVENTS
  ========================================= */

  packageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showPackage(button.dataset.package);
    });
  });

  // Initialize the page with the currently selected package.
  const initialButton = Array.from(packageButtons).find(
    (button) => button.classList.contains("active")
  ) || packageButtons[0];

  showPackage(initialButton.dataset.package);
});
