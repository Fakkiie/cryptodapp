import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { TurnkeyProvider } from '@turnkey/sdk-react';
import { TurnkeyThemeProvider } from '@turnkey/sdk-react';
import { TurnkeySDKBrowserConfig } from '@turnkey/sdk-browser';
import type { WalletInterface } from '@turnkey/wallet-stamper';
import '@turnkey/sdk-react/styles';
import './globals.css';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
});

const geistMono = Roboto_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Crypto Swap',
	description: 'Fill later',
};

type TurnkeyProviderConfig = TurnkeySDKBrowserConfig & {
	wallet?: WalletInterface;
};

const turnkeyConfig: TurnkeyProviderConfig = {
	apiBaseUrl: 'https://api.turnkey.com',
	defaultOrganizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID || '',
	iframeUrl: 'https://auth.turnkey.com',
};

const theme = {
	'--text-primary': '#ffffff',
	'--button-bg': '#ea580c90',
	'--button-hover-bg': '#ea580c',
	'--button-text': '#ffffff',
	'--button-hover-text': '#ffffff',
	'--button-border': '#ea580c00',
	'--bg-primary': '#ffffff',
	'--card-bg': '#262626',
	'--card-border': '#171717',
	'--card-radius': '8px',
	'--accent-color': '#ffffff90',
	'--button-disabled-bg': '#ea580c50',
	'--button-disabled-border': '#ea580c00',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${inter.variable} ${geistMono.variable} antialiased bg-neutral-900`}
			>
				<TurnkeyProvider config={turnkeyConfig}>
					<TurnkeyThemeProvider theme={theme}>
						{children}
					</TurnkeyThemeProvider>
				</TurnkeyProvider>
			</body>
		</html>
	);
}
