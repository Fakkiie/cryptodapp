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
	const { publicKey, disconnect } = useWallet();
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
				className={`z-[100] w-[90vw] md:w-1/2 lg:w-1/4 border-gray-500 bg-neutral-800 h-screen fixed right-0 transition-all duration-300 flex flex-col ${
					!isSideModalOpen
						? "translate-x-full pointer-events-none"
						: "pointer-events-auto"
				}`}
			>
				<div className="flex items-center justify-between px-6 pt-6 bg-black/10">
					<a
						href={`https://solscan.io/account/${publicKeyString}`}
						target="_blank"
						className="text-sm flex items-center gap-1"
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
						className="ml-auto rounded-full transition-all border border-transparent hover:border-white/20 hover:bg-white/10 p-2 active:scale-95"
					>
						<svg
							className="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M10.586 12L2.793 4.207l1.414-1.414L12 10.586l7.793-7.793l1.414 1.414L13.414 12l7.793 7.793l-1.414 1.414L12 13.414l-7.793 7.793l-1.414-1.414z"
							/>
						</svg>
					</button>
				</div>
				<div className="px-6 pb-6 pt-2 bg-black/10 flex justify-between items-center">
					<div className="flex flex-col">
						<h1 className="text-3xl font-bold">$0.00</h1>
						<p className="text-gray-500">~0.00000000 SOL</p>
					</div>
					<div className="flex gap-3 items-center">
						{/* Copy Button */}
						<button
							onClick={() => {
								if (!publicKey) {
									return;
								}
								navigator.clipboard.writeText(
									publicKey?.toBase58() ?? ""
								);
							}}
							className="rounded-full transition-all border border-transparent hover:border-white/20 hover:bg-white/10 p-2 active:scale-95"
						>
							<svg
								className="w-5 h-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1 1 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1zM5.002 8L5 20h10V8zM9 6h8v10h2V4H9z"
								/>
							</svg>
						</button>
						{/* Disconnect Button */}
						<button
							onClick={() => {
								disconnect();
								setIsSideModalOpen(false);
							}}
							className="rounded-full transition-all border border-transparent hover:border-white/20 hover:bg-white/10 p-2 active:scale-95"
						>
							<svg
								className="w-5 h-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a9.99 9.99 0 0 1 8 4h-2.71a8 8 0 1 0 .001 12h2.71A9.99 9.99 0 0 1 12 22m7-6v-3h-8v-2h8V8l5 4z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
