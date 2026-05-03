import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const db = readDb();
  
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // In a real app, we would use JWT. For this TZ, a simple success response is enough.
    return NextResponse.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role,
      token: 'fake-jwt-token' 
    });
  }
  
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
