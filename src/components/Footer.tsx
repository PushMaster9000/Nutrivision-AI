import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                NutriVision AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Transform any food photo into detailed nutrition insights instantly with AI-powered analysis.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/upload" className="hover:text-primary transition-colors">Upload</Link></li>
              <li><Link to="/recipes" className="hover:text-primary transition-colors">Recipes</Link></li>
              <li><Link to="/history" className="hover:text-primary transition-colors">History</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NutriVision AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
