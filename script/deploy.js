require("dotenv").config();
const { z } = require("zod");
const { exec, logExecOutput } = require("./utils");

const RpcConfig = z.object({
  networkName: z.string(),
  apiKey: z.string(),
  rpcUrl: z.string(),
});

const Config = z.object({
  deployerPrivateKey: z.string(),
  contractPath: z.string({
    required_error: "e.g. src/tokens/MyTokenContract.sol",
  }),
  contractName: z.string({
    required_error: "e.g. MyTokenContract",
  }),
  constructorArgs: z.string().optional(),
  rpc: RpcConfig.array().min(1),
});

const rpcConfigs = [
  // Ethereum
  {
    networkName: "Ethereum Mainnet",
    apiKey: process.env.ETHERSCAN_API_KEY,
    rpcUrl: process.env.MAINNET_RPC_URL,
  },
  {
    networkName: "Ethereum Goerli",
    apiKey: process.env.ETHERSCAN_API_KEY,
    rpcUrl: process.env.ETH_GOERLI_RPC_URL,
  },
  // Polygon
  {
    networkName: "Polygon Mainnet",
    apiKey: process.env.POLYGONSCAN_API_KEY,
    rpcUrl: process.env.POLYGON_MAINNET_RPC_URL,
  },
  {
    networkName: "Polygon Mumbai",
    apiKey: process.env.POLYGONSCAN_API_KEY,
    rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL,
  },
  // Arbitrum
  {
    networkName: "Arbitrum One",
    apiKey: process.env.ARBISCAN_API_KEY,
    rpcUrl: process.env.ARBI_ONE_RPC_URL,
  },
  {
    networkName: "Arbitrum Goerli",
    apiKey: process.env.ARBISCAN_API_KEY,
    rpcUrl: process.env.ARBI_GOERLI_RPC_URL,
  },
].filter((v) => v.apiKey && v.rpcUrl);

const config = Config.parse({
  deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY,
  contractPath: process.env.CONTRACT_PATH,
  contractName: process.env.CONTRACT_NAME,
  constructorArgs: process.env.CONSTRUCTOR_ARGS,
  rpc: rpcConfigs,
});

const main = async () => {
  const buildOutput = await exec("forge build --extra-output-files abi");
  logExecOutput(buildOutput);

  // Use the legacy flag because sometimes there might be an error pinging the gas station for EIP-1155 fees
  const staticFlags = "--retries 10 --delay 10 --verify --legacy";
  const constructorArgs = config.constructorArgs
    ? `--constructor-args ${config.constructorArgs}`
    : "";

  for (const conf of config.rpc) {
    console.log(`Deploying to ${conf.networkName}...`);

    const deployOutput = await exec(
      `forge create --rpc-url ${conf.rpcUrl} --private-key ${config.deployerPrivateKey} ${config.contractPath}:${config.contractName} --etherscan-api-key ${conf.apiKey} ${constructorArgs} ${staticFlags}`
    );

    logExecOutput(deployOutput);
  }
};

main().catch(console.error);
