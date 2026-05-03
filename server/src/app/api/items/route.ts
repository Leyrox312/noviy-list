import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = readDb();
  const newItem = {
    id: db.items.length > 0 ? Math.max(...db.items.map((i: any) => i.id)) + 1 : 1,
    ...body
  };
  db.items.push(newItem);
  writeDb(db);
  return NextResponse.json(newItem, { status: 201 });
}
