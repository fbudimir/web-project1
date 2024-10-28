"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function CreatePage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		vatin: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [QRCode, setQRCode] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await axios
			.post(`/api/create`, formData)
			.then((response) => {
				setSuccess("Data submitted successfully!");
				setError(null);
				setQRCode(response.data.qrCodeImage);
			})
			.catch((error) => {
				if (error.status === 400) {
					setError("Maximum number of tickets for this VATIN reached.");
				} else setError(error.message);
				setSuccess(null);
				setQRCode(null);
			});
	};

	return (
		<div>
			<h1>Create New Ticket</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="firstName">First name:</label>
					<input
						className="text-black"
						type="text"
						id="firstName"
						name="firstName"
						value={formData.firstName}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="lastName">Last name:</label>
					<input
						className="text-black"
						type="text"
						id="lastName"
						name="lastName"
						value={formData.lastName}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="vatin">VATIN:</label>
					<input
						className="text-black"
						type="text"
						id="vatin"
						name="vatin"
						value={formData.vatin}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}
			{QRCode ? (
				<div>
					<Image src={QRCode} width={500} height={500} alt="qrcode"></Image>
				</div>
			) : null}
		</div>
	);
}
