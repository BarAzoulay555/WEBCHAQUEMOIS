import sqlite3
import os

# מיקום מלא של הקובץ db.sqlite3
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'db.sqlite3'))

# פותח חיבור למסד הנתונים ומחזיר אותו
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # מאפשר גישה לפי מפתחות (dict)
    return conn

# פונקציה שיוצרת את הטבלאות לפי קובץ SQL
def initialize_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'create_tables.sql'))

    with open(sql_path, 'r', encoding='utf-8') as f:
        sql = f.read()
        cursor.executescript(sql)

    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

# מריץ את הפונקציה אם מריצים את הקובץ ישירות
if __name__ == '__main__':
    initialize_db()
