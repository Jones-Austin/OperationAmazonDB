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
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description:
      "Comfortable wireless headphones with clear sound and noise-reducing ear cushions."
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "Fashion",
    price: 59.99,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description:
      "Lightweight running shoes designed for everyday training, walking, and comfort."
  },
  {
    id: 3,
    name: "Coffee Maker",
    category: "Home",
    price: 79.99,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    description:
      "Easy-to-use coffee maker for quick brewing at home, in dorms, or in small offices."
  },
  {
    id: 4,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    description:
      "Modern smartphone with a large display, fast performance, and a clean design."
  },
  {
    id: 5,
    name: "Jacket",
    category: "Fashion",
    price: 89.99,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80",
    description:
      "Stylish everyday jacket that works well for casual outfits and cooler weather."
  },
  {
    id: 6,
    name: "Blender",
    category: "Home",
    price: 49.99,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80",
    description:
      "Compact blender for smoothies, shakes, and simple kitchen preparation."
  }
];

const orderItems = [
  { orderId: 1, productId: 1, quantity: 3 },
  { orderId: 2, productId: 2, quantity: 5 },
  { orderId: 3, productId: 4, quantity: 2 },
  { orderId: 4, productId: 3, quantity: 4 },
  { orderId: 5, productId: 1, quantity: 2 },
  { orderId: 6, productId: 6, quantity: 6 },
  { orderId: 7, productId: 5, quantity: 3 },
  { orderId: 8, productId: 4, quantity: 1 },
  { orderId: 9, productId: 2, quantity: 2 },
  { orderId: 10, productId: 3, quantity: 1 },
  { orderId: 11, productId: 6, quantity: 2 },
  { orderId: 12, productId: 1, quantity: 1 }
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

app.get("/api/analytics/products", (req, res) => {
  const analytics = products
    .map((product) => {
      const relatedOrders = orderItems.filter(
        (item) => item.productId === product.id
      );

      const totalSold = relatedOrders.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const revenue = totalSold * product.price;

      return {
        id: product.id,
        product: product.name,
        category: product.category,
        totalSold,
        revenue: Number(revenue.toFixed(2))
      };
    })
    .sort((a, b) => b.totalSold - a.totalSold);

  const summary = {
    totalProducts: products.length,
    totalUnitsSold: analytics.reduce((sum, item) => sum + item.totalSold, 0),
    totalRevenue: Number(
      analytics.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)
    ),
    topProduct: analytics.length > 0 ? analytics[0].product : "N/A"
  };

  res.json({
    summary,
    analytics
  });
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});