import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LowStockAlert from '../components/LowStockAlert';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
  setRole: (value: string) => void; // ← נוסיף את זה
}

export default function Login({ setIsAuthenticated, setRole }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'admin' && password === '1234') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'admin');
      setIsAuthenticated(true);
      setRole('admin'); // ← נדרש!
      setShowAlert(true); // הצגת התראה לפני ניתוב
    } else if (username === 'supp' && password === '1234') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'supplier');
      setIsAuthenticated(true);
      setRole('supplier'); // ← נדרש!
      navigate('/supplier/dashboard');
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  const handleAlertClosed = () => {
    setShowAlert(false);
    navigate('/home'); // רק ל־admin
  };

  return (
    <div
      className="vh-100 vw-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url("/images/CHAQUEMOIS_files/356700040021-Large-1024x679.jpeg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div
        className="card p-4 shadow"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
        }}
      >
        <div className="text-center mb-3">
          <img src="/images/logo.png" alt="CHAQUEMOIS Logo" style={{ height: '80px' }} />
          <h3 className="mt-2 fw-bold">CHAQUEMOIS</h3>
          <p className="text-muted">מערכת ניהול חנות</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-end d-block">שם משתמש</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="הכנס שם משתמש"
              style={{ textAlign: 'right' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-end d-block">סיסמה</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="הכנס סיסמה"
              style={{ textAlign: 'right' }}
            />
          </div>
          {error && <div className="text-danger">{error}</div>}
          <button className="btn btn-dark w-100 mt-2" type="submit">
            התחבר
          </button>
        </form>
      </div>

      {/* רק ל-admin תוצג ההתראה */}
      {showAlert && localStorage.getItem('role') === 'admin' && (
        <LowStockAlert onClose={handleAlertClosed} />
      )}
    </div>
  );
}
