const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = require('./db');

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.get("/api/products", async (req, res) => {
  try {
    let query = "SELECT product_id as id, name, category, price, rating, image, description, stock FROM products WHERE 1=1";
    const params = [];

    const { q, category, min_price, max_price, sort } = req.query;

    if (q) {
      query += " AND name LIKE ?";
      params.push(`%${q}%`);
    }

    if (category && category !== "All") {
      query += " AND category = ?";
      params.push(category);
    }

    if (min_price) {
      query += " AND price >= ?";
      params.push(Number(min_price));
    }

    if (max_price) {
      query += " AND price <= ?";
      params.push(Number(max_price));
    }

    if (sort === "price_asc") {
      query += " ORDER BY price ASC";
    } else if (sort === "price_desc") {
      query += " ORDER BY price DESC";
    } else if (sort === "name_asc") {
      query += " ORDER BY name ASC";
    }

    const [rows] = await db.execute(query, params);

    const products = rows.map(row => ({
      ...row,
      price: Number(row.price),
      rating: Number(row.rating)
    }));

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/analytics/products", async (req, res) => {
  try {
    const analyticsQuery = `
      SELECT 
        p.product_id as id, 
        p.name as product, 
        p.category, 
        COALESCE(SUM(oi.quantity), 0) as totalSold, 
        COALESCE(SUM(oi.quantity * p.price), 0) as revenue
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      GROUP BY p.product_id, p.name, p.category
      ORDER BY totalSold DESC
    `;
    
    const [analyticsRows] = await db.execute(analyticsQuery);

    const analytics = analyticsRows.map(row => ({
      id: row.id,
      product: row.product,
      category: row.category,
      totalSold: Number(row.totalSold),
      revenue: Number(row.revenue)
    }));

    const [productCountRow] = await db.execute('SELECT COUNT(*) as count FROM products');
    const totalProducts = productCountRow[0].count;

    const totalUnitsSold = analytics.reduce((sum, item) => sum + item.totalSold, 0);
    const totalRevenue = Number(analytics.reduce((sum, item) => sum + item.revenue, 0).toFixed(2));
    const topProduct = analytics.length > 0 ? analytics[0].product : "N/A";

    const summary = {
      totalProducts,
      totalUnitsSold,
      totalRevenue,
      topProduct
    };

    res.json({
      summary,
      analytics
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});