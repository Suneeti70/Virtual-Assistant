from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Real summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


@app.route("/process", methods=["POST"])
def process_text():

    data = request.get_json()
    text = data.get("text", "")
    mode = data.get("mode", "summarize")

    if text.strip() == "":
        return jsonify({"result": "Please enter some text."})

    if mode == "summarize":

        result = summarizer(
            text,
            max_length=120,
            min_length=30,
            do_sample=False
        )

        output = result[0]["summary_text"]

    elif mode == "explain":

        prompt = f"Explain this text simply:\n{text}"

        generator = pipeline("text-generation", model="gpt2")
        result = generator(prompt, max_length=200)

        output = result[0]["generated_text"]

    elif mode == "improve":

        prompt = f"Improve the writing of this text:\n{text}"

        generator = pipeline("text-generation", model="gpt2")
        result = generator(prompt, max_length=200)

        output = result[0]["generated_text"]

    elif mode == "translate":

        prompt = f"Rewrite this in simple English:\n{text}"

        generator = pipeline("text-generation", model="gpt2")
        result = generator(prompt, max_length=200)

        output = result[0]["generated_text"]

    else:
        output = "Invalid mode."

    return jsonify({"result": output})


@app.route("/")
def home():
    return "ReadEase Backend Running"


if __name__ == "__main__":
    app.run(debug=True)
