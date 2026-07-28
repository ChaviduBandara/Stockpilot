const dashboardCards = [
  {
    title: "Total Products",
    value: "--",
  },
  {
    title: "Low Stock Products",
    value: "--",
  },
  {
    title: "Total Categories",
    value: "--",
  },
  {
    title: "Total Suppliers",
    value: "--",
  },
  {
    title: "Total Customers",
    value: "--",
  },
  {
    title: "Total Orders",
    value: "--",
  },
  {
    title: "Completed Orders",
    value: "--",
  },
  {
    title: "Cancelled Orders",
    value: "--",
  },
  {
    title: "Total Revenue",
    value: "--",
  },
];

function Dashboard() {
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

      <section className="dashboard-cards">
        {dashboardCards.map((card) => (
          <div className="dashboard-card" key={card.title}>
            <p>{card.title}</p>
            <h2>{card.value}</h2>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;