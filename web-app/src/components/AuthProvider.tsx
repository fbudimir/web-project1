"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function AuthProvider({ children }) {
	return <UserProvider>{children}</UserProvider>;
}