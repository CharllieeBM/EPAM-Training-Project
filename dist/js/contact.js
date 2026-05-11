"use strict";
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
function setError(errorId, message) {
    const el = document.getElementById(errorId);
    if (el)
        el.textContent = message;
}
/**
 * Validates a required text field (name or message).
 * Returns true if valid.
 */
function validateRequired(value, errorId, label) {
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
function validateEmail(value, errorId) {
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
function initRealTimeValidation() {
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const topicInput = document.getElementById("contact-topic");
    const messageInput = document.getElementById("contact-message");
    nameInput === null || nameInput === void 0 ? void 0 : nameInput.addEventListener("input", () => {
        validateRequired(nameInput.value, "contact-name-error", "Full name");
    });
    emailInput === null || emailInput === void 0 ? void 0 : emailInput.addEventListener("input", () => {
        validateEmail(emailInput.value, "contact-email-error");
    });
    topicInput === null || topicInput === void 0 ? void 0 : topicInput.addEventListener("input", () => {
        validateRequired(topicInput.value, "contact-topic-error", "Topic");
    });
    messageInput === null || messageInput === void 0 ? void 0 : messageInput.addEventListener("input", () => {
        validateRequired(messageInput.value, "contact-message-error", "Message");
    });
}
// ---- FORM SUBMIT --------------------------------------------
/**
 * Validates all required fields on submit.
 * Shows success message if all valid, error message if not.
 * Does NOT reload the page.
 */
function handleContactSubmit(e) {
    var _a, _b, _c, _d, _e;
    e.preventDefault();
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const topicInput = document.getElementById("contact-topic");
    const messageInput = document.getElementById("contact-message");
    const formMsg = document.getElementById("contact-form-msg");
    const nameValid = validateRequired((_a = nameInput === null || nameInput === void 0 ? void 0 : nameInput.value) !== null && _a !== void 0 ? _a : "", "contact-name-error", "Full name");
    const emailValid = validateEmail((_b = emailInput === null || emailInput === void 0 ? void 0 : emailInput.value) !== null && _b !== void 0 ? _b : "", "contact-email-error");
    const topicValid = validateRequired((_c = topicInput === null || topicInput === void 0 ? void 0 : topicInput.value) !== null && _c !== void 0 ? _c : "", "contact-topic-error", "Topic");
    const messageValid = validateRequired((_d = messageInput === null || messageInput === void 0 ? void 0 : messageInput.value) !== null && _d !== void 0 ? _d : "", "contact-message-error", "Message");
    if (!formMsg)
        return;
    if (nameValid && emailValid && topicValid && messageValid) {
        formMsg.textContent =
            "Your message has been sent! We'll get back to you within 24 hours.";
        formMsg.className = "contact__form-msg success";
        (_e = document.getElementById("contact-form")) === null || _e === void 0 ? void 0 : _e.reset();
        [
            "contact-name-error",
            "contact-email-error",
            "contact-topic-error",
            "contact-message-error",
        ].forEach((id) => setError(id, ""));
    }
    else {
        formMsg.textContent = "Please fix the errors above before sending.";
        formMsg.className = "contact__form-msg error";
    }
}
// ---- INIT ---------------------------------------------------
function initContact() {
    var _a;
    initRealTimeValidation();
    (_a = document
        .getElementById("contact-form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", handleContactSubmit);
}
document.addEventListener("DOMContentLoaded", initContact);
