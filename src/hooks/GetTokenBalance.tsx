import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

interface TokenBalanceProps {
	publicKey: PublicKey;
	tokenMintAddress: string;
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
