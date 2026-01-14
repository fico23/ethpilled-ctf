/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  CTF,
  CTF_RewardDistributed,
  CTF_WinnersChanged,
} from "generated";

CTF.RewardDistributed.handler(async ({ event, context }) => {
  const entity: CTF_RewardDistributed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    winner: event.params.winner,
    position: event.params.position,
    amount: event.params.amount,
  };

  context.CTF_RewardDistributed.set(entity);
});

CTF.WinnersChanged.handler(async ({ event, context }) => {
  const entity: CTF_WinnersChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    newWinner: event.params.newWinner,
  };

  context.CTF_WinnersChanged.set(entity);
});
