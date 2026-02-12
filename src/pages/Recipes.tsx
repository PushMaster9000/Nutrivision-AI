import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, Star, Clock, Flame, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import quinoaBowl from "@/assets/quinoa-bowl.jpg";
import grilledChicken from "@/assets/grilled-chicken.jpg";
import avocadoToast from "@/assets/avocado-toast.jpg";
import greekSalad from "@/assets/greek-salad.jpg";

const Recipes = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = ["All", "Vegetarian", "High Protein", "Low Calorie", "Quick & Easy"];

  const recipes = [
    {
      title: "Mediterranean Quinoa Bowl",
      image: quinoaBowl,
      calories: 420,
      protein: 15,
      difficulty: "Easy",
      rating: 4.8,
      tags: ["Vegetarian", "High Protein"],
    },
    {
      title: "Grilled Lemon Herb Chicken",
      image: grilledChicken,
      calories: 380,
      protein: 38,
      difficulty: "Medium",
      rating: 4.9,
      tags: ["High Protein", "Low Calorie"],
    },
    {
      title: "Avocado Toast Supreme",
      image: avocadoToast,
      calories: 320,
      protein: 12,
      difficulty: "Easy",
      rating: 4.7,
      tags: ["Vegetarian", "Quick & Easy"],
    },
    {
      title: "Greek Power Salad",
      image: greekSalad,
      calories: 280,
      protein: 8,
      difficulty: "Easy",
      rating: 4.6,
      tags: ["Vegetarian", "Low Calorie"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Recipe Recommendations</h1>
          <p className="text-muted-foreground text-lg mb-8">Healthy meals tailored to your goals</p>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search recipes..." 
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.toLowerCase())}
                  className={selectedFilter === filter.toLowerCase() ? "bg-gradient-primary" : ""}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {recipe.tags.map((tag, i) => (
                        <Badge key={i} className="bg-white/90 text-primary hover:bg-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-3">{recipe.title}</h3>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(recipe.rating) 
                              ? "fill-primary text-primary" 
                              : "text-muted"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({recipe.rating})
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{recipe.calories} cal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className="w-4 h-4 text-primary" />
                        <span>{recipe.protein}g protein</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      View Recipe
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;
