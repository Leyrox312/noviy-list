import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDb();
  const race = db.races.find(r => r.id === parseInt(id));
  if (!race) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(race);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDb();
  db.races = db.races.filter(r => r.id !== parseInt(id));
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
  const index = db.races.findIndex(r => r.id === parseInt(id));
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  db.races[index] = { ...db.races[index], ...body };
  writeDb(db);
  return NextResponse.json(db.races[index]);
}
