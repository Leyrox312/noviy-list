import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDb();
  if (!db.mechanics) return NextResponse.json({ success: true });
  
  db.mechanics = db.mechanics.filter(m => m.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const db = readDb();
  if (!db.mechanics) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  const index = db.mechanics.findIndex(m => m.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  db.mechanics[index] = { ...db.mechanics[index], ...body };
  writeDb(db);
  return NextResponse.json(db.mechanics[index]);
}
