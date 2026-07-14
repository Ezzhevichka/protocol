import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json() as unknown;
	const res = await fetch(`${API_URL}/roles/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	const data = await res.json() as unknown;
	return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const res = await fetch(`${API_URL}/roles/${id}`, { method: 'DELETE' });
	const data = await res.json() as unknown;
	return NextResponse.json(data, { status: res.status });
}
