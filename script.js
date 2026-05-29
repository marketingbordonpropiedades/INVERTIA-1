const landingConfig = {
  // Editar aca el porcentaje principal de comision
  commissionNumber: "70%",
  // Editar aca la frase debajo del porcentaje principal
  commissionCopy: "para vos desde el primer dia.",
  // Editar aca la nota secundaria del modelo
  commissionNote: "Despues de determinado volumen, mejoras tu rentabilidad.",
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
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
