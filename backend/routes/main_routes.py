from flask import Blueprint, request, jsonify
from backend.database.db import get_db_connection
from datetime import datetime
from backend.utils.invoice_utils import create_invoice_if_not_exists

main_bp = Blueprint('main', __name__, url_prefix='/api')

# ===================== ADMIN ROUTES =====================

@main_bp.route('/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@main_bp.route('/products/<int:product_id>/add-stock', methods=['PUT'])
def add_stock(product_id):
    data = request.get_json()
    added_quantity = data.get('quantity')
    if added_quantity is None:
        return jsonify({"success": False, "message": "כמות לעדכון חסרה"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT quantity FROM products WHERE id = ?", (product_id,))
    product = cursor.fetchone()

    if not product:
        conn.close()
        return jsonify({"success": False, "message": "מוצר לא נמצא"}), 404

    new_quantity = product['quantity'] + added_quantity
    cursor.execute("UPDATE products SET quantity = ? WHERE id = ?", (new_quantity, product_id))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "המלאי עודכן בהצלחה", "new_quantity": new_quantity})

@main_bp.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)
    supplier_id = data.get("supplier_id")
    note = data.get("note", "")
    urgent = data.get("urgent")

    if not product_id:
        return jsonify({"success": False, "error": "חסר מזהה מוצר"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO purchase_orders (product_id, quantity, supplier_id, note, urgent)
        VALUES (?, ?, ?, ?, ?)
    """, (product_id, quantity, supplier_id, note, urgent))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "ההזמנה נוספה"}), 201

@main_bp.route('/orders', methods=['GET'])
def get_orders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT o.id, o.product_id, o.quantity, o.status, o.created_at,
               o.note, o.urgent,
               p.name as product_name,
               s.name as supplier_name
        FROM purchase_orders o
        JOIN products p ON o.product_id = p.id
        JOIN suppliers s ON o.supplier_id = s.id
    """)
    rows = cursor.fetchall()
    updated_orders = []
    now = datetime.now()

    for row in rows:
        order = dict(row)
        created_at = datetime.fromisoformat(order['created_at'])
        minutes_passed = (now - created_at).total_seconds() / 60
        supplier_name = order['supplier_name']

        if supplier_name == "Cotton Dreams":
            if minutes_passed >= 1:
                order['status'] = "לא התקבל"
        else:
            if minutes_passed >= 2:
                order['status'] = "הוזמנה אושרה"
                create_invoice_if_not_exists(order, conn)
            elif minutes_passed >= 1:
                order['status'] = "הזמנה התקבלה אצל ספק"

        updated_orders.append(order)

    conn.close()
    return jsonify(updated_orders)

@main_bp.route('/suppliers', methods=['GET'])
def get_suppliers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM suppliers")
    suppliers = cursor.fetchall()
    conn.close()
    return jsonify([dict(s) for s in suppliers])

@main_bp.route('/low-stock', methods=['GET'])
def get_low_stock():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE quantity < reorder_level")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@main_bp.route('/invoices', methods=['GET'])
def get_invoices():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM invoices ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# ===================== SUPPLIER ROUTES =====================

@main_bp.route('/supplier/products', methods=['GET'])
def get_supplier_products():
    supplier_id = request.args.get("supplier_id")
    if not supplier_id:
        return jsonify({"error": "Missing supplier_id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE supplier_id = ?", (supplier_id,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@main_bp.route('/supplier/orders', methods=['GET'])
def get_supplier_orders():
    supplier_id = request.args.get("supplier_id")
    if not supplier_id:
        return jsonify({"error": "Missing supplier_id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT po.id, p.name AS product_name, po.quantity, po.status, po.created_at
        FROM purchase_orders po
        JOIN products p ON p.id = po.product_id
        WHERE po.supplier_id = ?
        ORDER BY po.created_at DESC
    """, (supplier_id,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@main_bp.route('/supplier/orders/<int:order_id>', methods=['PATCH'])
def update_order_status(order_id):
    data = request.get_json()
    new_status = data.get("status")
    if not new_status:
        return jsonify({"error": "Missing status"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE purchase_orders SET status = ? WHERE id = ?", (new_status, order_id))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Order {order_id} updated to '{new_status}'"})

@main_bp.route('/supplier/invoices', methods=['GET'])
def get_supplier_invoices():
    supplier_name = request.args.get("supplier_name")
    if not supplier_name:
        return jsonify({"error": "Missing supplier_name"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM invoices
        WHERE supplier_name = ?
        ORDER BY issued_at DESC
    """, (supplier_name,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])
