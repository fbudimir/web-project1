import express from "express";
import dotenv from "dotenv";

import ticketController from "./controller.js";
import { authMiddleware } from "./lib/authMiddleware.js";

dotenv.config();

const app = express();
const DOMAIN_URL = process.env.DOMAIN_URL || "http://localhost:4000";
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server operational.");
});

app.use(authMiddleware);
app.post("/tickets/", ticketController.createTicket);

app.listen(PORT, () => {
	console.log(`Server is running on ${DOMAIN_URL}`);
});
