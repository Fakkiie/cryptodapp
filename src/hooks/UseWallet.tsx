export default function UseWallet() {
    const handleConnectWallet = async () => {
        if (window.nestwallet.solana) {
            console.log("Nest Wallet detected!");

            try {
                const response = await window.nestwallet.solana.__private_17_connect();
            } catch (error) {
                console.error("Failed to connect to Nest Wallet:", error);
            }
        } else {
            console.error("Nest Wallet not detected. Please install Nest Wallet.");
        }
    };

    return {
        handleConnectWallet,
    };
}
