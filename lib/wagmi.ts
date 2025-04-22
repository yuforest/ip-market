
import { createConfig, http } from "wagmi";
import { soneiumMinato } from "wagmi/chains";

const minato = {
  ...soneiumMinato,
  name: "Soneium Minato",
  // Memo: Download from https://soneium.org/en/brand-kit/
  iconUrl: "/symbol-full-color.svg",
};


export const config = createConfig({
  // make sure to update the chains in the dashboard
  chains: [minato],
  multiInjectedProviderDiscovery: false,
  transports: {
    [minato.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
