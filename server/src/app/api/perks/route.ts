import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.perks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    if (!Array.isArray(db.perks)) db.perks = [];
    
    const newPerk = {
      id: db.perks.length > 0 ? Math.max(...db.perks.map((p: any) => p.id)) + 1 : 1,
      name: body.name || 'Новый перк',
      description: body.description || '',
      requirement: body.requirement || '',
      image: body.image || null
    };
    db.perks.push(newPerk);
    writeDb(db);
    return NextResponse.json(newPerk, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create perk' }, { status: 500 });
  }
}
