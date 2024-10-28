"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";

import axios from "axios";

interface TicketData {
	id: string;
	vatin: string;
	firstName: string;
	lastName: string;
	createdAt: string;
}

export default function TicketPage() {
	const { user, isLoading } = useUser();
	const [ticket, setTicket] = useState<TicketData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const [queryParameters] = useSearchParams();
	const id = queryParameters ? queryParameters[1] : "";

	useEffect(() => {
		if (!isLoading && !user) {
			router.push("/404");
		}
	}, [user, isLoading, router]);

	useEffect(() => {
		if (!user) return;

		if (!id) {
			router.push("/404");
		}

		const fetchTicketData = async () => {
			try {
				const response = await axios(`/api/${id}`);

				if (response.data.ticket && response.status !== 200) {
					throw new Error("Failed to fetch ticket data");
				}

				if (!ticket && !response.data.ticket) {
					router.push("/404");
				}

				const data = await response.data.ticket;
				setTicket(data);
			} catch (error) {
				setError("Failed to fetch ticket data");
			}
		};

		fetchTicketData();
	}, [user, id]);

	if (isLoading || !user) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	if (!ticket) {
		return <p>Loading ticket data...</p>;
	}

	return (
		<div>
			<div>
				<h1>This User's Information</h1>
				<div>
					{Object.entries(user).map(([key, value]) => {
						if (!value) return null;

						if (key === "picture" && typeof value === "string") {
							return (
								<div key={key}>
									<strong>Profile Picture:</strong>
									<Image src={value} alt="pfp" width={100} height={100} />
								</div>
							);
						}

						if (key === "updated_at" && typeof value === "string") {
							return (
								<p key={key}>
									<strong>Updated at:</strong>{" "}
									{new Date(ticket.createdAt).toString()}
								</p>
							);
						}

						return (
							<p key={key}>
								<strong>
									{key.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
									:
								</strong>{" "}
								{String(value)}
							</p>
						);
					})}
				</div>
			</div>
			<br />
			<br />
			<div>
				<h1>Ticket Information</h1>
				<p>
					<strong>ID:</strong> {ticket.id}
				</p>
				<p>
					<strong>VATIN:</strong> {ticket.vatin}
				</p>
				<p>
					<strong>First Name:</strong> {ticket.firstName}
				</p>
				<p>
					<strong>Last Name:</strong> {ticket.lastName}
				</p>
				<p>
					<strong>Created At:</strong> {new Date(ticket.createdAt).toString()}
				</p>
			</div>
		</div>
	);
}
