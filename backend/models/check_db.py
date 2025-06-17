from backend.database.db import get_db_connection
#from database.db import get_db_connection 

def check_products():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()

    if not rows:
        print("📭 אין מוצרים בטבלה.")
    else:
        print("📦 מוצרים בטבלה:")
        for row in rows:
            print(dict(row))
    conn.close()


def check_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()

    if not rows:
        print("👥 אין משתמשים בטבלה.")
    else:
        print("👤 משתמשים בטבלה:")
        for row in rows:
            print(dict(row))
    conn.close()


if __name__ == "__main__":
    check_products()
    print("\n--------------------------\n")
    check_users()
