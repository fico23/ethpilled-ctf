// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CTF} from "../src/CTF.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";

contract DeployCTF is Script {
    function run() external returns (CTF ctf) {
        address token = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // ERC20 token address
        uint256 amount = 10e6; // Total prize amount
        uint256 endTimestamp = block.timestamp + 1 hours; // Game end timestamp

        vm.startBroadcast();

        ctf = new CTF(token, amount, endTimestamp);

        SafeTransferLib.safeTransfer(token, address(ctf), amount);

        console.log("CTF deployed at:", address(ctf));
        console.log("Token:", token);
        console.log("Amount:", amount);
        console.log("End Timestamp:", endTimestamp);

        vm.stopBroadcast();
    }
}
