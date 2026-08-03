(() => {
  const form = document.querySelector("#sumate-form");

  if (!form) return;

  const status = form.querySelector(".sumate-form-status");
  const consent = form.querySelector("#consent");
  const requiredFields = [
    form.querySelector("#full-name"),
    form.querySelector("#phone"),
    form.querySelector("#email"),
    form.querySelector("#city"),
  ];

  const messages = {
    "full-name": "Ingresá tu nombre y apellido.",
    phone: "Ingresá un teléfono válido de entre 8 y 15 dígitos.",
    email: "Ingresá un correo electrónico válido.",
    city: "Ingresá tu ciudad.",
    consent: "Necesitamos tu consentimiento para continuar.",
  };

  const setFieldState = (field, message = "") => {
    const error = form.querySelector(`#${field.id}-error`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  };

  const clearStatus = () => {
    status.textContent = "";
    status.classList.remove("is-error", "is-ready");
  };

  const isValidField = (field) => {
    const value = field.value.trim();

    if (!value) return false;
    if (field.id === "email") return field.validity.valid;
    if (field.id === "phone") {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15;
    }

    return true;
  };

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (isValidField(field)) setFieldState(field);
      clearStatus();
    });

    field.addEventListener("blur", () => {
      if (!isValidField(field)) setFieldState(field, messages[field.id]);
    });
  });

  consent.addEventListener("change", () => {
    if (consent.checked) setFieldState(consent);
    clearStatus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearStatus();

    const invalidFields = requiredFields.filter((field) => {
      const valid = isValidField(field);
      setFieldState(field, valid ? "" : messages[field.id]);
      return !valid;
    });

    if (!consent.checked) {
      setFieldState(consent, messages.consent);
      invalidFields.push(consent);
    } else {
      setFieldState(consent);
    }

    if (invalidFields.length) {
      status.textContent = "Revisá los campos indicados antes de continuar.";
      status.classList.add("is-error");
      invalidFields[0].focus();
      return;
    }

    status.textContent =
      "Tus datos están completos, pero el formulario todavía no está conectado a un canal de recepción. No se envió información.";
    status.classList.add("is-ready");
  });
})();
