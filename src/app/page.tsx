"use client";

import WalletConnect from "@/components/WalletConnect";
import WalletModal from "@/components/WalletModal";
import { useEffect, useState } from "react";

export default function Home() {
	const [wallets, setWallets] = useState<any[]>([]);
	const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);

	// Collect all wallets here
	const GetWallets = () => {
		window.addEventListener("eip6963:announceProvider", (e) =>
			// wallets.push(e.detail)
			setWallets((wallets) => [...wallets, e.detail])
		);

		// Request all EIP-6963 wallets announce themselves
		window.dispatchEvent(new Event("eip6963:requestProvider"));
	};

	useEffect(() => {
		GetWallets();
	}, []);

	useEffect(() => {
		console.log(wallets);
	}, [wallets]);

	return (
		<>
			<WalletModal
				wallets={wallets}
				openWalletModal={openWalletModal}
				setOpenWalletModal={setOpenWalletModal}
			/>
			<div className="display-flex flex-column align-center justify-center">
				<button onClick={() => setOpenWalletModal(true)}>
					Open Wallet Modal
				</button>
				<WalletConnect />
			</div>
		</>
	);
}
