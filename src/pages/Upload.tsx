import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Upload as UploadIcon, Camera, Image, Lightbulb, X, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PredictionResponse {
  detected_food: string;
  confidence: number;
  food_info: {
    name: string;
    type: string;
    calories_per_100g: number;
    sugar_level: string;
    health_tags: string[];
  };
  matching_recipes: Array<{
    food: string;
    recipe_name: string;
    appliances: string[];
    health_tags: string[];
    steps: string[];
  }>;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [selectedHealthTags, setSelectedHealthTags] = useState<string[]>([]);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll chat to bottom
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const popularFoods = [
    { name: "Pizza", emoji: "🍕" },
    { name: "Salad", emoji: "🥗" },
    { name: "Burger", emoji: "🍔" },
    { name: "Pasta", emoji: "🍝" },
  ];

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            handleFileSelect(file);
            closeCameraAndCleanup();
          }
        }, "image/jpeg");
      }
    }
  };

  const closeCameraAndCleanup = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setPreview(null);
    closeCameraAndCleanup();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPrediction(null);
  };

  const handleAnalyzeFood = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    try {
      // For now, create a mock response to test the UI
      const mockPrediction: PredictionResponse = {
        detected_food: "apple",
        confidence: 0.92,
        food_info: {
          name: "apple",
          type: "fruit",
          calories_per_100g: 52,
          sugar_level: "medium",
          health_tags: ["high-fiber", "antioxidants", "low-calorie"],
        },
        matching_recipes: [
          {
            food: "apple",
            recipe_name: "Fresh Apple Salad",
            appliances: ["knife", "cutting-board"],
            health_tags: ["healthy", "quick"],
            steps: ["Dice apples", "Mix with greens", "Serve immediately"],
          },
        ],
      };

      setPrediction(mockPrediction);

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Great! I detected ${mockPrediction.detected_food} with ${Math.round(
          mockPrediction.confidence * 100
        )}% confidence. Here are some recipes for you!`,
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error analyzing food:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Sorry, I couldn't analyze the image. Please try again with a clearer photo.",
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm here to help with nutrition information about your food. Please upload an image for me to analyze, and feel free to ask any questions!",
        sender: "ai",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 500);
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Analyze Your Food</h1>
          <p className="text-muted-foreground text-lg mb-12">Upload a photo to get instant nutrition insights</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="md:col-span-2">
              {preview ? (
                // Preview of uploaded image
                <Card className="p-6 relative">
                  <button
                    onClick={resetUpload}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-full max-h-96 flex items-center justify-center mb-6 bg-slate-100 rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="max-w-full max-h-96 object-contain" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>File:</strong> {uploadedFile?.name}
                  </p>

                  {!prediction && (
                    <>
                      <div className="mb-4 space-y-3">
                        <div>
                          <label className="text-sm font-medium block mb-2">Health Preferences</label>
                          <div className="flex flex-wrap gap-2">
                            {["low-sugar", "low-calorie", "vegan"].map((tag) => (
                              <button
                                key={tag}
                                onClick={() =>
                                  setSelectedHealthTags((prev) =>
                                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                                  )
                                }
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                  selectedHealthTags.includes(tag)
                                    ? "bg-gradient-primary text-white"
                                    : "bg-muted text-muted-foreground hover:bg-border"
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium block mb-2">Available Appliances</label>
                          <div className="flex flex-wrap gap-2">
                            {["blender", "oven", "knife", "mixer"].map((appliance) => (
                              <button
                                key={appliance}
                                onClick={() =>
                                  setSelectedAppliances((prev) =>
                                    prev.includes(appliance)
                                      ? prev.filter((a) => a !== appliance)
                                      : [...prev, appliance]
                                  )
                                }
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                  selectedAppliances.includes(appliance)
                                    ? "bg-gradient-primary text-white"
                                    : "bg-muted text-muted-foreground hover:bg-border"
                                }`}
                              >
                                {appliance}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleAnalyzeFood}
                        disabled={isLoading}
                        className="w-full bg-gradient-primary hover:opacity-90 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Food"
                        )}
                      </Button>
                    </>
                  )}

                  {prediction && (
                    <div className="space-y-6">
                      {/* Prediction Result */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-lg text-green-900 mb-2">
                          Detected: <span className="capitalize">{prediction.detected_food}</span>
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 bg-green-200 rounded-full overflow-hidden h-2">
                            <div
                              className="bg-gradient-primary h-full"
                              style={{ width: `${prediction.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-green-900">
                            {Math.round(prediction.confidence * 100)}% Confident
                          </span>
                        </div>
                      </div>

                      {/* Food Information */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3">Nutritional Info</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-blue-700">Calories (per 100g)</p>
                            <p className="text-xl font-bold text-blue-900">{prediction.food_info.calories_per_100g}</p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-700">Sugar Level</p>
                            <p className="text-lg font-semibold text-blue-900 capitalize">
                              {prediction.food_info.sugar_level}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-blue-700 mb-2">Health Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {prediction.food_info.health_tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recipes */}
                      {prediction.matching_recipes.length > 0 && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <h4 className="font-semibold text-orange-900 mb-3">
                            Suggested Recipes ({prediction.matching_recipes.length})
                          </h4>
                          <div className="space-y-3">
                            {prediction.matching_recipes.slice(0, 3).map((recipe, idx) => (
                              <div key={idx} className="p-3 bg-white rounded border border-orange-100">
                                <p className="font-medium text-orange-900">{recipe.recipe_name}</p>
                                <p className="text-sm text-orange-700 mt-1">
                                  {recipe.steps.join(" → ")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={resetUpload}>
                          Try Another Image
                        </Button>
                        <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                          Save Result
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ) : isCameraOpen ? (
                // Camera view
                <Card className="p-6">
                  <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full aspect-video"
                    />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-4">
                    <Button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Photo
                    </Button>
                    <Button
                      onClick={closeCameraAndCleanup}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              ) : (
                // Default upload area
                <Card 
                  className={`p-12 border-2 border-dashed transition-all ${
                    isDragging ? "border-primary bg-accent" : "border-border"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                      <UploadIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">Drop your food image here</h2>
                    <p className="text-muted-foreground mb-6">or click to browse files</p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        className="bg-gradient-primary hover:opacity-90"
                        onClick={handleChooseFile}
                      >
                        <Image className="w-5 h-5 mr-2" />
                        Choose File
                      </Button>
                      <Button variant="outline" onClick={handleTakePhoto}>
                        <Camera className="w-5 h-5 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Supported formats: JPG, PNG, HEIC (Max 10MB)
                    </p>
                  </div>
                </Card>
              )}

              {/* Popular Foods */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Try With Popular Foods</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {popularFoods.map((food, index) => (
                    <Card 
                      key={index}
                      className="p-4 text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    >
                      <div className="text-4xl mb-2">{food.emoji}</div>
                      <p className="text-sm font-medium">{food.name}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Chat Section */}
              <div className="mt-8">
                <Card className="p-6 flex flex-col h-96">
                  <h3 className="font-semibold mb-4">Chat with Nutrition AI</h3>
                  
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-muted/30 rounded-lg p-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p className="text-center text-sm">Start a conversation! Ask about nutrition, ingredients, or food analysis.</p>
                      </div>
                    ) : (
                      <>
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                                msg.sender === "user"
                                  ? "bg-gradient-primary text-white"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleChatKeyPress}
                      className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-primary hover:opacity-90 px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Tips Sidebar */}
            <div>
              <Card className="p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Tips for Best Results</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Good Lighting:</strong> Use natural or bright light for clearer images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Clear View:</strong> Capture the entire dish from above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Close Distance:</strong> Get close enough to see details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Single Dish:</strong> One food item per photo works best</span>
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-accent rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    <strong>Pro Tip:</strong> Include a common object (like a fork) for better portion size estimation!
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Upload;
