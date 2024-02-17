import { DeployFunction } from "hardhat-deploy/types";

const name = "MetisToken";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy(name, {
    from: deployer,
    args: [],
    waitConfirmations: 1,
    log: true,
  });
};

func.tags = [name];

export default func;
