import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Camera, BookOpen, History, TrendingUp, Flame, Drumstick, Target, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import avocadoToast from "@/assets/avocado-toast.jpg";
import salmon from "@/assets/salmon.jpg";
import greekSalad from "@/assets/greek-salad.jpg";

const Dashboard = () => {
  const recentAnalyses = [
    { name: "Avocado Toast", time: "2 hours ago", calories: 320, protein: 12, image: avocadoToast },
    { name: "Grilled Salmon", time: "Yesterday", calories: 450, protein: 42, image: salmon },
    { name: "Greek Salad", time: "2 days ago", calories: 280, protein: 8, image: greekSalad },
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
          <h1 className="text-4xl font-bold mb-2">Hello, Sebastian Biju! 👋</h1>
          <p className="text-muted-foreground text-lg mb-8">Here's your nutrition overview</p>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Camera, label: "Total Scans", value: "127", color: "text-primary" },
              { icon: Flame, label: "Avg Calories/Day", value: "1,850", color: "text-orange-500" },
              { icon: TrendingUp, label: "Streak Days", value: "15", color: "text-success" },
              { icon: BookOpen, label: "Recipes Saved", value: "23", color: "text-secondary" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/upload">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-primary group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Analyze Food</p>
                      <p className="text-sm text-muted-foreground">Upload or capture</p>
                    </div>
                  </div>
                </Card>
              </Link>
              
              <Link to="/recipes">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Browse Recipes</p>
                      <p className="text-sm text-muted-foreground">Personalized for you</p>
                    </div>
                  </div>
                </Card>
              </Link>
              
              <Link to="/history">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent group-hover:scale-110 transition-transform">
                      <History className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">View History</p>
                      <p className="text-sm text-muted-foreground">Track progress</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Recent Analyses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {recentAnalyses.map((item, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.time}</p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{item.calories} cal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Drumstick className="w-4 h-4 text-primary" />
                        <span>{item.protein}g protein</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* AI Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6 bg-accent border-accent">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-accent-foreground">AI Tip of the Day</h3>
                  <p className="text-sm text-accent-foreground/80">
                    Based on your recent meals, try adding more leafy greens to increase your iron intake. 
                    Check out our Mediterranean Quinoa Bowl recipe for inspiration!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
