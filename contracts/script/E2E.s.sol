// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CTF} from "../src/CTF.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";

contract E2E is Script {
    // Config
    address constant TOKEN = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // USDC on Base
    uint256 constant PRIZE_AMOUNT = 10e6; // 10 USDC
    uint256 constant GAME_DURATION = 1 hours;

    // 0.0001 ETH per wallet = ~44 txs at 75k gas @ 0.03 gwei
    uint256 constant AMOUNT_PER_WALLET = 0.0001 ether;

    function run() external {
        address[] memory wallets = getWallets();
        uint256 endTimestamp = block.timestamp + GAME_DURATION;

        console.log("=== E2E Workshop Setup ===");
        console.log("Token:", TOKEN);
        console.log("Prize:", PRIZE_AMOUNT);
        console.log("Game ends:", endTimestamp);
        console.log("Wallets:", wallets.length);
        console.log("ETH per wallet:", AMOUNT_PER_WALLET);
        console.log("Total ETH needed:", wallets.length * AMOUNT_PER_WALLET);

        vm.startBroadcast();

        // 1. Deploy CTF
        CTF ctf = new CTF(TOKEN, PRIZE_AMOUNT, endTimestamp);
        console.log("CTF deployed at:", address(ctf));

        // 2. Fund CTF with prize tokens
        SafeTransferLib.safeTransfer(TOKEN, address(ctf), PRIZE_AMOUNT);
        console.log("Prize funded");

        // 3. Fund wallets + whitelist
        for (uint256 i = 0; i < wallets.length; i++) {
            (bool success,) = wallets[i].call{value: AMOUNT_PER_WALLET}("");
            require(success, "ETH transfer failed");
            ctf.setWhitelisted(wallets[i], true);
        }
        console.log("Wallets funded and whitelisted");

        vm.stopBroadcast();

        console.log("=== Done! ===");
    }

    function getWallets() internal view returns (address[] memory) {
        string memory path = vm.envString("WALLETS_FILE");
        string memory json = vm.readFile(path);
        address[] memory wallets = abi.decode(vm.parseJson(json, ".wallets"), (address[]));
        return wallets;
    }
}
