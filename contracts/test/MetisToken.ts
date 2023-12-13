import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MetisToken", function () {
  async function metisTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const initialSupply = 100;

    const MetisToken = await ethers.getContractFactory("MetisToken");
    const token = await MetisToken.deploy(initialSupply);

    return { token, owner, initialSupply, otherAccount };
  }

  describe("Deployment", function () {
    it("Should mint the right initialSupply to owner", async function () {
      const { token, initialSupply, owner } = await loadFixture(
        metisTokenFixture
      );

      expect(await token.balanceOf(owner)).to.equal(initialSupply);
    });

    it("Owner should be miner by default", async function () {
      const { owner, token } = await loadFixture(metisTokenFixture);
      expect(await token.isMiner(owner)).to.be.true;
    });
  });

  describe("Miner", function () {
    it("addMiner and removeMiner", async function () {
      const { token, otherAccount } = await loadFixture(metisTokenFixture);
      expect(await token.isMiner(otherAccount)).to.be.false;
      expect(await token.addMiner([otherAccount]));
      expect(await token.isMiner(otherAccount)).to.be.true;
      expect(await token.removeMiner([otherAccount]));
      expect(await token.isMiner(otherAccount)).to.be.false;

      await expect(token.connect(otherAccount).addMiner([otherAccount]))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
      await expect(token.connect(otherAccount).removeMiner([otherAccount]))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });

    it("mint", async function () {
      const { token, otherAccount } = await loadFixture(metisTokenFixture);
      const amount = 100;
      expect(await token.mint(otherAccount, amount));
      expect(await token.balanceOf(otherAccount)).to.be.eq(amount);
      await expect(
        token.connect(otherAccount).mint(otherAccount, amount)
      ).to.be.revertedWith("403");
    });
  });
});
