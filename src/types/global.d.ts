interface Window {
    solana?: SolanaProvider;
}

interface QuoteApiResponse {
    inputMint: string;
    inAmount: string;
    outputMint: string;
    outAmount: string;
    otherAmountThreshold: string;
    swapMode: "ExactIn" | "ExactOut"; // Enum-like string value for swap mode
    slippageBps: number;
    platformFee: null | PlatformFee; // Use `null` or define a structure if platform fee details exist
    priceImpactPct: string;
    routePlan: RoutePlan[];
    scoreReport: null | ScoreReport; // Define ScoreReport structure if it's not always null
    contextSlot: number;
    timeTaken: number; // Time in seconds
}

interface PlatformFee {
    // Define this structure based on the full API documentation if it's non-null
    [key: string]: unknown;
}

interface RoutePlan {
    swapInfo: SwapInfo;
    percent: number; // Percentage of the swap going through this route
}

interface SwapInfo {
    ammKey: string; // AMM (Automated Market Maker) identifier
    label: string; // AMM name or label
    inputMint: string; // Mint address of the input token
    outputMint: string; // Mint address of the output token
    inAmount: string; // Input amount in smallest units
    outAmount: string; // Output amount in smallest units
    feeAmount: string; // Fee amount in smallest units
    feeMint: string; // Mint address of the fee token
}

interface ScoreReport {
    // Define the structure here if ScoreReport can be non-null
    [key: string]: unknown;
}
