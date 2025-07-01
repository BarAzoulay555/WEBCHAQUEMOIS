import React, { useState, useEffect } from 'react';
import {useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SupplierNavbar from './components/SupplierNavbar';
import Home from './pages/Home';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import LoginPage from './pages/Login';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import DBData from './pages/DBData';
import AIChat from './pages/AIChat';
import Appointments from "./pages/Appointments";


// דפי ספק
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import SupplierClients from './pages/supplier/SupplierClients';
import SupplierInventory from './pages/supplier/SupplierInventory';
import SupplierOrders from './pages/supplier/SupplierOrders';
import SupplierInvoices from './pages/supplier/SupplierInvoices';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedAuth = localStorage.getItem('isAuthenticated');
    setRole(storedRole);
    setIsAuthenticated(storedAuth === 'true');
    setLoading(false);
  }, []);

  if (loading) {
    return <div>טוען...</div>;
  }

  return (
    <>
      {location.pathname !== '/login' && (
  isAuthenticated && role === 'supplier' ? <SupplierNavbar /> : <Navbar />
    )}


      <Routes>
        {/* דף התחברות / דף בית */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === 'supplier' ? (
                <SupplierDashboard />
              ) : (
                <Home />
              )
            ) : (
              <LoginPage setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
            )
          }
        />

        {/* התחברות */}
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} setRole={setRole} />}
        />

        {/* דפים ל־admin */}
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/db-data" element={<DBData />} />
        <Route path="/ai-chat" element={<AIChat />} />  
        <Route path="/appointments" element={<Appointments />} />

        {/* דפים לספק */}
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/clients" element={<SupplierClients />} />
        <Route path="/supplier/inventory" element={<SupplierInventory />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} />
        <Route path="/supplier/invoices" element={<SupplierInvoices />} />
      </Routes>
    </>
  );
}
