"use client";

import React from "react";

export interface SelectedToken {
	tokenAddress: string;
	name: string;
	symbol: string;
	image: string;
	handleOpenTokenModal: () => void;
}
export default function TokenList({
	tokenAddress,
	name,
	symbol,
	image,
	handleOpenTokenModal,
}: SelectedToken) {
	return (
		<>
			<button className="p-2 flex gap-5 rounded-lg bg-gray-800 border border-gray-700 text-white">
				<img
					src={image}
					alt={name}
					className="w-6 h-6 rounded-full object-contain"
				/>
			</button>
		</>
	);
}
