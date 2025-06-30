import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SupplierNavbar from "../../components/SupplierNavbar";

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
    const mockInvoices: Invoice[] = [
      // חשבוניות CHAQUEMOIS
      {
        id: 1001,
        order_id: 555,
        product_name: "Black Ruby Skirt - 250 יחידות × 120 ₪ = 30000 ₪",
        supplier_name: "Cotton Dreams",
        quantity: 250,
        price_per_unit: 120,
        total_price: 30000,
        issued_at: new Date("2025-06-15T10:30:00").toISOString(),
        urgent: true,
        note: "משלוח דחוף לרגל פתיחת החנות",
        recipient: "חנות CHAQUEMOIS"
      },
      {
        id: 1002,
        order_id: 556,
        product_name: "Emma Dress White - 200 יחידות × 200 ₪ = 40000 ₪",
        supplier_name: "Cotton Dreams",
        quantity: 200,
        price_per_unit: 200,
        total_price: 40000,
        issued_at: new Date("2025-06-17T14:00:00").toISOString(),
        urgent: false,
        note: "הזמנה רגילה",
        recipient: "חנות CHAQUEMOIS"
      },
      // חשבוניות Moderna Clothing Femme Fashion
      {
        id: 2001,
        order_id: 601,
        product_name: "Midi Linen Dress - 150 יחידות × 180 ₪ = 27000 ₪",
        supplier_name: "Moderna Clothing Femme Fashion",
        quantity: 150,
        price_per_unit: 180,
        total_price: 27000,
        issued_at: new Date("2025-06-20T11:15:00").toISOString(),
        urgent: false,
        note: "לקראת קולקציית קיץ",
        recipient: "Moderna Clothing Femme Fashion"
      },
      {
        id: 2002,
        order_id: 602,
        product_name: "Silk Blouse Pink - 100 יחידות × 220 ₪ = 22000 ₪",
        supplier_name: "Moderna Clothing Femme Fashion",
        quantity: 100,
        price_per_unit: 220,
        total_price: 22000,
        issued_at: new Date("2025-06-22T16:00:00").toISOString(),
        urgent: true,
        note: "הזמנה דחופה לאירוע מכירות",
        recipient: "Moderna Clothing Femme Fashion"
      }
    ];

    setInvoices(mockInvoices);
  }, []);

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
    <>
      
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
                    margin: "0 auto",
                  }}
                >
                  <h5 className="card-title mb-3 text-center">חשבונית #{inv.id}</h5>
                  <p><strong>הזמנה:</strong> {inv.order_id}</p>
                  <p><strong>מוצר:</strong><br />{inv.product_name}</p>
                  <p><strong>ספק:</strong> {inv.supplier_name}</p>
                  <p><strong>כמות כוללת:</strong> {inv.quantity}</p>
                  <p><strong>מחיר ליחידה:</strong> {inv.price_per_unit} ₪</p>
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
    </>
  );
}
