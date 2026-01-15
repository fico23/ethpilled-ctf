import { useReadContract, useBlockNumber } from "wagmi";
import { useEffect, useRef } from "react";
import { CTF_ADDRESS, CTF_ABI } from "../contracts/ctf";

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

// USDC has 6 decimals
const USDC_DECIMALS = 6;

// Calculate rewards for each position (same logic as contract)
// Position 0: 50%, Position 1: 25%, Position 2: 12.5%, Position 3: 6.25%, Position 4: 6.25%
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

// Format USDC amount (6 decimals)
export function formatUSDC(amount: bigint): string {
  const divisor = BigInt(10 ** USDC_DECIMALS);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;

  // Format with 2 decimal places for display
  const fractionalStr = fractionalPart.toString().padStart(USDC_DECIMALS, '0').slice(0, 2);

  return `${integerPart.toLocaleString()}.${fractionalStr}`;
}

// Format address for display
export function formatAddress(address: string): string {
  if (address === "0x0000000000000000000000000000000000000000") {
    return "Empty Slot";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
