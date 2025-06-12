import React from "react";
import LowStockAlert from "../components/LowStockAlert";
import StatsCards from "../components/StatsCards";
import LowStockTable from "../components/LowStockTable";
import RecentOrdersTable from "../components/RecentOrdersTable";

export default function Home() {
  const statCards = [
    {
      title: "סה\"כ מוצרים",
      value: 5,
      bg: "#001F3F", // כחול כהה
      text: "#FFFFFF" // לבן חמים
    },
    {
      title: "סה\"כ ספקים",
      value: 4,
      bg: "#001F3F", // כחול כהה
      text: "#FFFFFF"
    },
    {
      title: "סה\"כ הזמנות",
      value: 0,
      bg: "#001F3F", // כחול כהה
      text: "#FFFFFF"// לבן חמים
    }
  ];

  return (
    <div style={{ backgroundColor: "#F5F5F5", minHeight: "100vh", padding: "2rem" }}>
      {/* לוגו CHAQUEMOIS */}
      <div className="text-center mb-5">
        <img src="/images/chaquemois.png" alt="CHAQUEMOIS Logo" style={{ height: "70px" }} />
      </div>

      {/* התראה למלאי נמוך */}
      <LowStockAlert />

      {/* קלפים סטטיסטיים */}
      <div className="row justify-content-center mb-4">
        {statCards.map((card, idx) => (
          <div className="col-md-3" key={idx}>
            <div
              className="card mb-3 shadow-sm"
              style={{
                backgroundColor: card.bg,
                color: card.text,
                borderRadius: "16px",
                transition: "transform 0.2s"
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1.00)")}
            >
              <div className="card-body text-center">
                <h6 className="card-title">{card.title}</h6>
                <h3 className="card-text">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* טבלאות */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm mb-4" style={{ backgroundColor: "#FFFFFF", borderRadius: "16px" }}>
            <div className="card-header bg-transparent border-0 text-center">
            </div>
            <div className="card-body px-4">
              <LowStockTable />
            </div>
          </div>

          <div className="card shadow-sm" style={{ backgroundColor: "#FFFFFF", borderRadius: "16px" }}>
            <div className="card-header bg-transparent border-0 text-center">
            </div>
            <div className="card-body px-4">
              <RecentOrdersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
