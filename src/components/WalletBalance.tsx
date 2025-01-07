import { ConnectionContext, useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import React, { useContext, useState, useEffect, useMemo } from "react";
import getTokenBalance from "../hooks/GetTokenBalance";

type TokenType =
	| {
			balance: number;
			rawBalance: number;
			token: string;
			decimals?: undefined;
			amount?: undefined;
	  }
	| {
			balance: number | null;
			decimals: number;
			amount: string;
			rawBalance?: undefined;
			token?: undefined;
	  }
	| null;

export default function WalletBalance() {
	const { publicKey } = useWallet();
	const endpoint = useContext(ConnectionContext);

	const [balanceInfo, setBalanceInfo] = useState<{
		balance: number | null;
		decimals: number;
		amount: string;
	} | null>();
	const [tokenMintAddress, setTokenMintAddress] = useState(null);
	const [solBalance, setSolBalance] = useState(null);
	const [tokenBalance, setTokenBalance] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleGetBalances = async () => {
		if (!publicKey) {
			console.error("Wallet not connected");
			return;
		}

		console.log(await endpoint.connection.getAccountInfo(publicKey));

		setLoading(true);
		try {
			const sol = await getTokenBalance({
				publicKey: publicKey,
				tokenMintAddress: null,
				connection: endpoint.connection,
			});
			setSolBalance(sol);

			// Replace this with a real token mint address
			const exampleTokenMint =
				"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

			const token = await getTokenBalance({
				publicKey,
				tokenMintAddress: exampleTokenMint,
				connection: endpoint.connection,
			});
			setTokenBalance(token);
		} catch (error) {
			console.error("Error fetching balances:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{publicKey ? (
				<>
					<p>Wallet: {publicKey.toString()}</p>
					<button onClick={handleGetBalances} disabled={loading}>
						{loading ? "Loading..." : "Check Balances"}
					</button>
					{solBalance && <p>SOL Balance: {solBalance.balance} SOL</p>}
					{tokenBalance && (
						<p>Token Balance: {tokenBalance.balance}</p>
					)}
				</>
			) : (
				<p>Connect your wallet to see balances.</p>
			)}
		</>
	);
}
