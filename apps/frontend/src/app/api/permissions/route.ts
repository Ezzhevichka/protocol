import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function GET() {
	try {
		const res = await fetch(`${API_URL}/permissions`, { cache: 'no-store' });
		const data = await res.json() as unknown;
		return NextResponse.json(data, { status: res.status });
	} catch {
		return NextResponse.json({ squad: [], site: [] }, { status: 502 });
	}
}
