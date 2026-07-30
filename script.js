document.documentElement.classList.add("motion-enabled");

const landingConfig = {
  // Editar aca el porcentaje principal de comision
  commissionNumber: "70%",
  // Editar aca la frase debajo del porcentaje principal
  commissionCopy: "para vos desde el primer d\u00eda.",
  // Editar aca la nota secundaria del modelo
  commissionNote: "Despu\u00e9s de determinado volumen, mejora tu rentabilidad.",
};

const commissionNumberElement = document.querySelector("[data-commission-number]");
const commissionCopyElement = document.querySelector("[data-commission-copy]");
const commissionNoteElement = document.querySelector("[data-commission-note]");

if (commissionNumberElement) {
  commissionNumberElement.textContent = landingConfig.commissionNumber;
}

if (commissionCopyElement) {
  commissionCopyElement.textContent = landingConfig.commissionCopy;
}

if (commissionNoteElement) {
  commissionNoteElement.textContent = landingConfig.commissionNote;
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const animateCommissionNumber = (panel) => {
  if (
    !commissionNumberElement ||
    !panel ||
    panel.dataset.commissionCounted === "true"
  ) {
    return;
  }

  panel.dataset.commissionCounted = "true";

  if (reducedMotionQuery.matches) {
    commissionNumberElement.textContent = landingConfig.commissionNumber;
    return;
  }

  const targetValue =
    Number.parseInt(landingConfig.commissionNumber, 10) || 70;
  const duration = 1050;
  let startTime = null;

  commissionNumberElement.textContent = "0%";

  const updateNumber = (timestamp) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(targetValue * easedProgress);

    commissionNumberElement.textContent = `${currentValue}%`;

    if (progress < 1) {
      window.requestAnimationFrame(updateNumber);
    } else {
      commissionNumberElement.textContent = landingConfig.commissionNumber;
    }
  };

  window.requestAnimationFrame(updateNumber);
};

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          if (entry.target.matches("[data-commission-panel]")) {
            animateCommissionNumber(entry.target);
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");

    if (item.matches("[data-commission-panel]")) {
      animateCommissionNumber(item);
    }
  });
}

const panoramas = document.querySelectorAll("[data-panorama]");

panoramas.forEach((panorama) => {
  const image = panorama.querySelector("img");
  const hint = panorama.querySelector("[data-panorama-hint]");

  if (!image) {
    return;
  }

  let offset = 0;
  let minOffset = 0;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let dragAxis = null;

  const clampOffset = (value) => Math.min(0, Math.max(minOffset, value));

  const render = () => {
    image.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const updateBounds = () => {
    const previousRange = minOffset;
    const progress = previousRange < 0 ? offset / previousRange : 0.5;
    minOffset = Math.min(0, panorama.clientWidth - image.getBoundingClientRect().width);
    offset = clampOffset(minOffset * progress);
    render();
  };

  const initialize = () => {
    panorama.classList.add("is-interactive");
    if (hint) {
      hint.textContent = "Arrastrá para recorrer";
    }
    updateBounds();
  };

  if (image.complete) {
    initialize();
  } else {
    image.addEventListener("load", initialize, { once: true });
  }

  panorama.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startOffset = offset;
    dragAxis = null;
    panorama.setPointerCapture(pointerId);
  });

  panorama.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!dragAxis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 5) {
      dragAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    if (dragAxis !== "horizontal") {
      return;
    }

    event.preventDefault();
    panorama.classList.add("is-dragging");
    offset = clampOffset(startOffset + deltaX);
    render();
  });

  const stopDragging = (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    panorama.classList.remove("is-dragging");
    if (panorama.hasPointerCapture(pointerId)) {
      panorama.releasePointerCapture(pointerId);
    }
    pointerId = null;
    dragAxis = null;
  };

  panorama.addEventListener("pointerup", stopDragging);
  panorama.addEventListener("pointercancel", stopDragging);

  panorama.addEventListener("keydown", (event) => {
    const step = Math.max(36, panorama.clientWidth * 0.12);

    if (event.key === "ArrowLeft") {
      offset = clampOffset(offset + step);
    } else if (event.key === "ArrowRight") {
      offset = clampOffset(offset - step);
    } else if (event.key === "Home") {
      offset = 0;
    } else if (event.key === "End") {
      offset = minOffset;
    } else {
      return;
    }

    event.preventDefault();
    render();
  });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(panorama);
  } else {
    window.addEventListener("resize", updateBounds);
  }
});

const comparisons = document.querySelectorAll("[data-compare]");

comparisons.forEach((comparison) => {
  let position = 50;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startPosition = 50;
  let dragAxis = null;

  const clampPosition = (value) => Math.min(100, Math.max(0, value));

  const renderComparison = () => {
    const roundedPosition = Math.round(position);
    comparison.style.setProperty("--compare-position", `${position}%`);
    comparison.setAttribute("aria-valuenow", String(roundedPosition));
    comparison.setAttribute(
      "aria-valuetext",
      `${roundedPosition}% de la habitación vacía visible`
    );
  };

  const setPositionFromClientX = (clientX) => {
    const bounds = comparison.getBoundingClientRect();
    position = clampPosition(((clientX - bounds.left) / bounds.width) * 100);
    renderComparison();
  };

  comparison.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startPosition = position;
    dragAxis = null;
    comparison.setPointerCapture(pointerId);
  });

  comparison.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!dragAxis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 5) {
      dragAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    if (dragAxis !== "horizontal") {
      return;
    }

    event.preventDefault();
    comparison.classList.add("is-dragging");
    position = clampPosition(startPosition + (deltaX / comparison.clientWidth) * 100);
    renderComparison();
  });

  const stopComparisonDrag = (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    if (!dragAxis && event.pointerType === "mouse") {
      setPositionFromClientX(event.clientX);
    }

    comparison.classList.remove("is-dragging");
    if (comparison.hasPointerCapture(pointerId)) {
      comparison.releasePointerCapture(pointerId);
    }
    pointerId = null;
    dragAxis = null;
  };

  comparison.addEventListener("pointerup", stopComparisonDrag);
  comparison.addEventListener("pointercancel", stopComparisonDrag);

  comparison.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 10 : 3;

    if (event.key === "ArrowLeft") {
      position = clampPosition(position - step);
    } else if (event.key === "ArrowRight") {
      position = clampPosition(position + step);
    } else if (event.key === "Home") {
      position = 0;
    } else if (event.key === "End") {
      position = 100;
    } else {
      return;
    }

    event.preventDefault();
    renderComparison();
  });

  renderComparison();
});
