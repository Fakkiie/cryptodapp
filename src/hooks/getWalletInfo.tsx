import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

interface GetWalletInfoProps {
	connection: Connection;
}

export default async function getWalletInfo({
	connection,
}: GetWalletInfoProps) {
	const { publicKey } = useWallet();
	if (!publicKey) {
		console.error("Wallet not connected");
		return null;
	}

	console.log("RAN");

	const response = await connection.getAccountInfo(publicKey);

	return response;
}
