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
        
        <a href="#">Suppliers</a>
        <a href="#">Customers</a>
        <a href="#">Sales Orders</a>
      </nav>
    </aside>
  );
}

export default Sidebar;