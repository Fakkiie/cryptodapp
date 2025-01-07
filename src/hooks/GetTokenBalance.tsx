import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

interface TokenBalanceProps {
	publicKey: PublicKey;
	tokenMintAddress: string | null;
	connection: Connection;
}
export default async function getTokenBalance({
	publicKey,
	tokenMintAddress,
	connection,
}: TokenBalanceProps) {
	try {
		if (!publicKey) {
			console.error("Wallet not connected");
			return null;
		}

		// If tokenMintAddress is null or undefined, fetch SOL balance
		if (!tokenMintAddress) {
			const balanceInLamports = await connection.getBalance(publicKey);
			return {
				balance: balanceInLamports / 1e9, // Convert lamports to SOL
				rawBalance: balanceInLamports, // Raw lamports value
				token: "SOL", // Indicate it's SOL
			};
		}

		// Convert the token mint address to a PublicKey object
		const tokenMintPublicKey = new PublicKey(tokenMintAddress);

		// Find the associated token account for the wallet
		const associatedTokenAddress = await getAssociatedTokenAddress(
			tokenMintPublicKey,
			publicKey
		);

		// Fetch the token account balance
		const tokenAccountBalance = await connection.getTokenAccountBalance(
			associatedTokenAddress
		);

		return {
			balance: tokenAccountBalance.value.uiAmount,
			decimals: tokenAccountBalance.value.decimals,
			amount: tokenAccountBalance.value.amount,
		};
	} catch (error) {
		console.error("Error fetching token balance:", error);
		return null;
	}
}
