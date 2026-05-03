import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

/**
 * @openapi
 * /api/races:
 *   get:
 *     description: Returns all races
 *     responses:
 *       200:
 *         description: Array of races
 */
export async function GET() {
  const db = readDb();
  return NextResponse.json(db.races);
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = readDb();
  const newRace = {
    id: db.races.length > 0 ? Math.max(...db.races.map((r: any) => r.id)) + 1 : 1,
    ...body
  };
  db.races.push(newRace);
  writeDb(db);
  return NextResponse.json(newRace, { status: 201 });
}
