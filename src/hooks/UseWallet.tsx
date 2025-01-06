//this hook is used to connect the wallet and will be used as helper functions
export default function UseWallet() {
    const handleConnectWallet = () => {
        console.log("Wallet connected");
    };

    return {
        handleConnectWallet
    };
}