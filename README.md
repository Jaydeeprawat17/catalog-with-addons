# 🛍️ Product Catalog with Quick View Modal

A modern, responsive **product catalog** built with **React + TypeScript** and styled using **Tailwind CSS**.  
This project displays products in a grid layout with category filtering, stock indicators, price ranges, and a "Quick View" modal for detailed product information.

---

## 🚀 Features

- **Dynamic Product Grid** – Displays products with name, description, price, and stock info.
- **Category Filtering** – Filter products by category/type (e.g., Food, Electronics, Apparel).
- **Responsive Design** – Works seamlessly on mobile, tablet, and desktop.
- **Quick View Modal** – View product details without leaving the catalog.
- **Stock Indicators** – Shows remaining stock with color-coded badges.
- **Price Range Display** – Shows either a single price or a price range based on variants.
- **Customizable Badges** – Food products with add-ons are marked as "Customizable".

---

## 🛠️ Tech Stack

- **React** (with Hooks)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React Icons**
- **PostgreSQL** (Backend)
- **Node.js / Express** (API)

---

## 📂 Project Structure

src/
│── components/
│ ├── ProductCard.tsx # Displays each product card in the grid
│ ├── ProductModal.tsx # Modal for detailed product view
│── pages/
│ ├── index.tsx # Main catalog page with filtering and modal logic
│── types/
│ ├── catalog.ts # Type definitions for Product, Variant, AddOn
│── styles/ # Tailwind styles



## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash

git clone https://github.com/Jaydeeprawat17/catalog-with-addons
cd product-catalog
2️⃣ Install Dependencies
bash
npm install
3️⃣ Set Up Environment Variables
Create a .env file in the project root:

env
DATABASE_URL=postgres://username:password@localhost:5432/your_database

4️⃣ Run the Development Server
bash
npm run dev
Visit http://localhost:3000 in your browser.


🔧 Backend Setup
Ensure PostgreSQL is running.


📜 License
This project is licensed under the MIT License – you can freely use and modify it.
Developed by Jaydeep Rawat.
---
