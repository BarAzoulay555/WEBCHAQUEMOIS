import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  recipient: string;
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/invoices")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("שגיאה בטעינת החשבוניות:", err));
  }, []);

  const exportToPDF = async (id: number) => {
    const element = document.getElementById(`invoice-${id}`);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.setFillColor(255, 255, 255);
    pdf.rect(10, 10, pdfWidth - 20, imgHeight + 10, "F");

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, imgHeight);

    pdf.save(`invoice_${id}.pdf`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📄 חשבוניות</h2>

      {invoices.length === 0 ? (
        <div className="alert alert-info">אין חשבוניות להצגה.</div>
      ) : (
        <div className="row">
          {invoices.map((inv) => (
            <div className="col-md-6 mb-4" key={inv.id}>
              <div
                className="card shadow border rounded p-3"
                id={`invoice-${inv.id}`}
                style={{
                  fontSize: "0.9rem",
                  maxWidth: "500px",
                  margin: "0 auto"
                }}
              >
                <div className="text-center mb-3">
                  {/* לוגו - שימי את קובץ הלוגו ב-public/logo.png */}
                  <img src="/logo.png" alt="CHAQUEMOIS Logo" style={{ height: "40px" }} />
                </div>
                <h5 className="card-title mb-3 text-center">חשבונית #{inv.id}</h5>
                <p><strong>הזמנה:</strong> {inv.order_id}</p>
                <p><strong>מוצר:</strong> {inv.product_name}</p>
                <p><strong>ספק:</strong> {inv.supplier_name}</p>
                <p><strong>כמות:</strong> {inv.quantity}</p>
                <p><strong>מחיר יחידה:</strong> {inv.price_per_unit} ₪</p>
                <p><strong>סה"כ לתשלום:</strong> {inv.total_price} ₪</p>
                <p><strong>תאריך הנפקה:</strong> {new Date(inv.issued_at).toLocaleString("he-IL")}</p>
                <p><strong>דחוף:</strong> {inv.urgent ? "כן" : "לא"}</p>
                <p><strong>הערה:</strong> {inv.note || "—"}</p>
                <p><strong>נמען:</strong> {inv.recipient}</p>

                <div className="text-end mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => exportToPDF(inv.id)}
                  >
                    📤 ייצוא ל-PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
