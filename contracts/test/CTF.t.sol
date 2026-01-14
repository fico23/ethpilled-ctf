// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {CTF} from "../src/CTF.sol";
import {ERC20} from "solady/tokens/ERC20.sol";

contract MockERC20 is ERC20 {
    function name() public pure override returns (string memory) {
        return "Mock Token";
    }

    function symbol() public pure override returns (string memory) {
        return "MOCK";
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract CTFTest is Test {
    CTF public ctf;
    MockERC20 public token;

    address public owner = address(this);
    address public player1 = address(0x1);
    address public player2 = address(0x2);
    address public player3 = address(0x3);
    address public player4 = address(0x4);
    address public player5 = address(0x5);
    address public player6 = address(0x6);

    uint256 public constant AMOUNT = 1600 ether;
    uint256 public endTimestamp;

    function setUp() public {
        token = new MockERC20();
        token.mint(owner, AMOUNT);

        endTimestamp = block.timestamp + 1 days;

        token.approve(address(0), type(uint256).max); // Will be replaced with actual CTF address
    }

    function _deployCTF() internal {
        token.approve(address(0), 0); // Reset any previous approval

        // Calculate the address where CTF will be deployed
        address predictedAddress = vm.computeCreateAddress(address(this), vm.getNonce(address(this)));
        token.approve(predictedAddress, AMOUNT);

        ctf = new CTF(address(token), AMOUNT, endTimestamp);
    }

    function test_constructor() public {
        _deployCTF();

        assertEq(ctf.owner(), owner);
        assertEq(ctf.TOKEN(), address(token));
        assertEq(ctf.AMOUNT(), AMOUNT);
        assertEq(ctf.END_TIMESTAMP(), endTimestamp);
        assertEq(token.balanceOf(address(ctf)), AMOUNT);
    }

    function test_setWhitelisted() public {
        _deployCTF();

        assertFalse(ctf.whitelisted(player1));

        ctf.setWhitelisted(player1, true);
        assertTrue(ctf.whitelisted(player1));

        ctf.setWhitelisted(player1, false);
        assertFalse(ctf.whitelisted(player1));
    }

    function test_setWhitelisted_revertIfNotOwner() public {
        _deployCTF();

        vm.prank(player1);
        vm.expectRevert();
        ctf.setWhitelisted(player1, true);
    }

    function test_game_revertIfNotWhitelisted() public {
        _deployCTF();

        vm.prank(player1);
        vm.expectRevert(CTF.NotWhitelisted.selector);
        ctf.game();
    }

    function test_game_shiftsWinners() public {
        _deployCTF();

        ctf.setWhitelisted(player1, true);
        ctf.setWhitelisted(player2, true);

        vm.prank(player1);
        ctf.game();

        address[5] memory winners = ctf.getWinners();
        assertEq(winners[0], player1);
        assertEq(winners[1], address(0));

        vm.prank(player2);
        ctf.game();

        winners = ctf.getWinners();
        assertEq(winners[0], player2);
        assertEq(winners[1], player1);
        assertEq(winners[2], address(0));
    }

    function test_game_shiftsAllFiveWinners() public {
        _deployCTF();

        ctf.setWhitelisted(player1, true);
        ctf.setWhitelisted(player2, true);
        ctf.setWhitelisted(player3, true);
        ctf.setWhitelisted(player4, true);
        ctf.setWhitelisted(player5, true);
        ctf.setWhitelisted(player6, true);

        vm.prank(player1);
        ctf.game();
        vm.prank(player2);
        ctf.game();
        vm.prank(player3);
        ctf.game();
        vm.prank(player4);
        ctf.game();
        vm.prank(player5);
        ctf.game();

        address[5] memory winners = ctf.getWinners();
        assertEq(winners[0], player5);
        assertEq(winners[1], player4);
        assertEq(winners[2], player3);
        assertEq(winners[3], player2);
        assertEq(winners[4], player1);

        // Now player6 plays, player1 should be pushed out
        vm.prank(player6);
        ctf.game();

        winners = ctf.getWinners();
        assertEq(winners[0], player6);
        assertEq(winners[1], player5);
        assertEq(winners[2], player4);
        assertEq(winners[3], player3);
        assertEq(winners[4], player2);
    }

    function test_game_distributesRewardsAfterEnd() public {
        _deployCTF();

        ctf.setWhitelisted(player1, true);
        ctf.setWhitelisted(player2, true);
        ctf.setWhitelisted(player3, true);
        ctf.setWhitelisted(player4, true);
        ctf.setWhitelisted(player5, true);

        vm.prank(player1);
        ctf.game();
        vm.prank(player2);
        ctf.game();
        vm.prank(player3);
        ctf.game();
        vm.prank(player4);
        ctf.game();
        vm.prank(player5);
        ctf.game();

        // Warp to after end timestamp
        vm.warp(endTimestamp + 1);

        vm.prank(player1);
        ctf.game();

        // Expected rewards: 50%, 25%, 12.5%, 6.25%, 6.25%
        assertEq(token.balanceOf(player5), AMOUNT / 2); // 50% = 800 ether
        assertEq(token.balanceOf(player4), AMOUNT / 4); // 25% = 400 ether
        assertEq(token.balanceOf(player3), AMOUNT / 8); // 12.5% = 200 ether
        assertEq(token.balanceOf(player2), AMOUNT / 16); // 6.25% = 100 ether
        assertEq(token.balanceOf(player1), AMOUNT / 16); // 6.25% = 100 ether
    }

    function test_game_distributesUnclaimedToOwner() public {
        _deployCTF();

        ctf.setWhitelisted(player1, true);
        ctf.setWhitelisted(player2, true);

        // Only 2 players
        vm.prank(player1);
        ctf.game();
        vm.prank(player2);
        ctf.game();

        uint256 ownerBalanceBefore = token.balanceOf(owner);

        // Warp to after end timestamp
        vm.warp(endTimestamp + 1);

        vm.prank(player1);
        ctf.game();

        // player2 gets 50%, player1 gets 25%
        // positions 2,3,4 (12.5% + 6.25% + 6.25% = 25%) go to owner
        assertEq(token.balanceOf(player2), AMOUNT / 2); // 50%
        assertEq(token.balanceOf(player1), AMOUNT / 4); // 25%

        uint256 ownerShare = AMOUNT / 8 + AMOUNT / 16 + AMOUNT / 16; // 25%
        assertEq(token.balanceOf(owner), ownerBalanceBefore + ownerShare);
    }

    function test_game_allUnclaimedGoesToOwner() public {
        _deployCTF();

        ctf.setWhitelisted(player1, true);

        uint256 ownerBalanceBefore = token.balanceOf(owner);

        // No one plays, just end the game
        vm.warp(endTimestamp + 1);

        vm.prank(player1);
        ctf.game();

        // All rewards go to owner
        assertEq(token.balanceOf(owner), ownerBalanceBefore + AMOUNT);
    }

    function test_getWinners() public {
        _deployCTF();

        address[5] memory winners = ctf.getWinners();
        for (uint256 i = 0; i < 5; i++) {
            assertEq(winners[i], address(0));
        }

        ctf.setWhitelisted(player1, true);
        vm.prank(player1);
        ctf.game();

        winners = ctf.getWinners();
        assertEq(winners[0], player1);
    }

    function test_winnersPublicGetter() public {
        _deployCTF();

        ctf.setWhitelisted(player1, true);
        vm.prank(player1);
        ctf.game();

        assertEq(ctf.winners(0), player1);
        assertEq(ctf.winners(1), address(0));
    }
}
