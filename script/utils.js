require("dotenv").config();

const fs = require("fs");
const toml = require("toml");
const utils = require("util");
const exec = utils.promisify(require("child_process").exec);

const foundryConfig = fs.readFileSync("./foundry.toml");

const data = toml.parse(foundryConfig);
const supportedNetworks = Object.keys(data.rpc_endpoints).map((network) => {
  const keyName = data.etherscan[network].key.slice(2, -1);
  return { network, apiKey: process.env[keyName] };
});

const logExecOutput = (output) => {
  if (output.stdout) {
    console.log(output.stdout);
  }

  if (output.stderr) {
    console.log(output.stderr);
  }
};

const verifyContract = async ({
  networkName,
  apiKey,
  buildOutput,
  contractPath,
  contractName,
  contractAddress,
  constructorArgs,
}) => {
  const numOfOptimizations = buildOutput.metadata.settings.optimizer.runs;
  const compilerVersion = "v" + buildOutput.metadata.compiler.version;

  // e.g. $(cast abi-encode "constructor(string)" ${process.env.ARG1}) or ethers.utils.defaultAbiCoder.encode([string], [arg1])
  constructorArgs = constructorArgs ? `--constructor-args ${constructorArgs}` : "";

  const cmd = `forge verify-contract --chain-id ${networkName} --num-of-optimizations ${numOfOptimizations} --watch ${constructorArgs} --compiler-version ${compilerVersion} ${contractAddress} ${contractPath}:${contractName} ${apiKey}`;
  console.log("Running the following command...");
  console.log(cmd);
  const result = await exec(cmd);

  logExecOutput(result);
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 *
 * @param min default to 0
 * @param max default to 2 ** 64
 */
function getRandomInt(min = 0, max = 2 ** 64) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  exec,
  logExecOutput,
  verifyContract,
  getRandomInt,
  supportedNetworks,
};
