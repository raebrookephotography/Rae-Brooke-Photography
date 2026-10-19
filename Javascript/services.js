
/* =========================================
   RAE BROOKE PHOTOGRAPHY
   SERVICES PAGE — EDITORIAL PACKAGE SELECTOR
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const packageButtons = document.querySelectorAll(
    ".package-nav button[data-package]"
  );

  const packageEyebrow = document.getElementById("package-eyebrow");
  const packageIndex = document.getElementById("package-index");
  const packageTitle = document.getElementById("package-title");
  const packageIntro = document.getElementById("package-intro");
  const packageDescription = document.getElementById(
    "package-description"
  );
  const packageImage = document.getElementById("package-image");
  const packageCaption = document.getElementById("package-caption");
  const packageInquiry = document.getElementById("package-inquiry");

  // Stop safely if the expected HTML is not present.
  if (
    !packageButtons.length ||
    !packageEyebrow ||
    !packageIndex ||
    !packageTitle ||
    !packageIntro ||
    !packageDescription ||
    !packageImage ||
    !packageCaption ||
    !packageInquiry
  ) {
    return;
  }


  /* =========================================
     PACKAGE CONTENT

     Portrait copy and pricing preserve the
     information supplied in the original HTML.

     Branding pricing is intentionally omitted
     until you establish your rates.

     Replace the branding image path with the
     path to your own branding portfolio photo.
  ========================================= */

  const packages = {

    portraits: {
      index: "01 / 02",
      eyebrow: "THE LITTLE MOMENTS",
      title: "Portraits",

      intro:
        "For this version of your life, exactly as it is right now.",

      paragraphs: [
        {
          text:
            "It's 30 years from now. You're sitting on the couch with your person, scrolling through some cool holographic photo-viewing thing. You're looking at your dog side-eyeing the new baby, your three-year-old flashing that big, dopey grin, or the two of you lying in tall grass before your butts got saggy."
        },
        {
          text:
            "You're remembering the fur babies when they were full of energy, the kids before they had kids of their own, and the two of you in this particular season of your life. That's why this version matters."
        },
        {
          text:
            "We might wander through a downtown, spend an evening at the beach, or find a quiet place that feels like you. No stiff poses. Just the little moments worth keeping."
        },
        {
          text: "Portrait sessions begin at $250.",
          className: "package-price"
        }
      ],

      image: "/Images/Portfolio/Colleen_Twirl.jpg",

      imageAlt:
        "A couple sharing a romantic moment outdoors",

      caption: "REAL MOMENTS. LASTING MEMORIES.",

      inquiry: "/contact.html?session=Portraits"
    },


    branding: {
      index: "02 / 02",
      eyebrow: "YOUR STORY, YOUR BRAND",
      title: "Branding",

      intro:
        "For the people, passion, and purpose behind what you do.",

      paragraphs: [
        {
          text:
            "Your brand is more than a logo or a carefully chosen color palette. It's the personality, perspective, and purpose that make your work yours."
        },
        {
          text:
            "Branding photography is about creating images that feel like you. The way you work, the details you care about, and the personality you bring to what you do."
        },
        {
          text:
            "Whether you're building a business, growing your personal brand, or refreshing your online presence, we'll create thoughtful imagery that helps tell your story."
        },
        {
          text:
            "Get in touch to talk about your vision and the images you need."
        }
      ],

      // Temporary fallback: replace with a real branding image
      // when you add one to your website.
      image: "/Images/Portfolio/Amanda_Branding_2.jpg",

      imageAlt:
        "Photography from Rae Brooke Photography",

      caption: "YOUR VISION. YOUR STORY.",

      inquiry: "/contact.html?session=Branding"
    }

  };


  /* =========================================
     DISPLAY A SELECTED PACKAGE
  ========================================= */

  function showPackage(packageName) {

    const selectedPackage = packages[packageName];

    if (!selectedPackage) {
      return;
    }

    // Update editorial labels.
    packageEyebrow.textContent = selectedPackage.eyebrow;
    packageIndex.textContent = selectedPackage.index;

    // Update the title and introductory copy.
    packageTitle.textContent = selectedPackage.title;
    packageIntro.textContent = selectedPackage.intro;

    // Rebuild the description safely.
    packageDescription.replaceChildren();

    selectedPackage.paragraphs.forEach((item) => {

      const paragraph = document.createElement("p");

      paragraph.textContent = item.text;

      if (item.className) {
        paragraph.classList.add(item.className);
      }

      packageDescription.appendChild(paragraph);

    });

    // Update the photograph and caption.
    packageImage.alt = selectedPackage.imageAlt;
    packageImage.src = selectedPackage.image;
    packageCaption.textContent = selectedPackage.caption;

    // Update the inquiry destination.
    packageInquiry.href = selectedPackage.inquiry;

    // Update selected tab styling and accessibility.
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
     PACKAGE SELECTOR EVENTS
  ========================================= */

  packageButtons.forEach((button) => {

    button.addEventListener("click", () => {
      showPackage(button.dataset.package);
    });

  });


  /* =========================================
     INITIAL STATE
  ========================================= */

  const initialButton =
    Array.from(packageButtons).find((button) =>
      button.getAttribute("aria-pressed") === "true"
    ) || packageButtons[0];

  showPackage(initialButton.dataset.package);

});
