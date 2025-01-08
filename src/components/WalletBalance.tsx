import { ConnectionContext, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useContext, useState } from "react";
import getTokenBalance, { TokenBalanceReturn } from "../hooks/GetTokenBalance";

export default function WalletBalance() {
	const { publicKey } = useWallet();
	const endpoint = useContext(ConnectionContext);

	// const [tokenMintAddress, setTokenMintAddress] = useState(null);
	const [solBalance, setSolBalance] = useState<TokenBalanceReturn | null>(
		null
	);
	const [tokenBalance, setTokenBalance] = useState<TokenBalanceReturn | null>(
		null
	);
	const [loading, setLoading] = useState(false);

	const handleGetBalances = async () => {
		if (!publicKey) {
			console.error("Wallet not connected");
			return;
		}

		console.log("Default:", publicKey);
		const createdPK = new PublicKey(
			"7zdGxys7uF1Pzi2RnimmdgMz8vYGDH4JgfTxesezrWm3"
		);
		console.log("Created: ", createdPK);
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
				"EsPKhGTMf3bGoy4Qm7pCv3UCcWqAmbC1UGHBTDxRjjD4";

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
