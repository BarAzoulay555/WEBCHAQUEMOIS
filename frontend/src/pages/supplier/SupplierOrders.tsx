import { useEffect, useState } from "react";
import axios from "axios";
import SupplierNavbar from "../../components/SupplierNavbar";

type Order = {
  id: number;
  product_name: string;
  quantity: number;
  status: string;
  created_at: string;
};

export default function SupplierOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("/api/supplier/orders?supplier_id=1")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching supplier orders:", err));
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    axios
      .patch(`/api/supplier/orders/${orderId}`, { status: newStatus })
      .then(() => fetchOrders())
      .catch((err) => console.error("Error updating order status:", err));
  };

  return (
    <>
      <div className="container mt-4">
      <h2 className="text-center">הזמנות מלקוחות</h2>
        {orders.length === 0 ? (
          <p className="text-center">אין הזמנות כרגע</p>
        ) : (
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>מוצר</th>
                <th>כמות</th>
                <th>סטטוס</th>
                <th>תאריך</th>
                <th>פעולה</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.product_name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    {order.status === "ממתינה" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => updateOrderStatus(order.id, "אושרה")}
                        >
                          אשר
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateOrderStatus(order.id, "אין במלאי")}
                        >
                          סרב
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
