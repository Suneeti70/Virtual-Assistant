from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

generator = pipeline("text-generation", model="gpt2")

@app.route("/summarize", methods=["POST"])
def summarize():

    data = request.json
    text = data.get("text", "")

    prompt = f"Summarize this in simple language:\n{text}\nSummary:"

    result = generator(
        prompt,
        max_length=80,
        num_return_sequences=1,
        temperature=0.5,
        repetition_penalty=2.0,
        do_sample=True
    )

    generated = result[0]["generated_text"]

    summary = generated.replace(prompt, "").strip()

    return jsonify({"summary": summary})


if __name__ == "__main__":
    app.run(debug=True)
