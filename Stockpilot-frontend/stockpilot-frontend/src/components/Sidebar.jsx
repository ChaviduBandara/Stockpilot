import React from 'react'

function Sidebar() {
  return (
    <aside className='sidebar'>
        <div className='logo'>
            <h2>StockPilot</h2>
            <p>Inventory System</p>
        </div>

        <nav className='sidebar-menu'>
            <a href="#" className='active'>Dashboard</a>

            <a href="#">Products</a>
            <a href="#">Categories</a>
            <a href="#">Suppliers</a>
            <a href="#">Customers</a>
            <a href="#">Sales Orders</a>

        </nav>
    </aside>
  );
}

export default Sidebar