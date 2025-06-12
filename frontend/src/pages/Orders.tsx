import { useEffect, useState } from "react";
import axios from "axios";

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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentOrder(null);
      setPaymentSuccess(false);
    }, 2000);
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
                {paymentSuccess ? (
                  <div className="alert alert-success text-center">
                    ✅ התשלום בוצע בהצלחה!
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
