import { NextResponse } from 'next/server';

const API_KEY = process.env.UPTIMEROBOT_READ_ONLY_API_KEY;
const BASE_URL = 'https://api.uptimerobot.com/v2';

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/getMonitors`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `api_key=${API_KEY}&format=json&response_times=1&response_times_limit=1`,
    });

    const data = await response.json();
    console.log("uptimerobot getMonitors success", );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    );
  }
} 