"use client";

import React, { FC, useMemo, useEffect, useState } from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
	WalletModalProvider,
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import Message from "@/components/Message";

// Default styles that can be overridden by your app
require("@/styles/solana-ui.css");

export default function Home() {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint.
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

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
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</>
	);
}
