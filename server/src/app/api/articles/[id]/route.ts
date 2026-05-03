import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDb();
  db.articles = db.articles.filter(a => a.id !== parseInt(id));
  writeDb(db);
  return NextResponse.json({ success: true });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDb();
  const article = db.articles.find(a => a.id === parseInt(id));
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const db = readDb();
  const index = db.articles.findIndex(a => a.id === parseInt(id));
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  db.articles[index] = { 
    ...db.articles[index], 
    ...body,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  return NextResponse.json(db.articles[index]);
}
