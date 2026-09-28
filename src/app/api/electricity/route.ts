import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Interrogation de l'API Open DPE pour le Tarif Bleu EDF
    const response = await fetch('https://open-dpe.fr/api/v1/electricity.php?tarif=EDF_bleu', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 } // Cache Next.js de 24h
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Extraction du prix du kWh (ex: option de base ou moyenne Heures Pleines / Heures Creuses)
    // L'API renvoie la structure du Tarif Bleu avec les différents coûts au kWh
    let priceKwh = 0.20; // Prix de secours si la clé exacte varie

    if (data && data.base) {
      priceKwh = parseFloat(data.base);
    } else if (data && data.hp && data.hc) {
      // Moyenne pondérée Heures Pleines / Heures Creuses (ex: 2/3 HP, 1/3 HC)
      priceKwh = (parseFloat(data.hp) * 0.66) + (parseFloat(data.hc) * 0.34);
    }

    return NextResponse.json({
      success: true,
      homeKwhPrice: parseFloat(priceKwh.toFixed(4)),
      tariffName: 'EDF Tarif Bleu',
      updatedAt: new Date().toLocaleDateString('fr-FR')
    });

  } catch (error) {
    console.error('Erreur API Électricité:', error);
    // Prix réglementé de secours
    return NextResponse.json({
      success: false,
      homeKwhPrice: 0.2516,
      tariffName: 'Tarif Réglementé (Secours)',
      updatedAt: 'Valeur de référence'
    });
  }
}