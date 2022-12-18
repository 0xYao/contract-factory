// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

contract ExampleContractImpl {
    uint256 public a;
    uint256 public b;

    constructor(uint256 _a, uint256 _b) {
        a = _a;
        b = _b;
    }

    function add() external view returns (uint256) {
        return a + b;
    }
}
