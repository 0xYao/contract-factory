const { verifyContract, supportedNetworks } = require("./utils");
const create3FactoryBuildOutput = require("../out/src/CREATE3Factory.sol/CREATE3Factory.json");

const verifyCreate3 = async (networkName, apiKey) => {
  const contractAddressJson = require(`../deployments/${networkName}.json`);
  const create3FactoryAddress = contractAddressJson.CREATE3Factory;

  const contractPath = "src/Create3Factory.sol";
  const contractName = "CREATE3Factory";

  await verifyContract({
    networkName,
    apiKey,
    buildOutput: create3FactoryBuildOutput,
    contractPath,
    contractName,
    contractAddress: create3FactoryAddress,
  });
};

const main = async () => {
  return Promise.all(
    supportedNetworks.map(async (data) => {
      await verifyCreate3(data.network, data.apiKey);
    })
  );
};

main().catch(console.error);
