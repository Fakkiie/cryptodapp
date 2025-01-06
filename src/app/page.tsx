"use client";

import WalletConnect from "@/components/WalletConnect";
import { useEffect } from "react";

export default function Home() {
	// Collect all wallets here
	const GetWallets = () => {
		const wallets: any[] = [];
		window.addEventListener("eip6963:announceProvider", (e) =>
			wallets.push(e.detail)
		);

		// Request all EIP-6963 wallets announce themselves
		window.dispatchEvent(new Event("eip6963:requestProvider"));

		console.log(wallets);
	};

	useEffect(() => {
		GetWallets();
	}, []);

	return (
		<div className="display-flex flex-column align-center justify-center">
			<WalletConnect />
		</div>
	);
}
