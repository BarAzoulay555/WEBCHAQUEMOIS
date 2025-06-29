from flask import Blueprint, request, jsonify
import sqlite3
import os
import requests

chat_bp = Blueprint("chat", __name__, url_prefix="/api/ai")

def get_project_data():
    db_path = os.path.join(os.path.dirname(__file__), '../database/db.sqlite3')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # שליפת ספקים
    cursor.execute("SELECT name, contact_name, phone, num_products, rating, reliability FROM suppliers")
    suppliers = cursor.fetchall()
    suppliers_info = "\n".join([
        f"{name} (איש קשר: {contact_name}, טלפון: {phone}, מספר מוצרים: {num_products}, דירוג: {rating}, אמינות: {reliability})"
        for name, contact_name, phone, num_products, rating, reliability in suppliers
    ])

    # שליפת מוצרים
    cursor.execute("SELECT name, quantity, reorder_level FROM products")
    products = cursor.fetchall()
    products_info = "\n".join([
        f"{name} - כמות: {quantity}, רמת חידוש: {reorder_level}"
        for name, quantity, reorder_level in products
    ])

    # שליפת הזמנות רכש
    cursor.execute("SELECT id, product_id, quantity, status FROM purchase_orders")
    orders = cursor.fetchall()
    orders_info = "\n".join([
        f"הזמנה #{order_id} - מוצר ID: {product_id}, כמות: {quantity}, סטטוס: {status}"
        for order_id, product_id, quantity, status in orders
    ])

    conn.close()
    return suppliers_info, products_info, orders_info

@chat_bp.route("/chat", methods=["POST"])
def chat_with_ai():
    data = request.get_json()
    messages = data.get("messages", [])

    suppliers_info, products_info, orders_info = get_project_data()

    system_prompt = (
        "אתה עוזר חכם באתר CHAQUEMOIS, מערכת לניהול מלאי בגדי יוקרה.\n\n"
        "מידע עדכני מתוך המערכת לשימושך במענה:\n"
        f"🔹 ספקים:\n{suppliers_info}\n\n"
        f"🔹 מלאי מוצרים:\n{products_info}\n\n"
        f"🔹 הזמנות רכש:\n{orders_info}\n\n"
        "ענה על שאלות המשתמש בהתבסס על המידע הזה בלבד, בצורה תמציתית ובעברית בלבד."
    )

    prompt = system_prompt + "\n\n"
    for msg in messages:
        role = "משתמש" if msg["role"] == "user" else "AI"
        prompt += f"{role}: {msg['content']}\n"
    prompt += "AI:"

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )
        response.raise_for_status()
        result = response.json()
        answer = result.get("response", "").strip()

        if not answer:
            return jsonify({"response": "לא התקבלה תגובה מהמודל. נסה שוב."}), 500

        return jsonify({"response": answer})

    except requests.exceptions.Timeout:
        return jsonify({"response": "הבקשה ל-Ollama נמשכה יותר מדי זמן (timeout). אנא נסה שוב."}), 504

    except requests.exceptions.RequestException as e:
        return jsonify({"response": f"שגיאה בחיבור ל-Ollama: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"response": f"שגיאה בשרת: {str(e)}"}), 500
