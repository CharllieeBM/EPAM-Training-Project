// =============================================================
// catalog.ts — Catalog page (src/html/catalog.html)
// Compiled to: dist/js/catalog.js
// Responsibilities:
//   - Fetch products from data.json
//   - Search by name → navigate to product page or show not-found popup
//   - Filter by category, price, color, size, salesStatus
//   - Active filter highlight (checked checkbox labels get .active class)
//   - Sort by price asc/desc, popularity, rating
//   - Pagination: 12 per page, prev/next, "Showing X–Y of Z results"
//   - Top Best Sets: random products rendered in #top-sets-grid
//   - Filter dropdowns: open/close on toggle button click
// =============================================================

import {
  getCartFromStorage,
  saveCartToStorage,
  updateCartCounter,
} from "./main.js";

// ---- TYPES --------------------------------------------------

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string; // matches data.json
  category: string; // matches data.json (replaces "brand")
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: string[];
}

interface ActiveFilters {
  price: string[];
  color: string[];
  size: string[];
  salesStatus: string[];
  category: string[]; // replaces "brand"
}

// ---- CONSTANTS ----------------------------------------------

const PRODUCTS_PER_PAGE = 12;
const DATA_PATH = "../assets/data.json";

// ---- STATE --------------------------------------------------

let allProducts: Product[] = [];
let filteredProducts: Product[] = [];
let currentPage = 1;

// ---- DATA FETCHING ------------------------------------------

/**
 * Fetches and unwraps the product array from data.json.
 * data.json has shape: { "data": [ ...products ] }
 */
async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(DATA_PATH);
  const json = await response.json();
  return json.data;
}

// ---- SEARCH -------------------------------------------------

/**
 * Searches allProducts by name (case-insensitive).
 * If match found → navigate to product.html?id=
 * If no match → show #catalog-search-notfound popup for 3 seconds
 */
function handleSearch(e: Event): void {
  e.preventDefault();

  const input = document.getElementById(
    "catalog-search-input"
  ) as HTMLInputElement;
  const notFound = document.getElementById("catalog-search-notfound");
  const query = input?.value.trim().toLowerCase();

  if (!query) return;

  const match = allProducts.find((p) => p.name.toLowerCase().includes(query));

  if (match) {
    window.location.href = `./product.html?id=${match.id}`;
  } else if (notFound) {
    notFound.hidden = false;
    setTimeout(() => {
      notFound.hidden = true;
    }, 3000);
  }
}

// ---- FILTERS ------------------------------------------------

/**
 * Reads all checked filter checkboxes and returns the active filter state.
 */
function getActiveFilters(): ActiveFilters {
  const filters: ActiveFilters = {
    price: [],
    color: [],
    size: [],
    salesStatus: [],
    category: [],
  };

  document
    .querySelectorAll<HTMLInputElement>(
      '.filter-group__options input[type="checkbox"]:checked'
    )
    .forEach((cb) => {
      const name = cb.name as keyof ActiveFilters;
      if (name in filters) filters[name].push(cb.value);
    });

  return filters;
}

/**
 * Applies active filters to allProducts and updates filteredProducts.
 * Also highlights active filter labels with .active class.
 */
function applyFilters(): void {
  const filters = getActiveFilters();

  // Highlight active filter labels
  document
    .querySelectorAll<HTMLInputElement>(
      '.filter-group__options input[type="checkbox"]'
    )
    .forEach((cb) => {
      cb.closest("label")?.classList.toggle("active", cb.checked);
    });

  filteredProducts = allProducts.filter((product) => {
    // Price range
    if (filters.price.length) {
      const inRange = filters.price.some((range) => {
        if (range === "under100") return product.price < 100;
        if (range === "100-300")
          return product.price >= 100 && product.price <= 300;
        if (range === "300-500")
          return product.price > 300 && product.price <= 500;
        if (range === "over500") return product.price > 500;
        return false;
      });
      if (!inRange) return false;
    }

    // Color
    if (filters.color.length && !filters.color.includes(product.color ?? ""))
      return false;

    // Size
    if (filters.size.length && !filters.size.includes(product.size ?? ""))
      return false;

    // Sale
    if (filters.salesStatus.length && !product.salesStatus) return false;

    // Category
    if (
      filters.category.length &&
      !filters.category.includes(product.category ?? "")
    )
      return false;

    return true;
  });

  currentPage = 1;
  applySort();
}

/**
 * Resets all filters and re-renders the full product list.
 */
function resetFilters(): void {
  document
    .querySelectorAll<HTMLInputElement>(
      '.filter-group__options input[type="checkbox"]'
    )
    .forEach((cb) => {
      cb.checked = false;
      cb.closest("label")?.classList.remove("active");
    });

  filteredProducts = allProducts.filter((p) => p.category !== "luggage sets");
  currentPage = 1;
  applySort();
}

// ---- SORT ---------------------------------------------------

/**
 * Reads the sort dropdown value and sorts filteredProducts in place.
 * Then re-renders the current page.
 */
function applySort(): void {
  const sortSelect = document.getElementById(
    "sort-select"
  ) as HTMLSelectElement;
  const sortValue = sortSelect?.value ?? "price-asc";

  filteredProducts.sort((a, b) => {
    switch (sortValue) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "popularity":
        return b.popularity - a.popularity;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  renderPage();
}

// Mobile sort button — toggles sort select visibility
const sortBtnMobile = document.getElementById(
  "sort-btn-mobile"
) as HTMLButtonElement | null;
const sortSelect = document.getElementById(
  "sort-select"
) as HTMLSelectElement | null;

sortBtnMobile?.addEventListener("click", () => {
  if (!sortSelect) return;
  const isHidden = window.getComputedStyle(sortSelect).display === "none";
  sortSelect.style.display = isHidden ? "block" : "none";
  sortSelect.style.width = "100%";
});

// ---- PAGINATION ---------------------------------------------

/**
 * Renders the correct slice of filteredProducts for the current page.
 * Updates the count label and pagination controls.
 */
function renderPage(): void {
  const grid = document.getElementById("catalog-grid");
  const countEl = document.getElementById("catalog-count");
  if (!grid) return;

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = Math.min(start + PRODUCTS_PER_PAGE, total);
  const pageProducts = filteredProducts.slice(start, end);

  // Render cards
  grid.innerHTML = "";
  pageProducts.forEach((product) =>
    grid.appendChild(createProductCard(product))
  );

  // Update count label
  if (countEl) {
    countEl.textContent =
      total > 0
        ? `Showing ${start + 1}–${end} of ${total} results`
        : "No products found";
  }

  // Update pagination buttons
  updatePagination(totalPages);
}

/**
 * Rebuilds the pagination controls.
 * Enables/disables prev/next, renders page number buttons.
 */
function updatePagination(totalPages: number): void {
  const prevBtn = document.getElementById(
    "pagination-prev"
  ) as HTMLButtonElement;
  const nextBtn = document.getElementById(
    "pagination-next"
  ) as HTMLButtonElement;
  const pagesContainer = document.getElementById("pagination-pages");

  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn)
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  if (!pagesContainer) return;
  pagesContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `pagination__btn${i === currentPage ? " active" : ""}`;
    btn.textContent = String(i);
    btn.setAttribute("aria-label", `Page ${i}`);
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    pagesContainer.appendChild(btn);
  }
}

// ---- PRODUCT CARDS ------------------------------------------

function createProductCard(product: Product): HTMLElement {
  const card = document.createElement("article");
  card.className = "product-card";

  card.innerHTML = `
  <div class="product-card__img-wrap">
    ${
      product.salesStatus
        ? '<span class="product-card__sale-badge">SALE</span>'
        : ""
    }
    <img class="product-card__img"
         src="../assets/images/${product.imageUrl}"
         alt="${product.name}" />
  </div>
  
    <div class="product-card__body">
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__rating" aria-label="Rating: ${
        product.rating
      } out of 5">
        ${renderStars(product.rating)}
      </div>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
      <button class="btn btn--primary product-card__btn" data-id="${
        product.id
      }">
        Add to Cart
      </button>
    </div>
  `;

  card.addEventListener("click", (e: Event) => {
    if (!(e.target as HTMLElement).closest(".product-card__btn")) {
      window.location.href = `./product.html?id=${product.id}`;
    }
  });

  card
    .querySelector(".product-card__btn")
    ?.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      addToCart(product);
    });

  return card;
}

function renderStars(rating: number): string {
  return Array.from(
    { length: 5 },
    (_, i) => `<span>${i < Math.round(rating) ? "★" : "☆"}</span>`
  ).join("");
}

function addToCart(product: Product): void {
  const cart = getCartFromStorage();
  const existing = cart.find(
    (item) =>
      item.id === product.id &&
      item.color === product.color &&
      item.size === product.size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl, // CartItem uses "image", sourced from imageUrl
      color: product.color,
      size: product.size,
      quantity: 1,
    });
  }

  saveCartToStorage(cart);
  updateCartCounter();
}

// ---- CATEGORY FILTER (dynamic) ------------------------------

/**
 * Reads unique categories from allProducts and populates #filter-brand-options.
 * The HTML filter group is labelled "Brand" but filters by category
 * since data.json has no brand field.
 */
function populateCategoryFilter(products: Product[]): void {
  const container = document.getElementById("filter-brand-options");
  if (!container) return;

  const categories = [...new Set(products.map((p) => p.category))].sort(
    (a, b) => a.localeCompare(b)
  );
  categories.forEach((category) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="category" value="${category}" /> ${category}`;
    label.querySelector("input")?.addEventListener("change", applyFilters);
    container.appendChild(label);
  });
}

// ---- FILTER DROPDOWNS ---------------------------------------

/**
 * Wires up all filter-group toggle buttons to open/close their options panel.
 */
function initFilterToggles(): void {
  document
    .querySelectorAll<HTMLButtonElement>(".filter-group__toggle")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("aria-controls");
        const options = document.getElementById(targetId ?? "");
        if (!options) return;

        const isOpen = options.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });
}

// ---- INIT ---------------------------------------------------

async function initCatalog(): Promise<void> {
  allProducts = await fetchProducts();
  filteredProducts = allProducts.filter((p) => p.category !== "luggage sets");

  populateCategoryFilter(allProducts);
  initFilterToggles();

  // Wire up static filter checkboxes
  document
    .querySelectorAll<HTMLInputElement>(
      "#filter-price input, #filter-color input, #filter-size input, #filter-sale input"
    )
    .forEach((cb) => cb.addEventListener("change", applyFilters));

  // Reset button
  document
    .getElementById("filters-reset")
    ?.addEventListener("click", resetFilters);

  // Sort dropdown
  document.getElementById("sort-select")?.addEventListener("change", applySort);

  // Search form
  document
    .getElementById("catalog-search-form")
    ?.addEventListener("submit", handleSearch);

  // Pagination prev/next
  document.getElementById("pagination-prev")?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
    }
  });
  document.getElementById("pagination-next")?.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
    }
  });

  // Initial render
  applySort();
}

document.addEventListener("DOMContentLoaded", initCatalog);
