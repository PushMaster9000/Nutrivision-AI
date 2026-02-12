import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Trash2, Download, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const History = () => {
  const [period, setPeriod] = useState("week");

  const chartData = [
    { day: "Mon", calories: 1850 },
    { day: "Tue", calories: 1920 },
    { day: "Wed", calories: 1780 },
    { day: "Thu", calories: 2050 },
    { day: "Fri", calories: 1890 },
    { day: "Sat", calories: 2150 },
    { day: "Sun", calories: 1950 },
  ];

  const historyItems = [
    { food: "Avocado Toast", date: "Jan 15, 2025", time: "8:30 AM", calories: 320, protein: 12, confidence: 95 },
    { food: "Grilled Salmon", date: "Jan 14, 2025", time: "7:00 PM", calories: 450, protein: 42, confidence: 92 },
    { food: "Greek Salad", date: "Jan 14, 2025", time: "12:30 PM", calories: 280, protein: 8, confidence: 89 },
    { food: "Quinoa Bowl", date: "Jan 13, 2025", time: "1:00 PM", calories: 420, protein: 15, confidence: 94 },
    { food: "Grilled Chicken", date: "Jan 13, 2025", time: "6:30 PM", calories: 380, protein: 38, confidence: 96 },
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Nutrition History & Log</h1>
              <p className="text-muted-foreground text-lg">Track your nutrition journey over time</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {/* Weekly Trend Chart */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Weekly Calorie Trend</h2>
              </div>
              <Tabs value={period} onValueChange={setPeriod}>
                <TabsList>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                  <TabsTrigger value="all">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* History Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Food</th>
                    <th className="text-left p-4 font-semibold">Date & Time</th>
                    <th className="text-left p-4 font-semibold">Calories</th>
                    <th className="text-left p-4 font-semibold">Protein</th>
                    <th className="text-left p-4 font-semibold">Confidence</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((item, index) => (
                    <tr key={index} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{item.food}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {item.date}
                        <br />
                        {item.time}
                      </td>
                      <td className="p-4">{item.calories} cal</td>
                      <td className="p-4">{item.protein}g</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                          {item.confidence}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default History;
