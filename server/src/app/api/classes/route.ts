import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.classes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    if (!Array.isArray(db.classes)) db.classes = [];
    
    const newClass = {
      id: db.classes.length > 0 ? Math.max(...db.classes.map((c: any) => c.id)) + 1 : 1,
      name: body.name || 'Новый класс',
      description: body.description || '',
      image: body.image || null,
      fullImage: body.fullImage || null,
      levels: body.levels || []
    };
    db.classes.push(newClass);
    writeDb(db);
    return NextResponse.json(newClass, { status: 201 });
  } catch (err) {
    console.error('Error creating class:', err);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
