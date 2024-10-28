import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ message: "Ticket not found." },
				{ status: 404 }
			);
		}

		const ticket = await prisma.ticket.findUnique({ where: { id } });

		return NextResponse.json({ ticket }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: (error as any).status });
	}
}
