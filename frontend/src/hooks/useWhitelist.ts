import { useReadContract, useAccount } from "wagmi";
import { CTF_ADDRESS, CTF_ABI } from "../contracts/ctf";

export function useIsWhitelisted() {
  const { address, isConnected } = useAccount();

  const result = useReadContract({
    address: CTF_ADDRESS,
    abi: CTF_ABI,
    functionName: "whitelisted",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  return {
    isWhitelisted: result.data ?? false,
    isLoading: result.isLoading,
    isConnected,
  };
}
