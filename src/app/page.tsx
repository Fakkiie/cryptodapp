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
// Default styles that can be overridden by your app
require("@/styles/solana-ui.css");

export default function Home() {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;
	// You can also provide a custom RPC endpoint.
	// const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const endpoint =
		"https://solana-devnet.g.alchemy.com/v2/HzuRRQGwMGrcS955Yoy0hWDtAxG9VfF7";

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
