const {
  supportedNetworks,
  exec,
  intToBytes32,
  getRandomInt,
  logExecOutput,
} = require("../script/utils");

const main = async () => {
  process.env.DEPLOYMENT_SALT = intToBytes32(getRandomInt());

  await Promise.all(
    supportedNetworks.map(async (data) => {
      const deploymentsJson = require(`../deployments/${data.network}.json`);

      if (!deploymentsJson.CREATE3Factory.startsWith("0x")) {
        throw new Error(`CREATE3Factory address not found on ${data.network}`);
      }

      process.env.CREATE3_FACTORY_ADDRESS = deploymentsJson.CREATE3Factory;
      logExecOutput(await exec(`./deploy/deploy-example-factory.sh ${data.network}`));
    })
  );
};

main().catch(console.log);
