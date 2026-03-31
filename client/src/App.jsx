import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const categories = useMemo(() => ["All", "Electronics", "Fashion", "Home"], []);

  const fetchProducts = async () => {
    const params = new URLSearchParams();

    if (searchQuery) params.append("q", searchQuery);
    if (category !== "All") params.append("category", category);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    if (sort) params.append("sort", sort);

    const response = await fetch(`http://localhost:3001/api/products?${params.toString()}`);
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = async () => {
    setSearchQuery("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("");

    const response = await fetch("http://localhost:3001/api/products");
    const data = await response.json();
    setProducts(data);
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setShowCart(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-main">Mockup</span>
            <span className="brand-accent">Amazon</span>
          </div>

          <form className="header-search" onSubmit={handleApplyFilters}>
            <input
              type="text"
              placeholder="Search MockupAmazon products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="topbar-actions">
            <div className="topbar-link">
              <span className="small-text">Hello, Maurice</span>
              <span className="bold-text">Account</span>
            </div>

            <div className="topbar-link">
              <span className="small-text">Returns</span>
              <span className="bold-text">& Orders</span>
            </div>

            <button
              type="button"
              className="cart-box"
              onClick={() => setShowCart((prev) => !prev)}
            >
              <span className="cart-icon">🛒</span>
              <span className="cart-count">{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="subbar">
        <div className="subbar-inner">
          <span>Today's Deals</span>
          <span>Customer Service</span>
          <span>Electronics</span>
          <span>Fashion</span>
          <span>Home</span>
        </div>
      </div>

      <main className="main-content">
        <section className="hero">
          <div className="hero-overlay">
            <h1>Shop smart with MockupAmazon</h1>
            <p>Browse products, filter results, and simulate a real e-commerce experience.</p>
          </div>
        </section>

        <section className="filters-panel">
          <div className="filters-header">
            <h2>Filter Products</h2>
            <p>Use the options below to narrow your search.</p>
          </div>

          <form className="filters" onSubmit={handleApplyFilters}>
            <div className="field-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Minimum Price</label>
              <input
                type="number"
                placeholder="e.g. 25"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Maximum Price</label>
              <input
                type="number"
                placeholder="e.g. 120"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
              </select>
            </div>

            <div className="filter-buttons">
              <button type="submit" className="apply-btn">
                Apply Filters
              </button>
              <button type="button" className="clear-btn" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="results-header">
          <h2>Results</h2>
          <p>{products.length} product(s) found</p>
        </section>

        <section className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category-text">{product.category}</p>
                <p className="rating-text">⭐⭐⭐⭐☆ {product.rating}</p>
                <p className="price-text">${product.price.toFixed(2)}</p>

                <button className="cart-btn" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {showCart && (
        <>
          <div className="cart-overlay" onClick={() => setShowCart(false)}></div>

          <aside className="cart-drawer">
            <div className="cart-drawer-header">
              <h2>Shopping Cart</h2>
              <button
                type="button"
                className="close-cart-btn"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item, index) => (
                    <div className="cart-item" key={`${item.id}-${index}`}>
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>${item.price.toFixed(2)}</p>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <h3>Total: ${cartTotal.toFixed(2)}</h3>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </div>
  );
}

export default App;