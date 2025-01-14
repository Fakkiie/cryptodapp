interface TokenBalanceResponse {
   balance: number;
   decimals: number;
   tokenAddress: string;
}

export default async function getTokenBalance(walletAddress: string, tokenAddress: string): Promise<TokenBalanceResponse | null> {
   const API_URL = process.env.NEXT_PUBLIC_API_URL;

   try {
   const response = await fetch(`${API_URL}token_balance`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         token_mint_address: tokenAddress,
         wallet_address: walletAddress,
      }),
   });
   console.log(response)
   if (!response.ok) {
      console.error('Failed to fetch token balance:', response.statusText);
      return null;
   }
   return response.json();
   } catch (error) {
      console.error('Error fetching token balance:', error);
      return null;
   }
}