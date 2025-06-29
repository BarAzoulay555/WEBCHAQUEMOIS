import subprocess

def run_ollama_mistral(prompt):
    result = subprocess.run(
        ["ollama", "run", "mistral", prompt],
        capture_output=True,
        text=True
    )
    return result.stdout.strip()
