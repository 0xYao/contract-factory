const { verifyContract, supportedNetworks } = require("./utils");
const buildOutput = require("../out/ExampleContractFactory.sol/ExampleContractFactory.json");

const verifyCreate3 = async (networkName, apiKey) => {
  const contractAddressJson = require(`../deployments/${networkName}.json`);
  const contractAddress = contractAddressJson.ExampleContractFactory;

  const contractPath = "src/ExampleContractFactory.sol";
  const contractName = "ExampleContractFactory";

  await verifyContract({
    networkName,
    apiKey,
    buildOutput: buildOutput,
    contractPath,
    contractName,
    contractAddress: contractAddress,
  });
};

const main = async () => {
  return Promise.all(
    supportedNetworks.map(async (data) => {
      try {
        await verifyCreate3(data.network, data.apiKey);
      } catch (err) {
        console.error({
          msg: `Failed to verify the wallet factory contract on ${data.network}`,
          err,
        });
      }
    })
  );
};

main().catch(console.error);
