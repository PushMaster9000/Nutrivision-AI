// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/Auth/AuthPage';
import Sidebar from './components/Shared/Sidebar';
import CameraUpload from './components/Dashboard-t/CameraUpload';
import NutritionCard from './components/Dashboard-t/NutritionCard';
import RecipeList from './components/Dashboard-t/RecipeList';

function Dashboard() {
  const [selectedAppliances, setSelectedAppliances] = useState(['knife']);
  const [selectedConstraints, setSelectedConstraints] = useState([]);
  const [predictionData, setPredictionData] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      {/* Sidebar for Filters */}
      <Sidebar 
        selectedAppliances={selectedAppliances}
        setSelectedAppliances={setSelectedAppliances}
        selectedConstraints={selectedConstraints}
        setSelectedConstraints={setSelectedConstraints}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800">Smart Kitchen</h1>
          <p className="text-slate-500">Scan your food to unlock healthy recipes.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CameraUpload 
              appliances={selectedAppliances}
              constraints={selectedConstraints}
              onResult={setPredictionData}
            />
            
            {predictionData && (
              <RecipeList recipes={predictionData.matching_recipes} />
            )}
          </div>

          <div className="lg:col-span-1">
            {predictionData && (
              <NutritionCard 
                foodInfo={predictionData.food_info} 
                confidence={predictionData.confidence}
                detectedFood={predictionData.detected_food}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Dashboard Route (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Root Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}