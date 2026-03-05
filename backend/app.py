from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load AI Models
print("Loading AI models...")

# Summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Text generation model for other modes
generator = pipeline("text-generation", model="gpt2")

print("Models loaded successfully.")


@app.route("/process", methods=["POST"])
def process_text():

    data = request.get_json()

    text = data.get("text", "")
    mode = data.get("mode", "summarize")

    if text.strip() == "":
        return jsonify({"result": "Please enter some text first."})

    try:

        # ---------------- SUMMARIZE ----------------
        if mode == "summarize":

            result = summarizer(
                text,
                max_length=120,
                min_length=30,
                do_sample=False
            )

            output = result[0]["summary_text"]

        # ---------------- EXPLAIN ----------------
        elif mode == "explain":

            prompt = f"Explain the following text in simple terms:\n{text}"

            result = generator(
                prompt,
                max_length=200,
                num_return_sequences=1
            )

            output = result[0]["generated_text"]

        # ---------------- IMPROVE WRITING ----------------
        elif mode == "improve":

            prompt = f"Improve the writing and clarity of this text:\n{text}"

            result = generator(
                prompt,
                max_length=200,
                num_return_sequences=1
            )

            output = result[0]["generated_text"]

        # ---------------- TRANSLATE TO SIMPLE ENGLISH ----------------
        elif mode == "translate":

            prompt = f"Rewrite the following text in very simple English:\n{text}"

            result = generator(
                prompt,
                max_length=200,
                num_return_sequences=1
            )

            output = result[0]["generated_text"]

        # ---------------- DEFAULT ----------------
        else:
            output = "Invalid mode selected."

        return jsonify({
            "result": output
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({
            "result": "Error processing request."
        })


@app.route("/")
def home():
    return "ReadEase AI Backend Running"


if __name__ == "__main__":
    app.run(debug=True)
