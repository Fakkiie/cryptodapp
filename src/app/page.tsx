"use client";

import React, { useMemo, useState } from "react";
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
import ChartWidget from "@/components/ChartWidget";
import TokenSelector, { Token } from "@/components/TokenSelector";
import "@/styles/solana-ui.css";

const API_SOL_NETWORK_URL =
	process.env.NEXT_PUBLIC_API_SOL_NETWORK_URL ??
	"https://api.devnet.solana.com";
const API_SOL_NETWORK_KEY = process.env.NEXT_PUBLIC_API_SOL_NETWORK_KEY ?? "";

export default function Home() {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = API_SOL_NETWORK_URL + API_SOL_NETWORK_KEY;

	const wallets = useMemo(() => [], [network]);

	//set tokens for selling and buying
	const [baseCoin, setBaseCoin] = useState<Token>({
		address: "So11111111111111111111111111111111111111112",
		symbol: "SOL",
		logoURI:
			"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
		name: "Solana",
		decimals: 9,
	});
	const [quoteCoin, setQuoteCoin] = useState<Token>({
		address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
		symbol: "USDT",
		logoURI:
			"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
		name: "Tether",
		decimals: 6,
	});

	const handleBuyingTokenChange = (token: Token | null) => {
		if (token) {
			setQuoteCoin(token);
			localStorage.setItem("quoteCoin", token.symbol);
		}
	};

	const handleSellingTokenChange = (token: Token | null) => {
		if (token) {
			setBaseCoin(token);
			localStorage.setItem("baseCoin", token.symbol);
		}
	};

	return (
		<div className="min-h-screen text-white flex flex-col items-center overflow-hidden">
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<header className="w-full bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
							<h1 className="text-2xl font-bold text-blue-400">
								SWYPER
							</h1>
							<div className="flex items-center gap-4">
								<WalletMultiButton className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition" />
								<WalletDisconnectButton className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition" />
							</div>
						</header>

						<main className="flex flex-col items-center w-full py-12 gap-8">
							<div className="w-full max-w-7xl flex flex-row gap-6 bg-gray-800 p-6 rounded-lg shadow-md">
								<div className="flex flex-col w-full">
									<h2 className="text-xl font-semibold mb-4 text-center">
										{baseCoin?.symbol ?? "N/A"}/
										{quoteCoin?.symbol ?? "N/A"} Price Chart
									</h2>
									<ChartWidget
										baseCoin={baseCoin?.symbol ?? "SOL"}
										quoteCoin={quoteCoin?.symbol ?? "USDT"}
									/>
								</div>
								<div className="flex min-w-96">
									<TokenSelector
										onBuyingTokenChange={
											handleBuyingTokenChange
										}
										onSellingTokenChange={
											handleSellingTokenChange
										}
										baseCoin={baseCoin}
										quoteCoin={quoteCoin}
									/>
								</div>
							</div>
						</main>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</div>
	);
}
