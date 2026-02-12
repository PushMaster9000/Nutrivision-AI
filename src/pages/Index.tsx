import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Camera, Sparkles, BarChart3, Upload, Brain, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroFood from "@/assets/hero-food.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transform any food photo into
                <span className="bg-gradient-primary bg-clip-text text-transparent"> detailed nutrition insights</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                AI-powered nutrition analysis that helps you make healthier choices, track your meals, and achieve your wellness goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/upload">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-lg">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Image
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden shadow-xl">
                <img 
                  src={heroFood} 
                  alt="AI analyzing healthy food bowl with smartphone" 
                  className="w-full h-auto"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to nutritional insights</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Snap a Photo",
                description: "Take a picture of any meal or scan food labels with your camera",
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Our AI instantly recognizes ingredients and calculates nutrition data",
              },
              {
                icon: BarChart3,
                title: "Get Insights",
                description: "Receive detailed nutrition facts, health tips, and recipe suggestions",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Health Enthusiasts</h2>
            <p className="text-xl text-muted-foreground">See what our users say</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Nutritionist",
                content: "NutriVision AI has revolutionized how I help my clients track their nutrition. The accuracy is impressive!",
              },
              {
                name: "Mike Chen",
                role: "Fitness Coach",
                content: "My clients love how easy it is to log their meals. The AI recognition saves so much time and keeps them consistent.",
              },
              {
                name: "Emily Rodriguez",
                role: "Health Enthusiast",
                content: "Finally, a nutrition app that makes tracking effortless. The recipe suggestions based on my goals are a game-changer!",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-primary text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Nutrition Journey?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands using AI to make healthier food choices</p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Get Started Free
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
