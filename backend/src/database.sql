CREATE DATABASE postgres;

CREATE TABLE product_types(
     id SERIAL PRIMARY KEY,
     name VARCHAR(30),
     description TEXT
)


CREATE TABLE products(
     id SERIAL PRIMARY KEY,
     name VARCHAR(100),
     description TEXT,
     type_id  INT REFERENCES product_types(id),
     base_price      NUMERIC(10,2),   
     image  TEXT
)


CREATE TABLE product_variants(
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  size VARCHAR(20) NULL,
  color VARCHAR(20) NULL,
  price NUMERIC(10,2),
  stock INT,
  sku VARCHAR(50)
);

CREATE TABLE product_addons(
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    name VARCHAR(50),
    description TEXT,
    price NUMERIC(10, 2),
    CONSTRAINT unique_product_addon UNIQUE (product_id, name)
);
