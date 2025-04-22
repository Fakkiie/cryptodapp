import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Props {
	publicKey: string | null;
	connection: Connection;
}

export const RAYDIUM_SOLUSDC_SOL_VAULT = new PublicKey(
	'DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz'
);
export const RAYDIUM_SOLUSDC_USDC_VAULT = new PublicKey(
	'HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz'
);

async function fetchSolPriceFromRaydiumPool(connection: Connection) {
	const solVaultBalance = await connection.getBalance(
		RAYDIUM_SOLUSDC_SOL_VAULT
	);

	const usdcVault = await connection.getTokenAccountBalance(
		RAYDIUM_SOLUSDC_USDC_VAULT
	);
	const usdcVaultBalance = usdcVault.value.uiAmount;

	return (usdcVaultBalance ?? 0) / (solVaultBalance / LAMPORTS_PER_SOL);
}

export async function getAccountBalance({ publicKey, connection }: Props) {
	console.log('HERE');

	if (!publicKey) {
		return {
			solBalance: 0,
			totalTokenBalance: 0,
			totalBalance: 0,
			totalDollarBalance: 0,
		};
	}
	const solBalance = await connection.getBalance(new PublicKey(publicKey));
	const tokenAccounts = await connection.getTokenAccountsByOwner(
		new PublicKey(publicKey),
		{
			programId: new PublicKey(
				'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
			),
		} // Token Program ID
	);

	let totalTokenBalance = 0;
	let totalTokenValueInSol = 0;
	for (const tokenAccount of tokenAccounts.value) {
		const accountInfo = await connection.getParsedAccountInfo(
			new PublicKey(tokenAccount.pubkey)
		);

		if (!accountInfo.value) {
			continue;
		}
		console.log(accountInfo.value);
		const tokenAmount =
			// @ts-ignore
			accountInfo.value.data.parsed.info.tokenAmount.uiAmount;
		totalTokenBalance += tokenAmount;

		totalTokenValueInSol += accountInfo.value.lamports / LAMPORTS_PER_SOL;
	}

	let totalDollarBalance = 0;
	const solPrice = await fetchSolPriceFromRaydiumPool(connection);
	totalDollarBalance +=
		solPrice * (solBalance / LAMPORTS_PER_SOL + totalTokenValueInSol);

	console.log('SOL Price:', solPrice);
	console.log(
		'totalSolBalance:',
		solBalance / LAMPORTS_PER_SOL + totalTokenBalance
	);

	return {
		solBalance: solBalance / LAMPORTS_PER_SOL,
		totalTokenBalance,
		totalBalance: solBalance / LAMPORTS_PER_SOL + totalTokenBalance,
		totalDollarBalance,
	};
}
