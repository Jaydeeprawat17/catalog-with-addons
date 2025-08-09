//server.ts

import type e = require("express");
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");

app.use(cors());

//"uploads" url can get inside of assets items
app.use("/uploads", express.static("assets"));

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./assets/");
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

app.listen(4040, () => {
  console.log("running on 4040");
});

app.post("/products", async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    const newProductType = await pool.query(
      "INSERT INTO product_types (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.json(newProductType.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

interface Variant {
  size: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
}

interface Addon {
  name: string;
  description: string;
  price: number;
}

app.post(
  "/api/products",
  upload.single("image"),
  async (req: any, res: e.Response) => {
    try {
      const { name, description, type, basePrice } = req.body; // type is string like "Food"
      const filename = req.file ? req.file.filename : null;

      // Map frontend types to consistent backend types
      let mappedType = type;
      if (type === "general") mappedType = "Electronics";
      if (type === "food") mappedType = "Food";
      if (type === "clothing") mappedType = "Apparel";

      // Find or insert the type
      const typeResult = await pool.query(
        `INSERT INTO product_types (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [mappedType]
      );

      const type_id = typeResult.rows[0].id;

      const variants: Variant[] = req.body.variants
        ? JSON.parse(req.body.variants)
        : [];
      const addons: Addon[] = req.body.addons
        ? JSON.parse(req.body.addons)
        : [];

      // Insert into products table
      const productResult = await pool.query(
        `INSERT INTO products (name, description, type_id, base_price, image) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [name, description, type_id, basePrice, filename]
      );

      const productId = productResult.rows[0].id;

      // Insert product variants (ensure at least one variant exists)
      if (variants.length > 0) {
        for (let variant of variants) {
          await pool.query(
            `INSERT INTO product_variants (product_id, size, color, price, stock, sku) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              productId,
              variant.size || null,
              variant.color || null,
              variant.price || basePrice,
              variant.stock || 0,
              variant.sku ||
                `${mappedType.toLowerCase()}-${productId}-${Date.now()}`,
            ]
          );
        }
      } else {
        // Create default variant if none provided
        await pool.query(
          `INSERT INTO product_variants (product_id, size, color, price, stock, sku) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            productId,
            null,
            null,
            basePrice,
            10, // default stock
            `${mappedType.toLowerCase()}-${productId}-${Date.now()}`,
          ]
        );
      }

      // Insert product addons (only for Food items)
      if (mappedType === "Food" && addons.length > 0) {
        for (let addon of addons) {
          if (addon.name && addon.name.trim()) {
            await pool.query(
              `INSERT INTO product_addons (product_id, name, description, price) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (product_id, name)
         DO UPDATE 
         SET description = EXCLUDED.description,
             price = EXCLUDED.price`,
              [productId, addon.name, addon.description || "", addon.price || 0]
            );
          }
        }
      }

      res.json({ success: true, productId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

app.get("/show-products", async (req: e.Request, res: e.Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        pt.name AS type_name, 
        p.base_price, 
        p.image,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', pv.id,
            'size', pv.size,
            'color', pv.color,
            'price', pv.price,
            'stock', pv.stock,
            'sku', pv.sku
          )) FILTER (WHERE pv.id IS NOT NULL),
          '[]'
        ) AS variants,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', pa.id,
            'name', pa.name,
            'description', pa.description,
            'price', pa.price
          )) FILTER (WHERE pa.id IS NOT NULL),
          '[]'
        ) AS addons
      FROM products p
      LEFT JOIN product_types pt ON p.type_id = pt.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN product_addons pa ON p.id = pa.product_id
      GROUP BY p.id, pt.name
      ORDER BY p.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
