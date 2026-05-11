// =============================================================
// contact.ts — Contact Us page (src/html/contact.html)
// Compiled to: dist/js/contact.js
// Responsibilities:
//   - Real-time validation on each input field (fires on 'input' event)
//   - Email format validated with regex as user types
//   - Required fields (name, email, message) checked in real-time
//   - On submit: show success or error message without page reload
// =============================================================

// ---- CONSTANTS ----------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- HELPERS ------------------------------------------------

/**
 * Shows an error message in the given error span.
 * Clears it if message is empty.
 */
function setError(errorId: string, message: string): void {
  const el = document.getElementById(errorId);
  if (el) el.textContent = message;
}

/**
 * Validates a required text field (name or message).
 * Returns true if valid.
 */
function validateRequired(
  value: string,
  errorId: string,
  label: string
): boolean {
  if (!value.trim()) {
    setError(errorId, `${label} is required.`);
    return false;
  }
  setError(errorId, "");
  return true;
}

/**
 * Validates an email field against the regex.
 * Returns true if valid.
 */
function validateEmail(value: string, errorId: string): boolean {
  if (!value.trim()) {
    setError(errorId, "Email is required.");
    return false;
  }
  if (!EMAIL_REGEX.test(value.trim())) {
    setError(errorId, "Please enter a valid email address.");
    return false;
  }
  setError(errorId, "");
  return true;
}

// ---- REAL-TIME VALIDATION -----------------------------------

/**
 * Attaches 'input' event listeners to each form field for real-time validation.
 * Errors appear as the user types and clear as soon as the field is valid.
 */
function initRealTimeValidation(): void {
  const nameInput = document.getElementById("contact-name") as HTMLInputElement;
  const emailInput = document.getElementById(
    "contact-email"
  ) as HTMLInputElement;
  const topicInput = document.getElementById(
    "contact-topic"
  ) as HTMLInputElement;
  const messageInput = document.getElementById(
    "contact-message"
  ) as HTMLTextAreaElement;

  nameInput?.addEventListener("input", () => {
    validateRequired(nameInput.value, "contact-name-error", "Full name");
  });

  emailInput?.addEventListener("input", () => {
    validateEmail(emailInput.value, "contact-email-error");
  });

  topicInput?.addEventListener("input", () => {
    validateRequired(topicInput.value, "contact-topic-error", "Topic");
  });

  messageInput?.addEventListener("input", () => {
    validateRequired(messageInput.value, "contact-message-error", "Message");
  });
}

// ---- FORM SUBMIT --------------------------------------------

/**
 * Validates all required fields on submit.
 * Shows success message if all valid, error message if not.
 * Does NOT reload the page.
 */

function handleContactSubmit(e: Event): void {
  e.preventDefault();

  const nameInput = document.getElementById("contact-name") as HTMLInputElement;
  const emailInput = document.getElementById(
    "contact-email"
  ) as HTMLInputElement;
  const topicInput = document.getElementById(
    "contact-topic"
  ) as HTMLInputElement;
  const messageInput = document.getElementById(
    "contact-message"
  ) as HTMLTextAreaElement;
  const formMsg = document.getElementById("contact-form-msg");

  const nameValid = validateRequired(
    nameInput?.value ?? "",
    "contact-name-error",
    "Full name"
  );
  const emailValid = validateEmail(
    emailInput?.value ?? "",
    "contact-email-error"
  );
  const topicValid = validateRequired(
    topicInput?.value ?? "",
    "contact-topic-error",
    "Topic"
  );
  const messageValid = validateRequired(
    messageInput?.value ?? "",
    "contact-message-error",
    "Message"
  );

  if (!formMsg) return;

  if (nameValid && emailValid && topicValid && messageValid) {
    formMsg.textContent =
      "Your message has been sent! We'll get back to you within 24 hours.";
    formMsg.className = "contact__form-msg success";
    (document.getElementById("contact-form") as HTMLFormElement)?.reset();
    [
      "contact-name-error",
      "contact-email-error",
      "contact-topic-error",
      "contact-message-error",
    ].forEach((id) => setError(id, ""));
  } else {
    formMsg.textContent = "Please fix the errors above before sending.";
    formMsg.className = "contact__form-msg error";
  }
}

// ---- INIT ---------------------------------------------------

function initContact(): void {
  initRealTimeValidation();
  document
    .getElementById("contact-form")
    ?.addEventListener("submit", handleContactSubmit);
}

document.addEventListener("DOMContentLoaded", initContact);
