"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";

export default function Message() {
	const [message, setMessage] = useState("");
	const { publicKey, signMessage } = useWallet();

	const handleSignMessage = async () => {
		// Check if the wallet supports signing
		if (!publicKey || !signMessage) {
			console.error(
				"Wallet does not support message signing or is not connected"
			);
			return;
		}

		try {
			// Convert message to Uint8Array
			const encodedMessage = new TextEncoder().encode(message);

			// Sign the message
			const signature = await signMessage(encodedMessage);

			console.log("Message:", message);
			console.log("Encoded Message:", encodedMessage);
			console.log("Signature:", signature);

			// You can verify the signature using the publicKey and encoded message
		} catch (error) {
			console.error("Error signing message:", error);
		}
	};

	return (
		<>
			<h1>Message</h1>
			<input
				type="text"
				placeholder="Enter message"
				onChange={(e) => setMessage(e.target.value)}
			/>
			<button onClick={handleSignMessage}>Sign Message</button>
		</>
	);
}
