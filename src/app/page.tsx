"use client";
import { useSimulator } from "@/src/hooks/useSimulator";
import ChartTabs from "@/src/components/dashboard/ChartTabs";
import { Save, BatteryCharging, Fuel, Euro, Zap, TrendingUp, FolderOpen, Calculator, PiggyBank } from "lucide-react";

export default function Home() {
  const sim = useSimulator();

  return (
    <main className="min-h-screen bg-slate-950 font-sans text-slate-300 pb-12 selection:bg-cyan-900 selection:text-cyan-50">
      
      {/* HEADER */}
      <header className="bg-slate-950 border-b border-slate-800 text-white py-5 px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <BatteryCharging size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">EV Simulator Pro</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-0.5">Comparateur & Simulation de Crédit</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button onClick={sim.loadProfile} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
            <FolderOpen size={16} /> Charger
          </button>
          <button onClick={sim.saveProfile} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Save size={16} /> Sauvegarder
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLONNE GAUCHE : SAISIES */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SECTION THERMIQUE */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Fuel size={20} className="text-amber-500" /> Thermique
                </h2>
                {sim.apiLoaded && (
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    API ({sim.lastApiUpdate})
                  </span>
                )}
              </div>
              
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button onClick={() => sim.setFuelType('diesel')} className={`px-3 py-1 rounded-md transition-all ${sim.fuelType === 'diesel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}>
                  Diesel ({sim.fuelPrices.diesel}€)
                </button>
                <button onClick={() => sim.setFuelType('essence')} className={`px-3 py-1 rounded-md transition-all ${sim.fuelType === 'essence' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}>
                  Essence ({sim.fuelPrices.essence}€)
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Kilométrage Annuel</label>
                  <input type="number" value={sim.annualKm} onChange={(e) => sim.setAnnualKm(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Conso (L/100 km)</label>
                  <input type="number" step="0.1" value={sim.iceConsumption} onChange={(e) => sim.setIceConsumption(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Reprise (€)</label>
                  <input type="number" value={sim.iceResale} onChange={(e) => sim.setIceResale(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Entretien/an</label>
                  <input type="number" value={sim.iceMaintenance} onChange={(e) => sim.setIceMaintenance(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Assurance/an</label>
                  <input type="number" value={sim.iceInsurance} onChange={(e) => sim.setIceInsurance(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 bg-slate-950/50 p-3 rounded-xl border">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Carburant / an</p>
                  <p className="text-lg font-bold text-amber-400">{Math.round(sim.results.iceAnnualFuelCost).toLocaleString()} €</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Coût aux 100 km</p>
                  <p className="text-lg font-bold text-amber-400">{sim.results.iceCostPer100.toFixed(2)} €</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION ÉLECTRIQUE */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap size={20} className="text-cyan-400" /> Électrique
              </h2>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button onClick={() => sim.setAcquisitionType('achat')} className={`px-3 py-1 rounded-md transition-all ${sim.acquisitionType === 'achat' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Achat</button>
                <button onClick={() => sim.setAcquisitionType('location')} className={`px-3 py-1 rounded-md transition-all ${sim.acquisitionType === 'location' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}>LOA/LLD</button>
              </div>
            </div>
            
            <div className="space-y-4">
              {sim.acquisitionType === 'achat' ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Prix d'Achat (€)</label>
                  <input type="number" value={sim.evPrice} onChange={(e) => sim.setEvPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none" />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Loyer Mensuel (€/mois)</label>
                  <input type="number" value={sim.evMonthlyRent} onChange={(e) => sim.setEvMonthlyRent(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none" />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Conso (kWh/100)</label>
                  <input type="number" value={sim.evConsumption} onChange={(e) => sim.setEvConsumption(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Gratuit/an (€)</label>
                  <input type="number" value={sim.freeBonus} onChange={(e) => sim.setFreeBonus(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-emerald-400 font-bold outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Entretien/an</label>
                  <input type="number" value={sim.evMaintenance} onChange={(e) => sim.setEvMaintenance(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none" />
                </div>
              </div>

              {/* RECHARGE */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Répartition Recharge</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 block">% Domicile</span>
                      {sim.elecApiLoaded && (
                        <span className="text-[9px] text-emerald-400 font-bold">API EDF</span>
                      )}
                    </div>
                    <input type="number" value={sim.ratioHome} onChange={(e) => sim.setRatioHome(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold text-white outline-none" />
                    <span className="text-[10px] text-slate-500 block">
                      {sim.kwhPrices.home} €/kWh
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">% Publique</span>
                    <input type="number" value={sim.ratioPublic} onChange={(e) => sim.setRatioPublic(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold text-white outline-none" />
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">% Supercharge</span>
                    <input type="number" value={sim.ratioSupercharge} onChange={(e) => sim.setRatioSupercharge(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold text-white outline-none" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 bg-slate-950/50 p-3 rounded-xl border">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Énergie Net/an</p>
                  <p className="text-lg font-bold text-cyan-400">{Math.round(sim.results.evAnnualEnergyCostNet).toLocaleString()} €</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Coût aux 100 km</p>
                  <p className="text-lg font-bold text-cyan-400">{sim.results.evCostPer100.toFixed(2)} €</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : DASHBOARD & SIMULATEUR DE CRÉDIT */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* KPI CARDS GLOBALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Euro size={14}/> Apport / Surcoût Net
              </p>
              <p className="text-3xl font-light text-white tracking-tight">
                {sim.results.netInvestment.toLocaleString()} <span className="text-lg text-slate-500 font-normal">€</span>
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.05)] flex flex-col justify-between">
              <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2 flex items-center gap-2">
                <TrendingUp size={14}/> Économie Annuelle
              </p>
              <p className="text-3xl font-semibold text-emerald-400 tracking-tight">
                + {Math.round(sim.results.annualSavings).toLocaleString()} <span className="text-lg font-normal">€</span>
              </p>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap size={14}/> ROI (Amortissement)
              </p>
              <p className="text-3xl font-light text-cyan-400 tracking-tight">
                {sim.results.roiYears === 999 ? "N/A" : `${sim.results.roiYears.toFixed(1)}`} <span className="text-lg font-normal text-cyan-600">Ans</span>
              </p>
            </div>
          </div>

          {/* BLOC : SIMULATEUR DE CRÉDIT VOITURE AVEC TOGGLE */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calculator size={20} className="text-indigo-400" /> Simulation de Crédit Auto
              </h2>
              
              {/* TOGGLE SWITCH ON / OFF */}
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-xs text-slate-400 font-medium">
                  {sim.useCredit ? 'Financement Actif' : 'Comptant'}
                </span>
                <div 
                  onClick={() => sim.setUseCredit(!sim.useCredit)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${sim.useCredit ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${sim.useCredit ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>

            {sim.useCredit ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Montant Emprunté (€)</label>
                    <input type="number" value={sim.creditAmount} onChange={(e) => sim.setCreditAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Durée (Mois)</label>
                    <select value={sim.creditDurationMonths} onChange={(e) => sim.setCreditDurationMonths(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                      <option value={24}>24 mois (2 ans)</option>
                      <option value={36}>36 mois (3 ans)</option>
                      <option value={48}>48 mois (4 ans)</option>
                      <option value={60}>60 mois (5 ans)</option>
                      <option value={72}>72 mois (6 ans)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Taux TAEG (%)</label>
                    <input type="number" step="0.1" value={sim.creditRate} onChange={(e) => sim.setCreditRate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">Assurance (€/mois)</label>
                    <input type="number" value={sim.insuranceMonthlyRate} onChange={(e) => sim.setInsuranceMonthlyRate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 outline-none" />
                  </div>
                </div>

                {/* RÉSULTATS DU CRÉDIT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Mensualité Totale</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {Math.round(sim.results.credit.monthlyPayment + sim.insuranceMonthlyRate)} <span className="text-sm font-normal text-slate-400">€/mois</span>
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">hors assurance: {Math.round(sim.results.credit.monthlyPayment)}€</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Coût Brut du Crédit</p>
                    <p className="text-2xl font-bold text-indigo-400 mt-1">
                      + {Math.round(sim.results.credit.totalCreditCost).toLocaleString()} <span className="text-sm font-normal">€</span>
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">Intérêts + Assurances cumulés</p>
                  </div>

                  <div className="bg-gradient-to-br from-slate-950 to-indigo-950 p-4 rounded-xl border border-indigo-800 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                    <p className="text-[10px] text-indigo-300 uppercase font-bold flex items-center gap-1">
                      <PiggyBank size={12}/> Coût Réel Net du Crédit
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${sim.results.credit.netCreditCostWithSavings <= 0 ? 'text-emerald-400' : 'text-indigo-200'}`}>
                      {sim.results.credit.netCreditCostWithSavings <= 0 ? '' : '+ '}
                      {Math.round(sim.results.credit.netCreditCostWithSavings).toLocaleString()} €
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {sim.results.credit.netCreditCostWithSavings <= 0 
                        ? '🎉 L\'économie de carburant rembourse intégralement le crédit !' 
                        : 'Intérêts déduits des gains d\'énergie EV'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500 italic text-center py-2">
                Option de crédit désactivée. Le graphique ci-dessous simule un achat comptant.
              </p>
            )}
          </div>

          {/* GRAPHIQUE */}
          <ChartTabs data={sim.results.yearlyProjection} />
          
        </div>
      </div>

      <footer className="max-w-7xl mx-auto px-4 mt-12 mb-4 text-center">
        <p className="text-slate-500 text-sm">
          Outil développé et propulsé par <span className="font-bold text-cyan-500 tracking-wide">Visibilité Locale Pro</span>
        </p>
      </footer>
    </main>
  );
}