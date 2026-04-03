const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    rating: 4.5,
    image: "https://placehold.co/200x200?text=Headphones"
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "Fashion",
    price: 59.99,
    rating: 4.2,
    image: "https://placehold.co/200x200?text=Shoes"
  },
  {
    id: 3,
    name: "Coffee Maker",
    category: "Home",
    price: 79.99,
    rating: 4.0,
    image: "https://placehold.co/200x200?text=Coffee+Maker"
  },
  {
    id: 4,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    rating: 4.7,
    image: "https://placehold.co/200x200?text=Smartphone"
  },
  {
    id: 5,
    name: "Jacket",
    category: "Fashion",
    price: 89.99,
    rating: 4.3,
    image: "https://placehold.co/200x200?text=Jacket"
  },
  {
    id: 6,
    name: "Blender",
    category: "Home",
    price: 49.99,
    rating: 4.1,
    image: "https://placehold.co/200x200?text=Blender"
  }
];

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.get("/api/products", (req, res) => {
  let filtered = [...products];

  const { q, category, min_price, max_price, sort } = req.query;

  if (q) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (min_price) {
    filtered = filtered.filter((p) => p.price >= Number(min_price));
  }

  if (max_price) {
    filtered = filtered.filter((p) => p.price <= Number(max_price));
  }

  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "name_asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json(filtered);
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});