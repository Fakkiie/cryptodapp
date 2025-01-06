//Dont get use client but oh well, this component will be the connect wallet button
"use client";
import UseWallet from "@/hooks/UseWallet";

export default function WalletConnect() {
    const { handleConnectWallet } = UseWallet();

    return (
        <div className="display-flex flex-column align-center justify-center min-h-screen">
            <div className="flex justify-center items-center h-full">
                <button onClick={handleConnectWallet}>Connect Wallet</button>
            </div>
        </div>
    );
}
