// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "solady/auth/Ownable.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";

contract CTF is Ownable {
    error NotWhitelisted();
    error GameNotStarted();
    error GameEnded();
    error GameNotEnded();

    event WinnersChanged(address indexed newWinner);
    event RewardDistributed(address indexed winner, uint256 position, uint256 amount);

    mapping(address => bool) public whitelisted;

    address public immutable TOKEN;
    uint256 public immutable AMOUNT;
    uint256 public immutable END_TIMESTAMP;

    address[5] public winners;

    constructor(address token, uint256 amount, uint256 endTimestamp) {
        _initializeOwner(msg.sender);
        TOKEN = token;
        AMOUNT = amount;
        END_TIMESTAMP = endTimestamp;
    }

    function setWhitelisted(address _address, bool _whitelisted) external onlyOwner {
        whitelisted[_address] = _whitelisted;
    }

    function game() external {
        if (!whitelisted[msg.sender]) revert NotWhitelisted();

        if (block.timestamp < END_TIMESTAMP) {
            for (uint256 i = 4; i > 0; i--) {
                winners[i] = winners[i - 1];
            }
            winners[0] = msg.sender;
            emit WinnersChanged(msg.sender);
        } else {
            // Distribute rewards
            _distributeRewards();
        }
    }

    function _distributeRewards() internal {
        address owner_ = owner();
        uint256 amountLeft = AMOUNT;
        for (uint256 i; i < 4; ++i) {
            amountLeft /= 2;
            address winner = winners[i];
            address recipient = winner == address(0) ? owner_ : winner;
            SafeTransferLib.safeTransfer(TOKEN, recipient, amountLeft);
            emit RewardDistributed(recipient, i, amountLeft);

            if (i == 3) {
                winner = winners[4];
                recipient = winner == address(0) ? owner_ : winner;
                SafeTransferLib.safeTransfer(TOKEN, recipient, amountLeft);
                emit RewardDistributed(recipient, 4, amountLeft);
            }
        }
    }

    function getWinners() external view returns (address[5] memory) {
        return winners;
    }
}
