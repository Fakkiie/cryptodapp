const SOLANA = require('@solana/web3.js');
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = SOLANA;
const QUICKNODE_RPC = 'https://api.mainnet-beta.solana.com'; // 👈 Replace with your QuickNode Endpoint OR clusterApiUrl('mainnet-beta')
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const WALLET_ADDRESS = '2s4DUpzTFs3Czb7pg4UNRpRFoiPXDcBrvof6XUrgHsLZ'; //👈 Replace with your wallet address

async function getAccountBalance() {
    const solBalance = await SOLANA_CONNECTION.getBalance(new PublicKey(WALLET_ADDRESS));
    const tokenAccounts = await SOLANA_CONNECTION.getTokenAccountsByOwner(
        new PublicKey(WALLET_ADDRESS),
        { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") } // Token Program ID
    );

    let totalTokenBalance = 0;
    for (const tokenAccount of tokenAccounts.value) {
        const accountInfo = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(tokenAccount.pubkey));
        const tokenAmount = accountInfo.value.data.parsed.info.tokenAmount.uiAmount;
        totalTokenBalance += tokenAmount;
    }

    console.log(`SOL Balance: ${solBalance / LAMPORTS_PER_SOL} SOL`);
    console.log(`Total Token Balance: ${totalTokenBalance}`);
    console.log(`Total Balance (SOL + Tokens): ${(solBalance / LAMPORTS_PER_SOL) + totalTokenBalance}`);
}

getAccountBalance();