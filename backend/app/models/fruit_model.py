"""
Mock ML model for fruit recognition.
This is a placeholder that returns fixed predictions.
Can be easily replaced with a real ML model (TensorFlow, PyTorch, etc.)
"""

from typing import Tuple
import random


class FruitRecognitionModel:
    """
    Mock fruit recognition model.
    
    Current behavior: Returns random fruit from the supported list.
    
    Future extension:
    - Load a pre-trained CNN model (e.g., ResNet, MobileNet)
    - Preprocess the input image
    - Run inference on the model
    - Return the predicted class and confidence score
    
    Example of real implementation:
    ```
    import tensorflow as tf
    from tensorflow.keras.preprocessing import image
    
    class FruitRecognitionModel:
        def __init__(self, model_path):
            self.model = tf.keras.models.load_model(model_path)
            self.class_names = ['apple', 'banana', 'orange', ...]
        
        def predict(self, image_path):
            img = image.load_img(image_path, target_size=(224, 224))
            img_array = image.img_to_array(img) / 255.0
            prediction = self.model.predict(np.expand_dims(img_array, axis=0))
            class_idx = np.argmax(prediction)
            return self.class_names[class_idx], prediction[0][class_idx]
    ```
    """
    
    # Supported fruits for recognition
    SUPPORTED_FRUITS = [
        "apple",
        "banana",
        "orange",
        "carrot",
        "broccoli",
        "strawberry"
    ]
    
    def __init__(self):
        """Initialize the model."""
        self.model = None
        print("✓ Fruit Recognition Model initialized (mock mode)")
    
    def predict(self, image_base64: str = None) -> Tuple[str, float]:
        """
        Predict fruit from image.
        
        Args:
            image_base64: Base64 encoded image string (optional for mock)
        
        Returns:
            Tuple[str, float]: (predicted_fruit_name, confidence_score)
        
        Current behavior:
            - Returns a random fruit from SUPPORTED_FRUITS
            - Returns a confidence between 0.85 and 1.0
        
        Future behavior:
            - Decode the base64 image
            - Preprocess the image
            - Run ML model inference
            - Return the predicted fruit and actual confidence
        """
        # Mock prediction logic
        predicted_fruit = random.choice(self.SUPPORTED_FRUITS)
        confidence = round(random.uniform(0.85, 1.0), 3)
        
        print(f"[MOCK] Predicted: {predicted_fruit} (confidence: {confidence})")
        return predicted_fruit, confidence
    
    def get_supported_fruits(self) -> list:
        """Get list of fruits the model can recognize."""
        return self.SUPPORTED_FRUITS


# Global model instance
_model_instance = None


def get_model() -> FruitRecognitionModel:
    """
    Get or create the fruit recognition model instance.
    Uses singleton pattern to avoid reloading model multiple times.
    """
    global _model_instance
    if _model_instance is None:
        _model_instance = FruitRecognitionModel()
    return _model_instance
