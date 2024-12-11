import sys
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import requests
import os
import json

# Suppress TensorFlow info and warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')

# Define the model path
model_path = "C:\\Users\\avana\\OneDrive\\Desktop\\plant_disease_detection\\server\\models\\leaf_classifier_model.keras"

# Load the model (without a success message)
try:
    model = tf.keras.models.load_model(model_path)
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {e}"}))
    sys.exit(1)

# Hugging Face API for plant disease classification
API_URL = "https://api-inference.huggingface.co/models/ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease"
headers = {"Authorization": "Bearer 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"}

# Function to call Hugging Face API
def query_huggingface(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)

    if response.status_code == 200:
        try:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result
            else:
                return [{"label": "Unknown", "score": 0}]
        except ValueError:
            return [{"label": "Unknown", "score": 0}]
    else:
        return [{"label": "Unknown", "score": 0}]

# Function to classify an image using TensorFlow model and Hugging Face
def classify_image(img_path):
    img_height, img_width = 224, 224
    img = image.load_img(img_path, target_size=(img_height, img_width))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array, verbose=0)
    if prediction[0] <= 0.5:
        huggingface_result = query_huggingface(img_path)
        return "Leaf", huggingface_result
    else:
        return "Not a leaf", []

# Main execution logic
if __name__ == "__main__":
    img_path = sys.argv[1]
    result, huggingface_result = classify_image(img_path)

    if result == "Not a leaf":
        print(json.dumps({"output": "Not a leaf"}))
    else:
        if huggingface_result and isinstance(huggingface_result, list):
            first_prediction = huggingface_result[0]
            label = first_prediction.get('label', 'Unknown')
            score = first_prediction.get('score', 0)
            response = {
                "disease_name": label,
                "confidence_score": round(score, 4),
                "output": f"Plant Disease: {label}, Confidence Score: {score:.4f}"
            }
            print(json.dumps(response))
        else:
            print(json.dumps({"error": "No valid predictions received from the API."}))
