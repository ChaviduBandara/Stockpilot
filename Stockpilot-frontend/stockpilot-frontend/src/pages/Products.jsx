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

  const openModal = () => {
    setFormData(initialFormData);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (!saving) {
      setShowModal(false);
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

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Failed to add the product"
        );
      }

      setShowModal(false);
      setFormData(initialFormData);

      await fetchProducts();
    } catch (error) {
      console.error(error);
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };

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
          onClick={openModal}
        >
          Add Product
        </button>
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
                      LKR{" "}
                      {Number(product.price).toLocaleString()}
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
                <h2>Add Product</h2>
                <p>Enter the new product information</p>
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
                  Unable to add the product. Check that the SKU is
                  unique and all information is correct.
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
                  {saving ? "Saving..." : "Save Product"}
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