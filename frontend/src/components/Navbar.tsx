import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token"); // אם יש טוקן אחר – עדכני כאן
    navigate("/login");
  };

  const handleAdviceClick = async () => {
    navigate("/ai-chat")
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
        if (error.response) {
            console.error("Response data:", error.response.data);
            alert("שגיאה: " + JSON.stringify(error.response.data));
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
            <button className="btn btn-outline-light ms-2" onClick={handleAdviceClick}>
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
