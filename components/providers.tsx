'use client';

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@/lib/wagmi";


export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {

  const queryClient = new QueryClient();

  return (
   <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId:
          // replace with your own environment ID
          process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ||
          "f0c901d2-d471-41b1-b23a-c1e3c1578dfa",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
      
    </DynamicContextProvider>
  );
}