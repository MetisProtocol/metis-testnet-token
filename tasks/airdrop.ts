import { task, types } from "hardhat/config";

task("airdrop", "disperse tokens")
  .addParam("amount", "Amount in Ether", undefined, types.float)
  .addParam("address", "Address separated by commas", undefined, types.string)
  .setAction(async (args, hre) => {
    const amount = hre.ethers.parseEther(args["amount"]);

    const items = (args["address"] as string)
      .split(",")
      .filter((v) => hre.ethers.isAddress(v));

    const { address } = await hre.deployments.get("MetisToken");
    const erc20 = await hre.ethers.getContractAt("MetisToken", address);

    console.log("Amount", hre.ethers.formatEther(amount));
    console.log("Address", ...items);

    const tx = await erc20.airdrop(items, amount);
    const rec = await tx.wait(1);
    console.log("confirmed at", rec?.blockNumber);
  });
