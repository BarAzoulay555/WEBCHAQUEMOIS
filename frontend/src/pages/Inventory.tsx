import { useEffect, useState } from "react";
import axios from "axios";
import OrderModal from "../components/OrderModal";

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

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get("/api/products")
      .then(res => {
        console.log(" מוצרים שהתקבלו מהשרת:", res.data); // 🔍 שורת בדיקה
        setProducts(res.data);
      })
      .catch(err => console.error("שגיאה בטעינה:", err));
  };

  const handleAddProduct = () => {
    axios.post("/api/products", newProduct)
      .then(() => {
        setShowAddModal(false);
        setNewProduct({});
        fetchProducts();
      });
  };

  const handleUpdateProduct = () => {
    axios.put(`/api/products/${editProduct?.id}`, editProduct)
      .then(() => {
        setShowEditModal(false);
        setEditProduct(null);
        fetchProducts();
      });
  };

  const handleOrder = (productId: number) => {
    axios.post("/api/orders", { product_id: productId, quantity: 1 })
      .then(() => alert("הזמנה בוצעה"));
  };

  return (
    <div className="container mt-5">
        <div className="text-center my-5">
  <h2 className="fw-bold mb-3">ניהול מלאי</h2>
</div>
<div className="d-flex justify-content-end mb-3">
  <button className="btn btn-secondary btn-m mb-3 " onClick={() => setShowAddModal(true)}>
    ➕ הוסף מוצר
  </button>
</div>


      {products.length === 0 ? (
        <div className="alert alert-info">לא נמצאו מוצרים להצגה.</div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`/images/${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "400px", objectFit: "inherit" }}
                />
                <div className="card-body text-center">
                  <h5>{product.name}</h5>
                  <div>
                    <p className="mb-1">Size: {product.size}</p>
                    <p className="mb-1">Color: {product.color}</p>
                    <p className="mb-1">
                      Quantity:{" "}
                      <span className={product.quantity < product.reorder_level ? "text-danger fw-bold" : ""}>
                        {product.quantity}
                      </span>
                    </p>
                    <p className="mb-1">Minimum stock: {product.reorder_level}</p>
                    <p className="mb-1">Price: {product.price.toLocaleString()} ₪</p>
                  </div>
                  <div className="d-flex justify-content-around mt-3">
                    <button className="btn btn-outline-secondary btn-m" onClick={() => { setEditProduct(product); setShowEditModal(true); }}>
                      Edit
                    </button>
                    <button className="btn btn-outline-success btn-m" onClick={() => setSelectedProduct(product)}>
                      Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
          {/*  פופ-אפ הזמנה */}
          {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}
