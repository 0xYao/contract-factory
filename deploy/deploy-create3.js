// Deploy the CREATE3 factory across every available chain
const { exec, logExecOutput, supportedNetworks } = require("../script/utils");

const main = async () => {
  return Promise.all(
    supportedNetworks.map(async (data) => {
      const result = await exec(`./deploy/deploy.sh ${data.network}`);
      logExecOutput(result);
    })
  );
};

main().catch(console.error);
