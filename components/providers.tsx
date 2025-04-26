"use client";

import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  getAuthToken,
} from "@/lib/auth/dynamic";
import { config } from "@/lib/wagmi";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getCsrfToken,
  getSession,
  SessionProvider,
  signOut,
} from "next-auth/react";
import { soneiumMinato } from "viem/chains";
import { WagmiProvider } from "wagmi";
export default function Providers({ children }: { children: React.ReactNode }) {
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
        overrides: {
          evmNetworks: [
            {
              chainId: soneiumMinato.id,
              networkId: soneiumMinato.id,
              name: soneiumMinato.name,
              nativeCurrency: soneiumMinato.nativeCurrency,
              rpcUrls: [...soneiumMinato.rpcUrls.default.http],
              iconUrls: ["https://soneium.org/favicon.ico"],
              blockExplorerUrls: [soneiumMinato.blockExplorers.default.url],
            },

          ],
        },
        events: {
          onAuthSuccess: async (event) => {
            const authToken = getAuthToken();

            if (!authToken) {
              console.error("No auth token found");
              return;
            }

            const csrfToken = await getCsrfToken();

            if (!csrfToken) {
              console.error("No CSRF token found");
              return;
            }

            fetch("/api/auth/callback/credentials", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `csrfToken=${encodeURIComponent(
                csrfToken
              )}&token=${encodeURIComponent(authToken)}`,
            })
              .then((res) => {
                if (res.ok) {
                  getSession();
                } else {
                  console.error("Failed to log in");
                }
              })
              .catch((error) => {
                // Handle any exceptions
                console.error("Error logging in", error);
              });
          },
          onLogout: async (event) => {
            await signOut({ callbackUrl: "/" });
          },
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <SessionProvider>{children}</SessionProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
