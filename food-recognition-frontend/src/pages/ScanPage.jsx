import React, { useState } from 'react';
import { CheckCircle, ScanLine } from 'lucide-react';
import CameraUpload from '../components/CameraUpload';
import NutritionCard from '../components/NutritionCard';
import RecipeList from '../components/RecipeList';

export default function ScanPage() {
  const [result, setResult] = useState(null);
  const [appliances, setAppliances] = useState(['knife']);
  const [filters, setFilters] = useState([]);

  const toggleAppliance = (app) => {
    const val = app.toLowerCase();
    setAppliances(prev => prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]);
  };

  const toggleFilter = (filter) => {
    const val = filter.toLowerCase().replace(' ', '-');
    setFilters(prev => prev.includes(val) ? prev.filter(f => f !== val) : [...prev, val]);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="mb-8 flex items-center gap-4">
        <div className="bg-brand-green/10 p-3 rounded-xl text-brand-green">
            <ScanLine size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scan Food Image</h1>
            <p className="text-gray-500 dark:text-gray-400">Upload a photo for AI-powered analysis and recipes.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Scanner & Results Area */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-dark-card p-1 rounded-2xl border border-gray-200 dark:border-dark-border shadow-lg relative z-10 transition-colors">
             <CameraUpload 
               appliances={appliances} 
               constraints={filters} 
               onResult={setResult} 
             />
           </div>

           {result && (
             <div className="animate-fade-in space-y-10">
               <NutritionCard 
                  foodInfo={result.food_info} 
                  confidence={result.confidence} 
                  detectedFood={result.detected_food} 
               />
               <div id="recipes">
                  <RecipeList recipes={result.matching_recipes} />
               </div>
             </div>
           )}
        </div>

        {/* Right: Filters Panel */}
        <div className="space-y-6 lg:sticky lg:top-8 h-fit">
          
          {/* Appliances Box */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm dark:shadow-none transition-colors">
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4">Kitchen Appliances</h3>
             <div className="space-y-3">
               {['Knife', 'Blender', 'Oven', 'Air Fryer', 'Stove'].map(app => (
                 <label key={app} className="flex items-center gap-3 cursor-pointer group select-none hover:bg-gray-50 dark:hover:bg-dark-bg/50 p-2 rounded-lg -mx-2 transition-colors">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors 
                      ${appliances.includes(app.toLowerCase()) ? 'bg-brand-green border-brand-green' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                       {appliances.includes(app.toLowerCase()) && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <span className={appliances.includes(app.toLowerCase()) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}>{app}</span>
                    <input type="checkbox" className="hidden" onChange={() => toggleAppliance(app)} />
                 </label>
               ))}
             </div>
          </div>

          {/* Health Filters Box */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm dark:shadow-none transition-colors">
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4">Dietary Filters</h3>
             <div className="space-y-3">
               {['Low Sugar', 'Diabetic Friendly', 'Low Calorie', 'High Protein'].map(filter => {
                 const id = filter.toLowerCase().replace(' ', '-');
                 return (
                   <label key={filter} className="flex items-center gap-3 cursor-pointer group select-none hover:bg-gray-50 dark:hover:bg-dark-bg/50 p-2 rounded-lg -mx-2 transition-colors">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors 
                        ${filters.includes(id) ? 'bg-brand-green border-brand-green' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                         {filters.includes(id) && <CheckCircle size={16} className="text-white" />}
                      </div>
                      <span className={filters.includes(id) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}>{filter}</span>
                      <input type="checkbox" className="hidden" onChange={() => toggleFilter(filter)} />
                   </label>
                 );
               })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}