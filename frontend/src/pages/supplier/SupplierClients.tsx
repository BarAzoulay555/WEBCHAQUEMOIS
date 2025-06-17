import { useEffect, useState } from "react";
import axios from "axios";
import SupplierNavbar from "../../components/SupplierNavbar";

type Client = {
  id: number;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  num_orders: number;
  rating: number;
  loyalty: string;
  response_time: string;
  payment_terms: string;
};

export default function SupplierClients() {
  const clients: Client[] = [
    {
      id: 1,
      name: "CHAQUEMOIS",
      contact_name: "Yoni Levi",
      email: "orders@chaquemois.com",
      phone: "03-5633341",
      num_orders: 21,
      rating: 4.9,
      loyalty: "גבוהה",
      response_time: "1-2 ימים",
      payment_terms: "30 ימים"
    },
    {
      id: 2,
      name: "StylePoint Boutique",
      contact_name: "Dana Shalev",
      email: "contact@stylepoint.com",
      phone: "03-5623663",
      num_orders: 15,
      rating: 4.7,
      loyalty: "בינונית",
      response_time: "2-3 ימים",
      payment_terms: "45 ימים"
    },
    {
      id: 3,
      name: "TelAvivWear",
      contact_name: "Yossi Mor",
      email: "yossi@tlvwear.co.il",
      phone: "03-1233556",
      num_orders: 9,
      rating: 4.4,
      loyalty: "נמוכה",
      response_time: "3-4 ימים",
      payment_terms: "60 ימים"
    },
    {
      id: 4,
      name: "Femme Fashion",
      contact_name: "Liron Katz",
      email: "info@femmefashion.com",
      phone: "03-4455123",
      num_orders: 18,
      rating: 4.6,
      loyalty: "גבוהה",
      response_time: "1 יום",
      payment_terms: "30 ימים"
    },
    {
      id: 5,
      name: "Moderna Clothing",
      contact_name: "Avi Moyal",
      email: "sales@moderna.co.il",
      phone: "03-4743696",
      num_orders: 6,
      rating: 4.3,
      loyalty: "חדשה",
      response_time: "4 ימים",
      payment_terms: "15 ימים"
    }
  ];

  return (
    <>
      <div className="container mt-4">
      <h2 className="text-center">לקוחות</h2>
        {clients.length === 0 ? (
          <p>לא נמצאו לקוחות.</p>
        ) : (
          <div className="row">
            {clients.map(client => (
              <div className="col-md-4 mb-4" key={client.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{client.name}</h5>
                    <p className="card-text">
                       איש קשר: {client.contact_name}<br />
                       {client.email}<br />
                       {client.phone}<br />
                       {client.num_orders} הזמנות<br />
                       דירוג: {client.rating}<br />
                       נאמנות: {client.loyalty}<br />
                      זמן תגובה: {client.response_time}<br />
                      💳 תנאי תשלום: {client.payment_terms}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
