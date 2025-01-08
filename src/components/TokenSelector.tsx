//maybe use an alternative to img, img does render but does render pretty slow? so maybe use a different method but 
//works for now
"use client";

import React, { useEffect, useState } from "react";

interface Token {
  address: string;
  symbol: string;
  logoURI: string;
  name: string;
}

interface TokenSelectorProps {
  onBuyingTokenChange: (token: Token | null) => void;
}

export default function TokenSelector({ onBuyingTokenChange }: TokenSelectorProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sellingToken, setSellingToken] = useState<Token | null>(null);
  const [buyingToken, setBuyingToken] = useState<Token | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<"selling" | "buying" | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sellingAmount, setSellingAmount] = useState("");

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_JUP_TOKEN_LIST_URL ||
            "https://tokens.jup.ag/tokens?tags=verified"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tokens");
        }
        const data = await response.json();
        setTokens(data);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };

    fetchTokens();
  }, []);

  //will allow us to close the modal when the button is pressed when set to null
  const handleTokenSelect = (token: Token) => {
    if (isModalOpen === "selling") {
      setSellingToken(token);
    } else if (isModalOpen === "buying") {
      setBuyingToken(token);
      onBuyingTokenChange(token);
    }
    setIsModalOpen(null);  
  };

  //swaps the coins
  const handleSwap = () => {
    const temp = sellingToken;
    setSellingToken(buyingToken);
    setBuyingToken(temp);
    setSellingAmount("");
  };

  //filtering the tokens
  const filteredTokens = tokens.filter((token) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      {/* selling section */}
      <div className="flex flex-col items-center w-full mb-6">
        <h2 className="text-white text-lg font-bold mb-2">Selling</h2>
        <div className="flex items-center gap-2 w-full">
          <button
            className="flex-grow p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
            onClick={() => setIsModalOpen("selling")}
          >
            {sellingToken ? (
              <>
                <img
                  src={sellingToken.logoURI}
                  alt={sellingToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
                {sellingToken.symbol}
              </>
            ) : (
              "Select a token"
            )}
          </button>
          {/* selling ammount field */}
          <input
            type="text"
            placeholder="0.00"
            className="w-1/3 p-3 bg-gray-800 text-white rounded-lg"
            value={sellingAmount}
            onChange={(e) => setSellingAmount(e.target.value)}
            inputMode="decimal"
            pattern="[0-9]*"
          />
        </div>
      </div>

      {/* swap button*/}
      <button
        onClick={handleSwap}
        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mb-6 hover:bg-blue-600 transition-all"
      >
        ⇅
      </button>

      {/* buying section */}
      <div className="flex flex-col items-center w-full">
        <h2 className="text-white text-lg font-bold mb-2">Buying</h2>
        <div className="flex items-center gap-2 w-full">
          <button
            className="flex-grow p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
            onClick={() => setIsModalOpen("buying")}
          >
            {buyingToken ? (
              <>
                <img
                  src={buyingToken.logoURI}
                  alt={buyingToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
                {buyingToken.symbol}
              </>
            ) : (
              "Select a token"
            )}
          </button>
          {/* buying amount field */}
          <input
            type="text"
            placeholder="0.00"
            className="w-1/3 p-3 bg-gray-800 text-white rounded-lg"
            value="" //update this value when we can auto adjust price
            readOnly
          />
        </div>
      </div>

      {/* logic for modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-white text-xl font-bold mb-4">
              Select a Token
            </h2>
            {/* search bar functionality  */}
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Token List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-lg w-full text-left"
                >
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white">{token.symbol}</span>
                </button>
              ))}
            </div>
            {/* close button */}
            <button
              className="w-full p-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
              onClick={() => setIsModalOpen(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
