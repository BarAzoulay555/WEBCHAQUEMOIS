import requests

def ollama_runner(prompt: str, model: str = "llama3", timeout: int = 60):
    try:
        print(f"DEBUG: Sending prompt to Ollama: {prompt}")
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            timeout=timeout
        )
        print(f"DEBUG: Ollama response status code: {response.status_code}")
        print(f"DEBUG: Ollama raw response: {response.text}")

        response.raise_for_status()
        result = response.json()
        return result.get("response", "").strip()

    except requests.exceptions.Timeout:
        print("⏰ המודל לא הגיב בזמן – timeout")
        return None

    except requests.exceptions.RequestException as e:
        print(f"🚨 שגיאה בחיבור ל-Ollama: {str(e)}")
        return None

    except Exception as e:
        print(f"🚨 שגיאה כללית: {str(e)}")
        return None
