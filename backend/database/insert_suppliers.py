import os
import sqlite3
from backend.database.db import get_db_connection


DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'db.sqlite3'))

def insert_suppliers():
    suppliers = [
        {
            "name": "Fashion Forward Ltd",
            "contact_name": "David Miller",
            "email": "david@fashionforward.com",
            "phone": "03-1234567",
            "num_products": 15,
            "rating": 4.8,
            "reliability": 90,
            "response_time": "2-4 שעות",
            "payment_terms": "30 ימים"
        },
        {
            "name": "Cotton Dreams",
            "contact_name": "Rachel Green",
            "email": "rachel@cottondreams.com",
            "phone": "03-2345678",
            "num_products": 8,
            "rating": 4.6,
            "reliability": 85,
            "response_time": "1-2 שעות",
            "payment_terms": "15 ימים"
        },
        {
            "name": "Urban Style Co",
            "contact_name": "Michael Brown",
            "email": "michael@urbanstyle.com",
            "phone": "03-3456789",
            "num_products": 12,
            "rating": 4.9,
            "reliability": 95,
            "response_time": "3-6 שעות",
            "payment_terms": "45 ימים"
        },
        {
            "name": "Linen Luxe",
            "contact_name": "Sarah White",
            "email": "sarah@linenluxe.com",
            "phone": "03-4567890",
            "num_products": 6,
            "rating": 4.7,
            "reliability": 88,
            "response_time": "1-3 שעות",
            "payment_terms": "30 ימים"
        }
    ]

    conn = get_db_connection()
    cursor = conn.cursor()

    for supplier in suppliers:
        cursor.execute("""
            INSERT INTO suppliers (name, contact_name, email, phone, num_products, rating, reliability, response_time, payment_terms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            supplier["name"],
            supplier["contact_name"],
            supplier["email"],
            supplier["phone"],
            supplier["num_products"],
            supplier["rating"],
            supplier["reliability"],
            supplier["response_time"],
            supplier["payment_terms"]
        ))

    conn.commit()
    conn.close()
    print("✅ Suppliers inserted successfully.")

if __name__ == "__main__":
    insert_suppliers()
