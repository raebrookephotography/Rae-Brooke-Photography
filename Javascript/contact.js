
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitButton = form?.querySelector(".contact-submit");
  const sessionSelect = document.getElementById("session");

  if (!form || !status || !submitButton) return;

  // Preselect a session when linked from another page.
  const requestedSession =
    new URLSearchParams(window.location.search).get("session");

  if (requestedSession && sessionSelect) {
    const sessionAliases = {
      "Branding": "Lifestyle / Branding",
      "Couples": "Couples / Engagements"
    };

    const sessionValue =
      sessionAliases[requestedSession] || requestedSession;

    const matchingOption = Array.from(sessionSelect.options).find(
      (option) => option.value === sessionValue
    );

    if (matchingOption) {
      sessionSelect.value = matchingOption.value;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.textContent = "";
    status.classList.remove("form-status-error");

    if (!form.reportValidity()) return;

    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = "<span>Sending inquiry…</span>";

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
          "We couldn't send your inquiry. Please try again."
        );
      }

      form.reset();

      status.textContent =
        "Thank you for reaching out! Your inquiry has been sent. I'll be in touch as soon as possible.";
    } catch (error) {
      status.textContent =
        error.message ||
        "Something went wrong. Please try again later.";

      status.classList.add("form-status-error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
});
