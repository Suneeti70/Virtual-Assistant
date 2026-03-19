from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

print("Loading AI models...")


summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


generator = pipeline("text2text-generation", model="google/flan-t5-base")

print("Models loaded successfully.")


@app.route("/process", methods=["POST"])
def process_text():

    data = request.get_json()

    text = data.get("text", "")
    mode = data.get("mode", "summarize")

    if text.strip() == "":
        return jsonify({"result": "Please enter some text first."})

    try:

        if mode == "summarize":

            result = summarizer(
                text,
                max_length=120,
                min_length=30,
                do_sample=False
            )

            output = result[0]["summary_text"]


        elif mode == "explain":

            prompt = f"Explain this in simple terms:\n{text}"

            result = generator(
                prompt,
                max_length=150
            )

            output = result[0]["generated_text"]

        elif mode == "improve":

            prompt = f"Improve the clarity and grammar of this text:\n{text}"

            result = generator(
                prompt,
                max_length=150
            )

            output = result[0]["generated_text"]


        elif mode == "translate":

            prompt = f"Rewrite this in very simple English:\n{text}"

            result = generator(
                prompt,
                max_length=150
            )

            output = result[0]["generated_text"]


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
