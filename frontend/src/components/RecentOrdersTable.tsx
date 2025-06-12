import { useEffect, useState } from "react";
import axios from "axios";

type Order = {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  status: string;
  created_at: string;
};

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders")
      .then(res => {
        // ניקח רק את 5 האחרונות לפי created_at
        const sorted = res.data
          .sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setOrders(sorted);
      })
      .catch(err => console.error("Failed to fetch orders:", err));
  }, []);

  if (orders.length === 0) return null;

  return (
    <div className="mt-5">
      <h5 className="mb-3 text-primary text-center"> הזמנות אחרונות</h5>
      <table className="table table-striped text-center">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>מוצר</th>
            <th>כמות</th>
            <th>סטטוס</th>
            <th>תאריך</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>
                <span className={`badge bg-${order.status === "pending" ? "warning" : "success"}`}>
                  {order.status === "pending" ? "ממתינה" : "הושלמה"}
                </span>
              </td>
              <td>{new Date(order.created_at).toLocaleDateString("he-IL")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
