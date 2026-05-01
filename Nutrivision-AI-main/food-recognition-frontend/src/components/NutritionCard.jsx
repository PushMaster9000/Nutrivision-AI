import React from 'react';
import { Activity, Flame, Scale, Beef, Wheat } from 'lucide-react';

export default function NutritionCard({ data }) {
  if (!data || !data.nutrition) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
      {/* Header with Confidence Score */}
      <div className="bg-brand-green p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-green-100 text-xs uppercase tracking-widest font-bold">Detected Item</p>
            <h2 className="text-3xl font-black capitalize">{data.food}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-center">
            <p className="text-xs font-bold leading-none">{Math.round(data.confidence * 100)}%</p>
            <p className="text-[10px] uppercase opacity-80">Match</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-brand-orange mb-1">
              <Flame size={16} />
              <span className="text-xs font-bold uppercase">Calories</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{data.nutrition.cal} <span className="text-sm font-normal text-slate-500">kcal</span></p>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <Beef size={16} />
              <span className="text-xs font-bold uppercase">Protein</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{data.nutrition.protein} <span className="text-sm font-normal text-slate-500">g</span></p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Wheat size={16} />
              <span className="text-xs font-bold uppercase">Carbs</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{data.nutrition.carbs} <span className="text-sm font-normal text-slate-500">g</span></p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-yellow-500 mb-1">
              <Activity size={16} />
              <span className="text-xs font-bold uppercase">Fat</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{data.nutrition.fat} <span className="text-sm font-normal text-slate-500">g</span></p>
          </div>
        </div>

        {/* Info Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center gap-3 text-slate-400">
          <Scale size={18} />
          <p className="text-xs leading-tight">
            Nutritional values are calculated for a portion size of {data.portion_g}g.
          </p>
        </div>
      </div>
    </div>
  );
}