from flask import Blueprint, jsonify
from backend.database.db import get_db_connection

db_check_bp = Blueprint("db_check", __name__)

@db_check_bp.route("/api/db-check", methods=["GET"])
def check_all_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    result = {}
    tables = ["products", "suppliers", "purchase_orders", "invoices"]

    for table in tables:
        try:
            cursor.execute(f"SELECT *, datetime('now', 'localtime') as checked_at FROM {table}")
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            result[table] = [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            result[table] = f"שגיאה בקריאת טבלה {table}: {str(e)}"

    conn.close()
    return jsonify(result)
