import { useEffect, useState } from "react";
import axios from "axios";

type Invoice = {
  id: number;
  order_id: number;
  product_name: string;
  supplier_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  issued_at: string;
  urgent?: boolean;
  note?: string;
  recipient?: string;
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/invoices")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("שגיאה בטעינת חשבוניות:", err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🧾 חשבוניות</h2>

      {invoices.length === 0 ? (
        <div className="alert alert-info">לא נמצאו חשבוניות.</div>
      ) : (
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>מזהה הזמנה</th>
              <th>שם מוצר</th>
              <th>ספק</th>
              <th>כמות</th>
              <th>מחיר יחידה</th>
              <th>סה״כ</th>
              <th>נשלח ל</th>
              <th>דחוף</th>
              <th>הערה</th>
              <th>תאריך הנפקה</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.order_id}</td>
                <td>{invoice.product_name}</td>
                <td>{invoice.supplier_name}</td>
                <td>{invoice.quantity}</td>
                <td>{invoice.price_per_unit.toFixed(2)}₪</td>
                <td>{invoice.total_price.toFixed(2)}₪</td>
                <td>{invoice.recipient || "CHAQUEMOIS"}</td>
                <td>{invoice.urgent ? "כן" : "לא"}</td>
                <td>{invoice.note || "—"}</td>
                <td>{new Date(invoice.issued_at).toLocaleString("he-IL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
