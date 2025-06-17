import os
import sqlite3
from backend.database.db import get_db_connection

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'db.sqlite3'))

def insert_clients():
    clients = [
        {
            "name": "CHAQUEMOIS",
            "contact_name": "Yoni Levi",
            "email": "orders@chaquemois.com",
            "phone": "03-53685332",
            "num_orders": 21,
            "rating": 4.9,
            "loyalty": "גבוהה",
            "response_time": "1-2 ימים",
            "payment_terms": "30 ימים"
        },
        {
            "name": "StylePoint Boutique",
            "contact_name": "Dana Shalev",
            "email": "contact@stylepoint.com",
            "phone": "03-1111111",
            "num_orders": 15,
            "rating": 4.7,
            "loyalty": "בינונית",
            "response_time": "2-3 ימים",
            "payment_terms": "45 ימים"
        },
        {
            "name": "TelAvivWear",
            "contact_name": "Yossi Mor",
            "email": "yossi@tlvwear.co.il",
            "phone": "03-2222222",
            "num_orders": 9,
            "rating": 4.4,
            "loyalty": "נמוכה",
            "response_time": "3-4 ימים",
            "payment_terms": "60 ימים"
        },
        {
            "name": "Femme Fashion",
            "contact_name": "Liron Katz",
            "email": "info@femmefashion.com",
            "phone": "03-3333333",
            "num_orders": 18,
            "rating": 4.6,
            "loyalty": "גבוהה",
            "response_time": "1 יום",
            "payment_terms": "30 ימים"
        },
        {
            "name": "Moderna Clothing",
            "contact_name": "Avi Moyal",
            "email": "sales@moderna.co.il",
            "phone": "03-4444444",
            "num_orders": 6,
            "rating": 4.3,
            "loyalty": "חדשה",
            "response_time": "4 ימים",
            "payment_terms": "15 ימים"
        }
    ]

    conn = get_db_connection()
    cursor = conn.cursor()

    # צור טבלה אם לא קיימת
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            contact_name TEXT,
            email TEXT,
            phone TEXT,
            num_orders INTEGER,
            rating REAL,
            loyalty TEXT,
            response_time TEXT,
            payment_terms TEXT
        )
    ''')

    for client in clients:
        cursor.execute("""
            INSERT INTO clients (name, contact_name, email, phone, num_orders, rating, loyalty, response_time, payment_terms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            client["name"],
            client["contact_name"],
            client["email"],
            client["phone"],
            client["num_orders"],
            client["rating"],
            client["loyalty"],
            client["response_time"],
            client["payment_terms"]
        ))

    conn.commit()
    conn.close()
    print("✅ Clients inserted successfully")

if __name__ == "__main__":
    insert_clients()
