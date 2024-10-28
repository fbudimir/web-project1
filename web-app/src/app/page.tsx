"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
	const { user, error, isLoading } = useUser();
	const router = useRouter();

	const [count, setCount] = useState<number | null>(null);

	const handleRedirect = () => {
		router.push("/create");
	};

	const handleCount = async () => {
		return await axios
			.get("/api/count")
			.then((response) => {
				setCount(response.data);
			})
			.catch((error) => {
				// mozda za error logging sustav
			});
	};

	useEffect(() => {
		handleCount();
	}, []);

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div>{count !== null ? `Tickets made: ${count}` : null}</div>
				<div>
					{isLoading ? (
						<div>Loading...</div>
					) : error ? (
						<div>{error.message}</div>
					) : user ? (
						<div>
							Logged in as {user.name}
							<br />
							<a href="/api/auth/logout">Logout</a>
						</div>
					) : (
						<div>
							{" "}
							<a href="/api/auth/login">Login</a>
						</div>
					)}
				</div>
				<br />
				<div>
					<button onClick={handleRedirect}>Create a ticket</button>
				</div>
			</main>
		</div>
	);
}
