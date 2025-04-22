import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

interface OpenModalButtonProps {
	setIsSideModalOpen: (isOpen: boolean) => void;
	publicKey: string | null;
	setSignInModalOpen: (isOpen: boolean) => void;
}

export default function OpenModalButton({
	setIsSideModalOpen,
	publicKey,
	setSignInModalOpen,
}: OpenModalButtonProps) {
	const [shownPublicKey, setShownPublicKey] = useState<string | null>(null);

	useEffect(() => {
		if (publicKey) {
			setShownPublicKey(
				publicKey?.slice(0, 4) + '...' + publicKey?.slice(-4)
			);
		}
	}, [publicKey]);

	return publicKey ? (
		<button
			onClick={() => setIsSideModalOpen(true)}
			className='border-2 flex items-center border-gray-800 text-sm customShadow bg-neutral-7800 hover:border-orange-600 rounded-full px-4 py-1.5 font-bold hover:bg-orange-600/20 transition-all'
		>
			{/* <img
				src={wallet?.adapter?.icon}
				alt="wallet icon"
				className="w-6 h-6 mr-2"
			/> */}
			{shownPublicKey}
			<svg
				className='w-5 h-5 ml-2'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
			>
				<path
					fill='currentColor'
					d='m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z'
				/>
			</svg>
		</button>
	) : (
		<button
			onClick={() => {
				setSignInModalOpen(true);
			}}
			className='border-2 flex items-center border-gray-800 text-sm bg-neutral-800 hover:border-orange-600 rounded-full px-4 py-1.5 font-bold hover:bg-orange-600/20 transition-all'
		>
			Login or Sign Up
		</button>
	);
}
