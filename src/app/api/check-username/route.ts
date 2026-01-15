import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (not exposed to browser)
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/profile/${username}`);

    if (response.ok) {
      // Username exists (not available)
      return NextResponse.json({ available: false });
    } else {
      // Username doesn't exist (available)
      return NextResponse.json({ available: true });
    }
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json({ available: true }); // Assume available on error
  }
}
