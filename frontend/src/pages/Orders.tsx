import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Order {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  status: string;
  supplier_name: string;
  created_at: string;
  note?: string;
  urgent?: boolean;
}

interface Invoice {
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
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [showPaymentSuccessPopup, setShowPaymentSuccessPopup] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get("http://localhost:5000/api/orders")
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("שגיאה בטעינת ההזמנות:", err));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmAndUpdateStock = (order: Order) => {
    axios
      .put(`http://localhost:5000/api/products/${order.product_id}/add-stock`, {
        quantity: order.quantity,
      })
      .then(() => {
        alert(`✔️ כמות עודכנה במלאי עבור המוצר: ${order.product_name}`);
      })
      .catch((err) => {
        console.error("שגיאה בעדכון כמות:", err);
        alert("❌ שגיאה בעדכון המלאי.");
      });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ישר ליצירת חשבונית והצגת פופאפ הצלחה
    if (paymentOrder) {
      // דמויי יצירת חשבונית (כאילו מהשרת)
      const mockInvoice: Invoice = {
        id: Math.floor(Math.random() * 1000) + 100, // ID אקראי
        order_id: paymentOrder.id,
        product_name: paymentOrder.product_name,
        supplier_name: paymentOrder.supplier_name,
        quantity: paymentOrder.quantity,
        price_per_unit: 250, // מחיר לדוגמה
        total_price: 250 * paymentOrder.quantity,
        issued_at: new Date().toLocaleString("he-IL", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        urgent: paymentOrder.urgent,
        note: paymentOrder.note,
        recipient: "CHAQUEMOIS Ltd"
      };
      
      setGeneratedInvoice(mockInvoice);
    }
    
    // סגור פופאפ תשלום והראה פופאפ הצלחה
    setPaymentOrder(null);
    setShowPaymentSuccessPopup(true);
  };

  // פונקציה זהה לזו בעמוד החשבוניות
  const exportToPDF = async () => {
    if (!generatedInvoice) return;
    
    const element = document.getElementById(`invoice-${generatedInvoice.id}`);
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

    pdf.save(`invoice_${generatedInvoice.id}.pdf`);
  };

  const closePaymentSuccessPopup = () => {
    setShowPaymentSuccessPopup(false);
    setShowInvoiceDetails(false);
    setGeneratedInvoice(null);
  };

  const showInvoiceHandler = () => {
    setShowInvoiceDetails(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">הזמנות רכש</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">לא נמצאו הזמנות.</div>
      ) : (
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>שם מוצר</th>
              <th>כמות</th>
              <th>ספק</th>
              <th>סטטוס</th>
              <th>תאריך יצירה</th>
              <th>הערה</th>
              <th>דחוף</th>
              <th>פעולה</th>
              <th>תשלום</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.product_name}</td>
                <td>{order.quantity}</td>
                <td>{order.supplier_name || "—"}</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === "ממתינה"
                        ? "bg-warning"
                        : order.status === "לא התקבל"
                        ? "bg-danger"
                        : order.status === "הזמנה אושרה"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                    style={{
                      cursor:
                        order.status === "לא התקבל" || order.status === "הזמנה אושרה"
                          ? "pointer"
                          : "default",
                    }}
                    onClick={() => {
                      if (order.status === "לא התקבל") {
                        setPopupMessage("⚠️ המוצר חסר במלאי אצל הספק, אנא בחר ספק אחר");
                        setShowPopup(true);
                      } else if (order.status === "הזמנה אושרה") {
                        setPaymentOrder(order);
                      }
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleString("he-IL")}</td>
                <td>{order.note || "—"}</td>
                <td>{order.urgent ? "כן" : "לא"}</td>
                <td>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleConfirmAndUpdateStock(order)}
                  >
                    ההזמנה התקבלה ועודכנה במלאי
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setPaymentOrder(order)}
                  >
                    💳 תשלום
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* פופ־אפ שגיאה */}
      {showPopup && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header">
                <h5 className="modal-title">שגיאת הזמנה</h5>
                <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
              </div>
              <div className="modal-body">
                <p>{popupMessage}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* פופ־אפ תשלום */}
      {paymentOrder && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Billing information</h5>
                <button type="button" className="btn-close" onClick={() => setPaymentOrder(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-2">
                    <label className="form-check-label">
                      <input type="checkbox" className="form-check-input me-2" checked readOnly />
                      Business purchase
                    </label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value="chaquemois@example.com" readOnly />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Company name</label>
                    <input type="text" className="form-control" value="CHAQUEMOIS LTD" readOnly />
                  </div>

                  <div className="my-3">
                    <label className="form-label">Payment Method</label>
                    <div className="d-flex gap-3">
                      <button type="button" className="btn btn-outline-dark" disabled>💳 Visa / Mastercard</button>
                      <button type="button" className="btn btn-outline-dark" disabled>💲 PayPal</button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Card number</label>
                    <input type="text" className="form-control" value="**** **** **** 1234" readOnly />
                  </div>

                  <div className="row">
                    <div className="col">
                      <label className="form-label">Expiration date</label>
                      <input type="text" className="form-control" value="12/28" readOnly />
                    </div>
                    <div className="col">
                      <label className="form-label">Security code</label>
                      <input type="text" className="form-control" value="***" readOnly />
                    </div>
                  </div>

                  <div className="form-check mt-3">
                    <input className="form-check-input" type="checkbox" disabled />
                    <label className="form-check-label">I have a coupon code</label>
                  </div>

                  <div className="mt-4 d-grid">
                    <button type="submit" className="btn btn-success">Submit order</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* פופ־אפ הצלחת תשלום */}
      {showPaymentSuccessPopup && generatedInvoice && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white position-relative">
                <h5 className="modal-title w-100 text-center" style={{ direction: 'rtl' }}>
                  ✅ התשלום בוצע בהצלחה!
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white position-absolute" 
                  style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                  onClick={closePaymentSuccessPopup}
                ></button>
              </div>
              <div className="modal-body text-center" style={{ direction: 'rtl' }}>
                {!showInvoiceDetails ? (
                  // אם עדיין לא מציגים את החשבונית - רק הודעת הצלחה וכפתור
                  <div>
                    <div className="alert alert-success">
                      <h4>🎉 מעולה!</h4>
                      <p>התשלום עבור הזמנה מס' <strong>{generatedInvoice.order_id}</strong> בוצע בהצלחה.</p>
                      <p>מוצר: <strong>{generatedInvoice.product_name}</strong></p>
                      <p>כמות: <strong>{generatedInvoice.quantity}</strong> יחידות</p>
                      <p>ספק: <strong>{generatedInvoice.supplier_name}</strong></p>
                    </div>
                    <div className="d-flex gap-3 justify-content-center">
                      <button 
                        className="btn btn-primary" 
                        onClick={showInvoiceHandler}
                      >
                        📄 צפה בחשבונית והורד PDF
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        onClick={closePaymentSuccessPopup}
                      >
                        סגור
                      </button>
                    </div>
                  </div>
                ) : (
                  // אם לחצו על הכפתור - הצג את החשבונית המלאה
                  <div>
                    {/* חשבונית עם כיוונים מתוקנים */}
                    <div 
                      className="card shadow border rounded p-3 mb-4"
                      id={`invoice-${generatedInvoice.id}`}
                      style={{
                        fontSize: "0.9rem",
                        maxWidth: "500px",
                        margin: "0 auto",
                        direction: 'rtl',
                        textAlign: 'right'
                      }}
                    >
                      <div className="text-center mb-3">
                        <img src="/logo.png" alt="CHAQUEMOIS Logo" style={{ height: "40px" }} />
                      </div>
                      <h5 className="card-title mb-3 text-center" style={{ direction: 'rtl' }}>
                        חשבונית #{generatedInvoice.id}
                      </h5>
                      <div style={{ direction: 'rtl', textAlign: 'right' }}>
                        <p><strong>הזמנה:</strong> {generatedInvoice.order_id}</p>
                        <p><strong>מוצר:</strong> {generatedInvoice.product_name}</p>
                        <p><strong>ספק:</strong> {generatedInvoice.supplier_name}</p>
                        <p><strong>כמות:</strong> {generatedInvoice.quantity}</p>
                        <p><strong>מחיר יחידה:</strong> {generatedInvoice.price_per_unit} ₪</p>
                        <p><strong>סה"כ לתשלום:</strong> {generatedInvoice.total_price} ₪</p>
                        <p><strong>תאריך הנפקה:</strong> {generatedInvoice.issued_at}</p>
                        <p><strong>דחוף:</strong> {generatedInvoice.urgent ? "כן" : "לא"}</p>
                        <p><strong>הערה:</strong> {generatedInvoice.note || "—"}</p>
                        <p><strong>נמען:</strong> {generatedInvoice.recipient}</p>
                      </div>
                    </div>

                    {/* כפתורי פעולה */}
                    <div className="d-flex gap-3 justify-content-center">
                      <button
                        className="btn btn-outline-primary"
                        onClick={exportToPDF}
                      >
                        📤 ייצוא ל-PDF
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        onClick={closePaymentSuccessPopup}
                      >
                        סגור
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}