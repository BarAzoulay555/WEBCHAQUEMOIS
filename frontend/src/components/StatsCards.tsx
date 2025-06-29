import { useEffect, useState } from "react";
import axios from "axios";

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalOrders: 0,
    totalValue: 0,
  });

  useEffect(() => {
    axios.get("/api/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  return (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h5 className="card-title">סה"כ מוצרים</h5>
            <p className="card-text display-6">{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h5 className="card-title">סה"כ ספקים</h5>
            <p className="card-text display-6">{stats.totalSuppliers}</p>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h5 className="card-title">סה"כ הזמנות</h5>
            <p className="card-text display-6">{stats.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h5 className="card-title">שווי מלאי כולל</h5>
            <p className="card-text display-6">{stats.totalValue.toLocaleString()} ₪</p>
          </div>
        </div>
      </div>
    </div>
  );
}
