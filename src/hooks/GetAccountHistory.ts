const solanaWeb3 = require('@solana/web3.js');
const searchAddress = '2s4DUpzTFs3Czb7pg4UNRpRFoiPXDcBrvof6XUrgHsLZ';
const endpoint = 'https://api.mainnet-beta.solana.com';
const solanaConnection = new solanaWeb3.Connection(endpoint);

interface Transaction {
    signature: string;
    blockTime: number;
    confirmationStatus: string;
}

const getTransactions = async (address: string, numTx: number): Promise<void> => {
    try {
        const pubKey = new solanaWeb3.PublicKey(address);
        const transactionList: Transaction[] = await solanaConnection.getSignaturesForAddress(pubKey, { limit: numTx });

        transactionList.forEach((transaction: Transaction, i: number) => {
            const date = new Date(transaction.blockTime * 1000);
            console.log(`Transaction No: ${i + 1}`);
            console.log(`Signature: ${transaction.signature}`);
            console.log(`Time: ${date}`);
            console.log(`Status: ${transaction.confirmationStatus}`);
            console.log('-'.repeat(20));
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

getTransactions(searchAddress, 3);