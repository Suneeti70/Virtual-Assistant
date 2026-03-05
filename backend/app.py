from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load AI summarizer model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"summary": "No input provided"})

    result = summarizer(text, max_length=130, min_length=30, do_sample=False)

    return jsonify({
        "summary": result[0]["summary_text"]
    })


if __name__ == "__main__":
    app.run(debug=True)
