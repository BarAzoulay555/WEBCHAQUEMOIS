from flask import Blueprint, request, jsonify
import os
import re
import traceback
from backend.ai.ollama_runner import ollama_runner  # ← שימוש בפונקציה החיצונית

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

def contains_hebrew(text):
    return bool(re.search(r'[\u0590-\u05FF]', text))

def clean_output(text):
    # מסיר תווים מיוחדים ואימוג'ים, משאיר רק אותיות, מספרים, רווחים וסימני פיסוק נפוצים
    cleaned = re.sub(r'[^\w\s.,;:\-!?א-תA-Za-z0-9]', '', text)
    return cleaned.strip()

@ai_bp.route('/advice', methods=['POST'])
def get_ai_recommendation():
    try:
        # קריאת הנתונים מהבקשה
        data = request.get_json()
        print("DEBUG: received data:", data)

        name = data.get("name", "")
        quantity = data.get("quantity", 0)
        price = data.get("price", 0)

        # יצירת הפרומפט לפי השפה
        if contains_hebrew(name):
            prompt = (
                f"אני מנהל חנות בגדים. קיבלתי מוצר חדש בשם '{name}' עם כמות {quantity} ומחיר {price} ש״ח. "
                "האם כדאי להזמין אותו מחדש? נתח לי את זה בקצרה כמו יועץ עסקי מקצועי. "
            )
        else:
            prompt = (
                f"I'm a clothing store manager. I received a new product named '{name}' with a quantity of {quantity} "
                f"and a price of {price} NIS. Should I re-order it? Analyze briefly like a professional business advisor. "
                "Answer in English only, without any emojis or special characters."
            )

        print("DEBUG: prompt:", prompt)

        # הרצת המודל דרך הפונקציה החיצונית
        output = ollama_runner(prompt, model="llama3", timeout=300)

        if not output:
            return jsonify({"error": "❌ לא התקבלה תגובה מהמודל"}), 500

        cleaned = clean_output(output)
        return jsonify({"recommendation": cleaned})

    except Exception as e:
        print("DEBUG: exception:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
