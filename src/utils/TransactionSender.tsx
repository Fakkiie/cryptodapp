import {
	BlockhashWithExpiryBlockHeight,
	Connection,
	TransactionExpiredBlockheightExceededError,
	VersionedTransactionResponse,
} from "@solana/web3.js";
import { retry } from "ts-retry-promise";
import { wait } from "../utils/wait";

type TransactionSenderAndConfirmationWaiterArgs = {
	connection: Connection;
	serializedTransaction: Buffer;
	blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
};

const SEND_OPTIONS = {
	skipPreflight: true,
};

export default async function transactionSenderAndConfirmationWaiter({
	connection,
	serializedTransaction,
	blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<VersionedTransactionResponse | null> {
	const txid = await connection.sendRawTransaction(
		serializedTransaction,
		SEND_OPTIONS
	);

	const controller = new AbortController();
	const abortSignal = controller.signal;

	const abortableResender = async () => {
		while (true) {
			await wait(2_000);
			if (abortSignal.aborted) return;
			try {
				await connection.sendRawTransaction(
					serializedTransaction,
					SEND_OPTIONS
				);
			} catch (e) {
				console.warn(`Failed to resend transaction: ${e}`);
			}
		}
	};

	try {
		abortableResender();
		const lastValidBlockHeight =
			blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

		// this would throw TransactionExpiredBlockheightExceededError
		await Promise.race([
			connection.confirmTransaction(
				{
					...blockhashWithExpiryBlockHeight,
					lastValidBlockHeight,
					signature: txid,
					abortSignal,
				},
				"confirmed"
			),
			new Promise(async (resolve) => {
				// in case ws socket died
				while (!abortSignal.aborted) {
					await wait(2_000);
					const tx = await connection.getSignatureStatus(txid, {
						searchTransactionHistory: false,
					});
					if (tx?.value?.confirmationStatus === "confirmed") {
						resolve(tx);
					}
				}
			}),
		]);
	} catch (e) {
		if (e instanceof TransactionExpiredBlockheightExceededError) {
			// we consume this error and getTransaction would return null
			return null;
		} else {
			// invalid state from web3.js
			throw e;
		}
	} finally {
		controller.abort();
	}

	// in case rpc is not synced yet, we add some retries
	const response: Promise<VersionedTransactionResponse | null> = retry(
		async () => {
			const response = await connection.getTransaction(txid, {
				commitment: "confirmed",
				maxSupportedTransactionVersion: 0,
			});
			if (response) return response;
			return null;
		},
		{
			retries: 5,
			delay: 1_000,
		}
	);

	return response;
}
//
