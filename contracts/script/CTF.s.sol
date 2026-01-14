⏺ // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.20;

  import {Script, console} from "forge-std/Script.sol";
  import {CTF} from "../src/CTF.sol";

  interface IERC20 {
      function approve(address spender, uint256 amount) external returns (bool);
  }

  contract DeployCTF is Script {
      // ============ CONFIGURATION ============
      // Set these variables before running the script

      address public TOKEN = address(0); // ERC20 token address
      uint256 public AMOUNT = 0;         // Total prize amount
      uint256 public END_TIMESTAMP = 0;  // Game end timestamp

      // =======================================

      function run() external returns (CTF ctf) {
          require(TOKEN != address(0), "TOKEN not set");
          require(AMOUNT > 0, "AMOUNT not set");
          require(END_TIMESTAMP > block.timestamp, "END_TIMESTAMP must be in the future");

          vm.startBroadcast();

          // Approve the CTF contract to pull tokens
          // We need to compute the contract address first, or approve before deploy
          // Using type(uint256).max for simplicity - contract will pull exact AMOUNT
          IERC20(TOKEN).approve(vm.computeCreateAddress(msg.sender, vm.getNonce(msg.sender)), AMOUNT);

          // Deploy CTF - constructor will transferFrom the approved tokens
          ctf = new CTF(TOKEN, AMOUNT, END_TIMESTAMP);

          console.log("CTF deployed at:", address(ctf));
          console.log("Token:", TOKEN);
          console.log("Amount:", AMOUNT);
          console.log("End Timestamp:", END_TIMESTAMP);

          vm.stopBroadcast();
      }
  }