"use client";

import React, { useMemo } from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
	WalletModalProvider,
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Message from "@/components/Message";
import WalletBalance from "@/components/WalletBalance";
import ChartWidget from "@/components/ChartWidget";
import "@/styles/solana-ui.css";

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "https://api.devnet.solana.com";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

export default function Home() {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;
	// You can also provide a custom RPC endpoint.
	// const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const endpoint = API_URL + API_KEY;

	const wallets = useMemo(
		() => [
			// This is where default wallets are added
			// new UnsafeBurnerWalletAdapter()
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[network]
	);

	return (
		<>
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<WalletMultiButton />
						<WalletDisconnectButton />
						<Message />
						<WalletBalance />
						<ChartWidget baseCoin="ETH" quoteCoin="USD" />
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</>
	);
}
