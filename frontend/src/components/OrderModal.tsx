import { useEffect, useState } from "react";
import axios from "axios";
import { Product, Supplier } from "../types"; 

type Props = {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
};

export default function OrderModal({ product, onClose, onSuccess }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(err => console.error("שגיאה בטעינת ספקים:", err));
  }, []);

  const totalPrice = quantity ? product.price * quantity : 0;

  const handleSubmit = () => {
    if (!selectedSupplier || !quantity || quantity <= 0) {
      alert("אנא מלא את כל השדות");
      return;
    }

    axios.post("http://localhost:5000/api/orders", {
      product_id: product.id,
      supplier_id: selectedSupplier,
      quantity,
      note,
      urgent
    }).then(() => {
      onSuccess();
      onClose();
    });
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content text-end">
          <div className="modal-header">
            <h5 className="modal-title">יצירת הזמנת רכש</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="fw-bold">{product.name}</p>

            <label className="form-label">בחר ספק</label>
            <select className="form-select mb-3" value={selectedSupplier ?? ""} onChange={(e) => setSelectedSupplier(Number(e.target.value))}>
              <option disabled value="">בחר ספק</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="form-label">כמות להזמנה</label>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="הכנס כמות"
              min={1}
              value={quantity ?? ""}
              onChange={(e) => setQuantity(e.target.value === "" ? null : +e.target.value)}
            />

            <div className="text-muted mb-3">עלות הזמנה: {totalPrice.toLocaleString()} ₪</div>

            <label className="form-label">הערות</label>
            <textarea className="form-control mb-3" value={note} onChange={(e) => setNote(e.target.value)} />

            <div className="form-check mb-3 d-flex align-items-center gap-2">
              <input type="checkbox" className="form-check-input" id="urgentCheck"
                checked={urgent} onChange={() => setUrgent(!urgent)} />
              <label className="form-check-label" htmlFor="urgentCheck">הזמנה דחופה</label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary w-100" onClick={handleSubmit}>צור הזמנת רכש</button>
          </div>
        </div>
      </div>
    </div>
  );
}
