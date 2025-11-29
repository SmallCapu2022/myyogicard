import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const cardsSnapshot = await adminDb.collection('cards')
      .where('userId', '==', userId)
      .get();

    const cards = cardsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const enriched = await Promise.all(
      cards.map(async (card: any) => {
        const studioDoc = await adminDb.collection('studios').doc(card.studioId).get();
        const studio = studioDoc.data();
        return { 
          ...card, 
          studioName: studio?.name || "Studio inconnu" 
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (err: any) {
    console.error('Error in /api/user/cards:', err);
    return NextResponse.json(
      { error: err?.message || String(err) }, 
      { status: 500 }
    );
  }
}
