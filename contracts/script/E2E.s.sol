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

    function getWallets() internal pure returns (address[] memory) {
        address[] memory wallets = new address[](50);

        wallets[0] = 0xd9AfEfA0c25a517f85Fc9ebD53A09b86378372A9;
        wallets[1] = 0x5fAf47b5aA8fc91b2730AA425d31f74F21BE6D84;
        wallets[2] = 0x006758D6b5663b1dE5cDF6809788C642faFeb59E;
        wallets[3] = 0xE20114D36E02026e4038C3E932b64c18D6a1d35B;
        wallets[4] = 0xf61125bb108bB98166B5CA7cD9a98b7b8ED774C3;
        wallets[5] = 0xBafDae0B14ea4aBAd16f66F393A5EeA506B31b4A;
        wallets[6] = 0xAb8E9fd9515e53918DBa61C4D036ae579b20D044;
        wallets[7] = 0x2e381d53ed957e6B7A4dBDbAa8f7850D905f8717;
        wallets[8] = 0x2D6BB992Cb24e37eb6cA0ddF1723E5C97A4d41C6;
        wallets[9] = 0xF34280Ce61e0217c2a646198DcA0444337CAa560;
        wallets[10] = 0x3721Da70B5CdF1fCa7ba3c1B3FC5A9F1EA07E9C0;
        wallets[11] = 0xa213Ccf111299dD568A54dc4C8FD74EB805756Da;
        wallets[12] = 0x630cA39596951e90c2C18979743422c70cbbD175;
        wallets[13] = 0x684777fd09587B0b0EAcFBd6be68369DEa302C03;
        wallets[14] = 0xc2C4845BA602A95A0810628F2f1b66233A85f0ce;
        wallets[15] = 0x793a989aB6E2C1b58C09ffACE6e372F2519Bc992;
        wallets[16] = 0x3199d0E3b25aD2C4dABBcD806C447FDEBa872C3A;
        wallets[17] = 0x62268d4D7107347EA51c71F2Ec0fB7e350e49Eb4;
        wallets[18] = 0xF8e1c26AcD7e4FCABA30e63a7C960B9672fc32e0;
        wallets[19] = 0x1d02D89203AaB6C6ADa35Ee3A1b45a2Fa9F196A5;
        wallets[20] = 0x11C5FbED9B0faf483111d8f2C4678DaaB4e59e72;
        wallets[21] = 0xd4bC1100279C2c065E1E1A2F4532CAb5AF26A3d9;
        wallets[22] = 0xE928d7d8Ee37f817817b7AedDcD4263F96d49959;
        wallets[23] = 0x1d67E6e83Bb0cbd1ea554d74477410a7185bb214;
        wallets[24] = 0x37ca9bFCF2dD19664c0E2fa030C6015262Dd7B1E;
        wallets[25] = 0x165e647ceacd39D2761aFC4d250cc27b727D9218;
        wallets[26] = 0xa6268288F1789fe845D0a3e1E8f320af005A45dE;
        wallets[27] = 0x3275c4E33145f55860CE6F3e1Ec67Cbe520d2973;
        wallets[28] = 0x5862d337f7866C4c27c9c4e1241B90BCC66415DA;
        wallets[29] = 0x974EE7B8a01835ED70278765767b028687eEf699;
        wallets[30] = 0xdd83AcE88Ef2B6C9119Be520526455A89C3ef751;
        wallets[31] = 0x0f908F050F6739865e4cC330D899b94d8BdAC4da;
        wallets[32] = 0xD86f17A45b3660c76fDE95B83Cfc701723d69cB2;
        wallets[33] = 0x6272dE4E90D12C55C136D9E05f3fe5E8871B6CB3;
        wallets[34] = 0x69728818C58E5f4A13c9c47E3bF40178a4cA6dD0;
        wallets[35] = 0x4C04a16315AF51aeaAE5363Fb327580528aC6AB1;
        wallets[36] = 0x74830794BeDA406C24E9AD10F0Cc473869648361;
        wallets[37] = 0x56FAa70CDaD9C35610ae3936b65097E1A2A5cf1e;
        wallets[38] = 0x0a0aE9dBC9B8a79BE0e792fEF7BC09017e026667;
        wallets[39] = 0xFc0317e3d7D8CFb631332BA8D23485f782b4d233;
        wallets[40] = 0x116EBc38B739B8e418224293D36e9309108d5e25;
        wallets[41] = 0x63aE1C3b16037B0cfE9DF9938469305E571505Ed;
        wallets[42] = 0xcCA8bf1A60Af723DDF367F334270c7c90c6E714b;
        wallets[43] = 0x35016176453e1418fdAD7DfF2c80531286fbdb63;
        wallets[44] = 0x097E9Fa339A1Ebf5031763dBe6C25bbb6d61E4d1;
        wallets[45] = 0x50AcB974384D133392869049a72ab588AF48584F;
        wallets[46] = 0x83b93D9290eC0015f4153D81360f04bb8e291d0C;
        wallets[47] = 0xe1dAD3D210c1cbd77F9348307a463Ed6ee9B0648;
        wallets[48] = 0x9FA66d3D810C209F1B671E97B47cD0E4D88bC87C;
        wallets[49] = 0xa9880Bc946d12DD4Ce496De4ba96977c87b3828E;

        return wallets;
    }
}
