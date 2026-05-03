import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.articles);
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = readDb();
  const newArticle = {
    id: db.articles.length > 0 ? Math.max(...db.articles.map((a: any) => a.id)) + 1 : 1,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.articles.push(newArticle);
  writeDb(db);
  return NextResponse.json(newArticle, { status: 201 });
}
