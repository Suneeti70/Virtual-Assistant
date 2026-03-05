from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

summarizer = pipeline("summarization")

@app.route("/ai", methods=["POST"])
def ai():
    data = request.json
    text = data.get("text", "")

    if text == "":
        return jsonify({"response": "No input text provided"})

    summary = summarizer(text, max_length=60, min_length=20, do_sample=False)

    return jsonify({"response": summary[0]["summary_text"]})

if __name__ == "__main__":
    app.run(debug=True)
