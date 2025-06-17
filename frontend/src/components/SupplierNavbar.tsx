import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SupplierNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // אם את שומרת גם role
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/supplier/dashboard">
        SUPPLIER PANEL
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupplier"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupplier">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/supplier/dashboard') ? 'active' : ''}`} to="/supplier/dashboard">דף הבית</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/supplier/clients') ? 'active' : ''}`} to="/supplier/clients">לקוחות</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/supplier/inventory') ? 'active' : ''}`} to="/supplier/inventory">מלאי</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/supplier/orders') ? 'active' : ''}`} to="/supplier/orders">הזמנות מלקוחות</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/supplier/invoices') ? 'active' : ''}`} to="/supplier/invoices">חשבוניות</Link>
          </li>
        </ul>

        {/* כפתור התנתקות בצד ימין */}
        <button onClick={handleLogout} className="btn btn-outline-light">
          התנתקות
        </button>
      </div>
    </nav>
  );
}
