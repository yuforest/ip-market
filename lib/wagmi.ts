import { createConfig, http } from "wagmi";
import { soneiumMinato } from "wagmi/chains";

const minato = {
  ...soneiumMinato,
  name: "Soneium Minato",
  // Memo: Download from https://soneium.org/en/brand-kit/
  iconUrl: "/symbol-full-color.svg",
};

// Get the SCS API key from environment variables
const scsApiKey = process.env.NEXT_PUBLIC_SCS_API_KEY || "";

export const config = createConfig({
  // make sure to update the chains in the dashboard
  chains: [minato],
  multiInjectedProviderDiscovery: false,
  transports: {
    [minato.id]: http(`https://soneium-minato.rpc.scs.startale.com?apikey=${scsApiKey}`),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
