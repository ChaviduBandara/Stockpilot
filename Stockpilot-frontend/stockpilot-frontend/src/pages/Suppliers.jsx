import { useEffect, useState } from "react";

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        </main>
    );
}

export default Suppliers;