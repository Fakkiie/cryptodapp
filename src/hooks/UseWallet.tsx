export default function UseWallet() {
	const handleConnectWallet = async () => {
		if (window.nestwallet.solana) {
			console.log("Nest Wallet detected!");

			try {
				const response =
					await window.nestwallet.solana.__private_17_connect();
				const walletAddress = response.accounts[0].__private_0_address;
				console.log("Wallet Address:", walletAddress);
			} catch (error) {
				console.error("Failed to connect to Nest Wallet:", error);
			}
		} else {
			console.error(
				"Nest Wallet not detected. Please install Nest Wallet."
			);
		}
	};

	const handleDisconnectWallet = async () => {
		console.log(window.nestwallet.solana);
		if (window.nestwallet.solana) {
			console.log("Nest Wallet detected!");

			try {
				const response =
					await window.nestwallet.solana.__private_18_disconnect();
				console.log("Wallet Disconnected");
			} catch (error) {
				console.error("Failed to disconnect from Nest Wallet:", error);
			}
		} else {
			console.error(
				"Nest Wallet not detected. Please install Nest Wallet."
			);
		}
	};

	return {
		handleConnectWallet,
		handleDisconnectWallet,
	};
}
