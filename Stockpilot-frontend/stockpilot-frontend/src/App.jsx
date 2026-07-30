import { Route, Routes } from "react-router";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  );
}

export default App;