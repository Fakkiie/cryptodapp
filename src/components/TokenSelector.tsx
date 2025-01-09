"use client";

import React, { useEffect, useState, useContext, useMemo } from "react";
import NoImage from "@/assets/no-image-icon-6.png";
import { useWallet, ConnectionContext } from "@solana/wallet-adapter-react";
import getTokenBalance from "@/hooks/GetTokenBalance";
import { VersionedTransaction } from "@solana/web3.js";
import transactionSenderAndConfirmationWaiter from "../hooks/transactionSender";
import { getSignature } from "@/hooks/getSignature";

export interface Token {
	address: string;
	symbol: string;
	logoURI: string;
	name: string;
	decimals: number;
}

interface TokenSelectorProps {
	onBuyingTokenChange: (token: Token | null) => void;
	onSellingTokenChange: (token: Token | null) => void;
	baseCoin: Token;
	quoteCoin: Token;
}

export default function TokenSelector({
	onBuyingTokenChange,
	onSellingTokenChange,
	baseCoin,
	quoteCoin,
}: TokenSelectorProps) {
	const { publicKey, signTransaction, wallet } = useWallet();
	const endpoint = useContext(ConnectionContext);

	const [tokens, setTokens] = useState<Token[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<"selling" | "buying" | null>(
		null
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [sellingAmount, setSellingAmount] = useState(0);
	const [buyingAmount, setBuyingAmount] = useState(0);
	const [baseCoinBalance, setBaseCoinBalance] = useState<string | null>(
		"Loading..."
	);
	const [quoteCoinBalance, setQuoteCoinBalance] = useState<string | null>(
		"Loading..."
	);
	const [quoteResponse, setQuoteResponse] = useState<any | null>(null);

	// Fetch the token list
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

	// Fetch balances for baseCoin and quoteCoin
	useEffect(() => {
		const fetchBalances = async () => {
			console.log(publicKey);
			if (!publicKey || !endpoint?.connection) {
				setBaseCoinBalance("0.00");
				setQuoteCoinBalance("0.00");
				return;
			}

			try {
				// Fetch baseCoin balance
				if (baseCoin?.address) {
					const baseBalance = await getTokenBalance({
						publicKey,
						tokenMintAddress: baseCoin.address,
						connection: endpoint.connection,
					});
					console.log(baseBalance?.balance);
					setBaseCoinBalance(
						baseBalance?.balance?.toString() || "0.00"
					);
				} else {
					setBaseCoinBalance("0.00");
				}

				// Fetch quoteCoin balance
				if (quoteCoin?.address) {
					const quoteBalance = await getTokenBalance({
						publicKey,
						tokenMintAddress: quoteCoin.address,
						connection: endpoint.connection,
					});
					setQuoteCoinBalance(
						quoteBalance?.balance?.toString() || "0.00"
					);
				} else {
					setQuoteCoinBalance("0.00");
				}
			} catch (error) {
				console.error("Error fetching balances:", error);
				setBaseCoinBalance("Error");
				setQuoteCoinBalance("Error");
			}
		};

		fetchBalances();
	}, [publicKey, baseCoin.address, quoteCoin.address]);

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
		setSellingAmount(buyingAmount || 0);
		setBuyingAmount(tempAmount);
	};

	const filteredTokens = tokens.filter((token) =>
		token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleQuoteTransaction = async (
		baseCoinAddress: string,
		quoteCoinAddress: string,
		sellingAmount: number
	) => {
		const quoteResponse = await (
			await fetch(
				`https://quote-api.jup.ag/v6/quote?inputMint=${baseCoinAddress}&outputMint=${quoteCoinAddress}&amount=${
					sellingAmount * Math.pow(10, baseCoin.decimals)
				}&slippageBps=50`
			)
		).json();

		if (quoteResponse.error) {
			console.error("Error getting quote:", quoteResponse.error);
			return;
		} else {
			setBuyingAmount(
				quoteResponse.outAmount / Math.pow(10, quoteCoin.decimals)
			);
			setQuoteResponse(quoteResponse);
		}
	};

	const handleSwapTransaction = async (quoteResponse: any) => {
		if (!publicKey || !signTransaction) {
			console.error(
				"Wallet not connected or does not support signing transactions"
			);
			return;
		} else if (!quoteResponse) {
			console.error("No quote response available");
			return;
		}
		const { swapTransaction, lastValidBlockHeight } = await (
			await fetch("https://quote-api.jup.ag/v6/swap", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					quoteResponse,
					userPublicKey: publicKey.toBase58(),
					wrapAndUnwrapSol: true,
					prioritizationFeeLamports: {
						priorityLevelWithMaxLamports: {
							maxLamports: 4000000,
							global: false,
							priorityLevel: "high",
						},
					},
				}),
			})
		).json();

		try {
			// Serialize transaction
			const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
			const transaction =
				VersionedTransaction.deserialize(swapTransactionBuf);

			// Sign transaction
			const signedTransaction = await signTransaction(transaction);
			const signature = getSignature(transaction);

			// Simulate to see if the transaction will be succesful
			const { value: simulatedTransactionResponse } =
				await endpoint.connection.simulateTransaction(transaction, {
					replaceRecentBlockhash: true,
					commitment: "processed",
				});
			const { err, logs } = simulatedTransactionResponse;

			if (err) {
				// Simulation error, we can check the logs for more details
				console.error("Simulation Error:");
				console.error({ err, logs });
				return;
			}

			const serializedTransaction = Buffer.from(
				signedTransaction.serialize()
			);
			const blockhash = await signedTransaction.message.recentBlockhash;

			const transactionResponse =
				await transactionSenderAndConfirmationWaiter({
					connection: endpoint.connection,
					serializedTransaction,
					blockhashWithExpiryBlockHeight: {
						blockhash,
						lastValidBlockHeight: lastValidBlockHeight,
					},
				});

			// const rawTransaction = signedTransaction.serialize();
			// const txid = await endpoint.connection.sendRawTransaction(
			// 	rawTransaction,
			// 	{
			// 		skipPreflight: true,
			// 		maxRetries: 2,
			// 	}
			// );

			// const latestBlockHash =
			// 	await endpoint.connection.getLatestBlockhash();
			// await endpoint.connection.confirmTransaction(
			// 	{
			// 		blockhash: latestBlockHash.blockhash,
			// 		lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
			// 		signature: txid,
			// 	},
			// 	"confirmed"
			// );

			// If we are not getting a response back, the transaction has not confirmed.
			if (!transactionResponse) {
				console.error("Transaction not confirmed");
				return;
			}

			if (transactionResponse.meta?.err) {
				console.error(transactionResponse.meta?.err);
			}

			console.log(`https://solscan.io/tx/${signature}`);
		} catch (error) {
			console.error("Error signing or sending the transaction:", error);
		}
	};

	useMemo(() => {
		if (baseCoin && quoteCoin && sellingAmount) {
			handleQuoteTransaction(
				baseCoin.address,
				quoteCoin.address,
				sellingAmount
			);
		} else if (baseCoin && quoteCoin) {
			setBuyingAmount(0);
		}
	}, [baseCoin, quoteCoin, sellingAmount]);

	return (
		<div className="flex flex-col w-full max-w-7xl mx-auto bg-gray-900 p-6 gap-4 rounded-lg shadow-lg">
			{/* Selling Section */}
			<div className="flex flex-col w-full">
				<h2 className="text-white text-left text-lg font-bold mb-2">
					Selling
				</h2>
				<h5 className="text-gray-500 mb-2">
					{baseCoin.symbol} Balance: {baseCoinBalance}
				</h5>
				<div className="flex gap-2 w-full">
					<button
						className="flex-grow p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
						onClick={() => setIsModalOpen("selling")}
					>
						<img
							src={baseCoin.logoURI ?? NoImage}
							alt={baseCoin.symbol}
							className="w-6 h-6 rounded-full"
						/>
						{baseCoin.symbol}
					</button>
					<input
						type="number"
						placeholder="0.00"
						className="w-1/3 p-3 bg-gray-800 text-white rounded-lg"
						value={sellingAmount}
						onChange={(e) =>
							setSellingAmount(parseFloat(e.target.value))
						}
						inputMode="decimal"
					/>
				</div>
			</div>
			<div className="relative items-center justify-center flex">
				<div className="absolute top-1/2 w-full bg-gray-800 h-[1px] z-0" />
				<button
					onClick={handleSwapTokens}
					className="w-8 h-8  rounded-full flex items-center justify-center z-10 text-white border-2 customShadow bg-gray-900 border-gray-800 hover:border-orange-600 transition-all"
					aria-label="Swap tokens"
				>
					⇅
				</button>
			</div>

			{/* Buying Section */}
			<div className="flex flex-col w-full text-left">
				<h2 className="text-white text-lg font-bold mb-2">Buying</h2>
				<h5 className="text-gray-500 mb-2">
					{quoteCoin.symbol} Balance: {quoteCoinBalance}
				</h5>
				<div className="flex gap-2 w-full">
					<button
						className="flex-grow p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
						onClick={() => setIsModalOpen("buying")}
					>
						<img
							src={quoteCoin.logoURI ?? NoImage}
							alt={quoteCoin.symbol}
							className="w-6 h-6 rounded-full"
						/>
						{quoteCoin.symbol}
					</button>
					<input
						type="text"
						placeholder="0.00"
						disabled
						className="w-1/3 p-3 bg-gray-800 text-white rounded-lg"
						value={buyingAmount}
						readOnly
					/>
				</div>
			</div>
			<button
				disabled={!quoteResponse || !publicKey}
				onClick={() => handleSwapTransaction(quoteResponse)}
				className="w-full rounded-lg p-3 font-bold bg-gray-800 hover:bg-slate-700 text-white transition-all active:scale-95 duration-400"
			>
				Swap
			</button>

			{/* Modal Logic */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
					<div className="bg-gray-900 rounded-lg shadow-lg p-6 w-96">
						<h2 className="text-white text-xl font-bold mb-4">
							Select a Token
						</h2>
						{/* Search Bar */}
						<input
							type="text"
							placeholder="Search tokens..."
							className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						{/* Token List */}
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
						{/* Close Button */}
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
