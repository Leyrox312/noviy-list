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
  try {
    const body = await request.json();
    console.log('Received body:', body);
    const db = readDb();
    
    // Ensure races is an array
    if (!Array.isArray(db.races)) {
      db.races = [];
    }

    const newRace = {
      id: db.races.length > 0 ? Math.max(...db.races.map((r: any) => r.id)) + 1 : 1,
      name: body.name || 'Новая раса',
      description: body.description || '',
      bonus: body.bonus || '',
      image: body.image || null
    };
    
    db.races.push(newRace);
    writeDb(db);
    console.log('Created new race:', newRace);
    return NextResponse.json(newRace, { status: 201 });
  } catch (err) {
    console.error('CRITICAL ERROR in POST /api/races:', err);
    return NextResponse.json({ 
      error: 'Failed to create race', 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}
