import { useState, useMemo, useEffect } from 'react';
import { SimulationResults, YearlyData } from '@/src/types';


export function useSimulator() {
  // --- TRAJET ---
  const [annualKm, setAnnualKm] = useState(10000);

  // --- VÉHICULE THERMIQUE ---
  const [fuelType, setFuelType] = useState<'diesel' | 'essence'>('diesel');
  const [iceConsumption, setIceConsumption] = useState(6.2);
  const [iceResale, setIceResale] = useState(10000);
  const [iceMaintenance, setIceMaintenance] = useState(600);
  const [iceInsurance, setIceInsurance] = useState(800);
  const [fuelPrices, setFuelPrices] = useState({ diesel: 2.20, essence: 1.95 });
  const [apiLoaded, setApiLoaded] = useState(false);
  const [lastApiUpdate, setLastApiUpdate] = useState<string>('');

  // --- VÉHICULE ÉLECTRIQUE ---
  const [acquisitionType, setAcquisitionType] = useState<'achat' | 'location'>('achat');
  const [evPrice, setEvPrice] = useState(25000);
  const [evMonthlyRent, setEvMonthlyRent] = useState(300);
  const [evConsumption, setEvConsumption] = useState(17);
  const [freeBonus, setFreeBonus] = useState(500);
  const [evMaintenance, setEvMaintenance] = useState(350);

  // --- ÉTATS PRIX ÉLECTRICITÉ DOMICILE ---
  const [homeKwhPriceApi, setHomeKwhPriceApi] = useState(0.16); // Valeur par défaut
  const [elecApiLoaded, setElecApiLoaded] = useState(false);

  // Ratios recharge
  const [ratioHome, setRatioHome] = useState(20);
  const [ratioPublic, setRatioPublic] = useState(70);
  const [ratioSupercharge, setRatioSupercharge] = useState(10);

// Appels API Électricité
  useEffect(() => {
    async function loadLiveElectricityPrice() {
      try {
        const res = await fetch('/api/electricity');
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.success && data.homeKwhPrice) {
          setHomeKwhPriceApi(data.homeKwhPrice);
          setElecApiLoaded(true);
        }
      } catch (err) {
        console.warn("Impossible de charger le tarif électricité en direct");
      }
    }

    loadLiveElectricityPrice();
  }, []);

  // Mettre à jour l'objet kwhPrices pour utiliser la valeur dynamique :
  const kwhPrices = { 
    home: elecApiLoaded ? homeKwhPriceApi : 0.16, 
    public: 0.45, 
    supercharge: 0.59 
  };

  // --- CRÉDIT VOITURE ---
  const [useCredit, setUseCredit] = useState(true); // Toggle ON/OFF
  const [creditAmount, setCreditAmount] = useState(15000);
  const [creditDurationMonths, setCreditDurationMonths] = useState(48);
  const [creditRate, setCreditRate] = useState(4.5);
  const [insuranceMonthlyRate, setInsuranceMonthlyRate] = useState(15);


  // API Carburant
  useEffect(() => {
    async function loadLiveFuelPrices() {
      try {
        const res = await fetch('/api/fuel');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.diesel) {
          setFuelPrices({ diesel: data.diesel, essence: data.essence });
          setLastApiUpdate(data.updatedAt);
          setApiLoaded(true);
        }
      } catch (err) {
        console.warn("API indisponible, conservation des tarifs par défaut");
      }
    }
    loadLiveFuelPrices();
  }, []);

  // --- CALCULS ---
  const results: SimulationResults = useMemo(() => {
    // 1. Thermique
    const currentFuelPrice = fuelPrices[fuelType];
    const iceAnnualFuelCost = (annualKm / 100) * iceConsumption * currentFuelPrice;
    const iceCostPer100 = iceConsumption * currentFuelPrice;
    const iceTotalAnnual = iceAnnualFuelCost + iceMaintenance + iceInsurance;

    // 2. Électrique
    const weightedKwhPrice = 
      ((ratioHome / 100) * kwhPrices.home) + 
      ((ratioPublic / 100) * kwhPrices.public) + 
      ((ratioSupercharge / 100) * kwhPrices.supercharge);

    const evRawEnergyAnnual = (annualKm / 100) * evConsumption * weightedKwhPrice;
    const evAnnualEnergyCostNet = Math.max(0, evRawEnergyAnnual - freeBonus);
    const evCostPer100 = (evAnnualEnergyCostNet / annualKm) * 100;

    const evVehicleAnnualCost = acquisitionType === 'location' ? evMonthlyRent * 12 : 0;
    const evTotalAnnual = evAnnualEnergyCostNet + evMaintenance + evVehicleAnnualCost;

    // 3. Économies Annuelles & Investissement Net
    const annualSavings = iceTotalAnnual - evTotalAnnual;
    const netInvestment = acquisitionType === 'achat' ? (evPrice - iceResale) : 0;
    const roiYears = (annualSavings > 0 && netInvestment > 0) ? netInvestment / annualSavings : 999;

    // 4. Calcul du Crédit
    const monthlyRate = (creditRate / 100) / 12;
    let monthlyPayment = 0;

    if (monthlyRate > 0 && creditAmount > 0) {
      monthlyPayment = (creditAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -creditDurationMonths));
    } else if (creditAmount > 0) {
      monthlyPayment = creditAmount / creditDurationMonths;
    }

    const totalMonthlyCost = monthlyPayment + insuranceMonthlyRate;
    const annualCreditCost = totalMonthlyCost * 12;

    const totalLoanPayments = monthlyPayment * creditDurationMonths;
    const totalInsuranceCost = insuranceMonthlyRate * creditDurationMonths;
    const totalCreditCost = (totalLoanPayments - creditAmount) + totalInsuranceCost;
    
    const durationInYears = creditDurationMonths / 12;
    const totalSavingsDuringCredit = annualSavings * durationInYears;
    const netCreditCostWithSavings = totalCreditCost - totalSavingsDuringCredit;

    // 5. Projection 15 ans pour le Graphique (Adaptée selon l'état du Crédit)
    const yearlyProjection: YearlyData[] = [];
    let cumulatedICE = 0;
    let cumulatedEV = (useCredit || acquisitionType === 'location') ? 0 : netInvestment;

    for (let i = 1; i <= 15; i++) {
      cumulatedICE += iceTotalAnnual;

      let currentYearEvCost = evTotalAnnual;
      if (useCredit && acquisitionType === 'achat') {
        const isCreditActiveThisYear = i <= Math.ceil(durationInYears);
        if (isCreditActiveThisYear) {
          currentYearEvCost += annualCreditCost;
        }
      }

      cumulatedEV += currentYearEvCost;

      yearlyProjection.push({
        year: i,
        Thermique: Math.round(cumulatedICE),
        Electrique: Math.round(cumulatedEV),
        annualIceCost: Math.round(iceTotalAnnual),
        annualEvCost: Math.round(currentYearEvCost),
        netSavingsCumulated: Math.round(cumulatedICE - cumulatedEV)
      });
    }

    return {
      iceAnnualFuelCost, iceCostPer100, iceTotalAnnual,
      evAnnualEnergyCostNet, evCostPer100, evTotalAnnual,
      annualSavings, netInvestment, roiYears,elecApiLoaded,homeKwhPriceApi,
      credit: {
        monthlyPayment,
        totalCreditCost,
        totalAmountPaid: totalLoanPayments + totalInsuranceCost,
        netCreditCostWithSavings
      },
      yearlyProjection
    };
  }, [
    annualKm, fuelType, iceConsumption, iceResale, iceMaintenance, iceInsurance, fuelPrices,
    acquisitionType, evPrice, evMonthlyRent, evConsumption, freeBonus, evMaintenance,
    ratioHome, ratioPublic, ratioSupercharge,
    useCredit, creditAmount, creditDurationMonths, creditRate, insuranceMonthlyRate,elecApiLoaded,homeKwhPriceApi,
  ]);

  const saveProfile = () => {
    localStorage.setItem('ev-sim-v4', JSON.stringify({
      annualKm, fuelType, iceConsumption, iceResale, iceMaintenance, iceInsurance,
      acquisitionType, evPrice, evMonthlyRent, evConsumption, freeBonus, evMaintenance,
      ratioHome, ratioPublic, ratioSupercharge, useCredit, creditAmount, creditDurationMonths, creditRate, insuranceMonthlyRate
    }));
    alert('✅ Profil sauvegardé !');
  };

  const loadProfile = () => {
    const data = localStorage.getItem('ev-sim-v4');
    if (data) {
      const p = JSON.parse(data);
      setAnnualKm(p.annualKm); setFuelType(p.fuelType); setIceConsumption(p.iceConsumption);
      setIceResale(p.iceResale); setIceMaintenance(p.iceMaintenance); setIceInsurance(p.iceInsurance);
      setAcquisitionType(p.acquisitionType); setEvPrice(p.evPrice); setEvMonthlyRent(p.evMonthlyRent);
      setEvConsumption(p.evConsumption); setFreeBonus(p.freeBonus); setEvMaintenance(p.evMaintenance);
      setRatioHome(p.ratioHome); setRatioPublic(p.ratioPublic); setRatioSupercharge(p.ratioSupercharge);
      setUseCredit(p.useCredit); setCreditAmount(p.creditAmount); setCreditDurationMonths(p.creditDurationMonths);
      setCreditRate(p.creditRate); setInsuranceMonthlyRate(p.insuranceMonthlyRate);
      alert('📂 Profil chargé !');
    }
  };

  return {
    annualKm, setAnnualKm, fuelType, setFuelType, iceConsumption, setIceConsumption,
    iceResale, setIceResale, iceMaintenance, setIceMaintenance, iceInsurance, setIceInsurance,
    acquisitionType, setAcquisitionType, evPrice, setEvPrice, evMonthlyRent, setEvMonthlyRent,
    evConsumption, setEvConsumption, freeBonus, setFreeBonus, evMaintenance, setEvMaintenance,
    ratioHome, setRatioHome, ratioPublic, setRatioPublic, ratioSupercharge, setRatioSupercharge,
    useCredit, setUseCredit, creditAmount, setCreditAmount, creditDurationMonths, setCreditDurationMonths,
    creditRate, setCreditRate, insuranceMonthlyRate, setInsuranceMonthlyRate,
    fuelPrices, apiLoaded, lastApiUpdate, results, saveProfile, loadProfile,elecApiLoaded,homeKwhPriceApi,kwhPrices
  };
}