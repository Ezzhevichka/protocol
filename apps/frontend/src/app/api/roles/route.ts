import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function POST(request: NextRequest) {
	const body = await request.json() as unknown;
	const res = await fetch(`${API_URL}/roles`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	const data = await res.json() as unknown;
	return NextResponse.json(data, { status: res.status });
}
