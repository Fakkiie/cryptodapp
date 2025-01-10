"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import SideWalletModal from "@/components/SideWalletModal";
import OpenModalButton from "@/components/OpenModalButton";
import Image from "next/image";

const API_SOL_NETWORK_URL =
	process.env.NEXT_PUBLIC_API_SOL_NETWORK_URL ??
	"https://api.devnet.solana.com";
const API_SOL_NETWORK_KEY = process.env.NEXT_PUBLIC_API_SOL_NETWORK_KEY ?? "";

export default function Home() {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = API_SOL_NETWORK_URL + API_SOL_NETWORK_KEY;
	const wallets = useMemo(() => [], [network]);
	const [isSideModalOpen, setIsSideModalOpen] = useState(false);

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

	useEffect(() => {
		console.log("modal ", isSideModalOpen);
	}, [isSideModalOpen]);

	return (
		<div className="min-h-screen text-white flex flex-col items-center overflow-hidden bg-neutral-800">
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<SideWalletModal
							isSideModalOpen={isSideModalOpen}
							setIsSideModalOpen={setIsSideModalOpen}
						/>
						<header className="w-full bg-neutral-900 shadow-md py-4 px-6 flex justify-between items-center">
							<Image
								className="w-12 h-fit"
								alt="logo"
								src="/logo.png"
								width={48}
								height={64}
							/>
							<div className="flex items-center gap-4">
								{/* <WalletMultiButton className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition" /> */}
								{/* <WalletDisconnectButton className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition" /> */}
								<OpenModalButton
									setIsSideModalOpen={setIsSideModalOpen}
								/>
							</div>
						</header>

						<main className="flex flex-col items-center w-full py-12 gap-8">
							<div className="w-full max-w-7xl flex flex-col bg-neutral-800 p-6 rounded-lg">
								<h2 className="text-xl font-semibold mb-4">
									{baseCoin?.symbol ?? "N/A"}/
									{quoteCoin?.symbol ?? "N/A"} Price Chart
								</h2>
								<div className="flex flex-col md:flex-row w-full gap-6">
									<div className="hidden sm:flex flex-col w-full">
										<ChartWidget
											baseCoin={baseCoin?.symbol ?? "SOL"}
											quoteCoin={
												quoteCoin?.symbol ?? "USDT"
											}
										/>
									</div>
									<div className="flex sm:min-w-96">
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
							</div>
						</main>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</div>
	);
}
