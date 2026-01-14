import { CTF } from "generated";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CURRENT_WINNERS_ID = "current";

// Handle new winner - shift everyone down, new winner at position 0
CTF.WinnersChanged.handler(async ({ event, context }) => {
  const currentWinners = await context.CurrentWinners.get(CURRENT_WINNERS_ID);

  // Shift winners down: 0->1, 1->2, 2->3, 3->4, 4 gets dropped
  context.CurrentWinners.set({
    id: CURRENT_WINNERS_ID,
    winner0: event.params.newWinner,
    winner1: currentWinners?.winner0 ?? ZERO_ADDRESS,
    winner2: currentWinners?.winner1 ?? ZERO_ADDRESS,
    winner3: currentWinners?.winner2 ?? ZERO_ADDRESS,
    winner4: currentWinners?.winner3 ?? ZERO_ADDRESS,
    updatedAt: BigInt(event.block.timestamp),
  });

  // Log the winner change event
  context.WinnerChange.set({
    id: `${event.transaction.hash}-${event.logIndex}`,
    newWinner: event.params.newWinner,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    transactionHash: event.transaction.hash,
  });
});

// Handle reward distribution
CTF.RewardDistributed.handler(async ({ event, context }) => {
  context.RewardDistribution.set({
    id: `${event.transaction.hash}-${event.logIndex}`,
    winner: event.params.winner,
    position: Number(event.params.position),
    amount: event.params.amount,
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    transactionHash: event.transaction.hash,
  });
});
