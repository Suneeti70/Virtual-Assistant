from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load AI models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
translator = pipeline("translation_en_to_fr")

@app.route("/ai", methods=["POST"])
def ai():
    data = request.json
    text = data.get("text", "")

    if text.lower().startswith("summarize:"):
        content = text.replace("summarize:", "").strip()
        result = summarizer(content, max_length=60, min_length=20, do_sample=False)
        return jsonify({"response": result[0]["summary_text"]})

    elif text.lower().startswith("explain:"):
        content = text.replace("explain:", "").strip()
        result = summarizer("Explain in simple words: " + content, max_length=80, min_length=30)
        return jsonify({"response": result[0]["summary_text"]})

    elif text.lower().startswith("simplify:"):
        content = text.replace("simplify:", "").strip()
        result = summarizer("Simplify this text: " + content, max_length=60)
        return jsonify({"response": result[0]["summary_text"]})

    elif text.lower().startswith("translate:"):
        content = text.replace("translate:", "").strip()
        result = translator(content)
        return jsonify({"response": result[0]["translation_text"]})

    else:
        return jsonify({"response": "Please start with summarize:, explain:, simplify:, or translate:"})

if __name__ == "__main__":
    app.run(debug=True)
