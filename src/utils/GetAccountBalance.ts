const SOLANA = require('@solana/web3.js');
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = SOLANA;
const endpoint = "https://mainnet.helius-rpc.com/?api-key=9470961a-e399-456d-825f-d85539c516f7";
const SOLANA_CONNECTION = new Connection(endpoint);
const WALLET_ADDRESS = '2s4DUpzTFs3Czb7pg4UNRpRFoiPXDcBrvof6XUrgHsLZ'; //👈 Replace with your wallet address

interface TokenBalance {
    mint: string;
    balance: number;
    decimals: number;
}

async function getAccountBalance() {
    const solBalance = await SOLANA_CONNECTION.getBalance(new PublicKey(WALLET_ADDRESS));
    const tokenAccounts = await SOLANA_CONNECTION.getTokenAccountsByOwner(
        new PublicKey(WALLET_ADDRESS),
        { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") } 
    );

    let totalTokenBalance = 0;
    const tokenBalances: TokenBalance[] = [];

    for (const tokenAccount of tokenAccounts.value) {
        const accountInfo = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(tokenAccount.pubkey));
        const tokenAmount = accountInfo.value.data.parsed.info.tokenAmount.uiAmount;
        const decimals = accountInfo.value.data.parsed.info.tokenAmount.decimals;
        const mint = accountInfo.value.data.parsed.info.mint;

        tokenBalances.push({
            mint,
            balance: tokenAmount,
            decimals,
        });

        totalTokenBalance += tokenAmount;
    }

    console.log(`SOL Balance: ${solBalance / LAMPORTS_PER_SOL} SOL`);
    console.log(`Total Token Balance: ${totalTokenBalance}`);
    console.log(`Total Balance (SOL + Tokens): ${(solBalance / LAMPORTS_PER_SOL) + totalTokenBalance}`);

    tokenBalances.forEach(token => {
        console.log(`Token Mint: ${token.mint}, Balance: ${token.balance}, Decimals: ${token.decimals}`);
    });
}

getAccountBalance();