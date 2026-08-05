(() => {
  const gallery = document.querySelector("[data-photo-gallery]");
  if (gallery) {
    const slides = [...gallery.querySelectorAll("[data-gallery-slide]")];
    const dots = [...gallery.querySelectorAll("[data-gallery-dot]")];
    const previous = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    let current = 0;

    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isCurrent = slideIndex === current;
        slide.hidden = !isCurrent;
        slide.setAttribute("aria-hidden", String(!isCurrent));
      });
      dots.forEach((dot, dotIndex) => {
        dot.setAttribute("aria-current", String(dotIndex === current));
      });
    };

    previous?.addEventListener("click", () => showSlide(current - 1));
    next?.addEventListener("click", () => showSlide(current + 1));
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => showSlide(dotIndex));
    });
    gallery.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") showSlide(current - 1);
      if (event.key === "ArrowRight") showSlide(current + 1);
    });
    showSlide(0);
  }

  const comparison = document.querySelector("[data-comparison]");
  const comparisonInput = comparison?.querySelector('input[type="range"]');

  if (comparison && comparisonInput) {
    const updateComparison = () => {
      const value = Number(comparisonInput.value);
      comparison.style.setProperty("--position", `${value}%`);
      comparisonInput.setAttribute("aria-valuetext", `${value}% después`);
    };

    comparisonInput.addEventListener("input", updateComparison);
    updateComparison();
  }

  const cloudPanoCard = document.querySelector("[data-cloudpano]");
  const cloudPanoTarget = document.getElementById("IFPUdh60u");
  const cloudPanoStatus = cloudPanoCard?.querySelector("[data-cloudpano-status]");

  const cloudPanoFrame = cloudPanoTarget?.querySelector("iframe");

  if (cloudPanoCard && cloudPanoStatus && cloudPanoFrame) {
    cloudPanoFrame.addEventListener("load", () => {
      cloudPanoCard.classList.add("is-loaded");
    }, { once: true });
  }
})();
