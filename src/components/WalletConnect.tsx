//Dont get use client but oh well, this component will be the connect wallet button
"use client";
import UseWallet from "@/hooks/UseWallet";
import ConnectToInjected from "@/hooks/ConnectToInjected";

export default function WalletConnect() {
	const { handleConnectWallet, handleDisconnectWallet } = UseWallet();

	return (
		<div className="display-flex flex-column align-center justify-center min-h-screen">
			<div className="flex justify-center items-center h-full gap-3 p-10">
				<button
					className="border rounded p-0.5"
					onClick={() => {
						handleConnectWallet();
					}}
				>
					Connect Wallet
				</button>
				<button
					className="border rounded p-0.5"
					onClick={() => {
						handleDisconnectWallet();
					}}
				>
					Disconnect Wallet
				</button>
			</div>
		</div>
	);
}
