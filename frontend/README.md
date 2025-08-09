# 🛍️ Product Catalog with Variants & Add-ons

This project is a **full-stack product catalog application** where you can manage and display products with multiple **variants** (sizes, colors, prices, stock) and **add-ons** (extra items with prices).  
It includes a responsive **frontend** for browsing products and a **backend** with a PostgreSQL database for storing and retrieving product data.

---

## 📌 Description

The system allows you to:
- Add, edit, and view products with descriptions, prices, and images.
- Assign each product to a **category/type** (e.g., Food, Clothing, Electronics).
- Add **variants** such as size, color, and different prices.
- Add **customizable add-ons** like toppings or accessories.
- Ensure unique product types and add-ons per product using database constraints.
- View product details in a modal without leaving the catalog page.
- Filter products by category/type.

---

## ⚙️ How It Works

1. **Backend (Node.js + PostgreSQL)**  
   - Stores product details, types, variants, and add-ons.
   - Ensures data consistency using `UNIQUE` constraints in the database.
   - API endpoints handle adding, retrieving, and displaying products.
   - Uses `ON CONFLICT` in SQL to prevent duplicate entries for product types and add-ons.

2. **Frontend (React + TypeScript + Tailwind CSS)**  
   - Displays all products in a grid layout.
   - Allows filtering products by category/type.
   - Shows product details, variants, and add-ons in a **Quick View modal**.
   - Displays stock status and price ranges dynamically.

3. **Database**  
   - `product_types` table stores categories/types.
   - `products` table stores core product info.
   - `product_variants` table stores size/color/price/stock details.
   - `product_addons` table stores customizable add-ons per product.

---

## 🛠️ Tech Stack

**Frontend**
- React (TypeScript)
- Tailwind CSS
- Lucide Icons

**Backend**
- Node.js
- Express.js
- PostgreSQL

**Database**
- PostgreSQL with foreign keys & unique constraints
- pg (node-postgres) library for database queries

**Other**
- REST API architecture
- Responsive UI design
- Modular component-based structure

---

## 🖥️ Example Workflow
1. Admin adds a **"Pizza"** product under type **"Food"**.
2. Adds variants like **Small, Medium, Large** with different prices.
3. Adds add-ons like **Extra Cheese, Olives, Mushrooms**.
4. Customers browse the catalog, filter by "Food", click **Quick View** to see details.
5. The system ensures no duplicate category names or duplicate add-on names for the same product.

---

## 📜 License
This project is licensed under the **MIT License**.
