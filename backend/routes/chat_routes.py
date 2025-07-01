from flask import Blueprint, request, jsonify
import sqlite3
import os
import requests

chat_bp = Blueprint("chat", __name__, url_prefix="/api/ai")

MAX_RESPONSE_LENGTH = 1500  # Increased for better responses
MAX_PROMPT_LENGTH = 4000    # Allowing a longer context

DB_PATH = os.path.join(os.path.dirname(__file__), '../database/db.sqlite3')

# === Utility: fetch limited, relevant data ===
def get_project_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Fetch top 5 rated suppliers
    cursor.execute("""
        SELECT name, contact_name, phone, num_products, rating, reliability
        FROM suppliers
        ORDER BY rating DESC LIMIT 5
    """)
    suppliers = cursor.fetchall()
    suppliers_info = "\n".join([
        f"{name} (Contact: {contact_name}, Phone: {phone}, Products: {num_products}, Rating: {rating}, Reliability: {reliability})"
        for name, contact_name, phone, num_products, rating, reliability in suppliers
    ])

    # Fetch products with low stock
    cursor.execute("""
        SELECT name, quantity, reorder_level
        FROM products
        WHERE quantity < reorder_level
        LIMIT 10
    """)
    products = cursor.fetchall()
    products_info = "\n".join([
        f"{name} - Quantity: {quantity}, Reorder Level: {reorder_level}"
        for name, quantity, reorder_level in products
    ])

    # Fetch last 5 orders
    cursor.execute("""
        SELECT id, product_id, quantity, status
        FROM purchase_orders
        ORDER BY created_at DESC
        LIMIT 5
    """)
    orders = cursor.fetchall()
    orders_info = "\n".join([
        f"Order #{order_id} - Product ID: {product_id}, Quantity: {quantity}, Status: {status}"
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
        "You are a smart assistant for the CHAQUEMOIS luxury clothing inventory management system.\n\n"
        "You will answer user questions precisely using ONLY the structured data below.\n"
        "If the data is not available, respond that the data is not available.\n"
        "Respond in English only.\n\n"
        f"Top Suppliers:\n{suppliers_info}\n\n"
        f"Low Stock Products:\n{products_info}\n\n"
        f"Recent Purchase Orders:\n{orders_info}\n\n"
    )

    prompt = system_prompt + "\n"
    for msg in messages:
        role = "User" if msg["role"] == "user" else "AI"
        prompt += f"{role}: {msg['content']}\n"
    prompt += "AI:"

    if len(prompt) > MAX_PROMPT_LENGTH:
        prompt = prompt[:MAX_PROMPT_LENGTH] + "\n\n(Note: Context was truncated due to length limit.)"

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
            return jsonify({"response": "No response received from the model. Please try again."}), 500

        if len(answer) > MAX_RESPONSE_LENGTH:
            answer = answer[:MAX_RESPONSE_LENGTH] + "..."

        return jsonify({"response": answer})

    except requests.exceptions.Timeout:
        return jsonify({"response": "The request to Ollama timed out. Please try again."}), 504

    except requests.exceptions.RequestException as e:
        return jsonify({"response": f"Connection error to Ollama: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"response": f"Server error: {str(e)}"}), 500
