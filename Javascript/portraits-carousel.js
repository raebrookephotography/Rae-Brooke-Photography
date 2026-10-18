/* ========================================
   RAE BROOKE PHOTOGRAPHY
   PORTFOLIO CAROUSELS
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(
      carousel.querySelectorAll(".carousel-slide")
    );

    const previousButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const status = carousel.querySelector(".carousel-status");

    if (
      !track ||
      slides.length === 0 ||
      !previousButton ||
      !nextButton ||
      !status
    ) {
      return;
    }

    let scrollTimer;

    const getGap = () => {
      const styles = window.getComputedStyle(track);

      return (
        parseFloat(styles.columnGap) ||
        parseFloat(styles.gap) ||
        0
      );
    };

    const getStep = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;

      return slideWidth + getGap();
    };

    const getVisibleCount = () => {
      const step = getStep();

      if (!step) return 1;

      return Math.max(
        1,
        Math.round((track.clientWidth + getGap()) / step)
      );
    };

    const getCurrentIndex = () => {
      const step = getStep();

      if (!step) return 0;

      return Math.max(
        0,
        Math.min(
          slides.length - 1,
          Math.round(track.scrollLeft / step)
        )
      );
    };

    const updateCarousel = () => {
      const maxScroll = Math.max(
        0,
        track.scrollWidth - track.clientWidth
      );

      const currentIndex = getCurrentIndex();
      const visibleCount = getVisibleCount();

      const epsilon = 2;

      previousButton.disabled = track.scrollLeft <= epsilon;
      nextButton.disabled =
        track.scrollLeft >= maxScroll - epsilon;

      const firstPhoto = currentIndex + 1;

      const lastPhoto = Math.min(
        slides.length,
        firstPhoto + visibleCount - 1
      );

      status.textContent =
        `Photos ${firstPhoto}–${lastPhoto} of ${slides.length}`;
    };

    const moveCarousel = (direction) => {
      const step = getStep();

      if (!step) return;

      const maxScroll = Math.max(
        0,
        track.scrollWidth - track.clientWidth
      );

      const target = Math.max(
        0,
        Math.min(
          maxScroll,
          track.scrollLeft + direction * step
        )
      );

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      track.scrollTo({
        left: target,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    };

    previousButton.addEventListener("click", () => {
      moveCarousel(-1);
    });

    nextButton.addEventListener("click", () => {
      moveCarousel(1);
    });

    /* Keyboard navigation when the track is focused */

    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveCarousel(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveCarousel(1);
      }
    });

    /* Update the counter and buttons after touch, drag, or scrolling */

    track.addEventListener("scroll", () => {
      updateCarousel();

      window.clearTimeout(scrollTimer);

      scrollTimer = window.setTimeout(() => {
        updateCarousel();
      }, 100);
    }, { passive: true });

    /* Recalculate when responsive breakpoints change the slide width */

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        updateCarousel();
      });

      resizeObserver.observe(track);
      resizeObserver.observe(slides[0]);
    } else {
      window.addEventListener("resize", updateCarousel);
    }

    /* Wait for image loading to finish before the final layout check */

    track.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", updateCarousel, { once: true });
        img.addEventListener("error", updateCarousel, { once: true });
      }
    });

    updateCarousel();
  });
});
