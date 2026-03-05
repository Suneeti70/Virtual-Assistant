from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

generator = pipeline("text-generation", model="gpt2")

@app.route("/process", methods=["POST"])
def process():

    data = request.json
    text = data.get("text", "")
    mode = data.get("mode", "summarize")

    if mode == "summarize":
        prompt = f"Summarize the following text in simple language:\n{text}"

    elif mode == "explain":
        prompt = f"Explain this text in very simple terms for a beginner:\n{text}"

    elif mode == "improve":
        prompt = f"Rewrite this text in a more professional and clear way:\n{text}"

    elif mode == "translate":
        prompt = f"Rewrite this text in simple English:\n{text}"

    else:
        prompt = text

    result = generator(prompt, max_length=200, num_return_sequences=1)

    response = result[0]["generated_text"]

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
