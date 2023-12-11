// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// add increment() (a buggy one)
interface IBridgeV2 {
    // Define a function to remove a validator by address
    function removeValidator(address _pk) external;

    function getVersion() external pure returns (uint256);
}
