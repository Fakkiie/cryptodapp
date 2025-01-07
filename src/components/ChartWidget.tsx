"use client";

import React from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

interface ChartWidgetProps {
	baseCoin: string; //coin swapping from
	quoteCoin: string; //coin swapping to
}

export default function ChartWidget({ baseCoin, quoteCoin }: ChartWidgetProps) {
	//coins that fill the trading view symbols
	const symbol = `${baseCoin}${quoteCoin}`;

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
			<h2 className="text-center text-white text-2xl font-bold mb-6">
				{baseCoin}/{quoteCoin} Price Chart
			</h2>
			<div className="w-full">
				<AdvancedRealTimeChart
					symbol={symbol}
					theme="dark"
					height={600} 
					width="100%" 
					interval="60"
					className="rounded-lg overflow-hidden"
				/>
			</div>
		</div>
	);
}
