import { useEffect, useState } from "react";

const initialFormData = {
  name: "",
  sku: "",
  description: "",
  price: "",
  quantity: "",
  reorderLevel: "",
  categoryId: "",
};

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingProductId(null);
    setFormData(initialFormData);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProductId(product.id);

    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      description: product.description || "",
      price: product.price || "",
      quantity: product.quantity ?? "",
      reorderLevel: product.reorderLevel ?? "",
      categoryId: product.category?.id || "",
    });

    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (!saving) {
      setShowModal(false);
      setEditingProductId(null);
      setFormData(initialFormData);
      setFormError("");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setSaving(true);

    const productData = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      reorderLevel: Number(formData.reorderLevel),
      categoryId: Number(formData.categoryId),
    };

    const isEditing = editingProductId !== null;

    const url = isEditing
      ? `/api/products/${editingProductId}`
      : "/api/products";

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
          (isEditing
            ? "Failed to update the product"
            : "Failed to add the product")
        );
      }

      setShowModal(false);
      setEditingProductId(null);
      setFormData(initialFormData);

      await fetchProducts();
    } catch (error) {
      console.error(error);
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product.id);
      setError("");

      const response = await fetch(
        `/api/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
          "Unable to delete this product. It may already be used in an order."
        );
      }

      await fetchProducts();
    } catch (error) {
      console.error(error);
      setError(
        "Unable to delete this product. Products used in sales orders should not be deleted."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.toLowerCase().trim();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchValue) ||
      product.sku?.toLowerCase().includes(searchValue) ||
      product.category?.name
        ?.toLowerCase()
        .includes(searchValue);

    const isLowStock =
      product.quantity <= product.reorderLevel;

    const matchesStockFilter =
      stockFilter === "ALL" ||
      (stockFilter === "LOW_STOCK" && isLowStock) ||
      (stockFilter === "IN_STOCK" && !isLowStock);

    return matchesSearch && matchesStockFilter;
  });

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>View and manage your inventory products</p>
        </div>

        <button
          type="button"
          className="add-product-button"
          onClick={openAddModal}
        >
          Add Product
        </button>
      </div>

      <div className="product-toolbar">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name, SKU, or category..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="filter-container">
          <select
            className="stock-filter"
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(event.target.value)
            }
          >
            <option value="ALL">All Products</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
          </select>

          <span className="results-count">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </span>
        </div>
      </div>

      {loading && <p>Loading products...</p>}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const isLowStock =
                  product.quantity <= product.reorderLevel;

                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>
                      <div className="product-name">
                        {product.name}
                      </div>

                      <div className="product-description">
                        {product.description || "No description"}
                      </div>
                    </td>

                    <td>{product.sku}</td>

                    <td>
                      {product.category?.name || "No category"}
                    </td>

                    <td>
                      LKR {Number(product.price).toLocaleString()}
                    </td>

                    <td>{product.quantity}</td>

                    <td>{product.reorderLevel}</td>

                    <td>
                      <span
                        className={
                          isLowStock
                            ? "stock-badge low-stock"
                            : "stock-badge normal-stock"
                        }
                      >
                        {isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </td>

                    {/* Add the Actions column here */}
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingProductId === product.id}
                        >
                          {deletingProductId === product.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingProductId !== null
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p>
                  {editingProductId !== null
                    ? "Update the product information"
                    : "Enter the new product information"}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    Product Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Mechanical Keyboard"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sku">SKU</label>

                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="KEY-005"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter the product description"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">
                    Price
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="8500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoryId">
                    Category
                  </label>

                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">
                      Select a category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">
                    Quantity
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="15"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reorderLevel">
                    Reorder Level
                  </label>

                  <input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={handleInputChange}
                    placeholder="5"
                    min="0"
                    required
                  />
                </div>
              </div>

              {formError && (
                <p className="form-error">
                  {formError}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? editingProductId !== null
                      ? "Updating..."
                      : "Saving..."
                    : editingProductId !== null
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Products;