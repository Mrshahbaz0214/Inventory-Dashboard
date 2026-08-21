import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = "https://inventory-dashboard-9y7t.onrender.com";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
  });

  // =========================
  // GET PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/`);
      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.results)) {
        setProducts(data.results);
      } else if (data && data.id) {
        setProducts([data]);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("API ERROR:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // FORM
  // =========================

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      quantity: "",
      price: "",
      supplier: "",
    });

    setEditingId(null);
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const saveProduct = async (event) => {
    event.preventDefault();

    try {
      const productData = {
        name: form.name,
        category: form.category,
        quantity: Number(form.quantity),
        price: Number(form.price),
        supplier: form.supplier,
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/api/products/${editingId}/`,
          productData
        );

        alert("Product updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/api/products/`,
          productData
        );

        alert("Product added successfully!");
      }

      resetForm();
      setShowForm(false);

      await fetchProducts();
    } catch (error) {
      console.error("SAVE ERROR:", error);
      alert("Could not save product.");
    }
  };

  // =========================
  // EDIT
  // =========================

  const editProduct = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      supplier: product.supplier,
    });

    setEditingId(product.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const deleteProduct = async (id) => {
  try {
    await axios.delete(`/api/products/${id}/`);

    alert("Product deleted successfully!");

    await fetchProducts();
  } catch (error) {
    console.error("DELETE ERROR:", error);
    alert("Could not delete product.");
  }
};

  // =========================
  // CANCEL
  // =========================

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    "All",
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredProducts = products.filter(
    (product) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.supplier
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // =========================
  // DASHBOARD NUMBERS
  // =========================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.quantity),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity) <= 5
  );

  const lowStock = lowStockProducts.length;

  const totalValue = products.reduce(
    (total, product) =>
      total +
      Number(product.quantity) *
        Number(product.price),
    0
  );

  const suppliers = [
    ...new Set(
      products.map(
        (product) => product.supplier
      )
    ),
  ];

  // =========================
  // UI
  // =========================

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            📦
          </div>

          <div className="brand-text">
            <h2>InventoryPro</h2>
            <span>Supply Chain</span>
          </div>

        </div>

        <div className="sidebar-section">

          <div className="sidebar-label">
            Main Menu
          </div>

          <button className="nav-item active">
            <span className="nav-icon">
              ▣
            </span>
            <span>Dashboard</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">
              📦
            </span>
            <span>Products</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">
              🏢
            </span>
            <span>Suppliers</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">
              📊
            </span>
            <span>Analytics</span>
          </button>

        </div>

        <div className="sidebar-section">

          <div className="sidebar-label">
            System
          </div>

          <button className="nav-item">
            <span className="nav-icon">
              ⚙️
            </span>
            <span>Settings</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">
              ❓
            </span>
            <span>Help & Support</span>
          </button>

        </div>

        <div className="sidebar-bottom">

          <div className="user-box">

            <div className="user-avatar">
              SA
            </div>

            <div className="user-info">
              <strong>Shahbaz</strong>
              <span>Administrator</span>
            </div>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* ================= TOP HEADER ================= */}

        <header className="top-header">

          <div className="page-heading">

            <h1>
              Inventory Dashboard
            </h1>

            <p>
              Inventory & Supply Chain Management
            </p>

          </div>

          <div className="header-actions">

            <div className="header-search">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <button className="icon-button">
              🔔
            </button>

            <button className="icon-button">
              👤
            </button>

          </div>

        </header>
{showForm && (
  <div className="product-form-overlay">
    <div className="product-form">

      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={saveProduct}>

        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Supplier"
          value={form.supplier}
          onChange={(e) =>
            setForm({ ...form, supplier: e.target.value })
          }
          required
        />

        <div className="form-actions">

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
          >
            Cancel
          </button>

          <button type="submit">
            {editingId ? "Update Product" : "Save Product"}
          </button>

        </div>

      </form>

    </div>
  </div>
)}
        {/* ================= DASHBOARD CONTENT ================= */}

        <div className="dashboard-content">

          <div className="welcome-row">

            <div>

              <h2>
                Welcome back 👋
              </h2>

              <p>
                Here's what's happening with
                your inventory today.
              </p>

            </div>

            <button
              className="add-button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              + Add Product
            </button>

          </div>

          {/* ================= KPI CARDS ================= */}

         <section className="stats">

  <div className="stat-card">
    <div className="stat-top">
      <div className="stat-icon">📦</div>
      <span className="stat-badge">Inventory</span>
    </div>

    <p>Total Products</p>
    <h2>{totalProducts}</h2>
    <span className="stat-description">
      Items currently tracked
    </span>
  </div>

  <div className="stat-card">
    <div className="stat-top">
      <div className="stat-icon">📊</div>
      <span className="stat-badge">Available</span>
    </div>

    <p>Total Stock</p>
    <h2>{totalStock}</h2>
    <span className="stat-description">
      Units available
    </span>
  </div>

  <div className="stat-card">
    <div className="stat-top">
      <div className="stat-icon warning">⚠️</div>
      <span className="stat-badge warning-badge">Attention</span>
    </div>

    <p>Low Stock</p>
    <h2>{lowStock}</h2>
    <span className="stat-description">
      Products need restocking
    </span>
  </div>

  <div className="stat-card">
    <div className="stat-top">
      <div className="stat-icon money">💰</div>
      <span className="stat-badge">Value</span>
    </div>

    <p>Inventory Value</p>
    <h2>₹{totalValue.toLocaleString()}</h2>
    <span className="stat-description">
      Current stock value
    </span>
  </div>

</section>

          )

          {/* ================= LOW STOCK ALERT ================= */}

          {lowStock > 0 && (

            <section className="low-stock-alert">

              <div className="alert-icon">
                ⚠️
              </div>

              <div className="alert-content">

                <h3>
                  Low Stock Alert
                </h3>

                <p>
                  {lowStock} product
                  {lowStock > 1
                    ? "s"
                    : ""}{" "}
                  need
                  {lowStock > 1
                    ? ""
                    : "s"}{" "}
                  restocking.
                </p>

              </div>

              <div className="alert-products">

                {lowStockProducts.map(
                  (product) => (

                    <span
                      key={product.id}
                    >
                      {product.name} (
                      {product.quantity})
                    </span>

                  )
                )}

              </div>

            </section>

          )}

          {/* ================= CHART + ALERTS ================= */}

          <section className="dashboard-grid">

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h2>
                    Stock Overview
                  </h2>

                  <p>
                    Current quantity by product
                  </p>

                </div>

                <span className="card-header-badge">
                  Live Data
                </span>

              </div>

              <div className="chart-container">

                {products.length > 0 ? (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={products}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                      />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="quantity"
                        fill="#2563eb"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                ) : (

                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No inventory data
                  </div>

                )}

              </div>

            </div>

            {/* LOW STOCK SIDE CARD */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h2>
                    Low Stock
                  </h2>

                  <p>
                    Items requiring attention
                  </p>

                </div>

                <span className="card-header-badge">
                  {lowStock}
                </span>

              </div>

              <div className="low-stock-panel">

                {lowStockProducts.length ===
                0 ? (

                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    ✅ All products have
                    sufficient stock.
                  </div>

                ) : (

                  lowStockProducts.map(
                    (product) => (

                      <div
                        className="low-stock-item"
                        key={product.id}
                      >

                        <div className="stock-warning-icon">
                          ⚠️
                        </div>

                        <div className="low-stock-info">

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.category}
                          </span>

                        </div>

                        <span className="stock-danger">
                          {product.quantity} left
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </section>

          {/* ================= SUPPLIERS ================= */}

          <section className="supplier-card">

            <div className="supplier-header">

              <div>

                <h2>
                  Suppliers
                </h2>

                <p>
                  Your current supply partners
                </p>

              </div>

              <span>
                {suppliers.length} suppliers
              </span>

            </div>

            <div className="supplier-list">

              {suppliers.map(
                (supplier) => {

                  const supplierProducts =
                    products.filter(
                      (product) =>
                        product.supplier ===
                        supplier
                    );

                  return (

                    <div
                      className="supplier-item"
                      key={supplier}
                    >

                      <div className="supplier-icon">
                        🏢
                      </div>

                      <div>

                        <strong>
                          {supplier}
                        </strong>

                        <p>
                          {
                            supplierProducts.length
                          }{" "}
                          product
                          {supplierProducts.length >
                          1
                            ? "s"
                            : ""}
                        </p>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          </section>

          {/* ================= PRODUCT SEARCH ================= */}

          <section className="controls">

            <input
              type="text"
              placeholder="🔍 Search product or supplier..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >

              {categories.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </section>

          {/* ================= PRODUCT TABLE ================= */}

          <section className="table-card">

            <div className="table-header">

              <div>

                <h2>
                  Inventory Products
                </h2>

                <p>
                  Manage your inventory items
                </p>

              </div>

              <span>
                {filteredProducts.length}{" "}
                products
              </span>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan="8"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "30px",
                          color:
                            "#94a3b8",
                        }}
                      >
                        No products found.
                      </td>

                    </tr>

                  ) : (

                    filteredProducts.map(
                      (product) => (

                        <tr
                          key={product.id}
                        >

                          <td>
                            #{product.id}
                          </td>

                          <td>
                            <strong>
                              {product.name}
                            </strong>
                          </td>

                          <td>
                            {product.category}
                          </td>

                          <td>
                            {product.quantity}
                          </td>

                          <td>
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString()}
                          </td>

                          <td>
                            {product.supplier}
                          </td>

                          <td>

                            {Number(
                              product.quantity
                            ) <= 5 ? (

                              <span className="low-stock">
                                ⚠️ Low Stock
                              </span>

                            ) : (

                              <span className="in-stock">
                                ✓ In Stock
                              </span>

                            )}

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="edit-button"
                                onClick={() =>
                                  editProduct(
                                    product
                                  )
                                }
                              >
                                ✏️ Edit
                              </button>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  deleteProduct(
                                    product.id
                                  )
                                }
                              >
                                🗑️ Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

          <footer>
            Inventory & Supply Chain Dashboard
            <br />
            Python Full Stack Development Training Project
          </footer>

        </div>

      </main>

    </div>
  );
}

export default App;
