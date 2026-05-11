// =============================================================
// home.ts — Homepage only (index.html)
// Compiled to: dist/js/home.js
// Responsibilities:
//   - Random hero title text on page load
//   - Travel Suitcases slider (prev/next arrows cycle cards)
//   - Load Selected Products (first 4 from data.json)
//   - Load New Arrivals (products 5–8 from data.json)
//   - Product card click → navigate to html/product.html?id=
//   - Add to Cart → update LocalStorage + header counter
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
const HERO_TEXTS = [
    "Travel in Style",
    "Your Journey Starts Here",
    "Pack Light, Dream Big",
    "Adventure Awaits You",
    "The World is Your Destination",
];
const DATA_PATH = "assets/data.json";
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
// ---- RANDOM HERO TEXT ---------------------------------------
// CHANGED: replaces the old multi-slide initHeroSlider().
// The hero is now a static two-column layout — we just swap
// the h1 text randomly on each page load.
/**
 * Picks a random title from HERO_TEXTS and sets it on #hero-random-text.
 */
function initRandomHeroText() {
    const el = document.getElementById("hero-random-text");
    if (!el)
        return;
    el.textContent = HERO_TEXTS[Math.floor(Math.random() * HERO_TEXTS.length)];
}
// ---- TRAVEL SUITCASES SLIDER --------------------------------
// CHANGED: replaces the old hero slider with the Travel Suitcases
// section slider. Arrows move cards by appending/prepending DOM nodes
// so the 4-column grid always looks full.
/**
 * Initialises prev/next arrow navigation for the Travel Suitcases section.
 * Each arrow click moves one card from one end of the track to the other,
 * creating an infinite-loop feel with no CSS translateX needed.
 */
function initTravelSlider() {
    var _a, _b;
    const track = document.getElementById("travel-track");
    if (!track)
        return;
    (_a = document.getElementById("travel-prev")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        // Move last card to the front
        const last = track.lastElementChild;
        if (last)
            track.insertBefore(last, track.firstElementChild);
    });
    (_b = document.getElementById("travel-next")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        // Move first card to the end
        const first = track.firstElementChild;
        if (first)
            track.appendChild(first);
    });
}
// ---- PRODUCT CARDS ------------------------------------------
/**
 * Creates a product card element from a Product object.
 * Card click → navigates to html/product.html?id=
 * Add to Cart button → saves to LocalStorage + updates counter
 */
function createProductCard(product) {
    var _a;
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
    <div class="product-card__img-wrap">
      ${product.salesStatus
        ? '<span class="product-card__sale-badge">SALE</span>'
        : ""}
      <img class="product-card__img"
           src="assets/images/${product.imageUrl}"
           alt="${product.name}" />
    </div>
    <div class="product-card__body">
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__rating" aria-label="Rating: ${product.rating} out of 5">
        ${renderStars(product.rating)}
      </div>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
      <button class="btn btn--primary product-card__btn" data-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
    card.addEventListener("click", (e) => {
        if (!e.target.closest(".product-card__btn")) {
            window.location.href = `html/product.html?id=${product.id}`;
        }
    });
    (_a = card
        .querySelector(".product-card__btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product);
    });
    return card;
}
/**
 * Returns a star rating string based on a numeric rating.
 */
function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => `<span>${i < Math.round(rating) ? "★" : "☆"}</span>`).join("");
}
/**
 * Adds a product to the cart in LocalStorage.
 * Merges if id + color + size match, otherwise pushes a new entry.
 */
function addToCart(product) {
    const cart = getCartFromStorage();
    const existing = cart.find((item) => item.id === product.id &&
        item.color === product.color &&
        item.size === product.size);
    if (existing) {
        existing.quantity += 1;
    }
    else {
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl,
            color: product.color,
            size: product.size,
            quantity: 1,
        };
        cart.push(newItem);
    }
    saveCartToStorage(cart);
    updateCartCounter();
}
// ---- PRODUCT SECTIONS ---------------------------------------
/**
 * Loads and renders the first 4 products into #selected-products.
 */
function loadSelectedProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const grid = document.getElementById("selected-products");
        if (!grid)
            return;
        const products = yield fetchProducts();
        products.slice(0, 4).forEach((p) => grid.appendChild(createProductCard(p)));
    });
}
/**
 * Loads and renders products 5–8 into #new-products.
 */
function createNewArrivalCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
    <div class="product-card__img-wrap">
      ${product.salesStatus
        ? '<span class="product-card__sale-badge">SALE</span>'
        : ""}
      <img class="product-card__img"
           src="assets/images/${product.imageUrl}"
           alt="${product.name}" />
    </div>
    <div class="product-card__body">
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__rating" aria-label="Rating: ${product.rating} out of 5">
        ${renderStars(product.rating)}
      </div>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
      <button class="btn btn--primary product-card__btn" data-id="${product.id}">
        View Product
      </button>
    </div>
  `;
    card.addEventListener("click", () => {
        window.location.href = `html/product.html?id=${product.id}`;
    });
    return card;
}
function loadNewArrivals() {
    return __awaiter(this, void 0, void 0, function* () {
        const grid = document.getElementById("new-products");
        if (!grid)
            return;
        const products = yield fetchProducts();
        products
            .slice(4, 8)
            .forEach((p) => grid.appendChild(createNewArrivalCard(p)));
    });
}
// ---- INIT ---------------------------------------------------
function initHome() {
    return __awaiter(this, void 0, void 0, function* () {
        initRandomHeroText(); // ← NEW: replaces initHeroSlider()
        initTravelSlider(); // ← NEW: Travel Suitcases section arrows
        yield loadSelectedProducts();
        yield loadNewArrivals();
    });
}
document.addEventListener("DOMContentLoaded", initHome);
