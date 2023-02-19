# Contract factory template

This repository provides a simple Foundry template to deploy a single contract factory across multiple EVM chains, and we can use the contract factory to deploy other contracts at a pre-deterministic address. A good example use case is the smart wallet. We can deploy the wallet factory at the same address across every chain and that allows us to create a wallet at the same address across those chains.

## Usage

1. Setup and fill in the missing environment variables: `cp .env.example .env`
1. Make sure the deployer has enough funds to deploy the contract at the specific chains. Ideally, the deployer should be fresh wallet so it has the same nonce across every chain that we want to deploy to.
1. Install the node dependencies: `npm i`
1. Deploy the contract factory: `node script/deploy`
1. Go to the blockchain explorer and create a example contract using the factory. You should see the contracts created at the same address on multiple chains.

## Testing

- `forge test -vvv`

# CREATE3 factory

The deployment script above has a problem where if we want to deploy the factory contract to the same address, we have to make sure the deployer has the same nonce across every chain. It can cause headaches if you accidentally sent a transaction on one chain because you have to keep the nonce in sync on other chains.

Zefram's CREATE3 factory solves this issue:

> the address of the deployed contract is determined by only the deployer address and the salt. This makes it far easier to deploy contracts to multiple chains at the same addresses.

Read more about it on [Zefram's repository](https://github.com/ZeframLou/create3-factory). In my repository, I have added support for deploying to testnets, verifying the contract factory, and show you usage of how we can deploy other contracts using CREATE3.

`CREATE3Factory` has been deployed to `0x49600457B3610198f015568Db6CEfAA277496cbE` on the following testnets

- Arbitrum Goerli
- Goerli
- Optimism Goerli
- Polygon Mumbai

For example, I will deploy the CREATE3 contract on different chains first (I still have make sure the deployer nonce is in sync in this case) and I will deploy the `ExampleContractFactory` using the CREATE3 factory.

## Setup

- Follow the "Usage" steps above to setup for the repository

## Deploy the CREATE3 factory


```bash
# 1. Deploy the CREATE3 factory on every chain
node deploy/deploy-create3

# 2. Add the deployed CREATE3 factory address from Arbitrum Goerli to the CREATE3Factory field of deployments/arbitrum-goerli.json

# 3. Verify the CREATE3 factory on every chain
node script/verify-create3
```

## Deploy a contract using the CREATE3 factory

```bash
# 1. Deploy the ExampleFactory contract on every chain using the CREATE3 factory that we just deployed
node deploy/deploy-example-factory

# 2. Add the example wallet factory address from Arbitrum Goerli to the ExampleContractFactory field of deployments/arbitrum-goerli.json

# 3. Verify the ExampleFactory contract on every chain
node script/verify-example-factory
```
