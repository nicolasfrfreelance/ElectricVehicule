import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Interrogation de l'API Open Data des carburants (données temps réel)
    const url = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?limit=50';

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 1800 } // Cache de 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    const gazolePrices: number[] = [];
    const sp95Prices: number[] = [];

    data.results?.forEach((station: any) => {
      if (station.gazole_prix) gazolePrices.push(parseFloat(station.gazole_prix));
      if (station.e10_prix) sp95Prices.push(parseFloat(station.e10_prix));

      // Gestion du tableau `prix` sous forme d'objet JSON
      if (Array.isArray(station.prix)) {
        const gazole = station.prix.find((p: any) => p.nom === 'Gazole');
        const e10 = station.prix.find((p: any) => p.nom === 'E10' || p.nom === 'SP95');

        if (gazole?.valeur) gazolePrices.push(parseFloat(gazole.valeur));
        if (e10?.valeur) sp95Prices.push(parseFloat(e10.valeur));
      }
    });

    // Calcul des moyennes (si vide, repli sur 2.20 / 1.95)
    const avgDiesel = gazolePrices.length > 0
      ? gazolePrices.reduce((a, b) => a + b, 0) / gazolePrices.length
      : 2.20;

    const avgEssence = sp95Prices.length > 0
      ? sp95Prices.reduce((a, b) => a + b, 0) / sp95Prices.length
      : 1.95;

    return NextResponse.json({
      success: true,
      diesel: parseFloat(avgDiesel.toFixed(3)),
      essence: parseFloat(avgEssence.toFixed(3)),
      updatedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    });

  } catch (error) {
    console.error('Erreur Route Fuel:', error);
    // Repli de sécurité avec les prix récents observés (2.20€)
    return NextResponse.json({
      success: true,
      diesel: 2.20,
      essence: 1.95,
      updatedAt: 'Valeur de référence'
    });
  }
}