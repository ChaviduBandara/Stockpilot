import { useEffect, useState } from "react";

const initialFormData = {
    name: "",
    email: "",
    contactNumber: "",
    address: "",
};

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/suppliers");

            if (!response.ok) {
                throw new Error("Failed to load suppliers");
            }

            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const openModal = () => {
        setFormData(initialFormData);
        setFormError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (!saving) {
            setShowModal(false);
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

        const supplierData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            contactNumber: formData.contactNumber.trim(),
            address: formData.address.trim(),
        };

        try {
            const response = await fetch("/api/suppliers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(supplierData),
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "Failed to add the supplier"
                );
            }

            setShowModal(false);
            setFormData(initialFormData);

            await fetchSuppliers();
        } catch (error) {
            console.error(error);

            setFormError(
                "Unable to add the supplier. Make sure the email is unique and all required fields are correct."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="page-content">
            <div className="page-header">
                <div>
                    <h1>Suppliers</h1>
                    <p>View and manage product suppliers</p>
                </div>

                <button
                    type="button"
                    className="add-product-button"
                    onClick={openModal}
                >
                    Add Supplier
                </button>
            </div>

            {loading && <p>Loading suppliers...</p>}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && suppliers.length === 0 && (
                <div className="empty-state">
                    <h3>No suppliers available</h3>
                    <p>Add your first supplier to begin.</p>
                </div>
            )}

            {!loading && !error && suppliers.length > 0 && (
                <div className="table-container">
                    <table className="data-table suppliers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Supplier Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td>{supplier.id}</td>

                                    <td>
                                        <div className="supplier-name">
                                            {supplier.name}
                                        </div>
                                    </td>

                                    <td>{supplier.email}</td>

                                    <td>{supplier.contactNumber}</td>

                                    <td>
                                        {supplier.address || "No address"}
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

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="modal supplier-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <h2>Add Supplier</h2>
                                <p>Enter the new supplier information</p>
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
                                        Supplier Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Tech Lanka Suppliers"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="supplier@gmail.com"
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="contactNumber">
                                        Contact Number
                                    </label>

                                    <input
                                        id="contactNumber"
                                        name="contactNumber"
                                        type="text"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        placeholder="0771234567"
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="address">
                                        Address
                                    </label>

                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter the supplier address"
                                        rows="3"
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
                                        ? "Saving..."
                                        : "Save Supplier"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Suppliers;