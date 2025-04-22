'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import ChartWidget from '@/components/ChartWidget';
import '@/styles/solana-ui.css';
import SideWalletModal from '@/components/SideWalletModal';
import OpenModalButton from '@/components/OpenModalButton';
import Image from 'next/image';
import LimitTokenSelector from '@/components/LimitTokenSelector';
import SwapTokenSelector, { Token } from '@/components/SwapTokenSelector';
import { Auth, useTurnkey } from '@turnkey/sdk-react';
import { sign } from 'crypto';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';

const API_SOL_NETWORK_URL =
	process.env.NEXT_PUBLIC_API_SOL_NETWORK_URL ??
	'https://mainnet.helius-rpc.com/?api-key=b4a36c5c-6a46-4d24-8384-ee428bea8fa8';
const API_SOL_NETWORK_KEY = process.env.NEXT_PUBLIC_API_SOL_NETWORK_KEY ?? '';

export default function Home() {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = API_SOL_NETWORK_URL + API_SOL_NETWORK_KEY;
	const wallets = useMemo(() => [], [network]);
	const [isLimitOrder, setIsLimitOrder] = useState(false);
	const [isSideModalOpen, setIsSideModalOpen] = useState(false);
	const [signInModalOpen, setSignInModalOpen] = useState(false);

	const { turnkey, getActiveClient } = useTurnkey();

	const [loggedIn, setLoggedIn] = useState(false);

	//set tokens for selling and buying
	const [baseCoin, setBaseCoin] = useState<Token>({
		address: 'So11111111111111111111111111111111111111112',
		symbol: 'SOL',
		logoURI:
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
		name: 'Solana',
		decimals: 9,
	});
	const [quoteCoin, setQuoteCoin] = useState<Token>({
		address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
		symbol: 'USDT',
		logoURI:
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
		name: 'Tether',
		decimals: 6,
	});

	// const getPublicKey = async () => {
	// 	const client = await getActiveClient();
	// 	const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

	// 	const wallets = await client?.getWallets({
	// 		organizationId,
	// 	});
	// 	const walletId = wallets?.wallets[0].walletId ?? '';

	// 	const accounts = await client?.getWalletAccounts({
	// 		organizationId,
	// 		walletId,
	// 	});
	// 	console.log('accounts', accounts);

	// 	const publicKey = accounts?.accounts[0].address ?? null;
	// 	console.log('signWith', publicKey);

	// 	return publicKey;
	// };

	const handleBuyingTokenChange = (token: Token | null) => {
		if (token) {
			setQuoteCoin(token);
			localStorage.setItem('quoteCoin', token.symbol);
		}
	};

	const handleSellingTokenChange = (token: Token | null) => {
		if (token) {
			setBaseCoin(token);
			localStorage.setItem('baseCoin', token.symbol);
		}
	};

	useEffect(() => {
		console.log('modal ', isSideModalOpen);
	}, [isSideModalOpen]);

	// useEffect(() => {
	// 	if (getPublicKey() !== null) {
	// 		setLoggedIn(true);
	// 	}
	// }, []);

	const handleAuthSuccess = async () => {
		// toast success
		console.log('Auth successful!');
		// getPublicKey();
		setLoggedIn(true);
		setSignInModalOpen(false);
	};

	const handleAuthError = (errorMessage: string) => {
		// toast error
		console.error(errorMessage);

		setSignInModalOpen(false);
	};

	const authConfig = {
		emailEnabled: true,
		passkeyEnabled: true,
		phoneEnabled: false,
		googleEnabled: true,
		appleEnabled: false,
		facebookEnabled: false,
		walletEnabled: false,
		sessionLengthSeconds: 3600, //1 hour r/w session
	};

	const configOrder = ['socials', 'email', 'phone', 'passkey'];

	return (
		<div className='min-h-screen text-white flex flex-col items-center overflow-hidden bg-neutral-800'>
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<SideWalletModal
							isSideModalOpen={isSideModalOpen}
							setIsSideModalOpen={setIsSideModalOpen}
						/>
						<header className='w-full bg-neutral-900 shadow-md py-4 px-6 flex justify-between items-center'>
							<Image
								className='w-12 h-fit'
								alt='logo'
								src='/logo.png'
								width={48}
								height={64}
							/>
							<div className='flex items-center gap-4'>
								{/* <WalletMultiButton className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition" /> */}
								{/* <WalletDisconnectButton className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition" /> */}
								<button
									onClick={() => setSignInModalOpen(true)}
									className='flex items-center text-sm bg-orange-600/20 hover:bg-orange-600/60 text-white font-semibold py-2 px-4 rounded-full transition active:scale-95 active:bg-orange-600'
								>
									Login
								</button>
								<OpenModalButton
									setIsSideModalOpen={setIsSideModalOpen}
								/>
							</div>
						</header>

						<main className='flex flex-col items-center w-full py-12 gap-8'>
							<div className='w-full max-w-7xl flex flex-col bg-neutral-800 p-6 rounded-lg'>
								<h2 className='text-xl font-semibold mb-4'>
									{baseCoin?.symbol ?? 'N/A'}/
									{quoteCoin?.symbol ?? 'N/A'} Price Chart
								</h2>
								<div className='flex flex-col md:flex-row w-full gap-6'>
									<div className='hidden sm:flex flex-col w-full'>
										<ChartWidget
											baseCoin={baseCoin?.symbol ?? 'SOL'}
											quoteCoin={
												quoteCoin?.symbol ?? 'USDT'
											}
										/>
									</div>
									<div className='flex sm:min-w-96'>
										<div className='flex flex-col w-full max-w-7xl mx-auto bg-neutral-900 p-6 gap-4 rounded-lg shadow-lg'>
											<div className='flex justify-center w-full gap-4'>
												<button
													className={`w-1/3 transition-all border border-transparent text-center rounded-full p-2 font-bold text-sm cursor-pointer ${
														!isLimitOrder
															? 'bg-gradient-to-br from-orange-600/50 to-orange-600/10 bg-orange-600/20 text-white'
															: 'bg-transparent text-white hover:border-orange-600 customShadow'
													}`}
													onClick={() =>
														setIsLimitOrder(false)
													}
												>
													Swap
												</button>
												<button
													className={`w-1/3 transition-all border border-transparent text-center rounded-full p-2 font-bold text-sm cursor-pointer ${
														isLimitOrder
															? 'bg-gradient-to-br from-orange-600/50 to-orange-600/10 bg-orange-600/20 text-white'
															: 'bg-transparent text-white hover:border-orange-600 customShadow'
													}`}
													onClick={() =>
														setIsLimitOrder(true)
													}
												>
													Limits
												</button>
											</div>
											{isLimitOrder ? (
												<LimitTokenSelector
													onBuyingTokenChange={
														handleBuyingTokenChange
													}
													onSellingTokenChange={
														handleSellingTokenChange
													}
													baseCoin={baseCoin}
													quoteCoin={quoteCoin}
												/>
											) : (
												<SwapTokenSelector
													onBuyingTokenChange={
														handleBuyingTokenChange
													}
													onSellingTokenChange={
														handleSellingTokenChange
													}
													baseCoin={baseCoin}
													quoteCoin={quoteCoin}
												/>
											)}
										</div>
										{/* <TokenSelector
											onBuyingTokenChange={
												handleBuyingTokenChange
											}
											onSellingTokenChange={
												handleSellingTokenChange
											}
											baseCoin={baseCoin}
											quoteCoin={quoteCoin}
										/> */}
									</div>
								</div>
							</div>
						</main>

						<button
							className={`w-screen h-screen bg-black/50 z-0 absolute transition-all duration-500 ${
								signInModalOpen
									? 'opacity-100 pointer-events-auto'
									: 'opacity-0 pointer-events-none'
							}`}
							onClick={() => setSignInModalOpen(false)}
						/>
						<div
							className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/20 duration-500 ${
								signInModalOpen
									? 'opacity-100 pointer-events-auto'
									: 'opacity-0 pointer-events-none'
							}`}
						>
							<Auth
								authConfig={authConfig}
								configOrder={configOrder}
								onAuthSuccess={handleAuthSuccess}
								onError={handleAuthError}
							/>
						</div>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</div>
	);
}
