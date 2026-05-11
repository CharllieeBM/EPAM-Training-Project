// =============================================================
// cart.ts — Cart page (src/html/cart.html)
// Compiled to: dist/js/cart.js
// Responsibilities:
//   - Read cart from LocalStorage and render items
//   - Quantity +/- updates item quantity and recalculates totals
//   - Remove item button deletes single entry
//   - Clear Cart button: empties cart, shows empty state
//   - Checkout button: clears cart, shows thank-you state
//   - 10% discount applied automatically when subtotal > $3,000
//   - Discount row in summary shown/hidden accordingly
//   - Three states: #cart-content | #cart-empty | #cart-thankyou
//   - All changes persisted to LocalStorage
//   - Cart counter in header updated after every change
// =============================================================

import {
  getCartFromStorage,
  saveCartToStorage,
  updateCartCounter,
  CartItem,
} from "./main.js";

// ---- CONSTANTS ----------------------------------------------

const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_RATE = 0.1;

// ---- STATE MANAGEMENT ---------------------------------------

/**
 * Shows one cart state section and hides the other two.
 * States: 'content' | 'empty' | 'thankyou'
 */
function showState(state: "content" | "empty" | "thankyou"): void {
  const content = document.getElementById("cart-content");
  const empty = document.getElementById("cart-empty");
  const thankyou = document.getElementById("cart-thankyou");
  const hero = document.querySelector<HTMLElement>(".about-hero--cart");

  if (content) content.hidden = state !== "content";
  if (empty) empty.hidden = state !== "empty";
  if (thankyou) thankyou.hidden = state !== "thankyou";
  if (hero) hero.hidden = state !== "content";
}

// ---- RENDER -------------------------------------------------

/**
 * Main render function — reads LocalStorage, decides which state to show,
 * and if cart has items, renders them all + updates the summary.
 */
function renderCart(): void {
  const cart = getCartFromStorage();

  if (cart.length === 0) {
    showState("empty");
    return;
  }

  showState("content");
  renderCartItems(cart);
  renderSummary(cart);
}

/**
 * Renders all cart items into #cart-items.
 */
function renderCartItems(cart: CartItem[]): void {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";

  cart.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart__item";
    itemEl.setAttribute("data-id", item.id);

    itemEl.innerHTML = `
      <div class="cart__item-img-wrap">
        <img class="cart__item-img"
             src="../assets/images/${item.image}"
             alt="${item.name}" />
      </div>

      <span class="cart__item-name">${item.name}</span>

      <span class="cart__item-price">$${item.price.toFixed(2)}</span>

      <div class="cart__item-qty">
        <button class="qty-btn" data-action="minus" data-id="${
          item.id
        }" aria-label="Decrease quantity">&#8722;</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" data-action="plus" data-id="${
          item.id
        }" aria-label="Increase quantity">&#43;</button>
      </div>

      <span class="cart__item-total">$${(item.price * item.quantity).toFixed(
        2
      )}</span>

      <button class="cart__item-remove" data-id="${
        item.id
      }" aria-label="Remove item">
        <img src="../assets/images/garbage-icon.png" alt="Remove" width="18" height="20" />
      </button>
    `;

    container.appendChild(itemEl);
  });

  // Wire up quantity buttons and remove buttons
  container.querySelectorAll<HTMLButtonElement>(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleQuantityChange(btn));
  });

  container
    .querySelectorAll<HTMLButtonElement>(".cart__item-remove")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        handleRemoveItem(btn.dataset.id ?? "")
      );
    });
}

/**
 * Calculates and renders the order summary panel.
 * Shows discount row if subtotal > $3,000.
 */
function renderSummary(cart: CartItem[]): void {
  const SHIPPING = 30;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const hasDiscount = subtotal > DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? subtotal * DISCOUNT_RATE : 0;
  const total = subtotal + SHIPPING - discountAmount;

  const subtotalEl = document.getElementById("cart-subtotal");
  const discountRow = document.getElementById("cart-discount-row");
  const discountEl = document.getElementById("cart-discount");
  const totalEl = document.getElementById("cart-total");

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (discountRow) discountRow.hidden = !hasDiscount;
  if (discountEl) discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ---- ITEM ACTIONS -------------------------------------------

/**
 * Increases or decreases the quantity of a cart item.
 * Minimum quantity is 1 — does not go below.
 */
function handleQuantityChange(btn: HTMLButtonElement): void {
  const id = btn.dataset.id ?? "";
  const action = btn.dataset.action;
  const cart = getCartFromStorage();

  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (action === "plus") {
    item.quantity += 1;
  } else if (action === "minus" && item.quantity > 1) {
    item.quantity -= 1;
  }

  saveCartToStorage(cart);
  updateCartCounter();
  renderCart();
}

/**
 * Removes a single item from the cart by ID.
 */
function handleRemoveItem(id: string): void {
  const cart = getCartFromStorage();
  const updated = cart.filter((item) => item.id !== id);
  saveCartToStorage(updated);
  updateCartCounter();
  renderCart();
}

/**
 * Clears all items from the cart and shows the empty state.
 * Cart counter becomes hidden (count = 0).
 */
function handleClearCart(): void {
  saveCartToStorage([]);
  updateCartCounter();
  showState("empty");
}

/**
 * Clears the cart and shows the thank-you state.
 * Cart counter becomes hidden (count = 0).
 */
function handleCheckout(): void {
  saveCartToStorage([]);
  updateCartCounter();
  showState("thankyou");
}

// ---- INIT ---------------------------------------------------

function initCart(): void {
  renderCart();

  document
    .getElementById("clear-cart-btn")
    ?.addEventListener("click", handleClearCart);
  document
    .getElementById("checkout-btn")
    ?.addEventListener("click", handleCheckout);
}

document.addEventListener("DOMContentLoaded", initCart);
