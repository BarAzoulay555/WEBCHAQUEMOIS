import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  quantity: number;
  reorder_level: number;
  price: number;
  image: string;
  color: string;
  size: string;
};

export default function SupplierInventory() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/supplier/products?supplier_id=1")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching supplier inventory:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4"> ניהול מלאי לספק</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className={`card shadow-sm h-100 ${product.quantity < product.reorder_level ? "border-danger" : ""}`}>
              <img
                src={`/images/${product.image}`}
                className="card-img-top"
                alt={product.name}
                style={{ height: "500px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">
                   {product.color} |  {product.size} <br />
                   {product.price} ₪ מחיר ללקוח<br />
                   יכולת שילוח: {product.quantity}<br />
                   
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
