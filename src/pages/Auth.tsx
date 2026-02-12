import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Leaf, Mail } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              NutriVision AI
            </span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSignUp 
              ? "Start your journey to better nutrition" 
              : "Sign in to continue your wellness journey"}
          </p>

          <form className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" className="mt-1.5" />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1.5" />
            </div>
            
            {isSignUp && (
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" className="mt-1.5" />
              </div>
            )}

            <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          <Button variant="outline" className="w-full" size="lg">
            <Mail className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden md:block relative bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20" />
        <img 
          src={heroFood} 
          alt="Healthy food photography" 
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Transform Your Nutrition Journey</h2>
            <p className="text-xl opacity-90">
              Join thousands using AI to make healthier food choices every day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
