import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.origins);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    if (!Array.isArray(db.origins)) db.origins = [];
    
    const newOrigin = {
      id: db.origins.length > 0 ? Math.max(...db.origins.map((o: any) => o.id)) + 1 : 1,
      name: body.name || 'Новое происхождение',
      description: body.description || '',
      bonus: body.bonus || ''
    };
    db.origins.push(newOrigin);
    writeDb(db);
    return NextResponse.json(newOrigin, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
