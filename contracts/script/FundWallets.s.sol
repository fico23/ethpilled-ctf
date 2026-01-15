// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";

interface IDisperse {
    function disperseEther(address[] calldata recipients, uint256[] calldata values) external payable;
}

contract FundWallets is Script {
    IDisperse constant DISPERSE = IDisperse(0xD152f549545093347A162Dce210e7293f1452150);
    uint256 constant AMOUNT_PER_WALLET = 0.00001 ether;

    function run() external {
        address[] memory wallets = getWallets();
        uint256[] memory values = new uint256[](wallets.length);

        uint256 totalEth = wallets.length * AMOUNT_PER_WALLET;
        for (uint256 i = 0; i < wallets.length; i++) {
            values[i] = AMOUNT_PER_WALLET;
        }

        console.log("=== Fund Wallets ===");
        console.log("Wallets:", wallets.length);
        console.log("ETH per wallet:", AMOUNT_PER_WALLET);
        console.log("Total ETH:", totalEth);

        vm.startBroadcast();
        DISPERSE.disperseEther{value: totalEth}(wallets, values);
        vm.stopBroadcast();

        console.log("=== Done! ===");
    }

    function getWallets() internal view returns (address[] memory) {
        string memory path = vm.envString("WALLETS_FILE");
        string memory json = vm.readFile(path);
        return abi.decode(vm.parseJson(json, ".wallets"), (address[]));
    }
}
