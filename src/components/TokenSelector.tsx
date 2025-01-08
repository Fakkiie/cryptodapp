"use client";

import React, { useEffect, useState } from "react";
import NoImage from "@/assets/no-image-icon-6.png";

export interface Token {
	address: string;
	symbol: string;
	logoURI: string;
	name: string;
}

interface TokenSelectorProps {
	onBuyingTokenChange: (token: Token | null) => void;
	onSellingTokenChange: (token: Token | null) => void;
	baseCoin: Token;
	quoteCoin: Token;
	sellingAmount: string;
	buyingAmount: string;
	setSellingAmount: (amount: string) => void;
	setBuyingAmount: (amount: string) => void;
}

export default function TokenSelector({
	onBuyingTokenChange,
	onSellingTokenChange,
	baseCoin,
	quoteCoin,
	sellingAmount,
	buyingAmount,
	setSellingAmount,
	setBuyingAmount,
}: TokenSelectorProps) {
	const [tokens, setTokens] = useState<Token[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<"selling" | "buying" | null>(
		null
	);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchTokens = async () => {
			try {
				const response = await fetch(
					process.env.NEXT_PUBLIC_API_JUP_TOKEN_LIST_URL ||
						"https://tokens.jup.ag/tokens?tags=verified"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch tokens");
				}
				const data = await response.json();
				setTokens(data);
			} catch (error) {
				console.error("Error fetching tokens:", error);
			}
		};

		fetchTokens();
	}, []);

	const handleTokenSelect = (token: Token) => {
		if (isModalOpen === "selling") {
			onSellingTokenChange(token);
		} else if (isModalOpen === "buying") {
			onBuyingTokenChange(token);
		}
		setIsModalOpen(null);
	};

	const handleSwapTokens = () => {
		//swap selling and buying tokens
		const temp = baseCoin;
		onSellingTokenChange(quoteCoin);
		onBuyingTokenChange(temp);

		//swap the selling and buying amounts
		const tempAmount = sellingAmount;
		setSellingAmount(buyingAmount || "");
		setBuyingAmount(tempAmount || "");
	};

	const filteredTokens = tokens.filter((token) =>
		token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
			{/* selling section */}
			<div className="flex flex-col items-center w-full mb-6">
				<h2 className="text-white text-lg font-bold mb-2">Selling</h2>
				<div className="flex items-center gap-2 w-full">
					<button
						className="flex-grow p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
						onClick={() => setIsModalOpen("selling")}
					>
						{baseCoin ? (
							<>
								<img
									src={baseCoin.logoURI ?? NoImage}
									alt={baseCoin.symbol}
									className="w-6 h-6 rounded-full"
								/>
								{baseCoin.symbol}
							</>
						) : (
							"Select a token"
						)}
					</button>
					<input
						type="text"
						placeholder="0.00"
						className="w-1/3 p-3 bg-gray-800 text-white rounded-lg"
						value={sellingAmount}
						onChange={(e) => setSellingAmount(e.target.value)}
						inputMode="decimal"
					/>
				</div>
			</div>

			{/* swap feature */}
			<button
				onClick={handleSwapTokens}
				className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mb-6 hover:bg-blue-600 transition-all"
				aria-label="Swap tokens"
			>
				⇅
			</button>

			{/* buying section */}
			<div className="flex flex-col items-center w-full">
				<h2 className="text-white text-lg font-bold mb-2">Buying</h2>
				<div className="flex items-center gap-2 w-full">
					<button
						className="flex-grow p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
						onClick={() => setIsModalOpen("buying")}
					>
						{quoteCoin ? (
							<>
								<img
									src={quoteCoin.logoURI ?? NoImage}
									alt={quoteCoin.symbol}
									className="w-6 h-6 rounded-full"
								/>
								{quoteCoin.symbol}
							</>
						) : (
							"Select a token"
						)}
					</button>
					<input
						type="text"
						placeholder="0.00"
						className="w-1/3 p-3 bg-gray-800 text-white rounded-lg"
						value={buyingAmount}
						readOnly
					/>
				</div>
			</div>

			{/* modal feature */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
					<div className="bg-gray-900 rounded-lg shadow-lg p-6 w-96">
						<h2 className="text-white text-xl font-bold mb-4">
							Select a Token
						</h2>
						{/* search bar */}
						<input
							type="text"
							placeholder="Search tokens..."
							className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						{/* list of tokens */}
						<div className="max-h-80 overflow-y-auto">
							{filteredTokens.map((token) => (
								<button
									key={token.address}
									onClick={() => handleTokenSelect(token)}
									className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-lg w-full text-left"
								>
									<img
										src={token.logoURI ?? NoImage}
										alt={token.symbol}
										className="w-8 h-8 rounded-full"
									/>
									<span className="text-white">
										{token.symbol}
									</span>
								</button>
							))}
						</div>
						{/* close button */}
						<button
							className="w-full p-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
							onClick={() => setIsModalOpen(null)}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
