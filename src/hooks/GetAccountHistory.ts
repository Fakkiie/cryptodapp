const solanaWeb3 = require('@solana/web3.js');
const searchAddress = '2s4DUpzTFs3Czb7pg4UNRpRFoiPXDcBrvof6XUrgHsLZ';

// Use the Solana mainnet-beta endpoint
const endpoint = solanaWeb3.clusterApiUrl('mainnet-beta');
const solanaConnection = new solanaWeb3.Connection(endpoint);

interface Transaction {
    signature: string;
    blockTime: number;
    confirmationStatus: string;
}

interface TokenBalance {
    mint: string;
    uiTokenAmount: {
        uiAmount: number | null;
        decimals: number;
    } | null;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getTransactions = async (address: string, numTx: number, startSignature?: string): Promise<void> => {
    try {
        const pubKey = new solanaWeb3.PublicKey(address);
        let before: string | undefined = startSignature;
        let fetchedTxCount = 0;

        while (fetchedTxCount < numTx) {
            const transactionList: Transaction[] = await solanaConnection.getSignaturesForAddress(pubKey, { limit: 10, before });

            if (transactionList.length === 0) {
                break;
            }

            for (const [i, transaction] of transactionList.entries()) {
                const date = new Date(transaction.blockTime * 1000);
                console.log(`Transaction No: ${fetchedTxCount + i + 1}`);
                console.log(`Signature: ${transaction.signature}`);
                console.log(`Time: ${date}`);
                console.log(`Status: ${transaction.confirmationStatus}`);

                const txDetails = await solanaConnection.getTransaction(transaction.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });
                if (txDetails && txDetails.meta) {
                    const { preTokenBalances, postTokenBalances } = txDetails.meta;

                    if (preTokenBalances.length === 0 && postTokenBalances.length === 0) {
                        console.log('No token balance changes found for this transaction.');
                    } else {
                        console.log(`Token Swap Details for Transaction ${transaction.signature}:`);

                        const changes: { mint: string; change: number; decimals: number }[] = [];

                        // Process only the first 2 preTokenBalances and their corresponding postTokenBalances
                        preTokenBalances.slice(0, 2).forEach((preBalance: TokenBalance) => {
                            const postBalance: TokenBalance | undefined = postTokenBalances.find((pb: TokenBalance) => pb.mint === preBalance.mint);

                            if (postBalance) {
                                const preAmount: number = preBalance.uiTokenAmount?.uiAmount || 0;
                                const postAmount: number = postBalance.uiTokenAmount?.uiAmount || 0;

                                const tokenChange: number = postAmount - preAmount;

                                if (tokenChange !== 0) {
                                    console.log(`Pre Balance for ${preBalance.mint}: ${preAmount}`);
                                    console.log(`Post Balance for ${postBalance.mint}: ${postAmount}`);

                                    changes.push({
                                        mint: preBalance.mint,
                                        change: tokenChange,
                                        decimals: preBalance.uiTokenAmount?.decimals || 0,
                                    });
                                }
                            }
                        });

                        // Handle token swap details for the first two balances
                        if (changes.length === 2) {
                            const [token1, token2] = changes;
                            console.log(`Swapped from ${token1.mint} to ${token2.mint}`);
                            console.log(`  - Amount: ${Math.abs(token1.change).toFixed(token1.decimals)} ${token1.mint}`);
                            console.log(`  - Amount: ${Math.abs(token2.change).toFixed(token2.decimals)} ${token2.mint}`);
                        } else {
                            console.log('  - No clear token swap detected.');
                        }
                    }
                } else {
                    console.log('No detailed transaction info found.');
                }

                console.log('-'.repeat(40));
            }

            fetchedTxCount += transactionList.length;
            before = transactionList[transactionList.length - 1].signature;

            await delay(1000); // Add delay to avoid rate limits
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

// Start fetching transactions
const startSignature = '5chMCev7gURsUe2jsvg8jhingCCKLvE8g2SQNqVx9nhaxAL2XdK8kKNo2aPMwSv5qDkbV81GpwF7ESH33o8f931y'; // Replace with the actual signature of the 5th transaction
getTransactions(searchAddress, 20, startSignature); // Adjust the number of transactions as needed
