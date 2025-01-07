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
			console.log(balanceInLamports);
			return {
				balance: balanceInLamports / 1e9, // Convert lamports to SOL
				rawBalance: balanceInLamports, // Raw lamports value
				token: "SOL", // Indicate it's SOL
			};
		}

		// For SPL tokens, fetch token account balance
		const tokenMintPublicKey = new PublicKey(tokenMintAddress);
		const associatedTokenAddress = await getAssociatedTokenAddress(
			tokenMintPublicKey,
			publicKey
		);

		const tokenAccountBalance = await connection.getTokenAccountBalance(
			associatedTokenAddress
		);

		return {
			balance: tokenAccountBalance.value.uiAmount,
			decimals: tokenAccountBalance.value.decimals,
			amount: tokenAccountBalance.value.amount,
			token: tokenMintAddress, // Indicate token mint address
		};
	} catch (error) {
		console.error("Error fetching balance:", error);
		return null;
	}
}
