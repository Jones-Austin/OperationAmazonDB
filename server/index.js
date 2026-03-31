const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    rating: 4.5,
    image: "https://via.placeholder.com/200?text=Headphones"
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "Fashion",
    price: 59.99,
    rating: 4.2,
    image: "https://via.placeholder.com/200?text=Shoes"
  },
  {
    id: 3,
    name: "Coffee Maker",
    category: "Home",
    price: 39.99,
    rating: 4.0,
    image: "https://via.placeholder.com/200?text=Coffee+Maker"
  },
  {
    id: 4,
    name: "Backpack",
    category: "Fashion",
    price: 49.99,
    rating: 4.4,
    image: "https://via.placeholder.com/200?text=Backpack"
  },
  {
    id: 5,
    name: "Smart Watch",
    category: "Electronics",
    price: 129.99,
    rating: 4.6,
    image: "https://via.placeholder.com/200?text=Smart+Watch"
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Home",
    price: 24.99,
    rating: 4.1,
    image: "https://via.placeholder.com/200?text=Desk+Lamp"
  }
];

app.get("/api/products", (req, res) => {
  let filteredProducts = [...products];

  const { q, category, min_price, max_price, sort } = req.query;

  if (q) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (category && category !== "All") {
    filteredProducts = filteredProducts.filter(
      product => product.category === category
    );
  }

  if (min_price) {
    filteredProducts = filteredProducts.filter(
      product => product.price >= Number(min_price)
    );
  }

  if (max_price) {
    filteredProducts = filteredProducts.filter(
      product => product.price <= Number(max_price)
    );
  }

  if (sort === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "name_asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json(filteredProducts);
});

app.listen(PORT, () => {
  console.log(`Mock Amazon API running at http://localhost:${PORT}`);
});