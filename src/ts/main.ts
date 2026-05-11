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

// ---- TYPES --------------------------------------------------

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

// ---- CART COUNTER -------------------------------------------

/**
 * Reads cart from LocalStorage and updates the #cart-count badge.
 * Called on every page load so the counter is always in sync.
 * Hides the badge when count is 0.
 */
function updateCartCounter(): void {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;

  const cart: CartItem[] = getCartFromStorage();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCountEl.textContent = String(totalItems);
  cartCountEl.style.display = totalItems > 0 ? "flex" : "none";
}

/**
 * Reads and parses cart data from LocalStorage.
 * Returns an empty array if nothing is stored or JSON is invalid.
 */
function getCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem("bestshop-cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Saves cart array back to LocalStorage and refreshes the counter.
 */
function saveCartToStorage(cart: CartItem[]): void {
  localStorage.setItem("bestshop-cart", JSON.stringify(cart));
  updateCartCounter();
}

// ---- LOGIN MODAL --------------------------------------------

/**
 * Opens the login modal and traps focus inside it.
 */
function openModal(): void {
  const modal = document.getElementById("login-modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

/**
 * Closes the login modal and restores scroll.
 */
function closeModal(): void {
  const modal = document.getElementById("login-modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearModalErrors();
}

/**
 * Clears all validation error messages inside the modal form.
 */
function clearModalErrors(): void {
  const emailError = document.getElementById("login-email-error");
  const passwordError = document.getElementById("login-password-error");
  if (emailError) emailError.textContent = "";
  if (passwordError) passwordError.textContent = "";
}

/**
 * Validates and submits the login form.
 * Email must match regex. Password must not be empty.
 * Closes modal on success.
 */
function handleLoginSubmit(e: Event): void {
  e.preventDefault();

  const emailInput = document.getElementById("login-email") as HTMLInputElement;
  const passwordInput = document.getElementById(
    "login-password"
  ) as HTMLInputElement;
  const emailError = document.getElementById("login-email-error");
  const passwordError = document.getElementById("login-password-error");

  if (!emailInput || !passwordInput) return;

  let valid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Email validation
  if (!emailRegex.test(emailInput.value.trim())) {
    if (emailError)
      emailError.textContent = "Please enter a valid email address.";
    valid = false;
  } else if (emailError) {
    emailError.textContent = "";
  }

  // Password validation
  if (passwordInput.value.trim() === "") {
    if (passwordError) passwordError.textContent = "Password is required.";
    valid = false;
  } else if (passwordError) {
    passwordError.textContent = "";
  }

  if (valid) {
    closeModal();
    (document.getElementById("login-form") as HTMLFormElement)?.reset();
  }
}

/**
 * Toggles password field between text and password type.
 * Swaps the eye icon accordingly.
 */
function handlePasswordToggle(): void {
  const passwordInput = document.getElementById(
    "login-password"
  ) as HTMLInputElement;
  if (!passwordInput) return;

  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
}

// ---- BURGER MENU --------------------------------------------

/**
 * Toggles the mobile nav open/closed.
 */
function handleBurger(): void {
  const navLinks = document.getElementById("nav-links");
  const burger = document.getElementById("burger");
  if (!navLinks || !burger) return;

  const isOpen = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.classList.toggle("active", isOpen);
}

// ---- INIT ---------------------------------------------------

/**
 * Wires up all shared event listeners.
 * Called once the DOM is ready.
 */
function initMain(): void {
  // Cart counter on every page load
  updateCartCounter();

  // Modal triggers
  document.getElementById("btn-account")?.addEventListener("click", openModal);
  document
    .getElementById("btn-account-mobile")
    ?.addEventListener("click", () => {
      openModal();
      const navLinks = document.getElementById("nav-links");
      const burger = document.getElementById("burger");
      navLinks?.classList.remove("open");
      burger?.classList.remove("active");
      burger?.setAttribute("aria-expanded", "false");
    });
  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  document
    .getElementById("modal-overlay")
    ?.addEventListener("click", closeModal);

  // Close on Escape key
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") closeModal();
  });

  // Login form submit
  document
    .getElementById("login-form")
    ?.addEventListener("submit", handleLoginSubmit);

  // Password show/hide
  document
    .getElementById("toggle-password")
    ?.addEventListener("click", handlePasswordToggle);

  // Burger menu
  document.getElementById("burger")?.addEventListener("click", handleBurger);
}

document.addEventListener("DOMContentLoaded", initMain);

// ---- EXPORTS (for use in other TS files) --------------------
export { getCartFromStorage, saveCartToStorage, updateCartCounter, CartItem };
