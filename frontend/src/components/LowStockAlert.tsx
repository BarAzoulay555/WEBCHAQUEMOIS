import { useEffect, useState } from 'react';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  color: string;
  size: string;
  quantity: number;
  reorder_level: number;
};

type Props = {
  onClose?: () => void;
};

export default function LowStockAlert({ onClose }: Props) {
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => {
        const filtered = res.data.filter((p: Product) => p.quantity < p.reorder_level);
        setLowStockItems(filtered);
        if (filtered.length > 0) {
          setShowModal(true);
        } else {
          if (onClose) onClose();
        }
      })
      .catch(() => {
        if (onClose) onClose();
      });
  }, []);

  const handleClose = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  if (!showModal) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      dir="rtl"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content text-end">
          <div className="modal-header bg-white border-bottom-0">
            <h5 className="text-danger mb-0">
              <span className="me-2">⚠️</span>התראת מלאי נמוך
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>הפריטים הבאים במלאי נמוך ודורשים הזמנה מחדש:</p>
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>מוצר</th>
                    <th>צבע</th>
                    <th>מידה</th>
                    <th>מלאי נוכחי</th>
                    <th>רמת הזמנה</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                      <td className="text-danger fw-bold">{item.quantity}</td>
                      <td>{item.reorder_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer border-top-0">
            <button className="btn btn-primary px-4" onClick={handleClose}>הבנתי</button>
          </div>
        </div>
      </div>
    </div>
  );
}
