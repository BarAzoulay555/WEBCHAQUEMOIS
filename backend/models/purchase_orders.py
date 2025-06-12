from database.db import get_db_connection

# יצירת הזמנת רכש חדשה
def insert_order(product_id, supplier_id, quantity, total_cost):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO purchase_orders (product_id, supplier_id, quantity, total_cost)
        VALUES (?, ?, ?, ?)
    """, (product_id, supplier_id, quantity, total_cost))
    conn.commit()
    conn.close()

# שליפת כל ההזמנות
def get_all_orders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT po.id, p.name AS product_name, s.name AS supplier_name,
               po.quantity, po.total_cost, po.status, po.created_at
        FROM purchase_orders po
        JOIN products p ON p.id = po.product_id
        JOIN suppliers s ON s.id = po.supplier_id
        ORDER BY po.created_at DESC
    """)
    orders = cursor.fetchall()
    conn.close()
    return [dict(row) for row in orders]

# עדכון סטטוס של הזמנה
def update_order_status(order_id, new_status):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE purchase_orders
        SET status = ?
        WHERE id = ?
    """, (new_status, order_id))
    conn.commit()
    conn.close()
