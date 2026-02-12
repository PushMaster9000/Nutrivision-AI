import apiClient from "./apiClient";

export interface FoodInfo {
  name: string;
  type: string;
  calories_per_100g: number;
  sugar_level: string;
  health_tags: string[];
}

export interface Recipe {
  food: string;
  recipe_name: string;
  appliances: string[];
  health_tags: string[];
  steps: string[];
}

export interface PredictionRequest {
  image_base64?: string | null;
  health_constraints?: string[];
  available_appliances?: string[];
}

export interface PredictionResponse {
  detected_food: string;
  confidence: number;
  food_info: FoodInfo;
  matching_recipes: Recipe[];
}

class FoodService {
  // Predict food from image
  async predictFood(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await apiClient.post<PredictionResponse>("/predict", request);
      return response.data;
    } catch (error) {
      console.error("Error predicting food:", error);
      throw error;
    }
  }

  // Get all foods
  async getAllFoods(): Promise<FoodInfo[]> {
    try {
      const response = await apiClient.get<FoodInfo[]>("/foods");
      return response.data;
    } catch (error) {
      console.error("Error fetching foods:", error);
      throw error;
    }
  }

  // Get specific food info
  async getFoodInfo(foodName: string): Promise<FoodInfo> {
    try {
      const response = await apiClient.get<FoodInfo>(`/foods/${foodName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching food info for ${foodName}:`, error);
      throw error;
    }
  }

  // Get all recipes
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const response = await apiClient.get<Recipe[]>("/recipes");
      return response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  }

  // Get recipes for a specific food
  async getRecipesForFood(
    foodName: string,
    appliances?: string[],
    healthTags?: string[]
  ): Promise<Recipe[]> {
    try {
      const params = new URLSearchParams();
      if (appliances && appliances.length > 0) {
        params.append("appliances", appliances.join(","));
      }
      if (healthTags && healthTags.length > 0) {
        params.append("health_tags", healthTags.join(","));
      }

      const response = await apiClient.get<Recipe[]>(
        `/recipes/${foodName}${params.toString() ? `?${params.toString()}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipes for ${foodName}:`, error);
      throw error;
    }
  }

  // Get low-calorie foods
  async getLowCalorieFoods(maxCalories: number = 50): Promise<FoodInfo[]> {
    try {
      const response = await apiClient.get<FoodInfo[]>(
        `/low-calorie?max_calories=${maxCalories}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching low-calorie foods:", error);
      throw error;
    }
  }

  // Get low-sugar foods (diabetic-friendly)
  async getLowSugarFoods(): Promise<FoodInfo[]> {
    try {
      const response = await apiClient.get<FoodInfo[]>("/low-sugar");
      return response.data;
    } catch (error) {
      console.error("Error fetching low-sugar foods:", error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string; version: string }> {
    try {
      const response = await apiClient.get<{ status: string; database: string; version: string }>(
        "/health",
        { baseURL: "http://localhost:8000" } // Override for health check
      );
      return response.data;
    } catch (error) {
      console.error("Error checking health:", error);
      throw error;
    }
  }
}

export default new FoodService();
