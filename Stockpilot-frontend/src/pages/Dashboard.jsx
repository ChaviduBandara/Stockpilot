import { useEffect, useState } from "react";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load dashboard information");
        }

        return response.json();
      })
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const dashboardCards = [
    {
      title: "Total Products",
      value: summary?.totalProducts ?? "--",
    },
    {
      title: "Low Stock Products",
      value: summary?.lowStockProducts ?? "--",
    },
    {
      title: "Total Categories",
      value: summary?.totalCategories ?? "--",
    },
    {
      title: "Total Suppliers",
      value: summary?.totalSuppliers ?? "--",
    },
    {
      title: "Total Customers",
      value: summary?.totalCustomers ?? "--",
    },
    {
      title: "Total Orders",
      value: summary?.totalOrders ?? "--",
    },
    {
      title: "Completed Orders",
      value: summary?.completedOrders ?? "--",
    },
    {
      title: "Cancelled Orders",
      value: summary?.cancelledOrders ?? "--",
    },
    {
      title: "Total Revenue",
      value:
        summary !== null
          ? `LKR ${Number(summary.totalRevenue).toLocaleString()}`
          : "--",
    },
  ];

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your inventory and sales</p>
        </div>

        <button className="add-product-button">
          Add Product
        </button>
      </div>

      {loading && <p>Loading dashboard information...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <section className="dashboard-cards">
          {dashboardCards.map((card) => (
            <div className="dashboard-card" key={card.title}>
              <p>{card.title}</p>
              <h2>{card.value}</h2>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default Dashboard;