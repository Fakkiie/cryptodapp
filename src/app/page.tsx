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
import TokenList, { SelectedToken } from "@/components/TokenList";
import TokenSelector from "@/components/TokenSelector";
import "@/styles/solana-ui.css";

const API_SOL_NETWORK_URL =
	process.env.NEXT_PUBLIC_API_SOL_NETWORK_URL ??
	"https://api.devnet.solana.com";
const API_SOL_NETWORK_KEY = process.env.NEXT_PUBLIC_API_SOL_NETWORK_KEY ?? "";

export default function Home() {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = API_SOL_NETWORK_URL + API_SOL_NETWORK_KEY;

	const wallets = useMemo(() => [], [network]);

	const [sellToken, setSellToken] = useState<SelectedToken | null>(null);
	const [buyToken, setBuyToken] = useState<SelectedToken | null>(null);
	if (localStorage.getItem("sellToken")) {
		setSellToken(JSON.parse(localStorage.getItem("sellToken") ?? ""));
	}
	if (localStorage.getItem("buyToken")) {
		setBuyToken(JSON.parse(localStorage.getItem("buyToken") ?? ""));
	}
	const [baseCoin, setBaseCoin] = useState("SOL");
	const [quoteCoin, setQuoteCoin] = useState("USDT");

	const handleBuyingTokenChange = (token: any) => {
		if (token) {
			setQuoteCoin(token.symbol);
		}
	};

	const handleSellingTokenChange = (token: any) => {
		if (token) {
			setBaseCoin(token.symbol);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center overflow-hidden">
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<header className="w-full bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
							<h1 className="text-2xl font-bold text-blue-400">
								WE NEED TO NAME IT
							</h1>
							<div className="flex items-center gap-4">
								<WalletMultiButton className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition" />
								<WalletDisconnectButton className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition" />
							</div>
						</header>

						<main className="flex flex-col items-center w-full px-6 py-12 gap-8">
							<div className="w-full max-w-6xl flex flex-row gap-6 bg-gray-800 p-6 rounded-lg shadow-md">
								<div className="flex-1">
									<h2 className="text-xl font-semibold mb-4 text-center">
										{baseCoin}/{quoteCoin} Price Chart
									</h2>
									<ChartWidget
										baseCoin={baseCoin}
										quoteCoin={quoteCoin}
									/>
								</div>
								<div className="flex-1">
									<TokenSelector
										onBuyingTokenChange={
											handleBuyingTokenChange
										}
										onSellingTokenChange={
											handleSellingTokenChange
										}
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
