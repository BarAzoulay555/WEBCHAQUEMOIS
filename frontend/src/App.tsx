import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import LoginPage from './pages/Login';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import DBData from "./pages/DBData";


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element= {isAuthenticated ? <Home /> : <LoginPage setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/db-data" element={<DBData />} />
      </Routes>
    </Router>
  );
}
