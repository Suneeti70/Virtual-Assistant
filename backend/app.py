from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

summarizer = pipeline("text-generation", model="gpt2")

@app.route("/")
def home():
    return "AI Assistant Backend Running"

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text", "")

    prompt = f"Summarize this text in simple language:\n{text}"

    result = summarizer(prompt, max_length=150)

    summary = result[0]["generated_text"]

    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(debug=True)
