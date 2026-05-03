import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    if (!Array.isArray(db.items)) db.items = [];

    const newItem = {
      id: db.items.length > 0 ? Math.max(...db.items.map((i: any) => i.id)) + 1 : 1,
      name: body.name || 'Новый предмет',
      type: body.type || 'Weapon',
      subType: body.subType || 'All',
      description: body.description || '',
      stats: body.stats || '',
      price: body.price || 0,
      image: body.image || null
    };
    db.items.push(newItem);
    writeDb(db);
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error('Error creating item:', err);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
