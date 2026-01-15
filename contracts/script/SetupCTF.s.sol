// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CTF} from "../src/CTF.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";

contract SetupCTF is Script {
    address constant TOKEN = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // USDC on Base
    uint256 constant PRIZE_AMOUNT = 0.1e6; // 10 USDC
    uint256 constant GAME_DURATION = 24 hours;

    function run() external {
        address[] memory wallets = getWallets();
        uint256 endTimestamp = block.timestamp + GAME_DURATION;

        console.log("=== Setup CTF ===");
        console.log("Token:", TOKEN);
        console.log("Prize:", PRIZE_AMOUNT);
        console.log("Game ends:", endTimestamp);
        console.log("Wallets to whitelist:", wallets.length);

        vm.startBroadcast();

        // 1. Deploy CTF
        CTF ctf = new CTF(TOKEN, PRIZE_AMOUNT, endTimestamp);
        console.log("CTF deployed at:", address(ctf));

        // 2. Fund CTF with prize tokens
        SafeTransferLib.safeTransfer(TOKEN, address(ctf), PRIZE_AMOUNT);
        console.log("Prize funded");

        // 3. Whitelist wallets
        ctf.batchAddWhitelisted(wallets);
        console.log("Wallets whitelisted");

        vm.stopBroadcast();

        console.log("=== Done! ===");
    }

    function getWallets() internal view returns (address[] memory) {
        string memory path = vm.envString("WALLETS_FILE");
        string memory json = vm.readFile(path);
        return abi.decode(vm.parseJson(json, ".wallets"), (address[]));
    }
}
