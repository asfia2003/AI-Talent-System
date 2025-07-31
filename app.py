from flask import Flask, request, jsonify
from joblib import load
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained model
model = load('model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("📩 Received data:", data)

        age = data.get('age')
        salary = data.get('salary')
        workload = data.get('workload')
        tenure = data.get('tenure')
        performance_score = data.get('performance_score')

        print("🎯 Inputs:", age, salary, workload, tenure, performance_score)

        # ✅ Input validation
        if None in [age, salary, workload, tenure, performance_score]:
            return jsonify({'error': 'Missing or invalid input fields'}), 400

        features = [age, salary, workload, tenure, performance_score]
        predicted_class = model.predict([features])[0]

        # 🧠 AI Suggestion logic
        if predicted_class == "At Risk":
            if performance_score < 5:
                suggestion = "Skill improvement"
            elif workload > 70:
                suggestion = "Wellness session"
            elif 2 <= tenure <= 5:
                suggestion = "Leadership course"
            elif salary < 3000:
                suggestion = "Offer growth opportunities"
            else:
                suggestion = "Offer growth opportunities"
        else:
            suggestion = "Wellness session" if workload > 80 else "Maintain engagement"

        return jsonify({
            "satisfaction": predicted_class,
            "suggested_action": suggestion
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
