import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "CTF Game",
  projectId: "f2f20c22f4673e57ba82cec9713fe644",
  chains: [base],
  ssr: false,
});
