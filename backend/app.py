from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load AI model
generator = pipeline("text-generation", model="gpt2")


@app.route("/process", methods=["POST"])
def process_text():

    data = request.get_json()

    text = data.get("text", "")
    mode = data.get("mode", "summarize")

    if text.strip() == "":
        return jsonify({"result": "Please enter some text first."})

    # Different AI prompts for different modes
    if mode == "summarize":
        prompt = f"Summarize the following text in simple language:\n{text}"

    elif mode == "explain":
        prompt = f"Explain the following text in very simple terms:\n{text}"

    elif mode == "improve":
        prompt = f"Improve the writing and clarity of this text:\n{text}"

    elif mode == "translate":
        prompt = f"Rewrite the following text in very simple English:\n{text}"

    else:
        prompt = text

    # Generate AI response
    result = generator(
        prompt,
        max_length=200,
        num_return_sequences=1
    )

    output = result[0]["generated_text"]

    return jsonify({
        "result": output
    })


@app.route("/")
def home():
    return "ReadEase AI Backend Running"


if __name__ == "__main__":
    app.run(debug=True)
