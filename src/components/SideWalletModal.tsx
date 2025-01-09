"use client";
import { useWallet, ConnectionContext } from "@solana/wallet-adapter-react";
import { useEffect, useState, useContext } from "react";

interface SideWalletModalProps {
	isSideModalOpen: boolean;
	setIsSideModalOpen: (isOpen: boolean) => void;
}

export default function SideWalletModal({
	isSideModalOpen,
	setIsSideModalOpen,
}: SideWalletModalProps) {
	const { publicKey } = useWallet();
	const endpoint = useContext(ConnectionContext);
	const [shownPublicKey, setShownPublicKey] = useState<string | null>(null);
	const [publicKeyString, setPublicKeyString] = useState<string | null>(null);

	useEffect(() => {
		if (publicKey) {
			const pkStr = publicKey.toBase58();
			setPublicKeyString(pkStr);
			setShownPublicKey(pkStr?.slice(0, 4) + "..." + pkStr?.slice(-4));
		}
	}, [publicKey]);

	useEffect(() => {
		console.log("ran");
		if (!publicKey) {
			return;
		}
		const getWalletInfo = async () => {
			const walletInfoResponse = await endpoint.connection.getAccountInfo(
				publicKey
			);
			console.log(walletInfoResponse);
		};
		getWalletInfo();
	}, []);

	return (
		<>
			<div
				className={`z-[90] bg-black fixed w-screen h-screen transition-all delay-100 ${
					isSideModalOpen
						? "opacity-30 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			></div>
			<div
				className={`z-[100] w-1/4 p-6 border-gray-500 bg-gray-800 h-screen fixed right-0 transition-all duration-300 flex flex-col ${
					!isSideModalOpen
						? "translate-x-full pointer-events-none"
						: "pointer-events-auto"
				}`}
			>
				<div className="flex items-center justify-between">
					<a
						href={`https://solscan.io/account/${publicKeyString}`}
						target="_blank"
						className="text-sm flex items-center gap-1"
						onClick={() => {
							if (!publicKey) {
								return;
							}
							navigator.clipboard.writeText(
								publicKey?.toBase58() ?? ""
							);
						}}
					>
						<svg
							className="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12z"
							/>
						</svg>
						{shownPublicKey}
					</a>
					<button
						onClick={() => setIsSideModalOpen(false)}
						className="ml-auto"
					>
						Close modal
					</button>
				</div>
			</div>
		</>
	);
}
