import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // הסרת טוקן או נתוני התחברות
    localStorage.removeItem("token"); // אם יש לך שמות אחרים – עדכני כאן

    // ניתוב לעמוד ההתחברות
    navigate("/login");
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
        </ul>

        {/* כפתור התנתקות */}
        <button onClick={handleLogout} className="btn btn-outline-light">
          התנתקות
        </button>
      </div>
    </nav>
  );
}
