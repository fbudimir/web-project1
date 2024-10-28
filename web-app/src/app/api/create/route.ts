import { NextResponse } from "next/server";
import { generateQR } from "@/lib/generateQR";
import axios from "axios";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { vatin, firstName, lastName } = body;

		if (!vatin || !firstName || !lastName) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

		const options1 = {
			method: "POST",
			url: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				client_id: process.env.M2M_AUTH0_CLIENT_ID,
				client_secret: process.env.M2M_AUTH0_CLIENT_SECRET,
				audience: process.env.M2M_AUTH0_AUDIENCE,
				grant_type: "client_credentials",
			},
		};

		let access_token = await axios(
			`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
			options1
		)
			.then((response) => {
				return response.data["access_token" as keyof typeof response.data];
			})
			.catch((error) => {
				if ((error as any).status === 400) {
					return NextResponse.json(
						{ message: "Invalid input data." },
						{ status: (error as any).status }
					);
				}
				throw error;
			});

		const options2 = {
			method: "POST",
			headers: { authorization: `Bearer ${access_token}` },
			data: {
				...body,
			},
		};

		let ticketId = await axios(
			`${process.env.BE_URL || "http://localhost:4000"}/tickets/`,
			options2
		)
			.then((response) => {
				return response.data["ticketId" as keyof typeof response.data];
			})
			.catch((error) => {
				throw error;
			});

		const qrCodeImage = await generateQR(
			`${
				process.env.RENDER_EXTERNAL_URL || process.env.DOMAIN_URL
			}/ticket?id=${ticketId}`
		);

		return NextResponse.json({ qrCodeImage }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error }, { status: (error as any).status });
	}
}
