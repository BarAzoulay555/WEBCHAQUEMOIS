import { useState } from "react";
import axios from "axios";

export default function DBData() {
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckDb = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/db-check")
      .then((res) => {
        setDbData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("שגיאה בבדיקת ה-DB:", err);
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🔍 בדיקת נתוני בסיס נתונים</h2>

      <div className="text-center mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={handleCheckDb}
        >
          בדוק נתונים עכשיו
        </button>
      </div>

      {loading && (
        <div className="text-center text-secondary mb-4">⏳ טוען נתונים מה-DB...</div>
      )}

      {dbData && (
        <div className="mt-4">
          {Object.entries(dbData).map(([tableName, rows]) => (
            <div key={tableName} className="mb-5">
              <h5 className="text-primary text-center">📄 טבלה: {tableName}</h5>
              {Array.isArray(rows) && rows.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-sm text-center">
                    <thead className="table-light">
                      <tr>
                        {Object.keys(rows[0]).map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row: any, idx: number) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i}>{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted">אין נתונים בטבלה זו.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
