import { createWalletClient, createPublicClient, http, parseGwei, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const CTF = "0x9d6c330dF06C3fe305135c7DA66A8B5e552CDD49";
const END_TIMESTAMP = 1768755600n;
const GAME_DATA = encodeFunctionData({ abi: [{ type: "function", name: "game", inputs: [], outputs: [] }], functionName: "game" });

const keys = JSON.parse(Bun.env.PRIVATE_KEYS || "[]") as `0x${string}`[];
const rpcs = JSON.parse(Bun.env.RPCS || "[]") as string[];
if (!keys.length || !rpcs.length) throw new Error("Missing PRIVATE_KEYS or RPCS");
const pub = createPublicClient({ chain: base, transport: http(rpcs[0]) });
const accounts = keys.map((k) => privateKeyToAccount(k));

const broadcastAll = async (nonces: number[]) => {
  await Promise.allSettled(
    accounts.flatMap((account, i) =>
      rpcs.map((rpc) =>
        createWalletClient({ account, chain: base, transport: http(rpc) })
          .sendTransaction({
            to: CTF,
            data: GAME_DATA,
            maxFeePerGas: parseGwei("1"),
            maxPriorityFeePerGas: 1n,
            nonce: nonces[i],
          })
          .then((h) => console.log(`${account.address.slice(0, 8)}: ${h}`))
          .catch((e) => console.log(`${account.address.slice(0, 8)}: ${e.message?.slice(0, 50)}`))
      )
    )
  );
};

const snipe = async () => {
  const block = await pub.getBlock();
  const currentTs = block.timestamp;

  // Base has 2s block time. Find last 2 valid blocks (where block.timestamp <= END_TIMESTAMP)
  const blocksUntilEnd = (END_TIMESTAMP - currentTs) / 2n;
  const lastValidBlock = block.number + blocksUntilEnd;
  const secondToLastBlock = lastValidBlock - 1n;

  // Calculate when these blocks will be mined (their timestamps)
  const secondToLastTs = currentTs + 2n * (secondToLastBlock - block.number);
  const lastValidTs = currentTs + 2n * (lastValidBlock - block.number);

  console.log(`Current: block ${block.number}, ts=${currentTs}`);
  console.log(`Second-to-last: block ${secondToLastBlock}, ts=${secondToLastTs}`);
  console.log(`Last valid: block ${lastValidBlock}, ts=${lastValidTs}`);

  // Sleep until 500ms before second-to-last block
  const wakeUpTime = Number(secondToLastTs) * 1000 - 500;
  const sleepMs = wakeUpTime - Date.now();

  console.log(`Sleeping ${(sleepMs / 1000).toFixed(1)}s until ${new Date(wakeUpTime).toISOString()}`);
  if (sleepMs > 0) await Bun.sleep(sleepMs);

  // Get current nonces
  const nonces = await Promise.all(
    accounts.map((acc) => pub.getTransactionCount({ address: acc.address }))
  );

  // Round 1: Broadcast for second-to-last block
  console.log("ROUND 1 - Broadcasting for second-to-last block");
  await broadcastAll(nonces);

  // Wait for second-to-last block to be mined
  while ((await pub.getBlockNumber()) < secondToLastBlock) {
    await Bun.sleep(100);
  }

  // Round 2: Broadcast for last block (nonce + 1)
  console.log("ROUND 2 - Broadcasting for last block");
  await broadcastAll(nonces.map((n) => n + 1));
};

snipe();
