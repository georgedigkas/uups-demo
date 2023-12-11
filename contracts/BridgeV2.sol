// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Bridge.sol";
import "./interfaces/IBridgeV2.sol";

contract BridgeV2 is Bridge, IBridgeV2 {
    // Define an event to emit when a validator is removed
    event ValidatorRemoved(address validator);

    // Define a function to remove a validator by address
    function removeValidator(address _pk) external {
        // Check if the address is a valid validator
        require(
            validators[_pk].validatorAddress != address(0),
            "Not a validator."
        );

        // Delete the validator from the mapping
        delete validators[_pk];

        // Emit an event
        emit ValidatorRemoved(_pk);
    }

    function getVersion() external pure override returns (uint256) {
        return 2;
    }
}
