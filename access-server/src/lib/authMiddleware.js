import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

export const authMiddleware = expressjwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
	}),
	audience: process.env.M2M_AUTH0_AUDIENCE,
	issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
	algorithms: ["RS256"],
});
