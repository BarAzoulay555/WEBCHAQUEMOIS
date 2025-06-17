import os
from backend.database.db import get_db_connection
import sqlite3

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'db.sqlite3'))

def insert_products():
    products = [
        {
            "name": "Beige Ruby Skirt",
            "quantity": 150,
            "reorder_level": 20,
            "price": 220,
            "image": "BeigeRubySkirt.png",
            "size": "OneSize",
            "color": "Beige",
            "supplier_id": 1
        },
        {
            "name": "Black Ruby Skirt",
            "quantity": 12,
            "reorder_level": 20,
            "price": 210,
            "image": "BlackRubySkirt.png",
            "size": "OneSize",
            "color": "Black",
            "supplier_id": 1
        },
        {
            "name": "Emma dress Black",
            "quantity": 15,
            "reorder_level": 20,
            "price": 300,
            "image": "EmmadressBlack.png",
            "size": "OneSize",
            "color": "Black",
            "supplier_id": 1
        },
        {
            "name": "White Ruby Skirt",
            "quantity": 150,
            "reorder_level": 20,
            "price": 220,
            "image": "WhiteRubySkirt.png",
            "size": "OneSize",
            "color": "White",
            "supplier_id": 1
        },
        {
            "name": "Emma dress white",
            "quantity": 10,
            "reorder_level": 20,
            "price": 300,
            "image": "EmmadressWhite.png",
            "size": "OneSize",
            "color": "White",
            "supplier_id": 1
        }
    ]

    conn = get_db_connection()
    cursor = conn.cursor()

    for product in products:
        cursor.execute("""
            INSERT INTO products (name, quantity, reorder_level, price, image, size, color, supplier_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product["name"],
            product["quantity"],
            product["reorder_level"],
            product["price"],
            product["image"],
            product["size"],
            product["color"],
            product["supplier_id"]
        ))

    conn.commit()
    conn.close()
    print("✅ Products inserted successfully")

if __name__ == "__main__":
    insert_products()
