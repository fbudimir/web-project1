import prisma from "./lib/prisma.js";

export const createTicket = async (req, res) => {
	try {
		const body = await req.body;
		const { vatin, firstName, lastName } = body;

		if (!vatin || !firstName || !lastName) {
			return res.status(400).json({ status: 400 });
		}

		const ticketCount = await prisma.ticket.count({
			where: { vatin },
		});

		if (ticketCount >= 3) {
			return res.status(400).json({
				status: 400,
				message:
					"Maximum number of tickets for this OIB has already been reached.",
			});
		}

		const ticket = await prisma.ticket.create({
			data: {
				vatin,
				firstName,
				lastName,
				createdAt: new Date(),
			},
		});

		return res.status(200).json({ status: 201, ticketId: ticket.id });
	} catch (error) {
		console.error("Error: ", error);
		return res.status(500).json({ status: 500 });
	}
};

export default {
	createTicket,
};
