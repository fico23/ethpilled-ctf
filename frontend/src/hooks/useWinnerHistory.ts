import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useBlockNumber } from "wagmi";
import { useEffect, useRef, useState } from "react";
import { INDEXER_URL } from "../contracts/ctf";

export interface WinnerHistoryEvent {
  id: string;
  newWinner: string;
  timestamp: string; // BigInt as string from GraphQL
  blockNumber: string;
}

interface IndexerResponse {
  data: {
    CTF_WinnersChanged: WinnerHistoryEvent[];
  };
}

export function useWinnerHistory() {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const result = useQuery({
    queryKey: ["winnerHistory"],
    queryFn: async (): Promise<WinnerHistoryEvent[]> => {
      const response = await fetch(INDEXER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              CTF_WinnersChanged(order_by: {blockNumber: desc}, limit: 50) {
                id
                newWinner
                timestamp
                blockNumber
              }
            }
          `,
        }),
      });

      const json: IndexerResponse = await response.json();
      return json.data?.CTF_WinnersChanged || [];
    },
  });

  // Refetch on new blocks
  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey: ["winnerHistory"] });
    }
  }, [blockNumber, queryClient]);

  return result;
}

// Hook to detect new winners and trigger effects
export function useNewWinnerDetection(history: WinnerHistoryEvent[] | undefined) {
  const [hasNewWinner, setHasNewWinner] = useState(false);
  const previousLengthRef = useRef<number>(0);
  const previousFirstIdRef = useRef<string>("");

  useEffect(() => {
    if (!history || history.length === 0) return;

    const currentLength = history.length;
    const currentFirstId = history[0]?.id || "";

    // Detect new winner: either more events, or different first event
    if (
      previousLengthRef.current > 0 &&
      (currentLength > previousLengthRef.current || currentFirstId !== previousFirstIdRef.current)
    ) {
      setHasNewWinner(true);
      // Reset after animation duration
      setTimeout(() => setHasNewWinner(false), 3000);
    }

    previousLengthRef.current = currentLength;
    previousFirstIdRef.current = currentFirstId;
  }, [history]);

  return hasNewWinner;
}

// Format relative time
export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const eventTime = Number(timestamp) * 1000; // Convert seconds to ms
  const diffMs = now - eventTime;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}
