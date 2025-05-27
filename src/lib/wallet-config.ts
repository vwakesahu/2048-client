import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "viem/chains";
import { http } from "viem";

export const config = getDefaultConfig({
  appName: "2048 Game",
  projectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ||
    "78b08c35c811c75100892ca621342158",
  chains: [baseSepolia],
  ssr: false, // Disable SSR
  transports: {
    [baseSepolia.id]: http(),
  },
  batch: {
    multicall: false,
  },
});
