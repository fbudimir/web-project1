import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const count = await prisma.ticket.count();

		return NextResponse.json(count, { status: 200 });
	} catch (error) {
		console.error("Error fetching ticket:", error);
		return NextResponse.json(
			{ error: "An error occurred while fetching the ticket count" },
			{ status: 500 }
		);
	}
}
