import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDb();
  db.perks = db.perks.filter(p => p.id !== parseInt(id));
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
  const index = db.perks.findIndex(p => p.id === parseInt(id));
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  db.perks[index] = { ...db.perks[index], ...body };
  writeDb(db);
  return NextResponse.json(db.perks[index]);
}
