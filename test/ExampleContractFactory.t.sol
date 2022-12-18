// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "forge-std/Test.sol";
import "../src/ExampleContractFactory.sol";

contract ExampleContractFactoryTest is Test {
    ExampleContractFactory exampleContractFactory;

    function setUp() public {
        exampleContractFactory = new ExampleContractFactory();
    }

    // Fuzz the initialization variables
    function testDeterministicDeploy(
        uint256 _a,
        uint256 _b,
        bytes32 _salt
    ) public {
        address exampleContractPredeterministicAddress = exampleContractFactory
            .getExampleContractPredeterministicAddress(_a, _b, _salt);

        ExampleContractImpl exampleContract = exampleContractFactory
            .createExampleContract(_a, _b, _salt);

        assertEq(
            address(exampleContract),
            exampleContractPredeterministicAddress
        );
    }
}
