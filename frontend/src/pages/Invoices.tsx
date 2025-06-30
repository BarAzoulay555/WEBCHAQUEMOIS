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

export default function SupplierInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    axios
      .get("/api/invoices")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("שגיאה בטעינת החשבוניות:", err));
  }, []);

  const visualInvoiceBatch = (() => {
    const recipient = "חנות CHAQUEMOIS";
    const note = "הזמנה ראשונית - פתיחת חנות";
    const urgent = false;
    const supplier_name = "Cotton Dreams";

    const products = [
      { product_name: "Black Ruby Skirt", price_per_unit: 120 },
      { product_name: "Emma Dress White", price_per_unit: 200 },
      { product_name: "Beige Ruby Skirt", price_per_unit: 130 },
      { product_name: "Emma Dress Black", price_per_unit: 210 },
    ];

    let total_price = 0;
    const productsList: string[] = [];

    products.forEach(({ product_name, price_per_unit }) => {
      const subtotal = price_per_unit * 250;
      total_price += subtotal;
      productsList.push(`${product_name} - 250 יחידות × ${price_per_unit} ₪ = ${subtotal} ₪`);
    });

    return [
      {
        id: 1000,
        order_id: 0,
        product_name: productsList.join("\n"),
        supplier_name,
        quantity: products.length * 250,
        price_per_unit: 0,
        total_price,
        issued_at: new Date("2025-02-01T09:13:09").toISOString(),
        urgent,
        note,
        recipient,
      },
    ];
  })();

  const allInvoices = [...invoices, ...visualInvoiceBatch];

  const exportToPDF = async (id: number) => {
    const element = document.getElementById(`invoice-${id}`);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
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
      <h2 className="text-center mb-4">📄 חשבוניות ספקים</h2>

      {allInvoices.length === 0 ? (
        <div className="alert alert-info">אין חשבוניות להצגה.</div>
      ) : (
        <div className="row">
          {allInvoices.map((inv) => (
            <div className="col-md-6 mb-4" key={inv.id}>
              <div
                className="card shadow border rounded p-3"
                id={`invoice-${inv.id}`}
                style={{
                  fontSize: "0.9rem",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <h5 className="card-title mb-3 text-center">חשבונית #{inv.id}</h5>
                <p><strong>הזמנה:</strong> {inv.order_id}</p>

                <p>
                  <strong>מוצרים:</strong><br />
                  {inv.product_name.split("\n").map((line, idx) => (
                    <span key={idx}>{line}<br /></span>
                  ))}
                </p>

                <p><strong>ספק:</strong> {inv.supplier_name}</p>
                <p><strong>כמות כוללת:</strong> {inv.quantity}</p>

                {inv.id < 100000 && (
                  <p><strong>מחיר יחידה:</strong> {inv.price_per_unit} ₪</p>
                )}

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
