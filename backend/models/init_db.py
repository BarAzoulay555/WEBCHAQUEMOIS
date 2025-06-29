import sqlite3
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/db.sqlite3'))

def create_tables():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    #DROP all existing tables (if needed)
    c.execute('DROP TABLE IF EXISTS invoices')
    c.execute('DROP TABLE IF EXISTS purchase_orders')
    c.execute('DROP TABLE IF EXISTS products')
    c.execute('DROP TABLE IF EXISTS suppliers')
    c.execute('DROP TABLE IF EXISTS users')

     #USERS table
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'operator', 'supplier')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # SUPPLIERS table
    c.execute('''
    CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_name TEXT,
        email TEXT,
        phone TEXT,
        num_products INTEGER,
        rating REAL,
        reliability INTEGER,
        response_time INTEGER,
        payment_terms TEXT
    )
    ''')

    # PRODUCTS table
    c.execute('''
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      reorder_level INTEGER NOT NULL DEFAULT 5,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      size TEXT NOT NULL,
      color TEXT NOT NULL,
      supplier_id INTEGER,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    )
    ''')

    # PURCHASE ORDERS table
    c.execute('''
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT DEFAULT 'ממתינה', 
      supplier_id INTEGER,
      note TEXT,
      urgent BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    )
    ''')

    # INVOICES table
    c.execute('''
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      supplier_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price_per_unit REAL NOT NULL,
      total_price REAL NOT NULL,
      issued_at TEXT NOT NULL,
      urgent BOOLEAN DEFAULT 0,
      note TEXT,
      status TEXT DEFAULT 'נשלחה',
      recipient TEXT DEFAULT 'CHAQUEMOIS',
      FOREIGN KEY (order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
    )
    ''')

    # Optional: print all existing invoices
    c.execute('SELECT * FROM invoices')
    rows = c.fetchall()
    for row in rows:
        print(row)

    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

if __name__ == '__main__':
    create_tables()
