const SOLANA = require('@solana/web3.js');
const { Connection, PublicKey, LAMPORTS_PER_SOL } = SOLANA;

const endpoint = "https://api.mainnet-beta.solana.com";
const SOLANA_CONNECTION = new Connection(endpoint);
const WALLET_ADDRESS = '2s4DUpzTFs3Czb7pg4UNRpRFoiPXDcBrvof6XUrgHsLZ'; 

interface TokenBalance {
    mint: string;
    balance: number;
    decimals: number;
}

async function getAccountBalance() {
    try {
        // Fetch SOL balance
        const solBalance = await SOLANA_CONNECTION.getBalance(new PublicKey(WALLET_ADDRESS));
        console.log(`SOL Balance: ${solBalance / LAMPORTS_PER_SOL} SOL`);

        // Fetch token accounts
        const tokenAccounts = await SOLANA_CONNECTION.getTokenAccountsByOwner(
            new PublicKey(WALLET_ADDRESS),
            { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
        );

        const tokenBalances: TokenBalance[] = [];

        // Process token accounts
        for (const tokenAccount of tokenAccounts.value) {
            const accountInfo = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(tokenAccount.pubkey));
            const parsedInfo = accountInfo.value?.data?.parsed?.info;
            if (!parsedInfo) continue; // Skip if account info is invalid

            const tokenAmount = parsedInfo.tokenAmount.uiAmount;
            const decimals = parsedInfo.tokenAmount.decimals;
            const mint = parsedInfo.mint;

            if (tokenAmount > 0) { // Exclude tokens with a balance of 0
                tokenBalances.push({
                    mint,
                    balance: tokenAmount,
                    decimals,
                });
            }
        }

        // Output token balances with mint addresses
        tokenBalances.forEach(token => {
            console.log(`Token Mint: ${token.mint}, Balance: ${token.balance}`);
        });
    } catch (error) {
        console.error("Error fetching account balance:", error);
    }
}

getAccountBalance();
