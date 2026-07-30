import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>View and manage your inventory products</p>
        </div>

        <button className="add-product-button">
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
    </main>
  );
}

export default Products;