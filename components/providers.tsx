'use client';

import { DynamicContextProvider, getAuthToken } from "@/lib/auth/dynamic";
import { EthereumWalletConnectors } from "@/lib/auth/dynamic";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@/lib/wagmi";
import { getCsrfToken, getSession, SessionProvider, signOut } from "next-auth/react";

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
          }

        }
      }}
    >

      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
          <SessionProvider>
            {children}
          </SessionProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>

    </DynamicContextProvider>
  );
}