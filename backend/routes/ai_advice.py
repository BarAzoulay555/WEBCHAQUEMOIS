from flask import Blueprint, request, jsonify
import subprocess
import os
import traceback
import re

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

        # קביעת שפת הפרומפט לפי הקלט עם בקשה למענה בלי אימוג'ים וצורות
        if contains_hebrew(name):
            prompt = (
                f"אני מנהל חנות בגדים. קיבלתי מוצר חדש בשם '{name}' עם כמות {quantity} ומחיר {price} ש״ח. "
                "האם כדאי להזמין אותו מחדש? נתח לי את זה בקצרה כמו יועץ עסקי מקצועי. "
                "ענה לי בעברית בלבד, בלי צורות או אימוג'ים."
            )
        else:
            prompt = (
                f"I'm a clothing store manager. I received a new product named '{name}' with a quantity of {quantity} "
                f"and a price of {price} NIS. Should I re-order it? Analyze briefly like a professional business advisor. "
                "Answer in English only, without any emojis or special characters."
            )

        print("DEBUG: prompt:", prompt)

        # הפעלת ollama עם קידוד תקין ו-timeout
        process = subprocess.Popen(
            ["ollama", "run", "mistral"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            env=dict(os.environ, PYTHONIOENCODING='utf-8')
        )

        stdout_data, stderr_data = process.communicate(input=prompt, timeout=120)

        print("DEBUG: return code:", process.returncode)
        print("DEBUG: stdout:", stdout_data)
        print("DEBUG: stderr:", stderr_data)

        # טיפול במקרה של שגיאה
        if process.returncode != 0:
            return jsonify({"error": stderr_data}), 500

        output = stdout_data.strip() if stdout_data else "אין תגובה מהמודל"
        output = clean_output(output)

        return jsonify({"recommendation": output})

    except Exception as e:
        print("DEBUG: exception:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
