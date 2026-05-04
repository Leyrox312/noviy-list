import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.mechanics || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    if (!db.mechanics) db.mechanics = [];

    const newMechanic = {
      id: body.id || `mechanic-${Date.now()}`,
      title: body.title || 'Новая механика',
      cards: body.cards || []
    };
    
    db.mechanics.push(newMechanic);
    writeDb(db);
    return NextResponse.json(newMechanic, { status: 201 });
  } catch (err) {
    console.error('Error creating mechanic:', err);
    return NextResponse.json({ error: 'Failed to create mechanic' }, { status: 500 });
  }
}
