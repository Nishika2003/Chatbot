from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import json
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

app = Flask(__name__)
CORS(app)

model_name = "facebook/blenderbot-400M-distill"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
conversation_history = []

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    try:
        data = request.get_json()
        print('Received data:', data)  # Debugging statement
        input_text = data['prompt']

        #Conversation history string
        history = "\n".join(conversation_history)

        # Tokenizing the input text and history
        inputs = tokenizer.encode_plus(history, input_text, padding='longest', return_tensors="pt", max_length=512)

        #Response from the model
        outputs = model.generate(**inputs, max_length=60)

        # Decoding the response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

        # Adding interaction to conversation history
        conversation_history.append(input_text)
        conversation_history.append(response)

        return jsonify({"response": response})
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
