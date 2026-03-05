from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

summarizer = pipeline("text-generation", model="gpt2")

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text", "")

    prompt = f"Summarize this text in simple language:\n{text}\nSummary:"

    result = summarizer(
        prompt,
        max_length=120,
        do_sample=False
    )

    generated = result[0]["generated_text"]

    summary = generated.split("Summary:")[-1].strip()

    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(debug=True)
