const ConnectToInjected = async () => {
	let provider = null;
	console.log(window);
	if (typeof window.solana !== "undefined") {
		provider = window.solana;
		try {
			await provider.request({ method: "eth_requestAccounts" });
		} catch (error) {
			throw new Error("User Rejected");
		}
	} else {
		throw new Error("No Web3 Provider found");
	}
	return provider;
};

export default ConnectToInjected;
