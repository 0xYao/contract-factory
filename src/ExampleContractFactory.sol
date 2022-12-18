// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "./ExampleContractImpl.sol";
import "./utils/Create2.sol";

contract ExampleContractFactory {
    event ExampleContractCreated(
        address _createdAddress,
        uint256 _a,
        uint256 _b
    );

    function createExampleContract(
        uint256 _a,
        uint256 _b,
        bytes32 _salt
    ) external returns (ExampleContractImpl) {
        ExampleContractImpl exampleContract = new ExampleContractImpl{
            salt: _salt
        }(_a, _b);

        emit ExampleContractCreated(address(exampleContract), _a, _b);
        return exampleContract;
    }

    function exampleContractCreationCode() public pure returns (bytes memory) {
        return type(ExampleContractImpl).creationCode;
    }

    function getExampleContractPredeterministicAddress(
        uint256 _a,
        uint256 _b,
        bytes32 _salt
    ) external view returns (address) {
        bytes32 deploymentData = keccak256(
            abi.encodePacked(exampleContractCreationCode(), abi.encode(_a, _b))
        );

        return Create2.computeAddress(_salt, deploymentData);
    }
}
