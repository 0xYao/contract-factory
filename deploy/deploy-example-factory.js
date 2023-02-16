const fs = require("fs");
const path = require("path");
const { exec, getRandomInt, supportedNetworks } = require("../script/utils");

const saveContract = ({ networkName, contractName, contractAddress }) => {
  const filePath = path.join("deployments", `${networkName}.json`);
  const fileExists = fs.existsSync(filePath);

  const existing = fileExists ? JSON.parse(fs.readFileSync(filePath)) : {};
  const result = { ...existing, [contractName]: contractAddress };

  console.log(`Saving the contract address to ${filePath}`);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2) + "\n");
};

const deployWithCREATE3 = async ({ networkName, deploymentSalt, scriptName, contractName }) => {
  console.log({ msg: "Deploying the contract with CREATE3", networkName, deploymentSalt });
  process.env.DEPLOYMENT_SALT = deploymentSalt;

  const cmd = `forge script ${scriptName} -f ${networkName} -vvvv --json --broadcast --verify --skip-simulation`;
  const res = await exec(cmd);
  const deployedAddress = JSON.parse(res.stdout.split("\n")[1]).returns.deployed.value;

  console.log(`Successfully deployed the contract to ${deployedAddress}`);

  saveContract({
    networkName,
    contractName: contractName,
    contractAddress: deployedAddress,
  });

  // @todo verify the contract after deployment
};

function intToBytes32(n) {
  return "0x" + parseInt(n).toString(16).padStart(64, "0");
}

const main = async () => {
  const deploymentNum = getRandomInt();
  const deploymentSalt = intToBytes32(deploymentNum);

  await Promise.all(
    supportedNetworks.map(async (data) => {
      try {
        await deployWithCREATE3({
          networkName: data.network,
          deploymentSalt: deploymentSalt,
          scriptName: "script/DeployWithCREATE3.s.sol",
          contractName: "ExampleContractFactory",
        });
      } catch (err) {
        console.error({ msg: `Failed to deployed to ${data.network}`, err });
      }
    })
  );
};

main().catch(console.error);
