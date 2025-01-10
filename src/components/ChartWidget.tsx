"use client";

import React from "react";
import dynamic from "next/dynamic";

const AdvancedRealTimeChart = dynamic(
	() =>
		import("react-ts-tradingview-widgets").then(
			(mod) => mod.AdvancedRealTimeChart
		),
	{ ssr: false }
);

interface ChartWidgetProps {
	baseCoin: string; //coin swapping from
	quoteCoin: string; //coin swapping to
}

export default function ChartWidget({ quoteCoin }: ChartWidgetProps) {
	//combine the base and quote coins to form the TradingView symbol
	const symbol = `${quoteCoin}`;

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto bg-neutral-900 p-6 rounded-lg shadow-lg">
			<div className="w-full">
				<AdvancedRealTimeChart
					symbol={symbol}
					theme="dark"
					height={400}
					width="100%"
					interval="60"
					toolbar_bg="#222" //tool bar colour
					hide_top_toolbar={true}
					hide_side_toolbar={true}
					withdateranges={true}
					allow_symbol_change={false}
					save_image={false}
					details={false}
					hotlist={false}
					calendar={true}
					// className="rounded-lg overflow-hidden"
				/>
			</div>
		</div>
	);
}
