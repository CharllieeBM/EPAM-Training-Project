// =============================================================
// product.ts — Product Details page (src/html/product.html)
// Compiled to: dist/js/product.js
// Responsibilities:
//   - Read ?id= query param from URL
//   - Fetch matching product from data.json
//   - Populate: image, thumbnails, name, rating stars + review count, price, breadcrumb
//   - Thumbnail click → swap main image + active state
//   - Quantity selector (+/-), minimum value of 1
//   - Add to Cart → LocalStorage + header counter update
//   - Tab switching (Details / Reviews / Shipping Policy)
//   - Star rating selector in review form
//   - Review form: validate name + email + text, show success/error without page reload
//   - You May Also Like: 4 randomly selected products
// =============================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCartFromStorage, saveCartToStorage, updateCartCounter, } from "./main.js";
// ---- CONSTANTS ----------------------------------------------
const DATA_PATH = "../assets/data.json";
// ---- DATA FETCHING ------------------------------------------
/**
 * Fetches and unwraps the product array from data.json.
 * data.json has shape: { "data": [ ...products ] }
 */
function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(DATA_PATH);
        const json = yield response.json();
        return json.data;
    });
}
/**
 * Reads the ?id= query param from the current URL.
 */
function getProductIdFromUrl() {
    return new URLSearchParams(window.location.search).get("id");
}
// ---- RENDER PRODUCT -----------------------------------------
/**
 * Populates all dynamic fields on the product detail page.
 * Per requirements: only name, rating, price, and main image change per product.
 * Description falls back to category info since data.json has no description field.
 */
function renderProduct(product) {
    // Breadcrumb
    const breadcrumb = document.getElementById("product-breadcrumb");
    if (breadcrumb)
        breadcrumb.textContent = product.name;
    // Main image
    const img = document.getElementById("product-img");
    if (img) {
        img.src = `../assets/images/${product.imageUrl}`;
        img.alt = product.name;
    }
    // Thumbnails — use the thumbnails array from data.json
    initThumbnails([product.imageUrl, ...product.thumbnails.slice(0, 3)], product.name);
    // Name
    const nameEl = document.getElementById("product-name");
    if (nameEl)
        nameEl.textContent = product.name;
    // Rating stars + review count
    // c43: stars #F5B423, "(1 Client Review)" 13px #504E4A
    const ratingEl = document.getElementById("product-rating");
    if (ratingEl) {
        ratingEl.innerHTML =
            renderStars(product.rating) +
                `<span class="rating__count">(1 Client Review)</span>`;
        ratingEl.setAttribute("aria-label", `Rating: ${product.rating} out of 5`);
    }
    // Price
    const priceEl = document.getElementById("product-price");
    if (priceEl)
        priceEl.textContent = `$${product.price.toFixed(2)}`;
    // Details tab — data.json has no description field so we use category + details
    const descEl = document.getElementById("product-description");
    if (descEl) {
        descEl.innerHTML =
            `${product.name} — Category: ${product.category}. ` +
                `Available in ${product.color}, size ${product.size}. ` +
                `${product.salesStatus ? "Currently on sale!" : ""}` +
                `<br><br>` +
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ` +
                `incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ` +
                `exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ` +
                `dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ` +
                `Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    }
    // Page title
    document.title = `${product.name} — Best Shop`;
}
function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => `<span>${i < Math.round(rating) ? "★" : "☆"}</span>`).join("");
}
// ---- THUMBNAILS ---------------------------------------------
/**
 * Populates all 4 thumbnail <img> tags from the product's thumbnails array
 * and wires up click handlers to swap the main image + update the active border.
 */
function initThumbnails(thumbnails, altText) {
    const mainImg = document.getElementById("product-img");
    const thumbBtns = document.querySelectorAll(".product-detail__thumb");
    thumbBtns.forEach((btn, index) => {
        var _a;
        const img = btn.querySelector("img");
        const src = (_a = thumbnails[index]) !== null && _a !== void 0 ? _a : thumbnails[0]; // fallback to first if fewer than 4
        if (img) {
            img.src = `../assets/images/${src}`;
            img.alt = `${altText} view ${index + 1}`;
        }
        btn.addEventListener("click", () => {
            if (mainImg) {
                mainImg.src = `../assets/images/${src}`;
                mainImg.alt = `${altText} view ${index + 1}`;
            }
            // Update active state
            thumbBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}
// ---- QUANTITY SELECTOR --------------------------------------
/**
 * Wires up the +/- quantity buttons.
 * Minimum value is 1 — cannot go below.
 */
function initQuantitySelector() {
    const input = document.getElementById("qty-input");
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    minusBtn === null || minusBtn === void 0 ? void 0 : minusBtn.addEventListener("click", () => {
        const current = parseInt(input.value, 10);
        if (current > 1)
            input.value = String(current - 1);
    });
    plusBtn === null || plusBtn === void 0 ? void 0 : plusBtn.addEventListener("click", () => {
        const current = parseInt(input.value, 10);
        input.value = String(current + 1);
    });
}
// ---- ADD TO CART --------------------------------------------
/**
 * Adds the product (with selected quantity) to LocalStorage.
 * Merges if name + size + color already in cart, otherwise adds new entry.
 */
function initAddToCart(product) {
    var _a;
    (_a = document.getElementById("add-to-cart-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a;
        const qtyInput = document.getElementById("qty-input");
        const quantity = parseInt((_a = qtyInput === null || qtyInput === void 0 ? void 0 : qtyInput.value) !== null && _a !== void 0 ? _a : "1", 10);
        const cart = getCartFromStorage();
        const existing = cart.find((item) => item.id === product.id &&
            item.color === product.color &&
            item.size === product.size);
        if (existing) {
            existing.quantity += quantity;
        }
        else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.imageUrl, // CartItem uses "image", sourced from imageUrl
                color: product.color,
                size: product.size,
                quantity,
            });
        }
        saveCartToStorage(cart);
        updateCartCounter();
    });
}
// ---- TABS ---------------------------------------------------
/**
 * Wires up Description / Reviews tab switching.
 */
function initTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            var _a;
            const targetId = `tab-${tab.dataset.tab}`;
            // Deactivate all tabs and panels
            tabs.forEach((t) => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            document
                .querySelectorAll(".tab-content")
                .forEach((panel) => panel.classList.remove("active"));
            // Activate clicked tab and its panel
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            (_a = document.getElementById(targetId)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
        });
    });
}
// ---- REVIEW FORM --------------------------------------------
/**
 * Wires up the interactive star rating selector.
 * Hovering highlights stars up to that point;
 * clicking locks in the selection and stores it in the hidden #review-rating input.
 */
function initStarSelector() {
    const stars = document.querySelectorAll(".review-star-select");
    const ratingInput = document.getElementById("review-rating");
    stars.forEach((star, index) => {
        // Hover — highlight up to hovered star
        star.addEventListener("mouseenter", () => {
            stars.forEach((s, i) => {
                s.textContent = i <= index ? "★" : "☆";
                s.classList.toggle("filled", i <= index);
            });
        });
        // Mouse leave — revert to selected value
        star.addEventListener("mouseleave", () => {
            var _a;
            const selected = parseInt((_a = ratingInput === null || ratingInput === void 0 ? void 0 : ratingInput.value) !== null && _a !== void 0 ? _a : "0", 10);
            stars.forEach((s, i) => {
                s.textContent = i < selected ? "★" : "☆";
                s.classList.toggle("filled", i < selected);
            });
        });
        // Click — lock in rating
        star.addEventListener("click", () => {
            const value = index + 1;
            if (ratingInput)
                ratingInput.value = String(value);
            stars.forEach((s, i) => {
                s.textContent = i < value ? "★" : "☆";
                s.classList.toggle("filled", i < value);
            });
        });
    });
}
/**
 * Validates the review form fields.
 * Sets/clears error messages and returns true if all fields are valid.
 */
function validateReviewForm() {
    var _a, _b, _c;
    const name = (_a = document.getElementById("review-name")) === null || _a === void 0 ? void 0 : _a.value.trim();
    const email = (_b = document.getElementById("review-email")) === null || _b === void 0 ? void 0 : _b.value.trim();
    const text = (_c = document.getElementById("review-text")) === null || _c === void 0 ? void 0 : _c.value.trim();
    const nameError = document.getElementById("review-name-error");
    const emailError = document.getElementById("review-email-error");
    const textError = document.getElementById("review-text-error");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    if (nameError)
        nameError.textContent = name ? "" : "Name is required.";
    if (!name)
        valid = false;
    if (!email) {
        if (emailError)
            emailError.textContent = "Email is required.";
        valid = false;
    }
    else if (!emailRegex.test(email)) {
        if (emailError)
            emailError.textContent = "Please enter a valid email.";
        valid = false;
    }
    else if (emailError) {
        emailError.textContent = "";
    }
    if (textError)
        textError.textContent = text ? "" : "Review text is required.";
    if (!text)
        valid = false;
    return valid;
}
/**
 * Resets the star rating selector back to empty state.
 */
function resetReviewStars() {
    document
        .querySelectorAll(".review-star-select")
        .forEach((s) => {
        s.textContent = "☆";
        s.classList.remove("filled");
    });
    const ratingInput = document.getElementById("review-rating");
    if (ratingInput)
        ratingInput.value = "0";
}
/**
 * Handles review form submission.
 * Validates name, email, and review text.
 * Shows success or error message without reloading the page.
 */
function initReviewForm() {
    const form = document.getElementById("review-form");
    const msgEl = document.getElementById("review-msg");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!msgEl)
            return;
        if (validateReviewForm()) {
            msgEl.textContent = "Thank you for your review!";
            msgEl.className = "review-form__msg success";
            form.reset();
            resetReviewStars();
        }
        else {
            msgEl.textContent = "Please fill in all required fields.";
            msgEl.className = "review-form__msg error";
        }
    });
}
// ---- YOU MAY ALSO LIKE --------------------------------------
/**
 * Picks 4 random products (excluding current) and renders them in #related-products.
 */
function loadRelatedProducts(allProducts, currentId) {
    const grid = document.getElementById("related-products");
    if (!grid)
        return;
    const others = allProducts.filter((p) => p.id !== currentId);
    const shuffled = others.toSorted(() => Math.random() - 0.5).slice(0, 4);
    shuffled.forEach((product) => {
        var _a;
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
      <div class="product-card__img-wrap">
        <img class="product-card__img"
             src="../assets/images/${product.imageUrl}"
             alt="${product.name}" />
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.name}</h3>
        <div class="product-card__rating">${renderStars(product.rating)}</div>
        <p class="product-card__price">$${product.price.toFixed(2)}</p>
        <button class="btn btn--primary product-card__btn" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
        card.addEventListener("click", (e) => {
            if (!e.target.closest(".product-card__btn")) {
                window.location.href = `./product.html?id=${product.id}`;
            }
        });
        (_a = card
            .querySelector(".product-card__btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
            e.stopPropagation();
            const cart = getCartFromStorage();
            const existing = cart.find((item) => item.id === product.id &&
                item.color === product.color &&
                item.size === product.size);
            if (existing) {
                existing.quantity += 1;
            }
            else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.imageUrl,
                    color: product.color,
                    size: product.size,
                    quantity: 1,
                });
            }
            saveCartToStorage(cart);
            updateCartCounter();
        });
        grid.appendChild(card);
    });
}
// ---- INIT ---------------------------------------------------
function initProduct() {
    return __awaiter(this, void 0, void 0, function* () {
        const id = getProductIdFromUrl();
        if (!id)
            return;
        const products = yield fetchProducts();
        const product = products.find((p) => p.id === id);
        if (!product)
            return;
        renderProduct(product);
        initQuantitySelector();
        initAddToCart(product);
        initTabs();
        initStarSelector();
        initReviewForm();
        loadRelatedProducts(products, id);
    });
}
document.addEventListener("DOMContentLoaded", initProduct);
