import { useEffect, useState } from "react";

const initialFormData = {
    name: "",
    email: "",
    contactNumber: "",
    address: "",
};

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [editingCustomerId, setEditingCustomerId] =
        useState(null);

    const [deletingCustomerId, setDeletingCustomerId] =
        useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/customers");

            if (!response.ok) {
                throw new Error("Failed to load customers");
            }

            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const openAddModal = () => {
        setEditingCustomerId(null);
        setFormData(initialFormData);
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomerId(customer.id);

        setFormData({
            name: customer.name || "",
            email: customer.email || "",
            contactNumber: customer.contactNumber || "",
            address: customer.address || "",
        });

        setFormError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (!saving) {
            setShowModal(false);
            setEditingCustomerId(null);
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

        const customerData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            contactNumber: formData.contactNumber.trim(),
            address: formData.address.trim(),
        };

        const isEditing = editingCustomerId !== null;

        const url = isEditing
            ? `/api/customers/${editingCustomerId}`
            : "/api/customers";

        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customerData),
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message ||
                    (isEditing
                        ? "Failed to update the customer"
                        : "Failed to add the customer")
                );
            }

            setShowModal(false);
            setEditingCustomerId(null);
            setFormData(initialFormData);

            await fetchCustomers();
        } catch (error) {
            console.error(error);

            setFormError(
                isEditing
                    ? "Unable to update the customer. Make sure the email is unique."
                    : "Unable to add the customer. Make sure the email is unique."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (customer) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${customer.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingCustomerId(customer.id);
            setError("");

            const response = await fetch(
                `/api/customers/${customer.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "Failed to delete the customer"
                );
            }

            await fetchCustomers();
        } catch (error) {
            console.error(error);

            setError(
                "Unable to delete this customer. The customer may already have sales orders."
            );
        } finally {
            setDeletingCustomerId(null);
        }
    };

    return (
        <main className="page-content">
            <div className="page-header">
                <div>
                    <h1>Customers</h1>
                    <p>View and manage customer information</p>
                </div>

                <button
                    type="button"
                    className="add-product-button"
                    onClick={openAddModal}
                >
                    Add Customer
                </button>
            </div>

            {loading && <p>Loading customers...</p>}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && customers.length === 0 && (
                <div className="empty-state">
                    <h3>No customers available</h3>
                    <p>Add your first customer to begin.</p>
                </div>
            )}

            {!loading && !error && customers.length > 0 && (
                <div className="table-container">
                    <table className="data-table customers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>

                                    <td>
                                        <div className="customer-name">
                                            {customer.name}
                                        </div>
                                    </td>

                                    <td>{customer.email}</td>

                                    <td>{customer.contactNumber}</td>

                                    <td>
                                        {customer.address || "No address"}
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                type="button"
                                                className="edit-button"
                                                onClick={() =>
                                                    openEditModal(customer)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(customer)
                                                }
                                                disabled={
                                                    deletingCustomerId === customer.id
                                                }
                                            >
                                                {deletingCustomerId === customer.id
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
                        className="modal customer-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <h2>
                                    {editingCustomerId !== null
                                        ? "Edit Customer"
                                        : "Add Customer"}
                                </h2>

                                <p>
                                    {editingCustomerId !== null
                                        ? "Update the customer information"
                                        : "Enter the new customer information"}
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
                                        Customer Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Nimal Perera"
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
                                        placeholder="nimal@gmail.com"
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
                                        placeholder="Enter the customer address"
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
                                        ? editingCustomerId !== null
                                            ? "Updating..."
                                            : "Saving..."
                                        : editingCustomerId !== null
                                            ? "Update Customer"
                                            : "Save Customer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Customers;