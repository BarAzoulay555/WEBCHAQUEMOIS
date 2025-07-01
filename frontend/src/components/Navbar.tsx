import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAdviceClick = async () => {
    navigate("/ai-chat");
    try {
      const response = await axios.post("/api/ai/advice", {
        name: "חצאית ג'ינס",
        quantity: 10,
        price: 129
      });
      const data = response.data;
      alert("המלצת המערכת:\n" + data.recommendation);
    } catch (error) {
      console.error("AI Error:", error);
      if (axios.isAxiosError(error)) {
        alert("שגיאה: " + JSON.stringify(error.response?.data));
      } else if (error instanceof Error) {
        alert("שגיאה: " + error.message);
      } else {
        alert("שגיאה בקבלת ייעוץ 😓");
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">CHAQUEMOIS</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">דף הבית</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive("/inventory") ? "active" : ""}`} to="/inventory">ניהול מלאי</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive("/orders") ? "active" : ""}`} to="/orders">הזמנות</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive("/suppliers") ? "active" : ""}`} to="/suppliers">ספקים</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive("/invoices") ? "active" : ""}`} to="/invoices">חשבוניות</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive("/db-data") ? "active" : ""}`} to="/db-data">נתוני DB</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive("/appointments") ? "active" : ""}`} to="/appointments">יומן פגישות</Link>
          </li>
          <li className="nav-item ms-2">
            <button className="btn btn-outline-light" onClick={handleAdviceClick}>
              📈 בקש ייעוץ רכישה
            </button>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-outline-light">
          התנתקות
        </button>
      </div>
    </nav>
  );
}
