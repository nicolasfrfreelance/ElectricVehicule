"use client";
import { useState } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { YearlyData } from '@/src/types';
import { BarChart3, LineChart, TrendingUp, Table } from 'lucide-react';

export default function ChartTabs({ data }: { data: YearlyData[] }) {
  const [activeTab, setActiveTab] = useState<'cumul' | 'annual' | 'savings' | 'table'>('cumul');

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col">
      
      {/* BARRE D'ONGLETS */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('cumul')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'cumul' 
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 size={15} /> Cumul des Dépenses
        </button>

        <button
          onClick={() => setActiveTab('annual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'annual' 
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <LineChart size={15} /> Coût Annuel Récurrent
        </button>

        <button
          onClick={() => setActiveTab('savings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'savings' 
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp size={15} /> Gain Net Cumulé (€)
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'table' 
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Table size={15} /> Tableau Détaillé
        </button>
      </div>

      {/* RENDER DES GRAPHISTES SELON L'ONGLET SÉLECTIONNÉ */}
      <div className="flex-1 w-full min-h-[360px]">
        
        {/* VUE 1 : CUMUL DES DÉPENSES */}
        {activeTab === 'cumul' && (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `An ${v}`} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} />
              <Tooltip 
                cursor={{ fill: '#0f172a' }}
                contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc' }}
                formatter={(val: number) => [`${val.toLocaleString()} €`, undefined]}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px', color: '#94a3b8' }} />
              <Bar dataKey="Thermique" fill="#475569" radius={[4, 4, 0, 0]} name="Cumul Thermique" />
              <Bar dataKey="Electrique" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Cumul Électrique" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* VUE 2 : COÛT ANNUEL RÉCURRENT */}
        {activeTab === 'annual' && (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `An ${v}`} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}€`} />
              <Tooltip 
                cursor={{ fill: '#0f172a' }}
                contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc' }}
                formatter={(val: number) => [`${val.toLocaleString()} € / an`, undefined]}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px', color: '#94a3b8' }} />
              <Bar dataKey="annualIceCost" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Budget Annuel Thermique" />
              <Bar dataKey="annualEvCost" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Budget Annuel Électrique (avec prêt)" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* VUE 3 : GAIN NET CUMULÉ (COURBE DE RENTABILITÉ) */}
        {activeTab === 'savings' && (
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `An ${v}`} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}€`} />
              <Tooltip 
                cursor={{ stroke: '#334155' }}
                contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc' }}
                formatter={(val: number) => [`${val.toLocaleString()} €`, 'Gain Net Cumulé']}
              />
              <Area type="monotone" dataKey="netSavingsCumulated" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" name="Économies Nettes (€)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* VUE 4 : TABLEAU DE DONNÉES BRUTES */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto max-h-[360px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="p-3">Année</th>
                  <th className="p-3">Cumul Thermique</th>
                  <th className="p-3">Cumul Électrique</th>
                  <th className="p-3">Coût Annuel Élec</th>
                  <th className="p-3 text-right">Bénéfice Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-950/50 transition-colors">
                    <td className="p-3 font-bold text-white">Année {row.year}</td>
                    <td className="p-3 text-slate-400">{row.Thermique.toLocaleString()} €</td>
                    <td className="p-3 text-cyan-400">{row.Electrique.toLocaleString()} €</td>
                    <td className="p-3 text-slate-300">{row.annualEvCost.toLocaleString()} € / an</td>
                    <td className={`p-3 text-right font-bold ${row.netSavingsCumulated >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.netSavingsCumulated >= 0 ? '+' : ''}{row.netSavingsCumulated.toLocaleString()} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}