export const CTF_ADDRESS = "0x9d6c330dF06C3fe305135c7DA66A8B5e552CDD49" as const;

export const CTF_ABI = [
  {
    type: "function",
    name: "game",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getWinners",
    inputs: [],
    outputs: [{ name: "", type: "address[5]", internalType: "address[5]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "whitelisted",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "END_TIMESTAMP",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "AMOUNT",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "WinnersChanged",
    inputs: [
      { name: "newWinner", type: "address", indexed: true, internalType: "address" },
    ],
  },
  {
    type: "event",
    name: "RewardDistributed",
    inputs: [
      { name: "winner", type: "address", indexed: true, internalType: "address" },
      { name: "position", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
    ],
  },
] as const;

export const INDEXER_URL = "https://indexer.dev.hyperindex.xyz/6db0b95/v1/graphql";
