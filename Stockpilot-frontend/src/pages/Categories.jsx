import { useEffect, useState } from "react";

const initialFormData = {
    name: "",
    description: "",
};

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);

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

    const openAddModal = () => {
        setEditingCategoryId(null);
        setFormData(initialFormData);
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategoryId(category.id);

        setFormData({
            name: category.name || "",
            description: category.description || "",
        });

        setFormError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (!saving) {
            setShowModal(false);
            setEditingCategoryId(null);
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

        setSaving(true);
        setFormError("");

        const categoryData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
        };

        const isEditing = editingCategoryId !== null;

        const url = isEditing
            ? `/api/categories/${editingCategoryId}`
            : "/api/categories";

        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message ||
                    (isEditing
                        ? "Failed to update the category"
                        : "Failed to add the category")
                );
            }

            setShowModal(false);
            setEditingCategoryId(null);
            setFormData(initialFormData);

            await fetchCategories();
        } catch (error) {
            console.error(error);

            setFormError(
                isEditing
                    ? "Unable to update the category. Make sure the name is unique."
                    : "Unable to add the category. Make sure the name is unique."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingCategoryId(category.id);
            setError("");

            const response = await fetch(
                `/api/categories/${category.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "Failed to delete the category"
                );
            }

            await fetchCategories();
        } catch (error) {
            console.error(error);

            setError(
                "Unable to delete this category. It may already be assigned to one or more products."
            );
        } finally {
            setDeletingCategoryId(null);
        }
    };

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
                    onClick={openAddModal}
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
                                        {category.description || "No description"}
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                type="button"
                                                className="edit-button"
                                                onClick={() => openEditModal(category)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() => handleDelete(category)}
                                                disabled={deletingCategoryId === category.id}
                                            >
                                                {deletingCategoryId === category.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="modal category-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <h2>
                                    {editingCategoryId !== null
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>

                                <p>
                                    {editingCategoryId !== null
                                        ? "Update the category information"
                                        : "Enter the new category information"}
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
                            <div className="form-grid category-form-grid">
                                <div className="form-group full-width">
                                    <label htmlFor="name">
                                        Category Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Audio Devices"
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
                                        placeholder="Headphones, speakers, microphones, and related products"
                                        rows="4"
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
                                        ? editingCategoryId !== null
                                            ? "Updating..."
                                            : "Saving..."
                                        : editingCategoryId !== null
                                            ? "Update Category"
                                            : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Categories;