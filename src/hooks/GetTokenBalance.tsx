import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

interface TokenBalanceProps {
	publicKey: PublicKey;
	tokenMintAddress: string;
	connection: Connection;
}

export interface TokenBalanceReturn {
	balance?: number | null;
	decimals?: number;
	amount?: number;
	token?: string;
}

export default async function getTokenBalance({
	publicKey,
	tokenMintAddress,
	connection,
}: TokenBalanceProps): Promise<TokenBalanceReturn | null> {
	try {
		if (!publicKey) {
			console.error("Wallet not connected");
			return null;
		}

		// If tokenMintAddress is null or undefined, fetch SOL balance
		if (
			tokenMintAddress === "So11111111111111111111111111111111111111112"
		) {
			const balanceInLamports = await connection.getBalance(publicKey);
			console.log(balanceInLamports);
			return {
				balance: balanceInLamports / 1e9, // Convert lamports to SOL
				decimals: balanceInLamports / 1e9, // Raw lamports value
				amount: balanceInLamports,
				token: "SOL",
			};
		}

		const tokenMintPublicKey = new PublicKey(tokenMintAddress);
		const associatedTokenAddress = await getAssociatedTokenAddress(
			tokenMintPublicKey,
			publicKey
		);

		const tokenAccountBalance = await connection.getTokenAccountBalance(
			associatedTokenAddress
		);

		console.log("Token balance: ", tokenAccountBalance);
		return {
			balance: tokenAccountBalance.value.uiAmount ?? null,
			decimals: tokenAccountBalance.value.decimals,
			amount: parseFloat(tokenAccountBalance.value.amount),
			token: tokenMintAddress, // Indicate token mint address
		};
		// @ts-ignore
	} catch (error: any) {
		if (error?.code === -32602) console.log("Token not in wallet");
		else console.error("Error fetching balance:", error);
		return null;
	}
}
