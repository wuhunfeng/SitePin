import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient | null = null;

async function getClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db('sitepin');
    const sites = await db.collection('sites').find().toArray();
    
    return NextResponse.json(sites);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await client.connect();
    const db = client.db('sitepin');
    
    const result = await db.collection('sites').insertOne({
      ...body,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add site' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 