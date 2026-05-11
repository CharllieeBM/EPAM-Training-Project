# 🧳 Suitcase E-Shop

A fully responsive, multi-page e-commerce website for travel luggage. Built with semantic HTML, SASS, and vanilla TypeScript — no frameworks.

---

## Pages

| Page            | File                    |
| --------------- | ----------------------- |
| Homepage        | `src/index.html`        |
| Catalog         | `src/html/catalog.html` |
| Product Details | `src/html/product.html` |
| About Us        | `src/html/about.html`   |
| Contact Us      | `src/html/contact.html` |
| Cart            | `src/html/cart.html`    |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm (comes with Node.js)

---

## Setup & Run

```bash
# 1. Install dependencies (includes SASS, TypeScript, ESLint, Stylelint)
npm install

# 2. Compile SASS + TypeScript and watch for changes
npm run dev
```

Then open `src/index.html` in your browser using a local server (e.g. VS Code Live Server).

---

## Project Structure

suitcase-eshop/
├── src/
│ ├── index.html ← Homepage
│ ├── html/
│ │ ├── catalog.html
│ │ ├── product.html
│ │ ├── about.html
│ │ ├── contact.html
│ │ └── cart.html
│ ├── assets/
│ │ ├── data.json ← Product data
│ │ └── images/ ← All images
│ ├── scss/
│ │ ├── main.scss ← Entry point (imports all partials)
│ │ ├── \_variables.scss
│ │ ├── \_mixins.scss
│ │ ├── \_reset.scss
│ │ ├── \_fonts.scss
│ │ ├── \_buttons.scss
│ │ ├── \_forms.scss
│ │ ├── \_header.scss
│ │ ├── \_footer.scss
│ │ ├── \_product-card.scss
│ │ ├── \_product-details.scss
│ │ ├── \_catalog.scss
│ │ ├── \_cart.scss
│ │ └── \_about.scss
│ └── ts/
│ ├── main.ts ← Shared (header, modal, cart counter)
│ ├── home.ts
│ ├── catalog.ts
│ ├── product.ts
│ ├── cart.ts
│ ├── contact.ts
│ └── about.ts
├── dist/
│ ├── css/
│ │ └── main.css ← Auto-generated from SASS, do not edit
│ └── js/
│ ├── main.js ← Auto-generated from TypeScript, do not edit
│ ├── home.js
│ ├── catalog.js
│ ├── product.js
│ ├── cart.js
│ ├── contact.js
│ └── about.js
├── package.json
├── tsconfig.json
└── README.md

---

## Scripts

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `npm install`      | Install all dependencies                        |
| `npm run dev`      | Compile SASS + TypeScript and watch for changes |
| `npm run build`    | Compile SASS (minified, for production)         |
| `npm run lint`     | Run ESLint (TypeScript) + Stylelint (SCSS)      |
| `npm run lint:ts`  | Lint TypeScript only                            |
| `npm run lint:css` | Lint SCSS only                                  |

---

## Features

- ✅ Sticky header with hamburger menu on mobile
- ✅ Hero image slider with auto-advance and dot navigation
- ✅ Products loaded dynamically from `data.json`
- ✅ Catalog with filtering (category, color, size, sale), sorting, search, and pagination (12 per page)
- ✅ Active filter highlight and "Showing X–Y of Z results" count
- ✅ Top Best Sets section with randomly selected products
- ✅ Product details page with quantity selector and Add to Cart
- ✅ Review form with success/error feedback (no page reload)
- ✅ Cart with real-time counter, quantity update, remove, clear, and checkout
- ✅ Cart merges entries with matching name + size + color
- ✅ 10% discount applied automatically when cart total exceeds $3,000
- ✅ Login modal with email regex and password validation
- ✅ Contact form with real-time validation (no page reload)
- ✅ Responsive design: mobile (768px), tablet (1024px), desktop (1440px)
- ✅ LocalStorage for cart persistence
  Check list points: 64/64 checked.
