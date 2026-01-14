import { useReadContract, useBlockNumber } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { CTF_ADDRESS, CTF_ABI, INDEXER_URL } from "../contracts/ctf";

// Fetch winners directly from contract
export function useWinners() {
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const result = useReadContract({
    address: CTF_ADDRESS,
    abi: CTF_ABI,
    functionName: "getWinners",
  });

  // Refetch on new blocks
  useEffect(() => {
    if (blockNumber) {
      result.refetch();
    }
  }, [blockNumber, result]);

  return result;
}

// Fetch end timestamp
export function useEndTimestamp() {
  return useReadContract({
    address: CTF_ADDRESS,
    abi: CTF_ABI,
    functionName: "END_TIMESTAMP",
  });
}

// Fetch total amount
export function useTotalAmount() {
  return useReadContract({
    address: CTF_ADDRESS,
    abi: CTF_ABI,
    functionName: "AMOUNT",
  });
}

// Calculate rewards for each position (same logic as contract)
export function calculateRewards(totalAmount: bigint): bigint[] {
  const rewards: bigint[] = [];
  let amountLeft = totalAmount;

  for (let i = 0; i < 4; i++) {
    amountLeft = amountLeft / 2n;
    rewards.push(amountLeft);
    if (i === 3) {
      rewards.push(amountLeft); // Position 5 gets same as position 4
    }
  }

  return rewards;
}

// Format address for display
export function formatAddress(address: string): string {
  if (address === "0x0000000000000000000000000000000000000000") {
    return "Empty Slot";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Indexer types
interface WinnersChangedEvent {
  id: string;
  newWinner: string;
}

interface IndexerResponse {
  data: {
    CTF_WinnersChanged: WinnersChangedEvent[];
  };
}

// Poll indexer for changes (to detect updates)
export function useIndexerChanges() {
  return useQuery({
    queryKey: ["indexerChanges"],
    queryFn: async (): Promise<WinnersChangedEvent[]> => {
      const response = await fetch(INDEXER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              CTF_WinnersChanged(order_by: {id: desc}, limit: 10) {
                id
                newWinner
              }
            }
          `,
        }),
      });

      const json: IndexerResponse = await response.json();
      return json.data?.CTF_WinnersChanged || [];
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });
}

// Hook to detect when winners list has changed
export function useWinnersChangeDetection(currentWinners: readonly `0x${string}`[] | undefined) {
  const previousWinnersRef = useRef<string>("");
  const hasChangedRef = useRef(false);

  useEffect(() => {
    if (!currentWinners) return;

    const winnersString = currentWinners.join(",");
    if (previousWinnersRef.current && previousWinnersRef.current !== winnersString) {
      hasChangedRef.current = true;
      // Reset after animation duration
      setTimeout(() => {
        hasChangedRef.current = false;
      }, 1500);
    }
    previousWinnersRef.current = winnersString;
  }, [currentWinners]);

  return hasChangedRef.current;
}
