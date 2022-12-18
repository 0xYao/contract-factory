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
