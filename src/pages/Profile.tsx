import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User, Bell, Shield, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground text-lg mb-12">Manage your account and preferences</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <Card className="p-4 sticky top-24">
                <nav className="space-y-1">
                  {[
                    { icon: User, label: "Personal Info", active: true },
                    { icon: Bell, label: "Notifications", active: false },
                    { icon: Shield, label: "Privacy & Security", active: false },
                  ].map((item, index) => (
                    <button
                      key={index}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        item.active 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Sebastian Biju" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="sebastian@example.com" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" defaultValue="28" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select defaultValue="male">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" defaultValue="175" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" defaultValue="70" className="mt-1.5" />
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select defaultValue="moderate">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Lightly Active</SelectItem>
                      <SelectItem value="moderate">Moderately Active</SelectItem>
                      <SelectItem value="very">Very Active</SelectItem>
                      <SelectItem value="extra">Extra Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Dietary Preferences */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Dietary Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="diet">Diet Type</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goal">Health Goal</Label>
                    <Select defaultValue="maintain">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Lose Weight</SelectItem>
                        <SelectItem value="maintain">Maintain Weight</SelectItem>
                        <SelectItem value="gain">Gain Muscle</SelectItem>
                        <SelectItem value="health">General Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="allergies">Allergies & Restrictions</Label>
                    <Input 
                      id="allergies" 
                      placeholder="e.g., Nuts, Dairy, Gluten" 
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { label: "Email Updates", description: "Receive nutrition tips and updates" },
                    { label: "Weekly Stats", description: "Get your weekly nutrition summary" },
                    { label: "Meal Reminders", description: "Reminders to log your meals" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked={index < 2} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Privacy & Security */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </Card>

              {/* Pro Tip */}
              <Card className="p-6 bg-accent border-accent">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-accent-foreground">Pro Tip</h3>
                    <p className="text-sm text-accent-foreground/80">
                      Keep your profile updated for more accurate nutrition recommendations and personalized meal suggestions!
                    </p>
                  </div>
                </div>
              </Card>

              <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
