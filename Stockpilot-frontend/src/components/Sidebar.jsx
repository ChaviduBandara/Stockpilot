import { NavLink } from "react-router";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>StockPilot</h2>
        <p>Inventory System</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/products">
          Products
        </NavLink>

        <NavLink to="/categories">
          Categories
        </NavLink>

        <NavLink to="/suppliers">
          Suppliers
        </NavLink>

        <NavLink to="/customers">
          Customers
        </NavLink>

        <NavLink to="/orders">
          Sales Orders
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;