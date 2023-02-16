// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {ICREATE3Factory} from "../src/CREATE3Factory.sol";

contract DeployWithCREATE3Script is Script {
    function run() public returns (address deployed) {
        uint256 deployerPrivateKey = uint256(
            vm.envBytes32("DEPLOYER_PRIVATE_KEY")
        );
        address create3FactoryAddress = vm.envAddress(
            "CREATE3_FACTORY_ADDRESS"
        );

        bytes32 deploymentSalt = vm.envBytes32("DEPLOYMENT_SALT");

        vm.startBroadcast(deployerPrivateKey);

        bytes memory creationCode = abi.encodePacked(
            vm.getCode("ExampleContractFactory.sol:ExampleContractFactory")
        );

        deployed = ICREATE3Factory(create3FactoryAddress).deploy(
            deploymentSalt,
            creationCode
        );

        vm.stopBroadcast();
    }
}
