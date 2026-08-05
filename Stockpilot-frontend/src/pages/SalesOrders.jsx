import { useEffect, useState } from "react";

const initialOrderForm = {
    customerId: "",
    items: [
        {
            productId: "",
            quantity: 1,
        },
    ],
};

function SalesOrders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [orderForm, setOrderForm] = useState(initialOrderForm);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/orders");

            if (!response.ok) {
                throw new Error("Failed to load sales orders");
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customers");

            if (!response.ok) {
                throw new Error("Failed to load customers");
            }

            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");

            if (!response.ok) {
                throw new Error("Failed to load products");
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, []);

    const openCreateModal = () => {
        setOrderForm(initialOrderForm);
        setFormError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (!saving) {
            setShowModal(false);
            setOrderForm(initialOrderForm);
            setFormError("");
        }
    };

    const handleCustomerChange = (event) => {
        setOrderForm((previousForm) => ({
            ...previousForm,
            customerId: event.target.value,
        }));
    };

    const handleItemChange = (index, field, value) => {
        setOrderForm((previousForm) => {
            const updatedItems = [...previousForm.items];

            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value,
            };

            return {
                ...previousForm,
                items: updatedItems,
            };
        });
    };

    const addOrderItem = () => {
        setOrderForm((previousForm) => ({
            ...previousForm,
            items: [
                ...previousForm.items,
                {
                    productId: "",
                    quantity: 1,
                },
            ],
        }));
    };

    const removeOrderItem = (index) => {
        if (orderForm.items.length === 1) {
            return;
        }

        setOrderForm((previousForm) => ({
            ...previousForm,
            items: previousForm.items.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        }));
    };

    const getSelectedProduct = (productId) => {
        return products.find(
            (product) => product.id === Number(productId)
        );
    };

    const calculateItemSubtotal = (item) => {
        const product = getSelectedProduct(item.productId);

        if (!product) {
            return 0;
        }

        return Number(product.price) * Number(item.quantity || 0);
    };

    const calculateOrderTotal = () => {
        return orderForm.items.reduce(
            (total, item) => total + calculateItemSubtotal(item),
            0
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");

        if (!orderForm.customerId) {
            setFormError("Please select a customer.");
            return;
        }

        const invalidItem = orderForm.items.find((item) => {
            const product = getSelectedProduct(item.productId);
            const quantity = Number(item.quantity);

            return (
                !product ||
                quantity <= 0 ||
                quantity > product.quantity
            );
        });

        if (invalidItem) {
            setFormError(
                "Select a valid product and make sure the requested quantity is available."
            );
            return;
        }

        const orderData = {
            customerId: Number(orderForm.customerId),
            items: orderForm.items.map((item) => ({
                productId: Number(item.productId),
                quantity: Number(item.quantity),
            })),
        };

        try {
            setSaving(true);

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(message || "Failed to create order");
            }

            setShowModal(false);
            setOrderForm(initialOrderForm);

            await fetchOrders();
            await fetchProducts();
        } catch (error) {
            console.error(error);

            setFormError(
                "Unable to create the order. Check the customer, products, and available stock."
            );
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "No date";
        }

        return new Date(dateValue).toLocaleString();
    };

    const formatCurrency = (amount) => {
        return `LKR ${Number(amount).toLocaleString()}`;
    };

    return (
        <main className="page-content">
            <div className="page-header">
                <div>
                    <h1>Sales Orders</h1>
                    <p>View and manage customer sales orders</p>
                </div>

                <button
                    type="button"
                    className="add-product-button"
                    onClick={openCreateModal}
                >
                    Create Order
                </button>
            </div>

            {loading && <p>Loading sales orders...</p>}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && orders.length === 0 && (
                <div className="empty-state">
                    <h3>No sales orders available</h3>
                    <p>Create your first sales order to begin.</p>
                </div>
            )}

            {!loading && !error && orders.length > 0 && (
                <div className="table-container">
                    <table className="data-table orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Order Date</th>
                                <th>Items</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>

                                    <td>
                                        <div className="customer-name">
                                            {order.customer?.name ||
                                                "Unknown customer"}
                                        </div>

                                        <div className="order-customer-email">
                                            {order.customer?.email || ""}
                                        </div>
                                    </td>

                                    <td>{formatDate(order.orderDate)}</td>

                                    <td>
                                        <div className="order-items">
                                            {order.items?.map((item) => (
                                                <div
                                                    className="order-item"
                                                    key={item.id}
                                                >
                                                    <span>
                                                        {item.product?.name ||
                                                            "Unknown product"}
                                                    </span>

                                                    <span className="order-item-quantity">
                                                        × {item.quantity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="order-total">
                                        {formatCurrency(order.totalAmount)}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                order.status === "COMPLETED"
                                                    ? "order-status completed-status"
                                                    : "order-status cancelled-status"
                                            }
                                        >
                                            {order.status}
                                        </span>
                                    </td>

                                    <td>
                                        {order.status === "COMPLETED" ? (
                                            <button
                                                type="button"
                                                className="cancel-order-button"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <span className="no-action-text">
                                                No actions
                                            </span>
                                        )}
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
                        className="modal create-order-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <h2>Create Sales Order</h2>
                                <p>Select a customer and add products</p>
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
                            <div className="form-group">
                                <label htmlFor="customerId">
                                    Customer
                                </label>

                                <select
                                    id="customerId"
                                    value={orderForm.customerId}
                                    onChange={handleCustomerChange}
                                    required
                                >
                                    <option value="">
                                        Select a customer
                                    </option>

                                    {customers.map((customer) => (
                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name} — {customer.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="order-form-section">
                                <div className="order-form-section-header">
                                    <div>
                                        <h3>Order Items</h3>
                                        <p>Add one or more products</p>
                                    </div>

                                    <button
                                        type="button"
                                        className="add-item-button"
                                        onClick={addOrderItem}
                                    >
                                        Add Item
                                    </button>
                                </div>

                                <div className="order-form-items">
                                    {orderForm.items.map((item, index) => {
                                        const selectedProduct =
                                            getSelectedProduct(item.productId);

                                        return (
                                            <div
                                                className="order-form-item"
                                                key={index}
                                            >
                                                <div className="form-group">
                                                    <label>Product</label>

                                                    <select
                                                        value={item.productId}
                                                        onChange={(event) =>
                                                            handleItemChange(
                                                                index,
                                                                "productId",
                                                                event.target.value
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Select a product
                                                        </option>

                                                        {products.map((product) => (
                                                            <option
                                                                key={product.id}
                                                                value={product.id}
                                                                disabled={product.quantity <= 0}
                                                            >
                                                                {product.name} — Stock:{" "}
                                                                {product.quantity}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Quantity</label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            selectedProduct?.quantity || undefined
                                                        }
                                                        value={item.quantity}
                                                        onChange={(event) =>
                                                            handleItemChange(
                                                                index,
                                                                "quantity",
                                                                event.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="order-item-subtotal">
                                                    <span>Subtotal</span>
                                                    <strong>
                                                        {formatCurrency(
                                                            calculateItemSubtotal(item)
                                                        )}
                                                    </strong>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="remove-item-button"
                                                    onClick={() => removeOrderItem(index)}
                                                    disabled={orderForm.items.length === 1}
                                                    title="Remove item"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="order-total-summary">
                                <span>Order Total</span>

                                <strong>
                                    {formatCurrency(calculateOrderTotal())}
                                </strong>
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
                                        ? "Creating..."
                                        : "Create Order"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

//dfs

export default SalesOrders;