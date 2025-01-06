"use client";

import WalletConnect from "@/components/WalletConnect";
import WalletModal from "@/components/WalletModal";

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

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export default function Home() {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint.
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	const wallets = useMemo(
		() => [new UnsafeBurnerWalletAdapter()],
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
						{/* Your app's components go here, nested within the context providers. */}
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</>
	);
}
