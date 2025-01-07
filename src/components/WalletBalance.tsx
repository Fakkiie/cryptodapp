import { ConnectionContext, useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import React, { useContext, useState, useEffect, useMemo } from "react";
import getTokenBalance from "../hooks/GetTokenBalance";

export default function WalletBalance() {
	const { publicKey } = useWallet();
	const endpoint = useContext(ConnectionContext);

	const [balanceInfo, setBalanceInfo] = useState<{
		balance: number | null;
		decimals: number;
		amount: string;
	} | null>();
	const [tokenMintAddress, setTokenMintAddress] = useState(null);

	useMemo(async () => {
		if (!publicKey) return;

		const balanceInfo = await getTokenBalance({
			publicKey,
			tokenMintAddress,
			connection: endpoint.connection,
		});

		console.log(balanceInfo);
	}, [publicKey, tokenMintAddress]);

	return (
		<>
			<h1>
				Wallet Balance: {balanceInfo?.balance ?? 0 / LAMPORTS_PER_SOL}{" "}
				SOL
			</h1>
			<p>Public Key: {publicKey?.toBase58()}</p>
		</>
	);
}
