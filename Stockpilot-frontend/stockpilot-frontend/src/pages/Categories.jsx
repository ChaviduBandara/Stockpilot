import { useEffect, useState } from "react";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/categories");

            if (!response.ok) {
                throw new Error("Failed to load categories");
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <main className="page-content">
            <div className="page-header">
                <div>
                    <h1>Categories</h1>
                    <p>Organize your products into categories</p>
                </div>

                <button
                    type="button"
                    className="add-product-button"
                >
                    Add Category
                </button>
            </div>

            {loading && <p>Loading categories...</p>}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && categories.length === 0 && (
                <div className="empty-state">
                    <h3>No categories available</h3>
                    <p>Add your first category to organize products.</p>
                </div>
            )}

            {!loading && !error && categories.length > 0 && (
                <div className="table-container">
                    <table className="data-table categories-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>

                                    <td>
                                        <div className="category-name">
                                            {category.name}
                                        </div>
                                    </td>

                                    <td>
                                        {category.description ||
                                            "No description"}
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                type="button"
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}

export default Categories;