import React from 'react';

type Supplier = {
  name: string;
  contact: string;
  email: string;
  phone: string;
  products: number;
  rating: number;
  availability: string;
  responseTime: string;
  paymentTerms: string;
};

const suppliers: Supplier[] = [
  {
    name: "Fashion Forward Ltd",
    contact: "David Miller",
    email: "david@fashionforward.com",
    phone: "03-1234567",
    products: 15,
    rating: 4.8,
    availability: "90%",
    responseTime: "2-4 שעות",
    paymentTerms: "30 ימים"
  },
  {
    name: "Cotton Dreams",
    contact: "Rachel Green",
    email: "rachel@cottondreams.com",
    phone: "03-2345678",
    products: 8,
    rating: 4.6,
    availability: "85%",
    responseTime: "1-2 שעות",
    paymentTerms: "15 ימים"
  },
  {
    name: "Urban Style Co",
    contact: "Michael Brown",
    email: "michael@urbanstyle.com",
    phone: "03-3456789",
    products: 12,
    rating: 4.9,
    availability: "95%",
    responseTime: "3-6 שעות",
    paymentTerms: "45 ימים"
  },
  {
    name: "Linen Luxe",
    contact: "Sarah White",
    email: "sarah@linenluxe.com",
    phone: "03-4567890",
    products: 6,
    rating: 4.7,
    availability: "88%",
    responseTime: "1-3 שעות",
    paymentTerms: "30 ימים"
  }
];

export default function Suppliers() {
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="mb-0"> ניהול ספקים</h2>
        <button className="btn btn-dark">➕ ספק חדש</button>
      </div>

      <div className="row">
        {suppliers.map((s, index) => (
          <div className="col-md-6 col-lg-4 mb-4" key={index}>
            <div className="card h-100 shadow-sm p-3">
              <h5 className="fw-bold">{s.name}</h5>
              <p className="mb-1 text-muted">איש קשר: {s.contact}</p>
              <p className="mb-1"><i className="bi bi-envelope"></i> {s.email}</p>
              <p className="mb-1"><i className="bi bi-telephone"></i> {s.phone}</p>
              <p className="mb-1"><i className="bi bi-box"></i> {s.products} מוצרים</p>
              <hr />
              <p className="mb-1">דירוג: {s.rating} ⭐</p>
              <p className="mb-1">זמינות: {s.availability}</p>
              <p className="mb-1">זמן תגובה: {s.responseTime}</p>
              <p className="mb-3">תנאי תשלום: {s.paymentTerms}</p>
              <div className="d-flex gap-2">
                <a href={`mailto:${s.email}`} className="btn btn-outline-secondary btn-sm w-100">📧 שלח מייל</a>
                <a href={`tel:${s.phone}`} className="btn btn-outline-secondary btn-sm w-100">📞 התקשר</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
