import { useEffect, useState } from "react";
import axios from "axios";
import SupplierNavbar from "../../components/SupplierNavbar";

type Invoice = {
  id: number;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  issued_at: string;
  status: string;
};

export default function SupplierInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    axios
      .get("/api/supplier/invoices?supplier_name=Cotton Dreams")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("Error fetching supplier invoices:", err));
  }, []);

  return (
    <>
      <div className="container mt-4">
      <h2 className="text-center">חשבוניות</h2>
        {invoices.length === 0 ? (
          <p className="text-center">אין חשבוניות להצגה</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>מוצר</th>
                <th>כמות</th>
                <th>מחיר ליח'</th>
                <th>סה"כ</th>
                <th>תאריך הוצאה</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.product_name}</td>
                  <td>{inv.quantity}</td>
                  <td>{inv.price_per_unit} ₪</td>
                  <td>{inv.total_price} ₪</td>
                  <td>{new Date(inv.issued_at).toLocaleDateString()}</td>
                  <td>{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
