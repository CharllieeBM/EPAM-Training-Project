// =============================================================
// main.ts — Shared across ALL pages
// Compiled to: dist/js/main.js
// Responsibilities:
//   - Login modal (open, close, overlay click, Escape key)
//   - Email regex + password required validation
//   - Show/hide password toggle (eye icon)
//   - Burger menu (mobile nav open/close)
//   - Cart counter (reads LocalStorage on every page load)
// =============================================================
// ---- CART COUNTER -------------------------------------------
/**
 * Reads cart from LocalStorage and updates the #cart-count badge.
 * Called on every page load so the counter is always in sync.
 * Hides the badge when count is 0.
 */
function updateCartCounter() {
    const cartCountEl = document.getElementById("cart-count");
    if (!cartCountEl)
        return;
    const cart = getCartFromStorage();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = String(totalItems);
    cartCountEl.style.display = totalItems > 0 ? "flex" : "none";
}
/**
 * Reads and parses cart data from LocalStorage.
 * Returns an empty array if nothing is stored or JSON is invalid.
 */
function getCartFromStorage() {
    try {
        const raw = localStorage.getItem("bestshop-cart");
        return raw ? JSON.parse(raw) : [];
    }
    catch (_a) {
        return [];
    }
}
/**
 * Saves cart array back to LocalStorage and refreshes the counter.
 */
function saveCartToStorage(cart) {
    localStorage.setItem("bestshop-cart", JSON.stringify(cart));
    updateCartCounter();
}
// ---- LOGIN MODAL --------------------------------------------
/**
 * Opens the login modal and traps focus inside it.
 */
function openModal() {
    const modal = document.getElementById("login-modal");
    if (!modal)
        return;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}
/**
 * Closes the login modal and restores scroll.
 */
function closeModal() {
    const modal = document.getElementById("login-modal");
    if (!modal)
        return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    clearModalErrors();
}
/**
 * Clears all validation error messages inside the modal form.
 */
function clearModalErrors() {
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");
    if (emailError)
        emailError.textContent = "";
    if (passwordError)
        passwordError.textContent = "";
}
/**
 * Validates and submits the login form.
 * Email must match regex. Password must not be empty.
 * Closes modal on success.
 */
function handleLoginSubmit(e) {
    var _a;
    e.preventDefault();
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");
    if (!emailInput || !passwordInput)
        return;
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Email validation
    if (!emailRegex.test(emailInput.value.trim())) {
        if (emailError)
            emailError.textContent = "Please enter a valid email address.";
        valid = false;
    }
    else if (emailError) {
        emailError.textContent = "";
    }
    // Password validation
    if (passwordInput.value.trim() === "") {
        if (passwordError)
            passwordError.textContent = "Password is required.";
        valid = false;
    }
    else if (passwordError) {
        passwordError.textContent = "";
    }
    if (valid) {
        closeModal();
        (_a = document.getElementById("login-form")) === null || _a === void 0 ? void 0 : _a.reset();
    }
}
/**
 * Toggles password field between text and password type.
 * Swaps the eye icon accordingly.
 */
function handlePasswordToggle() {
    const passwordInput = document.getElementById("login-password");
    if (!passwordInput)
        return;
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
}
// ---- BURGER MENU --------------------------------------------
/**
 * Toggles the mobile nav open/closed.
 */
function handleBurger() {
    const navLinks = document.getElementById("nav-links");
    const burger = document.getElementById("burger");
    if (!navLinks || !burger)
        return;
    const isOpen = navLinks.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.classList.toggle("active", isOpen);
}
// ---- INIT ---------------------------------------------------
/**
 * Wires up all shared event listeners.
 * Called once the DOM is ready.
 */
function initMain() {
    var _a, _b, _c, _d, _e, _f, _g;
    // Cart counter on every page load
    updateCartCounter();
    // Modal triggers
    (_a = document.getElementById("btn-account")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", openModal);
    (_b = document
        .getElementById("btn-account-mobile")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        openModal();
        const navLinks = document.getElementById("nav-links");
        const burger = document.getElementById("burger");
        navLinks === null || navLinks === void 0 ? void 0 : navLinks.classList.remove("open");
        burger === null || burger === void 0 ? void 0 : burger.classList.remove("active");
        burger === null || burger === void 0 ? void 0 : burger.setAttribute("aria-expanded", "false");
    });
    (_c = document.getElementById("modal-close")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", closeModal);
    (_d = document
        .getElementById("modal-overlay")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", closeModal);
    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape")
            closeModal();
    });
    // Login form submit
    (_e = document
        .getElementById("login-form")) === null || _e === void 0 ? void 0 : _e.addEventListener("submit", handleLoginSubmit);
    // Password show/hide
    (_f = document
        .getElementById("toggle-password")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", handlePasswordToggle);
    // Burger menu
    (_g = document.getElementById("burger")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", handleBurger);
}
document.addEventListener("DOMContentLoaded", initMain);
// ---- EXPORTS (for use in other TS files) --------------------
export { getCartFromStorage, saveCartToStorage, updateCartCounter };
