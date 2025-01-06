"use client";

interface WalletModalProps {
	wallets: WalletsType[];
	openWalletModal: boolean;
	setOpenWalletModal: (value: boolean) => void;
}

interface WalletsType {
	info?: WalletInfoType;
	provider?: any;
}

interface WalletInfoType {
	icon: string;
	name: string;
	rdns: string;
	uuid: string;
}

export default function WalletModal({
	wallets,
	openWalletModal,
	setOpenWalletModal,
}: WalletModalProps) {
	return (
		openWalletModal && (
			<>
				<div className="fixed w-screen h-[100vh] top-0 z-50 opacity-50 bg-black"></div>
				<div className="fixed p-4 gap-4 min-w-[30vw] rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white flex flex-col">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-medium text-2xl ">
								Connect a Wallet
							</h1>
							<p>You must connect to a Solana wallet</p>
						</div>
						<button
							className="text-black w-10 h-10 hover:bg-gray-100 rounded-full p-2 transition-all active:scale-95"
							onClick={() => setOpenWalletModal(false)}
						>
							<svg
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
					<hr />
					<div className="justify-center flex w-full">
						<div className="grid grid-cols-2 gap-2 w-full">
							{wallets?.length &&
								wallets.map((wallet: any) => {
									return (
										<button
											key={wallet.info.name}
											className="border flex rounded-lg p-2 items-center gap-2 w-full shrink-0 hover:bg-gray-100 transition-all"
										>
											<img
												className="w-8 h-8 object-contain"
												src={wallet.info.icon}
												alt={wallet.info.name}
											/>
											<h1 className="text-xl font-medium">
												{wallet.info.name}
											</h1>
										</button>
									);
								})}
						</div>
					</div>
				</div>
			</>
		)
	);
}
