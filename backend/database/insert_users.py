import sqlite3
import os
from backend.database.db import get_db_connection

def insert_users():
    users = [
        {
            "username": "admin",
            "password": "admin123",
            "role": "admin"
        },
        {
            "username": "supp",
            "password": "supp123",
            "role": "supplier"
        }
    ]

    conn = get_db_connection()
    cursor = conn.cursor()

    for user in users:
        try:
            cursor.execute("""
                INSERT INTO users (username, password, role)
                VALUES (?, ?, ?)
            """, (user["username"], user["password"], user["role"]))
        except sqlite3.IntegrityError:
            print(f"⚠️ המשתמש '{user['username']}' כבר קיים.")

    conn.commit()
    conn.close()
    print("✅ Users inserted successfully")

if __name__ == "__main__":
    insert_users()
