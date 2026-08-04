(() => {
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

  if (!cloudPanoCard || !cloudPanoTarget) {
    return;
  }

  let requested = false;
  let fallbackTimer = 0;

  const showCloudPanoFallback = () => {
    if (!cloudPanoStatus || cloudPanoTarget.querySelector("iframe, canvas")) {
      return;
    }

    cloudPanoStatus.innerHTML =
      "<strong>Recorrido no disponible</strong><span>No pudimos cargar CloudPano. Revisá tu conexión e intentá nuevamente.</span>";
  };

  const markCloudPanoLoaded = () => {
    if (cloudPanoTarget.querySelector("iframe, canvas")) {
      cloudPanoCard.classList.add("is-loaded");
      window.clearTimeout(fallbackTimer);
      return true;
    }

    return false;
  };

  const loadCloudPano = () => {
    if (requested) {
      return;
    }

    requested = true;

    if (document.querySelector('script[data-short="IFPUdh60u"]')) {
      markCloudPanoLoaded();
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.dataset.short = "IFPUdh60u";
    script.dataset.path = "tours";
    script.dataset.isSelfHosted = "false";
    script.setAttribute("width", "100%");
    script.setAttribute("height", "500px");
    script.src = "https://app.cloudpano.com/public/shareScript.js";
    script.addEventListener("error", showCloudPanoFallback, { once: true });
    cloudPanoTarget.appendChild(script);

    const contentObserver = new MutationObserver(() => {
      if (markCloudPanoLoaded()) {
        contentObserver.disconnect();
      }
    });

    contentObserver.observe(cloudPanoTarget, { childList: true, subtree: true });
    fallbackTimer = window.setTimeout(showCloudPanoFallback, 12000);
  };

  if ("IntersectionObserver" in window) {
    const cloudPanoObserver = new IntersectionObserver(
      (entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadCloudPano();
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" }
    );

    cloudPanoObserver.observe(cloudPanoCard);
  } else {
    loadCloudPano();
  }
})();
