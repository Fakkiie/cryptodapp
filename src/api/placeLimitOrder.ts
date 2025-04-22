interface LimitOrderResponse {
	balance: number;
	decimals: number;
	tokenAddress: string;
	error: null;
}

interface PlaceLimitOrderParams {
	limitOrderType: 'sell' | 'buy';
	walletAddress: string;
	buyTokenAddress: string;
	sellTokenAddress: string;
	sellTokenAmount: number;
	sellTokenDecimals: number;
	tokenValue: number;
	sellType: 'lesser' | 'greater';
	tokenAddressOfInterest: string;
}

interface CustomError {
	error: {
		message: string;
		code?: number;
		response?: Response;
	};
}

export default async function placeLimitOrder({
	limitOrderType,
	walletAddress,
	buyTokenAddress,
	sellTokenAddress,
	sellTokenAmount,
	sellTokenDecimals,
	tokenValue,
	sellType,
	tokenAddressOfInterest,
}: PlaceLimitOrderParams): Promise<LimitOrderResponse | CustomError> {
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	if (!API_URL) {
		console.error('API URL is not defined');
		return {
			error: {
				message: 'API URL is not defined',
				code: 500,
			},
		};
	}

	try {
		if (limitOrderType === 'buy') {
			const response = await fetch(`${API_URL}create_buy_order`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_address: walletAddress,
					buy_token_address: buyTokenAddress,
					sell_token_address: sellTokenAddress,
					sell_token_amount: sellTokenAmount,
					sell_token_decimals: sellTokenDecimals,
					token_value: tokenValue,
					sell_type: sellType,
					token_address_of_interest: tokenAddressOfInterest,
				}),
			});
			console.log(response);
			if (!response.ok) {
				console.error(
					'Failed to place buy order:',
					response.statusText
				);
				return {
					error: {
						message: 'Failed to place buy order',
						code: response.status,
						response: response,
					},
				};
			}
			return response.json();
		} else if (limitOrderType === 'sell') {
			const response = await fetch(`${API_URL}create_sell_order`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_address: walletAddress,
					buy_token_address: buyTokenAddress,
					sell_token_address: sellTokenAddress,
					sell_token_amount: sellTokenAmount,
					sell_token_decimals: sellTokenDecimals,
					token_value: tokenValue,
					sell_type: sellType,
					token_address_of_interest: tokenAddressOfInterest,
				}),
			});
			console.log(response);
			if (!response.ok) {
				console.error(
					'Failed to fetch token balance:',
					response.statusText
				);
				return {
					error: {
						message: 'Failed to fetch token balance',
						code: response.status,
						response: response,
					},
				};
			}
			return response.json();
		} else {
			return {
				error: { message: 'Invalid limit order type', code: 400 },
			};
		}
	} catch (error) {
		console.error('Error fetching token balance:', error);
		return {
			error: { message: 'Error fetching token balance', code: 500 },
		};
	}
}
