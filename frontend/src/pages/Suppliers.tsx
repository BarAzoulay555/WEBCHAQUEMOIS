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
    phone: "+97231234567",
    products: 15,
    rating: 4.8,
    availability: "90%",
    responseTime: "2-4 hours",
    paymentTerms: "30 days"
  },
  {
    name: "Cotton Dreams",
    contact: "Rachel Green",
    email: "rachel@cottondreams.com",
    phone: "+97232345678",
    products: 8,
    rating: 4.6,
    availability: "85%",
    responseTime: "1-2 hours",
    paymentTerms: "15 days"
  },
  {
    name: "Urban Style Co",
    contact: "Michael Brown",
    email: "michael@urbanstyle.com",
    phone: "+97233456789",
    products: 12,
    rating: 4.9,
    availability: "95%",
    responseTime: "3-6 hours",
    paymentTerms: "45 days"
  },
  {
    name: "Linen Luxe",
    contact: "Sarah White",
    email: "sarah@linenluxe.com",
    phone: "+97234567890",
    products: 6,
    rating: 4.7,
    availability: "88%",
    responseTime: "1-3 hours",
    paymentTerms: "30 days"
  }
];

export default function Suppliers() {
  const handleTeamsCall = (phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      window.open("https://teams.microsoft.com/_#/calls", "_blank");
      alert(`מספר הטלפון ${phone} הועתק.\nהדביקי אותו ב-Teams כדי להתקשר.`);
    }).catch((err) => {
      alert("נכשל להעתיק את מספר הטלפון. אנא העתיקי ידנית.");
      console.error(err);
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">ניהול ספקים</h2>

      <div className="row">
        {suppliers.map((s, index) => (
          <div className="col-md-6 col-lg-4 mb-4" key={index}>
            <div className="card h-100 shadow-sm p-3">
              <h5 className="fw-bold">{s.name}</h5>
              <p className="mb-1 text-muted">Contact: {s.contact}</p>
              <p className="mb-1"><i className="bi bi-envelope"></i> {s.email}</p>
              <p className="mb-1"><i className="bi bi-telephone"></i> {s.phone}</p>
              <p className="mb-1"><i className="bi bi-box"></i> {s.products} products</p>
              <hr />
              <p className="mb-1">Rating: {s.rating} ⭐</p>
              <p className="mb-1">Availability: {s.availability}</p>
              <p className="mb-1">Response Time: {s.responseTime}</p>
              <p className="mb-3">Payment Terms: {s.paymentTerms}</p>
              <div className="d-flex gap-2">
                <a
                  href={`mailto:${s.email}?subject=Collaboration%20Request%20with%20CHAQUEMOIS&body=Hello%20${encodeURIComponent(s.contact)},%0A%0AWe%20would%20like%20to%20discuss%20potential%20collaboration%20and%20product%20supply%20for%20CHAQUEMOIS.%0A%0APlease%20get%20back%20to%20us%20for%20further%20details.%0A%0AThank%20you,%0ACHAQUEMOIS%20Team`}
                  className="btn btn-outline-secondary btn-sm w-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📧 Send Email
                </a>
                <button
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={() => handleTeamsCall(s.phone)}
                >
                  📞 Call via Teams
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
