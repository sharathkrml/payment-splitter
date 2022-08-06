import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployArgs } from "../helper-hardhat-config";
const deploySplitter = async (hre: HardhatRuntimeEnvironment) => {
  const {
    deployments: { deploy, log },
    getNamedAccounts,
  } = hre;
  const { deployer } = await getNamedAccounts();
  let argObj = await deployArgs(network.config.chainId || 31337);
  console.log(argObj);
  await deploy("Splitter", {
    from: deployer,
    log: true,
    args: [
      [
        argObj?.developer.address,
        argObj?.artist.address,
        argObj?.founder.address,
      ],
      [argObj?.developer.share, argObj?.artist.share, argObj?.founder.share],
    ],
  });
};
export default deploySplitter;
