import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
};

type Order = {
  id: number;
  product_name: string;
  quantity: number;
  status: string;
  created_at: string;
};

export default function SupplierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/supplier/products?supplier_id=1")
      .then((res) => setProducts(res.data))
      .catch(() => setError("לא הצלחנו לטעון את המוצרים"));

    axios
      .get("/api/supplier/orders?supplier_id=1")
      .then((res) => setOrders(res.data))
      .catch(() => setError("לא הצלחנו לטעון את ההזמנות"));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4"> דשבורד ספק</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="border rounded p-3 shadow-sm bg-primary text-white">
            <h5 className="text-center">סה"כ הזמנות</h5>
            <p className="fs-4 text-center">{orders.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3 shadow-sm bg-primary text-white">
            <h5 className="text-center">סה"כ מוצרים במלאי</h5>
            <p className="fs-4 text-center">
              {products.reduce((sum, p) => sum + p.quantity, 0)}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3 shadow-sm bg-primary text-white">
            <h5 className="text-center">סוגי מוצרים</h5>
            <p className="fs-4 text-center">{products.length}</p>
          </div>
        </div>
      </div>

      <h4 className="text-center mt-5 mb-3"> מוצרים במלאי</h4>
      {products.length === 0 ? (
        <p className="text-center">אין מוצרים להצגה.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light text-center">
            <tr>
              <th>שם מוצר</th>
              <th>צבע</th>
              <th>מידה</th>
              <th>כמות</th>
              <th>מחיר (₪)</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.color}</td>
                <td>{p.size}</td>
                <td>{p.quantity}</td>
                <td>{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 className="text-center mt-5 mb-3"> סטטוס משלוחים</h4>
      {orders.length === 0 ? (
        <p className="text-center">אין הזמנות להצגה.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light text-center">
            <tr>
              <th>שם מוצר</th>
              <th>כמות</th>
              <th>סטטוס</th>
              <th>תאריך הזמנה</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product_name}</td>
                <td>{order.quantity}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
